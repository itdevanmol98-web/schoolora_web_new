import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MenuItem from '@mui/material/MenuItem'
import { billingService } from '@/features/billing/billingService'
import type { CouponItem, CreateCouponPayload, DiscountType } from '@/features/billing/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Validate test
  const [testCode, setTestCode] = useState('WELCOME20')
  const [testAmount, setTestAmount] = useState<number>(149)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)

  // Create Coupon Dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateCouponPayload>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUses: 100,
    minInvoiceAmount: 50,
    applicablePlans: ['STANDARD_TIER', 'ENTERPRISE'],
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    billingService
      .getCoupons(true)
      .then((data) => {
        if (!isCancelled) {
          setCoupons(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query promotional coupons catalog'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchCoupons = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleTestValidate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testCode.trim()) return
    setTestLoading(true)
    setTestResult(null)
    try {
      const res = await billingService.validateCoupon({
        code: testCode.trim().toUpperCase(),
        invoiceAmount: Number(testAmount),
      })
      setTestResult(
        res.valid
          ? `Coupon is valid! Calculated discount: $${res.discountAmount || 0}`
          : res.message || 'Coupon code is invalid or expired'
      )
    } catch (err: unknown) {
      setTestResult(err instanceof Error ? err.message : 'Coupon validation failed')
    } finally {
      setTestLoading(false)
    }
  }

  const handleCreateSubmit = async () => {
    if (!createData.code.trim()) {
      setErrorMessage('Coupon code is required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await billingService.createCoupon({
        ...createData,
        code: createData.code.trim().toUpperCase(),
        discountValue: Number(createData.discountValue),
        maxUses: Number(createData.maxUses || 100),
        minInvoiceAmount: Number(createData.minInvoiceAmount || 0),
      })
      setSuccessMessage(`Coupon code "${createData.code}" created`)
      setCreateOpen(false)
      fetchCoupons()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create coupon')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleToggleStatus = async (coupon: CouponItem) => {
    const nextStatus = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await billingService.toggleCouponStatus(coupon.id, nextStatus)
      setSuccessMessage(`Coupon "${coupon.code}" status changed to ${nextStatus}`)
      fetchCoupons()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to toggle coupon status')
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Promotional Coupons & Discounts"
        subtitle="Manage promotional discount codes, validity criteria, and redemption allowances"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Coupon
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

      {/* Validation Tester Box */}
      <AppCard sx={{ mb: 3, p: 2.5 }} title="Coupon Validation Diagnostic Test" subtitle="Verify coupon applicability rules directly against the backend validator">
        <Box
          component="form"
          onSubmit={handleTestValidate}
          sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <AppTextField
            label="Coupon Code"
            size="small"
            placeholder="WELCOME20"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <AppTextField
            label="Simulated Invoice Amount ($)"
            type="number"
            size="small"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value))}
            sx={{ minWidth: 180 }}
          />

          <AppButton
            type="submit"
            variant="outlined"
            loading={testLoading}
            loadingText="Testing..."
          >
            Test Code Validity
          </AppButton>

          {testResult && (
            <Chip
              label={testResult}
              color={testResult.includes('valid!') ? 'success' : 'error'}
              sx={{ fontWeight: 600, py: 1 }}
            />
          )}
        </Box>
      </AppCard>

      {/* Coupons Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving promotional coupons from backend..." />
        </AppCard>
      ) : errorMessage && coupons.length === 0 ? (
        <AppErrorState
          title="Coupons Catalog Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchCoupons}
        />
      ) : coupons.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Active Coupons"
            description="No promotional discount codes currently defined in the system."
            actionText="Create Coupon"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="promotional coupons table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Coupon Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Max Redemptions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Min Invoice</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalOfferIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                          {coupon.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{coupon.description || 'Promotional Discount'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}% OFF`
                          : `$${coupon.discountValue} OFF`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {coupon.currentUses ?? 0} / {coupon.maxUses || 'Unlimited'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">${coupon.minInvoiceAmount || 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={coupon.status}
                        size="small"
                        color={coupon.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={coupon.status === 'ACTIVE' ? 'Deactivate Coupon' : 'Activate Coupon'}
                      >
                        <IconButton
                          size="small"
                          color={coupon.status === 'ACTIVE' ? 'error' : 'success'}
                          onClick={() => handleToggleStatus(coupon)}
                        >
                          {coupon.status === 'ACTIVE' ? (
                            <BlockIcon fontSize="small" />
                          ) : (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AppCard>
      )}

      {/* Create Coupon Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Promotional Discount Coupon"
        confirmText="Create Coupon"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Coupon Code"
              required
              fullWidth
              placeholder="e.g. SPRING2026"
              value={createData.code}
              onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
            />
            <AppSelect
              label="Discount Type"
              fullWidth
              value={createData.discountType}
              onChange={(e) => setCreateData({ ...createData, discountType: e.target.value as DiscountType })}
            >
              <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
              <MenuItem value="FIXED">Fixed Amount ($)</MenuItem>
            </AppSelect>
          </Box>

          <AppTextField
            label="Description"
            fullWidth
            placeholder="25% discount for Spring onboarding"
            value={createData.description || ''}
            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label={createData.discountType === 'PERCENTAGE' ? 'Discount Value (%)' : 'Discount Value ($)'}
              type="number"
              required
              fullWidth
              value={createData.discountValue}
              onChange={(e) => setCreateData({ ...createData, discountValue: Number(e.target.value) })}
            />

            <AppTextField
              label="Maximum Redemptions"
              type="number"
              fullWidth
              value={createData.maxUses || 100}
              onChange={(e) => setCreateData({ ...createData, maxUses: Number(e.target.value) })}
            />
          </Box>

          <AppTextField
            label="Minimum Invoice Amount ($)"
            type="number"
            fullWidth
            value={createData.minInvoiceAmount || 50}
            onChange={(e) => setCreateData({ ...createData, minInvoiceAmount: Number(e.target.value) })}
          />
        </Box>
      </AppDialog>
    </Box>
  )
}

export default CouponsPage
