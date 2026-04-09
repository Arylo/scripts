import cc from 'classcat'
import { Suspense } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useEvent } from 'react-use'
import Card from '@/Components/Card/Card'
import { Button } from '@/Components/ui/button'
import { ADMIN_SESSION_EXPIRED_EVENT } from '@/utils/adminFetch'

export default function AdminManagementPage() {
  const nav = useNavigate()
  const location = useLocation()

  useEvent(
    ADMIN_SESSION_EXPIRED_EVENT,
    () => {
      nav('/admin/session-expired', { replace: true })
    },
    window,
  )

  const menus = [
    {
      title: '仪表盘',
      path: '/admin/dashboard',
    },
    {
      title: '分享盘管理',
      path: '/admin/pans',
    },
    {
      title: '提取码管理',
      path: '/admin/codes',
    },
  ]

  return (
    <>
      <div className="max-w-dvw max-h-dvh w-dvw h-dvh m-0 p-0 min-h-0 flex flex-row gap-4">
        <div className="min-w-[200px] bg-white/95 flex flex-col">
          <div className="border-b p-4">
            <h1 className="text-2xl font-bold">管理员后台</h1>
          </div>
          <div className="grow">
            {menus.map((menu, index) => (
              <div
                key={index}
                onClick={() => nav(menu.path)}
                className={cc([
                  'min-h-[50px] flex items-center px-4',
                  {
                    'bg-gray-200': location.pathname === menu.path,
                    'cursor-pointer hover:bg-gray-200': location.pathname !== menu.path,
                  },
                ])}
              >
                {menu.title}
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <Button
              variant="link"
              className="text-sm hover:text-lg cursor-pointer"
              onClick={() => nav('/admin/logout')}
            >
              退出登录
            </Button>
          </div>
        </div>
        <div className="py-2 flex flex-row gap-2 grow min-h-0">
          <Card className="w-full min-h-0 rounded-r-none overflow-hidden flex flex-col">
            <Suspense fallback={<div className="p-6">正在加载...</div>}>
              <Outlet />
            </Suspense>
          </Card>
        </div>
      </div>
    </>
  )
}
