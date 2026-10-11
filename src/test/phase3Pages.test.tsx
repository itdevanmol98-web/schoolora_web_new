import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SuperAdminDashboardPage } from '@/pages/admin/SuperAdminDashboardPage'
import { TenantsListPage } from '@/pages/admin/TenantsListPage'
import { SubscriptionPlansPage } from '@/pages/admin/SubscriptionPlansPage'
import { InvoicesPage } from '@/pages/admin/InvoicesPage'
import { CouponsPage } from '@/pages/admin/CouponsPage'
import { axiosClient } from '@/api/axiosClient'

describe('Phase 3 React Pages UI Rendering', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders SuperAdminDashboardPage with real metric cards', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <SuperAdminDashboardPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Super Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Billing Analytics')).toBeInTheDocument()
  })

  it('renders TenantsListPage with action buttons', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [], total: 0 },
    })

    render(
      <MemoryRouter>
        <TenantsListPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Institutional Tenant Management')).toBeInTheDocument()
    expect(screen.getByText('Provision Tenant')).toBeInTheDocument()
  })

  it('renders SubscriptionPlansPage with catalog header', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <SubscriptionPlansPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('SaaS Subscription Plans Catalog')).toBeInTheDocument()
    expect(screen.getByText('Create Subscription Plan')).toBeInTheDocument()
  })

  it('renders InvoicesPage with ledger header', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [], total: 0 },
    })

    render(
      <MemoryRouter>
        <InvoicesPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Invoices Management')).toBeInTheDocument()
    expect(screen.getAllByText('Generate Invoice')[0]).toBeInTheDocument()
  })

  it('renders CouponsPage with diagnostic tester', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <CouponsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Promotional Coupons & Discounts')).toBeInTheDocument()
    expect(screen.getByText('Coupon Validation Diagnostic Test')).toBeInTheDocument()
  })
})
