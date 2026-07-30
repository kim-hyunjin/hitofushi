import { useState } from 'preact/hooks';
import type { VocabularyItem } from '../lib/types';
import styles from './Flashcards.module.css';

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
    <div class={styles.wrap}>
      <button
        type="button"
        class={`${styles.card} ${flipped ? styles.flipped : ''}`}
        aria-label={`${item.term} 카드 ${flipped ? '앞면 보기' : '뜻 보기'}`}
        onClick={() => setFlipped((current) => !current)}
      >
        <span class={styles.count}>{index + 1} / {items.length}</span>
        {!flipped ? (
          <span class={styles.face}>
            <strong lang="ja">{item.term}</strong>
            <span lang="ja">{item.reading}</span>
            <small>눌러서 뜻 보기</small>
          </span>
        ) : (
          <span class={styles.face}>
            <strong>{item.meaning}</strong>
            {item.note && <span>{item.note}</span>}
            <small>눌러서 단어 보기</small>
          </span>
        )}
      </button>
      <div class={styles.actions}>
        <button type="button" onClick={() => move(-1)}>← 이전</button>
        <button type="button" onClick={() => move(1)}>다음 →</button>
      </div>
    </div>
  );
}
