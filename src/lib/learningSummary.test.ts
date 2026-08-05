import { describe, expect, it } from 'vitest';
import { defaultProgress } from './progress';
import {
  deriveLearningSummary,
  isLearningProgressReset,
  percent,
  type LearningLessonSummary,
} from './learningSummary';

const lessons: LearningLessonSummary[] = [
  {
    id: 'lesson-a',
    songTitle: 'Song',
    lessonNumber: 1,
    title: 'Lesson',
    href: '/lesson/',
    sentenceIds: ['sentence-without-lesson-prefix', 'lesson-a-2'],
    vocabulary: [
      {
        id: 'word-a',
        term: '言葉',
        reading: 'ことば',
        meaning: '단어',
        lessonTitle: 'Lesson',
        href: '/lesson/',
      },
    ],
  },
];

describe('percent', () => {
  it('returns zero for an empty collection', () => {
    expect(percent(0, 0)).toBe(0);
  });
});

describe('isLearningProgressReset', () => {
  it('requires every saved learning activity to be empty', () => {
    expect(isLearningProgressReset(defaultProgress)).toBe(true);
    expect(
      isLearningProgressReset({
        ...defaultProgress,
        quizScores: { lesson: 80 },
      }),
    ).toBe(false);
    expect(
      isLearningProgressReset({
        ...defaultProgress,
        favoriteVocabulary: ['word'],
      }),
    ).toBe(false);
    expect(
      isLearningProgressReset({
        ...defaultProgress,
        lyricsReview: { song: ['sentence'] },
      }),
    ).toBe(false);
  });
});

describe('deriveLearningSummary', () => {
  it('uses explicit sentence IDs and ignores stale progress', () => {
    const summary = deriveLearningSummary(lessons, {
      ...defaultProgress,
      completedSentences: ['sentence-without-lesson-prefix', 'removed-sentence'],
      quizScores: { 'lesson-a': 80 },
      favoriteVocabulary: ['word-a', 'removed-word'],
    });

    expect(summary.completedSentenceCount).toBe(1);
    expect(summary.totalSentenceCount).toBe(2);
    expect(summary.overallPercent).toBe(50);
    expect(summary.averageQuizScore).toBe(80);
    expect(summary.favoriteVocabulary.map((item) => item.id)).toEqual(['word-a']);
  });
});
