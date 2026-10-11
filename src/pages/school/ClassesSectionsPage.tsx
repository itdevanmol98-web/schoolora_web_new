import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { classSectionService } from '../../features/academics/classSectionService';
import type {
  ClassItem,
  CreateClassPayload,
  SectionItem,
  CreateSectionPayload,
} from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

export const ClassesSectionsPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [sections, setSections] = useState<SectionItem[]>([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classForm, setClassForm] = useState<CreateClassPayload>({
    name: '',
    code: '',
    numericOrder: 1,
    description: '',
  });

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [sectionForm, setSectionForm] = useState<CreateSectionPayload>({
    classId: '',
    name: '',
    code: '',
    capacity: 35,
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      setError(null);
      const res = await classSectionService.listClasses({
        sortBy: 'numericOrder',
        sortOrder: 'asc',
      });
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClass((prev: ClassItem | null) => {
          if (prev && res.data.some((c: ClassItem) => c.id === prev.id)) {
            return res.data.find((c: ClassItem) => c.id === prev.id) || res.data[0];
          }
          return res.data[0];
        });
      } else {
        setSelectedClass(null);
        setSections([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load classes';
      setError(msg);
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadSections = async (classId: string) => {
    try {
      setLoadingSections(true);
      const res = await classSectionService.listSections({ classId });
      setSections(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sections';
      setError(msg);
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [activeSchoolId]);

  useEffect(() => {
    if (selectedClass) {
      loadSections(selectedClass.id);
    }
  }, [selectedClass?.id]);

  // Handle Class Create/Edit
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      if (editingClass) {
        await classSectionService.updateClass(editingClass.id, {
          name: classForm.name,
          description: classForm.description,
        });
        setSnackbar({ open: true, message: 'Class updated successfully.', severity: 'success' });
      } else {
        await classSectionService.createClass(classForm);
        setSnackbar({ open: true, message: 'Class created successfully.', severity: 'success' });
      }
      setClassModalOpen(false);
      setEditingClass(null);
      loadClasses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving class';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Section Create/Edit
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      setSubmitting(true);
      setError(null);
      if (editingSection) {
        await classSectionService.updateSection(editingSection.id, {
          capacity: Number(sectionForm.capacity),
        });
        setSnackbar({ open: true, message: 'Section updated successfully.', severity: 'success' });
      } else {
        await classSectionService.createSection({
          ...sectionForm,
          classId: selectedClass.id,
          capacity: Number(sectionForm.capacity),
        });
        setSnackbar({ open: true, message: 'Section created successfully.', severity: 'success' });
      }
      setSectionModalOpen(false);
      setEditingSection(null);
      loadSections(selectedClass.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving section';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (cls: ClassItem) => {
    if (!window.confirm(`Delete class "${cls.name}"? This will archive all associated sections.`)) return;
    try {
      await classSectionService.deleteClass(cls.id);
      setSnackbar({ open: true, message: 'Class deleted successfully.', severity: 'success' });
      loadClasses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete class';
      setError(msg);
    }
  };

  const handleDeleteSection = async (sec: SectionItem) => {
    if (!window.confirm(`Delete section "${sec.name}"?`)) return;
    try {
      await classSectionService.deleteSection(sec.id);
      setSnackbar({ open: true, message: 'Section deleted successfully.', severity: 'success' });
      if (selectedClass) loadSections(selectedClass.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete section';
      setError(msg);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Classes & Sections"
        subtitle="Organize grade levels, cohort branches, and section classroom capacities"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<RefreshIcon />} onClick={loadClasses}>
              Refresh
            </AppButton>
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingClass(null);
                setClassForm({ name: '', code: '', numericOrder: (classes.length || 0) + 1, description: '' });
                setClassModalOpen(true);
              }}
            >
              New Class
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loadingClasses ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Class List Column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Class Grade Levels"
                subheader={`${classes.length} registered academic grade(s)`}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {classes.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No classes configured yet. Create a class to get started.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Class Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {classes.map((cls) => {
                          const isSelected = selectedClass?.id === cls.id;
                          return (
                            <TableRow
                              key={cls.id}
                              hover
                              selected={isSelected}
                              onClick={() => setSelectedClass(cls)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>{cls.numericOrder}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                                  {cls.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={cls.code} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingClass(cls);
                                    setClassForm({
                                      name: cls.name,
                                      code: cls.code,
                                      numericOrder: cls.numericOrder,
                                      description: cls.description || '',
                                    });
                                    setClassModalOpen(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClass(cls);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
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

          {/* Sections List Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<MeetingRoomIcon color="primary" />}
                title={
                  selectedClass
                    ? `Sections for: ${selectedClass.name} (${selectedClass.code})`
                    : 'Class Sections'
                }
                subheader={selectedClass ? 'Manage section cohorts and student capacities' : 'Select a class to view sections'}
                action={
                  selectedClass && (
                    <AppButton
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingSection(null);
                        setSectionForm({
                          classId: selectedClass.id,
                          name: '',
                          code: `${selectedClass.code}-A`,
                          capacity: 35,
                        });
                        setSectionModalOpen(true);
                      }}
                    >
                      Add Section
                    </AppButton>
                  )
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {!selectedClass ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Select a class on the left to configure its classroom sections.
                    </Typography>
                  </Box>
                ) : loadingSections ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                  </Box>
                ) : sections.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No sections created for {selectedClass.name}.
                    </Typography>
                    <AppButton
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingSection(null);
                        setSectionForm({
                          classId: selectedClass.id,
                          name: 'Section A',
                          code: `${selectedClass.code}-A`,
                          capacity: 35,
                        });
                        setSectionModalOpen(true);
                      }}
                    >
                      Create First Section
                    </AppButton>
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Section Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Section Code</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Max Capacity</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sections.map((sec) => (
                          <TableRow key={sec.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {sec.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={sec.code} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{sec.capacity || 'Unlimited'} students</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingSection(sec);
                                  setSectionForm({
                                    classId: sec.classId,
                                    name: sec.name,
                                    code: sec.code,
                                    capacity: sec.capacity || 35,
                                  });
                                  setSectionModalOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSection(sec)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
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

      {/* Class Create/Edit Dialog */}
      <Dialog open={classModalOpen} onClose={() => setClassModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveClass}>
          <DialogTitle>{editingClass ? 'Edit Academic Class' : 'Create Academic Class'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Class / Grade Name"
                  fullWidth
                  required
                  placeholder="e.g. Grade 10"
                  value={classForm.name}
                  onChange={(e) => setClassForm((prev: CreateClassPayload) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              {!editingClass && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Class Code"
                    fullWidth
                    required
                    placeholder="e.g. CLS-10"
                    value={classForm.code}
                    onChange={(e) => setClassForm((prev: CreateClassPayload) => ({ ...prev, code: e.target.value }))}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: editingClass ? 12 : 6 }}>
                <TextField
                  label="Numeric Order / Hierarchy"
                  type="number"
                  fullWidth
                  required
                  value={classForm.numericOrder}
                  onChange={(e) =>
                    setClassForm((prev: CreateClassPayload) => ({ ...prev, numericOrder: Number(e.target.value) }))
                  }
                  helperText="Sort sequence (e.g. 1 for Grade 1, 10 for Grade 10)"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description / Curriculum Track"
                  fullWidth
                  multiline
                  rows={2}
                  value={classForm.description}
                  onChange={(e) => setClassForm((prev: CreateClassPayload) => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setClassModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Class'}
            </AppButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Section Create/Edit Dialog */}
      <Dialog open={sectionModalOpen} onClose={() => setSectionModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveSection}>
          <DialogTitle>{editingSection ? 'Edit Section Capacity' : 'Create Class Section'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {!editingSection && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Section Name"
                      fullWidth
                      required
                      placeholder="e.g. Section A"
                      value={sectionForm.name}
                      onChange={(e) => setSectionForm((prev: CreateSectionPayload) => ({ ...prev, name: e.target.value }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Section Code"
                      fullWidth
                      required
                      placeholder="e.g. SEC-10A"
                      value={sectionForm.code}
                      onChange={(e) => setSectionForm((prev: CreateSectionPayload) => ({ ...prev, code: e.target.value }))}
                    />
                  </Grid>
                </>
              )}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Max Student Capacity"
                  type="number"
                  fullWidth
                  required
                  value={sectionForm.capacity}
                  onChange={(e) =>
                    setSectionForm((prev: CreateSectionPayload) => ({ ...prev, capacity: Number(e.target.value) }))
                  }
                  helperText="Maximum allowed students before classroom exceeds limit"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={() => setSectionModalOpen(false)}>Cancel</AppButton>
            <AppButton variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Section'}
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
export default ClassesSectionsPage;
