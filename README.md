## PYXIS-NPM

Pyxis-NPM is the standard way to integrate Pyxis Design System into your project @Prima

### HOWTO
#### Include Pyxis CSS as dependency
Under dist folder you can find your last built of pyxis.css
#### Include Pyxis SASS and build your Pyxis Theme

#### Build Pyxis on your machine
This is aimed to be used for test purpose on pyxis branch directly, you shouldn't use out of the box transpiler in your project
````bash
yarn build:dev
````
Or (minified without source maps)
````bash
yarn build:prod
````

#### Serve a custom Pyxis on your local machine
After install launch webpack dev server in watch mode on your machine
````bash
yarn serve:dev
````
your pyxis is served at http://localhost:8080/pyxis.css. You can include it directly in your local projects
### Contribute
Pyxis  abstraction is a complex task far from being perfect so if you think we could do something better you can contact us or open a PR
