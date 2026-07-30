import { useEffect, useRef, useState } from 'preact/hooks';
import {
  defaultProgress,
  loadProgress,
  normalizeProgress,
  PROGRESS_EVENT,
  saveProgress,
  type ProgressState,
  updateProgress,
} from '../lib/progress';
import JapaneseSpeechButton from './JapaneseSpeechButton';
import styles from './LearningDashboard.module.css';

export interface LearningVocabularySummary {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  lessonTitle: string;
  href: string;
}

export interface LearningLessonSummary {
  id: string;
  songTitle: string;
  lessonNumber: number;
  title: string;
  href: string;
  sentenceIds: string[];
  vocabulary: LearningVocabularySummary[];
}

interface Props {
  lessons: LearningLessonSummary[];
}

export default function LearningDashboard({ lessons }: Props) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => {
      setProgress(loadProgress());
      setReady(true);
    };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, []);

  if (!ready) {
    return <p class={styles.loading}>이 브라우저의 학습 기록을 불러오는 중이에요.</p>;
  }

  const validSentenceIds = new Set(lessons.flatMap((lesson) => lesson.sentenceIds));
  const completedSentenceCount = progress.completedSentences.filter((id) =>
    validSentenceIds.has(id),
  ).length;
  const totalSentenceCount = validSentenceIds.size;
  const overallPercent = totalSentenceCount
    ? Math.round((completedSentenceCount / totalSentenceCount) * 100)
    : 0;

  const vocabularyMap = new Map(
    lessons.flatMap((lesson) =>
      lesson.vocabulary.map((item) => [item.id, item] as const),
    ),
  );
  const favoriteVocabulary = progress.favoriteVocabulary
    .map((id) => vocabularyMap.get(id))
    .filter((item): item is LearningVocabularySummary => Boolean(item));

  const quizScores = lessons
    .map((lesson) => progress.quizScores[lesson.id])
    .filter((score): score is number => typeof score === 'number');
  const averageQuizScore = quizScores.length
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hitofushi-progress.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const next = normalizeProgress(parsed);
      saveProgress(next);
      setProgress(next);
    } catch {
      window.alert('진도 파일을 읽지 못했습니다. HitoFushi에서 내보낸 JSON 파일인지 확인해 주세요.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const resetLearningProgress = () => {
    const confirmed = window.confirm(
      '익힌 문장, 퀴즈 점수와 즐겨찾기를 모두 초기화할까요? 읽기 설정은 유지됩니다.',
    );
    if (!confirmed) return;

    const next = updateProgress((current) => ({
      ...current,
      completedSentences: [],
      quizScores: {},
      favoriteVocabulary: [],
    }));
    setProgress(next);
    setResetMessage('학습 현황을 초기화했습니다.');
  };

  return (
    <div class={styles.dashboard}>
      <section class={styles.summary} aria-labelledby="learning-summary-title">
        <div>
          <p class="eyebrow">전체 학습 현황</p>
          <h2 id="learning-summary-title">{overallPercent}% 완료</h2>
          <p>이 기기의 브라우저에 저장된 기록입니다.</p>
        </div>
        <div class={styles.summaryTrack} aria-label={`전체 문장 학습 진도 ${overallPercent}%`}>
          <span style={{ width: `${overallPercent}%` }} />
        </div>
        <dl class={styles.stats}>
          <div>
            <dt>익힌 문장</dt>
            <dd>{completedSentenceCount}/{totalSentenceCount}</dd>
          </div>
          <div>
            <dt>응시한 퀴즈</dt>
            <dd>{quizScores.length}/{lessons.length}</dd>
          </div>
          <div>
            <dt>평균 최고 점수</dt>
            <dd>{averageQuizScore}점</dd>
          </div>
          <div>
            <dt>즐겨찾기</dt>
            <dd>{favoriteVocabulary.length}개</dd>
          </div>
        </dl>
      </section>

      <section class={styles.transferPanel} aria-labelledby="progress-transfer-title">
        <div>
          <p class="eyebrow">학습 기록 관리</p>
          <h2 id="progress-transfer-title">전체 진도 옮기기</h2>
          <p>
            익힌 문장, 퀴즈 최고 점수, 즐겨찾기 어휘와 읽기 설정을 JSON 파일로
            보관하거나 다른 브라우저로 가져올 수 있습니다.
          </p>
        </div>
        <div class={styles.transferActions}>
          <button type="button" onClick={exportProgress}>전체 진도 내보내기</button>
          <button
            type="button"
            class={styles.secondaryButton}
            onClick={() => fileInput.current?.click()}
          >
            전체 진도 가져오기
          </button>
          <button
            type="button"
            class={styles.resetButton}
            onClick={resetLearningProgress}
          >
            학습 현황 초기화
          </button>
          <input
            ref={fileInput}
            class={styles.visuallyHidden}
            type="file"
            accept="application/json,.json"
            onChange={(event) => importProgress(event.currentTarget.files?.[0])}
          />
          {resetMessage && (
            <p class={styles.resetMessage} role="status" aria-live="polite">
              {resetMessage}
            </p>
          )}
        </div>
      </section>

      <section class={styles.section} aria-labelledby="lesson-progress-title">
        <div class={styles.sectionHeading}>
          <div>
            <p class="eyebrow">단원별 진도</p>
            <h2 id="lesson-progress-title">어디까지 공부했나요?</h2>
          </div>
          <p>학습할 문장을 선택하거나 퀴즈 최고 점수를 확인하세요.</p>
        </div>
        <div class={styles.lessonGrid}>
          {lessons.map((lesson) => {
            const completed = lesson.sentenceIds.filter((id) =>
              progress.completedSentences.includes(id),
            ).length;
            const percent = lesson.sentenceIds.length
              ? Math.round((completed / lesson.sentenceIds.length) * 100)
              : 0;
            const score = progress.quizScores[lesson.id];

            return (
              <article class={styles.lessonCard}>
                <div class={styles.lessonMeta}>
                  <span>
                    {lesson.songTitle} · LESSON {String(lesson.lessonNumber).padStart(2, '0')}
                  </span>
                  <span>{percent}%</span>
                </div>
                <h3>{lesson.title}</h3>
                <p>
                  문장 {completed}/{lesson.sentenceIds.length} · 퀴즈{' '}
                  {typeof score === 'number' ? `${score}점` : '미응시'}
                </p>
                <div class={styles.lessonTrack} aria-label={`${lesson.title} 진도 ${percent}%`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <a href={lesson.href}>
                  {completed ? '이어서 학습하기' : '학습 시작하기'}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section class={styles.section} aria-labelledby="favorites-title">
        <div class={styles.sectionHeading}>
          <div>
            <p class="eyebrow">즐겨찾기 어휘</p>
            <h2 id="favorites-title">다시 보고 싶은 단어</h2>
          </div>
          <p>단원에서 별표를 누른 어휘만 모아 보여 줍니다.</p>
        </div>
        {favoriteVocabulary.length ? (
          <div class={styles.favoriteGrid}>
            {favoriteVocabulary.map((item) => (
              <article class={styles.favoriteCard}>
                <div class={styles.favoriteTerm}>
                  <a href={item.href}>
                    <strong lang="ja">{item.term}</strong>
                    <span lang="ja">{item.reading}</span>
                  </a>
                  <JapaneseSpeechButton
                    sentenceId={`${item.id}-favorite`}
                    text={item.reading}
                    label={`${item.term} 발음`}
                    compact
                  />
                </div>
                <p>{item.meaning}</p>
                <a href={item.href} class={styles.favoriteLesson}>
                  {item.lessonTitle}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div class={styles.emptyState}>
            <span aria-hidden="true">☆</span>
            <div>
              <h3>아직 저장한 단어가 없어요.</h3>
              <p>단원 어휘의 별표를 누르면 이곳에서 다시 볼 수 있습니다.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
