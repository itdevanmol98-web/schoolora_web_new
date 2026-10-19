import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Calendar, Plus } from 'lucide-react'

export interface SuperAdminWelcomeProps {
  onAddNewSchool: () => void
}

export const SuperAdminWelcome: React.FC<SuperAdminWelcomeProps> = ({ onAddNewSchool }) => {
  const [currentDateTime, setCurrentDateTime] = useState({
    dateStr: '',
    timeStr: '',
  })

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const dayName = days[now.getDay()]
      const dayNum = now.getDate()
      const monthName = months[now.getMonth()]
      const year = now.getFullYear()

      let hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes
      const hoursStr = hours < 10 ? '0' + hours : hours

      setCurrentDateTime({
        dateStr: `${dayName}, ${dayNum} ${monthName} ${year}`,
        timeStr: `${hoursStr}:${minutesStr} ${ampm}`,
      })
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'flex-start', lg: 'center' },
        justifyContent: 'space-between',
        gap: 2.5,
        mb: 3,
      }}
    >
      {/* Left: Title & Subtitle */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            color: '#1e60f0',
            letterSpacing: '0.08em',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          SUPER ADMIN DASHBOARD
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              lineHeight: 1.2,
            }}
          >
            Good Morning, Super Admin
          </Typography>
          <Box component="span" sx={{ fontSize: '1.75rem' }}>
            👋
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            mt: 0.5,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Manage all your schools, users, subscriptions and platform activities from one place.
        </Typography>
      </Box>

      {/* Right: Date/Time Card, System Status Card, Add School Button */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          width: { xs: '100%', lg: 'auto' },
        }}
      >
        {/* Dynamic Date & Time Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1,
            bgcolor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: '#f1f5f9',
              color: '#475569',
            }}
          >
            <Calendar size={18} />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem', lineHeight: 1.2 }}
            >
              {currentDateTime.dateStr || 'Wednesday, 17 Sep 2026'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}
            >
              {currentDateTime.timeStr || '04:59 AM'}
            </Typography>
          </Box>
        </Box>

        {/* System Status Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1,
            bgcolor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#10b981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block', lineHeight: 1 }}
            >
              System Status
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.8rem', mt: 0.2 }}
            >
              All Systems Operational
            </Typography>
          </Box>
        </Box>

        {/* Primary Action: + Add New School Button */}
        <Button
          variant="contained"
          onClick={onAddNewSchool}
          startIcon={<Plus size={18} />}
          sx={{
            bgcolor: '#1e60f0',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            px: 2.25,
            py: 1.15,
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(30, 96, 240, 0.25)',
            '&:hover': {
              bgcolor: '#154ecc',
            },
          }}
        >
          + Add New School
        </Button>
      </Box>
    </Box>
  )
}

export default SuperAdminWelcome
