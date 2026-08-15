import { IconDeviceFloppy } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from './starwind-react/card';
import { Progress } from './starwind-react/progress';
import { useProgress } from '../hooks/useProgress';
import { percent } from '../lib/learningSummary';
import Eyebrow from './Eyebrow';

interface Props {
  lessonId: string;
  sentenceIds: string[];
}

export default function ProgressPanel({ lessonId, sentenceIds }: Props) {
  const { progress } = useProgress();
  const completedIds = new Set(progress.completedSentences);
  const completed = sentenceIds.filter((id) => completedIds.has(id)).length;
  const completionPercent = percent(completed, sentenceIds.length);

  return (
    <Card className="sticky top-24 border-border/80 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader className="pb-3">
        <Eyebrow>내 진도</Eyebrow>
        <CardTitle id="progress-title" className="font-serif text-3xl">
          {completionPercent}% 완료
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          문장 {sentenceIds.length}개 중 {completed}개 · 최고 퀴즈 {progress.quizScores[lessonId] ?? 0}점
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercent} variant="primary" label={`문장 학습 진도 ${completionPercent}%`} />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconDeviceFloppy className="size-4" aria-hidden="true" />
          이 기기의 브라우저에만 저장됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
