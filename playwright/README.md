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

## Possible improvements

We can take smaller screenshots. Some test routes don't fill a whole page.

## Pros and cons of this solution

Pros:

- Unlike Cypress, it supports Webkit (used by Safari)
- Seems to be faster than Cypress.
- _Tolerable_ runtime, ~8 minutes, can be greatly improved
- We can roll our own stuff (test case management, CLI UI, etc.)

Cons:

- We _have to_ roll our own stuff, document it, maintain it, be responsible for it when it breaks, deal with the high risk of orphaning that test code suffers from...
- As a testament to the above issue, this implementation currently has some bugs.

Current bugs:

- makes my Discord client crash
- makes my system unresponsive in 10-15s bursts
- some diff comparisons unexpectedly fail

Of course, to debug these issues, we can write tests which test this test suite... which is quite meta, and possibly a bit _too much_.
