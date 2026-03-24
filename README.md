# PYXIS-NPM

> [!WARNING]
> **This repository is in maintenance mode and must not be used for new projects.**
>
> `@prima-assicurazioni/pyxis-npm` is kept only for legacy consumers that still depend on it.
>
> **Please migrate to the current Pyxis repository as soon as possible:**  
> https://github.com/primait/pyxis

## Status

This package is **legacy** and is currently maintained in **maintenance mode**.

That means:

- no new features will be added
- no new projects should adopt it
- support is limited to critical fixes and essential maintenance
- existing consumers should plan a migration to the new Pyxis repository

## What to use instead

Use the current Pyxis repository instead:

**https://github.com/primait/pyxis**

If you are starting a new project, do **not** use this package.

If you are currently using this package, you should plan to migrate away from it as soon as possible.


# Legacy README.md

## How to include Pyxis in your project

### Including Pyxis as pre-built CSS

_Not recommended_.

Copy the contents of the `dist` folder into your project's assets. It contains a build of the whole pyxis design system, built with a high polyfill load, with the following browserlist configuration:

```bash
> 0.05%
ie 10-11
```

### Including Pyxis as SASS or building your Pyxis Theme

To include pyxis as sass you can simply import pyxis.scss from your application's sass entry point.

Depending on your transpiler's configuration you may first need to redefine the **$fontPath** variable, making it point to the pyxis-npm `fonts` folder.
This variable is used to resolve file imports of fonts with a relative path that depends on your configuration.
Remember that usually, in sass transpilers, paths are relative to the main entry point, not to specific partials.

### Build your Pyxis theme

If you need to customise Pyxis, try to respect its folder structure.

E.g. if you need to tune up variables without importing the whole 01_base partials list

- Create a folder with the same name of the part that will change (eg 01_base since variables are there)
- Copy and paste 01_base/\_root.scss partial from pyxis-npm in your project/01_base that you've created before
- Comment partials imports that you don't want to use
- Create a new \_variables.scss file, redefine all the variables you need and at the end import the original pyxis-npm variables partial (fix relative paths to point at package partials)
- In your 01_base/\_root import your variables partial
- In your app.scss entry point copy the import structure of pyxis.scss changing 01_base/\_root with the one you've defined before (fix relative paths to point at package partials)

```scss
@import "01_base/_root",
  // Local redefinition
  "pyxis-npm/scss/02_atoms/_root", // Original pyxis-npm partials
  "pyxis-npm/scss/03_molecules/_root", "pyxis-npm/scss/04_organisms/_root";
```

### Build Pyxis on your machine

Pyxis-NPM ships out with a fully configured transpiler, so you can build your pyxis.css and serve it locally:

```bash
yarn build:dev
```

Or (minified without source maps):

```bash
yarn build:prod
```

## Testing

After installing, you can browse pyxis examples by launching a webpack dev server in watch mode on your machine:

```bash
yarn serve
```

Example files are stored in `src/test/`. Their pages are reachable @ http://localhost:8080/test/myTestFile.html .

### Visual regression testing

Recently and automated visual regression testing suite has been added to Pyxis, in the `playwright/` folder. Its [README](playwright/README.md) contains up-to-date info on how to perform automated tests on Pyxis examples, using multiple browsers at multiple screen sizes.

## Copyright and license

Code copyright 2019 PrimaIT. Code released under [the ICS license](https://github.com/primait/pyxis-npm/blob/master/LICENSE.md).

[npm-link]: https://www.npmjs.com/package/@prima-assicurazioni/pyxis-npm
