import * as templateUtils from '../../../../packages/MdGenerator/index'
import templateCss from './template.css'
import { getButtonElement } from '../utils'

enum BRANCH_TYPE {
  FEATURE,
  BUGFIX,
  HOTFIX,
  TASKS,
  OTHERS,
}

const getBranchType = () => {
  const fromBranchName = $('.align-self-center code:not([data-branch-name])').text()
  const prefixBranchName = fromBranchName.split('/')[0].toLowerCase()
  switch (prefixBranchName) {
    case 'feature':
    case 'feat':
      return BRANCH_TYPE.FEATURE
    case 'fix':
    case 'bugfix':
      return BRANCH_TYPE.BUGFIX
    case 'hotfix':
      return BRANCH_TYPE.HOTFIX
    case 'devops':
    case 'chore':
    case 'test':
    case 'doc':
    case 'docs':
      return BRANCH_TYPE.TASKS
    default:
      return BRANCH_TYPE.OTHERS
  }
}

const generateTemplate = () => {
  const branchType = getBranchType()
  return templateUtils.genTemplate((utils) => {
    utils.h2('Type')
      .taskItem('Feature (Story/Refactor)', { selected: branchType === BRANCH_TYPE.FEATURE })
      .taskItem(`Bugfix`, { selected: branchType === BRANCH_TYPE.BUGFIX })
      .taskItem(`Hotfix (Production Issues)`, { selected: branchType === BRANCH_TYPE.HOTFIX })
      .taskItem(`Tasks (DevOps / Unit Test / Document Update)`, { selected: branchType === BRANCH_TYPE.TASKS })
      .taskItem(`Others`, { selected: branchType === BRANCH_TYPE.OTHERS })
      .end()

    utils.h2('Description')
    if (branchType !== BRANCH_TYPE.FEATURE) {
      utils.h3('Why (Why does this happen?)')
        .listItem()
        .end()

      utils.h3('How (How can we avoid or solve it?)')
        .listItem()
        .end()
    }

    utils.h3('What (What did you do this time?)')
      .listItem()
      .end()

    if (branchType !== BRANCH_TYPE.TASKS) {
      utils.h3('Results (Screenshot, etc)')
      utils.h4('Before modification')
      utils.h4('After modification')

      utils.h2('Affected Zone')
        .listItem('Affected Module(s):')
        .listItem('Affected URL(s):')
        .end()
    }

    utils.h2('External resources (Mention, Resolves, or Closes)')
  })
}

export const appendTemplateButton = () => {
  GM_addStyle(templateCss)
  const text = 'Copy Template'
  const btnElement = getButtonElement(text)
  const templateContent = generateTemplate()
  const hint = $('<span class="gl-font-sm! gl-ml-3 gl-text-secondary"></span>')
  let setTimeoutId: NodeJS.Timeout | undefined
  btnElement.on('click', async () => {
    hint.remove()
    setTimeoutId && clearTimeout(setTimeoutId)
    hint.text('Copying...')
    btnElement.after(hint)
    await GM_setClipboard(templateContent, 'text', () => {
      hint.text('Copied!')
      setTimeoutId = setTimeout(() => hint.remove(), 3000)
    })
  })

  $('.gl-display-flex:has([for=merge_request_description])').append(btnElement)
}
