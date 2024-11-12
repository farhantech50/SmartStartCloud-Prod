import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For accessing query params
import {Button,Container,Typography,Box,Card,CardContent,IconButton,TableContainer,Table,TableHead,TableCell,TableRow,TableBody,Grid,TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Paper from "@mui/material/Paper";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import useUploadFiles from "../../hooks/useUploadFiles";
import CloseIcon from "@mui/icons-material/Close";

const PortalFileUpload = ({orderIDPass, close}) => {
  const [files, setFiles] = useState([]);
  const [orderID, setOrderID] = useState(orderIDPass);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadFiles } = useUploadFiles();  

  const {
    control,
  } = useForm({});

  useEffect(() => {
    setOrderID(orderIDPass)    
  }, [orderIDPass]);

  // Handle multiple file changes
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async (file) => {
    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderID", orderID); // BSON handling occurs in the backend
    try {
      const response = await uploadFiles(formData);
      console.log("Response Data:", response);
      setUploadSuccess(true);
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <Card raised style={{ padding: "20px", borderRadius: "10px" }}>
      <IconButton
        aria-label="close"
        onClick={() => close(false)}
        sx={{
          position: "relative",
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography
          variant="h4"
          gutterBottom
          mb={3}
          align="center"
          style={{ fontWeight: "bold", color: "#1976d2" }}
        >
          File Upload
        </Typography>
        <Grid container spacing={2} display="flex" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Controller
              name="orderID"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={orderID}
                  label="Order ID"
                  variant="outlined"
                  fullWidth
                  required
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Attachments
              <input type="file" onChange={handleFileChange} hidden multiple />
            </Button>
          </Grid>
        </Grid>
        {/* Render table if files are uploaded */}
        {files.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                      <IconButton
                        color="secondary"
                        onClick={() => handleDownload(file)}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {!uploadSuccess ? (
                        <IconButton
                          color="primary"
                          onClick={() => handleUpload(file)}
                        >
                          <CloudUploadIcon />
                        </IconButton>
                      ) : (
                        <IconButton color="primary">
                          <DoneIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PortalFileUpload;
