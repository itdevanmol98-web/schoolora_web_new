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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { teacherAssignmentService } from '../../features/teachers/teacherAssignmentService';
import { teacherService } from '../../features/teachers/teacherService';
import { academicSessionService } from '../../features/academics/academicSessionService';
import { classSectionService } from '../../features/academics/classSectionService';
import { subjectService } from '../../features/academics/subjectService';
import type { TeacherAssignment, CreateTeacherAssignmentDto, TeacherProfile } from '../../features/teachers/types';
import type { AcademicSessionItem, ClassItem, SectionItem, SubjectItem } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

const ASSIGNMENT_ROLES = [
  { value: 'SUBJECT_TEACHER', label: 'Subject Teacher' },
  { value: 'CLASS_TEACHER', label: 'Class / Homeroom Teacher' },
  { value: 'CO_TEACHER', label: 'Co-Teacher / Assistant' },
];

export const TeacherAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [teacherFilter, setTeacherFilter] = useState('ALL');

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTeacherAssignmentDto>({
    sessionId: '',
    teacherId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    role: 'SUBJECT_TEACHER',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (roleFilter !== 'ALL') params.role = roleFilter;
      if (teacherFilter !== 'ALL') params.teacherId = teacherFilter;

      const res = await teacherAssignmentService.listAssignments(params);
      setAssignments(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load teacher assignments';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function initDropdowns() {
      try {
        const [tchRes, sesRes, clsRes, subRes] = await Promise.allSettled([
          teacherService.listTeachers({ limit: 100 }),
          academicSessionService.listSessions(),
          classSectionService.listClasses(),
          subjectService.listSubjects(),
        ]);

        if (!cancelled) {
          if (tchRes.status === 'fulfilled') setTeachers(tchRes.value.data);
          if (sesRes.status === 'fulfilled') {
            setSessions(sesRes.value.data);
            const currentSes = sesRes.value.data.find((s) => s.isCurrent) || sesRes.value.data[0];
            if (currentSes) {
              setFormData((prev) => ({ ...prev, sessionId: currentSes.id }));
            }
          }
          if (clsRes.status === 'fulfilled') setClasses(clsRes.value.data);
          if (subRes.status === 'fulfilled') setSubjects(subRes.value.data);
        }
      } catch (err: unknown) {
        console.error('Error loading dropdowns', err);
      }
    }

    initDropdowns();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  useEffect(() => {
    loadAssignments();
  }, [activeSchoolId, roleFilter, teacherFilter]);

  // Load sections when classId in modal changes
  useEffect(() => {
    if (formData.classId) {
      classSectionService.listSections({ classId: formData.classId }).then((res) => {
        setSections(res.data);
      });
    } else {
      setSections([]);
    }
  }, [formData.classId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sessionId || !formData.teacherId || !formData.classId) {
      setError('Please select session, teacher, and class.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await teacherAssignmentService.createAssignment({
        sessionId: formData.sessionId,
        teacherId: formData.teacherId,
        classId: formData.classId,
        sectionId: formData.sectionId || undefined,
        subjectId: formData.subjectId || undefined,
        role: formData.role,
      });
      setSnackbar({
        open: true,
        message: 'Faculty assignment created successfully.',
        severity: 'success',
      });
      setCreateModalOpen(false);
      loadAssignments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating teacher assignment';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this teacher assignment?')) return;
    try {
      await teacherAssignmentService.deleteAssignment(id);
      setSnackbar({
        open: true,
        message: 'Assignment removed successfully.',
        severity: 'success',
      });
      loadAssignments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove assignment';
      setError(msg);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Teacher & Faculty Assignments"
        subtitle="Assign educators as class homeroom mentors or subject curriculum instructors"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadAssignments}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Assign Teacher
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
            label="Filter by Assignment Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="ALL">All Roles</MenuItem>
            {ASSIGNMENT_ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Filter by Faculty Member"
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="ALL">All Faculty Members</MenuItem>
            {teachers.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.firstName} {t.lastName} ({t.employeeId})
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : assignments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <BadgeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Teacher Assignments Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Deploy faculty teachers to classes, sections, or subjects for the active academic session.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Assignment
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Teacher / Faculty</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assignment Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Class & Section</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Academic Term</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((asg) => (
                <TableRow key={asg.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {asg.teacher
                        ? `${asg.teacher.firstName} ${asg.teacher.lastName}`
                        : 'Teacher Profile'}
                    </Typography>
                    {asg.teacher?.designation && (
                      <Typography variant="caption" color="text.secondary">
                        {asg.teacher.designation}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        asg.role === 'CLASS_TEACHER'
                          ? 'CLASS HOMEROOM MENTOR'
                          : asg.role === 'CO_TEACHER'
                          ? 'CO-TEACHER'
                          : 'SUBJECT TEACHER'
                      }
                      color={
                        asg.role === 'CLASS_TEACHER'
                          ? 'secondary'
                          : asg.role === 'CO_TEACHER'
                          ? 'warning'
                          : 'primary'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {asg.class ? asg.class.name : '—'}
                      {asg.section ? ` / ${asg.section.name}` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {asg.subject ? (
                      <Chip label={asg.subject.name} size="small" variant="outlined" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        All Subjects (Class Mentor)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {asg.session ? asg.session.name : 'Current'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove assignment">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAssignment(asg.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Assignment Dialog */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Assign Teacher to Class / Subject</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Academic Session"
                  fullWidth
                  required
                  value={formData.sessionId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sessionId: e.target.value }))}
                >
                  {sessions.map((ses) => (
                    <MenuItem key={ses.id} value={ses.id}>
                      {ses.name} {ses.isCurrent ? '(Current Active)' : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Teacher / Faculty Member"
                  fullWidth
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, teacherId: e.target.value }))}
                >
                  {teachers.map((tch) => (
                    <MenuItem key={tch.id} value={tch.id}>
                      {tch.firstName} {tch.lastName} ({tch.employeeId} - {tch.department || 'General'})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Academic Class"
                  fullWidth
                  required
                  value={formData.classId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, classId: e.target.value, sectionId: '' }))
                  }
                >
                  {classes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Section (Optional)"
                  fullWidth
                  disabled={!formData.classId}
                  value={formData.sectionId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sectionId: e.target.value }))}
                >
                  <MenuItem value="">All Sections</MenuItem>
                  {sections.map((sec) => (
                    <MenuItem key={sec.id} value={sec.id}>
                      {sec.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Assignment Role"
                  fullWidth
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value as CreateTeacherAssignmentDto['role'],
                    }))
                  }
                >
                  {ASSIGNMENT_ROLES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Curriculum Subject"
                  fullWidth
                  value={formData.subjectId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subjectId: e.target.value }))}
                >
                  <MenuItem value="">None (Class Mentor Role)</MenuItem>
                  {subjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setCreateModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
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
export default TeacherAssignmentsPage;
