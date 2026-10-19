import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CheckCircle, Building2, TrendingUp, Globe, LifeBuoy } from 'lucide-react'
import { PENDING_APPROVALS_DATA, type PendingApprovalItem } from './dashboardData'

export interface SuperAdminPendingApprovalsProps {
  items?: PendingApprovalItem[]
  onViewAll?: () => void
  onItemClick?: (item: PendingApprovalItem) => void
}

export const SuperAdminPendingApprovals: React.FC<SuperAdminPendingApprovalsProps> = ({
  items = PENDING_APPROVALS_DATA,
  onViewAll,
  onItemClick,
}) => {
  const getApprovalIcon = (type: string) => {
    if (type.includes('School Registration')) {
      return { icon: <Building2 size={16} />, color: '#2563eb', bg: '#eff6ff' }
    }
    if (type.includes('Subscription')) {
      return { icon: <TrendingUp size={16} />, color: '#ea580c', bg: '#fff7ed' }
    }
    if (type.includes('Domain')) {
      return { icon: <Globe size={16} />, color: '#8b5cf6', bg: '#faf5ff' }
    }
    return { icon: <LifeBuoy size={16} />, color: '#dc2626', bg: '#fef2f2' }
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
              bgcolor: '#eff6ff',
              color: '#1e60f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Pending Approvals
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Requires your action
            </Typography>
          </Box>
        </Box>

        <Button
          variant="text"
          onClick={onViewAll}
          sx={{
            color: '#1e60f0',
            fontWeight: 700,
            fontSize: '0.78rem',
            textTransform: 'none',
            p: 0,
            minWidth: 0,
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
          }}
        >
          View All
        </Button>
      </Box>

      {/* Approvals List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, justifyContent: 'space-around' }}>
        {items.map((item) => {
          const config = getApprovalIcon(item.type)

          return (
            <Box
              key={item.id}
              onClick={() => onItemClick?.(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.15,
                borderRadius: '12px',
                border: '1px solid #f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  borderColor: '#e2e8f0',
                  transform: 'translateX(2px)',
                },
              }}
            >
              {/* Left icon and labels */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: config.bg,
                    color: config.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {config.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 600,
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.type}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mt: 0.2 }}
                  >
                    {item.target}
                  </Typography>
                </Box>
              </Box>

              {/* Counter pill */}
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: '#ffedd5',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  ml: 1,
                }}
              >
                {item.count}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SuperAdminPendingApprovals
