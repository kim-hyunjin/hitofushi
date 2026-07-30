# 새 곡과 가사 학습 자료 추가 가이드

이 문서는 새 가사 구간, 같은 곡의 다음 단원, 또는 완전히 새로운 곡을
사이트에 추가하는 방법을 설명합니다.

## 먼저 알아둘 현재 구조

콘텐츠와 화면 코드는 다음처럼 나뉩니다.

```text
src/
├── content/
│   ├── lessons/                 # 단원별 가사·어휘·퀴즈 JSON
│   ├── grammar/                 # 문법 설명 Markdown
│   └── kanji/                   # 한자 설명 JSON
└── pages/
    ├── songs/<곡-slug>/         # 곡 소개 화면
    │   └── lessons/
    │       └── [lessonNumber].astro # 단원 화면을 자동 생성
    ├── grammar/[id].astro       # 모든 문법 파일의 페이지를 자동 생성
    └── kanji/[character].astro  # 모든 한자 파일의 페이지를 자동 생성
```

문법과 한자는 파일을 추가하면 상세 페이지가 자동 생성됩니다. `Vintage`는
동적 단원 경로를 사용하므로 단원 JSON을 추가하면 단원 페이지와 곡 소개의
단원 목록도 자동 생성됩니다. 완전히 새로운 곡은 곡 소개 페이지와 그 곡을
담당할 동적 단원 페이지를 한 번 만들어야 합니다.

## 어떤 작업을 하면 되나요?

### 기존 단원에 가사 몇 줄을 더할 때

기존 `src/content/lessons/<단원-id>.json`에 문장, 어휘, 퀴즈를 추가합니다.
새 문법이나 한자가 나오면 각각의 콘텐츠 파일도 추가합니다. 이후 단원 화면과
홈 화면에 적힌 문장·단어·한자 수를 실제 개수에 맞게 수정합니다.

### 같은 곡의 다음 단원을 만들 때

`Vintage`라면 새 단원 JSON만 추가합니다. 곡 소개 페이지가 `songSlug`로
단원을 모아 자동으로 링크를 표시합니다. 다른 곡도 같은 구조를 적용했다면
동일합니다.

### 완전히 새로운 곡을 만들 때

새 단원 작업에 더해 `src/pages/songs/<곡-slug>/index.astro`를 만들고,
홈 화면이나 공통 내비게이션에서 새 곡으로 이동할 수 있는 링크를 추가합니다.

## 1. 콘텐츠 범위와 ID 정하기

먼저 다음 값을 정합니다.

| 항목 | 규칙 | 예시 |
| --- | --- | --- |
| 곡 slug | 영문 소문자와 하이픈 사용 | `night-dancer` |
| 단원 번호 | 1부터 시작하는 정수 | `1` |
| 단원 ID 및 파일명 | `<곡-slug>-<단원 번호>` | `night-dancer-1` |
| 문장 ID | `<단원-id>-<문장 순번>` | `night-dancer-1-1` |
| 어휘 ID | 사이트 전체에서 겹치지 않게 작성 | `night-dancer-1-odorou` |
| 퀴즈 ID | 단원 안에서 겹치지 않게 작성 | `night-dancer-1-q1` |

단원, 문장, 어휘 ID는 브라우저의 학습 진행도와 즐겨찾기를 저장하는 키로
사용됩니다. 공개한 뒤 ID를 바꾸면 기존 사용자의 저장 상태가 이어지지 않으므로
처음부터 안정적인 이름을 사용합니다.

저작권이 있는 노래는 사용 허가 범위를 먼저 확인합니다. 허가되지 않은 가사
전문을 싣기보다 학습에 필요한 최소 구간만 사용하고, 번역·해설·예문은 직접
작성합니다.

## 2. 단원 JSON 만들기

`src/content/lessons/<단원-id>.json`을 만듭니다. 아래는 모든 필드를 포함한
최소 예시입니다.

```json
{
  "songSlug": "night-dancer",
  "lessonNumber": 1,
  "title": "밤의 장면을 묘사하기",
  "subtitle": "동작과 시간 표현",
  "description": "짧은 두 문장을 읽으며 핵심 동사와 연결 표현을 익힙니다.",
  "estimatedMinutes": 12,
  "sentences": [
    {
      "id": "night-dancer-1-1",
      "original": "夜の街を歩いている",
      "ruby": [
        { "text": "夜", "reading": "よる" },
        { "text": "の" },
        { "text": "街", "reading": "まち" },
        { "text": "を" },
        { "text": "歩", "reading": "ある" },
        { "text": "いている" }
      ],
      "hiragana": "よる の まち を あるいている",
      "pronunciationKo": "요루노 마치오 아루이테이루",
      "translationKo": "밤거리를 걷고 있어",
      "grammarIds": ["teiru"],
      "kanjiIds": ["夜", "街", "歩"]
    }
  ],
  "vocabulary": [
    {
      "id": "night-dancer-1-yoru",
      "term": "夜",
      "reading": "よる",
      "meaning": "밤",
      "note": "시간을 나타낼 때 자주 쓰는 명사입니다."
    }
  ],
  "quiz": [
    {
      "id": "night-dancer-1-q1",
      "prompt": "「歩いている」가 나타내는 뜻은 무엇일까요?",
      "options": ["걷고 있다", "걷고 싶다", "걸었다", "걷지 않는다"],
      "answerIndex": 0,
      "explanation": "동사의 て형 뒤에 いる가 오면 진행 중인 동작을 나타낼 수 있습니다."
    }
  ]
}
```

작성할 때 다음을 확인합니다.

- `ruby`의 `text`를 순서대로 합친 결과가 `original`과 정확히 같아야 합니다.
- 후리가나가 필요한 부분에만 `reading`을 넣습니다. 조사와 히라가나는
  `text`만 사용합니다.
- `grammarIds`는 `src/content/grammar`에 있는 Markdown 파일명과 일치해야
  합니다. 예를 들어 `teiru`는 `teiru.md`를 가리킵니다.
- `kanjiIds`의 모든 글자에는 대응하는 한자 JSON이 있어야 합니다.
- `answerIndex`는 0부터 셉니다. 첫 번째 선택지가 정답이면 `0`입니다.
- 퀴즈 선택지는 최소 2개가 필요합니다. 화면 동작을 위해 문장, 어휘, 퀴즈를
  각각 하나 이상 작성하는 것을 권장합니다.
- 한국어식 발음은 장음, 촉음, 연탁 등을 일관되게 표기하고 일본어 원문·
  히라가나·번역이 서로 대응하는지 소리 내어 확인합니다.

정확한 스키마는 `src/content.config.ts`에 있습니다. 정의되지 않은 필드를
추가하거나 필수 필드를 빠뜨리면 빌드 검사에서 오류가 발생합니다.

## 3. 새 문법 설명 추가하기

기존 문법이면 해당 파일명을 `grammarIds`에서 재사용합니다. 새 문법일 때만
`src/content/grammar/<문법-id>.md`를 추가합니다.

```md
---
title: "〜ている"
pattern: "동사 て형 + いる"
summary: "진행 중인 동작이나 계속되는 상태를 나타냅니다."
level: "입문"
examples:
  - japanese: "今、歌っている。"
    korean: "지금 노래하고 있다."
  - japanese: "東京に住んでいる。"
    korean: "도쿄에 살고 있다."
---
문맥에 따라 지금 진행 중인 동작 또는 결과가 이어지는 상태를 나타냅니다.

이 단원의 가사에서는 현재 이어지고 있는 동작을 표현합니다.
```

- 파일명이 문법 ID이자 URL이 됩니다:
  `teiru.md` → `/grammar/teiru/`
- `level`은 현재 `입문` 또는 `초급`만 사용할 수 있습니다.
- 본문에는 형태 변화, 가사 안의 뉘앙스, 초보자가 혼동하기 쉬운 점을
  설명합니다.
- 이미 있는 문법을 중복 생성하지 말고 기존 설명을 보완합니다.

## 4. 새 한자 설명 추가하기

기존 한자는 현재 파일을 재사용합니다. 새 한자일 때만
`src/content/kanji/<한자>.json`을 추가합니다.

```json
{
  "character": "夜",
  "onyomi": ["ヤ"],
  "kunyomi": ["よ", "よる"],
  "basicMeaning": "밤",
  "wordMeaning": "夜（よる）로 읽어 해가 진 뒤의 시간을 나타냅니다.",
  "mnemonic": "해가 지고 사방이 어두워진 밤의 장면을 떠올려 보세요.",
  "examples": [
    { "word": "夜", "reading": "よる", "meaning": "밤" },
    { "word": "今夜", "reading": "こんや", "meaning": "오늘 밤" }
  ]
}
```

- `character`는 한 글자여야 하며 `kanjiIds`의 값과 정확히 같아야 합니다.
- 읽기가 없으면 빈 배열 `[]`을 사용합니다.
- `wordMeaning`은 일반 사전 뜻보다 이번 가사 속 단어에서 어떤 뜻과 읽기로
  쓰였는지 설명합니다.
- `mnemonic`은 학습용 연상법입니다. 실제 자원이나 어원처럼 단정하지 않습니다.

## 5. 단원 페이지 연결 확인하기

`Vintage`의 `src/pages/songs/vintage/lessons/[lessonNumber].astro`는
`songSlug`가 `vintage`인 모든 단원을 읽고 단원 번호별 페이지를 자동으로
생성합니다.

예를 들어 `vintage-2.json`의 `lessonNumber`가 `2`이면 다음 URL이 생깁니다.

```text
/songs/vintage/lessons/2/
```

같은 곡의 단원을 추가할 때는 별도의 Astro 파일을 복사하지 않습니다. 새
곡을 만들 때만 이 동적 페이지를 새 곡 디렉터리로 복사하고 다음을 수정합니다.

```sh
mkdir -p src/pages/songs/night-dancer/lessons
cp 'src/pages/songs/vintage/lessons/[lessonNumber].astro' \
  'src/pages/songs/night-dancer/lessons/[lessonNumber].astro'
```

- `getStaticPaths()`에서 비교하는 `songSlug`
- 상단 breadcrumb의 곡 이름과 `/songs/<곡-slug>/` 링크
- 새 디렉터리 깊이가 다르다면 `import` 상대 경로

퀴즈와 진행도 ID, 문장·한자 수는 선택된 단원 콘텐츠에서 자동으로 계산됩니다.
페이지 안의 내부 링크에는 배포 하위 경로를 지원하도록 반드시
`withBase(...)`를 사용합니다.

## 6. 새 곡 소개 페이지 만들기

새 곡이라면 기존 `src/pages/songs/vintage/index.astro`를 복사합니다.

```sh
mkdir -p src/pages/songs/night-dancer
cp src/pages/songs/vintage/index.astro \
  src/pages/songs/night-dancer/index.astro
```

새 페이지에서 다음을 수정합니다.

- 조회할 첫 단원 ID
- 페이지 제목과 설명
- `SONG 01` 같은 곡 순번
- 곡 제목, 소개 문구, 학습 안내
- 문법 태그
- 각 단원의 제목, 요약, 링크

복사한 곡 소개 화면은 `songSlug`가 일치하는 단원을 번호순으로 정렬해
표시하도록 구성합니다. `vintage` 문자열을 새 곡 slug로 바꾸고 곡별 제목과
소개 문구를 수정합니다.

## 7. 홈과 공통 내비게이션 갱신하기

새 곡을 사용자가 찾을 수 있도록 다음 파일을 확인합니다.

- `src/pages/index.astro`: 대표 가사, 현재 곡 소개, 문장·단어·한자·시간 수
- `src/layouts/BaseLayout.astro`: 상단 “노래”, “첫 단원” 링크
- `src/pages/grammar/[id].astro`: 문법 상세의 돌아가기 링크
- `src/pages/kanji/[character].astro`: 한자 상세의 돌아가기 링크

현재 이 링크들은 `vintage` 첫 단원으로 고정되어 있습니다. 새 곡을 대표
콘텐츠로 바꾸려면 함께 갱신합니다. 여러 곡을 계속 운영할 계획이라면 다음
작업으로 곡 목록 페이지와 동적 단원 라우팅을 도입하는 편이 안전합니다.

## 8. 로컬 검수하기

의존성을 처음 설치할 때:

```sh
npm ci
```

편집하면서 확인할 때:

```sh
npm run dev
```

최종 확인:

```sh
npm run build
```

`npm run build`는 콘텐츠 스키마와 Astro/TypeScript 오류를 검사하고 모든 정적
페이지를 생성합니다. 빌드 성공만으로 일본어와 번역의 정확성이 보장되지는
않으므로 브라우저에서도 다음을 확인합니다.

- 곡 소개 → 단원 → 문법/한자 상세 링크가 모두 열리는가
- 입문·초급·읽기 모드에서 후리가나와 발음 표시가 의도대로 바뀌는가
- 모든 문장의 학습 완료 버튼이 서로 독립적으로 저장되는가
- 어휘 즐겨찾기와 퀴즈 최고 점수가 저장되는가
- 모바일 폭에서 긴 일본어 문장과 선택지가 잘리지 않는가
- 새 URL을 직접 새로고침해도 정상적으로 열리는가

## 9. 배포하기

검수가 끝나면 변경 사항을 커밋한 뒤 로컬에서 배포합니다.

```sh
npm run deploy
```

이 명령은 GitHub Pages용 하위 경로로 사이트를 다시 빌드하고 `dist` 결과물을
`gh-pages` 브랜치에 푸시합니다. 즉시 운영 사이트를 바꾸는 명령이므로 반드시
로컬 검수와 `npm run build`를 먼저 완료합니다.

배포 주소:
<https://kim-hyunjin.github.io/jpop-japanese/>

## 완료 체크리스트

- [ ] 가사 사용 범위와 출처를 확인했다.
- [ ] 곡 slug와 모든 ID가 규칙에 맞고 중복되지 않는다.
- [ ] `ruby`를 합친 문자열이 `original`과 같다.
- [ ] 모든 `grammarIds`와 `kanjiIds`에 대응하는 콘텐츠가 있다.
- [ ] 번역, 후리가나, 한국어식 발음을 교정했다.
- [ ] 정답 번호와 퀴즈 해설을 다시 확인했다.
- [ ] 단원 및 곡 페이지의 고정 문구와 링크를 수정했다.
- [ ] 홈 또는 곡 목록에서 새 자료에 접근할 수 있다.
- [ ] `npm run build`가 오류 없이 끝난다.
- [ ] 데스크톱과 모바일에서 학습 흐름을 확인했다.
- [ ] 검수 후 `npm run deploy`로 배포했다.
