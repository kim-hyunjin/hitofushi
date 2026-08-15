import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Tone = 'default' | 'hero' | 'accent';

interface Props extends ComponentPropsWithoutRef<'p'> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-[var(--accent-dark)]',
  hero: 'text-[var(--yellow)]',
  accent: 'text-accent',
};

export default function Eyebrow({ tone = 'default', className, ...props }: Props) {
  return (
    <p
      className={twMerge(
        'mb-2.5 text-xs font-[850] uppercase',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
