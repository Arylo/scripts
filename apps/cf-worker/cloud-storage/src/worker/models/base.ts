import { text, integer } from 'drizzle-orm/sqlite-core'
import { ulid } from 'ulid'

export const DEFAULT_ID_COLUMN = {
  id: text()
    .primaryKey()
    .$defaultFn(() => ulid()),
} as const

export const DEFAULT_COLUMNS = {
  ...DEFAULT_ID_COLUMN,
  updatedAt: integer({ mode: 'timestamp' })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
  createdAt: integer({ mode: 'timestamp' }).$default(() => new Date()),
} as const
