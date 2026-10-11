import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
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
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { subjectService } from '../../features/academics/subjectService';
import { classSectionService } from '../../features/academics/classSectionService';
import type { ClassItem, SubjectItem, ClassSubjectMappingItem } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const ClassSubjectMappingPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [mappings, setMappings] = useState<ClassSubjectMappingItem[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mapForm, setMapForm] = useState({
    subjectId: '',
    isOptional: false,
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  // Load classes and subjects catalogs
  useEffect(() => {
    let cancelled = false;

    async function initData() {
      try {
        setLoading(true);
        setError(null);
        const [classesRes, subjectsRes] = await Promise.all([
          classSectionService.listClasses(),
          subjectService.listSubjects(),
        ]);

        if (!cancelled) {
          setClasses(classesRes.data);
          setAvailableSubjects(subjectsRes.data);
          if (classesRes.data.length > 0) {
            setSelectedClassId(classesRes.data[0].id);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to initialize curriculum mapping';
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initData();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  // Load mappings when selectedClassId changes
  const loadClassMappings = async (classId: string) => {
    if (!classId) return;
    try {
      setLoadingMappings(true);
      setError(null);
      const res = await subjectService.listClassSubjects(classId);
      setMappings(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load mapped subjects for this class';
      setError(msg);
    } finally {
      setLoadingMappings(false);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      loadClassMappings(selectedClassId);
    }
  }, [selectedClassId]);

  const handleMapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !mapForm.subjectId) {
      setError('Please select both a class and a subject to map.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await subjectService.mapSubjectToClass({
        classId: selectedClassId,
        subjectId: mapForm.subjectId,
        isOptional: mapForm.isOptional,
      });
      setSnackbar({
        open: true,
        message: 'Subject successfully mapped to class curriculum.',
        severity: 'success',
      });
      setMapModalOpen(false);
      setMapForm({ subjectId: '', isOptional: false });
      loadClassMappings(selectedClassId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error mapping subject to class';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMapping = async (mappingId: string, subjectName?: string) => {
    if (!window.confirm(`Remove "${subjectName || 'this subject'}" from this class curriculum?`)) {
      return;
    }
    try {
      await subjectService.removeClassSubject(mappingId);
      setSnackbar({
        open: true,
        message: 'Subject mapping removed successfully.',
        severity: 'success',
      });
      loadClassMappings(selectedClassId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove mapped subject';
      setError(msg);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Class-Subject Curriculum Mapping"
        subtitle="Associate course subjects with specific grade cohorts and define mandatory vs elective tracks"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => selectedClassId && loadClassMappings(selectedClassId)}
            >
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setMapModalOpen(true)}
              disabled={!selectedClassId || availableSubjects.length === 0}
            >
              Map Subject
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
      ) : classes.length === 0 ? (
        <Alert severity="warning">
          No classes registered. Please create academic classes first in "Classes & Sections".
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Class Selector Bar */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  select
                  size="small"
                  label="Select Class / Grade Level"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  sx={{ minWidth: 260 }}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="body2" color="text.secondary">
                  Active curriculum: <strong>{mappings.length}</strong> subject(s) configured
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Mapped Subjects Table */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                avatar={<ViewListIcon color="primary" />}
                title={`Curriculum for ${selectedClass?.name || 'Class'}`}
                subheader="Core and optional subjects assigned to students in this grade level"
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {loadingMappings ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                  </Box>
                ) : mappings.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No subjects mapped to {selectedClass?.name} yet.
                    </Typography>
                    <AppButton
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setMapModalOpen(true)}
                    >
                      Map First Subject
                    </AppButton>
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead sx={{ backgroundColor: 'action.hover' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Subject Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Course Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Curriculum Track</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mappings.map((m) => (
                          <TableRow key={m.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {m.subject?.name || 'Unknown Subject'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={m.subject?.code || '—'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{m.subject?.type || 'THEORY'}</TableCell>
                            <TableCell>
                              <Chip
                                label={m.isOptional ? 'ELECTIVE (OPTIONAL)' : 'CORE (MANDATORY)'}
                                color={m.isOptional ? 'secondary' : 'primary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Remove subject from this class">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveMapping(m.id, m.subject?.name)}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Map Subject Dialog */}
      <Dialog open={mapModalOpen} onClose={() => setMapModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleMapSubmit}>
          <DialogTitle>Map Subject to {selectedClass?.name}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Select Course Subject"
                  fullWidth
                  required
                  value={mapForm.subjectId}
                  onChange={(e) => setMapForm((prev) => ({ ...prev, subjectId: e.target.value }))}
                >
                  {availableSubjects.map((sub) => {
                    const alreadyMapped = mappings.some((m) => m.subjectId === sub.id);
                    return (
                      <MenuItem key={sub.id} value={sub.id} disabled={alreadyMapped}>
                        {sub.name} ({sub.code}) {alreadyMapped ? '— [Already Mapped]' : ''}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mapForm.isOptional}
                      onChange={(e) =>
                        setMapForm((prev) => ({ ...prev, isOptional: e.target.checked }))
                      }
                    />
                  }
                  label="Optional / Elective Subject (Unchecked means Core Mandatory)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setMapModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Mapping...' : 'Confirm Mapping'}
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
export default ClassSubjectMappingPage;
