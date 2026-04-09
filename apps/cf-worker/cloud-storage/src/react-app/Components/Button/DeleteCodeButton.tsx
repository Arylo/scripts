import DeleteButton from './DeleteButton'
import { deleteAdminCode } from '@/requests/fetchAdminCodes'

interface DeleteCodeButtonProps {
  panId: string
  codeId: string
  disabled?: boolean
  onSuccess?: () => void
}

export default function DeleteCodeButton({ panId, codeId, disabled, onSuccess }: DeleteCodeButtonProps) {
  return (
    <DeleteButton
      description="确定要删除该提取码吗？此操作不可撤销。"
      mutationFn={() => deleteAdminCode(panId, codeId)}
      disabled={disabled}
      onSuccess={onSuccess}
    />
  )
}
