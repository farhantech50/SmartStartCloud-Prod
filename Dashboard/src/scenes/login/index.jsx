import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material'
import Header from '../../components/Header'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from "yup"
import useMediaQuery from '@mui/material/useMediaQuery'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import useLogin from '../../hooks/useLogin.js'
import { Link } from 'react-router-dom'


const userSchema = yup.object().shape({
    // email: yup.string().email("invalid email").required("required"),
    userName: yup.string().required('User Name is required'),
    password: yup.string().required('Password is required'),
})

const initialValues = {
    userName: "",
    password: "",
}


const Login = () => {
    
    const isNonMobile = useMediaQuery('(min-width: 600px)')

    const [showPassword, setShowPassword] = useState(false);

    const {login} = useLogin()

    const handleFormSubmit = (values) => {
        login(values)
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <Box m="30px auto" width="800px">
        <Header title={"Login User"} subtitle={"This is the Login Page"} />
        
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
                                label="User Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.userName}
                                name="userName"
                                error={!!touched.userName && !!errors.userName}
                                helperText={touched.userName && errors.userName ? errors.userName : null}
                                sx={{gridColumn: "span 4"}}
                            />
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
                                sx={{gridColumn: "span 4"}}
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
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Log in User
                            </Button>
                            {/* <Link to="/signUp" style={{ textDecoration: 'none' }}>
                                <Button color="secondary" variant="text">
                                    Sign Up
                                </Button>
                            </Link> */}
                        </Box>
                    </form>
                )
            }

        </Formik>
    </Box>
  )
}

export default Login