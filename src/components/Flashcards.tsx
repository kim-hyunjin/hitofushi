import { useState } from 'preact/hooks';
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
    <div class="flashcard-wrap">
      <button
        type="button"
        class={flipped ? 'flashcard is-flipped' : 'flashcard'}
        aria-label={`${item.term} 카드 ${flipped ? '앞면 보기' : '뜻 보기'}`}
        onClick={() => setFlipped((current) => !current)}
      >
        <span class="flashcard-count">{index + 1} / {items.length}</span>
        {!flipped ? (
          <span class="flashcard-face">
            <strong lang="ja">{item.term}</strong>
            <span lang="ja">{item.reading}</span>
            <small>눌러서 뜻 보기</small>
          </span>
        ) : (
          <span class="flashcard-face">
            <strong>{item.meaning}</strong>
            {item.note && <span>{item.note}</span>}
            <small>눌러서 단어 보기</small>
          </span>
        )}
      </button>
      <div class="flashcard-actions">
        <button type="button" onClick={() => move(-1)}>← 이전</button>
        <button type="button" onClick={() => move(1)}>다음 →</button>
      </div>
    </div>
  );
}
