import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_COLUMNS } from './base'

export const Code = sqliteTable('code', {
  ...DEFAULT_COLUMNS,
  value: text(),
  active: integer({ mode: 'boolean' }).$defaultFn(() => true),
})
