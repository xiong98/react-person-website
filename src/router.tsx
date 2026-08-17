import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import App from './App'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })
