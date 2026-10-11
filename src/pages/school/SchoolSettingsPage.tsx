import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { schoolService } from '../../features/schools/schoolService';
import type { SchoolItem } from '../../features/schools/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const SchoolSettingsPage: React.FC = () => {
  const [school, setSchool] = useState<SchoolItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
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

    async function loadSchool() {
      try {
        setLoading(true);
        setError(null);
        let targetId = activeSchoolId;
        if (!targetId) {
          const listRes = await schoolService.getSchools({ limit: 1 });
          if (listRes.schools && listRes.schools.length > 0) {
            targetId = listRes.schools[0].id;
          }
        }

        if (targetId) {
          const schoolData = await schoolService.getSchoolById(targetId);
          if (!cancelled) {
            setSchool(schoolData);
            setFormData({
              name: schoolData.name || '',
              code: schoolData.code || '',
              contactEmail: schoolData.contactEmail || '',
              contactPhone: schoolData.contactPhone || '',
              address: schoolData.address || '',
              status: (schoolData.status === 'ARCHIVED' ? 'INACTIVE' : schoolData.status) as 'ACTIVE' | 'INACTIVE',
            });
          }
        } else {
          if (!cancelled) {
            setError('No school found in current tenant. Please create a school first.');
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load school details';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSchool();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    try {
      setSaving(true);
      setError(null);
      const updated = await schoolService.updateSchool(school.id, {
        name: formData.name,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
      });
      setSchool(updated);
      setSnackbar({
        open: true,
        message: 'School configuration updated successfully.',
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating school settings';
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
        title="School Settings & Identity"
        subtitle="Configure school name, address, campus communications, and status"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                if (school) {
                  setLoading(true);
                  schoolService.getSchoolById(school.id).then((s) => {
                    setSchool(s);
                    setLoading(false);
                  });
                }
              }}
            >
              Reload
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || loading || !school}
            >
              Save Settings
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !school ? (
        <Alert severity="warning">
          No school selected or available to configure. Please ensure a school is registered.
        </Alert>
      ) : (
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardHeader
                  avatar={<TuneIcon color="primary" />}
                  title="Campus Profile & Identification"
                  subheader="Official institution details and contact channels"
                  action={
                    <Chip
                      label={school.status}
                      color={school.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      sx={{ mr: 1, mt: 1 }}
                    />
                  }
                />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="School Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />

                  <TextField
                    label="School Code (Read Only)"
                    fullWidth
                    disabled
                    value={formData.code}
                    helperText="Unique system identifier assigned during registration"
                  />

                  <TextField
                    label="Contact Email"
                    fullWidth
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    helperText="Official inbox for school administration and guardian notifications"
                  />

                  <TextField
                    label="Contact Phone"
                    fullWidth
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  />

                  <TextField
                    label="Physical Address"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Street, City, Postal Code, Country"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card>
                <CardHeader title="System Metadata" subheader="Audit identifiers and status tracking" />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      School UUID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {school.id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tenant Reference
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {school.tenantId || 'Primary Tenant'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body2">
                      {school.createdAt ? new Date(school.createdAt).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {school.updatedAt ? new Date(school.updatedAt).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
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
export default SchoolSettingsPage;
