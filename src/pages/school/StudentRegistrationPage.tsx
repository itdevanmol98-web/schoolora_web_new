import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { AppPageHeader } from '../../components/common/AppPageHeader/AppPageHeader';
import AppButton from '../../components/common/Button';
import { studentService } from '../../features/students/studentService';
import { academicSessionService } from '../../features/academics/academicSessionService';
import { classSectionService } from '../../features/academics/classSectionService';
import type { AcademicSessionItem, ClassItem, SectionItem } from '../../features/academics/types';
import { getSchoolId } from '../../utils/tokenStorage';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other / Non-Binary' },
];

export const StudentRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);

  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '2012-01-01',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    bloodGroup: 'O+',
    email: '',
    phone: '',
    address: '',
    admissionNumber: '',
    // Initial Enrollment
    sessionId: '',
    classId: '',
    sectionId: '',
    rollNumber: '',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activeSchoolId = getSchoolId();

  useEffect(() => {
    let cancelled = false;

    async function loadMetadata() {
      try {
        setLoadingLookups(true);
        const [sesRes, clsRes] = await Promise.all([
          academicSessionService.listSessions(),
          classSectionService.listClasses(),
        ]);

        if (!cancelled) {
          setSessions(sesRes.data);
          setClasses(clsRes.data);

          const currentSes = sesRes.data.find((s) => s.isCurrent) || sesRes.data[0];
          if (currentSes) {
            setFormData((prev) => ({ ...prev, sessionId: currentSes.id }));
          }
          if (clsRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, classId: clsRes.data[0].id }));
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load metadata', err);
      } finally {
        if (!cancelled) {
          setLoadingLookups(false);
        }
      }
    }

    loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [activeSchoolId]);

  // Load sections whenever classId changes
  useEffect(() => {
    if (formData.classId) {
      classSectionService.listSections({ classId: formData.classId }).then((res) => {
        setSections(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, sectionId: res.data[0].id }));
        } else {
          setFormData((prev) => ({ ...prev, sectionId: '' }));
        }
      });
    } else {
      setSections([]);
    }
  }, [formData.classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setError('Please provide student first and last name.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        admissionNumber: formData.admissionNumber || undefined,
        initialEnrollment:
          formData.sessionId && formData.classId && formData.sectionId
            ? {
                sessionId: formData.sessionId,
                classId: formData.classId,
                sectionId: formData.sectionId,
                rollNumber: formData.rollNumber || undefined,
              }
            : undefined,
      };

      const created = await studentService.createStudent(payload);
      setSnackbar({
        open: true,
        message: `Student "${created.firstName} ${created.lastName}" admitted successfully.`,
        severity: 'success',
      });
      setTimeout(() => {
        navigate(`/people/students/${created.id}`);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error admitting student';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <AppPageHeader
        title="Student Admission & Registration"
        subtitle="Onboard a new student into the school directory with verified session and classroom placement"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/people/students')}
            >
              Back to Directory
            </AppButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loadingLookups ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardHeader
                  avatar={<PersonAddIcon color="primary" />}
                  title="Personal & Demographics Information"
                  subheader="Official identity, contact, and emergency records"
                />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        label="Gender"
                        fullWidth
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
                          }))
                        }
                      >
                        {GENDERS.map((g) => (
                          <MenuItem key={g.value} value={g.value}>
                            {g.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        label="Blood Group"
                        fullWidth
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <MenuItem key={bg} value={bg}>
                            {bg}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Admission / Scholar Number"
                        fullWidth
                        placeholder="Auto-assigned if blank"
                        value={formData.admissionNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, admissionNumber: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Student Email Address"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Primary Phone Number"
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
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Academic Initial Placement */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  title="Initial Enrolment Cohort"
                  subheader="Academic term, grade level, and section roster"
                />
                <Divider />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                  <TextField
                    select
                    label="Academic Session"
                    fullWidth
                    required
                    value={formData.sessionId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sessionId: e.target.value }))}
                  >
                    {sessions.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name} {s.isCurrent ? '(Current Active)' : ''}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Admitted Class / Grade"
                    fullWidth
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, classId: e.target.value }))}
                  >
                    {classes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Classroom Section"
                    fullWidth
                    required
                    disabled={!formData.classId || sections.length === 0}
                    value={formData.sectionId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sectionId: e.target.value }))}
                    helperText={
                      sections.length === 0
                        ? 'No sections for this class. Create a section first.'
                        : undefined
                    }
                  >
                    {sections.map((sec) => (
                      <MenuItem key={sec.id} value={sec.id}>
                        {sec.name} (Max {sec.capacity || 'N/A'} students)
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Assigned Roll / Roster Number"
                    fullWidth
                    placeholder="e.g. 10A-05"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rollNumber: e.target.value }))}
                  />

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <AppButton
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      type="submit"
                      disabled={submitting}
                    >
                      Complete Admission & Enrol
                    </AppButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}

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
export default StudentRegistrationPage;
