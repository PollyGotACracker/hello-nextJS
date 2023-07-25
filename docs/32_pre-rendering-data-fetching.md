# Pre-rendering & Data Fetching

- 정적 자원: 이미지, HTML 및 스크립트 파일 등 변하지 않는 자원. 웹 서버에서 처리, 캐싱 가능
- 동적 자원: 급상승 검색어 등 실시간으로 계속 바뀌는 자원. WAS에서 처리. 캐싱 불가능

## Build 결과물과 Pre-rendering Method

- `Static` :
  - Automatically rendered as static HTML (uses no initial props)
  - 서버 사이드에서 아무런 처리가 필요 없는 순수한 정적 HTML 페이지
  - 서버 측 로직은 건너뛰기 때문에 서버 측에서 미리 처리하여 내려주는 props가 없다.
- `SSG` :

  - Automatically generated as static HTML + JSON (uses `getStaticProps`)
  - HTML + JSON 으로 정적 생성된 페이지
  - `getStaticPaths` 와 `getStaticProps` 메서드의 조합으로 서버 사이드 로직을 사용한다:
    1. `getStaticPaths` 를 사용하여 생성 가능한 모든 경로를 미리 받아놓는다.
    2. 해당 경로의 배열을 모두 순회하며 `getStaticProps` 로직을 타며 props를 생성해둔다.
    3. 따라서 클라이언트에서 해당 페이지를 열어보았을 때 이미 props가 존재하게 된다.

- `Server` :

  - Server-side renders at runtime (use `getInitialProps` or `getServerSideProps`)
  - 람다 기호(λ)로 표시하며 SSR, API Route 가 해당된다.
  - 클라이언트 측에서 요청이 들어오면 서버 로직이 개별 함수처럼 즉시 실행(Lambda) 되고 각 경로에 맞는 응답을 보낸다.
  - `getServerSideProps` 를 사용하면 SSR 페이지를 만들 수 있다.

- `ISR`(지속적 정적 재생성) :
  - Incremental static regeneration (uses revalidate in `getStaticProps`)
  - 기본적으로는 SSG에 해당하나 빌드 시에만 결과물을 생성하는 SSG의 단점을 보완하기 위해 고안되었다.
  - SSG 사이트 페이지를 업데이트할 때마다 전체 페이지를 빌드하지 않고, 지속적으로 업데이트 상황을 추가(Incremental) 할 수 있다.
  - ISR 과 On-demand revlidation을 이용하면 정적 생성의 성능 상 이점을 취하면서, 사용자에게 실시간으로 업데이트된 페이지를 제공할 수 있다.
  - ISR은 기존의 정적생성 방식에 몇가지 옵션들을 추가하면 바로 적용이 가능하다(`getStaticProps` 에서 `revalidate` 옵션 사용).
  - cf. `stale-while-revalidate` 캐싱 전략

## Data Fetching Method

- `getInitialProps`(deprecated) :

  - 서버 측, 클라이언트 측 모두에서 실행된다.
  - React 18의 동시성 모드를 지원하기 위해 가급적 [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) 나 [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)를 사용할 것을 권장하고 있다.
  - 하지만 `_document.js` 등 어쩔 수 없이 사용해야 하는 경우도 있다. ([링크](https://github.com/vercel/next.js/discussions/13864#discussioncomment-23584))

- `getServerSideProps` :
  - 페이지 컴포넌트 측으로 진입했을 때 서버 측에서 실행되며 SSR에 사용된다.
  - 페이지 진입시 cookie 등을 처리하거나, 페이지를 보여주기 전에 미리 받아와야 하는 데이터가 있을 경우 사용하면 된다.
  - 요청 헤더에 접근할 수 있기 때문에 캐싱 등의 설정이 가능하다.
- `getStaticProps` : 페이지를 정적 생성(SSG)할 때 사용된다.
- `getStaticPaths` : Dynamic Route를 사용할 때 `getStaticProps` 가 생성할 경로의 목록들을 정의하는 함수이다.

---

## SWR

- data fetching 을 위한 React Hooks 라이브러리
- stale-while-revalidate: HTTP RFC 5861(opens in a new tab)에 의해 알려진 HTTP 캐시 무효화 전략
- 먼저 캐시(stale)로부터 데이터를 반환한 후, fetch 요청(revalidate)을 하고, 최종적으로 최신화된 데이터를 가져오는 전략
- 컴포넌트는 지속적이며 자동으로 데이터 업데이트 스트림을 받게 되며, UI는 항상 빠르고 반응적
