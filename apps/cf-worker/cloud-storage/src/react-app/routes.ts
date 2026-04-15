import React from 'react'
import { createBrowserRouter } from 'react-router'
import AdminPage from './pages/RootPage/AdminPage'
import App from './pages/RootPage/App'
import GuestPage from './pages/RootPage/GuestPage'

const Home = React.lazy(() => import('./pages/Home/Home'))
const Detail = React.lazy(() => import('./pages/Detail/Detail'))
const Login = React.lazy(() => import('./pages/Login/Login'))
const Logout = React.lazy(() => import('./pages/Logout/Logout'))
const SessionExpired = React.lazy(() => import('./pages/SessionExpired/SessionExpired'))
const AdminManagementPage = React.lazy(() => import('./pages/RootPage/AdminManagementPage'))
const AdminPans = React.lazy(() => import('./pages/AdminPans/AdminPans'))
const AdminPanDetail = React.lazy(() => import('./pages/AdminPanDetail/AdminPanDetail'))
const AdminCodes = React.lazy(() => import('./pages/AdminCodes/AdminCodes'))
const AdminCodeDetail = React.lazy(() => import('./pages/AdminCodeDetail/AdminCodeDetail'))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        Component: GuestPage,
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
        ],
      },
      {
        Component: AdminPage,
        children: [
          {
            path: '/admin/login',
            Component: Login,
          },
          {
            path: '/admin/logout',
            Component: Logout,
          },
          {
            path: '/admin/session-expired',
            Component: SessionExpired,
          },
          {
            Component: AdminManagementPage,
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
    ],
  },
])
