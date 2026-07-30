import { useEffect, useState } from 'preact/hooks';
import {
  defaultProgress,
  loadProgress,
  PROGRESS_EVENT,
  type ProgressState,
} from '../lib/progress';

export interface ProgressSnapshot {
  progress: ProgressState;
  ready: boolean;
}

export function useProgress(): ProgressSnapshot {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setProgress(loadProgress());
      setReady(true);
    };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { progress, ready };
}
