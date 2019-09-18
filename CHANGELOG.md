## Changelog

### 2.0.7
**sass fix**

Jumbotron
- Fixes jumbotron dimensions

### 2.0.6
**sass fix**

@Extend
- Removed `visuallyHidden` extend in `form` components

### 2.0.5
**sass fix**

Lists 
- Fixes internal `padding`

### 2.0.4
**sass changes**

Core 
- Moved `reset` in a dedicated folder to opt-in the use of this functionality

### 2.0.3
**sass changes**

Core 
- Add Eric Meyer's CSS reset

Typography
- Add margins to `h1, h2, h3, h4, p` and `a-lists` in order to keep spaces and normalize browser's behaviours.

Lists
- Add internal space

### 2.0.2
**sass changes**

Core 
- Removed `ignorePyxis` mixin

### 2.0.1
**sass changes**

Core 
- Moved `utilityClasses`, `fonts`, and `iconset` in a dedicated folder in order to prevent useless imports

Lists
- Fixes selector depth

### 2.0.0
**sass changes**

Core 
- Removed useless imports
- Fixed `box-sizing` property

### 1.9.3
**sass changes**

Core 
- Better errors in `helpers`

### 1.9.2
**sass changes**

Accordions 
- Removed border on accordion's header

Jumbotron
- Removed useless `o-jumbotron__picture__image` class

Utility Classes 
- Add `flexWrap, flexNoWrap, flexWrapReverse` classes

### 1.9.1
**sass changes**

Form
- Add the `has-warn` class to manage the new state introduced in `pyxis-components`

Sections
- Add the `a-section` atom which holds an `a-container` and sets vertical space only


**sass fix**

Buttons
- Fix buttons hover and active state on `medium` breakpoint


### 1.9.0
**sass changes**

Container
- **BREAKING-CHANGE**: Now containers have a gutter only on mobile. Fluid container remains the same and has no gutter.

Utils
- New `containerWidth` function to return the width of a specific container size by passing the size variable. 

**BREAKING-CHANGE**: All the atoms variables have been moved into the variables stylesheet.

### 1.8.16
**sass fix**

Accordion
- Accordion content now sets childrens to `display: none;` until they become visibile by opening the accordion itself.

### 1.8.15
**sass changes**

Login
- added max width equal to `a-container` xsmall

Container
- **BREAKING-CHANGE**: Removed previously introduced `a-container--fluidOnBp
- **BREAKING-CHANGE**: `a-container--fluid` removed in favour of `a-containerFluid` 
- Now you can have containers of certain type that changes behaviour on certain breakpoints combining `a-container` and `a-containerFluid` with `a-containerOn[breakpoint]` and `a-containerFluidOn[breakpoint]` 

Accordion
- Accordion now have double border on top and bottom (accordion group modified to support this)

Utils
- Add `rem` function to get `rem` value by passing a `px` value. At the moment this function will always return the `px` result. We planned a full switch to `rem` units in later release


**sass fix** 

Container
- Now containers breakpoint are generated automatically with mixin

Accordion
- Accordion now apply transition on body content too

**project specific**
- Added specific test page for containers and button, please add a specific page for atoms/molecule testing in the future able to cover the majority of cases 

### 1.8.14
**sass changes**

Container
- ~~New container modifier `a-container--fluidOnBp[breakpoint]` that makes container fluid on specific breakpoint~~ **[removed in 1.8.15]**

- Removed `a-container--xsmall` and `a-container--small` modifiers (duplicated logic)

Accordion
- Add default flex direction column on `a-accordion__content`

### 1.8.13
**sass changes**

Accordion:
- Single accordion don't have visible border bottom when closed

Accordion Group:
- Accordion in accordion group have separation borders (all except last)

Button:
- Adjacent buttons doesn't have default margin anymore, use button group instead

Button Group:
- Buttons in button group have margin
- Removed duplicated flex justify modificators, use utility class instead
- New specific `m-btnGroup--coverFluid` modificator that allow inner buttons to cover it fully and as much as possible equally growing. Margins are supported until 4 buttons

Utils:
- New `withNElements(selector, n)` mixin that given a selector and a number generates a class that applies only if there are N child elements with that selector
- Added `space-evenly` as justify helper

**sass fix**

Button:
- `a-btn--primary` now have the same height of other buttons (invisible border)
- fixed margin in case of icon due to a duplicated margin setting
- `a-btn--smallOnBreakpoint[breakpoint]` now is applied correctly even on 0 to [small] media query

Links
- `a-link` now have line-height and font-size explicitly setted 
- `a-link--standalone` correct line-height
- `a-link--standalone` parametric without transform usage

**project specific**
- Updated default transpiler dependencies

### 1.8.12
**sass changes**

- Accordion new design

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
