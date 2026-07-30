import { useEffect, useState } from 'preact/hooks';
import { loadProgress, PROGRESS_EVENT, updateProgress } from '../lib/progress';

interface Props {
  sentenceId: string;
}

export default function SentenceProgress({ sentenceId }: Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setCompleted(loadProgress().completedSentences.includes(sentenceId));
    };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, [sentenceId]);

  const toggle = () => {
    const next = !completed;
    setCompleted(next);
    updateProgress((current) => ({
      ...current,
      completedSentences: next
        ? [...new Set([...current.completedSentences, sentenceId])]
        : current.completedSentences.filter((id) => id !== sentenceId),
    }));
  };

  return (
    <button
      type="button"
      class={completed ? 'sentence-check is-complete' : 'sentence-check'}
      aria-pressed={completed}
      onClick={toggle}
    >
      <span aria-hidden="true">{completed ? '✓' : '○'}</span>
      {completed ? '학습 완료' : '이 문장 익혔어요'}
    </button>
  );
}
