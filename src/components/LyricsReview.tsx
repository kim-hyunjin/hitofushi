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
import styles from './LyricsReview.module.css';

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
    <div className={styles.review}>
      <section className={styles.progressCard} aria-labelledby="review-progress-title">
        <div className={styles.progressCopy}>
          <div>
            <p className="eyebrow">최종 이해도</p>
            <h2 id="review-progress-title">
              {completed} / {sentences.length}문장 이해
            </h2>
          </div>
          <strong>{percent}%</strong>
        </div>
        <Progress value={percent} variant="primary" label={`${songTitle} 가사 이해도 ${percent}%`} />
        <p>
          해석을 보기 전에 뜻을 떠올린 뒤, 내 해석과 맞았던 문장을 표시해 보세요.
          결과는 이 기기에 자동 저장됩니다.
        </p>
      </section>

      {percent === 100 && (
        <section className={styles.completeBanner} aria-live="polite">
          <span aria-hidden="true">できた!</span>
          <div>
            <h2>가사 전체를 이해했어요</h2>
            <p>{songTitle}의 모든 문장을 최종 점검했습니다. 이제 곡을 들으며 가사를 따라 읽어 보세요.</p>
          </div>
        </section>
      )}

      <div className={`${styles.toolbar} !flex !flex-wrap !items-center !gap-3`}>
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
        <section className={styles.lyricsSheet} aria-label={`${songTitle} 가사 전문`}>
          {groups.map((group) => (
            <div className={styles.lyricsGroup} key={group.lessonNumber}>
              <div className={styles.groupHeading}>
                <span>{String(group.lessonNumber).padStart(2, '0')}</span>
                <h2>{group.title}</h2>
              </div>
              <ol>
                {group.sentences.map((sentence) => {
                  const understood = reviewedSet.has(sentence.id);
                  return (
                    <li className={understood ? styles.understoodLine : ''} key={sentence.id}>
                      <div>
                        <p className={styles.japanese}>
                          <JapaneseLine sentence={sentence} showFurigana={showFurigana} />
                        </p>
                        {showTranslations && (
                          <p className={styles.translation}>{sentence.translationKo}</p>
                        )}
                      </div>
                      <Toggle
                        pressed={understood}
                        size="sm"
                        variant="outline"
                        disabled={!ready}
                        onPressedChange={(pressed) => setUnderstood(sentence.id, pressed)}
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
        <section className={styles.checkCard} aria-labelledby="check-card-title">
          <div className={styles.checkMeta}>
            <span>문장 {currentIndex + 1} / {sentences.length}</span>
            {reviewedSet.has(current.id) && <Badge variant="success">이해 표시됨</Badge>}
          </div>
          <div className={styles.checkPrompt}>
            <p className="eyebrow">이 문장은 무슨 뜻일까요?</p>
            <h2 id="check-card-title" className={styles.checkJapanese}>
              <JapaneseLine sentence={current} showFurigana={showFurigana} />
            </h2>
            {!answerRevealed ? (
              <Button onClick={() => setAnswerRevealed(true)}>
                뜻 확인하기
              </Button>
            ) : (
              <div className={styles.answer} aria-live="polite">
                <span>해석</span>
                <p>{current.translationKo}</p>
                <small lang="ja">{current.hiragana}</small>
                <div className={styles.answerActions}>
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
          <div className={styles.checkNavigation}>
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
