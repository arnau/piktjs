import { render, definePiktDiagram } from "pikt"

(function (document) {
  let sourceEl = document.getElementById("source")
  let modeToggleEl = document.getElementById("dark-mode")
  let sourcePickerEl = document.getElementById("source-picker")
  let sinkEl = document.getElementById("sink")

  function toggleMode() {
    const darkMode = modeToggleEl.checked
    const body = document.querySelector("body")

    if (darkMode) {
      body.classList.add("dark-mode")
    } else {
      body.classList.remove("dark-mode")
    }

    renderScript()
  }

  async function renderScript() {
    const darkMode = modeToggleEl.checked

    sinkEl.innerHTML = await render(sourceEl.value, { darkMode })
  }

  function selectSource() {
    const source = sourcePickerEl.options[sourcePickerEl.selectedIndex].value

    fetch(source)
      .then(response => response.text())
      .then(data => {
        sourceEl.value = data
        renderScript()
      })
  }

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
    // selectSource()

    // sourceEl.addEventListener("input", renderScript, false)
    // sourcePickerEl.addEventListener("change", selectSource, false)
    // modeToggleEl.addEventListener("change", toggleMode, false)

    setColorScheme()

    document.querySelector("#color-scheme")
      .addEventListener("change", toggleColorScheme, false)

    definePiktDiagram()
  }

  start()
}(document))


export { render }
