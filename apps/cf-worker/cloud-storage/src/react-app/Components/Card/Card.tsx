import cc from 'classcat'
import { HTMLAttributes, PropsWithChildren } from 'react'

export default function Card(props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <>
      <div
        {...props}
        className={cc(['bg-white/92 rounded-lg shadow-md p-4', props.className])}
      ></div>
    </>
  )
}
