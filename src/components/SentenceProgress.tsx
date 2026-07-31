import { useProgress } from '../hooks/useProgress';
import { updateProgress } from '../lib/progress';

interface Props {
  sentenceId: string;
}

export default function SentenceProgress({ sentenceId }: Props) {
  const { progress } = useProgress();
  const completed = progress.completedSentences.includes(sentenceId);

  const toggle = () => {
    const next = !completed;
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
