# J-POP 일본어 교실

J-POP 가사를 바탕으로 히라가나·가타카나 입문자가 문법, 어휘, 한자를
단계적으로 익히는 정적 학습 사이트입니다.

## 로컬 실행

```sh
npm install
npm run dev
```

정적 빌드는 `npm run build`로 확인합니다.

## GitHub Pages 배포

로컬에서 정적 사이트를 빌드하고 결과물을 `gh-pages` 브랜치에 배포합니다.

```sh
npm run deploy
```

배포 주소는 <https://kim-hyunjin.github.io/jpop-japanese/>입니다.

콘텐츠는 `src/content`의 lessons, grammar, kanji 컬렉션으로 분리되어 있습니다.
문장은 문법 ID와 한자 문자만 참조하므로 공통 설명을 여러 단원에서 재사용할 수
있습니다.
