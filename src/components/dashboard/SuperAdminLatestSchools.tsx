import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Building2 } from 'lucide-react'
import { LATEST_SCHOOLS_DATA, type SchoolRegistrationRow } from './dashboardData'

export interface SuperAdminLatestSchoolsProps {
  schools?: SchoolRegistrationRow[]
  onViewAll?: () => void
}

export const SuperAdminLatestSchools: React.FC<SuperAdminLatestSchoolsProps> = ({
  schools = LATEST_SCHOOLS_DATA,
  onViewAll,
}) => {
  const getStatusBadge = (status: SchoolRegistrationRow['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Box
            sx={{
              display: 'inline-block',
              px: 1.25,
              py: 0.35,
              borderRadius: '9999px',
              bgcolor: '#dcfce7',
              color: '#16a34a',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            Active
          </Box>
        )
      case 'Pending':
        return (
          <Box
            sx={{
              display: 'inline-block',
              px: 1.25,
              py: 0.35,
              borderRadius: '9999px',
              bgcolor: '#fef3c7',
              color: '#d97706',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            Pending
          </Box>
        )
      case 'Inactive':
        return (
          <Box
            sx={{
              display: 'inline-block',
              px: 1.25,
              py: 0.35,
              borderRadius: '9999px',
              bgcolor: '#fee2e2',
              color: '#dc2626',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            Inactive
          </Box>
        )
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
            <Building2 size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Latest School Registrations
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Recently registered schools
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

      {/* Table */}
      <TableContainer sx={{ flexGrow: 1, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, py: 1.2 } }}>
              <TableCell>School Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '& td': { borderBottom: '1px solid #f8fafc', py: 1.15, fontSize: '0.8rem' },
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                  {row.name}
                </TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.location}</TableCell>
                <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{row.plan}</TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.date}</TableCell>
                <TableCell align="right">{getStatusBadge(row.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SuperAdminLatestSchools
