# Visual Regression Testing Using Cypress

MVP of a visual regression testing suite using Cypress.

## TL;DR: Cypress pros and cons

Pros:

- Test suite codebase is tiny

Cons:

- `cypress-plugin-snapshots` is so immature that we may be better served by a separate CLI tool step
- Due to `cypress-plugin-snapshots`, diff is only available when using `yarn cy:open`
-

## Does it work well in CI?

TODO

## Possible improvements

### Image diffing

In order to improve image comparison speed and workflow,
replace `cypress-plugin-snapshots` with a separate CLI image diffing tool such as https://github.com/n7olkachev/imgdiff
