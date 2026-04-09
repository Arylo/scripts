import DeleteButton from './DeleteButton'
import { deleteAdminPan } from '@/requests/fetchAdminPans'

interface DeletePanButtonProps {
  panId: string
  disabled?: boolean
  onSuccess?: () => void
}

export default function DeletePanButton({ panId, disabled, onSuccess }: DeletePanButtonProps) {
  return (
    <DeleteButton
      description="确定要删除该分享盘吗？此操作不可撤销。"
      mutationFn={() => deleteAdminPan(panId)}
      disabled={disabled}
      onSuccess={onSuccess}
    />
  )
}
