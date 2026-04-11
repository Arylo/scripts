import { getContext } from 'hono/context-storage'
import { GeneralEnv } from '../../types/hono'

function checkPermType(type: string, typeMap: Record<string, string>) {
  const c = getContext<GeneralEnv>()
  if (!type) {
    c.json(
      {
        code: 400,
        message: 'Missing perm type',
      },
      400,
    )
    return [false] as const
  }
  const isValidType = Object.values(typeMap).includes(type)
  if (!isValidType) {
    c.json(
      {
        code: 400,
        message: 'Invalid perm type',
      },
      400,
    )
    return [false] as const
  }
  return [isValidType, type] as const
}

export default checkPermType
