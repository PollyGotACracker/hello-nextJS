# RSC(React Server Components)

- Next.js 12: SSR;Page Router - Client Pre-rendering
- Next.js 13: RSC;App Router - Server Rendering

---

- [nextjs.org: Why server components](https://nextjs.org/docs/getting-started/react-essentials#why-server-components)
- 서버에서만 가능한 동작과 클라이언트에서만 가능한 동작을 구분한다.

1. 서버에서만 실행되는 컴포넌트
2. 결과 값이 HTML이 아닌 JSX인 렌더링 프로세스

## Isomorphic Components

- 과거에는...

  - HTML과 JavaScript라는 서로 다른 두 가지 멘탈 모델을 하나의 페이지에 섞어야 했다.
  - 서버 사이드 렌더링을 도입할 경우, 서버 측 SSR용 템플릿, 클라이언트 측 CSR용 템플릿을 번갈아가며 써야 했다.

- Page Router의 React 컴포넌트는 서버에서도, 클라이언트에서도 동일하게 동작해야 한다(Isomorphic;동형).
- React는 JSX를 통해 서버 및 클라이언트 로직을 동형으로 만든다. 이는 클라이언트와 서버 로직을 간단히 작성할 수 있으며, 컴포넌트의 재활용성을 높일 수 있다.
- 즉, 하나의 언어로 동형 컴포넌트를 쓸 수 있고, 동형 모델로 멘탈 모델을 간결하게 만들 수 있다.
- 이전까지는 컴포넌트에서 서버 로직에 접근하기 어려웠으나, '서버 전용(Server-Specific)' 컴포넌트가 추가되었다. RSC는 기존 React의 멘탈 모델을 변경한 것이 아니라 확장한 것이다. ([링크](https://github.com/reactwg/server-components/discussions/4))

## 서버에서만 실행되는 컴포넌트

- Dan Abramov 는 React 컴포넌트의 서버 - 클라이언트 통합을 '뼈 - 살 모델' 로 비유했다.  
  Reconstructed React tree in browser:
  Server components don't exist; just the tags they rendered to  
  Client placeholders turned back into components
- 서버 컴포넌트(뼈): 서버 측에서 먼저 렌더링 된 뒤 리렌더링 되지 않는 지점
- 클라이언트 컴포넌트(살): 데이터 호출이나 유저 인터렉션으로 인해 변경되어야 하는 동적인 컴포넌트

---

- Next.js 13부터 모든 컴포넌트는 기본적으로 서버 사이드이다. `'use client'` 라는 directive 를 사용하면 클라이언트 컴포넌트로 취급된다.
- 이러한 문자열을 읽어온 다음 실행하므로 번들러나 서버, 혹은 ESM(ES Module)의 정적 분석을 기반으로 동작한다.
- 이는 추후 도입될 React 컴파일러([React Forgot](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler))를 위한 예비 작업이다.

### RSC와 기존 SSR의 차이점

- Next.js 의 기존 Pre-fetching API 인 `getServerSideProps`, `getStaticProps` 등의 함수는 페이지 단위의 SSR을 지원한다.
- 하지만 RSC는 **각 컴포넌트의 갱신 정책을 컴포넌트 단위로 가져갈 수 있도록 세분화** 한다.  
  서버에서 한번 렌더링한 후, 업데이트 되는 시점에 따라:

  - RSC는 기본적으로 만료 기한이 없으므로: SSG
  - 결과물을 일정 기간 동안 갱신하도록 하면: ISR
  - 매 요청마다 갱신하도록 하면: SSR

- 결과물들은 모두 `Suspense` 경계를 단위로 streaming 된다. 각 요청의 만료 여부는 React에 새로 도입된 `Cache` 에서 관리한다.
- Next.js는 App Router에서도 기존 Pre-fetching API 사용을 layout.js, page.js 에서 허용하고 있다. ([링크](https://nextjs.org/blog/layouts-rfc#data-fetching))

- 기존 SSR:
- 페이지 전체를 HTML로 전송한다.
- 캐싱 단위를 페이지 단위로만 선택할 수 있다.
- 따라서 화면에 하나라도 개인화 된 데이터가 존재한다면 SSG의 이점이 무의미해진다.

- RSC:
- 자체 Cache에 각 컴포넌트에서 필요로 하는 데이터가 만료될 때까지 저장해둔다.
- 좀 더 세부적인 단위로 캐싱 정책을 가져갈 수 있다.
- 이를 `Suspense` 와 조합하면 Streaming SSR을 구현할 수 있게 된다.

## 결과 값이 HTML이 아닌 JSX인 렌더링 프로세스

- RSC로 구성된 첫 페이지를 로드했을 때, 로드된 페이지에는 아래와 같은 asset 들을 가지고 있다.

  - 미리 렌더링 된 HTML (뼈 - 첫 Chunk)
  - Suspense 경계로 인해 추가 스트리밍 된 HTML (살 - 후속 Chunk)
  - CSR 동작을 위한 자바스크립트 번들 (hydration)

- 여기서 다른 페이지로 라우팅을 한다면, 다른 preserved segments 는 유지하고 re-rendering 된 segments 만 교체하는 식으로 페이지 변환이 일어난다. 그러나 각 페이지 별 코드 스플리팅이 일어나는 방식에서 CSR은 기존과 차이가 있다.

  - 기존:
  - 클라이언트 중심으로 라우팅 로직을 계산한다.
  - `renderToString`이 실행되어 HTML을 내려주는 건 새로고침(Hard Refresh)을 했을 때 뿐이다.
  - 즉, 클라이언트 사이드 렌더링 시 번들에도 이러한 SPA 앱의 CSR 렌더링을 위한 전체 로직이 포함될 수 밖에 없었다.

- RSC:
  - 라우팅 로직의 중심을 클라이언트에서 서버로 옮긴 것이다.
  - 직렬화 된 JSX를 주고받고, 클라이언트에서는 서버로부터 받은 JSX를 가상 DOM에 반영한다.  
    ([링크](https://rsc-parser.vercel.app/) 의 1 tree 참고)

1. JSX 트리가 서버에서 먼저 생성
2. 첫 응답으로 HTML chunk 를 내보낸다.
3. 뒤이어 replace 스크립트와 함께 추가 chunk 를 내보낸다.
4. 클라이언트에서는 새로 받은 재료들을 기존 HTML에 재조립한다.

- [plasmic.app: What are react server components](https://www.plasmic.app/blog/how-react-server-components-work#what-are-react-server-components)
- 이때 JSX에서 컴포넌트의 타입을 나타내는 `type` 은 일반 HTML 요소와 달리, React 컴포넌트나 함수 등 직렬화가 불가능한 요소일 경우 해당 요소의 '참조'가 들어간다. 클라이언트에서 재조립 시 이 참조를 가지고 JSX tree를 업데이트 할 수 있다.
- Streaming chunk 중 두 번째 chunk 가 이 부분에 해당된다.

- RSC를 사용한 라우팅은 서버 측과 클라이언트 측의 diff를 서버 쪽에서 계산하여, 클라이언트 쪽에서 필요한 만큼의 payload 만 전달해준다.
- 그러므로 Next.js 서버는 1. 첫 응답으로서의 HTML, 2. 업데이트 될 요소를 표현하는 용도의 JSX Diff 2가지 응답을 할 수 있어야 한다. 따라서 RSC 를 렌더링하는 별도의 서버가 구현되었다.
