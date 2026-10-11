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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { subjectService } from '../../features/academics/subjectService';
import type { SubjectItem, CreateSubjectPayload } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

const SUBJECT_TYPES = [
  { value: 'THEORY', label: 'Theory' },
  { value: 'PRACTICAL', label: 'Practical / Lab' },
  { value: 'ELECTIVE', label: 'Elective' },
  { value: 'CO_CURRICULAR', label: 'Co-Curricular / Sports' },
];

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSubjectPayload>({
    name: '',
    code: '',
    type: 'THEORY',
    creditHours: 3.0,
    description: '',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = typeFilter !== 'ALL' ? { type: typeFilter } : undefined;
      const res = await subjectService.listSubjects(params);
      setSubjects(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load subjects catalog';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [activeSchoolId, typeFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setError('Please provide subject name and unique code.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await subjectService.createSubject({
        ...formData,
        creditHours: Number(formData.creditHours),
      });
      setSnackbar({ open: true, message: 'Subject created successfully.', severity: 'success' });
      setCreateModalOpen(false);
      setFormData({ name: '', code: '', type: 'THEORY', creditHours: 3.0, description: '' });
      loadSubjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating subject';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Subjects & Curriculum Catalog"
        subtitle="Master subject repository with credits, lecture types, and departmental categorization"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadSubjects}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              New Subject
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            label="Filter by Subject Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="ALL">All Subject Types</MenuItem>
            {SUBJECT_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            Showing {subjects.length} course(s)
          </Typography>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : subjects.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <MenuBookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Subjects Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add subjects such as Mathematics, Physics, English, or History to the campus curriculum.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Subject
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Subject Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Course Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Credit Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((sub) => (
                <TableRow key={sub.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {sub.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={sub.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sub.type}
                      size="small"
                      color={
                        sub.type === 'THEORY'
                          ? 'primary'
                          : sub.type === 'PRACTICAL'
                          ? 'secondary'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{sub.creditHours ? `${sub.creditHours} hrs` : 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {sub.description || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Subject Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Add Course Subject</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Subject Name"
                  fullWidth
                  required
                  placeholder="e.g. Advanced Physics"
                  value={formData.name}
                  onChange={(e) => setFormData((prev: CreateSubjectPayload) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Subject Code"
                  fullWidth
                  required
                  placeholder="e.g. PHY-101"
                  value={formData.code}
                  onChange={(e) => setFormData((prev: CreateSubjectPayload) => ({ ...prev, code: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Subject Type"
                  fullWidth
                  value={formData.type}
                  onChange={(e) => setFormData((prev: CreateSubjectPayload) => ({ ...prev, type: e.target.value }))}
                >
                  {SUBJECT_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Credit Hours / Weight"
                  type="number"
                  fullWidth
                  value={formData.creditHours}
                  onChange={(e) =>
                    setFormData((prev: CreateSubjectPayload) => ({ ...prev, creditHours: Number(e.target.value) }))
                  }
                  slotProps={{ htmlInput: { step: 0.5, min: 0 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description / Syllabus Scope"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g. Mechanics, Optics, and Thermodynamics"
                  value={formData.description}
                  onChange={(e) => setFormData((prev: CreateSubjectPayload) => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setCreateModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Subject'}
            </AppButton>
          </DialogActions>
        </form>
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
export default SubjectsPage;
