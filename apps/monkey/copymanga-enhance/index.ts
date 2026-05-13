import startDetail from './scripts/detail'
import startInfo from './scripts/info'
import parseConstant from './scripts/utils/parseConstant'

const { comic, chapter } = parseConstant(location?.pathname)

if (comic && chapter) {
  console.log('start detail mode')
  startDetail()
} else if (comic) {
  console.log('start info mode')
  startInfo()
}
