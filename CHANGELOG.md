# Changelog

## [3.0.0]

- **BREAKING-CHANGE** Files structure has been changed.
- **BREAKING-CHANGE** Variables has been fully rewritten and reorganized.
- **BREAKING-CHANGE** All variables are now defined as `!default`. This means you can configure or extend every component. Keep in mind to always check with designers every change on default components.
- **BREAKING-CHANGE** Pyxis Iconset is no more served via Pyxis. In the Pyxis's bundle you will find only the strictly-needed icons for the functioning of the system.
- **BREAKING-CHANGE** Atomic Design pattern has been abandoned in css rules. However we still use it to enforce structure inside Pyxis's filesystem.
- **BREAKING-CHANGE** Moved from `px` to `rem`.
- **BREAKING-CHANGE** No more utility classes with camelCase notation. Kebab-case is now the standard.
- **BREAKING-CHANGE** `Jumbotron` component is now `Hero`.

Variables 
- Old file `variables.scss` has been destructured into small pieces.

Typography
- `typography` has been fully revisited. 

Components
- Added `badge` component.
- Added `pills` component.
- Added `slider-arrows` component.
- Added `slider-dots` component.
- Added `alert-message` component.
- Renamed `jumbotron` to `hero`.
- Added `jumbotron` component.
- A lot of new skins and kinds previously defined on our client ecosystem are now part of the design system.

Utilities 
- Added `fontSize` mixin which keeps in sync `font-size` and `line-height`.
- Added `ie` mixin which allows to wrap a Internet Explorer specific ruleset.
- Added some mixins to create css icons.
- `mixins` were completely revisited.
- `helpers` were completely revisited.

Early Adoption 
- `css-grid` is now used to create our form grid structure. A `flex` fallback is used for not compliant browsers. 

#### Code check 
- Added a linter

#### Code style
- BEM pattern is now fully embraced with verbose class naming. This enforces hierarchy and reduces rules collision.
- BEM missing classes were fixed. 
- BEM wrong classes were fixed.
- `utility-classes` are now consistent and built via a `#{$ruleName}-#{$ruleValue}` pattern.

#### Bundle weight
Bundle weight is now heavily reduced because of Pyxis Iconset ouster.

## [2.1.0]
This version supports new Pyxis component Form that has a general new structure.
This version is heavily breaking. Change your overridings accordingly
Core
- **BREAKING-CHANGE**: old `m-form__field__group` has becomed `m-form-input-group` and stays in `form-input-group.scss` partial
- **BREAKING-CHANGE**: old `a-form__field` has becomed `a-form-field`
- **BREAKING-CHANGE**: old `m-form` has becomed `o-form`
- **BREAKING-CHANGE**: now `a-form__field` doesn't have any logic for hide/display validation messages (this should be provided by JS/elm)
- **BREAKING-CHANGE**: removed `label.scss` file. Label rules are now in `form-field.scss` and `form-field-list.scss`
- **NEW FEATURE**: new `m-form-field-list` that is an horizontal list of `a-form-field`

Modal
- Adds the `modal` organism

## [2.0.7]
**style fix**

Jumbotron
- Fixes jumbotron dimensions

## [2.0.6]
**style fix**

@Extend
- Removed `visuallyHidden` extend in `form` components

## [2.0.5]
**style fix**

Lists 
- Fixes internal `padding`

## [2.0.4]
**style changes**

Core 
- Moved `reset` in a dedicated folder to opt-in the use of this functionality

## [2.0.3]
**style changes**

Core 
- Add Eric Meyer's CSS reset

Typography
- Add margins to `h1, h2, h3, h4, p` and `a-lists` in order to keep spaces and normalize browser's behaviours.

Lists
- Add internal space

## [2.0.2]
**style changes**

Core 
- Removed `ignorePyxis` mixin

## [2.0.1]
**style changes**

Core 
- Moved `utilityClasses`, `fonts`, and `iconset` in a dedicated folder in order to prevent useless imports

Lists
- Fixes selector depth

## [2.0.0]
**style changes**

Core 
- Removed useless imports
- Fixed `box-sizing` property

## [1.9.3]
**style changes**

Core 
- Better errors in `helpers`

## [1.9.2]
**style changes**

Accordions 
- Removed border on accordion's header

Jumbotron
- Removed useless `o-jumbotron__picture__image` class

Utility Classes 
- Add `flexWrap, flexNoWrap, flexWrapReverse` classes

## [1.9.1]
**style changes**

Form
- Add the `has-warn` class to manage the new state introduced in `pyxis-components`

Sections
- Add the `a-section` atom which holds an `a-container` and sets vertical space only


**style fix**

Buttons
- Fix buttons hover and active state on `medium` breakpoint


## [1.9.0]
**style changes**

Container
- **BREAKING-CHANGE**: Now containers have a gutter only on mobile. Fluid container remains the same and has no gutter.

Utils
- New `containerWidth` function to return the width of a specific container size by passing the size variable. 

**BREAKING-CHANGE**: All the atoms variables have been moved into the variables stylesheet.

## [1.8.16]
**style fix**

Accordion
- Accordion content now sets childrens to `display: none;` until they become visibile by opening the accordion itself.

## [1.8.15]
**style changes**

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


**style fix** 

Container
- Now containers breakpoint are generated automatically with mixin

Accordion
- Accordion now apply transition on body content too

**project specific**
- Added specific test page for containers and button, please add a specific page for atoms/molecule testing in the future able to cover the majority of cases 

## [1.8.14]
**style changes**

Container
- ~~New container modifier `a-container--fluidOnBp[breakpoint]` that makes container fluid on specific breakpoint~~ **[removed in 1.8.15]**

- Removed `a-container--xsmall` and `a-container--small` modifiers (duplicated logic)

Accordion
- Add default flex direction column on `a-accordion__content`

## [1.8.13]
**style changes**

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

**style fix**

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

## [1.8.12]
**style changes**

- Accordion new design

## [1.8.11] 
**style changes**
- Add `overflow-x: hidden;` to html tag in order to fix OSX Safari error

**style fix**
- Rewrite `.a-accordion.is-open` rule in order to match correct selector

## [1.8.10] 
**style changes**
- Now radio checks are default without border at hover. Added `.a-form__field__radio__label--bordered` as option class to keep the border behaviour

**package changes**
- Dev webserver exposes `disableHostCheck` flag to work with ngrok

## [1.8.9]
**style fix**
- Solve `buttons` hover error.

## [1.8.8]
**style changes**
- Add `font-display: swap;` to improve FMP.

## [1.8.7]
**style changes**
- Add `woff2` support. 
- Rearrange `@font-face` directive to serve `woff` and `woff2` before others fallback extensions.
