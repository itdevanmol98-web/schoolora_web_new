export const ACCESS_TOKEN_KEY = 'schoolora_access_token'
export const REFRESH_TOKEN_KEY = 'schoolora_refresh_token'

class TokenStorage {
  private inMemoryAccessToken: string | null = null

  public getAccessToken(): string | null {
    if (this.inMemoryAccessToken) {
      return this.inMemoryAccessToken
    }
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  }

  public setAccessToken(token: string): void {
    this.inMemoryAccessToken = token
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } catch {
      // Storage restricted (e.g. private browsing)
    }
  }

  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  }

  public setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } catch {
      // Storage restricted
    }
  }

  public setTokens(tokens: { accessToken: string; refreshToken?: string | null }): void {
    this.setAccessToken(tokens.accessToken)
    if (tokens.refreshToken) {
      this.setRefreshToken(tokens.refreshToken)
    }
  }

  public getTenantId(): string | null {
    try {
      return localStorage.getItem('schoolora_tenant_id')
    } catch {
      return null
    }
  }

  public setTenantId(tenantId: string): void {
    try {
      localStorage.setItem('schoolora_tenant_id', tenantId)
    } catch {
      // Storage restricted
    }
  }

  public clearTenantId(): void {
    try {
      localStorage.removeItem('schoolora_tenant_id')
    } catch {
      // Storage restricted
    }
  }

  public getSchoolId(): string | null {
    try {
      return localStorage.getItem('schoolora_school_id')
    } catch {
      return null
    }
  }

  public setSchoolId(schoolId: string): void {
    try {
      localStorage.setItem('schoolora_school_id', schoolId)
    } catch {
      // Storage restricted
    }
  }

  public clearSchoolId(): void {
    try {
      localStorage.removeItem('schoolora_school_id')
    } catch {
      // Storage restricted
    }
  }

  public clearTokens(): void {
    this.inMemoryAccessToken = null
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem('schoolora_school_id')
    } catch {
      // Storage restricted
    }
  }

  public hasValidTokens(): boolean {
    return Boolean(this.getAccessToken() || this.getRefreshToken())
  }
}

export const tokenStorage = new TokenStorage()
export default tokenStorage

export const getAccessToken = () => tokenStorage.getAccessToken()
export const setAccessToken = (token: string) => tokenStorage.setAccessToken(token)
export const getRefreshToken = () => tokenStorage.getRefreshToken()
export const setRefreshToken = (token: string) => tokenStorage.setRefreshToken(token)
export const getTenantId = () => tokenStorage.getTenantId()
export const setTenantId = (id: string) => tokenStorage.setTenantId(id)
export const clearTenantId = () => tokenStorage.clearTenantId()
export const getSchoolId = () => tokenStorage.getSchoolId()
export const setSchoolId = (id: string) => tokenStorage.setSchoolId(id)
export const clearSchoolId = () => tokenStorage.clearSchoolId()
export const clearTokens = () => tokenStorage.clearTokens()
