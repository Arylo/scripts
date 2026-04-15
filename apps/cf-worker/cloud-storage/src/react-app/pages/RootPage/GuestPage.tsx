import { Helmet } from 'react-helmet'
import { useNavigate, Outlet } from 'react-router'
import { useEvent } from 'react-use'
import { GUEST_REDIRECT_HOME_EVENT } from '@/utils/guestFetch'

export default function GuestPage() {
  const navigate = useNavigate()

  useEvent(
    GUEST_REDIRECT_HOME_EVENT,
    () => {
      navigate('/')
    },
    window,
  )

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Helmet>
      <Outlet />
    </>
  )
}
