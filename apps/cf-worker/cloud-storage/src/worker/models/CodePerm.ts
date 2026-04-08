import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_ID_COLUMN } from './base'
import { Code } from './Code'
import { Perm } from './Perm'

export const CodePerm = sqliteTable('code_perm', {
  ...DEFAULT_ID_COLUMN,
  codeId: text().references(() => Code.id),
  permId: text().references(() => Perm.id),
})
