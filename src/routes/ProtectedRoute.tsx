import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'
import { PATHS } from './paths'
import AppLoading from '@/components/common/Loading/AppLoading'

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitialized, mustChangePassword } = useAppSelector(
    (state) => state.auth
  )
  const location = useLocation()

  if (!isInitialized) {
    return <AppLoading variant="screen" message="Verifying session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />
  }

  // Handle enforced password reset
  if (
    mustChangePassword &&
    location.pathname !== PATHS.FIRST_LOGIN_PASSWORD_CHANGE &&
    location.pathname !== PATHS.CHANGE_PASSWORD
  ) {
    return <Navigate to={PATHS.FIRST_LOGIN_PASSWORD_CHANGE} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
