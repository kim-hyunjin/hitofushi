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
    title: 'ビンテージ',
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
  {
    slug: 'sayonara-mata-itsuka',
    sequence: 6,
    title: 'さよーならまたいつか！',
    artist: '米津玄師',
    kicker: '상처를 뚫고 끝내 마주하는 봄',
    description:
      '날개를 바라는 마음에서 스스로 구속을 끊고 날아오르기까지, 이별과 재생의 언어를 따라갑니다.',
    youtubeVideoId: 'TGz8AXN3gLA',
  },
  {
    slug: 'lady',
    sequence: 7,
    title: 'LADY',
    artist: '米津玄師',
    kicker: '익숙한 하루를 다시 사랑하는 방법',
    description:
      '서로를 너무 잘 아는 두 사람이 평범한 일상을 오가며 다시 사랑을 써 내려가는 마음을 따라갑니다.',
    youtubeVideoId: 'DdF-u3fe5pg',
  },
  {
    slug: 'kaiju-no-hanauta',
    sequence: 8,
    title: '怪獣の花唄',
    artist: 'Vaundy',
    kicker: '사라지지 않는 노래와 청춘의 기억',
    description:
      '모습을 감춘 친구의 노래와 잠들지 못한 밤에 빛나던 시간을 따라갑니다.',
    youtubeVideoId: 'UM9XNpgrqVk',
  },
  {
    slug: 'shukumei',
    sequence: 9,
    title: '宿命',
    artist: 'Official髭男dism',
    kicker: '운명이 아니라도 스스로 불태우는 오늘',
    description:
      '불안과 기대의 무게를 끌어안고, 동료와 서로를 비추며 숙명에 맞서는 뜨거운 응원가를 따라갑니다.',
    youtubeVideoId: '-kgOFJG881I',
  },
  {
    slug: 'wasurerumaeni',
    sequence: 10,
    title: '忘れる前に',
    artist: 'Vaundy',
    kicker: '꿈이 사라지기 전에 붙잡는 기억',
    description:
      '꿈속에서 희미해지는 사랑과 기억을 더듬어 찾고, 완전히 잊기 전에 붙잡으려는 마음을 따라갑니다.',
    youtubeVideoId: 'Hy7GWPkrZv0',
  },
  {
    slug: 'umi-no-yurei',
    sequence: 11,
    title: '海の幽霊',
    artist: '米津玄師',
    kicker: '바다와 여름빛에 남은 재회의 기억',
    description:
      '아무도 없는 방에서 향긋한 바람의 모래사장까지, 말로 표현할 수 없는 소중한 여름의 기억과 재회의 약속을 따라갑니다.',
    youtubeVideoId: '1s84rIhPuhk',
  },
  {
    slug: 'yesterday',
    sequence: 12,
    title: 'イエスタデイ',
    artist: 'Official髭男dism',
    kicker: '어제를 떠나 단 한 사람에게 달려가는 결의',
    description:
      '모두를 배려하려던 이상과 작별하고, 세상의 손가락질 속에서도 사랑하는 한 사람을 지키러 나아가는 마음을 따라갑니다.',
    youtubeVideoId: 'DuMqFknYHBs',
  },
];

export function getSong(slug: string) {
  return songs.find((song) => song.slug === slug);
}
