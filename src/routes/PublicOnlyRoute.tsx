import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'
import { PATHS } from './paths'
import AppLoading from '@/components/common/Loading/AppLoading'

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isInitialized, mustChangePassword } = useAppSelector(
    (state) => state.auth
  )
  const location = useLocation()

  if (!isInitialized) {
    return <AppLoading variant="screen" message="Loading..." />
  }

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to={PATHS.FIRST_LOGIN_PASSWORD_CHANGE} replace />
    }
    const destination = (location.state as { from?: Location })?.from?.pathname || PATHS.DASHBOARD
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
