import { describe, expect, it } from 'vitest';
import { defaultProgress } from './progress';
import { parseProgress, serializeProgress } from './progressTransfer';

describe('progress transfer', () => {
  it('round-trips valid progress', () => {
    const progress = {
      ...defaultProgress,
      completedSentences: ['sentence-1'],
      quizScores: { lesson: 90 },
    };

    expect(parseProgress(serializeProgress(progress))).toEqual(progress);
  });

  it('normalizes unsupported values from imported JSON', () => {
    expect(parseProgress('{"readingMode":"unsupported","completedSentences":[1,"ok"]}')).toEqual({
      ...defaultProgress,
      completedSentences: ['ok'],
    });
  });

  it('rejects invalid JSON', () => {
    expect(() => parseProgress('{')).toThrow();
  });
});
