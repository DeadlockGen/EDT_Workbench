import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { moduleRoutes } from './routes'

export function RouterProvider() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={null} />
          {moduleRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
