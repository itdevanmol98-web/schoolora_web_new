import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { parentService } from '../../features/parents/parentService';
import type { Parent, CreateParentDto } from '../../features/parents/types';
import { getSchoolId } from '../../utils/tokenStorage';

const RELATIONSHIP_TYPES = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'GUARDIAN', label: 'Legal Guardian' },
  { value: 'OTHER', label: 'Other Family Member' },
];

export const ParentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [relationFilter, setRelationFilter] = useState('ALL');

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateParentDto>({
    firstName: '',
    lastName: '',
    relationshipType: 'FATHER',
    email: '',
    phone: '',
    occupation: '',
    address: '',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadParents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (relationFilter !== 'ALL') params.relationshipType = relationFilter;

      const res = await parentService.listParents(params);
      setParents(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load parents list';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, [activeSchoolId, relationFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setError('Please provide parent first and last name.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await parentService.createParent(formData);
      setSnackbar({
        open: true,
        message: `Parent profile for "${created.firstName} ${created.lastName}" registered.`,
        severity: 'success',
      });
      setCreateModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        relationshipType: 'FATHER',
        email: '',
        phone: '',
        occupation: '',
        address: '',
      });
      loadParents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error registering parent profile';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Parents & Guardians Directory"
        subtitle="Manage verified family guardians, contact credentials, student wards, and authorization"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadParents}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Add Parent / Guardian
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Toolbar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            label="Filter by Relationship Type"
            value={relationFilter}
            onChange={(e) => setRelationFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="ALL">All Relationships</MenuItem>
            {RELATIONSHIP_TYPES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Showing <strong>{parents.length}</strong> parent/guardian record(s)
          </Typography>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : parents.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <EscalatorWarningIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Parents / Guardians Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register parents or legal guardians to link them with enrolled students.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Parent Profile
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Parent / Guardian Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Relationship</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Occupation</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parents.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.firstName} {p.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.relationshipType}
                      size="small"
                      color={
                        p.relationshipType === 'FATHER'
                          ? 'primary'
                          : p.relationshipType === 'MOTHER'
                          ? 'secondary'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{p.email || '—'}</TableCell>
                  <TableCell>{p.phone || '—'}</TableCell>
                  <TableCell>{p.occupation || '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details & Link Students">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/people/parents/${p.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Parent Dialog */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Register Parent / Guardian</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="First Name"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Last Name"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Relationship Type"
                  fullWidth
                  value={formData.relationshipType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      relationshipType: e.target.value as CreateParentDto['relationshipType'],
                    }))
                  }
                >
                  {RELATIONSHIP_TYPES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Occupation"
                  fullWidth
                  placeholder="e.g. Civil Engineer, Doctor, Teacher"
                  value={formData.occupation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Phone"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="742 Evergreen Terrace"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setCreateModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Registering...' : 'Save Parent'}
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
export default ParentsListPage;
