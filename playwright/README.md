# Visual regression testing using Playwright

TL;DR: Playwright forces us to maintain more custom code than Cypress, but may be faster.

## Usage

```sh
cd pyxis-npm
yarn serve
cd playwright
yarn test
```

## Do we need to couple it with Jest?

Nope.

An exploration was done about using Jest to handle separate test cases. Here's what I found:

- Jest made the control flow opaque a.k.a. hard to debug
- Jest doesn't play too nice with async/await
- We don't need Jest's assertion framework since we only do our custom screenshot diffing

Also, the suggested [Jest/Playwright integration](https://github.com/playwright-community/jest-playwright) is very immature. It's scarcely documented, and for some (good? I didn't investigate) reason makes tests run unacceptably slow (> 8s per screenshot).

## Pros and cons of this solution

Pros:

- Unlike Cypress, it supports Webkit (used by Safari)
- Seems to be faster than Cypress. We should run some measurements.
- We can roll our own stuff (test case management, CLI UI, etc.)

Cons:

- We _have to_ roll our own stuff, document it, maintain it, be responsible for it when it breaks, deal with the high risk of orphaning that test code suffers from...
