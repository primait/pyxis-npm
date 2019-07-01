# PYXIS-NPM

Pyxis-NPM is the standard way to integrate Pyxis Design System into your project @Prima. To use it in your project as npm dependency ask to mantainers or devops to join *prima-assicurazioni* organization on npm, once accepted your invitation you can login your machine typing ```npm login```. Then you can simply ask for pyxis as dependency with ```npm install @prima-assicurazioni/pyxis-npm```

## Pyxis:
[Costellazione della bussola](https://it.wikipedia.org/wiki/Bussola_(costellazione))
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/NGC_2818_by_the_Hubble_Space_Telescope.jpg/1920px-NGC_2818_by_the_Hubble_Space_Telescope.jpg)


## Project Structure
- Pyxis is structured with **BEM** in mind. From a main root entry point (*pyxis.scss*) 4 partials *_root.scss* are imported: base, atoms, molecules and organisms
- Order is important since **all** pyxis partials are built depending on mixins, functions and variables declared in *01_base*.

## HOWTO
### Include Pyxis CSS as dependency
Under dist folder you can find your last built of pyxis.css. This is the whole pyxis, is built with an high polyfill load with the following browserlist configuration.
```bash
> 0.05%
ie 10-11
```
You can copy the whole folder in your project assets but probably it's not the best choice

### Include Pyxis SASS or build your Pyxis Theme
To include pyxis as sass you can simply import pyxis.scss from your application sass entry point.
Depending on your transpiler configuration you may need to redefine **$fontPath** variable before and make it point to pyxis-npm fonts folder.
This variable is used to resolve file import of fonts with a relative path that changes from your configuration, remember that usually
in sass transpiler the paths are relative from the first entry point not related to specific partials.

### Build your Pyxis theme
If you need to customise pyxis try to respect pyxis folder structure in the parts that you need to change.

Example if you need to tune up variables and don't import the whole 01_base partials list
- Create a folder with the same name of the part that will change (eg 01_base since variables are there)
- Copy and paste 01_base/_root.scss partial from pyxis-npm in your project/01_base that you've created before
- Comment partials imports that you don't want to use
- Create a new _variables.scss file, redefine all the variables you need and at the end import the original pyxis-npm variables partial (fix relative paths to point at package partials)
- In your 01_base/_root import your variables partial
- In your app.scss entry point copy the import structure of pyxis.scss changing 01_base/_root with the one you've defined before (fix relative paths to point at package partials)

```scss
@import
  '01_base/_root', //Local redefinition

  'pyxis-npm/scss/02_atoms/_root', //Original pyxis-npm partials

  'pyxis-npm/scss/03_molecules/_root',

  'pyxis-npm/scss/04_organisms/_root';
```


### Build Pyxis on your machine
Pyxis-NPM ships out with a full configurated transpiler so you can build your pyxis.css and serve it locally
````bash
yarn build:dev
````
Or (minified without source maps)
````bash
yarn build:prod
````

## Local testing 
After install launch webpack dev server in watch mode on your machine
````bash
yarn serve
````
You can edit the test file in `src/test/index.html`. The page is reachable @ http://localhost:8080/test.html .


## Changelog

- **1.8.8** Add `font-display: swap;` to improve FMP.
- **1.8.7** Add `woff2` support. Rearrange `@font-face` directive to serve `woff` and `woff2` before others fallback extensions.
