import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Building2,
  Users,
  GraduationCap,
  IndianRupee,
  FileCheck2,
  TrendingUp,
} from 'lucide-react'
import { KPI_DATA, type KpiCardData } from './dashboardData'
import type { SuperAdminDashboardMetrics } from '@/features/dashboard/types'

export interface SuperAdminKpiCardsProps {
  metrics?: SuperAdminDashboardMetrics | null
}

export const SuperAdminKpiCards: React.FC<SuperAdminKpiCardsProps> = ({ metrics }) => {
  // If real metrics exist from backend, merge them
  const cards: KpiCardData[] = KPI_DATA.map((card) => {
    if (!metrics) return card

    if (card.id === 'schools' && metrics.totalSchools > 0) {
      return { ...card, value: String(metrics.totalSchools) }
    }
    if (card.id === 'subscriptions' && metrics.totalSubscriptionPlans > 0) {
      return { ...card, value: String(metrics.totalSubscriptionPlans) }
    }
    if (card.id === 'staff' && metrics.totalUsers > 0) {
      return { ...card, value: `${metrics.totalUsers}+` }
    }
    return card
  })

  const getIcon = (type: KpiCardData['iconType']) => {
    switch (type) {
      case 'schools':
        return <Building2 size={24} color="#ffffff" />
      case 'students':
        return <GraduationCap size={24} color="#ffffff" />
      case 'staff':
        return <Users size={24} color="#ffffff" />
      case 'revenue':
        return <IndianRupee size={24} color="#ffffff" />
      case 'subscriptions':
        return <FileCheck2 size={24} color="#ffffff" />
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Box
              sx={{
                bgcolor: '#ffffff',
                p: 2.25,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(15,23,42,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                },
              }}
            >
              {/* Top row: Icon on left, Growth badge on right */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.75,
                }}
              >
                {/* Icon inside colored square */}
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: '12px',
                    bgcolor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 10px ${card.bgColor}40`,
                  }}
                >
                  {getIcon(card.iconType)}
                </Box>

                {/* Compact growth indicator pill */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.35,
                    borderRadius: '9999px',
                    bgcolor: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <TrendingUp size={12} strokeWidth={2.5} />
                  <span>{card.growth}</span>
                </Box>
              </Box>

              {/* Bottom text block: Value, Title, Subtext */}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    fontSize: '1.45rem',
                    lineHeight: 1.15,
                    mb: 0.25,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    mt: 0.5,
                    display: 'block',
                  }}
                >
                  {card.subtext}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SuperAdminKpiCards
