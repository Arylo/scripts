import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog'
import { Button } from '@/Components/ui/button'
import { Spinner } from '../ui/spinner'
import { deleteAdminPan } from '@/requests/fetchAdminPans'

interface RemovePanButtonProps {
  panId: string
  onSuccess?: () => void
}

export default function RemovePanButton({ panId, onSuccess }: RemovePanButtonProps) {
  const [open, setOpen] = useState(false)

  const { mutate: removePan, isPending } = useMutation({
    mutationFn: () => deleteAdminPan(panId),
    onSuccess: () => {
      setOpen(false)
      onSuccess?.()
    },
  })

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className='cursor-pointer'
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {isPending && <Spinner data-icon="inline-start" />}
        移除
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认移除分享盘</AlertDialogTitle>
            <AlertDialogDescription>
              确定要移除该分享盘吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer' disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              取消
            </AlertDialogCancel>
            <AlertDialogAction className='cursor-pointer' disabled={isPending} onClick={() => removePan()}>
              {isPending && <Spinner data-icon="inline-start" />}
              确认移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
