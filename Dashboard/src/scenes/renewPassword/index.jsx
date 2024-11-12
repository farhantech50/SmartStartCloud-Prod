import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import Header from '../../components/Header';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useChangePassword from '../../hooks/useChangePassword.js';
import { useLocation } from 'react-router-dom';

const userSchema = yup.object().shape({        
    password: yup.string().required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const initialValues = {
    password: "",
    passwordConfirmation: "",
};

const RenewPassword = () => {
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const location = useLocation();
    const { userName } = location.state || {}; 

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { changePassword } = useChangePassword();

    const handleFormSubmit = (values) => {
        const payload = {
            ...values,  
            userName: userName  
        };
        changePassword(payload); 
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Box m="30px auto" width="800px">
            <Header title={"Forced Password change"} subtitle={"Change the password"} />
            
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box 
                            display="grid" 
                            gap="30px" 
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                        >
                            <TextField 
                                fullWidth
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password ? errors.password : null}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.passwordConfirmation}
                                name="passwordConfirmation"
                                error={!!touched.passwordConfirmation && !!errors.passwordConfirmation}
                                helperText={touched.passwordConfirmation && errors.passwordConfirmation ? errors.passwordConfirmation : null}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Change Password
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default RenewPassword;
