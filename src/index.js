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

const defaultEditorStyle = `
* {
  box-sizing: border-box;
}
.window {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 1fr;
  grid-gap: 0.5rem;
  min-height: 40vh;
  margin: 2rem 0 4rem;
}

@media (max-width: 600px) {
  .window {
    grid-auto-flow: row;
  }
}

.pane {
  border: 1px solid lightgrey;
}

#source {
  border: none;
  display: block;
  font-family: inherit;
  font-size: 100%;
  height: 99%;
  padding: 0.5rem;
  resize: none;
  width: 100%;
}

#sink {
  padding: 1rem;
}

#sink svg {
  display: block;
  margin: auto;
}
`


/**
 * UNSTABLE: Registers the `PikEditor` Web Component with the given name. Defaults to "pikt-editor".
 */
export function definePiktEditor(name = "pikt-editor") {
  class PiktEditor extends HTMLElement {
    constructor() {
      super()
      this.root = this.attachShadow({ mode: "open" })
    }

    static get observedAttributes() {
      return ["template"]
    }

    async attributeChangedCallback(attrName, oldValue, newValue) {
      if (newValue !== oldValue) {
        switch (attrName) {
          case "template":
            this.templateId = newValue
            await this.mountTemplate()
        }
      }

    }

    defaultTemplate() {
      const fragment = new DocumentFragment()
      const style = document.createElement('style')
      style.textContent = defaultEditorStyle
      fragment.append(style)

      const win = document.createElement('div')
      win.classList.add('window')

      const sourcePane = document.createElement('div')
      sourcePane.classList.add('pane')
      const source = document.createElement('textarea')
      source.setAttribute('id', 'source')
      source.setAttribute('spellcheck', 'false')
      sourcePane.append(source)
      win.append(sourcePane)

      const sinkPane = document.createElement('div')
      sinkPane.classList.add('pane')
      sinkPane.setAttribute('id', 'sink')
      win.append(sinkPane)

      fragment.append(win)

      this.root.append(fragment)
    }

    async mountTemplate() {
      const template = document.querySelector(`#${this.templateId}`);

      if (template) {
        const node = document.importNode(template.content, true);
        this.root.replaceChildren(node)

        const source = this.root.querySelector("#source")
        const sink = this.root.querySelector("#sink")

        if (source == null) {
          console.error("The template must have a `textarea` with `id=source`")
        }

        if (sink == null) {
          console.error("The template must have an element with `id=sink`")
        }

        if (source && sink) {
          if (source.textContent.trim() != "") {
            this._src = source.value
          }

          await this.render()
        }
      } else {
        this.defaultTemplate()
        await this.render()
      }
    }

    async render() {
      const dia = await render(this._src)
      const sink = this.root.querySelector("#sink")

      sink.innerHTML = dia
    }

    async connectedCallback() {
      this.root
        .addEventListener("keyup", (event) => {
          const { target } = event

          if (target.id == "source") {
            const { value } = target

            if (value == this.source()) { return }

            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.setSource(value)
            }, 500)
          }
        }, false)

      if (this.isConnected) {
        await this.mountTemplate()
      }
    }

    source() {
      return this._src
    }

    async setSource(newValue) {
      this._src = newValue
      await this.render()
    }
  }

  customElements.define(name, PiktEditor)
}
