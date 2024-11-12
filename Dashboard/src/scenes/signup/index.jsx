import { Box, Button, TextField, IconButton, InputAdornment, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material'
import Header from '../../components/Header'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from "yup"
import useMediaQuery from '@mui/material/useMediaQuery'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import useSignup from '../../hooks/useSignup'
import { Link } from 'react-router-dom'

const userSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    userName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    gender: yup.string().required("required"),
    role: yup.string().required("required"),
})

const initialValues = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    gender: "male",
    role: "agent"
}

const Signup = () => {

    const isNonMobile = useMediaQuery('(min-width: 600px)')

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {signup} = useSignup()

    const handleFormSubmit = (values) => {
        // signup(values)
        console.log(values);
        
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Box m="30px auto" width="800px">
            <Header title={"Sign Up User"} subtitle={"This is the Sign Up Page"} />
            
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
            >
                {
                    ({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box 
                                display="grid" 
                                gap="30px" 
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                                }}
                            >
                                <TextField 
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={!!touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName ? errors.firstName : null}
                                    sx={{gridColumn: "span 2"}}
                                />
                                <TextField 
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={!!touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName ? errors.lastName : null}
                                    sx={{gridColumn: "span 2"}}
                                />
                                <TextField 
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.userName}
                                    name="userName"
                                    error={!!touched.userName && !!errors.userName}
                                    helperText={touched.userName && errors.userName ? errors.userName : null}
                                    sx={{gridColumn: "span 2"}}
                                />
                                <TextField 
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email ? errors.email : null}
                                    sx={{gridColumn: "span 2"}}
                                />
                                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        name="gender"
                                        value={values.gender}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.gender && !!errors.gender}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="others">Others</MenuItem>
                                    </Select>
                                    {/* Display error message below */}
                                    {touched.gender && errors.gender ? (
                                        <FormHelperText>{errors.gender}</FormHelperText>
                                    ) : null}
                                </FormControl>
                                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        name="role"
                                        value={values.role}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.role && !!errors.role}
                                    >
                                        <MenuItem value="superAdmin">Admin</MenuItem>
                                        <MenuItem value="hr">HR</MenuItem>
                                        <MenuItem value="agent">Agent</MenuItem>
                                    </Select>
                                    {/* Display error message below */}
                                    {touched.role && errors.role ? (
                                        <FormHelperText>{errors.role}</FormHelperText>
                                    ) : null}
                                </FormControl>
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
                                    sx={{gridColumn: "span 2"}}
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
                                    sx={{gridColumn: "span 2"}}
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
                            <Box display="flex" justifyContent="space-between" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New User
                                </Button>
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <Button color="secondary" variant="text">
                                        Login
                                    </Button>
                                </Link>
                            </Box>
                        </form>
                    )
                }

            </Formik>
        </Box>
    )
}

export default Signup