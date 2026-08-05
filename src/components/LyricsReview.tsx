import { useMemo, useState } from 'preact/hooks';
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
    <div class={styles.review}>
      <section class={styles.progressCard} aria-labelledby="review-progress-title">
        <div class={styles.progressCopy}>
          <div>
            <p class="eyebrow">최종 이해도</p>
            <h2 id="review-progress-title">
              {completed} / {sentences.length}문장 이해
            </h2>
          </div>
          <strong>{percent}%</strong>
        </div>
        <div
          class={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={sentences.length}
          aria-valuenow={completed}
          aria-label={`${songTitle} 가사 이해도 ${percent}%`}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <p>
          해석을 보기 전에 뜻을 떠올린 뒤, 내 해석과 맞았던 문장을 표시해 보세요.
          결과는 이 기기에 자동 저장됩니다.
        </p>
      </section>

      {percent === 100 && (
        <section class={styles.completeBanner} aria-live="polite">
          <span aria-hidden="true">できた!</span>
          <div>
            <h2>가사 전체를 이해했어요</h2>
            <p>{songTitle}의 모든 문장을 최종 점검했습니다. 이제 곡을 들으며 가사를 따라 읽어 보세요.</p>
          </div>
        </section>
      )}

      <div class={styles.toolbar}>
        <div class={styles.tabs} role="tablist" aria-label="최종 단원 보기 방식">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'lyrics'}
            class={view === 'lyrics' ? styles.activeTab : ''}
            onClick={() => setView('lyrics')}
          >
            가사 전문
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'check'}
            class={view === 'check' ? styles.activeTab : ''}
            onClick={continueUnchecked}
          >
            문장별 자가점검
          </button>
        </div>
        <label class={styles.toggle}>
          <input
            type="checkbox"
            checked={showFurigana}
            onChange={() => setShowFurigana((value) => !value)}
          />
          <span>후리가나</span>
        </label>
        {view === 'lyrics' && (
          <label class={styles.toggle}>
            <input
              type="checkbox"
              checked={showTranslations}
              onChange={() => setShowTranslations((value) => !value)}
            />
            <span>해석</span>
          </label>
        )}
      </div>

      {view === 'lyrics' ? (
        <section class={styles.lyricsSheet} aria-label={`${songTitle} 가사 전문`}>
          {groups.map((group) => (
            <div class={styles.lyricsGroup} key={group.lessonNumber}>
              <div class={styles.groupHeading}>
                <span>{String(group.lessonNumber).padStart(2, '0')}</span>
                <h2>{group.title}</h2>
              </div>
              <ol>
                {group.sentences.map((sentence) => {
                  const understood = reviewedSet.has(sentence.id);
                  return (
                    <li class={understood ? styles.understoodLine : ''} key={sentence.id}>
                      <div>
                        <p class={styles.japanese}>
                          <JapaneseLine sentence={sentence} showFurigana={showFurigana} />
                        </p>
                        {showTranslations && (
                          <p class={styles.translation}>{sentence.translationKo}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-pressed={understood}
                        disabled={!ready}
                        onClick={() => setUnderstood(sentence.id, !understood)}
                      >
                        <span aria-hidden="true">{understood ? '✓' : '○'}</span>
                        {understood ? '이해함' : '확인 전'}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      ) : current ? (
        <section class={styles.checkCard} aria-labelledby="check-card-title">
          <div class={styles.checkMeta}>
            <span>문장 {currentIndex + 1} / {sentences.length}</span>
            {reviewedSet.has(current.id) && <span class={styles.checkedBadge}>이해 표시됨</span>}
          </div>
          <div class={styles.checkPrompt}>
            <p class="eyebrow">이 문장은 무슨 뜻일까요?</p>
            <h2 id="check-card-title" class={styles.checkJapanese}>
              <JapaneseLine sentence={current} showFurigana={showFurigana} />
            </h2>
            {!answerRevealed ? (
              <button
                type="button"
                class={styles.revealButton}
                onClick={() => setAnswerRevealed(true)}
              >
                뜻 확인하기
              </button>
            ) : (
              <div class={styles.answer} aria-live="polite">
                <span>해석</span>
                <p>{current.translationKo}</p>
                <small lang="ja">{current.hiragana}</small>
                <div class={styles.answerActions}>
                  <button type="button" onClick={() => chooseResult(true)} disabled={!ready}>
                    내 해석과 같아요
                  </button>
                  <button
                    type="button"
                    class={styles.secondaryButton}
                    onClick={() => chooseResult(false)}
                    disabled={!ready}
                  >
                    다시 볼게요
                  </button>
                </div>
              </div>
            )}
          </div>
          <div class={styles.checkNavigation}>
            <button type="button" onClick={() => goTo(currentIndex - 1)}>← 이전</button>
            <button type="button" onClick={() => goTo(currentIndex + 1)}>다음 →</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
