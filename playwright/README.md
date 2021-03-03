# Visual regression testing using Playwright

## Do we need Jest?

Adding Jest ended up being just wasted effort. We don't really need to do any assertions beyond screenshot matching, which is custom anyway.
Also, the suggested [Jest/Playwright integration](https://github.com/playwright-community/jest-playwright) is a joke. It's scarcely documented, and for some (good? I didn't investigate) reason makes tests run unbelievably slow.

## Pros and cons

Pros:

-

Cons:

-
