import { axiosClient } from '@/api/axiosClient'
import type {
  SubscriptionPlanItem,
  TenantSubscriptionItem,
  InvoiceItem,
  PaymentItem,
  CouponItem,
  CreateSubscriptionPlanPayload,
  CreateInvoicePayload,
  RecordPaymentPayload,
  CreateCouponPayload,
  BillingCycle,
} from './types'

export const billingService = {
  // --- Subscription Plans Catalog ---
  async getSubscriptionPlans(): Promise<SubscriptionPlanItem[]> {
    const response = await axiosClient.get<{ data: SubscriptionPlanItem[] }>(
      '/subscription-plans'
    )
    return response.data.data || []
  },

  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlanItem> {
    const response = await axiosClient.get<{ data: SubscriptionPlanItem }>(
      `/subscription-plans/${id}`
    )
    return response.data.data
  },

  async createSubscriptionPlan(
    payload: CreateSubscriptionPlanPayload
  ): Promise<SubscriptionPlanItem> {
    const response = await axiosClient.post<{ data: SubscriptionPlanItem }>(
      '/subscription-plans',
      payload
    )
    return response.data.data
  },

  async updateSubscriptionPlan(
    id: string,
    payload: Partial<CreateSubscriptionPlanPayload> & { status?: string }
  ): Promise<SubscriptionPlanItem> {
    const response = await axiosClient.put<{ data: SubscriptionPlanItem }>(
      `/subscription-plans/${id}`,
      payload
    )
    return response.data.data
  },

  // --- Tenant Subscriptions ---
  async getCurrentSubscription(): Promise<TenantSubscriptionItem | null> {
    try {
      const response = await axiosClient.get<{ data: TenantSubscriptionItem | null }>(
        '/tenant-subscriptions/current'
      )
      return response.data.data
    } catch {
      return null
    }
  },

  async subscribeToPlan(payload: {
    planId: string
    billingCycle: BillingCycle
    withTrial?: boolean
  }): Promise<TenantSubscriptionItem> {
    const response = await axiosClient.post<{ data: TenantSubscriptionItem }>(
      '/tenant-subscriptions',
      payload
    )
    return response.data.data
  },

  async changeSubscriptionPlan(payload: {
    newPlanId: string
    newCycle: BillingCycle
  }): Promise<TenantSubscriptionItem> {
    const response = await axiosClient.post<{ data: TenantSubscriptionItem }>(
      '/tenant-subscriptions/change-plan',
      payload
    )
    return response.data.data
  },

  async renewSubscription(): Promise<TenantSubscriptionItem> {
    const response = await axiosClient.post<{ data: TenantSubscriptionItem }>(
      '/tenant-subscriptions/renew'
    )
    return response.data.data
  },

  async cancelSubscription(cancelImmediately = false): Promise<TenantSubscriptionItem> {
    const response = await axiosClient.post<{ data: TenantSubscriptionItem }>(
      '/tenant-subscriptions/cancel',
      { cancelImmediately }
    )
    return response.data.data
  },

  async getSubscriptionHistory(): Promise<TenantSubscriptionItem[]> {
    const response = await axiosClient.get<{ data: TenantSubscriptionItem[] }>(
      '/tenant-subscriptions/history'
    )
    return response.data.data || []
  },

  // --- Invoices Management ---
  async getInvoices(params?: {
    page?: number
    limit?: number
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ invoices: InvoiceItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: InvoiceItem[] | { invoices: InvoiceItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/invoices', { params })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        invoices: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      invoices: resData.invoices || [],
      total: resData.total || (resData.invoices || []).length,
    }
  },

  async createInvoice(payload: CreateInvoicePayload): Promise<InvoiceItem> {
    const response = await axiosClient.post<{ data: InvoiceItem }>('/invoices', payload)
    return response.data.data
  },

  async getInvoiceById(id: string): Promise<InvoiceItem> {
    const response = await axiosClient.get<{ data: InvoiceItem }>(`/invoices/${id}`)
    return response.data.data
  },

  async markInvoicePaid(id: string): Promise<InvoiceItem> {
    const response = await axiosClient.post<{ data: InvoiceItem }>(`/invoices/${id}/mark-paid`)
    return response.data.data
  },

  async voidInvoice(id: string): Promise<InvoiceItem> {
    const response = await axiosClient.post<{ data: InvoiceItem }>(`/invoices/${id}/void`)
    return response.data.data
  },

  // --- Payments & Transactions ---
  async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ payments: PaymentItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: PaymentItem[] | { payments: PaymentItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/payments', { params })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        payments: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      payments: resData.payments || [],
      total: resData.total || (resData.payments || []).length,
    }
  },

  async recordPayment(payload: RecordPaymentPayload): Promise<PaymentItem> {
    const response = await axiosClient.post<{ data: PaymentItem }>('/payments', payload)
    return response.data.data
  },

  async getPaymentById(id: string): Promise<PaymentItem> {
    const response = await axiosClient.get<{ data: PaymentItem }>(`/payments/${id}`)
    return response.data.data
  },

  // --- Coupons & Discounts ---
  async getCoupons(includeInactive = true): Promise<CouponItem[]> {
    const response = await axiosClient.get<{ data: CouponItem[] }>(
      `/billing/coupons?includeInactive=${includeInactive}`
    )
    return response.data.data || []
  },

  async createCoupon(payload: CreateCouponPayload): Promise<CouponItem> {
    const response = await axiosClient.post<{ data: CouponItem }>('/billing/coupons', payload)
    return response.data.data
  },

  async validateCoupon(payload: {
    code: string
    invoiceAmount: number
    planCode?: string
  }): Promise<{ valid: boolean; discountAmount?: number; message?: string }> {
    const response = await axiosClient.post<{
      data?: { valid: boolean; discountAmount?: number }
      valid?: boolean
      message?: string
    }>('/billing/coupons/validate', payload)

    return {
      valid: response.data.data?.valid ?? response.data.valid ?? true,
      discountAmount: response.data.data?.discountAmount,
      message: response.data.message,
    }
  },

  async toggleCouponStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<CouponItem> {
    const response = await axiosClient.patch<{ data: CouponItem }>(
      `/billing/coupons/${id}/status`,
      { status }
    )
    return response.data.data
  },
}
