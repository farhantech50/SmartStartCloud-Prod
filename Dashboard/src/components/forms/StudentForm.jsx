import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Card, CardContent, CircularProgress, Typography, useTheme, Grid, Divider, Button, Modal, TextField, Snackbar, IconButton,
    Alert,
} from '@mui/material';
import { tokens } from '../../theme';
import MuiAlert from '@mui/material/Alert';
import useSendStudentData from '../../hooks/useSendStudentData';

const StudentForm = ({open, setOpen, degreeID}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { sendStudent } = useSendStudentData()
    const navigate = useNavigate(); 
    

    const [formSaved, setFormSaved] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [formLoading, setformLoading] = useState(false);
    const [errors, setErrors] = React.useState({});
    const [newStudent, setNewStudent] = useState({
        studentID: '',
        studentName: '',
        studentLogin: '',
        studentPassword: '',
        studentContact: '',
        degreeID: degreeID
    });

    const validateForm = () => {
        const newErrors = {};
        if (!newStudent.studentID) newErrors.studentID = 'Student ID is required';
        if (!newStudent.studentName) newErrors.studentName = 'Student Name is required';

        return newErrors;
    };

    const handleSubmit = () => {        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            handleAddStudent();

            navigate(0);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleSnackbarClose = () => {
        setFormSaved(false);
    };

    const handleSnackbarCloseError = () => {
        setFormError(false);
    };

    const handleAddStudent = async () => {        
        setformLoading(true);
        
        try{
            const response = await sendStudent(newStudent)            
            console.log('Form Data:', newStudent);
            console.log('Response Data:', response);
            setFormSaved(true);
            setformLoading(false);
        }catch (e) {
            setFormError(true);
            setformLoading(false)
            setFormErrorMessage(e.message)
            console.log("Error submitting form: ", e.message)
            setOpen(false)
        }
        setNewStudent({
            studentID: '',
            studentName: '',
            studentLogin: '',
            studentPassword: '',
            studentContact: ''
        });
    };

    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "400px",
            backgroundColor: colors.grey[900],
            padding: 3,
            borderRadius: 3,
            mx: "auto",
            mt: "10%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: colors.grey[50],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
            Add New Student
          </Typography>
          <TextField
            label="Student ID"
            fullWidth
            error={!!errors.studentID}
            helperText={errors.studentID}
            value={newStudent.studentID}
            onChange={(e) => {
              setNewStudent({ ...newStudent, studentID: e.target.value });
              setErrors({ ...errors, studentID: "" });
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Student Name"
            fullWidth
            error={!!errors.studentName}
            helperText={errors.studentName}
            value={newStudent.studentName}
            onChange={(e) => {
              setNewStudent({ ...newStudent, studentName: e.target.value });
              setErrors({ ...errors, studentName: "" });
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Student Login"
            fullWidth
            error={!!errors.studentLogin}
            helperText={errors.studentLogin}
            value={newStudent.studentLogin}
            onChange={(e) => {
              setNewStudent({ ...newStudent, studentLogin: e.target.value });
              setErrors({ ...errors, studentLogin: "" });
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Student Password"
            fullWidth
            error={!!errors.studentPassword}
            helperText={errors.studentPassword}
            value={newStudent.studentPassword}
            onChange={(e) => {
              setNewStudent({ ...newStudent, studentPassword: e.target.value });
              setErrors({ ...errors, studentPassword: "" });
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Student Contact"
            fullWidth
            error={!!errors.studentContact}
            helperText={errors.studentContact}
            value={newStudent.studentContact}
            onChange={(e) => {
              setNewStudent({ ...newStudent, studentContact: e.target.value });
              setErrors({ ...errors, studentContact: "" });
            }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={formLoading}
            sx={{
              width: "100%",
              backgroundColor: colors.blueAccent[500],
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
            }}
          >
            {formLoading ? (
              <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
            ) : (
              "Add"
            )}
          </Button>

          <Snackbar
            open={formSaved}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="success"
            >
              Student added successfully!
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={formError}
            autoHideDuration={6000}
            onClose={handleSnackbarCloseError}
          >
            <Alert
              onClose={handleSnackbarCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              Failed adding student. {formErrorMessage}. Please try again.
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    );
}

export default StudentForm