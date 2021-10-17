# Pikt.js

A JavaScript library for [Pikchr] in the browser.


## Usage

After installing the library using `npm install @arnau/pikt` you'll have two choices: a `render` function and a Web Component.

## `render` function

`render` is an asynchronous function wrapping the C `pikchr` function. It expects a pikchr source and optionally
some configuration and returns a SVG. For example, in the [Deno] repl you could:

```js
import { render } from "pikt"

const source = `box "pikt"`
const result = await render(source)
```

Will render a SVG as follows

```svg
<svg xmlns="http://www.w3.org/2000/svg" class="pikchr pikchr-render" viewBox="0 0 112.32 76.32">
<path d="M2,74L110,74L110,2L2,2Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
<text x="56" y="38" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">pikt</text>
</svg>
```

**Note**: Using the `node` repl will require using dynamic imports and resolving an issue with `__dirname`:

```js
const path = await import("path")
const __dirname = path.resolve()
const pikt = await import("./index.js")

await pikt.render(`box "foo"`)
```

If the process errors, for example due to a syntax mistake such as `box "pikt` (missing closing double quote), the result is the formatted error wrapped in a `div`:

```html
<div><pre>
/*    1 */
/*    2 */
/*    3 */              box "pikt
                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
ERROR: unrecognized token
</pre></div>
```

The `render` function accepts an object as second parameter to configure Pikchr's behaviour. For example:

```js
render(`box "pikt"`, { darkMode: true })
```

Will render the diagram with colours inverted for optimal display in dark backgrounds.

### Configuration options

- `darkMode` (boolean): If true, `fill` and `stroke` colours in the resulting SVG will be their inverse.
- `width`, `height` (number): When provided, Pikchr will use them to set a fixed `width` and `height` for the `svg` element.
- `classes` (string): The string is expected to be a valid space-separated list of class names. Defaults to `pikchr pikchr-render`.


## `pikt-diagram` web component

`definePiktDiagram` defines a custom element wrapping the `render` function. By default it registers the custom element
as `pikt-diagram` but it can be changed by passing a valid name to the function.

```js
// index.js
import { defineCustomElements } from "pikt"

definePiktDiagram()
```

```html
<!doctype html>
<html>
  <body>
    <pikt-diagram>
      <pre><code>
      box "pikt"
      </code></pre>
    </pikt-diagram>
  </body>
  <script type="text/javascript" src="index.js"></script>
</html>
```

Note that `pikt-diagram` expects the text inside the element to be valid pikchr markup. Any non-textual element is ignored. In the example above both `pre` and `code` don't affect the rendering of the resulting SVG but can help as fallback in case JavaScript is not executing properly.


### Attributes

The only attribute accepted by `pikt-diagram` is `mode` with a value of:

- `light`: Colours are untouched. Defaults are black for lines and text and transparent for backgrounds.
- `dark`: Colours are inverted.
- `auto`: Behaves like `light` or `dark` depending on the [`prefers-color-scheme`] value.

If `mode` is not provided it defaults to the `light` behaviour.


### Changing the colour scheme

`pikt-diagram` will respect `prefers-color-scheme` when using `mode=auto`. This can be insufficient in situations where you want to let users control the scheme indepedently of their system preference.

The [example](./example) shows a way to allow users to change the colour scheme using CSS filters.

In short, the idea is to add a class depending on `prefers-user-color` and use a few CSS rules as follow:

```css
:root {
  --light-background-color: ivory;
  --light-foreground-color: #222;

  --dark-background-color: #333;
  --dark-foreground-color: lightgreen;
}

.dark-scheme {
  --background-color: var(--dark-background-color);
  --foreground-color: var(--dark-foreground-color);
}

.dark-scheme pikt-diagram:not([mode]) {
  filter: invert(100%);
}
```

In the example above, `pikt-diagram` has _no_ `mode` attribute which defaults to light mode so, when `prefers-user-scheme: dark` is true, the class `.dark-theme` will be present and lines and text that by default are black will be rendered as white.


## Licence

Arnau Siches under the [MIT License](./LICENCE).

The [Pikchr] source `pikchr/pikchr.c` and the WebAssembly version embedded in `src/pikchr.js` are licenced under the
[BSD Zero Clause License].


[Pikchr]: https://pikchr.org/
[BSD Zero Clause License]: https://opensource.org/licenses/0BSD
[Deno]: https://deno.land/
[`prefers-color-scheme`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
