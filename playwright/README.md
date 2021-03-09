# Visual regression testing using Playwright

TL;DR: Playwright forces us to maintain a lot more custom code than Cypress, but may be faster.

Also, it was trivially easy to parallelize.

## Usage

```sh
cd pyxis-npm
yarn serve
cd playwright
yarn test
```

To update baseline screenshots if appropriate, run:

```sh
yarn test -u
```

## Do we need to couple it with Jest?

Not really.

An exploration was done about using Jest to handle separate test cases. Here's what I found:

- We don't need Jest's assertion framework since we only care about our custom screenshot diffing
- Jest made the control flow opaque a.k.a. hard to debug
- Jest doesn't play too nice with async/await

Also, the suggested [Jest/Playwright integration](https://github.com/playwright-community/jest-playwright) is very immature. It's scarcely documented, and for some (good? I didn't investigate) reason makes tests run unacceptably slow (> 8s per screenshot).

## Possible speedups

We can take smaller screenshots. Some test routes don't fill a whole page.
We can take fewer snapshots: probably not all tests make sense (e.g. multiple devices which fall under the same breakpoints)

## Pros and cons of this solution

Pros:

- Unlike Cypress, it supports Webkit (used by Safari)
- Seems to be faster than Cypress.
- Pretty good runtime, ~3.5 minutes, which can be greatly improved, too
- We can roll our own stuff (test case management, CLI UI, etc.)

Cons:

- We _have to_ roll our own stuff, document it, maintain it, be responsible for it when it breaks, deal with the high risk of orphaning that test code suffers from...
- As a testament to the above issue, this implementation currently has some bugs.

## Current bugs

- makes my Discord client crash
- makes my system unresponsive in 10-15s bursts
- Some (1-2) flaky false negatives every now and then
