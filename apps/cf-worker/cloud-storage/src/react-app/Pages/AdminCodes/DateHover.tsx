import dayjs from 'dayjs'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/Components/ui/hover-card'
import diffDate from '@/utils/diffDate'

export default function DateHover({ value }: { value: number | string | Date }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <span className="hover:border-b border-dashed border-black">{diffDate(value)}</span>
      </HoverCardTrigger>
      <HoverCardContent className="text-center text-xs">
        {dayjs(value).format('YYYY/MM/DD HH:mm:ss')}
      </HoverCardContent>
    </HoverCard>
  )
}
