import { Button } from '@/Components/ui/button'
import cc from 'classcat'
import { lazy, Suspense } from 'react'

const Pencil = lazy(() =>
  import('lucide-react').then((m) => ({ default: m.Pencil })),
)

export default function EditCodeButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" size="sm" {...props} className={cc(["cursor-pointer flex flex-row items-center gap-1", props.className])}>
      <Suspense>
        <Pencil className="size-3" />
      </Suspense>
      编辑
    </Button>
  )
}
