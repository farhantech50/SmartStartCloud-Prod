import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle  } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckIcon from '@mui/icons-material/Check';
import { useLocation, useNavigate } from "react-router-dom";


const Welcome = ( ) => {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userName, password } = location.state || {};

  useEffect(() => {
    // Logic to check if the page is refreshed
    // You can modify the logic based on your use case (e.g., based on localStorage, state, etc.)
    if (performance.getEntriesByType("navigation")[0].type === "reload" && isCopied) {
      // Navigate to another page after refresh
      navigate("/");
    }
  }, [navigate, isCopied]);

  const userInfo = {
    userName,
    password
  };

  const handleCopy = () => {
    const jsonString = JSON.stringify(userInfo, null, 2);
    navigator.clipboard.writeText(jsonString)
        .then(() => {
          setCopied(true);
          setSnackbarOpen(true);
          setTimeout(() => setCopied(false), 2000);
          setIsCopied(true)
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

   const handleModalClose = () => {
     setModalOpen(false);
   };


   return (
      <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px',
          }}
      >
        <Typography variant="h3" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
          Welcome to Our Service!
        </Typography>
        <Typography
            variant="body1"
            style={{ marginBottom: '40px', color: '#666', textAlign: 'center', maxWidth: '600px' }}
        >
          Below is the new agent's login keys.
          Just click the button to copy it to your clipboard! Please keep it safe:
        </Typography>

        <Card style={{ width: '80%', maxWidth: '600px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
              Signup JSON Data:
            </Typography>
            <Box
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ddd'
                }}
            >
              {JSON.stringify(userInfo, null, 2)}
            </Box>

              <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px',
                  }}
              >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ContentCopyIcon />}
                    style={{ textTransform: 'none' }}
                    onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy JSON'}
                </Button>
              </Box>
          </CardContent>
        </Card>

        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            message={
              <span style={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon style={{ marginRight: '8px' }} />
            Login credentials for agent copied successfully!
          </span>
            }
        />

        <Dialog
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: {
                padding: '20px',
                borderRadius: '8px',
              }
            }}
        >
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={2}
            >
              <WarningAmberIcon style={{ fontSize: '3rem', color: '#f50057' }} />
            </Box>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: '#333' }}>
              Important Information
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1" style={{ fontSize: '1.1rem', color: '#555', textAlign: 'center' }}>
              Please do not reload this page. This information can only be copied once.
            </Typography>
          </DialogContent>

          <DialogActions style={{ justifyContent: 'center', marginTop: '20px' }}>
            <Button
                onClick={handleModalClose}
                color="primary"
                variant="contained"
                style={{ textTransform: 'none', padding: '8px 24px', fontSize: '1rem' }}
            >
              Okay, I got it!
            </Button>
          </DialogActions>
        </Dialog>


      </Box>
  );
};

 export default Welcome;
