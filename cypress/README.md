# Visual Regression Testing Using Cypress

MVP of a visual regression testing suite using Cypress.

## Usage

In your local environment:

```sh
yarn serve
yarn cy:run
```

## Pros and cons of this solution

Pros:

- Test suite codebase is tiny
- Well-known: Cypress usage is already widespread in Prima, mostly for functional/e2e testing.

Cons:

- `cypress-plugin-snapshots` is so immature that we may be better served by a separate CLI tool step
- Due to `cypress-plugin-snapshots`, diff is only available when using `yarn cy:open`

## Does it work well in CI?

Cypress does, `cypress-plugin-snapshots` however is more of a question. It _does_ use the common Cypress screenshooting API, so it's promising.

In order to stabilize testing outcomes on all developers' machines, Cypress _must_ be used from a docker container (easy thanks to the `cypress:included` docker image).

## Is it fast? (<2-5mins)

**TODO**

- We should add all other Pyxis pages and compare with other solutions.
- I have no idea how well this testing suite can be _parallelized_, and how that would affect our testing times.

## Possible improvements

### Image diffing

In order to improve image comparison speed and workflow,
replace `cypress-plugin-snapshots` with a separate CLI image diffing tool such as https://github.com/n7olkachev/imgdiff
