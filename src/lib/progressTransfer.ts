import { normalizeProgress, type ProgressState } from './progress';

export function serializeProgress(progress: ProgressState): string {
  return JSON.stringify(progress, null, 2);
}

export function parseProgress(source: string): ProgressState {
  return normalizeProgress(JSON.parse(source));
}

export function downloadProgress(progress: ProgressState): void {
  const blob = new Blob([serializeProgress(progress)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'hitofushi-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
}
