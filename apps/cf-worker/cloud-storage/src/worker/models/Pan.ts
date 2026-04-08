import { integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { DEFAULT_COLUMNS } from './base'

export const Pan = sqliteTable('pan', {
  ...DEFAULT_COLUMNS,
  active: integer({ mode: 'boolean' }).$defaultFn(() => true),
})
