import React, { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import { LoadingSpinner } from '@/components/common/Loading'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { initializeAuth } from '@/features/auth/authSlice'

export const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector((state) => state.auth.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth())
    }
  }, [dispatch, isInitialized])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Suspense fallback={<LoadingSpinner minHeight="100vh" message="Loading..." />}>
        <Outlet />
      </Suspense>
    </Box>
  )
}

export default RootLayout
