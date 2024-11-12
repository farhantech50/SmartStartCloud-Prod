import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing query params
import { Button, Container, Typography, Box, Card, CardContent, IconButton, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Grid, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import useUploadFiles from '../hooks/useUploadFiles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Paper from '@mui/material/Paper';
import DoneIcon from '@mui/icons-material/Done';
import { Controller, useForm } from 'react-hook-form';

const UploadDownload = () => {
    const [files, setFiles] = useState([]);
    const [token, setToken] = useState(null);
    const [orderID, setOrderID] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [shareableLink, setShareableLink] = useState('');
    const { uploadFiles } = useUploadFiles();

    // Get token from the URL
    const location = useLocation();

    const { control, setError, clearErrors, reset, formState: { errors, touchedFields } } = useForm({});
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get('token');
        setToken(tokenFromURL);
    }, [location]);

    // Handle multiple file changes
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleUpload = async (file) => {
        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderID', orderID); // BSON handling occurs in the backend
        try {
            const response = await uploadFiles(formData)
            console.log('Response Data:', response);
            setUploadSuccess(true);
        } catch (error) {
            console.log("Error submitting form: ", error.message)
        }
    };

    const handleDownload = (file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }

    // const handleFileChange = async (event) => {
    //     const selectedFiles = Array.from(event.target.files);
    //     setFiles(selectedFiles);


    //     
    // };

    // // Function to generate a shareable link
    // const handleGenerateShareableLink = async () => {
    //     try {
    //         // You may want to pass a fileId or any identifier to the backend
    //         const response = await axios.post('/generate-share-token', { fileId: '12345' }); // Replace with actual fileId
    //         const { shareableToken } = response.data;
    
    //         // Generate the shareable link with the token
    //         const currentUrl = window.location.href.split('?')[0]; // Remove any existing query parameters
    //         const newLink = `${currentUrl}?token=${shareableToken}`;
    //         setShareableLink(newLink);
    
    //         // Copy the shareable link to the clipboard
    //         navigator.clipboard.writeText(newLink)
    //             .then(() => {
    //                 alert('Shareable link copied to clipboard!');
    //             })
    //             .catch(err => {
    //                 console.error('Failed to copy link: ', err);
    //             });
    //     } catch (error) {
    //         console.error('Error generating shareable link:', error);
    //         alert('Failed to generate shareable link.');
    //     }
    // };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        File Upload
                    </Typography>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                                startIcon={<CloudUploadIcon />}
                                style={{width: '100%' ,padding: '10px 20px', marginBottom: '20px', marginRight: '10px' }}
                            >
                                Upload Attachments
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    hidden
                                    multiple
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name='orderID'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        value={orderID}
                                        label="Order ID"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                        error={!!touchedFields.orderID && !!errors.orderID}
                                        helperText={touchedFields.orderID && errors.orderID ? errors.orderID.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("orderID", { type: "manual", message: "Order ID is required" });
                                            }else {
                                                clearErrors("orderID");
                                            }
                                        }}
                                        onChange={(e) => {
                                            // Update the student ID and the order ID
                                            field.onChange(e); // Update the form state
                                            setOrderID(e.target.value); // Update the order ID state
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {/* Show "Share this page" button only if there is no token */}
                            {/* {!token && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ShareIcon />}
                                    // onClick={handleGenerateShareableLink}
                                    style={{ padding: '10px 20px' }}
                                >
                                    Share This Page
                                </Button>
                            )} */}

                            {/* Display the generated shareable link */}
                            {/* {shareableLink && (
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                    Shareable Link: <a href={shareableLink}>{shareableLink}</a>
                                </Typography>
                            )} */}
                        </Grid>
                    </Grid>
                    {/* Render table if files are uploaded */}
                    {files.length > 0 && (
                        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">File Name</TableCell>
                                        <TableCell align="center">Download</TableCell>
                                        <TableCell align="center">Upload</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.map((file, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{file.name}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="secondary" onClick={() => handleDownload(file)}>
                                                    <CloudDownloadIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                {!uploadSuccess ? <IconButton color="primary" onClick={() => handleUpload(file)}>
                                                    <CloudUploadIcon />
                                                </IconButton> :
                                                <IconButton color="primary">
                                                    <DoneIcon />
                                                </IconButton>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default UploadDownload;
