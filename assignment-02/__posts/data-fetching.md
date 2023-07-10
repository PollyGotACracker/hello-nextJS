---
slug: data-fetching
categories:
  - Development
  - Next.js
date: "2023-07-09"
title: Data Fetching
description: Data Fetching
tags:
  - Frontend
  - Next.js
---

# Data Fetching

## getStaticProps

- If you export a function called `getStaticProps` (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by `getStaticProps`.

## getStaticPaths

- If a page has Dynamic Routes and uses `getStaticProps`, it needs to define a list of paths to be statically generated.
- When you export a function called `getStaticPaths` (Static Site Generation) from a page that uses dynamic routes, Next.js will statically pre-render all the paths specified by `getStaticPaths`.

```ts
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          name: "next.js",
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<{
  repo: Repo;
}> = async () => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();
  return { props: { repo } };
};

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count;
}
```
