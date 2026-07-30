import { useEffect, useRef, useState } from 'preact/hooks';
import styles from './JapaneseSpeechButton.module.css';

interface Props {
  sentenceId: string;
  text: string;
  label?: string;
  compact?: boolean;
}

type PlaybackState = 'idle' | 'playing' | 'error' | 'unsupported';

const SPEECH_START_EVENT = 'hitofushi:speech-start';

function findJapaneseVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'ja-jp') ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('ja'))
  );
}

export default function JapaneseSpeechButton({
  sentenceId,
  text,
  label = '일본어 발음',
  compact = false,
}: Props) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utterance = useRef<SpeechSynthesisUtterance>();

  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setPlaybackState('unsupported');
      return;
    }

    const synthesis = window.speechSynthesis;
    const refreshVoices = () => setVoices(synthesis.getVoices());
    const handleOtherSpeech = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== sentenceId) {
        setPlaybackState('idle');
        utterance.current = undefined;
      }
    };

    refreshVoices();
    synthesis.addEventListener('voiceschanged', refreshVoices);
    window.addEventListener(SPEECH_START_EVENT, handleOtherSpeech);

    return () => {
      synthesis.removeEventListener('voiceschanged', refreshVoices);
      window.removeEventListener(SPEECH_START_EVENT, handleOtherSpeech);
    };
  }, [sentenceId]);

  const toggleSpeech = () => {
    if (playbackState === 'unsupported') return;

    const synthesis = window.speechSynthesis;
    if (playbackState === 'playing') {
      synthesis.cancel();
      utterance.current = undefined;
      setPlaybackState('idle');
      return;
    }

    synthesis.cancel();
    const nextUtterance = new SpeechSynthesisUtterance(text);
    const japaneseVoice = findJapaneseVoice(voices);

    nextUtterance.lang = 'ja-JP';
    nextUtterance.rate = 0.85;
    if (japaneseVoice) nextUtterance.voice = japaneseVoice;

    nextUtterance.addEventListener('start', () => {
      if (utterance.current === nextUtterance) setPlaybackState('playing');
    });
    nextUtterance.addEventListener('end', () => {
      if (utterance.current === nextUtterance) {
        utterance.current = undefined;
        setPlaybackState('idle');
      }
    });
    nextUtterance.addEventListener('error', (event) => {
      if (utterance.current !== nextUtterance) return;
      utterance.current = undefined;
      setPlaybackState(event.error === 'canceled' ? 'idle' : 'error');
    });

    utterance.current = nextUtterance;
    setPlaybackState('playing');
    window.dispatchEvent(new CustomEvent(SPEECH_START_EVENT, { detail: sentenceId }));
    synthesis.speak(nextUtterance);
  };

  const isPlaying = playbackState === 'playing';
  const isUnsupported = playbackState === 'unsupported';

  return (
    <span class={styles.wrapper}>
      <button
        type="button"
        class={`${styles.button} ${compact ? styles.compact : ''}`}
        data-playing={isPlaying}
        disabled={isUnsupported}
        aria-pressed={isPlaying}
        aria-label={`${label} ${isPlaying ? '듣기 중지' : '듣기'}`}
        title={compact ? `${label} ${isPlaying ? '듣기 중지' : '듣기'}` : undefined}
        onClick={toggleSpeech}
      >
        {isPlaying ? (
          <svg class={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3" y="3" width="4" height="10" rx="1" />
            <rect x="9" y="3" width="4" height="10" rx="1" />
          </svg>
        ) : (
          <svg class={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 6.1h2.6l3.2-2.7a.8.8 0 0 1 1.3.6v8a.8.8 0 0 1-1.3.6l-3.2-2.7H2.5a1 1 0 0 1-1-1V7.1a1 1 0 0 1 1-1Zm9.1-.7a.8.8 0 0 1 1.1.1 4 4 0 0 1 0 5 .8.8 0 1 1-1.2-1 2.4 2.4 0 0 0 0-3 .8.8 0 0 1 .1-1.1Z" />
          </svg>
        )}
        {!compact && (isPlaying ? '정지' : '듣기')}
      </button>
      {playbackState === 'error' && (
        <span class={styles.message} role="status">
          이 기기에서 일본어 음성을 재생하지 못했습니다.
        </span>
      )}
      {isUnsupported && (
        <span class={styles.message} role="status">
          이 브라우저는 음성 재생을 지원하지 않습니다.
        </span>
      )}
    </span>
  );
}
