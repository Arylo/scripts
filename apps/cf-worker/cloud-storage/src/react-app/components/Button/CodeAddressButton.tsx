import cc from 'classcat'
import { lazy, Suspense } from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const InputGroup = lazy(() => import('../ui/input-group').then((m) => ({ default: m.InputGroup })))
const InputGroupAddon = lazy(() =>
  import('../ui/input-group').then((m) => ({ default: m.InputGroupAddon })),
)
const InputGroupInput = lazy(() =>
  import('../ui/input-group').then((m) => ({ default: m.InputGroupInput })),
)
const Copy = lazy(() => import('lucide-react').then((m) => ({ default: m.Copy })))
const ExternalLink = lazy(() => import('lucide-react').then((m) => ({ default: m.ExternalLink })))

interface Props {
  codeValue: string
  buttonProps?: React.ComponentProps<typeof Button>
}

export default function CodeAddressButton({ codeValue, buttonProps = {} }: Props) {
  const url = `${location.origin}/?code=${codeValue}`
  const [, copyToClipboard] = useCopyToClipboard()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            {...buttonProps}
            className={cc(['cursor-pointer', buttonProps.className])}
          />
        }
      >
        提取地址
      </PopoverTrigger>
      <PopoverContent className="w-auto font-mono break-all w-80">
        <div className="flex flex-row gap-2 items-center">
          <Suspense fallback="请稍等...">
            <InputGroup>
              <InputGroupInput value={url} className="text-xs" readOnly />
              <InputGroupAddon align="inline-end">
                <Copy
                  className="size-4! cursor-pointer"
                  onClick={() => {
                    copyToClipboard(url)
                    toast.success(`提取码\`${codeValue}\`提取地址已复制到剪贴板`, {
                      position: 'top-right',
                    })
                  }}
                />
              </InputGroupAddon>
            </InputGroup>
            <ExternalLink
              className="size-5! cursor-pointer"
              onClick={() => window.open(url, '_blank')}
            />
          </Suspense>
        </div>
      </PopoverContent>
    </Popover>
  )
}
