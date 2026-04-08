import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_ID_COLUMN } from './base'
import { Code } from './Code'
import { Pan } from './Pan'

export const PanCode = sqliteTable('pan_code', {
  ...DEFAULT_ID_COLUMN,
  panId: text().references(() => Pan.id),
  codeId: text().references(() => Code.id),
})
