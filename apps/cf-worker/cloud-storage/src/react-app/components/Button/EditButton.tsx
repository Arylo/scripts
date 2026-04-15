import cc from 'classcat'
import { lazy, Suspense } from 'react'
import { Button } from '@/components/ui/button'

const Pencil = lazy(() => import('lucide-react').then((m) => ({ default: m.Pencil })))

export default function EditButton({
  children = '编辑',
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="sm"
      {...props}
      className={cc([
        'cursor-pointer flex flex-row items-center gap-1 hover:scale-105',
        props.className,
      ])}
    >
      <Suspense>
        <Pencil className="size-3.5" />
      </Suspense>
      {children}
    </Button>
  )
}
