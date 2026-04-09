import { lazy, Suspense, useState } from 'react'
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
import UseKey from 'react-use/lib/component/UseKey'

interface DeleteButtonProps {
  triggerLabel?: string
  title?: string
  description?: string
  confirmLabel?: string
  mutationFn: () => Promise<unknown>
  disabled?: boolean
  onSuccess?: () => void
}

const Trash = lazy(() =>
  import('lucide-react').then((m) => ({ default: m.Trash })),
)

export default function DeleteButton({
  triggerLabel = '删除',
  title = '确认删除？',
  description = '确认要删除吗？此操作不可撤销。',
  confirmLabel = '确认删除',
  mutationFn,
  disabled,
  onSuccess,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn,
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
        className='cursor-pointer flex flex-row items-center gap-1  hover:scale-105'
        disabled={disabled || isPending}
        onClick={() => setOpen(true)}
      >
        {isPending ? <Spinner data-icon="inline-start" /> : <Suspense><Trash className='.5' /></Suspense>}
        {triggerLabel}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer' disabled={isPending}>
              {
                open && !isPending && <UseKey key="Escape" onKeyDown={() => setOpen(false)} />
              }
              取消
            </AlertDialogCancel>
            <AlertDialogAction className='cursor-pointer' disabled={isPending} onClick={() => mutate()}>
              {isPending && <Spinner data-icon="inline-start" />}
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
