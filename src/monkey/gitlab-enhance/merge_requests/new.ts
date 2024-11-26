import * as templateUtils from './templateUtils'
import cssContent from './new.css'

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
  templateUtils.initTemplate()

  templateUtils.h2('Type')
    .taskItem('Feature (Story/Refactor)', { selected: branchType === BRANCH_TYPE.FEATURE })
    .taskItem(`Bugfix`, { selected: branchType === BRANCH_TYPE.BUGFIX })
    .taskItem(`Hotfix (Production Issues)`, { selected: branchType === BRANCH_TYPE.HOTFIX })
    .taskItem(`Tasks (DevOps / Unit Test / Document Update)`, { selected: branchType === BRANCH_TYPE.TASKS })
    .taskItem(`Others`, { selected: branchType === BRANCH_TYPE.OTHERS })
    .end()

  templateUtils.h2('Description')
  if (branchType !== BRANCH_TYPE.FEATURE) {
    templateUtils.h3('Why (Why does this happen?)')
      .listItem()
      .end()

    templateUtils.h3('How (How can we avoid or solve it?)')
      .listItem()
      .end()
  }

  templateUtils.h3('What (What did you do this time?)')
    .listItem()
    .end()

  if (branchType !== BRANCH_TYPE.TASKS) {
    templateUtils.h3('Results (Screenshot, etc)')
    templateUtils.h4('Before modification')
    templateUtils.h4('After modification')

    templateUtils.h2('Affected Zone')
      .listItem('Affected Module(s):')
      .listItem('Affected URL(s):')
      .end()
  }

  templateUtils.h2('External resources (Mention, Resolves, or Closes)')

  return templateUtils.getTemplate()
}

const appendButtons = () => {
  const classnames = 'gl-font-sm! gl-ml-3 gl-button btn btn-default btn-sm'
  const text = 'Copy Template'
  const ele = $(`<a class="${classnames}">${text}</a>`)
  const templateContent = generateTemplate()
  const hint = $('<span class="gl-font-sm! gl-ml-3 gl-text-secondary"></span>')
  let setTimeoutId: NodeJS.Timeout | undefined
  ele.on('click', async () => {
    hint.remove()
    setTimeoutId && clearTimeout(setTimeoutId)
    hint.text('Copying...')
    ele.after(hint)
    await GM_setClipboard(templateContent, 'text', () => {
      hint.text('Copied!')
      setTimeoutId = setTimeout(() => hint.remove(), 3000)
    })
  })

  $('.gl-display-flex:has([for=merge_request_description])').append(ele)
}

if (
  location.pathname.endsWith('/-/merge_requests/new') ||
  /\/-\/merge_requests\/\d+\/edit$/.test(location.pathname)
) {
  setTimeout(() => {
    GM_addStyle(cssContent)
    appendButtons()
  }, 1000)
}
