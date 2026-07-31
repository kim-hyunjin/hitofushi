import type { ProgressState } from '../lib/progress';
import {
  percent,
  type LearningLessonSummary,
  type LearningSummary,
  type LearningVocabularySummary,
} from '../lib/learningSummary';
import JapaneseSpeechButton from './JapaneseSpeechButton';
import styles from './LearningDashboard.module.css';

interface SummaryProps {
  summary: LearningSummary;
  lessonCount: number;
}

export function LearningSummarySection({ summary, lessonCount }: SummaryProps) {
  return (
    <section class={styles.summary} aria-labelledby="learning-summary-title">
      <div>
        <p class="eyebrow">전체 학습 현황</p>
        <h2 id="learning-summary-title">{summary.overallPercent}% 완료</h2>
        <p>이 기기의 브라우저에 저장된 기록입니다.</p>
      </div>
      <div
        class={styles.summaryTrack}
        aria-label={`전체 문장 학습 진도 ${summary.overallPercent}%`}
      >
        <span style={{ width: `${summary.overallPercent}%` }} />
      </div>
      <dl class={styles.stats}>
        <div>
          <dt>익힌 문장</dt>
          <dd>{summary.completedSentenceCount}/{summary.totalSentenceCount}</dd>
        </div>
        <div>
          <dt>응시한 퀴즈</dt>
          <dd>{summary.quizScores.length}/{lessonCount}</dd>
        </div>
        <div>
          <dt>평균 최고 점수</dt>
          <dd>{summary.averageQuizScore}점</dd>
        </div>
        <div>
          <dt>즐겨찾기</dt>
          <dd>{summary.favoriteVocabulary.length}개</dd>
        </div>
      </dl>
    </section>
  );
}

interface LessonProgressProps {
  lessons: LearningLessonSummary[];
  progress: ProgressState;
}

export function LessonProgressSection({ lessons, progress }: LessonProgressProps) {
  const completedIds = new Set(progress.completedSentences);

  return (
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
          const completed = lesson.sentenceIds.filter((id) => completedIds.has(id)).length;
          const lessonPercent = percent(completed, lesson.sentenceIds.length);
          const score = progress.quizScores[lesson.id];

          return (
            <article class={styles.lessonCard}>
              <div class={styles.lessonMeta}>
                <span>
                  {lesson.songTitle} · LESSON {String(lesson.lessonNumber).padStart(2, '0')}
                </span>
                <span>{lessonPercent}%</span>
              </div>
              <h3>{lesson.title}</h3>
              <p>
                문장 {completed}/{lesson.sentenceIds.length} · 퀴즈{' '}
                {typeof score === 'number' ? `${score}점` : '미응시'}
              </p>
              <div
                class={styles.lessonTrack}
                aria-label={`${lesson.title} 진도 ${lessonPercent}%`}
              >
                <span style={{ width: `${lessonPercent}%` }} />
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
  );
}

export function FavoriteVocabularySection({
  items,
}: {
  items: LearningVocabularySummary[];
}) {
  return (
    <section class={styles.section} aria-labelledby="favorites-title">
      <div class={styles.sectionHeading}>
        <div>
          <p class="eyebrow">즐겨찾기 어휘</p>
          <h2 id="favorites-title">다시 보고 싶은 단어</h2>
        </div>
        <p>단원에서 별표를 누른 어휘만 모아 보여 줍니다.</p>
      </div>
      {items.length ? (
        <div class={styles.favoriteGrid}>
          {items.map((item) => (
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
  );
}
