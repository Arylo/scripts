import { getButtonElement } from "../utils"
import { appendTemplateButton } from "./template"

const appendAsTitleButton = () => {
  $('.commit-content').each((_, el) => {
    const titleElements = $('.item-title', el)
    const title = titleElements.text()
    const btnElement = getButtonElement('As title')
    btnElement.on('click', () => {
      $('input[data-testid=issuable-form-title-field]').val(title)
      $('input[data-testid=issuable-form-title-field]').focus()
    })
    $('.committer', el).before(btnElement)
  })
}

if (location.pathname.endsWith('/-/merge_requests/new')) {
  setTimeout(() => {
    appendTemplateButton()
    appendAsTitleButton()
  }, 1000)
}
