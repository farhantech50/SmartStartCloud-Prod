import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {Button, TextField, Typography, Box, Snackbar, CircularProgress, Alert, Grid, Select, MenuItem, useTheme, IconButton, InputAdornment} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { tokens } from '../../theme';
import useSignup from '../../hooks/useSignup';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formSuccess, setformSuccess] = useState(false);
    const [formError, setFormError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { signup } = useSignup()

    const navigate = useNavigate();

   const handleTogglePasswordVisibility = () => {
       setShowPassword(!showPassword);
   };

   const handleToggleConfirmPasswordVisibility = () => {
       setShowConfirmPassword(!showConfirmPassword);
   };

   const handleClose = () => {
       setformSuccess(false);
   };

   const handleCloseError = () => {
       setFormError(false);
   };

    const { control, handleSubmit, getValues, setError, clearErrors, formState: { errors, touchedFields } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            gender: "male",
            role: "agent"
        },
    });

    const onSubmit = async (data) => {
         setLoading(true);
            try {
                const response = await signup(data);
                console.log('Response Data:', response);
                setformSuccess(true);
                setLoading(false);

                if (data.role === 'agent') {
                    navigate('/welcome', {
                        state:
                            { 
                                userName: data.userName,
                                password: data.password
                            }
                    });
                }

            } catch (e) {
                setFormError(true)
                setLoading(false);
                setErrorMessage(e.message);
            }
    }

    return (
        <Box
            sx={{
                p: 3,
                width: '80%',
                maxWidth: '80%',
                margin: '0 auto',
                mt: 5,
                border: '1px solid rgba(102, 106, 108, 0.5)',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: colors.grey[300],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: colors.grey[100],
                    },
                },
                '& .MuiInputLabel-root': {
                    color: colors.grey[300],
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.grey[100],
                },
            }}
        >
            <Typography variant="h4" gutterBottom mb={5}>Signup Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        p: 3,
                        pt: 1,
                        width: '100%',
                        maxWidth: '100%',
                        margin: '0 auto',
                        mt: 3,
                        border: '1px solid rgba(102, 106, 108, 0.5)',
                        borderRadius: '8px',
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1, mb: 2 }}>Personal information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name='firstName'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        error={!!touchedFields.firstName && !!errors.firstName}
                                        helperText={touchedFields.firstName && errors.firstName ? errors.firstName.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("firstName", { type: "manual", message: "First Name is required" });
                                            }else {
                                                clearErrors("firstName");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name='lastName'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        error={!!touchedFields.lastName && !!errors.lastName}
                                        helperText={touchedFields.lastName && errors.lastName ? errors.lastName.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("lastName", { type: "manual", message: "Last Name is required" });
                                            }else {
                                                clearErrors("lastName");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='userName'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="Username"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        error={!!touchedFields.userName && !!errors.userName}
                                        helperText={touchedFields.userName && errors.userName ? errors.userName.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("userName", { type: "manual", message: "User Name is required" });
                                            }else {
                                                clearErrors("userName");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='email'
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                        message: 'Email is not valid'
                                    }
                                }}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        error={!!touchedFields.email && !!errors.email}
                                        helperText={touchedFields.email && errors.email ? errors.email.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("email", { type: "manual", message: "Email is required" });
                                            }else {
                                                clearErrors("email");
                                            }
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='gender'
                                control={control}
                                render={({field})=>(
                                    <Select
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        displayEmpty
                                        required
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="" disabled>Select Gender</MenuItem>
                                        <MenuItem value="male" >Male</MenuItem>
                                        <MenuItem value="female" >Female</MenuItem>
                                    </Select>
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box
                    sx={{
                        p: 3,
                        pt: 1,
                        width: '100%',
                        maxWidth: '100%',
                        margin: '0 auto',
                        mt: 3,
                        border: '1px solid rgba(102, 106, 108, 0.5)',
                        borderRadius: '8px',
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1, mb: 2 }}>Security</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='password'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="Password"
                                        variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!touchedFields.password && !!errors.password}
                                        helperText={touchedFields.password && errors.password ? errors.password.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("password", { type: "manual", message: "Password is required" });
                                            }else {
                                                clearErrors("password");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='passwordConfirmation'
                                control={control}
                                rules={{
                                    required: 'Password confirmation is required',
                                    validate: value =>
                                        value === getValues('password') || 'Passwords do not match'
                                }}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        label="Password Confirmation"
                                        variant="outlined"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!touchedFields.passwordConfirmation && !!errors.passwordConfirmation}
                                        helperText={touchedFields.passwordConfirmation && errors.passwordConfirmation ? errors.passwordConfirmation.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("passwordConfirmation", { type: "manual", message: "Password Confirmation is required" });
                                            }else {
                                                clearErrors("passwordConfirmation");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='role'
                                control={control}
                                render={({field})=>(
                                    <Select
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        displayEmpty
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="" disabled>Select Role</MenuItem>
                                        <MenuItem value="admin" >Admin</MenuItem>
                                        <MenuItem value="agent" >Agent</MenuItem>
                                    </Select>
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button
                        variant="contained"
                        sx={{
                            width: '200px',
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    {/* <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button color="secondary" variant="text">
                            LOGIN
                        </Button>
                    </Link> */}
                </Box>
            </form>
            <Snackbar open={formSuccess} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    User Signup Complete!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={formError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    User Signup failed. {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SignupForm