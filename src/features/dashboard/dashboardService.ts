import { tenantService } from '@/features/tenants/tenantService'
import { schoolService } from '@/features/schools/schoolService'
import { branchService } from '@/features/branches/branchService'
import { userService } from '@/features/users/userService'
import { billingService } from '@/features/billing/billingService'
import { auditService } from '@/features/audit/auditService'
import type { SuperAdminDashboardMetrics } from './types'

export const dashboardService = {
  async getDashboardMetrics(): Promise<SuperAdminDashboardMetrics> {
    const [
      tenantsRes,
      schoolsRes,
      branchesRes,
      usersRes,
      plansRes,
      currentSubRes,
      invoicesRes,
      paymentsRes,
      auditsRes,
    ] = await Promise.allSettled([
      tenantService.getTenants({ limit: 100 }),
      schoolService.getSchools({ limit: 100 }),
      branchService.getBranches({ limit: 100 }),
      userService.getUsers({ limit: 100 }),
      billingService.getSubscriptionPlans(),
      billingService.getCurrentSubscription(),
      billingService.getInvoices({ limit: 100 }),
      billingService.getPayments({ limit: 100 }),
      auditService.getAuditLogs({ limit: 6 }),
    ])

    const tenants = tenantsRes.status === 'fulfilled' ? tenantsRes.value.tenants : []
    const schools = schoolsRes.status === 'fulfilled' ? schoolsRes.value.schools : []
    const branches = branchesRes.status === 'fulfilled' ? branchesRes.value.branches : []
    const users = usersRes.status === 'fulfilled' ? usersRes.value.users : []
    const plans = plansRes.status === 'fulfilled' ? plansRes.value : []
    const currentSub = currentSubRes.status === 'fulfilled' ? currentSubRes.value : null
    const invoices = invoicesRes.status === 'fulfilled' ? invoicesRes.value.invoices : []
    const payments = paymentsRes.status === 'fulfilled' ? paymentsRes.value.payments : []
    const audits = auditsRes.status === 'fulfilled' ? auditsRes.value.logs : []

    const activeTenants = tenants.filter((t) => t.status === 'ACTIVE').length
    const activeUsers = users.filter((u) => u.status === 'ACTIVE').length
    const openInvoices = invoices.filter((i) => i.status === 'OPEN').length

    return {
      totalTenants: tenants.length,
      activeTenants,
      totalSchools: schools.length,
      totalBranches: branches.length,
      totalUsers: users.length,
      activeUsers,
      totalSubscriptionPlans: plans.length,
      currentSubscription: currentSub,
      totalInvoices: invoices.length,
      openInvoices,
      totalPayments: payments.length,
      recentAudits: audits,
    }
  },
}
