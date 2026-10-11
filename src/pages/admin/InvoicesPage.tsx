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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import MenuItem from '@mui/material/MenuItem'
import { billingService } from '@/features/billing/billingService'
import { tokenStorage } from '@/utils/tokenStorage'
import type { InvoiceItem, CreateInvoicePayload, InvoiceStatus } from '@/features/billing/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import { formatDate } from '@/utils/formatters'

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create Invoice Dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateInvoicePayload>({
    tenantId: tokenStorage.getTenantId() || '00000000-0000-0000-0000-000000000001',
    amount: 299,
    discountAmount: 0,
    taxAmount: 0,
    currency: 'USD',
    dueDate: '2026-11-01T00:00:00Z',
    billingReason: 'Institutional Campus Subscription',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Mark Paid Confirmation
  const [paidTarget, setPaidTarget] = useState<InvoiceItem | null>(null)
  const [paidLoading, setPaidLoading] = useState(false)

  // Void Confirmation
  const [voidTarget, setVoidTarget] = useState<InvoiceItem | null>(null)
  const [voidLoading, setVoidLoading] = useState(false)

  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    billingService
      .getInvoices({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      })
      .then((res) => {
        if (!isCancelled) {
          setInvoices(res.invoices)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query invoices from billing ledger'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, reloadTrigger])

  const fetchInvoices = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleCreateSubmit = async () => {
    if (!createData.amount || createData.amount <= 0) {
      setErrorMessage('Valid invoice amount is required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await billingService.createInvoice({
        ...createData,
        amount: Number(createData.amount),
        discountAmount: Number(createData.discountAmount || 0),
        taxAmount: Number(createData.taxAmount || 0),
      })
      setSuccessMessage('Invoice generated and posted to billing ledger')
      setCreateOpen(false)
      fetchInvoices()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate invoice')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!paidTarget) return
    setPaidLoading(true)
    try {
      await billingService.markInvoicePaid(paidTarget.id)
      setSuccessMessage(`Invoice #${paidTarget.invoiceNumber || paidTarget.id.slice(0, 8)} marked as PAID`)
      setPaidTarget(null)
      fetchInvoices()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to mark invoice as paid')
    } finally {
      setPaidLoading(false)
    }
  }

  const handleVoid = async () => {
    if (!voidTarget) return
    setVoidLoading(true)
    try {
      await billingService.voidInvoice(voidTarget.id)
      setSuccessMessage(`Invoice #${voidTarget.invoiceNumber || voidTarget.id.slice(0, 8)} has been VOIDED`)
      setVoidTarget(null)
      fetchInvoices()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to void invoice')
    } finally {
      setVoidLoading(false)
    }
  }

  const getStatusChip = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return <Chip label="PAID" size="small" color="success" sx={{ fontWeight: 700 }} />
      case 'OPEN':
        return <Chip label="OPEN" size="small" color="warning" sx={{ fontWeight: 700 }} />
      case 'VOID':
        return <Chip label="VOID" size="small" color="default" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Invoices Management"
        subtitle="Review platform receivables, generate institution billing statements, and update payment states"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Generate Invoice
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

      {/* Filter Bar */}
      <AppCard sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AppSelect
            label="Invoice Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as string)
              setPage(0)
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open (Unpaid)</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="VOID">Void</MenuItem>
          </AppSelect>
        </Box>
      </AppCard>

      {/* Invoices Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving institutional invoices from billing ledger..." />
        </AppCard>
      ) : errorMessage && invoices.length === 0 ? (
        <AppErrorState
          title="Invoices Ledger Unavailable"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchInvoices}
        />
      ) : invoices.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Invoices Found"
            description="No invoices match the selected billing parameters."
            actionText="Generate Invoice"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="billing invoices table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Billing Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {inv.invoiceNumber || `INV-${inv.id.slice(0, 8)}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{inv.billingReason || 'Campus Service Fee'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ${inv.amount} {inv.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(inv.status)}</TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {inv.dueDate ? formatDate(inv.dueDate) : 'Immediate'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(inv.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {inv.status === 'OPEN' && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Mark as Paid">
                            <IconButton size="small" color="success" onClick={() => setPaidTarget(inv)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Void Invoice">
                            <IconButton size="small" color="error" onClick={() => setVoidTarget(inv)}>
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
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

      {/* Generate Invoice Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Generate Institutional Invoice"
        confirmText="Post Invoice"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="Billing Reason / Item"
            required
            fullWidth
            placeholder="Annual ERP Campus Subscription"
            value={createData.billingReason || ''}
            onChange={(e) => setCreateData({ ...createData, billingReason: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Amount ($)"
              type="number"
              required
              fullWidth
              value={createData.amount}
              onChange={(e) => setCreateData({ ...createData, amount: Number(e.target.value) })}
            />
            <AppTextField
              label="Discount Amount ($)"
              type="number"
              fullWidth
              value={createData.discountAmount || 0}
              onChange={(e) => setCreateData({ ...createData, discountAmount: Number(e.target.value) })}
            />
          </Box>

          <AppTextField
            label="Due Date (ISO)"
            fullWidth
            placeholder="2026-11-01T00:00:00Z"
            value={createData.dueDate || ''}
            onChange={(e) => setCreateData({ ...createData, dueDate: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Mark Paid Confirmation */}
      <AppConfirmDialog
        open={Boolean(paidTarget)}
        title={`Mark Invoice #${paidTarget?.invoiceNumber || paidTarget?.id.slice(0, 8)} as Paid?`}
        message="This action records the invoice as settled in the system ledger."
        confirmText="Confirm Payment Received"
        confirmColor="primary"
        loading={paidLoading}
        onConfirm={handleMarkPaid}
        onClose={() => setPaidTarget(null)}
      />

      {/* Void Invoice Confirmation */}
      <AppConfirmDialog
        open={Boolean(voidTarget)}
        title={`Void Invoice #${voidTarget?.invoiceNumber || voidTarget?.id.slice(0, 8)}?`}
        message="Voided invoices can no longer be settled."
        confirmText="Void Invoice"
        confirmColor="error"
        loading={voidLoading}
        onConfirm={handleVoid}
        onClose={() => setVoidTarget(null)}
      />
    </Box>
  )
}

export default InvoicesPage
