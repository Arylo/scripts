import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_COLUMNS } from './base'

export const Doc = sqliteTable('doc', {
  ...DEFAULT_COLUMNS,
  hash: text().notNull(),
  mimetype: text().notNull(),
  size: integer().notNull(),
})
