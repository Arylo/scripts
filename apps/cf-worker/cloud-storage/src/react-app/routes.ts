import React from 'react'
import { createBrowserRouter } from 'react-router'
import AdminPage from './Pages/AdminPage/AdminPage'
import App from './Pages/App/App'

const Home = React.lazy(() => import('./Pages/Home/Home'))
const Detail = React.lazy(() => import('./Pages/Detail/Detail'))
const Login = React.lazy(() => import('./Pages/Login/Login'))
const AdminPans = React.lazy(() => import('./Pages/AdminPans/AdminPans'))
const AdminPanDetail = React.lazy(() => import('./Pages/AdminPanDetail/AdminPanDetail'))
const AdminCodes = React.lazy(() => import('./Pages/AdminCodes/AdminCodes'))
const AdminCodeDetail = React.lazy(() => import('./Pages/AdminCodeDetail/AdminCodeDetail'))

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
        path: '/pan/:code',
        Component: Detail,
      },
      {
        path: '/pan/:code/:fileHash',
        Component: Detail,
      },
      {
        path: '/admin/login',
        Component: Login,
      },
      {
        Component: AdminPage,
        children: [
          {
            path: '/admin/dashboard',
            Component: AdminPans,
          },
          {
            path: '/admin/pans',
            Component: AdminPans,
          },
          {
            path: '/admin/pans/:pan_id',
            Component: AdminPanDetail,
          },
          {
            path: '/admin/pans/:pan_id/codes/:code_id',
            Component: AdminCodeDetail,
          },
          {
            path: '/admin/codes',
            Component: AdminCodes,
          },
        ],
      },
    ],
  },
])
