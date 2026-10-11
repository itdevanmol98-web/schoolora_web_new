import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { studentService } from '../../features/students/studentService';
import { academicSessionService } from '../../features/academics/academicSessionService';
import { classSectionService } from '../../features/academics/classSectionService';
import type { Student } from '../../features/students/types';
import type { AcademicSessionItem, ClassItem, SectionItem } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const StudentLifecycleOperationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStudentId = searchParams.get('studentId') || '';

  const [tab, setTab] = useState(0); // 0: Transfer, 1: Promote, 2: Withdraw
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    targetClassId: '',
    targetSectionId: '',
    targetRollNumber: '',
    reason: '',
  });

  // Promote Form State
  const [promoteForm, setPromoteForm] = useState({
    targetSessionId: '',
    targetClassId: '',
    targetSectionId: '',
    targetRollNumber: '',
  });

  // Withdraw Form State
  const [withdrawForm, setWithdrawForm] = useState({
    reason: '',
    withdrawalDate: new Date().toISOString().split('T')[0],
  });

  // Confirmation Modal
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

  // Load Initial Metadata
  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        setLoading(true);
        const [stuRes, sesRes, clsRes] = await Promise.allSettled([
          studentService.listStudents({ limit: 100 }),
          academicSessionService.listSessions(),
          classSectionService.listClasses(),
        ]);

        if (!cancelled) {
          if (stuRes.status === 'fulfilled') {
            setStudents(stuRes.value.data);
            if (!selectedStudentId && stuRes.value.data.length > 0) {
              setSelectedStudentId(stuRes.value.data[0].id);
            }
          }
          if (sesRes.status === 'fulfilled') {
            setSessions(sesRes.value.data);
            const current = sesRes.value.data.find((s) => s.isCurrent) || sesRes.value.data[0];
            if (current) {
              setPromoteForm((prev) => ({ ...prev, targetSessionId: current.id }));
            }
          }
          if (clsRes.status === 'fulfilled') {
            setClasses(clsRes.value.data);
            if (clsRes.value.data.length > 0) {
              setTransferForm((prev) => ({ ...prev, targetClassId: clsRes.value.data[0].id }));
              setPromoteForm((prev) => ({ ...prev, targetClassId: clsRes.value.data[0].id }));
            }
          }
        }
      } catch (err: unknown) {
        console.error('Error loading metadata', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  // Load specific student when selectedStudentId changes
  useEffect(() => {
    if (selectedStudentId) {
      studentService
        .getStudentById(selectedStudentId)
        .then((s) => setSelectedStudent(s))
        .catch(() => setSelectedStudent(null));
    }
  }, [selectedStudentId]);

  // Load sections when transfer or promote class changes
  const activeTargetClassId = tab === 0 ? transferForm.targetClassId : promoteForm.targetClassId;
  useEffect(() => {
    if (activeTargetClassId) {
      classSectionService.listSections({ classId: activeTargetClassId }).then((res) => {
        setSections(res.data);
        if (res.data.length > 0) {
          if (tab === 0) setTransferForm((prev) => ({ ...prev, targetSectionId: res.data[0].id }));
          if (tab === 1) setPromoteForm((prev) => ({ ...prev, targetSectionId: res.data[0].id }));
        }
      });
    } else {
      setSections([]);
    }
  }, [activeTargetClassId, tab]);

  // Execute Transfer
  const handleTransfer = async () => {
    if (!selectedStudentId || !transferForm.targetClassId || !transferForm.targetSectionId) {
      setError('Please select target class and section for transfer.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await studentService.transferStudent(selectedStudentId, transferForm);
      setSnackbar({
        open: true,
        message: 'Student transfer completed successfully.',
        severity: 'success',
      });
      const updated = await studentService.getStudentById(selectedStudentId);
      setSelectedStudent(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error executing transfer';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Execute Promotion
  const handlePromote = () => {
    if (!selectedStudentId || !promoteForm.targetSessionId || !promoteForm.targetClassId) {
      setError('Please complete all target promotion parameters.');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Confirm Student Promotion?',
      description: `Promote "${selectedStudent?.firstName} ${selectedStudent?.lastName}" to the next academic session and grade cohort?`,
      onConfirm: async () => {
        try {
          setSubmitting(true);
          await studentService.promoteStudent(selectedStudentId, promoteForm);
          setSnackbar({
            open: true,
            message: 'Student promoted to next academic session successfully.',
            severity: 'success',
          });
          const updated = await studentService.getStudentById(selectedStudentId);
          setSelectedStudent(updated);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error promoting student';
          setError(msg);
        } finally {
          setSubmitting(false);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  // Execute Withdrawal
  const handleWithdraw = () => {
    if (!selectedStudentId || !withdrawForm.reason) {
      setError('Please provide a mandatory reason for withdrawal.');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Confirm Student Withdrawal?',
      description: `Withdraw "${selectedStudent?.firstName} ${selectedStudent?.lastName}" from active schooling? This will flag their enrolment as WITHDRAWN.`,
      onConfirm: async () => {
        try {
          setSubmitting(true);
          await studentService.withdrawStudent(selectedStudentId, {
            reason: withdrawForm.reason,
            withdrawalDate: new Date(withdrawForm.withdrawalDate).toISOString(),
          });
          setSnackbar({
            open: true,
            message: 'Student withdrawn from institution successfully.',
            severity: 'success',
          });
          const updated = await studentService.getStudentById(selectedStudentId);
          setSelectedStudent(updated);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error withdrawing student';
          setError(msg);
        } finally {
          setSubmitting(false);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Student Lifecycle Operations"
        subtitle="Manage intra-grade section transfers, end-of-year promotions, and institutional withdrawals"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/people/students')}
            >
              Back to Students
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
      ) : (
        <Grid container spacing={3}>
          {/* Student Selector Card */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  select
                  size="small"
                  label="Select Student Candidate"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  sx={{ minWidth: 320 }}
                >
                  {students.map((stu) => (
                    <MenuItem key={stu.id} value={stu.id}>
                      {stu.firstName} {stu.lastName} ({stu.admissionNumber || stu.id.slice(0, 6)}) -{' '}
                      {stu.status}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedStudent && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedStudent.currentEnrollment?.class?.name || 'Class N/A'} •{' '}
                      {selectedStudent.currentEnrollment?.section?.name || 'Section N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Roll: {selectedStudent.currentEnrollment?.rollNumber || 'N/A'})
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Operation Tabs Card */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <Tabs
                value={tab}
                onChange={(_, val) => setTab(val)}
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<SwapHorizIcon />} iconPosition="start" label="Section Transfer" />
                <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Academic Promotion" />
                <Tab icon={<ExitToAppIcon />} iconPosition="start" label="Student Withdrawal" />
              </Tabs>

              <CardContent sx={{ p: 3 }}>
                {/* 1. Section Transfer Tab */}
                {tab === 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 600 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Transfer Student to Another Section or Grade
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Moves the student to a new classroom cohort within the active academic term.
                    </Typography>

                    <TextField
                      select
                      label="Target Class / Grade"
                      fullWidth
                      value={transferForm.targetClassId}
                      onChange={(e) =>
                        setTransferForm((prev) => ({ ...prev, targetClassId: e.target.value }))
                      }
                    >
                      {classes.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Target Section"
                      fullWidth
                      value={transferForm.targetSectionId}
                      onChange={(e) =>
                        setTransferForm((prev) => ({ ...prev, targetSectionId: e.target.value }))
                      }
                    >
                      {sections.map((sec) => (
                        <MenuItem key={sec.id} value={sec.id}>
                          {sec.name} (Capacity: {sec.capacity || 'N/A'})
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Target Roll / Roster Number (Optional)"
                      fullWidth
                      placeholder="e.g. 10B-15"
                      value={transferForm.targetRollNumber}
                      onChange={(e) =>
                        setTransferForm((prev) => ({ ...prev, targetRollNumber: e.target.value }))
                      }
                    />

                    <TextField
                      label="Reason for Transfer"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="e.g. Elective stream change, balancing student counts"
                      value={transferForm.reason}
                      onChange={(e) =>
                        setTransferForm((prev) => ({ ...prev, reason: e.target.value }))
                      }
                    />

                    <AppButton
                      variant="contained"
                      startIcon={<SwapHorizIcon />}
                      onClick={handleTransfer}
                      disabled={submitting || !selectedStudentId}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {submitting ? 'Processing Transfer...' : 'Confirm Section Transfer'}
                    </AppButton>
                  </Box>
                )}

                {/* 2. Promotion Tab */}
                {tab === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 600 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Promote Student to Next Academic Session
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Graduates the student into the next school year while preserving historical
                      academic transcripts and attendance.
                    </Typography>

                    <TextField
                      select
                      label="Target Academic Session"
                      fullWidth
                      value={promoteForm.targetSessionId}
                      onChange={(e) =>
                        setPromoteForm((prev) => ({ ...prev, targetSessionId: e.target.value }))
                      }
                    >
                      {sessions.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name} {s.isCurrent ? '(Active)' : ''}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Target Promoted Class"
                      fullWidth
                      value={promoteForm.targetClassId}
                      onChange={(e) =>
                        setPromoteForm((prev) => ({ ...prev, targetClassId: e.target.value }))
                      }
                    >
                      {classes.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Target Section"
                      fullWidth
                      value={promoteForm.targetSectionId}
                      onChange={(e) =>
                        setPromoteForm((prev) => ({ ...prev, targetSectionId: e.target.value }))
                      }
                    >
                      {sections.map((sec) => (
                        <MenuItem key={sec.id} value={sec.id}>
                          {sec.name} (Capacity: {sec.capacity || 'N/A'})
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Target Roll / Roster Number"
                      fullWidth
                      placeholder="e.g. 11A-05"
                      value={promoteForm.targetRollNumber}
                      onChange={(e) =>
                        setPromoteForm((prev) => ({ ...prev, targetRollNumber: e.target.value }))
                      }
                    />

                    <AppButton
                      variant="contained"
                      color="primary"
                      startIcon={<TrendingUpIcon />}
                      onClick={handlePromote}
                      disabled={submitting || !selectedStudentId}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Execute Promotion
                    </AppButton>
                  </Box>
                )}

                {/* 3. Withdrawal Tab */}
                {tab === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 600 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="error">
                      Withdraw Student from Schoolora ERP
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Officially unenrolls the student from the campus, issues leaving certification
                      flags, and deactivates their active seat.
                    </Typography>

                    <TextField
                      label="Withdrawal Effective Date"
                      type="date"
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                      value={withdrawForm.withdrawalDate}
                      onChange={(e) =>
                        setWithdrawForm((prev) => ({ ...prev, withdrawalDate: e.target.value }))
                      }
                    />

                    <TextField
                      label="Reason for Institutional Withdrawal"
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="e.g. Relocating out of state / Family transfer / School change"
                      value={withdrawForm.reason}
                      onChange={(e) =>
                        setWithdrawForm((prev) => ({ ...prev, reason: e.target.value }))
                      }
                    />

                    <AppButton
                      variant="contained"
                      color="error"
                      startIcon={<ExitToAppIcon />}
                      onClick={handleWithdraw}
                      disabled={submitting || !selectedStudentId}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Confirm Student Withdrawal
                    </AppButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{confirmDialog.description}</Typography>
        </DialogContent>
        <DialogActions>
          <AppButton onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>Cancel</AppButton>
          <AppButton variant="contained" color="primary" onClick={confirmDialog.onConfirm}>
            Confirm Execution
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
export default StudentLifecycleOperationsPage;
