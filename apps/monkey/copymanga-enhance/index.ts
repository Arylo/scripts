import startDetail from './scripts/detail'
import startTable from './scripts/table'
import parseConstant from './scripts/utils/parseConstant'

const { comic, chapter } = parseConstant(location?.pathname)

if (comic && chapter) {
  console.log('start detail mode')
  startDetail()
} else if (comic) {
  console.log('start table mode')
  startTable()
}
