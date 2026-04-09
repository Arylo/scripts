import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { logout } from '@/requests/logout'

export default function Logout() {
  const nav = useNavigate()

  const { mutate } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      nav('/admin/login', { replace: true })
    },
  })

  useEffect(() => {
    mutate()
  }, [])

  return (
    <div className="flex items-center justify-center size-full min-h-dvh">
      <p className="text-gray-500">正在退出登录...</p>
    </div>
  )
}
