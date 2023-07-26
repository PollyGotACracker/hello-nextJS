# SSR

- [patterns.dev: Server-side Rendering](https://www.patterns.dev/posts/server-side-rendering)
- 제공하고자 하는 웹 서비스의 화면을 서버 측에서 그리는 방법의 통칭

## SSR 은 SEO(Search Engine Optimization) 에 유리하다

- [google developers: Crawling, Indexing](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ko)
- CSR  
  검색 엔진 크롤러가 페이지를 요청 했을 때 첫 페이지가 비어있다.  
  뒤늦게 리소스가 다운로드되면서 페이지가 로드된다.  
  => 검색 노출 X

- SSR(+ SSG)  
  검색 엔진 크롤러가 페이지를 요청 했을 때 첫 페이지가 표시된다.  
  => 검색 노출 O

- 크롤러 입장에서 rendering 이 되지 않은, 정보값이 없는 페이지를 색인할 수 없다.
  - 색인(Indexing): 검색 엔진 사전에 등록

cf) react-helmet 라이브러리를 사용해 header 에 DOM API 로 직접 변경하여 CSR 에 SEO 를 적용할 수 있다.

## SSR 은 CSR 에 비해 서버 부하가 크다

- SSR:

  - 서버 측에서 처리해야 하는 렌더링 로직 때문에 반드시 응답을 처리해줄 서버가 필요하다. CSR only 서비스보다 서버가 더 바빠진다.
  - 트래픽이 많이 몰리면 응답이 느려지거나, 메모리가 한도를 초과해 서버가 동작을 멈출 수도 있다.

- CSR only:

  - 미리 빌드해둔 HTML, JS, CSS 등 정적 파일을 S3 등의 저장소에 올려두고, Cloudfront 등의 CDN 을 붙여 별도의 컴퓨팅 자원 없이 정적으로 제공할 수 있다.
  - 서버에서 렌더링하는 로직이 없고, 동일한 응답을 돌려주어 캐싱이 용이한 특징 때문에 SSR 보다 많은 트래픽을 효과적으로 받아낼 수 있다.

## SSR 과 SSG(Static Site Generation) 의 차이

- [patterns.dev: Static Rendering](https://www.patterns.dev/posts/static-rendering)

### 로딩 속도

- SSR 과 SSG 는 둘 다 첫 요청이 완성된 정적 페이지로 들어온다. 그러나 어느 시점에 화면을 rendering 하는지에서 차이가 발생한다.
- SSR 은 요청이 들어왔을 때 서버 측에서 렌더링이 일어나지만, SSG 는 개발자가 개발을 완료하고 빌드하는 순간 렌더링이 일어난다.
- SSG 는 내용을 수정하기 힘든 대신 로딩 속도가 빠르다. 따라서 SSG 는 SSR 보다 정보의 변화가 적은 블로그 같은 사이트에 적합하다.

### 컴퓨터 자원

- 컴퓨터 자원의 필요 여부: SSR O, SSG X
  - SSR: 서버가 있어야 한다.  
    컴퓨팅 자원을 제공하는 AWS EC2, GCP ComputeEngine, Azure VitualCompute 등의 인스턴스 제품들을 사용하거나,  
    AWS Lambda 와 같은 서버리스 서비스를 사용한다.
  - SSG: 서버의 유무는 중요하지 않다.  
    서버가 있을 경우 서버를 통해 들어온 요청을 인스턴스 내 또는 별도 저장소에 담긴 HTML 파일을 불러와 응답한다.  
    서버가 없다면 AWS S3 와 같은 저장소를 사용한다. 일반적으로 CDN 역할을 하는 AWS CloudFront 와 조합하여 사용한다.

## SSR 과 CSR 의 렌더링 성능 비교

- CSR React 앱:

  1. 서버에 최초 GET 요청
  2. 빈 HTML(bootstrapping)
  3. JS, CSS 등 asset 다운로드(GET) --- FCP
  4. JS 파일 실행
  5. React 실행 후 React 에 의한 렌더링
  6. 화면에 출력  
     --- TTI

- SSG React 앱:

  1. 서버에 최초 GET 요청
  2. CDN (선택적) --- FCP
  3. 미리 완성된 HTML 응답
  4. 화면에 출력  
     --- TTI

- SSR React 앱:

  1. 서버에 최초 GET 요청
  2. 서버 측에서 요청 경로를 보고 알맞는 React 앱 렌더링 --- FCP
  3. 생성된 HTML 응답
  4. 화면에 출력  
     --- TTI

### UX 관련 성능 지표(Metrics)

- [web.dev: Metrics](https://web.dev/metrics/)
- [web.dev: vitals](https://web.dev/vitals/)
- 사용자 경험에 관한 아이디어를 검증할 때 참고하는 지표로, 이중 보다 중요하게 다뤄지는 지표를 'Core Web Vitals' 라고 한다.
- Lighthouse 와 같은 도구들로 측정할 수 있다.

#### TTFB (Time to First Byte)

- 어떤 리소스를 요청한 뒤, 해당 요청에 대한 첫 번째 byte 가 도착하기까지 걸리는 시간
- 화면이 그려졌는가의 여부와는 상관 없음
- CSR 이 SSR 보다 TTFB 가 빠름

#### FCP(First Contentful Paint)

- 텍스트, 이미지 등 페이지가 로드되기 시작한 시점으로부터, 콘텐츠 일부가 화면에 렌더링 되기 시작한 시점의 시간
- FCP 가 빠르면 사용자가 콘텐츠가 로드되었음을 인지하고 서비스를 더 빠르게 이용할 수 있음
- 1.8초 이하의 점수가 좋음

#### TTI(Time to Interactive)

- 앱이 사용자와 상호작용할 준비가 된 시점까지의 시간
- 화면이 그려지는 것과 거의 무관
- JS event 가 걸린 요소에 eventListener 를 연결
- hydration 개념과 연관

### 결론

- [web.dev: Rendering on the Web](https://web.dev/rendering-on-the-web/)
- [dev.to: Demystifying Rendering with Animations](https://dev.to/kefranabg/demystifying-ssr-csr-universal-and-static-rendering-with-animations-m7d?fbclid=IwAR31N68HLXa8lDnC3iOa7wsuQ4cDZBlKaUOgG_Fk7DovME2VYlG3ABtcczM)

![rendering](https://github.com/PollyGotACracker/hello-nextJS/assets/92136750/b6855425-dec4-4c63-9421-17ffa52c75c6)

- CSR:

  - 빈 화면(TTFB fast, TTI slow)
  - 번들 크기가 커질수록 두드러짐
  - 코드 스플리팅, 번들 압축, 트리 쉐이킹이 중요

- SSR:
  - 느린 응답(TTFB slow, TTI fast)
  - 싱글 스레드 renderToString 메서드 의 특징 상 최초 응답이 늦어질 수 있음
  - 번들 크기가 커질 경우, TTI 속도도 느려져 CSR 과 마찬가지의 단점을 가질 수 있음  
    \*\* `ReactDOMServer.renderToString`: React 트리를 HTML 문자열로 렌더링  
    서버사이드에서 사용하는 렌더링 함수로 `data-react-checksum` 이라는 attribute 가 추가된다.  
    이후 `ReactDOM.render` 로 클라이언트 사이드 렌더링을 한번 더 수행하여 서버사이드에서 생성된 HTML 에 event 속성을 연결한다.
