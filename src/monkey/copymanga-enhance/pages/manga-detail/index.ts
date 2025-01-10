import { chapter, comic } from "../../constant";
// import getPageInfoInPage from "./utils/getPageInfoInPage";
import store from './store'
import { render } from "./components/Index/new";

(async () => {
  if (!(comic && chapter)) return
  // let pageInfo = await getPageInfoInPage()
  // store.info.save(pageInfo)
  console.log(store.info.get())
  render()
})()
