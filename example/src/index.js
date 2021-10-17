import { render, definePiktDiagram, definePiktEditor } from "pikt"


(function (document) {
  function setColorScheme() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const root = document.querySelector("html")
    const toggle = document.querySelector("#color-scheme")

    if (isDark) {
      root.classList.add("dark-scheme")
      toggle.setAttribute("checked", "checked")
    } else {
      root.classList.add("light-scheme")
    }

  }

  function toggleColorScheme() {
    const root = document.querySelector("html")
    const toggle = document.querySelector("#color-scheme")

    if (toggle.checked) {
      root.classList.add("dark-scheme")
      root.classList.remove("light-scheme")
    } else {
      root.classList.add("light-scheme")
      root.classList.remove("dark-scheme")
    }
  }

  function start() {
    setColorScheme()

    document.querySelector("#color-scheme")
      .addEventListener("change", toggleColorScheme, false)

    definePiktDiagram()
    definePiktEditor()
  }

  start()
}(document))


export { render }
