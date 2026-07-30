# J-POP 일본어 교실

J-POP 가사를 바탕으로 히라가나·가타카나 입문자가 문법, 어휘, 한자를
단계적으로 익히는 정적 학습 사이트입니다.

## 로컬 실행

```sh
npm install
npm run dev
```

정적 빌드는 `npm run build`로 확인합니다.

## GitHub Pages 경로

프로젝트 페이지처럼 하위 경로에 배포할 때는 빌드 시 경로를 지정합니다.

```sh
PUBLIC_BASE_PATH=/저장소이름/ PUBLIC_SITE_URL=https://사용자명.github.io npm run build
```

콘텐츠는 `src/content`의 lessons, grammar, kanji 컬렉션으로 분리되어 있습니다.
문장은 문법 ID와 한자 문자만 참조하므로 공통 설명을 여러 단원에서 재사용할 수
있습니다.
