import type { AuditLogItem } from '@/features/audit/types'
import type { TenantSubscriptionItem } from '@/features/billing/types'

export interface SuperAdminDashboardMetrics {
  totalTenants: number
  activeTenants: number
  totalSchools: number
  totalBranches: number
  totalUsers: number
  activeUsers: number
  totalSubscriptionPlans: number
  currentSubscription: TenantSubscriptionItem | null
  totalInvoices: number
  openInvoices: number
  totalPayments: number
  recentAudits: AuditLogItem[]
}
