import type { ReadingMode } from './types';

export const STORAGE_KEY = 'jpop-japanese-progress';
export const PROGRESS_EVENT = 'jpop-progress-change';

export interface ProgressState {
  version: 1;
  completedSentences: string[];
  quizScores: Record<string, number>;
  lyricsReview: Record<string, string[]>;
  favoriteVocabulary: string[];
  readingMode: ReadingMode;
  showTranslations: boolean;
}

export const defaultProgress: ProgressState = {
  version: 1,
  completedSentences: [],
  quizScores: {},
  lyricsReview: {},
  favoriteVocabulary: [],
  readingMode: 'beginner',
  showTranslations: true,
};

function isReadingMode(value: unknown): value is ReadingMode {
  return value === 'beginner' || value === 'elementary' || value === 'reading';
}

export function normalizeProgress(value: unknown): ProgressState {
  if (!value || typeof value !== 'object') return { ...defaultProgress };

  const candidate = value as Partial<ProgressState>;
  return {
    version: 1,
    completedSentences: Array.isArray(candidate.completedSentences)
      ? candidate.completedSentences.filter((item): item is string => typeof item === 'string')
      : [],
    quizScores:
      candidate.quizScores && typeof candidate.quizScores === 'object'
        ? Object.fromEntries(
            Object.entries(candidate.quizScores).filter(
              ([key, score]) => typeof key === 'string' && typeof score === 'number',
            ),
          )
        : {},
    lyricsReview:
      candidate.lyricsReview && typeof candidate.lyricsReview === 'object'
        ? Object.fromEntries(
            Object.entries(candidate.lyricsReview)
              .filter(([songSlug, sentenceIds]) =>
                typeof songSlug === 'string' && Array.isArray(sentenceIds),
              )
              .map(([songSlug, sentenceIds]) => [
                songSlug,
                [...new Set(
                  (sentenceIds as unknown[]).filter(
                    (item): item is string => typeof item === 'string',
                  ),
                )],
              ]),
          )
        : {},
    favoriteVocabulary: Array.isArray(candidate.favoriteVocabulary)
      ? candidate.favoriteVocabulary.filter((item): item is string => typeof item === 'string')
      : [],
    readingMode: isReadingMode(candidate.readingMode)
      ? candidate.readingMode
      : defaultProgress.readingMode,
    showTranslations:
      typeof candidate.showTranslations === 'boolean'
        ? candidate.showTranslations
        : defaultProgress.showTranslations,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return { ...defaultProgress };

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeProgress(JSON.parse(saved)) : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(next: ProgressState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: next }));
    return true;
  } catch {
    return false;
  }
}

export function updateProgress(
  updater: (current: ProgressState) => ProgressState,
): ProgressState {
  const next = normalizeProgress(updater(loadProgress()));
  if (!saveProgress(next)) {
    return loadProgress();
  }
  return next;
}
