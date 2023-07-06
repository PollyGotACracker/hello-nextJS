# MPA

## MPA (Multi Page Application)

- 여러 개의 HTML 파일로 웹 애플리케이션을 구성하는 방식
- 새로운 페이지를 요청할 때마다 정적 리소스를 다운받고 전체 페이지를 다시 렌더링한다.
- 정적 페이지를 그대로 serving 하기 때문에 SEO 나 페이지 로딩 속도 측면에서 이점을 갖는다.

## Routing

- 경로(url)에 따라 다른 화면(view)을 보여주는 것
- HTTP 요청을 보낼 때, 물리적 자원 `/assets/profile.jpg`을 서버에 요청하는 것

## AJAX (Asynchronous JavaScript and XML)

- AJAX 기술이 등장하기 이전에는, 서버에서 새로운 HTML 파일을 받아와 화면에 표시하려면 form `onsubmit` 시 '화면 업데이트'를 위한 새로고침 동작이 필요했다.
  - form `method` 속성의 `"GET"`, `"POST"`, `action` 속성
  - `e.preventDefault()`
- AJAX 의 등장으로 정보의 갱신을 '동기'에서 '비동기'로 대체할 수 있게 되었다.
  - 동기: 사용자 action -> 모든 동작 중지 -> 새로운 정보를 받아올 때까지 대기 -> 새로운 정보를 화면에 표시
  - 비동기: 사용자 Action -> 페이지가 정상 동작하면서도 서버에 새로운 정보 요청 -> 화면을 새로운 정보로 대체

## Server-side Template Engine

- template 에서 서버 데이터를 받아 동적으로 HTML 페이지 생성
- 사용자 요청을 받으면, 미리 준비된 템플릿을 기반으로 HTML DOM 을 생성해 즉시 응답함으로써 동적인 내용을 보여줄 수 있다.
- 그러나 새로운 페이지를 보여주기 위해 화면을 새로고침하는 원리는 동일하다.
- e.g. PHP, Django, ruby on rails, JSP, mustache(java), 예전에 배웠던 ejs, pug...
