import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  ChevronRight,
  Crown,
  MoreHorizontal,
  LayoutDashboard,
  Building2,
  ClipboardList,
  CreditCard,
  Receipt,
  Users,
  Sliders,
  LayoutTemplate,
  Layers,
  LifeBuoy,
  Activity,
  BarChart3,
  Megaphone,
  FolderGit2,
  Clock,
  Mail,
  ShieldCheck,
  HelpCircle,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { AxionexaLogo } from '@/assets/logo/AxionexaLogo'
import { useThemeMode } from '@/theme/ThemeProvider'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { logoutThunk } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import { getSchoolId, setSchoolId } from '@/utils/tokenStorage'
import { schoolsService } from '@/features/schools/schoolService'
import type { School } from '@/features/schools/types'

const SIDEBAR_EXPANDED_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 74
const TOP_BAR_HEIGHT = 68

interface NavItem {
  id: string
  label: string
  path?: string
  icon: React.ReactNode
  badge?: number | string
  subItems?: Array<{ label: string; path: string }>
}

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'users-roles': false,
    'modules-settings': false,
    'support-tickets': false,
    'backup-security': false,
  })

  // Top bar states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [searchAnchor, setSearchAnchor] = useState<null | HTMLElement>(null)

  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null)
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English')
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)

  // Multi-campus schools
  const [availableSchools, setAvailableSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>(getSchoolId() || '')

  const { mode, toggleTheme } = useThemeMode()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  React.useEffect(() => {
    if (isAuthenticated) {
      schoolsService
        .listSchools({ limit: 50 })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setAvailableSchools(res.data)
            const current = getSchoolId()
            if (!current || !res.data.some((s) => s.id === current)) {
              setSchoolId(res.data[0].id)
              setSelectedSchool(res.data[0].id)
            }
          }
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  const handleSchoolChange = (newSchoolId: string) => {
    setSelectedSchool(newSchoolId)
    setSchoolId(newSchoolId)
    window.location.reload()
  }

  const handleLogout = async () => {
    setUserMenuAnchor(null)
    await dispatch(logoutThunk())
    navigate(PATHS.LOGIN, { replace: true })
  }

  const toggleSubmenu = (menuId: string) => {
    if (isCollapsed) setIsCollapsed(false)
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  // Navigation Items matching the screenshot and specifications
  const mainNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: PATHS.ADMIN_DASHBOARD,
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: 'schools',
      label: 'Schools',
      path: PATHS.SCHOOLS,
      icon: <Building2 size={19} />,
    },
    {
      id: 'school-requests',
      label: 'School Requests',
      path: PATHS.SCHOOLS,
      icon: <ClipboardList size={19} />,
      badge: 3,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      path: PATHS.SUBSCRIPTIONS,
      icon: <CreditCard size={19} />,
    },
    {
      id: 'billing-invoices',
      label: 'Billing & Invoices',
      path: PATHS.INVOICES,
      icon: <Receipt size={19} />,
    },
    {
      id: 'users-roles',
      label: 'Users & Roles',
      icon: <Users size={19} />,
      subItems: [
        { label: 'Users Directory', path: PATHS.USERS },
        { label: 'Roles & Permissions', path: PATHS.ROLES },
      ],
    },
    {
      id: 'modules-settings',
      label: 'Modules & Settings',
      icon: <Sliders size={19} />,
      subItems: [
        { label: 'System Settings', path: PATHS.SETTINGS },
        { label: 'Custom Domains', path: PATHS.DOMAINS },
      ],
    },
    {
      id: 'templates',
      label: 'Templates',
      path: PATHS.SUBJECTS,
      icon: <LayoutTemplate size={19} />,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      path: PATHS.SETTINGS,
      icon: <Layers size={19} />,
    },
    {
      id: 'support-tickets',
      label: 'Support & Tickets',
      icon: <LifeBuoy size={19} />,
      subItems: [
        { label: 'All Tickets', path: PATHS.ADMIN_DASHBOARD },
        { label: 'Pending Issues', path: PATHS.ADMIN_DASHBOARD },
      ],
    },
    {
      id: 'system-health',
      label: 'System Health',
      path: PATHS.AUDIT_LOGS,
      icon: <Activity size={19} />,
    },
    {
      id: 'reports-analytics',
      label: 'Reports & Analytics',
      path: PATHS.BILLING_ANALYTICS,
      icon: <BarChart3 size={19} />,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      path: PATHS.ADMIN_DASHBOARD,
      icon: <Megaphone size={19} />,
    },
    {
      id: 'manage-content',
      label: 'Manage Content',
      path: PATHS.ADMIN_DASHBOARD,
      icon: <FolderGit2 size={19} />,
    },
    {
      id: 'activity-logs',
      label: 'Activity Logs',
      path: PATHS.AUDIT_LOGS,
      icon: <Clock size={19} />,
    },
    {
      id: 'email-notifications',
      label: 'Email & Notifications',
      path: PATHS.SETTINGS,
      icon: <Mail size={19} />,
    },
    {
      id: 'backup-security',
      label: 'Backup & Security',
      icon: <ShieldCheck size={19} />,
      subItems: [
        { label: 'Audit Trail', path: PATHS.AUDIT_LOGS },
        { label: 'Active Sessions', path: PATHS.SESSIONS },
      ],
    },
  ]

  const bottomNavItems: NavItem[] = [
    {
      id: 'help-documentation',
      label: 'Help & Documentation',
      path: PATHS.ROOT,
      icon: <HelpCircle size={19} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      path: PATHS.SETTINGS,
      icon: <Settings size={19} />,
    },
    {
      id: 'my-profile',
      label: 'My Profile',
      path: PATHS.SCHOOL_PROFILE,
      icon: <User size={19} />,
    },
  ]

  const isCurrentActive = (item: NavItem) => {
    if (item.path) {
      if (item.id === 'dashboard') {
        return location.pathname === '/dashboard' || location.pathname === '/admin/dashboard'
      }
      return location.pathname === item.path
    }
    if (item.subItems) {
      return item.subItems.some((s) => location.pathname === s.path)
    }
    return false
  }

  // Sidebar Component JSX
  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0d1527',
        color: '#94a3b8',
        overflowX: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Super Admin Control Panel Header */}
      <Box
        sx={{
          px: isCollapsed ? 1.5 : 2.5,
          py: 2.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Crown size={20} />
          </Box>
          {!isCollapsed && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem', lineHeight: 1.2 }}
              >
                Super Admin
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', mt: 0.2 }}
              >
                Central Control Panel
              </Typography>
            </Box>
          )}
        </Box>
        {!isCollapsed && (
          <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#ffffff' } }}>
            <MoreHorizontal size={18} />
          </IconButton>
        )}
      </Box>

      {/* Main Navigation Scroll Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          py: 1.5,
          px: isCollapsed ? 1 : 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 },
        }}
      >
        {mainNavItems.map((item) => {
          const active = isCurrentActive(item)
          const isExpanded = expandedMenus[item.id]

          return (
            <Box key={item.id}>
              <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                <Box
                  onClick={() => {
                    if (item.subItems) {
                      toggleSubmenu(item.id)
                    } else if (item.path) {
                      navigate(item.path)
                      if (mobileOpen) setMobileOpen(false)
                    }
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    px: isCollapsed ? 1.25 : 1.75,
                    py: 1,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    bgcolor: active ? '#1e60f0' : 'transparent',
                    color: active ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.84rem',
                    '&:hover': {
                      bgcolor: active ? '#1e60f0' : 'rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        color: active ? '#ffffff' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>
                    {!isCollapsed && (
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: '0.84rem',
                          fontWeight: active ? 700 : 500,
                          color: active ? '#ffffff' : 'inherit',
                        }}
                      >
                        {item.label}
                      </Typography>
                    )}
                  </Box>

                  {!isCollapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      {item.badge !== undefined && (
                        <Box
                          sx={{
                            px: 0.85,
                            py: 0.15,
                            borderRadius: '9999px',
                            bgcolor: '#ef4444',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.badge}
                        </Box>
                      )}
                      {item.subItems && (
                        <Box sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Tooltip>

              {/* Submenu Items */}
              {item.subItems && !isCollapsed && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 4.5, pr: 1, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.path

                      return (
                        <Box
                          key={sub.label}
                          onClick={() => {
                            navigate(sub.path)
                            if (mobileOpen) setMobileOpen(false)
                          }}
                          sx={{
                            px: 1.5,
                            py: 0.65,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: isSubActive ? 700 : 500,
                            color: isSubActive ? '#38bdf8' : '#64748b',
                            bgcolor: isSubActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                            '&:hover': {
                              color: '#ffffff',
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          {sub.label}
                        </Box>
                      )
                    })}
                  </Box>
                </Collapse>
              )}
            </Box>
          )
        })}

        {/* Separator */}
        <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Bottom Section Items */}
        {bottomNavItems.map((item) => (
          <Tooltip key={item.id} title={isCollapsed ? item.label : ''} placement="right">
            <Box
              onClick={() => {
                if (item.path) {
                  navigate(item.path)
                  if (mobileOpen) setMobileOpen(false)
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1.25 : 1.75,
                py: 0.9,
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#94a3b8',
                gap: 1.5,
                fontSize: '0.84rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                },
              }}
            >
              <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              {!isCollapsed && (
                <Typography variant="body2" noWrap sx={{ fontSize: '0.84rem' }}>
                  {item.label}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}

        {/* Logout */}
        <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 1.25 : 1.75,
              py: 0.9,
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#ef4444',
              gap: 1.5,
              fontSize: '0.84rem',
              mt: 0.5,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
              },
            }}
          >
            <LogOut size={19} />
            {!isCollapsed && (
              <Typography variant="body2" sx={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Logout
              </Typography>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )

  const currentSidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6fa' }}>
      {/* 1. Full-Width Top Header Bar */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: TOP_BAR_HEIGHT,
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          zIndex: 1201,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {/* Left: Sidebar Toggle & AxioNexa ERP Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
          <IconButton
            onClick={() => {
              if (window.innerWidth < 900) {
                setMobileOpen(!mobileOpen)
              } else {
                setIsCollapsed(!isCollapsed)
              }
            }}
            size="small"
            sx={{
              color: '#334155',
              p: 1,
              borderRadius: '10px',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
            title="Toggle Sidebar"
          >
            <MenuIcon size={19} />
          </IconButton>

          {/* AxioNexa Brand Logo + ERP Badge */}
          <Box
            onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <AxionexaLogo size="sm" showCompanySubtitle={true} showTagline={false} />
            <Box
              sx={{
                px: 1,
                py: 0.35,
                bgcolor: '#1e60f0',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.72rem',
                borderRadius: '6px',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              ERP
            </Box>
          </Box>
        </Box>

        {/* Center: Global Search Input Field */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.25,
            width: { md: 360, lg: 440 },
            px: 2,
            py: 0.85,
            borderRadius: '9999px',
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease',
            '&:focus-within': {
              borderColor: '#1e60f0',
              boxShadow: '0 0 0 3px rgba(30, 96, 240, 0.1)',
              bgcolor: '#ffffff',
            },
          }}
        >
          <Search size={17} color="#94a3b8" />
          <Box
            component="input"
            type="text"
            placeholder="Search schools, users, modules, settings..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value)
              setSearchSuggestionsOpen(Boolean(e.target.value))
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              setSearchAnchor(e.currentTarget)
              if (searchQuery) setSearchSuggestionsOpen(true)
            }}
            sx={{
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              width: '100%',
              fontSize: '0.84rem',
              color: '#0f172a',
              '&::placeholder': { color: '#94a3b8' },
            }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.25, color: '#94a3b8' }}>
              <X size={14} />
            </IconButton>
          )}
        </Box>

        {/* Search Quick Dropdown */}
        <Popover
          open={searchSuggestionsOpen && Boolean(searchQuery)}
          anchorEl={searchAnchor}
          onClose={() => setSearchSuggestionsOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 440,
                mt: 1,
                p: 1.5,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
              },
            },
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, px: 1, mb: 0.5, display: 'block' }}>
            QUICK RESULTS FOR &quot;{searchQuery}&quot;
          </Typography>
          <MenuItem onClick={() => { navigate(PATHS.SCHOOLS); setSearchSuggestionsOpen(false) }}>
            <Building2 size={16} style={{ marginRight: 10, color: '#1e60f0' }} />
            Schools matching &quot;{searchQuery}&quot;
          </MenuItem>
          <MenuItem onClick={() => { navigate(PATHS.USERS); setSearchSuggestionsOpen(false) }}>
            <Users size={16} style={{ marginRight: 10, color: '#8b5cf6' }} />
            Users matching &quot;{searchQuery}&quot;
          </MenuItem>
          <MenuItem onClick={() => { navigate(PATHS.SETTINGS); setSearchSuggestionsOpen(false) }}>
            <Settings size={16} style={{ marginRight: 10, color: '#f59e0b' }} />
            Platform Settings
          </MenuItem>
        </Popover>

        {/* Right Actions: Notifications, Theme Toggle, Language, Super Admin Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.75 } }}>
          {/* Notification Bell with Badge */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
              sx={{
                p: 1,
                borderRadius: '10px',
                color: '#475569',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              <Badge
                badgeContent={5}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: 16,
                    minWidth: 16,
                    px: 0.4,
                    fontWeight: 800,
                  },
                }}
              >
                <Bell size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(notificationAnchor)}
            anchorEl={notificationAnchor}
            onClose={() => setNotificationAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 340,
                  p: 2,
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Platform Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: '#1e60f0', fontWeight: 700, cursor: 'pointer' }}>
                Mark all read
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                  New school registration request: Sunrise Academy
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  2 mins ago
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                  Subscription payment received: ₹12,000
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  40 mins ago
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                  System backup completed successfully
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  1 hr ago
                </Typography>
              </Box>
            </Box>
          </Popover>

          {/* Theme Toggle (Sun/Moon) */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                p: 1,
                borderRadius: '10px',
                color: '#475569',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              {mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </IconButton>
          </Tooltip>

          {/* Language Selector */}
          <Box
            onClick={(e) => setLanguageAnchor(e.currentTarget)}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              borderRadius: '10px',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Globe size={16} color="#64748b" />
            <span>{selectedLanguage}</span>
            <ChevronDown size={14} color="#64748b" />
          </Box>

          <Menu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={() => setLanguageAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setSelectedLanguage('English')
                setLanguageAnchor(null)
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedLanguage('Hindi')
                setLanguageAnchor(null)
              }}
            >
              हिन्दी (Hindi)
            </MenuItem>
          </Menu>

          {/* Super Admin User Profile Pill */}
          <Box
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 0.5,
              pr: { xs: 0.5, sm: 1.25 },
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
            }}
          >
            {/* Red-Orange Circle Avatar with "SA" */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: '#ea580c',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
              }}
            >
              SA
            </Box>

            {/* Name & Role Text */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem', lineHeight: 1.2 }}
              >
                Super Admin
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}
              >
                Super Administrator
              </Typography>
            </Box>

            <ChevronDown size={15} color="#94a3b8" />
          </Box>

          {/* User Account Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 230,
                  borderRadius: '14px',
                  p: 0.5,
                  boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Super Administrator'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                {user?.email || 'admin@axionexa.com'}
              </Typography>
            </Box>
            {availableSchools.length > 0 && (
              <>
                <Divider />
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>
                    Active Campus
                  </Typography>
                  <Box
                    component="select"
                    value={selectedSchool}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSchoolChange(e.target.value)}
                    sx={{
                      width: '100%',
                      mt: 0.5,
                      p: 0.75,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  >
                    {availableSchools.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.name}
                      </option>
                    ))}
                  </Box>
                </Box>
              </>
            )}
            <Divider />
            <MenuItem
              onClick={() => {
                setUserMenuAnchor(null)
                navigate(PATHS.SCHOOL_PROFILE)
              }}
            >
              <User size={16} style={{ marginRight: 10 }} />
              My Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setUserMenuAnchor(null)
                navigate(PATHS.SETTINGS)
              }}
            >
              <Settings size={16} style={{ marginRight: 10 }} />
              System Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                setUserMenuAnchor(null)
                navigate(PATHS.SESSIONS)
              }}
            >
              <Activity size={16} style={{ marginRight: 10 }} />
              Active Sessions
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <LogOut size={16} style={{ marginRight: 10 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 2. Main Body Container (Sidebar + Content Viewport) */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: `${TOP_BAR_HEIGHT}px` }}>
        {/* Left Navigation Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: currentSidebarWidth },
            flexShrink: { md: 0 },
            transition: 'width 0.25s ease',
          }}
          aria-label="Super Admin Navigation"
        >
          {/* Mobile Overlay Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: SIDEBAR_EXPANDED_WIDTH,
                boxSizing: 'border-box',
                border: 'none',
              },
            }}
          >
            {sidebarContent}
          </Drawer>

          {/* Desktop Fixed Sidebar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'fixed',
              top: TOP_BAR_HEIGHT,
              left: 0,
              bottom: 0,
              width: currentSidebarWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 1100,
              transition: 'width 0.25s ease',
            }}
          >
            {sidebarContent}
          </Box>
        </Box>

        {/* 3. Main Dashboard Content Viewport */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${currentSidebarWidth}px)` },
            p: { xs: 2, sm: 3, lg: 3.5 },
            bgcolor: '#f4f6fa',
            minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
