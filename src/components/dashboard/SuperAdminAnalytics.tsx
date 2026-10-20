import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { TrendingUp, BarChart2, PieChart, IndianRupee } from 'lucide-react'
import {
  SCHOOL_GROWTH_DATA,
  SUBSCRIPTION_PLANS_DATA,
  PLATFORM_REVENUE_DATA,
} from './dashboardData'

export const SuperAdminAnalytics: React.FC = () => {
  const [schoolsPeriod, setSchoolsPeriod] = useState('12m')
  const [revenuePeriod, setRevenuePeriod] = useState('this-month')

  // Donut chart calculations
  const totalSubscriptions = SUBSCRIPTION_PLANS_DATA.reduce((acc, curr) => acc + curr.count, 0)
  const radius = 64
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  let accumulatedOffset = 0

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2.5}>
        {/* Card A: Schools Growth */}
        <Grid size={{ xs: 12, md: 6, lg: 4.5 }}>
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
                alignItems: 'flex-start',
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
                  <BarChart2 size={18} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    Schools Growth
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Total schools added in last 12 months
                  </Typography>
                </Box>
              </Box>

              {/* Period Dropdown */}
              <Select
                value={schoolsPeriod}
                onChange={(e) => setSchoolsPeriod(e.target.value)}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  height: 30,
                  bgcolor: '#f8fafc',
                  borderRadius: '8px',
                  '& .MuiSelect-select': { py: 0.5, px: 1.25 },
                }}
              >
                <MenuItem value="12m">Last 12 Months</MenuItem>
                <MenuItem value="6m">Last 6 Months</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </Box>

            {/* SVG Bar Chart for Schools Growth */}
            <Box sx={{ width: '100%', height: 180, position: 'relative', my: 1 }}>
              <svg width="100%" height="100%" viewBox="0 0 480 180" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[0, 20, 40, 60, 80].map((val) => {
                  const y = 140 - (val / 80) * 120
                  return (
                    <g key={val}>
                      <line
                        x1="28"
                        y1={y}
                        x2="470"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text x="20" y={y + 3.5} textAnchor="end" fill="#94a3b8" fontSize="9">
                        {val}
                      </text>
                    </g>
                  )
                })}

                {/* Bars for 12 months */}
                {SCHOOL_GROWTH_DATA.map((item, idx) => {
                  const startX = 38 + idx * 36
                  const newHeight = (item.newSchools / 80) * 120
                  const totalHeight = (item.totalSchools / 80) * 120
                  const newY = 140 - newHeight
                  const totalY = 140 - totalHeight

                  return (
                    <g key={item.month}>
                      {/* Total schools bar (darker blue) */}
                      <Tooltip
                        title={`${item.month}: Total ${item.totalSchools} schools, New: ${item.newSchools}`}
                        arrow
                      >
                        <rect
                          x={startX + 10}
                          y={totalY}
                          width="9"
                          height={totalHeight}
                          rx="3"
                          fill="#1e60f0"
                          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                        />
                      </Tooltip>

                      {/* New schools bar (light blue) */}
                      <Tooltip
                        title={`${item.month} New Schools: ${item.newSchools}`}
                        arrow
                      >
                        <rect
                          x={startX}
                          y={newY}
                          width="9"
                          height={newHeight}
                          rx="3"
                          fill="#38bdf8"
                          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                        />
                      </Tooltip>

                      {/* Month label */}
                      <text
                        x={startX + 9.5}
                        y="158"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9.5"
                        fontWeight="500"
                      >
                        {item.month}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, pt: 1, borderTop: '1px solid #f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: '#38bdf8' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                  New Schools
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: '#1e60f0' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                  Total Schools
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Card B: Subscription Plans Donut Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 3.5 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  bgcolor: '#ecfeff',
                  color: '#0891b2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PieChart size={18} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                  Subscription Plans
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Active subscriptions by plan type
                </Typography>
              </Box>
            </Box>

            {/* Donut Chart and Legend Row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                py: 1.5,
              }}
            >
              {/* SVG Donut */}
              <Box sx={{ position: 'relative', width: 150, height: 150 }}>
                <svg width="150" height="150" viewBox="0 0 160 160">
                  <g transform="rotate(-90 80 80)">
                    {SUBSCRIPTION_PLANS_DATA.map((plan) => {
                      const percentage = plan.count / totalSubscriptions
                      const dashLength = percentage * circumference
                      const strokeDasharray = `${dashLength} ${circumference}`
                      const strokeDashoffset = -accumulatedOffset
                      accumulatedOffset += dashLength

                      return (
                        <circle
                          key={plan.name}
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="transparent"
                          stroke={plan.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      )
                    })}
                  </g>
                </svg>

                {/* Center Text */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {totalSubscriptions}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>
                    Active
                  </Typography>
                </Box>
              </Box>

              {/* Legend List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {SUBSCRIPTION_PLANS_DATA.map((plan) => (
                  <Box key={plan.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: plan.color }} />
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', minWidth: 80 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
                      {plan.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ height: 10 }} />
          </Box>
        </Grid>

        {/* Card C: Platform Revenue */}
        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
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
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: '#fff7ed',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IndianRupee size={18} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    Platform Revenue
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Monthly revenue from all schools
                  </Typography>
                </Box>
              </Box>

              {/* Month Selector */}
              <Select
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value)}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  height: 30,
                  bgcolor: '#f8fafc',
                  borderRadius: '8px',
                  '& .MuiSelect-select': { py: 0.5, px: 1.25 },
                }}
              >
                <MenuItem value="this-month">This Month</MenuItem>
                <MenuItem value="last-quarter">Last Quarter</MenuItem>
                <MenuItem value="this-year">This Year</MenuItem>
              </Select>
            </Box>

            {/* Total Revenue Highlight */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ₹ 12,50,000
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.35,
                  px: 0.85,
                  py: 0.25,
                  borderRadius: '9999px',
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={11} strokeWidth={2.5} />
                <span>+28%</span>
              </Box>
            </Box>

            {/* SVG Revenue Bar Chart */}
            <Box sx={{ width: '100%', height: 130, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 340 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines */}
                {[0, 5, 10, 15].map((val) => {
                  const y = 100 - (val / 15) * 85
                  return (
                    <g key={val}>
                      <line
                        x1="26"
                        y1={y}
                        x2="330"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text x="22" y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8.5">
                        {val === 0 ? '0' : `${val}L`}
                      </text>
                    </g>
                  )
                })}

                {/* Revenue Bars */}
                {PLATFORM_REVENUE_DATA.map((item, idx) => {
                  const startX = 42 + idx * 48
                  const barHeight = (item.revenue / 15) * 85
                  const barY = 100 - barHeight

                  return (
                    <g key={item.month}>
                      <Tooltip title={`${item.month}: ${item.label}`} arrow>
                        <rect
                          x={startX}
                          y={barY}
                          width="24"
                          height={barHeight}
                          rx="4"
                          fill="url(#revenueBarGrad)"
                          style={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                      <text
                        x={startX + 12}
                        y="118"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9.5"
                        fontWeight="500"
                      >
                        {item.month}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SuperAdminAnalytics
