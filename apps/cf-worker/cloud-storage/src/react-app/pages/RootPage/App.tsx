import cc from 'classcat'
import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router'
import css from './App.module.css'

const Toaster = lazy(() => import('@/components/ui/sonner').then((m) => ({ default: m.Toaster })))

export default function App() {
  return (
    <>
      <Suspense>
        <Toaster />
      </Suspense>
      <div className={cc([css.app, 'max-w-dvw max-h-dvh w-dvw h-dvh m-0 p-0'])}>
        <Suspense fallback={'正在加载页面中...'}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}
