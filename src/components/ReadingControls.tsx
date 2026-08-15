import { IconBook, IconLanguage } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Card, CardContent } from './starwind-react/card';
import { Switch } from './starwind-react/switch';
import { ToggleGroup, ToggleGroupItem } from './starwind-react/toggle-group';
import { useProgress } from '../hooks/useProgress';
import { updateProgress } from '../lib/progress';
import type { ReadingMode } from '../lib/types';
import Eyebrow from './Eyebrow';

const modes: { id: ReadingMode; label: string; hint: string }[] = [
  { id: 'beginner', label: '입문', hint: '모든 읽기 도움 표시' },
  { id: 'elementary', label: '초급', hint: '후리가나와 번역 표시' },
  { id: 'reading', label: '읽기', hint: '원문에 집중' },
];

function applyDisplay(mode: ReadingMode, showTranslations: boolean) {
  document.documentElement.dataset.readingMode = mode;
  document.documentElement.dataset.showTranslations = String(showTranslations);
}

export default function ReadingControls() {
  const { progress } = useProgress();
  const { readingMode: mode, showTranslations } = progress;

  useEffect(() => {
    applyDisplay(mode, showTranslations);
  }, [mode, showTranslations]);

  const chooseMode = (values: string[]) => {
    const nextMode = values[0] as ReadingMode | undefined;
    if (!nextMode) return;
    updateProgress((current) => ({ ...current, readingMode: nextMode }));
  };

  return (
    <Card className="mb-6 border-border/80 bg-card/80 shadow-sm backdrop-blur">
      <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <IconBook className="size-5" aria-hidden="true" />
          </span>
          <div>
            <Eyebrow>읽기 설정</Eyebrow>
            <h2 className="mb-0 text-lg font-semibold tracking-tight" id="reading-mode-title">
              지금의 나에게 맞춰 보기
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <ToggleGroup
            aria-labelledby="reading-mode-title"
            value={[mode]}
            onValueChange={chooseMode}
            variant="outline"
            size="sm"
            spacing={0}
          >
            {modes.map((item) => (
              <ToggleGroupItem key={item.id} value={item.id} title={item.hint}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Switch
            id="show-translations"
            checked={showTranslations}
            onCheckedChange={(checked) =>
              updateProgress((current) => ({ ...current, showTranslations: checked }))
            }
            label="번역 표시"
            size="sm"
          />
        </div>
        <IconLanguage className="sr-only" aria-hidden="true" />
      </CardContent>
    </Card>
  );
}
