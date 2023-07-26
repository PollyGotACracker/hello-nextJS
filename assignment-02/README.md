# Assignment 02

- 전유영
- Next.js@12, TypeScript, styled-components, react-icons
- gray-matter : Metadata(frontmatter 문법)
- unified, remark-parse, remark-rehype, rehype-stringify : Markdown to JavaScript
- remark-prism : Code Highlighter
- [nextjs.org: Pre-rendering and Data Fetching](https://nextjs.org/learn/basics/data-fetching/blog-data)

## 과제) Next.js로 마크다운 블로그 만들기 (1/2)

- Next.js로 마크다운 블로그를 정적 페이지(SSG)로 작성

### 1. 폴더 구조 및 라우팅

- 루트 경로의 `__posts` 폴더에 마크다운 파일(`.md`)를 작성
- md 파일은 마크다운 본문과 게시물에 대한 metadata 포함(frontmatter)
- '목록 페이지'와 개별 게시물을 렌더링하는 '상세 페이지'로 나누어 작성

  - `/` - 목록 페이지
  - `/[id]` - 상세 페이지

- Next.js 12 의 Prefetching 메서드 적절히 사용
- 또는 Next.js 13을 설치하고 Pages Router를 사용
- 정적 페이지를 생성할 때 필요한 데이터 생성: `getStaticProps`
- 각 포스트를 그려줄 상세 페이지 경로 생성: `getStaticPaths`

## 참고 사항

- CSS-in-JS 라이브러리 사용 시 `_document.js`(Next.js 공식 문서 참고)에 각 라이브러리(`styled-components`, `emotion`, …)에 알맞은 세팅 추가
