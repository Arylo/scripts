import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_ID_COLUMN } from './base'
import { Pan } from './Pan'
import { Perm } from './Perm'

export const PanPerm = sqliteTable('pan_perm', {
  ...DEFAULT_ID_COLUMN,
  panId: text().references(() => Pan.id),
  permId: text().references(() => Perm.id),
})
