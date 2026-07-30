export interface SongDefinition {
  slug: string;
  sequence: number;
  title: string;
  artist: string;
  kicker: string;
  description: string;
}

export const songs: SongDefinition[] = [
  {
    slug: 'vintage',
    sequence: 1,
    title: 'Vintage',
    artist: 'Official髭男dism',
    kicker: '상처마저 사랑하게 되는 시간',
    description:
      '상처를 피하던 마음이 함께 쌓은 시간과 기억을 사랑하게 되는 흐름을 따라갑니다.',
  },
  {
    slug: 'nichijo',
    sequence: 2,
    title: '日常',
    artist: 'Official髭男dism',
    kicker: '지친 하루를 알아봐 주는 안부',
    description:
      '성과로 평가받는 일상의 무게와, 때맞춰 건네온 안부가 주는 위로를 따라갑니다.',
  },
];

export function getSong(slug: string) {
  return songs.find((song) => song.slug === slug);
}
