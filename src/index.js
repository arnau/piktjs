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
