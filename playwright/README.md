# Visual regression testing using Playwright

## Requirements

- node > 14 (needed for fs promises etc.)

## Installation

```sh
cd playwright
yarn
```

## Usage

```sh
# Serve Pyxis example files
cd pyxis-npm
yarn serve
# Run tests
cd playwright
yarn test
```

To update baseline screenshots if the measured differences are not regressions, run:

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

## Comparison with other visual regression testing approaches

Pros:

- Faster than Cypress _and_ it additionally supports Webkit (used by Safari)
- It was trivially easy to make it run multiple tests in parallel, reusing as many resources as possible
- It's a simple CLI tool with an explicit main control flow, so it's easier to customize compared to opaque main control flow solutions

Cons:

- It's all custom. We have to deal with the burden of documentation, maintainance, fixing, avoiding bit rot...
- As a testament to the above issue, this implementation currently has some bugs.

## Known bugs

- Makes the host OS unresponsive in 10-15s bursts
- A few flaky false negatives every now and then
