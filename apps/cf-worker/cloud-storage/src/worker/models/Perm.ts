import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { CODE_PERM_TYPE, PAN_PERM_TYPE } from '../../shared/constant'
import { DEFAULT_COLUMNS } from './base'

export const Perm = sqliteTable('perm', {
  ...DEFAULT_COLUMNS,
  type: text({
    enum: [...Object.values(PAN_PERM_TYPE), ...Object.values(CODE_PERM_TYPE)] as [
      string,
      ...string[],
    ],
  }).notNull(),
  value: text()
    .notNull()
    .$defaultFn(() => '[]'),
})
