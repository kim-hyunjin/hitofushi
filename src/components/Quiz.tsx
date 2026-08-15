import { IconArrowRight, IconCheck, IconRefresh, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './starwind-react/alert';
import { Badge } from './starwind-react/badge';
import { Button } from './starwind-react/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './starwind-react/card';
import { Progress } from './starwind-react/progress';
import { updateProgress } from '../lib/progress';
import type { QuizQuestion } from '../lib/types';

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
}

export default function Quiz({ lessonId, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  const choose = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) setScore((current) => current + 1);
  };

  const advance = () => {
    if (index === questions.length - 1) {
      const percent = Math.round((score / questions.length) * 100);
      updateProgress((current) => ({
        ...current,
        quizScores: {
          ...current.quizScores,
          [lessonId]: Math.max(current.quizScores[lessonId] ?? 0, percent),
        },
      }));
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <Card className="border-primary/40 bg-card shadow-sm" aria-live="polite">
        <CardContent className="grid place-items-center gap-4 p-8 text-center">
          <span className="text-4xl text-primary" aria-hidden="true">できた!</span>
          <div>
            <h3 className="text-2xl font-extrabold">{questions.length}문제 중 {score}문제 정답</h3>
            <p className="mt-2 text-muted-foreground">
              {score === questions.length
                ? '완벽해요. 이제 가사를 소리 내어 읽어 보세요.'
                : '틀린 표현을 문장 카드에서 한 번 더 확인해 보세요.'}
            </p>
          </div>
          <Button onClick={restart}>
            <IconRefresh className="size-4" aria-hidden="true" /> 다시 풀기
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">문제 {index + 1} / {questions.length}</Badge>
          <span className="text-sm font-bold text-muted-foreground">현재 {score}점</span>
        </div>
        <Progress value={progress} variant="primary" label={`퀴즈 진행률 ${index + 1}/${questions.length}`} />
        <CardTitle className="pt-2 text-xl leading-relaxed">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2.5">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answerIndex;
          const isSelected = optionIndex === selected;
          const stateClass = selected === null
            ? 'border-border bg-background/60 hover:border-primary hover:bg-secondary/50'
            : isAnswer
              ? 'border-success bg-success/20'
              : isSelected
                ? 'border-error bg-error/15'
                : 'border-border bg-background/35 opacity-65';

          return (
            <button
              key={option}
              type="button"
              className={`flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left font-semibold transition-colors ${stateClass}`}
              disabled={selected !== null}
              onClick={() => choose(optionIndex)}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-black text-secondary-foreground">
                {selected !== null && isAnswer ? <IconCheck className="size-4" /> : selected !== null && isSelected ? <IconX className="size-4" /> : optionIndex + 1}
              </span>
              {option}
            </button>
          );
        })}
      </CardContent>
      {selected !== null && (
        <CardFooter className="block border-t border-border/70 p-5" aria-live="polite">
          <Alert variant={selected === question.answerIndex ? 'success' : 'warning'}>
            <AlertTitle>
              {selected === question.answerIndex ? '정답이에요!' : '한 번 더 기억해 둘까요?'}
            </AlertTitle>
            <AlertDescription>{question.explanation}</AlertDescription>
          </Alert>
          <Button className="mt-4 w-full sm:w-auto" onClick={advance}>
            {index === questions.length - 1 ? '결과 보기' : '다음 문제'}
            <IconArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
