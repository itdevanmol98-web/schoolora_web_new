import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Trophy } from 'lucide-react'
import { TOP_SCHOOLS_DATA, type TopSchoolItem } from './dashboardData'

export interface SuperAdminTopSchoolsProps {
  schools?: TopSchoolItem[]
  onViewAll?: () => void
}

export const SuperAdminTopSchools: React.FC<SuperAdminTopSchoolsProps> = ({
  schools = TOP_SCHOOLS_DATA,
  onViewAll,
}) => {
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { bgcolor: '#ffedd5', color: '#ea580c', border: '1px solid #fed7aa' }
      case 2:
        return { bgcolor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
      case 3:
        return { bgcolor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }
      default:
        return { bgcolor: '#f8fafc', color: '#94a3b8', border: '1px solid #f1f5f9' }
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
            <Trophy size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Top Schools
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              By student count
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

      {/* Ranked List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, justifyContent: 'space-around' }}>
        {schools.map((item) => {
          const badgeStyle = getRankBadgeStyle(item.rank)

          return (
            <Box
              key={item.rank}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.5,
              }}
            >
              {/* Rank & School Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    ...badgeStyle,
                  }}
                >
                  {item.rank}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                  {item.name}
                </Typography>
              </Box>

              {/* Student Count */}
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.82rem' }}>
                {item.studentCount}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SuperAdminTopSchools
