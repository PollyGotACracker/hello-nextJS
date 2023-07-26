---
slug: going-to-production
categories:
  - Development
  - Next.js
date: "2023-07-08"
title: Going to Production
description: Going to Production
tags:
  - Frontend
  - Next.js
  - Production
---

# Going to Production

Before taking your Next.js application to production, here are some recommendations to ensure the best user experience.

## In General

- Use caching wherever possible.
- Ensure your database and backend are deployed in the same region.
- Aim to ship the least amount of JavaScript possible.
- Defer loading heavy JavaScript bundles until needed.
- Ensure logging is set up.
- Ensure error handling is set up.
- Configure the 404 (Not Found) and 500 (Error) pages.
- Ensure you are measuring performance.
- Run Lighthouse to check for performance, best practices, accessibility, and SEO. For best results, use a production build of Next.js and use incognito in your browser so results aren't affected by extensions.
- Review Supported Browsers and Features.
- Improve performance using:
- next/image and Automatic Image Optimization
- Automatic Font Optimization
- Script Optimization
- Improve loading performance
