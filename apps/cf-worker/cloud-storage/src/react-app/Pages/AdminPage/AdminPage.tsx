import cc from 'classcat'
import { Suspense } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import Card from '@/Components/Card/Card'
import { Button } from '@/Components/ui/button'

export default function AdminPage() {
  const nav = useNavigate()
  const location = useLocation()

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
      <div className={cc(['max-w-dvw max-h-dvh w-dvw h-dvh m-0 p-0', 'flex flex-row gap-4'])}>
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
            <Button variant="link" className="text-sm hover:text-lg cursor-pointer">
              退出登录
            </Button>
          </div>
        </div>
        <div className="py-2 flex flex-row gap-2 grow">
          <Card className="w-full rounded-r-none">
            <Suspense fallback={<div className="p-6">正在加载...</div>}>
              <Outlet />
            </Suspense>
          </Card>
        </div>
      </div>
    </>
  )
}
