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
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import SchoolIcon from '@mui/icons-material/School';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { parentService } from '../../features/parents/parentService';
import { studentService } from '../../features/students/studentService';
import type { Parent, ParentStudentLink, LinkStudentDto } from '../../features/parents/types';
import type { Student } from '../../features/students/types';

export const ParentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [parent, setParent] = useState<Parent | null>(null);
  const [linkedStudents, setLinkedStudents] = useState<ParentStudentLink[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [linkForm, setLinkForm] = useState<LinkStudentDto>({
    studentId: '',
    relation: 'FATHER',
    isPrimaryContact: true,
    isEmergencyContact: true,
    canPickup: true,
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [parentData, links, allStudents] = await Promise.all([
        parentService.getParentById(id),
        parentService.getLinkedStudents(id),
        studentService.listStudents({ limit: 100 }),
      ]);
      setParent(parentData);
      setLinkedStudents(links);
      setAvailableStudents(allStudents.data);
      if (parentData) {
        setLinkForm((prev) => ({ ...prev, relation: parentData.relationshipType }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load parent details';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !linkForm.studentId) {
      setError('Please select a student ward to link.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await parentService.linkStudent(id, linkForm);
      setSnackbar({
        open: true,
        message: 'Student ward successfully linked to parent.',
        severity: 'success',
      });
      setLinkModalOpen(false);
      setLinkForm({
        studentId: '',
        relation: parent?.relationshipType || 'FATHER',
        isPrimaryContact: true,
        isEmergencyContact: true,
        canPickup: true,
      });
      const updatedLinks = await parentService.getLinkedStudents(id);
      setLinkedStudents(updatedLinks);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error linking student to parent';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlink = async (studentId: string, studentName?: string) => {
    if (!id) return;
    if (!window.confirm(`Unlink student "${studentName || 'this student'}" from this parent?`)) return;

    try {
      await parentService.unlinkStudent(id, studentId);
      setSnackbar({
        open: true,
        message: 'Student unlinked successfully.',
        severity: 'success',
      });
      const updatedLinks = await parentService.getLinkedStudents(id);
      setLinkedStudents(updatedLinks);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to unlink student';
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

  if (error || !parent) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Parent record not found'}
        </Alert>
        <AppButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/people/parents')}>
          Back to Directory
        </AppButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title={`${parent.firstName} ${parent.lastName}`}
        subtitle={`Guardian Profile • Relationship: ${parent.relationshipType}`}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/people/parents')}
            >
              Directory
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setLinkModalOpen(true)}
            >
              Link Student Ward
            </AppButton>
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<EscalatorWarningIcon color="primary" />}
              title="Parent / Guardian Details"
              subheader={
                <Chip
                  label={parent.relationshipType}
                  color="primary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              }
            />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {parent.firstName} {parent.lastName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Occupation / Profession
                </Typography>
                <Typography variant="body2">{parent.occupation || 'Not specified'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Contact Email
                </Typography>
                <Typography variant="body2">{parent.email || 'None on record'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body2">{parent.phone || 'None on record'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Residential Address
                </Typography>
                <Typography variant="body2">{parent.address || 'None on record'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Linked Student Wards */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              avatar={<SchoolIcon color="secondary" />}
              title="Linked Students & Wards"
              subheader={`${linkedStudents.length} student(s) currently registered under this guardian`}
              action={
                <AppButton
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setLinkModalOpen(true)}
                >
                  Link Student
                </AppButton>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {linkedStudents.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No student wards linked to this parent yet.
                  </Typography>
                  <AppButton
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setLinkModalOpen(true)}
                  >
                    Link First Student
                  </AppButton>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Student Ward</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Relation</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Permissions</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {linkedStudents.map((link) => {
                        const s = link.student || availableStudents.find((st) => st.id === link.studentId);
                        const sName = s ? `${s.firstName} ${s.lastName}` : `Student (${link.studentId.slice(0, 6)})`;
                        return (
                          <TableRow key={link.id || link.studentId} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {sName}
                              </Typography>
                              {s?.admissionNumber && (
                                <Typography variant="caption" color="text.secondary">
                                  Adm: {s.admissionNumber}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip label={link.relation} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {link.isPrimaryContact && (
                                  <Chip label="Primary Contact" color="primary" size="small" />
                                )}
                                {link.isEmergencyContact && (
                                  <Chip label="Emergency Contact" color="error" size="small" />
                                )}
                                {link.canPickup && (
                                  <Chip label="Authorized Pickup" color="success" size="small" />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Unlink Student">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleUnlink(link.studentId, sName)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Link Student Modal */}
      <Dialog open={linkModalOpen} onClose={() => setLinkModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleLinkSubmit}>
          <DialogTitle>Link Student Ward to {parent.firstName} {parent.lastName}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Select Student Ward"
                  fullWidth
                  required
                  value={linkForm.studentId}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, studentId: e.target.value }))}
                >
                  {availableStudents.map((st) => (
                    <MenuItem key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} (Adm: {st.admissionNumber || st.id.slice(0, 6)})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Relationship to Ward"
                  fullWidth
                  value={linkForm.relation}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, relation: e.target.value }))}
                  placeholder="e.g. FATHER, MOTHER, LEGAL_GUARDIAN"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={linkForm.isPrimaryContact}
                      onChange={(e) =>
                        setLinkForm((prev) => ({ ...prev, isPrimaryContact: e.target.checked }))
                      }
                    />
                  }
                  label="Primary Guardian Contact (Receives official circulars & reports)"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={linkForm.isEmergencyContact}
                      onChange={(e) =>
                        setLinkForm((prev) => ({ ...prev, isEmergencyContact: e.target.checked }))
                      }
                    />
                  }
                  label="Emergency Contact (Notified in medical / campus incidents)"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={linkForm.canPickup}
                      onChange={(e) =>
                        setLinkForm((prev) => ({ ...prev, canPickup: e.target.checked }))
                      }
                    />
                  }
                  label="Authorized for Campus Pickup / Dismissal Verification"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setLinkModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Linking...' : 'Confirm Link'}
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
export default ParentDetailPage;
