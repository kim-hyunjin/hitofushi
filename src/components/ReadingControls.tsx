import { useEffect } from 'preact/hooks';
import { useProgress } from '../hooks/useProgress';
import { updateProgress } from '../lib/progress';
import type { ReadingMode } from '../lib/types';
import styles from './ReadingControls.module.css';

const modes: { id: ReadingMode; label: string; hint: string }[] = [
  { id: 'beginner', label: '입문', hint: '모든 읽기 도움 표시' },
  { id: 'elementary', label: '초급', hint: '후리가나와 번역 표시' },
  { id: 'reading', label: '읽기', hint: '원문에 집중' },
];

function applyDisplay(mode: ReadingMode, showTranslations: boolean) {
  document.documentElement.dataset.readingMode = mode;
  document.documentElement.dataset.showTranslations = String(showTranslations);
}

export default function ReadingControls() {
  const { progress } = useProgress();
  const { readingMode: mode, showTranslations } = progress;

  useEffect(() => {
    applyDisplay(mode, showTranslations);
  }, [mode, showTranslations]);

  const chooseMode = (nextMode: ReadingMode) => {
    updateProgress((current) => ({ ...current, readingMode: nextMode }));
  };

  const toggleTranslations = () => {
    const next = !showTranslations;
    updateProgress((current) => ({ ...current, showTranslations: next }));
  };

  return (
    <section class={styles.readingControls} aria-labelledby="reading-mode-title">
      <div>
        <p class="eyebrow">읽기 설정</p>
        <h2 id="reading-mode-title">지금의 나에게 맞춰 보기</h2>
      </div>
      <div class={styles.modeOptions} role="group" aria-label="읽기 모드">
        {modes.map((item) => (
          <button
            type="button"
            class={`${styles.modeButton} ${mode === item.id ? styles.active : ''}`}
            aria-pressed={mode === item.id}
            onClick={() => chooseMode(item.id)}
            title={item.hint}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label class={styles.translationToggle}>
        <input
          type="checkbox"
          checked={showTranslations}
          onChange={toggleTranslations}
        />
        <span>번역 표시</span>
      </label>
    </section>
  );
}
