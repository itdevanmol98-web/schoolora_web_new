import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
  Zap,
  Building2,
  CreditCard,
  UserPlus,
  BarChart3,
  LayoutTemplate,
  Send,
  LifeBuoy,
  Settings,
} from 'lucide-react'
import { QUICK_ACTIONS, type QuickActionItem } from './dashboardData'

export interface SuperAdminQuickActionsProps {
  onActionClick: (actionId: string, path: string) => void
  onCustomize?: () => void
}

export const SuperAdminQuickActions: React.FC<SuperAdminQuickActionsProps> = ({
  onActionClick,
  onCustomize,
}) => {
  const getActionIcon = (iconName: QuickActionItem['iconName'], color: string) => {
    switch (iconName) {
      case 'building':
        return <Building2 size={20} color={color} />
      case 'creditCard':
        return <CreditCard size={20} color={color} />
      case 'userPlus':
        return <UserPlus size={20} color={color} />
      case 'barChart':
        return <BarChart3 size={20} color={color} />
      case 'layout':
        return <LayoutTemplate size={20} color={color} />
      case 'send':
        return <Send size={20} color={color} />
      case 'lifeBuoy':
        return <LifeBuoy size={20} color={color} />
      case 'settings':
        return <Settings size={20} color={color} />
    }
  }

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(15,23,42,0.02)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Quick Actions
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Common tasks for Super Admin
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={onCustomize}
          sx={{
            borderColor: '#e2e8f0',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'none',
            borderRadius: '8px',
            px: 1.5,
            py: 0.4,
            '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
          }}
        >
          Customize
        </Button>
      </Box>

      {/* 8 Action Tiles (4x2 grid) */}
      <Grid container spacing={1.5} sx={{ flexGrow: 1 }}>
        {QUICK_ACTIONS.map((item) => (
          <Grid key={item.id} size={{ xs: 6, sm: 3 }}>
            <Box
              onClick={() => onActionClick(item.id, item.path)}
              sx={{
                p: 1.75,
                bgcolor: item.bgTint,
                border: `1px solid ${item.borderColor}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                minHeight: 88,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderColor: item.iconColor,
                },
              }}
            >
              <Box sx={{ mb: 1 }}>
                {getActionIcon(item.iconName, item.iconColor)}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SuperAdminQuickActions
