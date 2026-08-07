export interface SongDefinition {
  slug: string;
  sequence: number;
  title: string;
  artist: string;
  kicker: string;
  description: string;
  youtubeVideoId: string;
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
    youtubeVideoId: 'cMLTX2FClxw',
  },
  {
    slug: 'nichijo',
    sequence: 2,
    title: '日常',
    artist: 'Official髭男dism',
    kicker: '지친 하루를 알아봐 주는 안부',
    description:
      '성과로 평가받는 일상의 무게와, 때맞춰 건네온 안부가 주는 위로를 따라갑니다.',
    youtubeVideoId: 'LbtQM793jn8',
  },
  {
    slug: 'pretender',
    sequence: 3,
    title: 'Pretender',
    artist: 'Official髭男dism',
    kicker: '운명이 아니어도 아름다운 마음',
    description:
      '이어질 수 없음을 알면서도 놓기 어려운 사랑과, 끝내 남는 아름다움을 따라갑니다.',
    youtubeVideoId: 'TQ8WlA2GXbk',
  },
  {
    slug: 'odoriko',
    sequence: 4,
    title: '踊り子',
    artist: 'Vaundy',
    kicker: '돌고 돌아 남는 사랑의 노래',
    description:
      '두고 온 기억을 주워 담고, 다시 시작하고 싶은 두 사람의 미래와 변치 않는 사랑을 따라갑니다.',
    youtubeVideoId: '7HgJIAUtICU',
  },
  {
    slug: 'tokyo-flash',
    sequence: 5,
    title: '東京フラッシュ',
    artist: 'Vaundy',
    kicker: '익숙한 미소 뒤에 남은 미련',
    description:
      '능숙해진 맞장구와 가짜 미소 사이에서, 끝내 놓지 못하는 관계의 습관을 따라갑니다.',
    youtubeVideoId: 'hS2BVRnQiYI',
  },
];

export function getSong(slug: string) {
  return songs.find((song) => song.slug === slug);
}
