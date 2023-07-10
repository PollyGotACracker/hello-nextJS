# Assignment 01

- 전유영
- Vite, TypeScript, Styled-Components 사용

## :pushpin: 코드 수정

- 처음에는 Router 에서 children 을 순회해 path 에 맞는 Route 컴포넌트를 return 하는 방법을 생각했다. 코드를 짜면서 고민한 결과, 현재 path 가 변경될 때마다 반복문이 실행되는 것이 비효율적이라 느꼈고, 각 Route 에서 path props 를 어떻게 처리해야 할지 모르겠어서 Route 에서 조건 처리를 하기로 결정했다.
- _그러나 컴포넌트가 눈에 보이지 않더라도, 일단 컴포넌트가 마운트되면 그 내부 코드는 전부 실행된다._ 따라서 상위 컴포넌트에서 하위 컴포넌트의 마운트 여부를 처리하는 것이 효율적이다. 따라서 처음 생각했던 방식이 오히려 맞는 것이었다.

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

```tsx
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

```tsx
// Router.tsx
const Router: React.FC<Props> = ({ children }) => {
  const { currentPath } = useRouter();
  const childArray = Array.isArray(children) ? children : [children];

  return childArray.filter((route) => route.props.path === currentPath);
};
```

```tsx
// Route.tsx
const Route: React.FC<Props> = ({ path, component }) => {
  if (!path) throw new Error("No path specified");
  return component;
};
```

- Router.tsx 컴포넌트에서 현재 pathname 과 일치하는 path 를 가진 Route 컴포넌트를 반환합니다.

### 4. 최소한의 push 기능을 가진 useRouter Hook 작성

```tsx
const { push } = useRouter();
```

- useRouter.ts 에서 `useState`, `useEffect` 를 사용해 eventListener callback 에서 현재 pathname 을 저장합니다.  
  해당 custom hook 이 return 하는 `currentPath`, `push()`, `back()` 은 Button.tsx, Route.tsx 에서 페이지 이동 및 pathname 체크에 사용되었습니다.

```tsx
// useRouter.ts
return {
  // ...
  push: ({ state, path }: PushParams) => {
    const url = location.origin + path;
    const event = new PopStateEvent("popstate", { state: state });
    history.pushState(state, "", url);
    dispatchEvent(event);
  },
};
```

- 버튼을 클릭할 때 `history.pushState()` 만 호출할 경우 `popstate` 이벤트가 발생하지 않았습니다.  
  그래서 추가적으로 `dispatchEvent()` 를 사용해 `PopStateEvent` 객체를 전달했습니다.
