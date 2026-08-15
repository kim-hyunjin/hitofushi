import { IconPlayerPauseFilled, IconVolume } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './starwind-react/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './starwind-react/tooltip';

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
  const utterance = useRef<SpeechSynthesisUtterance | undefined>(undefined);

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
    <span className="inline-flex flex-wrap items-center gap-2">
      <Tooltip disabled={!compact}>
        <TooltipTrigger>
          <Button
            variant={isPlaying ? 'secondary' : 'outline'}
            size={compact ? 'icon-sm' : 'sm'}
            className="rounded-full"
            disabled={isUnsupported}
            aria-pressed={isPlaying}
            aria-label={`${label} ${isPlaying ? '듣기 중지' : '듣기'}`}
            onClick={toggleSpeech}
          >
            {isPlaying
              ? <IconPlayerPauseFilled className="size-4" aria-hidden="true" />
              : <IconVolume className="size-4" aria-hidden="true" />}
            {!compact && (isPlaying ? '정지' : '듣기')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label} {isPlaying ? '듣기 중지' : '듣기'}</TooltipContent>
      </Tooltip>
      {playbackState === 'error' && (
        <span className="text-xs text-error" role="status">
          이 기기에서 일본어 음성을 재생하지 못했습니다.
        </span>
      )}
      {isUnsupported && (
        <span className="text-xs text-muted-foreground" role="status">
          이 브라우저는 음성 재생을 지원하지 않습니다.
        </span>
      )}
    </span>
  );
}
