import { eq, getTableColumns } from 'drizzle-orm'
import {
  CODE_PERM_TYPE,
  PAN_PERM_DEFAULT_VALUE,
  PAN_PERM_TYPE,
} from '../../../shared/constant/perm'
import getDb from '../../db'
import { CodePerm } from '../../models/CodePerm'
import { PanPerm } from '../../models/PanPerm'
import { Perm } from '../../models/Perm'

export default async function getPerms(panId: string, codeId: string) {
  const db = getDb()
  const panPerms = await db
    .select(getTableColumns(Perm))
    .from(PanPerm)
    .innerJoin(Perm, eq(PanPerm.permId, Perm.id))
    .where(eq(PanPerm.panId, panId))
  const codePerms = await db
    .select(getTableColumns(Perm))
    .from(CodePerm)
    .innerJoin(Perm, eq(CodePerm.permId, Perm.id))
    .where(eq(CodePerm.codeId, codeId))

  return [
    {
      get canUpload() {
        return Boolean(
          (
            codePerms.find((perm) => perm.value && perm.type === CODE_PERM_TYPE.canUpload) ??
            panPerms.find((perm) => perm.value && perm.type === PAN_PERM_TYPE.canUpload) ?? {
              value: PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canUpload],
            }
          ).value,
        )
      },
      get canDownload() {
        return Boolean(
          (
            codePerms.find((perm) => perm.value && perm.type === CODE_PERM_TYPE.canDownload) ??
            panPerms.find((perm) => perm.value && perm.type === PAN_PERM_TYPE.canDownload) ?? {
              value: PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canDownload],
            }
          ).value,
        )
      },
      get canDelete() {
        return Boolean(
          (
            codePerms.find((perm) => perm.value && perm.type === CODE_PERM_TYPE.canDelete) ??
            panPerms.find((perm) => perm.value && perm.type === PAN_PERM_TYPE.canDelete) ?? {
              value: PAN_PERM_DEFAULT_VALUE[PAN_PERM_TYPE.canDelete],
            }
          ).value,
        )
      },
    },
  ] as const
}
