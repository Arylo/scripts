import { Button } from '@/Components/ui/button'
import cc from 'classcat'
import { lazy, Suspense } from 'react'

const Undo2 = lazy(() =>
  import('lucide-react').then((m) => ({ default: m.Undo2 })),
)

export default function BackButton({
  children = '返回',
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      {...props}
      className={cc(['cursor-pointer', className])}
    >
      <Suspense>
        <Undo2 className="size-3.5" />
      </Suspense>
      {children}
    </Button>
  )
}
