import less from '../frame/less'
import getKeyWithPrefixes from '../utils/getKeyWithPrefixes'

const WHITE_LIST = ['/']

export default () =>
  less(async (ctx, next) => {
    // 这里仅使用cookie 的pwd
    await getKeyWithPrefixes(ctx)
    await next()
  }, WHITE_LIST)
