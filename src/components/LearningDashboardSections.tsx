import { IconArrowRight, IconBookmark, IconChartBar, IconSparkles } from '@tabler/icons-react';
import { Badge } from './starwind-react/badge';
import { Button } from './starwind-react/button';
import { Card, CardContent, CardHeader, CardTitle } from './starwind-react/card';
import { Progress } from './starwind-react/progress';
import type { ProgressState } from '../lib/progress';
import {
  percent,
  type LearningLessonSummary,
  type LearningSummary,
  type LearningVocabularySummary,
} from '../lib/learningSummary';
import JapaneseSpeechButton from './JapaneseSpeechButton';

interface SummaryProps {
  summary: LearningSummary;
  lessonCount: number;
}

export function LearningSummarySection({ summary, lessonCount }: SummaryProps) {
  const stats = [
    ['익힌 문장', `${summary.completedSentenceCount}/${summary.totalSentenceCount}`],
    ['응시한 퀴즈', `${summary.quizScores.length}/${lessonCount}`],
    ['평균 최고 점수', `${summary.averageQuizScore}점`],
    ['즐겨찾기', `${summary.favoriteVocabulary.length}개`],
  ];

  return (
    <Card className="overflow-hidden border-0 bg-[var(--hero)] text-[var(--hero-foreground)] shadow-lg" aria-labelledby="learning-summary-title">
      <CardHeader className="md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow !text-accent">전체 학습 현황</p>
          <CardTitle id="learning-summary-title" className="font-serif text-4xl text-inherit">
            {summary.overallPercent}% 완료
          </CardTitle>
          <p className="mt-2 text-sm text-[var(--on-ink-soft)]">이 기기의 브라우저에 저장된 기록입니다.</p>
        </div>
        <IconChartBar className="hidden size-16 text-primary md:block" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-5">
        <Progress value={summary.overallPercent} variant="primary" label={`전체 문장 학습 진도 ${summary.overallPercent}%`} />
        <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white/8 p-3">
              <dt className="text-xs text-[var(--on-ink-soft)]">{label}</dt>
              <dd className="mt-1 font-serif text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

interface LessonProgressProps {
  lessons: LearningLessonSummary[];
  progress: ProgressState;
}

export function LessonProgressSection({ lessons, progress }: LessonProgressProps) {
  const completedIds = new Set(progress.completedSentences);

  return (
    <section aria-labelledby="lesson-progress-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">단원별 진도</p>
          <h2 className="text-3xl font-extrabold tracking-tight" id="lesson-progress-title">어디까지 공부했나요?</h2>
        </div>
        <p className="text-sm text-muted-foreground">학습할 문장을 선택하거나 퀴즈 최고 점수를 확인하세요.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {lessons.map((lesson) => {
          const completed = lesson.sentenceIds.filter((id) => completedIds.has(id)).length;
          const lessonPercent = percent(completed, lesson.sentenceIds.length);
          const score = progress.quizScores[lesson.id];

          return (
            <Card key={lesson.id} className="border-border/80 bg-card shadow-sm">
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{lesson.songTitle} · LESSON {String(lesson.lessonNumber).padStart(2, '0')}</Badge>
                  <strong className="text-sm text-primary">{lessonPercent}%</strong>
                </div>
                <CardTitle>{lesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  문장 {completed}/{lesson.sentenceIds.length} · 퀴즈 {typeof score === 'number' ? `${score}점` : '미응시'}
                </p>
                <Progress value={lessonPercent} variant="primary" label={`${lesson.title} 진도 ${lessonPercent}%`} />
              </CardHeader>
              <CardContent>
                <Button as="a" href={lesson.href} variant="outline" className="w-full">
                  {completed ? '이어서 학습하기' : '학습 시작하기'}
                  <IconArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function FavoriteVocabularySection({ items }: { items: LearningVocabularySummary[] }) {
  return (
    <section aria-labelledby="favorites-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">즐겨찾기 어휘</p>
          <h2 className="text-3xl font-extrabold tracking-tight" id="favorites-title">다시 보고 싶은 단어</h2>
        </div>
        <p className="text-sm text-muted-foreground">단원에서 별표를 누른 어휘만 모아 보여 줍니다.</p>
      </div>
      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="border-border/80 bg-card shadow-sm">
              <CardHeader className="flex-row items-start justify-between gap-3">
                <a href={item.href}>
                  <CardTitle className="font-serif text-3xl" lang="ja">{item.term}</CardTitle>
                  <span className="text-sm text-muted-foreground" lang="ja">{item.reading}</span>
                </a>
                <JapaneseSpeechButton sentenceId={`${item.id}-favorite`} text={item.reading} label={`${item.term} 발음`} compact />
              </CardHeader>
              <CardContent>
                <p>{item.meaning}</p>
                <a className="mt-4 flex items-center gap-1 text-sm font-bold text-primary hover:underline" href={item.href}>
                  {item.lessonTitle} <IconArrowRight className="size-4" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="flex items-center gap-4 p-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary">
              <IconBookmark className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-bold">아직 저장한 단어가 없어요.</h3>
              <p className="text-sm text-muted-foreground">단원 어휘의 별표를 누르면 이곳에서 다시 볼 수 있습니다.</p>
            </div>
            <IconSparkles className="ml-auto hidden size-6 text-accent sm:block" aria-hidden="true" />
          </CardContent>
        </Card>
      )}
    </section>
  );
}
