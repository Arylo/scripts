import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function Home() {
  const [code, setCode] = useState('')
  const [searchParams] = useSearchParams()
  useEffect(() => {
    setCode(searchParams.get('code') || '')
  }, [])
  const nav = useNavigate()
  const onClick = () => {
    if (code) nav(`/pan/${code}`)
  }
  return (
    <>
      <div className="grid grid-col grid-rows-[1fr_auto_1fr] grid-cols-[1fr_auto_1fr] size-full">
        <Card className="col-start-2 col-end-2 row-start-2 row-end-2 min-w-[320px]">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              <h1>有乜啰乜</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              onChange={(e) => setCode(e.target.value)}
              placeholder="请输入取件码"
              value={code}
              required
            />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              disabled={!code}
              onClick={() => onClick()}
            >
              取件
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default Home
