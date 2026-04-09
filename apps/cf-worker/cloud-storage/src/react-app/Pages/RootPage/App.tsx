import cc from 'classcat'
import { Suspense } from 'react'
import { Outlet } from 'react-router'
import css from './App.module.css'

export default function App() {
  return (
    <>
      <div className={cc([css.app, 'max-w-dvw max-h-dvh w-dvw h-dvh m-0 p-0'])}>
        <Suspense fallback={'正在加载页面中...'}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}
