import { useEffect, useRef, useState } from 'preact/hooks';
import {
  defaultProgress,
  loadProgress,
  normalizeProgress,
  PROGRESS_EVENT,
  saveProgress,
  type ProgressState,
} from '../lib/progress';
import styles from './ProgressPanel.module.css';

interface Props {
  lessonId: string;
  sentenceCount: number;
}

export default function ProgressPanel({ lessonId, sentenceCount }: Props) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const fileInput = useRef<HTMLInputElement>(null);

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
      window.alert('진도 파일을 읽지 못했습니다. 내보낸 JSON 파일인지 확인해 주세요.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

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
      <div class={styles.actions}>
        <button type="button" onClick={exportProgress}>진도 내보내기</button>
        <button type="button" onClick={() => fileInput.current?.click()}>
          진도 가져오기
        </button>
        <input
          ref={fileInput}
          class={styles.visuallyHidden}
          type="file"
          accept="application/json,.json"
          onChange={(event) => importProgress(event.currentTarget.files?.[0])}
        />
      </div>
      <p class={styles.storageNote}>이 기기의 브라우저에만 저장됩니다.</p>
    </aside>
  );
}
