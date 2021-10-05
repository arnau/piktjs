import Module from "./pikchr"

const pikchr = Module()


/**
 * Takes a Pikchr string and renders it as SVG.
 *
 * This function delegates to the WebAssembly version of the C89 [Pikchr](https://pikchr.org/) library.
 */
export async function render(source, config = {}) {
  const {
    classes = "pikchr pikchr-render",
    darkMode = false,
    width = 0,
    height = 0,
  } = config

  const flags = darkMode ? 2 : 0

  const result = await pikchr.then(mod =>
    mod.ccall(
      "pikchr",
      "string",
      ["string", "string", "number", "number", "number"],
      [source, classes, flags, width, height]))

  return result
}


const diaStyles = `
  svg {
    display: block;
    margin: auto;
  }
`

function prefersScheme(scheme) {
  const query = `(prefers-color-scheme: ${scheme})`

  return window.matchMedia && window.matchMedia(query).matches
}

function isDark(mode) {
  // Always dark
  if (mode == "dark") {
    return true
  }

  // Delegate on system configuration
  if (mode == "auto" && prefersScheme("dark")) {
    return true
  }

  return false
}

function normaliseMode(mode) {
  return mode == null ? "light" : mode
}

/**
 * Registers the `PikDiagram` Web Component with the given name. Defaults to "pikt-diagram".
 */
export function definePiktDiagram(name = "pikt-diagram") {
  /**
   * A web component that renders the given Piktchr source as SVG.
   */
  class PiktDiagram extends HTMLElement {
    constructor() {
      super()
      this.root = this.attachShadow({ mode: "open" })
    }

    static get observedAttributes() {
      return ["mode"]
    }

    async attributeChangedCallback(attrName, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (attrName) {
        case "mode":
          this.mode = normaliseMode(newValue)
          break
        default:
          this[attrName] = this.hasAttribute(attrName)
        }
      }

      await this.render()
    }

    async render() {
      const darkMode = isDark(this.mode)
      const dia = await render(this._src, { darkMode })
      const wrap = this.root.querySelector("div")

      wrap.innerHTML = dia
    }

    async connectedCallback() {
      this.mode = normaliseMode(this.mode)
      this._src = this.textContent
      this.textContent = null
      const styles = document.createElement("style")
      styles.textContent = diaStyles
      this.root.append(styles)
      this.root.append(document.createElement("div"))

      await this.render()
    }

    source() {
      return this._src
    }

    async setSource(newValue) {
      this._src = newValue
      await this.render()
    }
  }

  customElements.define(name, PiktDiagram)
}
