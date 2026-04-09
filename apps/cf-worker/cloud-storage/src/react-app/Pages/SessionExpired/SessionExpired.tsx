import { useNavigate } from 'react-router'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'

export default function SessionExpired() {
  const nav = useNavigate()

  return (
    <div className="grid grid-rows-[1fr_auto_1fr] grid-cols-[1fr_auto_1fr] size-full min-h-dvh">
      <Card className="col-start-2 col-end-2 row-start-2 row-end-2 min-w-[320px]">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            <h1>会话已过期</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">您的登录会话已过期，请重新登录</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => nav('/admin/login')}>重新登录</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
