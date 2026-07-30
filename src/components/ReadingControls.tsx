import { useEffect, useState } from 'preact/hooks';
import {
  defaultProgress,
  loadProgress,
  PROGRESS_EVENT,
  updateProgress,
} from '../lib/progress';
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
  const [mode, setMode] = useState<ReadingMode>(defaultProgress.readingMode);
  const [showTranslations, setShowTranslations] = useState(
    defaultProgress.showTranslations,
  );

  useEffect(() => {
    const refresh = () => {
      const saved = loadProgress();
      setMode(saved.readingMode);
      setShowTranslations(saved.showTranslations);
      applyDisplay(saved.readingMode, saved.showTranslations);
    };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, []);

  const chooseMode = (nextMode: ReadingMode) => {
    setMode(nextMode);
    applyDisplay(nextMode, showTranslations);
    updateProgress((current) => ({ ...current, readingMode: nextMode }));
  };

  const toggleTranslations = () => {
    const next = !showTranslations;
    setShowTranslations(next);
    applyDisplay(mode, next);
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
