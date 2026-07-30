import { useEffect, useState } from 'preact/hooks';
import {
  defaultProgress,
  loadProgress,
  PROGRESS_EVENT,
  type ProgressState,
} from '../lib/progress';
import styles from './ProgressPanel.module.css';

interface Props {
  lessonId: string;
  sentenceCount: number;
}

export default function ProgressPanel({ lessonId, sentenceCount }: Props) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, []);

  const completed = progress.completedSentences.filter((id) =>
    id.startsWith(`${lessonId}-`),
  ).length;
  const percent = Math.round((completed / sentenceCount) * 100);

  return (
    <aside class={styles.panel} aria-labelledby="progress-title">
      <div>
        <p class="eyebrow">내 진도</p>
        <h2 id="progress-title">{percent}% 완료</h2>
        <p>문장 {sentenceCount}개 중 {completed}개 · 최고 퀴즈 {progress.quizScores[lessonId] ?? 0}점</p>
      </div>
      <div class={styles.progressTrack} aria-label={`문장 학습 진도 ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p class={styles.storageNote}>이 기기의 브라우저에만 저장됩니다.</p>
    </aside>
  );
}
