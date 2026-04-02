import React from 'react'
import { createBrowserRouter } from 'react-router'
import App from './Pages/App/App'

const Home = React.lazy(() => import('./Pages/Home/Home'))
const Detail = React.lazy(() => import('./Pages/Detail/Detail'))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: ':keyId',
        Component: Detail,
      },
      {
        path: ':keyId/:fileName',
        Component: Detail,
      },
    ],
  },
])
