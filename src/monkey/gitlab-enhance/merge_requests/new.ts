import { appendTemplateButton } from "./template"

if (location.pathname.endsWith('/-/merge_requests/new')) {
  setTimeout(() => {
    appendTemplateButton()
  }, 1000)
}
