import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {Button, TextField, Typography, Box, Snackbar, CircularProgress, Alert, Grid, Select, MenuItem, useTheme, IconButton, InputAdornment, useMediaQuery} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { tokens } from '../../theme';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const LoginForm = () => {
    const isNonMobile = useMediaQuery('(min-width: 600px)')
    const navigate = useNavigate();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formSuccess, setformSuccess] = useState(false);
    const [formError, setFormError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const {login} = useLogin()

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClose = () => {
        setformSuccess(false);
    };

    const handleCloseError = () => {
        setFormError(false);
    };

    const { control, handleSubmit, getValues, setError, clearErrors, formState: { errors, touchedFields } } = useForm({
        defaultValues: {
            userName: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        console.log("data ? ", data);
        
        setLoading(true);
        try {
            const response = await login(data);
            console.log('Response Data:', response);
            setformSuccess(true);
            setLoading(false);
        } catch (e) {
            console.log(e.message)
            setFormError(true)
            setLoading(false);
            setErrorMessage(e.message);
        
            if (e.message === "Default password not changed") {
                navigate('/renew', { state: { userName: data.userName } }); 
            }
            
        }
    }

    return (
        <Box 
            sx={{
                p: 3,
                maxWidth: '30%',
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
            <Typography variant="h4" gutterBottom mb={5}>Login Form</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
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
                                        field.onBlur(); // Call the original onBlur from react-hook-form
                                        if (!field.value) {
                                            // Manually set an error if the field is empty on blur
                                            setError("userName", { type: "manual", message: "User Name is required" });
                                        }else {
                                            // Clear the error if the field is filled
                                            clearErrors("userName");
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
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
                                        field.onBlur(); // Call the original onBlur from react-hook-form
                                        if (!field.value) {
                                            // Manually set an error if the field is empty on blur
                                            setError("password", { type: "manual", message: "Password is required" });
                                        }else {
                                            // Clear the error if the field is filled
                                            clearErrors("password");
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button
                        variant="contained"
                        sx={{  
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        fullWidth
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
                        ) : (
                            'Login'
                        )}
                    </Button>
                    {/* <Link to="/signUp" style={{ textDecoration: 'none' }}>
                        <Button color='secondary' variant="text">
                            SIGNUP
                        </Button>
                    </Link> */}
                </Box>
            </form>

            <Snackbar open={formSuccess} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    User Login Complete!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={formError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    User Login failed. {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
  )
}

export default LoginForm