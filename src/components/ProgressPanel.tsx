import { useProgress } from '../hooks/useProgress';
import { percent } from '../lib/learningSummary';
import styles from './ProgressPanel.module.css';

interface Props {
  lessonId: string;
  sentenceIds: string[];
}

export default function ProgressPanel({ lessonId, sentenceIds }: Props) {
  const { progress } = useProgress();
  const completedIds = new Set(progress.completedSentences);
  const completed = sentenceIds.filter((id) => completedIds.has(id)).length;
  const completionPercent = percent(completed, sentenceIds.length);

  return (
    <aside class={styles.panel} aria-labelledby="progress-title">
      <div>
        <p class="eyebrow">내 진도</p>
        <h2 id="progress-title">{completionPercent}% 완료</h2>
        <p>문장 {sentenceIds.length}개 중 {completed}개 · 최고 퀴즈 {progress.quizScores[lessonId] ?? 0}점</p>
      </div>
      <div class={styles.progressTrack} aria-label={`문장 학습 진도 ${completionPercent}%`}>
        <span style={{ width: `${completionPercent}%` }} />
      </div>
      <p class={styles.storageNote}>이 기기의 브라우저에만 저장됩니다.</p>
    </aside>
  );
}
