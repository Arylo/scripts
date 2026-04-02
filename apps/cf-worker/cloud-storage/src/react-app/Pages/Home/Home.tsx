import cc from 'classcat'
import SHA1 from 'crypto-js/sha1'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Card from '../../Components/Card/Card'

function Home() {
  const [code, setCode] = useState('')
  const nav = useNavigate()
  const onClick = () => {
    if (code) nav(`${SHA1(code).toString()}`)
  }
  return (
    <>
      <div className="grid grid-col grid-rows-[1fr_auto_1fr] grid-cols-[1fr_auto_1fr] size-full">
        <Card className="col-start-2 col-end-2 row-start-2 row-end-2 min-w-[320px] p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <input
                className={cc([
                  'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  {
                    'text-gray-800 border-gray-300 focus:border-blue-500 bg-white': code,
                    'text-gray-500 border-gray-200 bg-gray-50': !code,
                  },
                ])}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入取件码"
                value={code}
              />

              <button
                className={cc([
                  'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
                  {
                    'bg-gray-300 text-gray-500 cursor-not-allowed': !code,
                    'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 cursor-pointer':
                      code,
                  },
                ])}
                disabled={!code}
                onClick={() => onClick()}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>取件</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Home
