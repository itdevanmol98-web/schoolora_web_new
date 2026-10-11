export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'GRACE_PERIOD'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'SUSPENDED'

export type BillingCycle = 'MONTHLY' | 'YEARLY'

export interface PlanLimits {
  maxSchools?: number
  maxBranches?: number
  maxUsers?: number
  storageLimitMb?: number
  [key: string]: unknown
}

export interface SubscriptionPlanItem {
  id: string
  name: string
  code: string
  description?: string
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  trialDays: number
  features: string[]
  limits?: PlanLimits
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt?: string
}

export interface TenantSubscriptionItem {
  id: string
  tenantId: string
  planId: string
  status: SubscriptionStatus
  billingCycle: BillingCycle
  startDate: string
  endDate?: string
  renewsAt?: string
  trialEndsAt?: string
  cancelledAt?: string
  plan?: SubscriptionPlanItem
  createdAt: string
}

export type InvoiceStatus = 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE'

export interface InvoiceItem {
  id: string
  invoiceNumber?: string
  tenantId: string
  amount: number
  discountAmount?: number
  taxAmount?: number
  totalAmount?: number
  currency: string
  status: InvoiceStatus
  dueDate?: string
  paidAt?: string
  billingReason?: string
  createdAt: string
}

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED'

export interface PaymentItem {
  id: string
  tenantId: string
  invoiceId?: string
  amount: number
  currency: string
  gateway: string
  gatewayTransactionId?: string
  status: PaymentStatus
  metadata?: Record<string, unknown>
  createdAt: string
}

export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface CouponItem {
  id: string
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  maxUses?: number
  currentUses?: number
  minInvoiceAmount?: number
  applicablePlans?: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  validUntil?: string
  createdAt: string
}

export interface CreateSubscriptionPlanPayload {
  name: string
  code: string
  description?: string
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  trialDays: number
  features: string[]
  limits?: PlanLimits
}

export interface CreateInvoicePayload {
  tenantId: string
  amount: number
  discountAmount?: number
  taxAmount?: number
  currency: string
  dueDate?: string
  billingReason?: string
}

export interface RecordPaymentPayload {
  tenantId: string
  invoiceId?: string
  amount: number
  currency: string
  gateway: string
  gatewayTransactionId?: string
  status: PaymentStatus
  metadata?: Record<string, unknown>
}

export interface CreateCouponPayload {
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  maxUses?: number
  minInvoiceAmount?: number
  applicablePlans?: string[]
}
