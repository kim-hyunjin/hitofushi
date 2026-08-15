import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { Toggle } from './starwind-react/toggle';
import { useProgress } from '../hooks/useProgress';
import { updateProgress } from '../lib/progress';

interface Props {
  vocabularyId: string;
  label: string;
}

export default function FavoriteButton({ vocabularyId, label }: Props) {
  const { progress } = useProgress();
  const favorite = progress.favoriteVocabulary.includes(vocabularyId);

  const toggle = () => {
    const next = !favorite;
    updateProgress((current) => ({
      ...current,
      favoriteVocabulary: next
        ? [...new Set([...current.favoriteVocabulary, vocabularyId])]
        : current.favoriteVocabulary.filter((id) => id !== vocabularyId),
    }));
  };

  return (
    <Toggle
      size="sm"
      variant="outline"
      className="favorite-button rounded-full"
      aria-label={`${label} ${favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}`}
      pressed={favorite}
      onPressedChange={toggle}
    >
      {favorite ? <IconStarFilled className="size-4 text-warning" aria-hidden="true" /> : <IconStar className="size-4" aria-hidden="true" />}
    </Toggle>
  );
}
