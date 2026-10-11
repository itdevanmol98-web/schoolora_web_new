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
  Chip,
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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { studentService } from '../../features/students/studentService';
import type { Student } from '../../features/students/types';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await studentService.getStudentById(id);
        if (!cancelled) {
          setStudent(res);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load student details';
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStudent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Student not found'}
        </Alert>
        <AppButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/people/students')}>
          Back to Students Directory
        </AppButton>
      </Box>
    );
  }

  const currentEnrollment = student.currentEnrollment || (student.enrollments && student.enrollments[0]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title={`${student.firstName} ${student.lastName}`}
        subtitle={`Admission ID: ${student.admissionNumber || student.id.slice(0, 8)}`}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/people/students')}
            >
              Directory
            </AppButton>
            <AppButton
              variant="contained"
              color="secondary"
              startIcon={<SwapHorizIcon />}
              onClick={() => navigate(`/student-operations/lifecycle?studentId=${student.id}`)}
            >
              Lifecycle Operations
            </AppButton>
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<SchoolIcon color="primary" />}
              title="Student Demographics"
              subheader={
                <Chip
                  label={student.status}
                  color={student.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              }
            />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full Legal Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {student.firstName} {student.lastName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body2">
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString()
                    : 'Not specified'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Gender & Blood Group
                </Typography>
                <Typography variant="body2">
                  {student.gender || '—'} • {student.bloodGroup || 'Blood Group N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Contact Email
                </Typography>
                <Typography variant="body2">{student.email || 'None on record'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Contact Phone
                </Typography>
                <Typography variant="body2">{student.phone || 'None on record'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Residential Address
                </Typography>
                <Typography variant="body2">{student.address || 'None on record'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Placement & Academic History */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* Active Placement Overview */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  title="Current Academic Placement"
                  subheader="Active session, grade level, and section roster"
                />
                <Divider />
                <CardContent>
                  {currentEnrollment ? (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Class / Grade
                        </Typography>
                        <Typography variant="h6">
                          {currentEnrollment.class?.name || 'Class Record'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Section
                        </Typography>
                        <Typography variant="h6">
                          {currentEnrollment.section?.name || 'Section Record'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Roll / Seat Number
                        </Typography>
                        <Typography variant="h6">
                          {currentEnrollment.rollNumber || 'Not assigned'}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">
                      No active academic placement found for this student.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Historical Enrolment Log */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  avatar={<HistoryEduIcon color="secondary" />}
                  title="Enrolment Ledger & Lifecycle Records"
                  subheader="Past promotions, section transfers, and academic cohorts"
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {!student.enrollments || student.enrollments.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No enrolment history recorded yet.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Academic Term</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Class & Section</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Roll #</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Enrolment Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {student.enrollments.map((enr) => (
                            <TableRow key={enr.id} hover>
                              <TableCell>{enr.session?.name || 'Session'}</TableCell>
                              <TableCell>
                                {enr.class?.name} - {enr.section?.name}
                              </TableCell>
                              <TableCell>{enr.rollNumber || '—'}</TableCell>
                              <TableCell>
                                <Chip
                                  label={enr.status}
                                  size="small"
                                  color={
                                    enr.status === 'ENROLLED'
                                      ? 'success'
                                      : enr.status === 'PROMOTED'
                                      ? 'primary'
                                      : enr.status === 'WITHDRAWN'
                                      ? 'error'
                                      : 'default'
                                  }
                                />
                              </TableCell>
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
        </Grid>
      </Grid>
    </Box>
  );
};
export default StudentDetailPage;
