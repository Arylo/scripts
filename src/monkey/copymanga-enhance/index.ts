import parseConstant from "./scripts/utils/parseConstant";
import startTable from './scripts/table';
import startDetail from './scripts/detail';

const { comic, chapter } = parseConstant(location?.pathname)

if (comic && chapter) {
  console.log('start detail mode')
  startDetail()
} else if (comic) {
  console.log('start table mode')
  startTable()
}
