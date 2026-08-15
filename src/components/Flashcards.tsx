import { IconArrowLeft, IconArrowRight, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from './starwind-react/button';
import { Card, CardContent, CardFooter } from './starwind-react/card';
import type { VocabularyItem } from '../lib/types';

interface Props {
  items: VocabularyItem[];
}

export default function Flashcards({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const item = items[index];

  const move = (direction: number) => {
    setIndex((current) => (current + direction + items.length) % items.length);
    setFlipped(false);
  };

  return (
    <Card className="overflow-hidden border-border/80 bg-card shadow-sm">
      <CardContent className="p-0">
        <button
          type="button"
          className="relative grid min-h-72 w-full place-items-center p-7 text-center transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-outline"
          aria-label={`${item.term} 카드 ${flipped ? '앞면 보기' : '뜻 보기'}`}
          onClick={() => setFlipped((current) => !current)}
        >
          <span className="absolute right-4 top-4 rounded-full bg-background/70 px-2.5 py-1 text-xs font-bold text-muted-foreground">
            {index + 1} / {items.length}
          </span>
          {!flipped ? (
            <span className="grid gap-2">
              <strong className="font-serif text-5xl font-medium" lang="ja">{item.term}</strong>
              <span className="text-sm text-muted-foreground" lang="ja">{item.reading}</span>
              <small className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <IconRefresh className="size-4" aria-hidden="true" /> 눌러서 뜻 보기
              </small>
            </span>
          ) : (
            <span className="grid max-w-sm gap-3">
              <strong className="text-2xl">{item.meaning}</strong>
              {item.note && <span className="text-sm text-muted-foreground">{item.note}</span>}
              <small className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <IconRefresh className="size-4" aria-hidden="true" /> 눌러서 단어 보기
              </small>
            </span>
          )}
        </button>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/70 p-3">
        <Button variant="outline" onClick={() => move(-1)}>
          <IconArrowLeft className="size-4" aria-hidden="true" /> 이전
        </Button>
        <Button variant="outline" onClick={() => move(1)}>
          다음 <IconArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
