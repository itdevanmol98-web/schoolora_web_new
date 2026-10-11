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
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MenuItem from '@mui/material/MenuItem'
import { auditService } from '@/features/audit/auditService'
import type { AuditLogItem } from '@/features/audit/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import { formatDate } from '@/utils/formatters'

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [resourceFilter, setResourceFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Details dialog
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    auditService
      .getAuditLogs({
        page: page + 1,
        limit: rowsPerPage,
        resource: resourceFilter === 'ALL' ? undefined : resourceFilter,
        action: actionFilter === 'ALL' ? undefined : actionFilter,
      })
      .then((res) => {
        if (!isCancelled) {
          setLogs(res.logs)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query security audit logs from backend'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, resourceFilter, actionFilter, reloadTrigger])

  const fetchLogs = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const getActionColor = (action: string): 'primary' | 'success' | 'warning' | 'error' | 'default' => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'success'
      case 'UPDATE':
        return 'primary'
      case 'DELETE':
        return 'error'
      case 'REVOKE':
      case 'BLOCK':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Security & System Audit Log"
        subtitle="Chronological audit records of administrative changes, security actions, and policy events"
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Filter Controls */}
      <AppCard sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <AppSelect
            label="Resource Category"
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value as string)
              setPage(0)
            }}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All Resources</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Tenant">Tenant</MenuItem>
            <MenuItem value="School">School</MenuItem>
            <MenuItem value="Branch">Branch</MenuItem>
            <MenuItem value="Role">Role</MenuItem>
            <MenuItem value="Subscription">Subscription</MenuItem>
            <MenuItem value="Invoice">Invoice</MenuItem>
            <MenuItem value="Payment">Payment</MenuItem>
          </AppSelect>

          <AppSelect
            label="Action Performed"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value as string)
              setPage(0)
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All Actions</MenuItem>
            <MenuItem value="CREATE">CREATE</MenuItem>
            <MenuItem value="UPDATE">UPDATE</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
            <MenuItem value="LOGIN">LOGIN</MenuItem>
            <MenuItem value="REVOKE">REVOKE</MenuItem>
          </AppSelect>
        </Box>
      </AppCard>

      {/* Audit Log Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving administrative audit trail from backend..." />
        </AppCard>
      ) : errorMessage && logs.length === 0 ? (
        <AppErrorState
          title="Audit Log Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchLogs}
        />
      ) : logs.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Audit Records"
            description="No administrative events matched the selected filters."
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="system audit logs table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Target Resource</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actor / Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Inspection</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Chip
                        label={log.action}
                        size="small"
                        color={getActionColor(log.action)}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {log.resource}
                      </Typography>
                      {log.resourceId && (
                        <Typography variant="caption" color="text.secondary">
                          ID: {log.resourceId.slice(0, 8)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.userEmail || log.userName || 'System Service'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {log.ipAddress || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(log.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Inspect Event Payload">
                        <IconButton size="small" onClick={() => setSelectedAudit(log)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </AppCard>
      )}

      {/* Audit Detail Modal */}
      <AppDialog
        open={Boolean(selectedAudit)}
        onClose={() => setSelectedAudit(null)}
        title="Audit Event Inspection"
        confirmText="Done"
        onConfirm={() => setSelectedAudit(null)}
      >
        {selectedAudit && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                label={selectedAudit.action}
                color={getActionColor(selectedAudit.action)}
                size="small"
                sx={{ fontWeight: 700 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {selectedAudit.resource}
              </Typography>
            </Box>

            <Typography variant="body2">
              <strong>Actor:</strong> {selectedAudit.userEmail || selectedAudit.userName || 'System'}
            </Typography>
            <Typography variant="body2">
              <strong>IP Address:</strong> {selectedAudit.ipAddress || 'Not recorded'}
            </Typography>
            <Typography variant="body2">
              <strong>Timestamp:</strong> {formatDate(selectedAudit.createdAt)}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
              Event Metadata:
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: 'action.hover',
                p: 2,
                borderRadius: 2,
                fontSize: '0.8rem',
                overflowX: 'auto',
                fontFamily: 'monospace',
                maxHeight: 250,
              }}
            >
              {JSON.stringify(selectedAudit.details || {}, null, 2)}
            </Box>
          </Box>
        )}
      </AppDialog>
    </Box>
  )
}

export default AuditLogsPage
