import { appendTemplateButton } from "./template"

if (/\/-\/merge_requests\/\d+\/edit$/.test(location.pathname)) {
  setTimeout(() => {
    appendTemplateButton()
  }, 1000)
}
