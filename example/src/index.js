import { render } from "pikt"

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

  function start() {
    selectSource()

    sourceEl.addEventListener("input", renderScript, false)
    sourcePickerEl.addEventListener("change", selectSource, false)
    modeToggleEl.addEventListener("change", toggleMode, false)
  }

  start()
}(document))


export { render }
