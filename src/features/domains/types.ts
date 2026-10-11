export interface CustomDomainItem {
  id: string
  tenantId: string
  domain: string
  isPrimary: boolean
  isVerified: boolean
  verificationToken?: string
  dnsRecordType?: string
  dnsRecordValue?: string
  createdAt: string
  updatedAt?: string
}

export interface AddDomainPayload {
  domain: string
}
