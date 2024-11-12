import Header from "../Header";
// import {degree } from '../../data/mockData'
import { yearFilter } from "../../utils/yearFilter";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {Button,TextField,Typography,Box,IconButton,Grid,Tooltip,Snackbar,useTheme,Alert,CircularProgress,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MuiAlert from "@mui/material/Alert";
import { tokens } from "../../theme";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAuthContext } from "../../context/AuthContext";
import useSendOrderList from "../../hooks/useSendOrderList";
const PortalIndex = () => {
  // Empty dependency array ensures this runs only once after the first render
  const { authUser } = useAuthContext();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {sendOrderList} = useSendOrderList();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      orderIDList: [],
    },
  });

  // Watch for changes to the degreeID field

  const {
    fields: orderIDFields,
    append: appendOrderID,
    remove: removeOrderID,
  } = useFieldArray({
    control,
    name: "orderIDList",
  });

  const onSubmit = async (data) => {

    // setLoading(true);
    try {
        const response = await sendOrderList(data);
        console.log("Form Data:", data);
        console.log("Response Data:", response);
    //   setFormSaved(true);
    //   setLoading(false);
    } catch (e) {
    //   setFormError(true);
    //   setLoading(false);
    //   setErrorMessage(e.message);
      console.log("Error submitting form: ", e.message);
    }
  };

  const handleClose = () => {
    setFormSaved(false);
  };

  const handleCloseError = () => {
    setFormError(false);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvContent = e.target.result;
        parseCSV(csvContent);
      };

      reader.readAsText(file);
    }
  };

  const parseCSV = (csvContent) => {
    const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
    const data = rows.map((row) => row.split(",").map((cell) => cell.trim()));
    // console.log("Parsed CSV Data:", data);
    populateOrderData(data);
  };

  const populateOrderData = (data) => {

    const OrderListToPopulate = data.slice(1);
    for (let order of OrderListToPopulate) {
      appendOrderID({
        orderID: order[0],
        referenceNumber: order[1],
      });
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data...</div>;
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"PORTAL"} subtitle={"Welcome to Portal for Order ID"} />
      </Box>
      <Box display="flex" gap="20px">
        <Box
          sx={{
            p: 3,
            width: "80%",
            maxWidth: "80%",
            margin: "0 auto",
            mt: 5,
            border: "1px solid rgba(102, 106, 108, 0.5)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: colors.grey[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.grey[100],
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.grey[300],
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: colors.grey[100],
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Order ID
          </Typography>
          
          <Typography variant="p" component="div">
            Please use this <a href="https://docs.google.com/spreadsheets/d/1Sn6U4RF7iIQzrvk3KGQH7X_RAfiD7ZcgFtaeZUDkcnU/edit?usp=sharing" target="_blank">template</a> when uploading orders in bulk using a CSV file.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                component="label"
                color="secondary"
                startIcon={<UploadFileIcon />}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  marginBottom: "20px",
                  marginRight: "10px",
                }}
              >
                Upload Order ID List
                <input
                  type="file"
                  onChange={handleFileChange}
                  hidden
                  multiple
                />
              </Button>
            </Grid>
            {orderIDFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  mb: 3,
                  width: "100%",
                  border: "1px solid rgba(102, 106, 108, 0.5)",
                  borderRadius: "8px",
                  position: "relative",
                  padding: "16px",
                  transition: "border-color 0.3s ease",
                  "&:hover": {
                    borderColor: "rgba(102, 106, 108, 0.9)",
                  },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name={`orderIDList[${index}].orderID`}
                          control={control}
                          render={({ field }) => (
                            <Tooltip title="Enter Order ID">
                              <TextField
                                {...field}
                                label="Order ID"
                                variant="outlined"
                                fullWidth
                              />
                            </Tooltip>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name={`orderIDList[${index}].referenceNumber`}
                          control={control}
                          render={({ field }) => (
                            <Tooltip title="Enter Reference Number">
                              <TextField
                                {...field}
                                label="Reference Number"
                                variant="outlined"
                                fullWidth
                              />
                            </Tooltip>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Tooltip title="Remove Student">
                  <IconButton
                    onClick={() => removeOrderID(index)}
                    sx={{
                      position: "absolute",
                      top: "-9px",
                      right: "-9px",
                      backgroundColor: "grey",
                      color: "white",
                      borderRadius: "50%",
                      height: "20px",
                      width: "20px",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "grey",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.grey[200],
                  color: colors.grey[900],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
                onClick={() =>
                  appendOrderID({
                    orderID: "",
                    referenceNumber: ""
                  })
                }
                startIcon={<AddIcon />}
              >
                Add Order
              </Button>

              <Button
                variant="contained"
                sx={{
                  width: "200px",
                  backgroundColor: colors.grey[200],
                  color: colors.grey[900],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: colors.grey[900] }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>

          <Snackbar
            open={formSaved}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleClose}
              severity="success"
            >
              Form submitted successfully!
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={formError}
            autoHideDuration={6000}
            onClose={handleCloseError}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              Form submission failed. {errorMessage}. Please try again.
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default PortalIndex;
