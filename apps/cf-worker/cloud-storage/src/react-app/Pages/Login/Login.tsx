import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { login } from '@/requests/login'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (res) => {
      if (res.code === 200) {
        nav('/admin/dashboard')
      } else {
        throw new Error(res.error || '登录失败')
      }
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  return (
    <div className="grid grid-rows-[1fr_auto_1fr] grid-cols-[1fr_auto_1fr] size-full">
      <Card className="col-start-2 col-end-2 row-start-2 row-end-2 min-w-[320px]">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            <h1>管理员登录</h1>
          </CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="text-sm text-red-500">{(error as Error).message}</p>}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              variant="outline"
              className="w-full cursor-pointer"
              disabled={!username || !password || isPending}
            >
              {isPending ? '登录中...' : '登录'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
