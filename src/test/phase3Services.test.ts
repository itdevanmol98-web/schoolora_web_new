import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'
import { axiosClient } from '@/api/axiosClient'
import { tenantService } from '@/features/tenants/tenantService'
import { schoolService } from '@/features/schools/schoolService'
import { branchService } from '@/features/branches/branchService'
import { userService } from '@/features/users/userService'
import { roleService } from '@/features/roles/roleService'
import { domainService } from '@/features/domains/domainService'
import { settingsService } from '@/features/settings/settingsService'
import { auditService } from '@/features/audit/auditService'
import { billingService } from '@/features/billing/billingService'
import { dashboardService } from '@/features/dashboard/dashboardService'

describe('Phase 3 API Services Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Tenant Service', () => {
    it('fetches tenants list with pagination metadata', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'tenant-1',
              name: 'Springfield Academy',
              code: 'springfield',
              status: 'ACTIVE',
              createdAt: '2026-01-01',
            },
          ],
          total: 1,
        },
      })

      const result = await tenantService.getTenants({ page: 1, limit: 10 })
      expect(result.tenants).toHaveLength(1)
      expect(result.tenants[0].name).toBe('Springfield Academy')
      expect(result.total).toBe(1)
    })

    it('creates a tenant with code and plan', async () => {
      const postSpy = vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'tenant-2',
            name: 'Oakridge High',
            code: 'oakridge',
            plan: 'ENTERPRISE',
            status: 'ACTIVE',
            createdAt: '2026-01-01',
          },
        },
      })

      const result = await tenantService.createTenant({
        name: 'Oakridge High',
        code: 'oakridge',
        plan: 'ENTERPRISE',
      })

      expect(postSpy).toHaveBeenCalledWith('/tenants', {
        name: 'Oakridge High',
        code: 'oakridge',
        plan: 'ENTERPRISE',
      })
      expect(result.code).toBe('oakridge')
    })
  })

  describe('School Service', () => {
    it('creates a school and captures temporary admin credentials', async () => {
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'school-1',
            name: 'North Campus',
            code: 'NCH-01',
            contactEmail: 'admin@northcampus.edu',
            status: 'ACTIVE',
            createdAt: '2026-01-01',
            temporaryAdminCredentials: {
              email: 'admin@northcampus.edu',
              temporaryPassword: 'TempPass123!',
            },
          },
        },
      })

      const res = await schoolService.createSchool({
        name: 'North Campus',
        code: 'NCH-01',
        contactEmail: 'admin@northcampus.edu',
      })

      expect(res.school.name).toBe('North Campus')
      expect(res.temporaryAdminCredentials?.temporaryPassword).toBe('TempPass123!')
    })
  })

  describe('Branch Service', () => {
    it('creates a branch for parent school', async () => {
      const postSpy = vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'branch-1',
            schoolId: 'school-1',
            name: 'East Wing',
            code: 'BR-EAST',
            status: 'ACTIVE',
            createdAt: '2026-01-01',
          },
        },
      })

      const res = await branchService.createBranch({
        schoolId: 'school-1',
        name: 'East Wing',
        code: 'BR-EAST',
      })

      expect(postSpy).toHaveBeenCalledWith('/branches', {
        schoolId: 'school-1',
        name: 'East Wing',
        code: 'BR-EAST',
      })
      expect(res.name).toBe('East Wing')
    })
  })

  describe('User Service & RBAC', () => {
    it('assigns role to user and performs admin password reset', async () => {
      const roleSpy = vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { message: 'Role assigned' },
      })

      await userService.assignRoleToUser('user-1', 'role-admin')
      expect(roleSpy).toHaveBeenCalledWith('/users/user-1/roles', { roleId: 'role-admin' })

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { data: { temporaryPassword: 'NewTemp123!' }, message: 'Reset OK' },
      })

      const resetRes = await userService.adminResetPassword('user-1')
      expect(resetRes.temporaryPassword).toBe('NewTemp123!')
    })
  })

  describe('Custom Domain & Settings Services', () => {
    it('verifies custom domain and updates institutional settings', async () => {
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { data: { verified: true }, message: 'DNS verified' },
      })

      const domainRes = await domainService.verifyDomain('dom-1')
      expect(domainRes.verified).toBe(true)

      const putSpy = vi.spyOn(axiosClient, 'put').mockResolvedValueOnce({
        data: {
          data: {
            school_name: 'Springfield Academy',
            date_format: 'YYYY-MM-DD',
            currency_symbol: '$',
          },
        },
      })

      const settingsRes = await settingsService.updateSettings({
        school_name: 'Springfield Academy',
      })
      expect(putSpy).toHaveBeenCalledWith('/settings', { school_name: 'Springfield Academy' })
      expect(settingsRes.school_name).toBe('Springfield Academy')
    })
  })

  describe('Billing & Subscription Service', () => {
    it('queries active subscription plans catalog', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'plan-standard',
              name: 'Standard Plan',
              code: 'STANDARD_TIER',
              monthlyPrice: 149,
              yearlyPrice: 1490,
              currency: 'USD',
              trialDays: 14,
              features: ['MULTI_BRANCH'],
              status: 'ACTIVE',
              createdAt: '2026-01-01',
            },
          ],
        },
      })

      const plans = await billingService.getSubscriptionPlans()
      expect(plans).toHaveLength(1)
      expect(plans[0].code).toBe('STANDARD_TIER')
    })

    it('validates coupon against backend billing rules', async () => {
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: { valid: true, discountAmount: 29.8 },
          valid: true,
          message: 'Coupon applied',
        },
      })

      const res = await billingService.validateCoupon({
        code: 'WELCOME20',
        invoiceAmount: 149,
      })

      expect(res.valid).toBe(true)
      expect(res.discountAmount).toBe(29.8)
    })
  })

  describe('Role & Permission Service', () => {
    it('fetches permissions catalog and roles list', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            { id: 'perm-1', name: 'Manage Users', code: 'users:manage', module: 'Users' },
          ],
        },
      } as unknown as AxiosResponse)

      const perms = await roleService.getPermissions()
      expect(perms).toHaveLength(1)
      expect(perms[0].code).toBe('users:manage')

      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            { id: 'role-1', name: 'Campus Admin', code: 'CAMPUS_ADMIN', isSystem: true, permissions: [] },
          ],
          total: 1,
        },
      } as unknown as AxiosResponse)

      const rolesRes = await roleService.getRoles()
      expect(rolesRes.roles).toHaveLength(1)
      expect(rolesRes.roles[0].code).toBe('CAMPUS_ADMIN')
    })
  })

  describe('Audit Log Service', () => {
    it('fetches audit logs with filtering', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'audit-1',
              action: 'CREATE',
              resource: 'School',
              resourceId: 'sch-1',
              createdAt: '2026-01-01',
            },
          ],
          total: 1,
        },
      } as unknown as AxiosResponse)

      const auditRes = await auditService.getAuditLogs({ resource: 'School' })
      expect(auditRes.logs).toHaveLength(1)
      expect(auditRes.logs[0].resource).toBe('School')
    })
  })

  describe('Dashboard Metrics Aggregator', () => {
    it('aggregates live statistics across all modules without inventing data', async () => {
      vi.spyOn(axiosClient, 'get').mockImplementation(async (url) => {
        if (typeof url === 'string' && url.includes('/tenants')) {
          return { data: { data: [{ id: 't1', status: 'ACTIVE' }, { id: 't2', status: 'SUSPENDED' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/schools')) {
          return { data: { data: [{ id: 's1' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/branches')) {
          return { data: { data: [{ id: 'b1' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/users')) {
          return { data: { data: [{ id: 'u1', status: 'ACTIVE' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/subscription-plans')) {
          return { data: { data: [{ id: 'p1' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/tenant-subscriptions/current')) {
          return { data: { data: { id: 'sub1', status: 'ACTIVE' } } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/invoices')) {
          return { data: { data: [{ id: 'i1', status: 'OPEN' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/payments')) {
          return { data: { data: [{ id: 'pmt1', status: 'SUCCESS' }] } } as unknown as AxiosResponse
        }
        if (typeof url === 'string' && url.includes('/audit')) {
          return { data: { data: [{ id: 'a1', resource: 'User', action: 'CREATE' }] } } as unknown as AxiosResponse
        }
        return { data: { data: [] } } as unknown as AxiosResponse
      })

      const metrics = await dashboardService.getDashboardMetrics()
      expect(metrics.totalTenants).toBe(2)
      expect(metrics.activeTenants).toBe(1)
      expect(metrics.totalSchools).toBe(1)
      expect(metrics.totalBranches).toBe(1)
      expect(metrics.totalUsers).toBe(1)
      expect(metrics.openInvoices).toBe(1)
      expect(metrics.recentAudits).toHaveLength(1)
    })
  })
})
