# Universal Rendering

- 하나의 환경에서 SSR, CSR 을 함께 지원하는 것
- 서버와 클라이언트에서 모두 실행할 수 있는 JS 의 특성 활용

## Serialization / Hydration

- [yceffort.kr: JSON.stringify](https://yceffort.kr/2022/06/JSON-stringify)
- [infoq.com: Parsing JSON](https://www.infoq.com/presentations/simdjson-parser/)
- React 의 경우:
  1. 서버 측 React(`react-dom/server`) 에서 앱을 렌더링
  2. 문자열로 변환(직렬화;Serialization)해 클라이언트로 전달
  3. 클라이언트에서 다시 한번 렌더링하며 JS event 연결(수화;Hydration)
- 서버 측 로직과 클라이언트 측 로직을 하나의 프로젝트 내에서 동일하게 사용 가능하다.
- 다른 언어로 된 서버에서도 React SSR 을 지원할 수 있지만, 결국 서버 측에서 React 를 돌릴 Node runtime 이 필요하다.

### [Server React DOM API](https://ko.react.dev/reference/react-dom/server)

#### 모든 환경

- `renderToString()`:  
  React 컴포넌트를 직렬화하여 문자열로 변환(e.g. SSR, 구글맵 마커)  
  '동기 렌더링 함수'이기 때문에 `Suspense` 를 지원하지 않는다.  
  JS 는 싱글 스레드 언어로, 비동기 작업을 이벤트 루프로 돌리며 최대한 CPU 집약적인 무거운 작업을 피해야 한다.  
  그러나 서버사이드 API 호출을 포함한 SSR 작업에 동기 함수를 사용하면 전반적인 응답 속도가 하락할 수 있다.  
  이는 메서드의 구조적 문제이기 때문에 Next.js 13버전으로 넘어가면서 `renderToString()` 을 그대로 사용하지 않고 SSR 을 캐싱하여 사용하고 있다.
- `renderToStaticMarkup()`: `renderToString()` 과 유사하나 `data-reactroot` 와 같은 React 내부에서 사용하는 추가적 DOM attribute 를 만들지 않는다. 따라서 간단한 정적 페이지 생성에 유용하다.

#### Web Streams

- `renderToReadableStream()`: 브라우저, Deno, 엣지 runtime 등의 환경

#### Node.js Streams

- 렌더링을 streaming 방식으로
- `renderToPipeableStream()`: Node.js 전용, `Suspense` 지원
- `renderToStaticNodeStream()`: `renderToStaticMarkup()` 과 유사하나 streaming 방식

### [Client React DOM API](https://ko.react.dev/reference/react-dom/client)

- `createRoot().render`: `render()` 와 동일(~ v17)
- `hydrateRoot()`: `hydrate()` 와 동일(~ v17)

## Serialize(직렬화)

- 어떠한 객체의 내용을 byte 단위로 변환한 다음, 네트워크를 통한 송수신이 가능하도록 만드는 작업
- 규격: JSON(JavaScript Object Notation), XML(Extensible Markup Language)
- JS 의 Object 와 Python 의 Dictionary 는 유사한 key-value 쌍의 형태이다. Python 앱에서 딕셔너리로 만든 데이터를 JS 에서 열어보면 객체로 열린다.
- 그러나, 만약 JS 로 구성된 프론트엔드 앱에서 Object 를 payoload 로 담아서 Python 으로 만들어진 서버로 POST 요청을 보낸다면 값을 제대로 읽을 수 없다.
- 어떤 객체를 HTTP 통신에서 body 값으로 활용하려면 `JSON.stringify()` 를 사용해 송수신 가능한 문자열 형태로 변환해야 한다.

## Hydrate(수화)

- 직렬화의 반대 과정
- JSON 포맷으로 직렬화 할 수 있는 값에는 제약이 있다. JS 함수 등은 JSON 포맷에 속하지 않기 때문에 `JSON.stringify()` 등을 사용할 경우 값이 사라지게 된다.
- 클라이언트 측 React 는 서버 측에서 React 로 렌더링 된 HTML 을 읽고, 이벤트 리스너가 달려 있어야 하는 DOM 의 위치를 찾아 연결하게 된다.
- 서버에서 미리 렌더링한 HTML 파일이 화면에 그려지더라도, hydrate 가 끝나기 전까지 eventListener 는 동작하지 않는다.
- 클라이언트 앱 구동에 필요한 JS 번들 크기가 클수록 다운로드 및 실행할 JS 양이 많아져 TTI 는 늦어지게 된다.
