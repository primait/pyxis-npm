## Changelog

### 1.8.11 
**sass changes**
- Add `overflow-x: hidden;` to html tag in order to fix OSX Safari error

**sass fix**
- Rewrite `.a-accordion.is-open` rule in order to match correct selector

### 1.8.10 
**sass changes**
- Now radio checks are default without border at hover. Added `.a-form__field__radio__label--bordered` as option class to keep the border behaviour

**package changes**
- Dev webserver exposes `disableHostCheck` flag to work with ngrok

### 1.8.9
**sass fix**
- Solve `buttons` hover error.

### 1.8.8
**sass changes**
- Add `font-display: swap;` to improve FMP.

### 1.8.7
**sass changes**
- Add `woff2` support. 
- Rearrange `@font-face` directive to serve `woff` and `woff2` before others fallback extensions.
