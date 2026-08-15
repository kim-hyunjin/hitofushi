import { IconArrowRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button } from './starwind-react/button';
import { loadProgress } from '../lib/progress';

interface HomeLessonSummary {
  id: string;
  href: string;
  sentenceIds: string[];
  vocabularyIds: string[];
}

interface Props {
  lessons: HomeLessonSummary[];
}

export default function HomeLearningCta({ lessons }: Props) {
  const [href, setHref] = useState(lessons[0]?.href ?? '#');
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    const completed = new Set(progress.completedSentences);
    const favorites = new Set(progress.favoriteVocabulary);
    let latestActiveIndex = -1;

    lessons.forEach((lesson, index) => {
      const hasLessonActivity =
        lesson.sentenceIds.some((id) => completed.has(id)) ||
        typeof progress.quizScores[lesson.id] === 'number' ||
        lesson.vocabularyIds.some((id) => favorites.has(id));

      if (hasLessonActivity) latestActiveIndex = index;
    });

    if (latestActiveIndex < 0) return;

    const activeLesson = lessons[latestActiveIndex];
    const activeLessonComplete = activeLesson.sentenceIds.every((id) =>
      completed.has(id),
    );
    const nextIndex =
      activeLessonComplete && latestActiveIndex < lessons.length - 1
        ? latestActiveIndex + 1
        : latestActiveIndex;

    setHref(lessons[nextIndex].href);
    setHasHistory(true);
  }, [lessons]);

  return (
    <Button as="a" href={href} size="lg">
      {hasHistory ? '이어서 학습하기' : '첫 단원 시작하기'}
      <IconArrowRight className="size-4" aria-hidden="true" />
    </Button>
  );
}
