import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BadgeIcon from '@mui/icons-material/Badge';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { teacherService } from '../../features/teachers/teacherService';
import { teacherAssignmentService } from '../../features/teachers/teacherAssignmentService';
import type { TeacherProfile, TeacherAssignment } from '../../features/teachers/types';

export const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [formData, setFormData] = useState({
    designation: '',
    phone: '',
    department: '',
    qualification: '',
    specialization: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadTeacherData() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [teacherData, asgList] = await Promise.all([
          teacherService.getTeacherById(id),
          teacherAssignmentService.listAssignments({ teacherId: id }),
        ]);

        if (!cancelled) {
          setTeacher(teacherData);
          setAssignments(asgList);
          setFormData({
            designation: teacherData.designation || '',
            phone: teacherData.phone || '',
            department: teacherData.department || '',
            qualification: teacherData.qualification || '',
            specialization: teacherData.specialization || '',
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load teacher profile';
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTeacherData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      const updated = await teacherService.updateTeacher(id, {
        designation: formData.designation,
        phone: formData.phone,
        department: formData.department,
        qualification: formData.qualification,
        specialization: formData.specialization,
      });
      setTeacher(updated);
      setSnackbar({
        open: true,
        message: 'Faculty profile updated successfully.',
        severity: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating teacher profile';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !teacher) return;
    if (!window.confirm(`Deactivate educator "${teacher.firstName} ${teacher.lastName}"?`)) return;

    try {
      await teacherService.deleteTeacher(id);
      setSnackbar({
        open: true,
        message: 'Teacher profile deactivated successfully.',
        severity: 'success',
      });
      setTimeout(() => navigate('/people/teachers'), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to deactivate teacher';
      setError(msg);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !teacher) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Teacher not found'}
        </Alert>
        <AppButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/people/teachers')}>
          Back to Directory
        </AppButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title={`${teacher.firstName} ${teacher.lastName}`}
        subtitle={`Employee ID: ${teacher.employeeId} • ${teacher.department || 'General'}`}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/people/teachers')}
            >
              Directory
            </AppButton>
            <AppButton variant="outlined" color="error" onClick={handleDelete}>
              Deactivate
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              onClick={handleUpdate}
              disabled={saving}
            >
              Save Changes
            </AppButton>
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Profile Card & Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader
              avatar={<SupervisorAccountIcon color="primary" />}
              title="Faculty Credentials"
              subheader={
                <Chip
                  label={teacher.status || 'ACTIVE'}
                  color={teacher.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              }
            />
            <Divider />
            <CardContent>
              <form onSubmit={handleUpdate}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Official Institutional Email"
                    fullWidth
                    disabled
                    value={teacher.email}
                  />

                  <TextField
                    label="Designation / Academic Rank"
                    fullWidth
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, designation: e.target.value }))
                    }
                  />

                  <TextField
                    label="Academic Department"
                    fullWidth
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, department: e.target.value }))
                    }
                  />

                  <TextField
                    label="Qualifications"
                    fullWidth
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                  />

                  <TextField
                    label="Subject Specialization"
                    fullWidth
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, specialization: e.target.value }))
                    }
                  />

                  <TextField
                    label="Contact Phone"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Date of Joining:{' '}
                      {teacher.joiningDate
                        ? new Date(teacher.joiningDate).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Teaching Duties */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<BadgeIcon color="secondary" />}
              title="Active Teaching Assignments"
              subheader={`${assignments.length} assigned subject/class duties`}
              action={
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/academics/teacher-assignments')}
                >
                  Manage Assignments
                </AppButton>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {assignments.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No classroom or subject assignments registered for this faculty member.
                  </Typography>
                  <AppButton
                    size="small"
                    variant="contained"
                    onClick={() => navigate('/academics/teacher-assignments')}
                  >
                    Assign to Class
                  </AppButton>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Class & Section</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Academic Term</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((asg) => (
                        <TableRow key={asg.id} hover>
                          <TableCell>
                            <Chip
                              label={asg.role}
                              size="small"
                              color={asg.role === 'CLASS_TEACHER' ? 'secondary' : 'primary'}
                            />
                          </TableCell>
                          <TableCell>
                            {asg.class ? asg.class.name : '—'}
                            {asg.section ? ` / ${asg.section.name}` : ''}
                          </TableCell>
                          <TableCell>{asg.subject?.name || 'All (Homeroom Mentor)'}</TableCell>
                          <TableCell>{asg.session?.name || 'Current Term'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
export default TeacherDetailPage;
