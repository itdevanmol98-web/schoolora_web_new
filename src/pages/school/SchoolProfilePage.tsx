import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { schoolSetupService } from '../../features/schoolSetup/schoolSetupService';
import type { SchoolAcademicProfile, SchoolSetupStatus } from '../../features/schoolSetup/types';
import { getSchoolId } from '../../utils/tokenStorage';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'UTC',
  'Europe/London',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD', 'AUD'];
const DATE_FORMATS = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
const GRADING_SYSTEMS = [
  { value: 'GPA_4_SCALE', label: 'GPA (4.0 Scale)' },
  { value: 'PERCENTAGE', label: 'Percentage (0-100%)' },
  { value: 'LETTER_GRADE', label: 'Letter Grade (A-F)' },
  { value: 'CWA', label: 'Continuous Weighted Assessment' },
];
const ATTENDANCE_TYPES = [
  { value: 'DAILY', label: 'Daily (Once a day)' },
  { value: 'PERIOD_WISE', label: 'Period-wise (Per subject/lecture)' },
  { value: 'TWICE_DAILY', label: 'Twice Daily (Morning & Afternoon)' },
];

export const SchoolProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<SchoolAcademicProfile>({
    timezone: 'America/New_York',
    locale: 'en-US',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    academicYearStartMonth: 8,
    gradingSystem: 'GPA_4_SCALE',
    attendanceType: 'DAILY',
    affiliationNumber: '',
  });

  const [setupStatus, setSetupStatus] = useState<SchoolSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [profileRes, statusRes] = await Promise.allSettled([
          schoolSetupService.getProfile(),
          schoolSetupService.getStatus(),
        ]);

        if (!cancelled) {
          if (profileRes.status === 'fulfilled') {
            setProfile(profileRes.value);
          }
          if (statusRes.status === 'fulfilled') {
            setSetupStatus(statusRes.value);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load school profile';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  const handleChange = (field: keyof SchoolAcademicProfile, value: unknown) => {
    setProfile((prev: SchoolAcademicProfile) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const updated = await schoolSetupService.updateProfile(profile);
      setProfile(updated);
      setSnackbar({
        open: true,
        message: 'School profile & academic settings saved successfully.',
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating school profile';
      setError(msg);
      setSnackbar({
        open: true,
        message: msg,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="School Academic Profile"
        subtitle="Manage campus academic parameters, timezones, currency, grading systems, and affiliation"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setLoading(true);
                schoolSetupService.getProfile().then((p) => {
                  setProfile(p);
                  setLoading(false);
                });
              }}
            >
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || loading}
            >
              Save Profile
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Setup Wizard Status Banner */}
      {setupStatus && (
        <Card sx={{ mb: 3, borderLeft: '4px solid #1976d2' }}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Campus Onboarding: {setupStatus.isCompleted ? 'Fully Configured' : setupStatus.step || 'In Progress'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {setupStatus.isCompleted
                      ? 'All setup milestones completed. Campus academic calendar and rosters are active.'
                      : setupStatus.message || 'Configure your academic sessions, classes, and subjects to complete onboarding.'}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={setupStatus.isCompleted ? 'SETUP COMPLETE' : 'SETUP IN PROGRESS'}
                color={setupStatus.isCompleted ? 'success' : 'warning'}
                size="small"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* Campus Identification */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  avatar={<BusinessIcon color="primary" />}
                  title="Campus & Accreditation"
                  subheader="Affiliation numbers and regional credentials"
                />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Affiliation / License Number"
                    fullWidth
                    value={profile.affiliationNumber || ''}
                    onChange={(e) => handleChange('affiliationNumber', e.target.value)}
                    placeholder="e.g. AFF-2026-NY-99"
                    helperText="Official school registration or board affiliation ID"
                  />

                  <TextField
                    select
                    label="Academic Year Start Month"
                    fullWidth
                    value={profile.academicYearStartMonth || 8}
                    onChange={(e) => handleChange('academicYearStartMonth', Number(e.target.value))}
                  >
                    {[
                      { m: 1, name: 'January' },
                      { m: 2, name: 'February' },
                      { m: 3, name: 'March' },
                      { m: 4, name: 'April' },
                      { m: 5, name: 'May' },
                      { m: 6, name: 'June' },
                      { m: 7, name: 'July' },
                      { m: 8, name: 'August' },
                      { m: 9, name: 'September' },
                      { m: 10, name: 'October' },
                      { m: 11, name: 'November' },
                      { m: 12, name: 'December' },
                    ].map((mo) => (
                      <MenuItem key={mo.m} value={mo.m}>
                        {mo.name} (Month {mo.m})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Grading System"
                    fullWidth
                    value={profile.gradingSystem || 'GPA_4_SCALE'}
                    onChange={(e) => handleChange('gradingSystem', e.target.value)}
                  >
                    {GRADING_SYSTEMS.map((gs) => (
                      <MenuItem key={gs.value} value={gs.value}>
                        {gs.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Attendance Frequency"
                    fullWidth
                    value={profile.attendanceType || 'DAILY'}
                    onChange={(e) => handleChange('attendanceType', e.target.value)}
                  >
                    {ATTENDANCE_TYPES.map((att) => (
                      <MenuItem key={att.value} value={att.value}>
                        {att.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid>

            {/* Regional & Localization Settings */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  avatar={<BusinessIcon color="secondary" />}
                  title="Localization & Environment"
                  subheader="Timezone, locale, currency, and date formats"
                />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    select
                    label="System Timezone"
                    fullWidth
                    value={profile.timezone || 'America/New_York'}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    {TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="System Locale"
                    fullWidth
                    value={profile.locale || 'en-US'}
                    onChange={(e) => handleChange('locale', e.target.value)}
                    helperText="IETF BCP 47 language tag (e.g. en-US, en-GB, fr-FR)"
                  />

                  <TextField
                    select
                    label="Currency"
                    fullWidth
                    value={profile.currency || 'USD'}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Date Format"
                    fullWidth
                    value={profile.dateFormat || 'YYYY-MM-DD'}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    {DATE_FORMATS.map((fmt) => (
                      <MenuItem key={fmt} value={fmt}>
                        {fmt}
                      </MenuItem>
                    ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev: { open: boolean; message: string; severity: 'success' | 'error' }) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev: { open: boolean; message: string; severity: 'success' | 'error' }) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default SchoolProfilePage;
