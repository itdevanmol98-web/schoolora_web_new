import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import LayersIcon from '@mui/icons-material/Layers'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import { AppPageHeader, AppCard, AppEmptyState } from '@/components/common'

export const DashboardPlaceholderPage: React.FC = () => {
  const plannedModules = [
    {
      title: 'Student & Academic Records',
      phase: 'Phase 3 Module',
      icon: <PeopleAltOutlinedIcon color="primary" fontSize="large" />,
      description:
        'Module structure prepared for student admissions, class assignments, and profile management.',
    },
    {
      title: 'Attendance & Timetable',
      phase: 'Phase 3 Module',
      icon: <EventAvailableOutlinedIcon color="primary" fontSize="large" />,
      description:
        'Module structure prepared for daily attendance tracking and timetable management.',
    },
    {
      title: 'Fee Management & Billing',
      phase: 'Phase 3 Module',
      icon: <PaymentOutlinedIcon color="primary" fontSize="large" />,
      description:
        'Module structure prepared for fee schedules, invoice generation, and receipt tracking.',
    },
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Schoolora ERP Workspace"
        subtitle="Phase 1 frontend foundation established. Clean architectural boundaries are ready for backend API integration."
      />

      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        <AlertTitle sx={{ fontWeight: 600 }}>Architecture Foundation Ready</AlertTitle>
        This dashboard shell provides the navigation structure and state foundation.
        Business data endpoints and authentication flows will connect in Phase 2 and Phase
        3 without requiring structural rewrites.
      </Alert>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Planned ERP Modules (Ready for Phase 3 Implementation)
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {plannedModules.map((mod) => (
          <Grid size={{ xs: 12, md: 4 }} key={mod.title}>
            <AppCard
              title={mod.title}
              subtitle={mod.phase}
              headerAvatar={mod.icon}
              sx={{ height: '100%' }}
            >
              <Typography variant="body2" color="text.secondary">
                {mod.description}
              </Typography>
            </AppCard>
          </Grid>
        ))}
      </Grid>

      <AppCard title="Live Component System Verification">
        <AppEmptyState
          icon={<LayersIcon sx={{ fontSize: 36, color: 'text.secondary' }} />}
          title="No Active Module Records Yet"
          description="The UI foundation, Material UI theme system, Redux store, and Axios error handling are running cleanly."
        />
      </AppCard>
    </Box>
  )
}

export default DashboardPlaceholderPage
