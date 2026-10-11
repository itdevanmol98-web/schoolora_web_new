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
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MenuItem from '@mui/material/MenuItem'
import { billingService } from '@/features/billing/billingService'
import { tokenStorage } from '@/utils/tokenStorage'
import type { PaymentItem, RecordPaymentPayload } from '@/features/billing/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import { formatDate } from '@/utils/formatters'

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Record Payment Dialog
  const [recordOpen, setRecordOpen] = useState(false)
  const [recordData, setRecordData] = useState<RecordPaymentPayload>({
    tenantId: tokenStorage.getTenantId() || '00000000-0000-0000-0000-000000000001',
    invoiceId: '',
    amount: 294,
    currency: 'USD',
    gateway: 'STRIPE',
    gatewayTransactionId: '',
    status: 'SUCCESS',
  })
  const [recordLoading, setRecordLoading] = useState(false)

  // Inspection modal
  const [inspectedPayment, setInspectedPayment] = useState<PaymentItem | null>(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    billingService
      .getPayments({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      })
      .then((res) => {
        if (!isCancelled) {
          setPayments(res.payments)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query payment transaction records'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, reloadTrigger])

  const fetchPayments = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleRecordSubmit = async () => {
    if (!recordData.amount || recordData.amount <= 0) {
      setErrorMessage('Valid transaction amount is required')
      return
    }

    setRecordLoading(true)
    setErrorMessage(null)
    try {
      await billingService.recordPayment({
        ...recordData,
        amount: Number(recordData.amount),
        gatewayTransactionId: recordData.gatewayTransactionId || `tx_${Date.now()}`,
      })
      setSuccessMessage('Payment transaction recorded')
      setRecordOpen(false)
      fetchPayments()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to record payment transaction')
    } finally {
      setRecordLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Payments & Gateway Transactions"
        subtitle="Gateway transaction records, receipt history, and settlement reconciliation"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setRecordOpen(true)}
          >
            Record Payment Transaction
          </AppButton>
        }
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Filter */}
      <AppCard sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AppSelect
            label="Payment Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as string)
              setPage(0)
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="SUCCESS">Success</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
          </AppSelect>
        </Box>
      </AppCard>

      {/* Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving payment transactions from backend ledger..." />
        </AppCard>
      ) : errorMessage && payments.length === 0 ? (
        <AppErrorState
          title="Payment Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchPayments}
        />
      ) : payments.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Payment Transactions"
            description="No transaction events recorded on this account."
            actionText="Record Payment"
            onAction={() => setRecordOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="payments ledger table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Gateway</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Transaction Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((pmt) => (
                  <TableRow key={pmt.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {pmt.gatewayTransactionId || pmt.id.slice(0, 10)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ${pmt.amount} {pmt.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={pmt.gateway} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pmt.status}
                        size="small"
                        color={pmt.status === 'SUCCESS' ? 'success' : pmt.status === 'FAILED' ? 'error' : 'warning'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(pmt.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Transaction Metadata">
                        <IconButton size="small" onClick={() => setInspectedPayment(pmt)}>
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
            rowsPerPageOptions={[5, 10, 25]}
          />
        </AppCard>
      )}

      {/* Record Payment Dialog */}
      <AppDialog
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        title="Record Payment Settlement"
        confirmText="Record Transaction"
        onConfirm={handleRecordSubmit}
        loading={recordLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Amount ($)"
              type="number"
              required
              fullWidth
              value={recordData.amount}
              onChange={(e) => setRecordData({ ...recordData, amount: Number(e.target.value) })}
            />
            <AppSelect
              label="Payment Gateway"
              fullWidth
              value={recordData.gateway}
              onChange={(e) => setRecordData({ ...recordData, gateway: e.target.value as string })}
            >
              <MenuItem value="STRIPE">Stripe Gateway</MenuItem>
              <MenuItem value="MOCK">Mock Gateway</MenuItem>
              <MenuItem value="WIRE_TRANSFER">Wire / Bank Transfer</MenuItem>
            </AppSelect>
          </Box>

          <AppTextField
            label="External Gateway Transaction Reference"
            fullWidth
            placeholder="e.g. ch_3NabcXYZ123456"
            value={recordData.gatewayTransactionId || ''}
            onChange={(e) => setRecordData({ ...recordData, gatewayTransactionId: e.target.value })}
          />

          <AppTextField
            label="Associated Invoice ID (Optional)"
            fullWidth
            placeholder="UUID of invoice"
            value={recordData.invoiceId || ''}
            onChange={(e) => setRecordData({ ...recordData, invoiceId: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Inspect Payment Dialog */}
      <AppDialog
        open={Boolean(inspectedPayment)}
        onClose={() => setInspectedPayment(null)}
        title="Payment Record Metadata"
        confirmText="Done"
        onConfirm={() => setInspectedPayment(null)}
      >
        {inspectedPayment && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {inspectedPayment.id}
            </Typography>
            <Typography variant="body2">
              <strong>Amount:</strong> ${inspectedPayment.amount} {inspectedPayment.currency}
            </Typography>
            <Typography variant="body2">
              <strong>Gateway:</strong> {inspectedPayment.gateway}
            </Typography>
            <Typography variant="body2">
              <strong>Gateway Reference:</strong> {inspectedPayment.gatewayTransactionId || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {inspectedPayment.status}
            </Typography>
            <Typography variant="body2">
              <strong>Processed:</strong> {formatDate(inspectedPayment.createdAt)}
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
              Gateway Payload Details:
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
              }}
            >
              {JSON.stringify(inspectedPayment.metadata || {}, null, 2)}
            </Box>
          </Box>
        )}
      </AppDialog>
    </Box>
  )
}

export default PaymentsPage
