# Streaming SSR

## Single Thread 와 Event Loop

- [builder.io: Visualizing nodejs close queue](https://www.builder.io/blog/visualizing-nodejs-close-queue)
- Node.js 는 싱글 스레드 환경 하에 동기 코드 처리를 담당하는 '콜 스택'과, 비동기 코드 처리를 담당하는 '이벤트 루프'가 서로 상호 작용하면서 많은 요청을 빠르게 처리한다.
- 응답이 오기까지 오래 대기해야 하는 요청들은 모든 처리가 끝날 때까지 메인 스레드를 Block 할 위험이 있다. Node.js는 `setTimeout` 이나 `Promise` 처럼 나중에 처리될 값들은 callback 형태로 이벤트 루프로 넘겨 비동기적으로 처리한다.
- cf. 이벤트 루프는 6개의 Phase(Macrotask Queue) 와 2개의 Microtask Queue 를 갖는다.

## renderToString API의 Limited Concurrency(제한된 동시성) Issue

- 싱글 스레드 환경에서 구성된 서버의 메인 스레드가 Block 되면 서버는 요청을 제대로 처리할 수 없게 된다.
- 이 현상은 동기 함수인 `ReactDOMServer.renderToString()` 으로 구성된 React SSR 서버에서도 동일하게 나타난다.
- 만약 여러 사용자가 서버에 SSR 요청을 했을 경우, SSR 요청은 동기적으로 실행되고 그 사이 Node.js 서버의 메인 스레드가 Block 되므로 사용자는 다른 사용자가 응답을 받을 때까지 기다려야 한다.
- React 18 에서는 Concurrent Feature 를 반영하여 1. **Streaming SSR** 과 2. **선택적 Hydration** 이라는 대책을 내놓았다.

### Streaming SSR로 비동기 렌더링

- Streaming SSR은 Static SSR 과 달리, 준비된 chunk 단위로 끊어 먼저 응답을 보내고 무거운 요청들은 뒤로 미루는 방식이다(HTML 스트리밍).
- chunk 는 html 과 script 로 나누어져 있다. script 는 html Template 태그에 포함되어 있던 주석과 id selector(Magic Literal)를 실제 데이터로 갈아끼운다(Suspense 원리와 동일).
- React 는 `renderToString` 을 deprecated 처리하고, [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) API 기반의 `renderToReadableStream` API 를 권장하고 있다.
- transfer-encoding: chunked:

  - HTTP/1.1 스펙의 Header 값 중 하나 (HTTP/2 부터는 기본적으로 스트리밍이 가능)
  - 일반적으로 HTTP 요청을 보낼 때 Content-Length 를 응답에 함께 보내지만 스트리밍 요청의 경우 불가능하므로 전체 사이즈를 알지 못할 때 사용
  - 브라우저는 남은 chunk 의 길이가 0이 될 때까지 커넥션을 닫지 않고 기다리면서 TCP/IP Handshake 비용을 절약
  - 통신을 완전히 열어놓는 keep-alive 와는 다르다(persistent connection).

1. `chunk.toString()` 로 확인해볼 때, 세 가지 chunk 중 첫 번째 chunk 는 Suspense 경계가 pending 상태이므로 fallback 컴포넌트를 보여주고 있는 상태의 HTML 이다. `$?` 문자열과 `template#B:0` 태그는 이후 응답에서 받을 실제 데이터의 placeholder 이다.
2. 두 번째 chunk 는 메타 정보이다.
3. 세 번째 chunk 는 화면에 보여질 실제 데이터와 스크립트 태그를 포함한다. 실제 데이터는 hidden 처리되어 있다가, 스크립트 태그의 `replaceContent("B:0", "S:0")`가 실행되면 id selector가 `B:0` 인 요소(placeholder)는 id selector가 `S:0` 인 데이터로 교체된다.

## Suspense

- [web.dev: Code splitting-Suspense](https://web.dev/code-splitting-suspense/)
- Suspense 컴포넌트는 React 컴포넌트의 비동기 로딩 상황을 일급객체로 다루고, 간결하고 선언적인 형태로 작성할 수 있도록 해주는 도구이다.
- 컴포넌트가 아직 데이터를 로드하지 못했을 때 대신 보여줄 컴포넌트를 정의할 수 있다.
- 로딩 상태를 추적 및 관리할 필요 없이, 비동기 작업이 어떻게 처리되어야 할지 선언하면 된다.

```jsx
<Suspense fallback={<div>Loading...</div>}>
  <Todo />
</Suspense>
```

### 동작 원리

- [sebmarkbage/Infrastructure.js](https://gist.github.com/sebmarkbage/2c7acb6210266045050632ea611aebee)
- Suspense 는 try-catch 문과 유사하게 동작한다. catch 문에서 에러 상태를 받아 처리하듯 비동기 상태를 대신 처리하고, 상위 컴포넌트로 Promise 를 throw 하여 컴포넌트가 로딩 상태임을 전파한다(throw 는 Error 객체만 던지는 것이 아니다!).

1. 무한 루프를 돌며 throw 되는 것들을 감지  
   (재귀로 구성할 경우 catch -> await 에 걸리면 모든 것이 멈추게 될 것이다.)
2. 그 중 Promise 의 인스턴스가 있을 경우 await 하여 reslove 를 시도하면서, 다른 컴포넌트를 먼저 렌더링한다.
3. try 가 끝나면 task 실행의 return 값을 반환하고, UI 는 fallback 에서 컴포넌트 children 으로 전환된다.

- 실제 React 내부 코드에서는 Promise 객체 대신 Thenable 을 사용하고 있으며, Promise 객체 대신 SuspenseException 을 throw 한다.

---

- 일급 객체(first-class object) / 일급 시민(first-class citizen):
  - 프로그래밍 언어 디자인에서 특정 객체가 언어의 기능을 제한 없이 사용할 수 있음을 나타내는 용어
  1. 변수에 할당될 수 있음
  2. 데이터 구조 내에 저장될 수 있음
  3. 함수의 매개변수로 전달될 수 있음
  4. 함수의 반환 값이 될 수 있음
  - 자바스크립트에서 `Promise` 의 등장으로 callback 패턴에서 벗어나 비동기를 일급 객체로 다룰 수 있게 되었다.
