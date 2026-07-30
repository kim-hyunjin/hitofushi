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
    <button
      type="button"
      class={favorite ? 'favorite-button is-favorite' : 'favorite-button'}
      aria-label={`${label} ${favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}`}
      aria-pressed={favorite}
      onClick={toggle}
    >
      <span aria-hidden="true">{favorite ? '★' : '☆'}</span>
    </button>
  );
}
