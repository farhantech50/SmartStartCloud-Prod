import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Grid,
  TextField,
  useTheme,
  Modal,
  InputAdornment,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import useUploadFiles from "../hooks/useUploadFiles";
import useFetchFileList from "../hooks/useFetchFileList";

const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
};

const GlobalUploadPage = () => {
  const theme = useTheme();
  const [orderID, setOrderID] = useState('');
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [token, setToken] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [uploadStatus, setUploadStatus] = useState({});
  const { uploadFiles, downloadFiles } = useUploadFiles();
//   const { fileList } = useFetchFileList(orderID);

  const { control } = useForm({});

//   useEffect(() => {
//     if (fileList) {
//       setExistingFiles(fileList);
//     }
//   }, [fileList]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    setOrderID(tokenFromURL);
  }, [location]);

  console.log(orderID);
  

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...selectedFiles]);
    setUploadStatus({});
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderID", orderID);
    try {
      const response = await uploadFiles(formData);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: true,
      }));
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
  };

  const handleDownload = async (file) => {
    downloadFiles(file, true);
  };

//   const handleView = async (file) => {
//     downloadFiles(file, false);
//   };

  const handleCloseModal = () => {
    // setOpen(false);
  };

//   const handleSharableLink = async () => {
//     try {
//       const response = await handleGenerateShareableLink(orderID);
//       setShareLink(response.shareableLink);
//       console.log(response);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

  const handleLinkCopy = () => {
    if (shareLink) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => {
          alert("Share link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy the link: ", err);
        });
    }
  };

  return (
      <Container maxWidth="md" sx={{ marginTop: "50px" }}>
        <Card
          raised
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            position: "relative",
            backgroundColor: theme.palette.background.paper,
            ...customScrollbarStyles,
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              color: theme.palette.grey[700],
              backgroundColor: theme.palette.background.default,
              borderRadius: "50%",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>

          <CardContent>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="orderID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={orderID || ""}
                      label="Order ID"
                      variant="outlined"
                      fullWidth
                      required
                      disabled
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={handleSharableLink}
                  color="primary"
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  Generate Link
                </Button>
              </Grid> */}
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item sm={12}>
                <Controller
                  name="shareLink"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={shareLink || ""}
                      label="Share Link"
                      variant="outlined"
                      fullWidth
                      required
                      disabled
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleLinkCopy} edge="end">
                              <ContentCopyIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid> */}
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <Box>
                  <input type="file" onChange={handleFileChange} hidden />
                  <Box
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                      border: "2px dashed #cccccc",
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginTop: "10px",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Typography>
                      Drag and drop a file here or click to upload
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {files.length > 0 && (
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  ...customScrollbarStyles,
                }}
              >
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
                          {!uploadStatus[file.name] ? (
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

            {/* {existingFiles.length > 0 && (
              <Box mt={3}>
                <Typography
                  variant="h5"
                  gutterBottom
                  align="center"
                  sx={{ color: "#1976d2" }}
                >
                  Current Files
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ marginTop: "20px", ...customScrollbarStyles }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">File Name</TableCell>
                        <TableCell align="center">Download</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {existingFiles.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography
                              align="center"
                              onClick={() => handleView(file)}
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              {file.fileName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="secondary"
                              onClick={() => handleDownload(file)}
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )} */}
          </CardContent>
        </Card>
      </Container>
  );
};

export default GlobalUploadPage;
