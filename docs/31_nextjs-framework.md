# Next.js 가 갖는 프레임워크의 특징

- [nextjs.org: What is Next.js?](https://nextjs.org/learn/foundations/about-nextjs/what-is-nextjs)
- [nextjs.org: Getting started with Next.js](https://nextjs.org/learn/foundations/from-react-to-nextjs/getting-started-with-nextjs)
- [nextjs.org: How Next.js works](https://nextjs.org/learn/foundations/how-nextjs-works)
- \_app.js, \_document.js 파일과 `getServerSideProps` 같은 함수가 어디에서 어떻게 이용되는지 알 수 없다.
- 라우팅 규칙: pages 폴더에서 [id].js 파일 작성
- API 규칙: api 폴더에서 파일 작성
<details>
<summary>_app.js 와 _document.js</summary>

## \_app.js

- 서버로 요청이 들어왔을 때 가장 먼저 실행되는 컴포넌트
- 페이지 간 유지해야 하는 공통 로직이나 레이아웃을 적용해야 할 때 사용
- 따라서 페이지를 라우팅 할 때마다 실행됨
- 전역 CSS 등을 포함

## \_document.js

- \_app.js 가 실행된 다음에 실행되는 컴포넌트
- Page를 렌더링 하는 태그들을 서버 측에서 렌더링 할 수 있도록 해주는 커스텀 파일
- 공통적으로 사용할 head 태그나 body 태그 안에 들어갈 내용들을 커스텀 할 때 사용
- tag / markup 부분과 연관됨
- Main 컴포넌트 이외의 부분들은 브라우저에서 실행되지 않기 때문에 비즈니스 로직을 포함하지 않도록 주의
- Font 등을 가져올 때 사용
</details>

## [next/image](https://nextjs.org/docs/pages/api-reference/components/image)

- 이미지는 웹 사이트의 FCP(First Contentful Paint) 성능을 가장 크게 좌우하는 요소 중 하나이다.
- Next.js는 미리 width와 height 값을 받아 CLS(Cumulative Layout Shift) 해소 및 이미지 사이즈 최적화를 수행한다.
- Image 컴포넌트는 `src` 속성으로 받은 이미지 주소를 조작하여 Next.js 내부 서버 API 쪽으로 경로를 돌린다. `/image?url={<원본 이미지 주소>}&w={<가로 픽셀 값>}&q={<세로 픽셀 값>}`
- `blur` 나 `placeholder` 속성을 사용하면 이미지가 아직 다 로드되지 않았을 때 미리 콘텐츠가 표시된 것처럼 보임으로써 '인지된 성능' 지표를 올릴 수 있다.
- 이미지 리사이징 속도와 cache 이슈 해결을 위해 sharp 라이브러리를 install 한다.

## Rendering 성능 이슈

- [web.dev: Critical rendering path render blocking css](https://web.dev/critical-rendering-path-render-blocking-css/)

- FOUC (Flash Of Unstyled Content) Issue => `useLayoutEffect`
  - 단, `useLayoutEffect` 는 서버환경에서 실행되지 않으므로 삼항 연산자를 사용한다.

```js
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

- Layout Shifting Issue => Next/Image

## Code Splitting

- [web.dev: Code-splitting with dynamic imports in Next.js](https://web.dev/i18n/ko/code-splitting-with-dynamic-imports-in-nextjs/)

## 프로덕션 배포 시 안정적인 서비스를 위한 권장 사항

- [nextjs.org: Production checklist](https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist)
