export type ThemeMode = 'light' | 'dark'

export interface BreadcrumbItem {
  label: string
  path?: string
}

export interface NavItem {
  title: string
  path: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
