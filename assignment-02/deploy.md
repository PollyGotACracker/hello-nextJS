# Deploy

## gh-pages

```shell
npm i gh-pages
```

## package.json

```json
"homepage": "https://pollygotacracker.github.io/hello-nextJS",
  "scripts": {
    "build": "next build && next export",
    "predeploy": "npm run build",
    "deploy": "touch out/.nojekyll && gh-pages -d out --dotfiles",
  },
```

## next.config.js

```js
const isProduction = process.env.NODE_ENV === "production";
const nextConfig = {
  basePath: isProduction ? "/hello-nextJS" : "",
};

module.exports = nextConfig;
```

## env.production

```
GENERATE_SOURCEMAP = false
NEXT_PUBLIC_BASE_URL = https://pollygotacracker.github.io/hello-nextJS
```

## .gitignore

```
.env*
```
