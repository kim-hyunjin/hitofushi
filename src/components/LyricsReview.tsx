import { IconArrowLeft, IconArrowRight, IconCheck, IconCircle } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Badge } from './starwind-react/badge';
import { Button } from './starwind-react/button';
import { Progress } from './starwind-react/progress';
import { Switch } from './starwind-react/switch';
import { Tabs, TabsList, TabsTrigger } from './starwind-react/tabs';
import { Toggle } from './starwind-react/toggle';
import { useProgress } from '../hooks/useProgress';
import { updateProgress } from '../lib/progress';
import type { LessonSentence } from '../lib/types';
import Eyebrow from './Eyebrow';

export interface LyricsReviewGroup {
  lessonNumber: number;
  title: string;
  sentences: LessonSentence[];
}

interface Props {
  songSlug: string;
  songTitle: string;
  groups: LyricsReviewGroup[];
}

function JapaneseLine({ sentence, showFurigana }: {
  sentence: LessonSentence;
  showFurigana: boolean;
}) {
  return (
    <span lang="ja">
      {sentence.ruby.map((segment, index) =>
        segment.reading ? (
          <ruby key={`${sentence.id}-${index}`}>
            {segment.text}
            {showFurigana && <rt>{segment.reading}</rt>}
          </ruby>
        ) : (
          <span key={`${sentence.id}-${index}`}>{segment.text}</span>
        ),
      )}
    </span>
  );
}

export default function LyricsReview({ songSlug, songTitle, groups }: Props) {
  const { progress, ready } = useProgress();
  const [view, setView] = useState<'lyrics' | 'check'>('lyrics');
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const sentences = useMemo(
    () => groups.flatMap((group) => group.sentences),
    [groups],
  );
  const validIds = useMemo(() => new Set(sentences.map((sentence) => sentence.id)), [sentences]);
  const reviewedIds = (progress.lyricsReview[songSlug] ?? []).filter((id) => validIds.has(id));
  const reviewedSet = new Set(reviewedIds);
  const completed = reviewedIds.length;
  const percent = sentences.length ? Math.round((completed / sentences.length) * 100) : 0;
  const current = sentences[currentIndex];

  const setUnderstood = (sentenceId: string, understood: boolean) => {
    updateProgress((currentProgress) => {
      const currentIds = currentProgress.lyricsReview[songSlug] ?? [];
      const nextIds = understood
        ? [...new Set([...currentIds, sentenceId])]
        : currentIds.filter((id) => id !== sentenceId);

      return {
        ...currentProgress,
        lyricsReview: {
          ...currentProgress.lyricsReview,
          [songSlug]: nextIds,
        },
      };
    });
  };

  const goTo = (index: number) => {
    setCurrentIndex((index + sentences.length) % sentences.length);
    setAnswerRevealed(false);
  };

  const chooseResult = (understood: boolean) => {
    setUnderstood(current.id, understood);
    goTo(currentIndex + 1);
  };

  const continueUnchecked = () => {
    const nextIndex = sentences.findIndex((sentence) => !reviewedSet.has(sentence.id));
    if (nextIndex >= 0) goTo(nextIndex);
    setView('check');
  };

  return (
    <div className="grid gap-6">
      <section
        className="rounded-lg bg-[var(--hero)] p-[1.4rem] text-[var(--hero-foreground)] shadow-[0_1.25rem_3rem_rgb(23_50_77_/_16%)] md:p-8"
        aria-labelledby="review-progress-title"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow tone="hero">최종 이해도</Eyebrow>
            <h2
              id="review-progress-title"
              className="mb-0 text-[length:clamp(1.5rem,5vw,2.2rem)] font-semibold"
            >
              {completed} / {sentences.length}문장 이해
            </h2>
          </div>
          <strong className="text-[2.5rem] leading-none text-[var(--yellow)]">{percent}%</strong>
        </div>
        <Progress value={percent} variant="primary" label={`${songTitle} 가사 이해도 ${percent}%`} />
        <p className="mb-0 max-w-176 text-[0.82rem] text-[var(--on-ink-soft)]">
          해석을 보기 전에 뜻을 떠올린 뒤, 내 해석과 맞았던 문장을 표시해 보세요.
          결과는 이 기기에 자동 저장됩니다.
        </p>
      </section>

      {percent === 100 && (
        <section
          className="flex items-center gap-4 rounded-lg border border-[color-mix(in_srgb,var(--success)_65%,var(--border))] bg-[color-mix(in_srgb,var(--success)_20%,var(--card))] p-5"
          aria-live="polite"
        >
          <span className="shrink-0 text-[1.1rem] italic text-foreground" aria-hidden="true">できた!</span>
          <div>
            <h2 className="mb-0.5 text-[1.15rem]">가사 전체를 이해했어요</h2>
            <p className="mb-0 text-[0.82rem] text-muted-foreground">{songTitle}의 모든 문장을 최종 점검했습니다. 이제 곡을 들으며 가사를 따라 읽어 보세요.</p>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-[0.9rem] border border-border bg-card p-[0.55rem]">
        <Tabs
          value={view}
          onValueChange={(next) => next === 'check' ? continueUnchecked() : setView('lyrics')}
          aria-label="최종 단원 보기 방식"
        >
          <TabsList>
            <TabsTrigger value="lyrics">가사 전문</TabsTrigger>
            <TabsTrigger value="check">문장별 자가점검</TabsTrigger>
          </TabsList>
        </Tabs>
        <Switch
          id="review-furigana"
          checked={showFurigana}
          onCheckedChange={setShowFurigana}
          label="후리가나"
          size="sm"
        />
        {view === 'lyrics' && (
          <Switch
            id="review-translations"
            checked={showTranslations}
            onCheckedChange={setShowTranslations}
            label="해석"
            size="sm"
          />
        )}
      </div>

      {view === 'lyrics' ? (
        <section className="columns-1 gap-5 md:columns-2" aria-label={`${songTitle} 가사 전문`}>
          {groups.map((group) => (
            <div
              className="mb-5 inline-block w-full break-inside-avoid rounded-lg border border-border bg-card p-5 shadow-[var(--shadow)] md:p-6"
              key={group.lessonNumber}
            >
              <div className="mb-4 flex items-center gap-[0.7rem] border-b border-border pb-3">
                <span className="text-[1.35rem] text-accent">{String(group.lessonNumber).padStart(2, '0')}</span>
                <h2 className="mb-0 text-sm">{group.title}</h2>
              </div>
              <ol className="m-0 grid list-none gap-[0.85rem] p-0">
                {group.sentences.map((sentence) => {
                  const understood = reviewedSet.has(sentence.id);
                  return (
                    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3" key={sentence.id}>
                      <div>
                        <p className="mb-0.5 text-[1.03rem] font-semibold leading-[1.9] [&_rt]:text-[var(--accent-dark)]">
                          <JapaneseLine sentence={sentence} showFurigana={showFurigana} />
                        </p>
                        {showTranslations && (
                          <p className="mb-0 text-xs leading-normal text-muted-foreground">{sentence.translationKo}</p>
                        )}
                      </div>
                      <Toggle
                        pressed={understood}
                        size="sm"
                        variant="outline"
                        disabled={!ready}
                        onPressedChange={(pressed) => setUnderstood(sentence.id, pressed)}
                        className={understood
                          ? "border-success! bg-[color-mix(in_srgb,var(--success)_18%,var(--card))]! text-foreground! disabled:cursor-wait"
                          : "disabled:cursor-wait"}
                      >
                        {understood ? <IconCheck className="size-4" aria-hidden="true" /> : <IconCircle className="size-4" aria-hidden="true" />}
                        {understood ? '이해함' : '확인 전'}
                      </Toggle>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      ) : current ? (
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow)]" aria-labelledby="check-card-title">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-[0.85rem] text-xs font-extrabold text-muted-foreground">
            <span>문장 {currentIndex + 1} / {sentences.length}</span>
            {reviewedSet.has(current.id) && <Badge variant="success">이해 표시됨</Badge>}
          </div>
          <div className="min-h-96 p-[clamp(1.5rem,7vw,4rem)] text-center">
            <Eyebrow>이 문장은 무슨 뜻일까요?</Eyebrow>
            <h2
              id="check-card-title"
              className="mx-auto my-10 max-w-192 text-[length:clamp(1.65rem,6vw,3.1rem)] font-medium leading-[1.7] [&_rt]:text-[var(--accent-dark)]"
            >
              <JapaneseLine sentence={current} showFurigana={showFurigana} />
            </h2>
            {!answerRevealed ? (
              <Button onClick={() => setAnswerRevealed(true)}>
                뜻 확인하기
              </Button>
            ) : (
              <div className="mx-auto max-w-152 rounded-[0.9rem] bg-muted p-5" aria-live="polite">
                <span className="text-[0.7rem] font-[850] tracking-[0.12em] text-[var(--accent-dark)]">해석</span>
                <p className="my-1.5 text-[1.05rem] font-bold">{current.translationKo}</p>
                <small className="text-muted-foreground" lang="ja">{current.hiragana}</small>
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <Button onClick={() => chooseResult(true)} disabled={!ready}>
                    내 해석과 같아요
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => chooseResult(false)}
                    disabled={!ready}
                  >
                    다시 볼게요
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-[0.85rem] text-xs font-extrabold text-muted-foreground">
            <Button variant="ghost" onClick={() => goTo(currentIndex - 1)}>
              <IconArrowLeft className="size-4" aria-hidden="true" /> 이전
            </Button>
            <Button variant="ghost" onClick={() => goTo(currentIndex + 1)}>
              다음 <IconArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
