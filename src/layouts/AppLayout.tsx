import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import DevicesIcon from '@mui/icons-material/Devices'
import HistoryIcon from '@mui/icons-material/History'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import LogoutIcon from '@mui/icons-material/Logout'
import BusinessIcon from '@mui/icons-material/Business'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PeopleIcon from '@mui/icons-material/People'
import SecurityIcon from '@mui/icons-material/Security'
import LanguageIcon from '@mui/icons-material/Language'
import SettingsIcon from '@mui/icons-material/Settings'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PaymentIcon from '@mui/icons-material/Payment'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TuneIcon from '@mui/icons-material/Tune'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ViewListIcon from '@mui/icons-material/ViewList'
import BadgeIcon from '@mui/icons-material/Badge'
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import Chip from '@mui/material/Chip'
import { useThemeMode } from '@/theme/ThemeProvider'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { logoutThunk } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import { getSchoolId, setSchoolId } from '@/utils/tokenStorage'
import { schoolsService } from '@/features/schools/schoolService'
import type { School } from '@/features/schools/types'

const DRAWER_WIDTH = 260

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = async () => {
    handleCloseUserMenu()
    await dispatch(logoutThunk())
    navigate(PATHS.LOGIN, { replace: true })
  }

  const navSections = isAuthenticated
    ? [
        {
          title: 'School Administration',
          items: [
            { label: 'School Profile', path: PATHS.SCHOOL_PROFILE, icon: <AccountBalanceIcon /> },
            { label: 'School Settings', path: PATHS.SCHOOL_SETTINGS, icon: <TuneIcon /> },
          ],
        },
        {
          title: 'Academics',
          items: [
            { label: 'Academic Sessions', path: PATHS.ACADEMIC_SESSIONS, icon: <CalendarMonthIcon /> },
            { label: 'Classes & Grades', path: PATHS.CLASSES, icon: <MeetingRoomIcon /> },
            { label: 'Class Sections', path: PATHS.SECTIONS, icon: <MeetingRoomIcon /> },
            { label: 'Subjects Catalog', path: PATHS.SUBJECTS, icon: <MenuBookIcon /> },
            { label: 'Curriculum Mapping', path: PATHS.CLASS_SUBJECTS, icon: <ViewListIcon /> },
            { label: 'Teacher Assignments', path: PATHS.TEACHER_ASSIGNMENTS, icon: <BadgeIcon /> },
          ],
        },
        {
          title: 'People',
          items: [
            { label: 'Students Directory', path: PATHS.STUDENTS, icon: <SchoolIcon /> },
            { label: 'Parents / Guardians', path: PATHS.PARENTS, icon: <EscalatorWarningIcon /> },
            { label: 'Teachers & Faculty', path: PATHS.TEACHERS, icon: <SupervisorAccountIcon /> },
          ],
        },
        {
          title: 'Student Operations',
          items: [
            { label: 'Lifecycle Operations', path: PATHS.STUDENT_OPERATIONS, icon: <SwapHorizIcon /> },
          ],
        },
        {
          title: 'Platform Administration',
          items: [
            { label: 'Super Admin Dashboard', path: PATHS.ADMIN_DASHBOARD, icon: <DashboardIcon /> },
            { label: 'Tenants Directory', path: PATHS.TENANTS, icon: <BusinessIcon /> },
            { label: 'Campuses & Schools', path: PATHS.SCHOOLS, icon: <SchoolIcon /> },
            { label: 'Branches & Wings', path: PATHS.BRANCHES, icon: <AccountTreeIcon /> },
            { label: 'User Administration', path: PATHS.USERS, icon: <PeopleIcon /> },
            { label: 'Roles & Permissions', path: PATHS.ROLES, icon: <SecurityIcon /> },
            { label: 'Custom Domains', path: PATHS.DOMAINS, icon: <LanguageIcon /> },
            { label: 'System Settings', path: PATHS.SETTINGS, icon: <SettingsIcon /> },
            { label: 'Security Audit Logs', path: PATHS.AUDIT_LOGS, icon: <HistoryIcon /> },
          ],
        },
        {
          title: 'Subscription & Billing',
          items: [
            { label: 'Tenant Subscription', path: PATHS.SUBSCRIPTIONS, icon: <CardMembershipIcon /> },
            { label: 'Plans Catalog', path: PATHS.SUBSCRIPTION_PLANS, icon: <ReceiptIcon /> },
            { label: 'Invoices Ledger', path: PATHS.INVOICES, icon: <ReceiptIcon /> },
            { label: 'Payment Records', path: PATHS.PAYMENTS, icon: <PaymentIcon /> },
            { label: 'Promotional Coupons', path: PATHS.COUPONS, icon: <LocalOfferIcon /> },
            { label: 'Billing Telemetry', path: PATHS.BILLING_ANALYTICS, icon: <AssessmentIcon /> },
          ],
        },
        {
          title: 'Security & Access',
          items: [
            { label: 'Active Sessions', path: PATHS.SESSIONS, icon: <DevicesIcon /> },
            { label: 'Sign-In History', path: PATHS.LOGIN_HISTORY, icon: <HistoryIcon /> },
            { label: 'Change Password', path: PATHS.CHANGE_PASSWORD, icon: <VpnKeyIcon /> },
          ],
        },
      ]
    : [
        {
          title: 'Portal Access',
          items: [
            { label: 'Welcome / Home', path: PATHS.ROOT, icon: <HomeIcon /> },
            { label: 'Sign In (Portal)', path: PATHS.LOGIN, icon: <LockOpenIcon /> },
          ],
        },
      ]

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Schoolora
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ERP Platform
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Chip
          label="Phase 4 • School Setup & Academics"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ width: '100%', fontWeight: 600, fontSize: '0.75rem' }}
        />
      </Box>
      <Box sx={{ px: 1, flexGrow: 1, overflowY: 'auto' }}>
        {navSections.map((section, sIdx) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            {sIdx > 0 && <Divider sx={{ my: 1.5 }} />}
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: 0.5,
                display: 'block',
                mb: 0.5,
              }}
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const isSelected = location.pathname === item.path

                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => {
                        navigate(item.path)
                        if (mobileOpen) setMobileOpen(false)
                      }}
                      sx={{
                        borderRadius: 2,
                        py: 0.75,
                        px: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: '#fff',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isSelected ? '#fff' : 'text.secondary',
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: '0.825rem',
                              fontWeight: isSelected ? 700 : 500,
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Schoolora ERP v1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Phase 3 Super Admin & Billing
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Top Application Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open navigation drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              Schoolora ERP
            </Typography>
          </Box>

          {availableSchools.length > 0 && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 3 }}>
              <TextField
                select
                size="small"
                label="Active Campus"
                value={selectedSchool}
                onChange={(e) => handleSchoolChange(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                {availableSchools.map((sch) => (
                  <MenuItem key={sch.id} value={sch.id}>
                    {sch.name} ({sch.code})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label="Toggle light/dark theme"
              sx={{ mr: 1 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {isAuthenticated && user ? (
            <>
              <Tooltip title="User Account Menu">
                <Box
                  onClick={handleOpenUserMenu}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="user account menu"
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.firstName?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 220,
                      borderRadius: 2,
                      boxShadow: (theme: any) =>
                        theme.palette.mode === 'dark'
                          ? '0 10px 25px rgba(0,0,0,0.7)'
                          : '0 10px 25px rgba(0,0,0,0.1)',
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {user.email}
                  </Typography>
                  <Chip
                    label={`Status: ${user.status}`}
                    size="small"
                    color={user.status === 'ACTIVE' ? 'success' : 'default'}
                    sx={{ mt: 1, fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu()
                    navigate(PATHS.SESSIONS)
                  }}
                >
                  <ListItemIcon>
                    <DevicesIcon fontSize="small" />
                  </ListItemIcon>
                  Active Sessions
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu()
                    navigate(PATHS.LOGIN_HISTORY)
                  }}
                >
                  <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  Login History
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu()
                    navigate(PATHS.CHANGE_PASSWORD)
                  }}
                >
                  <ListItemIcon>
                    <VpnKeyIcon fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <AppButton
              variant="contained"
              size="small"
              onClick={() => navigate(PATHS.LOGIN)}
              startIcon={<LockOpenIcon />}
            >
              Sign In
            </AppButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="Schoolora navigation items"
      >
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Viewport */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
