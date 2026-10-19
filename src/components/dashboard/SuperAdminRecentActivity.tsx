import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
  Clock,
  Building2,
  RefreshCw,
  User,
  IndianRupee,
  LifeBuoy,
  Layers,
  Ban,
  Mail,
} from 'lucide-react'
import { RECENT_ACTIVITIES, type ActivityItem } from './dashboardData'

export interface SuperAdminRecentActivityProps {
  onViewAll?: () => void
}

export const SuperAdminRecentActivity: React.FC<SuperAdminRecentActivityProps> = ({ onViewAll }) => {
  const getIconConfig = (type: ActivityItem['iconType']) => {
    switch (type) {
      case 'school':
        return {
          icon: <Building2 size={16} />,
          bgColor: '#eff6ff',
          color: '#2563eb',
        }
      case 'subscription':
        return {
          icon: <RefreshCw size={16} />,
          bgColor: '#f0fdf4',
          color: '#16a34a',
        }
      case 'user':
        return {
          icon: <User size={16} />,
          bgColor: '#faf5ff',
          color: '#9333ea',
        }
      case 'payment':
        return {
          icon: <IndianRupee size={16} />,
          bgColor: '#f0fdf4',
          color: '#15803d',
        }
      case 'ticket':
        return {
          icon: <LifeBuoy size={16} />,
          bgColor: '#fef2f2',
          color: '#dc2626',
        }
      case 'module':
        return {
          icon: <Layers size={16} />,
          bgColor: '#ecfeff',
          color: '#0891b2',
        }
      case 'deactivate':
        return {
          icon: <Ban size={16} />,
          bgColor: '#fef2f2',
          color: '#ef4444',
        }
      case 'enquiry':
        return {
          icon: <Mail size={16} />,
          bgColor: '#faf5ff',
          color: '#8b5cf6',
        }
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
          pb: 2,
          borderBottom: '1px solid #f1f5f9',
          mb: 1.5,
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
            <Clock size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Recent Activity
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Live platform activities
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

      {/* Activity List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, flexGrow: 1 }}>
        {RECENT_ACTIVITIES.map((act) => {
          const config = getIconConfig(act.iconType)

          return (
            <Box
              key={act.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              {/* Left icon & text */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: config.bgColor,
                    color: config.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {config.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#0f172a',
                      fontSize: '0.82rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {act.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: '#64748b',
                      fontSize: '0.75rem',
                      display: 'block',
                      mt: 0.2,
                    }}
                  >
                    {act.target}
                  </Typography>
                </Box>
              </Box>

              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  mt: 0.25,
                }}
              >
                {act.timeAgo}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SuperAdminRecentActivity
