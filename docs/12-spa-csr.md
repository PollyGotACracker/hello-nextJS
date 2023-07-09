# SPA with CSR

## SPA (Single Page Application)

- 하나의 HTML 파일에서 JS 를 이용해 화면을 동적으로 바꾸는 방식
- 어플리케이션에 필요한 모든 정적 리소스를 최초 로드 시 단 한번 다운로드한다. 새로운 페이지 요청이 있으면 필요한 데이터만 전달받아 페이지를 업데이트한다.

## CSR (Client-side Rendering)

- 이전까지는 새로운 화면을 보려면 HTML 문서를 새로 받아와야 했다.
- 서버에서 최소한의 HTML 을 한번만 주고, 나머지 화면은 전부 JS 로 생성함으로써 최초 로딩 후 view 단은 server 와 완전히 분리된다.
- 화면을 바꾸는 데 필요한 데이터만 API 호출을 통해 JSON 객체로 받아온 뒤(fetch), 해당 부분의 데이터만 갈아끼우는 방식으로 화면을 구성한다.
- 기존 방식에 비해 페이지 전환이 부드러우며, 훨씬 동적이고 유려한 UX를 보여준다.
- 불필요한 통신으로 인한 overhead 가 감소하였다.

## CSR 에서의 browser rendering

1. 브라우저에서 서버에 웹 페이지 조회를 요청한다.
2. 서버는 요청 경로를 확인하고 HTML 문서를 서버 내 자원에서 찾아 응답한다.  
   (이 때 HTML body 태그 내부는 비어있는 상태)
3. 브라우저는 HTML 파일에서 head 태그를 읽어 추가 자원(JS, CSS 등)을 서버에 재요청한다.
4. entry 역할을 하는 JS 파일이 다운로드, 로딩 및 실행되면 JS 앱은 로직에 따라 DOM API 를 활용해 화면에 tag 를 그린다.
5. 초기 로딩 외 변경이 필요할 경우 서버 API 에 요청하여 받아온 데이터로 교체한다.
6. SPA / CSR 상황에서 페이지 이동(routing) 절차:
   6.1. 브라우저 경로 변경 시 trigger 되는 기본 HTTP GET 요청 차단
   6.2. 브라우저 주소는 변경 상태를 유지
   6.3. 변경을 감지하여 DOM API 가 다른 페이지에 알맞는 화면을 그림

## Critical Rendering Path: 중요 렌더링 경로

- [Chrome Developers: Inside browser](https://developer.chrome.com/blog/inside-browser-part3/)
- 웹 페이지가 브라우저에 load 되고 화면에 rendering 되는 과정
- rendering 은 state 를 변수로 받아 그에 따른 view 를 결과물로 출력하는 함수와 같다.

### rendering pipeline

- DOM + CSSOM => RenderTree + layout + paint => composite

  1. HTML 과 CSS 파일을 각자 parser 로 읽어와 의미 단위로 토큰화한다.
  2. 각각 DOM 과 CSSOM 으로 변환된다.
  3. 두 tree 를 합쳐 실제 화면을 그리기 위한 시각적 정보인 Render Tree 로 변환된다.
  4. 브라우저는 Render Tree 를 기반으로 각 요소의 위치를 계산(Layout), 화면을 그린다(Paint).
  5. 중간에 Render Tree 의 변화가 생기면 변화 범위에 따라 다시 Layout 또는 Paint 한다.
  6. 이 때 layout 과 paint 은 layer 단위로 이루어지므로, layer 간 쌓임 맥락(Stacking Context, z-index)을 고려하여 하나의 화면으로 합성하는 작업(Composite)이 필요하다.

- !! 변경이 발생한 범위나 속성에 따라 브라우저가 화면을 새로 그리는 범위는 달라진다.

### 1. Layout

- element 가 화면에서 얼마만큼 공간을 차지하고, 어디에 위치해야 하는지 정보를 계산하는 작업
- width 가 변경되면 Layout 과 그 하위 작업인 Paint, Composite 작업이 모두 일어난다.

### 2. Paint

- element 의 색상, 이미지, 테두리, 그림자 등 시각적 요소를 그리는 작업
- color 가 변경되면 Paint 와 Composite 작업이 일어난다.

### 3. Composite

- Paint 단계까지 나뉘어 있던 layer 들을 하나의 평면으로 합치는 작업
- transform, opacity 가 변경되는 경우 Composite 작업이 일어난다.  
  단, opacity 가 1이 되는 경우는 예외이다.

## React 가 CSR 을 최적화하는 원리

- [overreacted.io: react as a UI runtime](https://overreacted.io/ko/react-as-a-ui-runtime/)
- 브라우저에서 화면을 그리기 위해 일어나는 일련의 과정들은 변화가 발생했을 때 나타난다. 여기서 변화란 유저 차원에서 풍부한 인터렉션을 의미한다.

### cloneNode

```js
// view = render(state);
const render = (targetElement, state) => {
  const element = targetElement.cloneNode(true);
  // ...
  return element;
};
```

- 변경된 DOM 요소를 복제한 후, 변경한 요소를 실제 요소와 교체하여 새로운 화면을 보여주는 방식이다.
- rendering 작업이 일어나는 동안, 자바스크립트가 브라우저의 메인 스레드를 차단하면 '끊김 현상'이 일어난다. 이것이 Streaming SSR(비동기 렌더링)이 필요한 이유이다.

### scheduler

- 화면이 변경되는 프레임 횟수는 초당 60회(60Hz, 60fps)이다. `window.requestAnimationFrame()` 의 callback 은 메인 스레드를 차단하지 않고, 자바스크립트의 동작을 작은 덩어리로 나누어 프레임 수를 보장하고 부드러운 렌더링을 제공한다. 이 메서드는 re-paint 가 이벤트 루프에서 스케줄링 되기 직전에 실행된다.

```js
window.requestAnimationFrame(() => {
  const main = document.querySelector(".app");
  const newMain = view(main, state);
  main.replaceWith(newMain);
});
```

- 이같은 'scheduler' 와 'cloneNode' 의 원리를 합친 것이 React 의 rendering 최적화이다.
- React 는 변화가 있을 때마다 실제 DOM 이 아닌 메모리에 올려둔 virtualDOM 을 업데이트 한다. 또한 잦은 변화에 대비하여 화면에 변화를 반영할 타이밍을 스케줄러를 통해 관리한다. 변화는 스케줄러에 의해 배치(batch) 로 모아진 다음, 적절한 타이밍에 비동기적으로 한번에 처리된다.

```js
// react-reconciler/src/ReactFiberHooks.js#L1358
function dispatchAction(...) {
  if (...) {
    /* Render phase update... */
  } else {
    /* idle update... */
    scheduleWork(fiber, expirationTime);
  }
}
```

### 재조정 (Reconciliation)

- 새로운 정보를 response 받았을 때 주어진 React element tree 와 host tree 를 일치시키기 위해, host object tree 에 어떤 작업을 해야 할지 파악하는 프로세스
- DOMtree 를 돌면서, 각 노드의 변경 여부를 이진 탐색한다. React 의 상태 변경은 불변성(immutability)을 전제로 한다. 만약 부모 요소가 변경되었다면 그 부모와 자식 요소들은 virtualDOM 에 준비된 요소로 전부 교체된다.
- DOM 전체 교체가 아닌 diff 알고리즘을 적용하여 element 의 속성 수, 속성 변경 여부, 노드의 자식 요소 변경 여부를 체크하는 함수를 구현한다.

```js
window.requestAnimationFrame(() => {
  const main = document.querySelector(".todoapp");
  const newMain = registry.renderRoot(main, state);
  applyDiff(document.body, main, newMain);
});
```
