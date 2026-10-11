import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import BlockIcon from '@mui/icons-material/Block'
import { authService } from '@/features/auth/authService'
import type { LoginHistoryItem } from '@/features/auth/types'
import { formatDate } from '@/utils/formatters'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'

export const LoginHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<LoginHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    authService
      .getLoginHistory(rowsPerPage, page * rowsPerPage)
      .then((data) => {
        if (!isCancelled) {
          setHistory(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to load login audit history from backend.'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, reloadTrigger])

  const refreshHistory = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const getStatusChip = (status: string) => {
    if (status === 'SUCCESS') {
      return (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label="Success"
          size="small"
          color="success"
          sx={{ fontWeight: 600 }}
        />
      )
    }
    if (status === 'BLOCKED') {
      return (
        <Chip
          icon={<BlockIcon fontSize="small" />}
          label="Blocked"
          size="small"
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      )
    }
    return (
      <Chip
        icon={<CancelIcon fontSize="small" />}
        label="Failed"
        size="small"
        color="error"
        sx={{ fontWeight: 600 }}
      />
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <AppPageHeader
        title="Sign-In History & Audit"
        subtitle="Chronological log of recent authentication attempts associated with your credentials"
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving authentication audit history..." />
        </AppCard>
      ) : errorMessage && history.length === 0 ? (
        <AppErrorState
          title="Audit Log Retrieval Error"
          message={errorMessage}
          retryText="Retry"
          onRetry={refreshHistory}
        />
      ) : history.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Authentication History"
            description="No recent login events recorded for this account."
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="sign-in history audit log">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Device / Client Info</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Failure Detail</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.ipAddress || 'Unavailable'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.deviceInfo || 'Standard Client'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.failureReason ? (
                        <Typography variant="caption" color="error.main" sx={{ fontWeight: 500 }}>
                          {item.failureReason}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={history.length < rowsPerPage ? page * rowsPerPage + history.length : -1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </AppCard>
      )}
    </Box>
  )
}

export default LoginHistoryPage
