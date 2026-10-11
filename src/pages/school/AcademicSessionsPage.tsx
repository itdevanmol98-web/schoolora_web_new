import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { academicSessionService } from '../../features/academics/academicSessionService';
import type { AcademicSessionItem, CreateAcademicSessionPayload } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const AcademicSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateAcademicSessionPayload>({
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: async () => {},
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await academicSessionService.listSessions({
        sortBy: 'startDate',
        sortOrder: 'desc',
      });
      setSessions(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load academic sessions';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [activeSchoolId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required session fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await academicSessionService.createSession({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      setSnackbar({
        open: true,
        message: 'Academic session created successfully.',
        severity: 'success',
      });
      setCreateModalOpen(false);
      setFormData({ name: '', code: '', startDate: '', endDate: '', isCurrent: false });
      loadSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating academic session';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetCurrent = (session: AcademicSessionItem) => {
    setConfirmDialog({
      open: true,
      title: 'Set as Active Session?',
      description: `Are you sure you want to activate "${session.name}"? This will become the current default session across enrollments, classes, and reporting.`,
      onConfirm: async () => {
        try {
          await academicSessionService.setCurrentSession(session.id);
          setSnackbar({
            open: true,
            message: `Session "${session.name}" is now current.`,
            severity: 'success',
          });
          loadSessions();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to set current session';
          setSnackbar({ open: true, message: msg, severity: 'error' });
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleCloseSession = (session: AcademicSessionItem) => {
    setConfirmDialog({
      open: true,
      title: 'Close Academic Session?',
      description: `Closing "${session.name}" locks historical enrollments and records. This action marks the term complete.`,
      onConfirm: async () => {
        try {
          await academicSessionService.closeSession(session.id);
          setSnackbar({
            open: true,
            message: `Session "${session.name}" has been closed.`,
            severity: 'success',
          });
          loadSessions();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to close session';
          setSnackbar({ open: true, message: msg, severity: 'error' });
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Academic Sessions & Years"
        subtitle="Configure school years, activate operational terms, and archive historical records"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadSessions}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              New Session
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
      ) : sessions.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <DateRangeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Academic Sessions Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Initialize your school's first academic term or school year to begin class enrollments.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Academic Session
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Session Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.name}
                    </Typography>
                    {row.isCurrent && (
                      <Chip label="CURRENT ACTIVE" color="primary" size="small" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={row.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {row.startDate ? new Date(row.startDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {row.endDate ? new Date(row.endDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status || (row.isCurrent ? 'ACTIVE' : 'INACTIVE')}
                      color={
                        row.status === 'ACTIVE' || row.isCurrent
                          ? 'success'
                          : row.status === 'CLOSED'
                          ? 'default'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {!row.isCurrent && row.status !== 'CLOSED' && (
                        <Tooltip title="Set as Current Active Session">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleSetCurrent(row)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.status !== 'CLOSED' && (
                        <Tooltip title="Close / Lock Session">
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => handleCloseSession(row)}
                          >
                            <LockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Session Dialog */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Create Academic Session</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Session Name"
                  fullWidth
                  required
                  placeholder="e.g. Academic Year 2026-2027"
                  value={formData.name}
                  onChange={(e) => setFormData((prev: CreateAcademicSessionPayload) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Session Code"
                  fullWidth
                  required
                  placeholder="e.g. AY-2026-27"
                  value={formData.code}
                  onChange={(e) => setFormData((prev: CreateAcademicSessionPayload) => ({ ...prev, code: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev: CreateAcademicSessionPayload) => ({ ...prev, startDate: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev: CreateAcademicSessionPayload) => ({ ...prev, endDate: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isCurrent}
                      onChange={(e) =>
                        setFormData((prev: CreateAcademicSessionPayload) => ({ ...prev, isCurrent: e.target.checked }))
                      }
                    />
                  }
                  label="Set as Current Active Session immediately"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setCreateModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Session'}
            </AppButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog((prev: { open: boolean; title: string; description: string; onConfirm: () => Promise<void> }) => ({ ...prev, open: false }))}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{confirmDialog.description}</Typography>
        </DialogContent>
        <DialogActions>
          <AppButton onClick={() => setConfirmDialog((prev: { open: boolean; title: string; description: string; onConfirm: () => Promise<void> }) => ({ ...prev, open: false }))}>Cancel</AppButton>
          <AppButton variant="contained" color="primary" onClick={confirmDialog.onConfirm}>
            Confirm
          </AppButton>
        </DialogActions>
      </Dialog>

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
export default AcademicSessionsPage;
