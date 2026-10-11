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
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SchoolIcon from '@mui/icons-material/School';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { studentService } from '../../features/students/studentService';
import { classSectionService } from '../../features/academics/classSectionService';
import type { Student } from '../../features/students/types';
import type { ClassItem } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const StudentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  const activeSchoolId = getSchoolId();

  // Load classes dropdown
  useEffect(() => {
    classSectionService.listClasses().then((res) => setClasses(res.data)).catch(() => {});
  }, [activeSchoolId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (classFilter !== 'ALL') params.classId = classFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await studentService.listStudents(params);
      setStudents(res.data);
      setTotalCount(res.total || res.data.length);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load students directory';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [activeSchoolId, classFilter, statusFilter, page]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Student Directory & Enrolment"
        subtitle="Master student directory, admission records, enrollment cohort tracking, and status"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadStudents}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/people/students/new')}
            >
              Admit New Student
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
            label="Filter by Class"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="ALL">All Classes</MenuItem>
            {classes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name} ({c.code})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            <MenuItem value="WITHDRAWN">WITHDRAWN</MenuItem>
            <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
          </TextField>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Showing <strong>{students.length}</strong> of <strong>{totalCount}</strong> student(s)
          </Typography>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            No Students Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Admit students with academic session, grade level, and section classroom placements.
          </Typography>
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/people/students/new')}
          >
            Admit New Student
          </AppButton>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Admission #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Current Class / Section</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact Email / Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((stu) => {
                const enrollment = stu.currentEnrollment || (stu.enrollments && stu.enrollments[0]);
                return (
                  <TableRow key={stu.id} hover>
                    <TableCell>
                      <Chip
                        label={stu.admissionNumber || `ADM-${stu.id.slice(0, 6)}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stu.firstName} {stu.lastName}
                      </Typography>
                      {stu.bloodGroup && (
                        <Typography variant="caption" color="text.secondary">
                          Blood Group: {stu.bloodGroup}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {enrollment ? (
                        <Box>
                          <Typography variant="body2">
                            {enrollment.class?.name || 'Class'}
                            {enrollment.section?.name ? ` • ${enrollment.section.name}` : ''}
                          </Typography>
                          {enrollment.rollNumber && (
                            <Typography variant="caption" color="text.secondary">
                              Roll #: {enrollment.rollNumber}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Pending Placement
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{stu.gender || '—'}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{stu.email || '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stu.phone || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={stu.status}
                        color={
                          stu.status === 'ACTIVE'
                            ? 'success'
                            : stu.status === 'WITHDRAWN'
                            ? 'error'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Profile & Enrolment History">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/people/students/${stu.id}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Lifecycle Operations (Transfer, Promotion, Withdrawal)">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              navigate(`/student-operations/lifecycle?studentId=${stu.id}`)
                            }
                          >
                            <SwapHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalCount > limit && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(totalCount / limit)}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
export default StudentsListPage;
