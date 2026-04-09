import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router'

const Toaster = lazy(() => import('@/Components/ui/sonner').then((m) => ({ default: m.Toaster })))

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href="/admin/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/admin/favicon.svg" />
        <link rel="shortcut icon" href="/admin/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/admin/apple-touch-icon.png" />
        <link rel="manifest" href="/admin/site.webmanifest" />
      </Helmet>
      <Suspense>
        <Toaster />
      </Suspense>
      <Outlet />
    </>
  )
}
