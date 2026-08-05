import { useRef, useState } from 'preact/hooks';
import { useProgress } from '../hooks/useProgress';
import {
  saveProgress,
  updateProgress,
} from '../lib/progress';
import {
  deriveLearningSummary,
  isLearningProgressReset,
  type LearningLessonSummary,
} from '../lib/learningSummary';
import { downloadProgress, parseProgress } from '../lib/progressTransfer';
import {
  FavoriteVocabularySection,
  LearningSummarySection,
  LessonProgressSection,
} from './LearningDashboardSections';
import styles from './LearningDashboard.module.css';

export type { LearningLessonSummary } from '../lib/learningSummary';

interface Props {
  lessons: LearningLessonSummary[];
}

export default function LearningDashboard({ lessons }: Props) {
  const { progress, ready } = useProgress();
  const [resetMessage, setResetMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  if (!ready) {
    return <p class={styles.loading}>이 브라우저의 학습 기록을 불러오는 중이에요.</p>;
  }

  const summary = deriveLearningSummary(lessons, progress);

  const exportProgress = () => {
    downloadProgress(progress);
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const next = parseProgress(await file.text());
      if (!saveProgress(next)) {
        throw new Error('Progress storage is unavailable');
      }
    } catch {
      window.alert('진도 파일을 읽지 못했습니다. HitoFushi에서 내보낸 JSON 파일인지 확인해 주세요.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const resetLearningProgress = () => {
    const confirmed = window.confirm(
      '익힌 문장, 퀴즈 점수, 가사 최종 점검과 즐겨찾기를 모두 초기화할까요? 읽기 설정은 유지됩니다.',
    );
    if (!confirmed) return;

    const next = updateProgress((current) => ({
      ...current,
      completedSentences: [],
      quizScores: {},
      lyricsReview: {},
      favoriteVocabulary: [],
    }));
    setResetMessage(
      isLearningProgressReset(next)
        ? '학습 현황을 초기화했습니다.'
        : '학습 현황을 초기화하지 못했습니다.',
    );
  };

  return (
    <div class={styles.dashboard}>
      <LearningSummarySection summary={summary} lessonCount={lessons.length} />

      <section class={styles.transferPanel} aria-labelledby="progress-transfer-title">
        <div>
          <p class="eyebrow">학습 기록 관리</p>
          <h2 id="progress-transfer-title">전체 진도 옮기기</h2>
          <p>
            익힌 문장, 퀴즈 최고 점수, 가사 최종 점검, 즐겨찾기 어휘와 읽기 설정을 JSON 파일로
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

      <LessonProgressSection lessons={lessons} progress={progress} />
      <FavoriteVocabularySection items={summary.favoriteVocabulary} />
    </div>
  );
}
