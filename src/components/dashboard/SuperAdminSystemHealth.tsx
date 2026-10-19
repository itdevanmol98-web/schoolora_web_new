import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Activity, Server, Database, HardDrive, Cpu } from 'lucide-react'

export interface SuperAdminSystemHealthProps {
  onViewDetails?: () => void
}

export const SuperAdminSystemHealth: React.FC<SuperAdminSystemHealthProps> = ({ onViewDetails }) => {
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
        justifyContent: 'space-between',
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
              bgcolor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              System Health
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Server status and resource usage
            </Typography>
          </Box>
        </Box>

        <Button
          variant="text"
          onClick={onViewDetails}
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
          View Details
        </Button>
      </Box>

      {/* 4 Health Gauges Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
          gap: 2,
          py: 1,
        }}
      >
        {/* 1. Server Online */}
        <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
            }}
          >
            <Server size={18} />
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
            Server
          </Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.35 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#16a34a' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a', fontSize: '0.8rem' }}>
              Online
            </Typography>
          </Box>
        </Box>

        {/* 2. Database Usage */}
        <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
            }}
          >
            <Database size={18} />
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
            Database
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', mt: 0.35 }}>
            116.78 MB
          </Typography>
        </Box>

        {/* 3. Disk Usage (28%) */}
        <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          {/* Radial Ring */}
          <Box sx={{ position: 'relative', width: 38, height: 38, mx: 'auto', mb: 1 }}>
            <svg width="38" height="38" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${(28 / 100) * 100.5} 100.5`}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <HardDrive size={14} />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
            Disk Usage
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', mt: 0.35 }}>
            28%
          </Typography>
          <Box sx={{ width: '80%', height: 4, bgcolor: '#e2e8f0', borderRadius: 2, mx: 'auto', mt: 0.5, overflow: 'hidden' }}>
            <Box sx={{ width: '28%', height: '100%', bgcolor: '#10b981', borderRadius: 2 }} />
          </Box>
        </Box>

        {/* 4. RAM Usage (44%) */}
        <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          {/* Radial Ring */}
          <Box sx={{ position: 'relative', width: 38, height: 38, mx: 'auto', mb: 1 }}>
            <svg width="38" height="38" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeDasharray={`${(44 / 100) * 100.5} 100.5`}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6',
              }}
            >
              <Cpu size={14} />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
            RAM Usage
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', mt: 0.35 }}>
            44%
          </Typography>
          <Box sx={{ width: '80%', height: 4, bgcolor: '#e2e8f0', borderRadius: 2, mx: 'auto', mt: 0.5, overflow: 'hidden' }}>
            <Box sx={{ width: '44%', height: '100%', bgcolor: '#8b5cf6', borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SuperAdminSystemHealth
