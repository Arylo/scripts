import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DEFAULT_ID_COLUMN } from './base'
import { Doc } from './Doc'
import { Pan } from './Pan'

export const PanDoc = sqliteTable('pan_doc', {
  ...DEFAULT_ID_COLUMN,
  panId: text()
    .notNull()
    .references(() => Pan.id),
  docId: text()
    .notNull()
    .references(() => Doc.id),
  originalName: text().notNull(),
  highlight: integer({ mode: 'boolean' }).$defaultFn(() => false),
})
