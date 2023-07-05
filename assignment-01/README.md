# Assignment 01

- 전유영
- Vite, TypeScript, Styled-Components 사용

## 과제 1) Next.js 프로젝트에서 yarn start(or npm run start) 스크립트를 실행했을 때 실행되는 코드 설명

- [notion 페이지](https://pollygotacracker.notion.site/1-1-1de729e91498468aa5feb190bc51eb05)

## 과제 2) SPA Router 기능 구현

### 1. 주소에 맞는 페이지 렌더링

- `/` → `root` 페이지
- `/about` → `about` 페이지

![url](https://github.com/PollyGotACracker/hello-nextJS/assets/92136750/0e5be80c-0682-4928-8717-3bb8932167b8)

### 2. 버튼을 클릭하면 해당 페이지로, 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동

- 힌트: `window.onpopstate`, `window.location.pathname`, History API(`pushState`)

![click](https://github.com/PollyGotACracker/hello-nextJS/assets/92136750/c1cc9b84-4885-4ca8-bf4d-b65e45118fec)

### 3. Router, Route 컴포넌트 구현

```js
// main.tsx
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Route path={PATH.ROOT} component={<Root />} />
      <Route path={PATH.ABOUT} component={<About />} />
    </Router>
  </React.StrictMode>
);
```

- constants 폴더에서 `PATH` 를 import 하여 상수를 관리했습니다.

### 4. 최소한의 push 기능을 가진 useRouter Hook 작성

```js
const { push } = useRouter();
```

- useRouter.ts 에서 `useState`, `useEffect` 를 사용해 eventListener callback 에서 현재 pathname 을 저장합니다.  
  해당 custom hook 이 return 하는 `currentPath`, `push()`, `back()` 은 Button.tsx, Route.tsx 에서 페이지 이동 및 pathname 체크에 사용되었습니다.

```js
// useRouter.ts
return {
  // ...
  push: ({ state, path }: PushProps) => {
    const url = location.origin + path;
    const event = new PopStateEvent("popstate", { state: state });
    history.pushState(state, "", url);
    dispatchEvent(event);
  },
};
```

- 버튼을 클릭할 때 `history.pushState()` 만 호출할 경우 `popstate` 이벤트가 발생하지 않았습니다.  
  그래서 추가적으로 `dispatchEvent()` 를 사용해 `PopStateEvent` 객체를 전달했습니다.
