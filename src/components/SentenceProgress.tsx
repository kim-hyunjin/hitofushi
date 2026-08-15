import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { Toggle } from './starwind-react/toggle';
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
    <Toggle
      variant={completed ? 'default' : 'outline'}
      size="sm"
      className={completed
        ? "rounded-full border-secondary bg-[color-mix(in_srgb,var(--success)_22%,var(--card))] px-[0.55rem] py-[0.35rem] text-xs font-bold text-foreground"
        : "rounded-full border-border bg-transparent px-[0.55rem] py-[0.35rem] text-xs font-bold text-muted-foreground"}
      pressed={completed}
      onPressedChange={toggle}
    >
      {completed ? <IconCircleCheckFilled className="size-4" aria-hidden="true" /> : <IconCircle className="size-4" aria-hidden="true" />}
      {completed ? '학습 완료' : '이 문장 익혔어요'}
    </Toggle>
  );
}
