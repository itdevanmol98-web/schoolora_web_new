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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { teacherService } from '../../features/teachers/teacherService';
import type { TeacherProfile, CreateTeacherDto } from '../../features/teachers/types';
import { getSchoolId } from '../../utils/tokenStorage';

const DEPARTMENTS = [
  'Mathematics',
  'Science',
  'English & Literature',
  'Social Studies',
  'Computer Science & IT',
  'Foreign Languages',
  'Physical Education',
  'Arts & Music',
];

export const TeachersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTeacherDto>({
    email: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    designation: 'Faculty Instructor',
    department: 'Science',
    qualification: 'M.Sc. Education',
    specialization: '',
    joiningDate: new Date().toISOString().split('T')[0],
    phone: '',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (deptFilter !== 'ALL') params.department = deptFilter;

      const res = await teacherService.listTeachers(params);
      setTeachers(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load faculty directory';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [activeSchoolId, deptFilter]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId) {
      setError('Please provide full name, email, and employee ID.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await teacherService.createTeacher({
        ...formData,
        joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : undefined,
      });
      setSnackbar({
        open: true,
        message: `Teacher profile "${created.firstName} ${created.lastName}" registered successfully.`,
        severity: 'success',
      });
      setCreateModalOpen(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        employeeId: '',
        designation: 'Faculty Instructor',
        department: 'Science',
        qualification: 'M.Sc. Education',
        specialization: '',
        joiningDate: new Date().toISOString().split('T')[0],
        phone: '',
      });
      loadTeachers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error registering teacher profile';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Faculty & Teachers Directory"
        subtitle="Manage educator profiles, department specializations, employee credentials, and teaching duties"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadTeachers}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Add Faculty Profile
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
            label="Filter by Department"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="ALL">All Departments</MenuItem>
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Showing <strong>{teachers.length}</strong> faculty member(s)
          </Typography>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : teachers.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <SupervisorAccountIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Teachers Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register campus faculty members and link them with departmental assignments.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Faculty Profile
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Teacher Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Chip label={t.employeeId} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t.firstName} {t.lastName}
                    </Typography>
                    {t.qualification && (
                      <Typography variant="caption" color="text.secondary">
                        {t.qualification}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={t.department || 'General'} size="small" />
                  </TableCell>
                  <TableCell>{t.designation || 'Instructor'}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={t.status || 'ACTIVE'}
                      size="small"
                      color={t.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Profile & Teaching Overview">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/people/teachers/${t.id}`)}
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

      {/* Create Teacher Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Register Teacher / Faculty Profile</DialogTitle>
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
                  label="Employee / Staff ID"
                  fullWidth
                  required
                  placeholder="e.g. EMP-TCH-002"
                  value={formData.employeeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Institutional Email"
                  type="email"
                  fullWidth
                  required
                  placeholder="teacher@schoolora.local"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Department"
                  fullWidth
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                >
                  {DEPARTMENTS.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Designation / Title"
                  fullWidth
                  value={formData.designation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder="e.g. Senior Faculty, Department Head"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Highest Qualification"
                  fullWidth
                  value={formData.qualification}
                  onChange={(e) => setFormData((prev) => ({ ...prev, qualification: e.target.value }))}
                  placeholder="e.g. M.Sc. Physics, Ph.D. Mathematics"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Subject Specialization"
                  fullWidth
                  value={formData.specialization}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                  placeholder="e.g. Quantum Mechanics, Organic Chemistry"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date of Joining"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formData.joiningDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, joiningDate: e.target.value }))}
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setCreateModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Faculty Profile'}
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
export default TeachersListPage;
