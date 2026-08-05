import type { ProgressState } from './progress';

export interface LearningVocabularySummary {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  lessonTitle: string;
  href: string;
}

export interface LearningLessonSummary {
  id: string;
  songTitle: string;
  lessonNumber: number;
  title: string;
  href: string;
  sentenceIds: string[];
  vocabulary: LearningVocabularySummary[];
}

export interface LearningSummary {
  completedSentenceCount: number;
  totalSentenceCount: number;
  overallPercent: number;
  quizScores: number[];
  averageQuizScore: number;
  favoriteVocabulary: LearningVocabularySummary[];
}

export function percent(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export function isLearningProgressReset(progress: ProgressState): boolean {
  return (
    progress.completedSentences.length === 0 &&
    Object.keys(progress.quizScores).length === 0 &&
    Object.values(progress.lyricsReview).every((sentenceIds) => sentenceIds.length === 0) &&
    progress.favoriteVocabulary.length === 0
  );
}

export function deriveLearningSummary(
  lessons: LearningLessonSummary[],
  progress: ProgressState,
): LearningSummary {
  const validSentenceIds = new Set(lessons.flatMap((lesson) => lesson.sentenceIds));
  const completedSentenceCount = progress.completedSentences.filter((id) =>
    validSentenceIds.has(id),
  ).length;
  const vocabularyMap = new Map(
    lessons.flatMap((lesson) => lesson.vocabulary.map((item) => [item.id, item] as const)),
  );
  const favoriteVocabulary = progress.favoriteVocabulary
    .map((id) => vocabularyMap.get(id))
    .filter((item): item is LearningVocabularySummary => Boolean(item));
  const quizScores = lessons
    .map((lesson) => progress.quizScores[lesson.id])
    .filter((score): score is number => typeof score === 'number');

  return {
    completedSentenceCount,
    totalSentenceCount: validSentenceIds.size,
    overallPercent: percent(completedSentenceCount, validSentenceIds.size),
    quizScores,
    averageQuizScore: quizScores.length
      ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
      : 0,
    favoriteVocabulary,
  };
}
