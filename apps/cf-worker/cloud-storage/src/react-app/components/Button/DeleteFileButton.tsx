import { deleteAdminPanFile } from '@/requests/fetchAdminPanDetail'
import DeleteButton from './DeleteButton'

interface DeleteFileButtonProps {
  panId: string
  fileHash: string
  disabled?: boolean
  onSuccess?: () => void
}

export default function DeleteFileButton({
  panId,
  fileHash,
  disabled,
  onSuccess,
}: DeleteFileButtonProps) {
  return (
    <DeleteButton
      description="确定要删除该文件吗？此操作不可撤销。"
      mutationFn={() => deleteAdminPanFile(panId, fileHash)}
      disabled={disabled}
      onSuccess={onSuccess}
    />
  )
}
