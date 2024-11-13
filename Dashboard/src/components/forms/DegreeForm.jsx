import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import {
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Grid,
    Select,
    MenuItem,
    Tooltip,
    Snackbar,
    useTheme,
    Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import { tokens } from '../../theme';
import useSendDegreeForm from '../../hooks/useSendDegreeForm';
import useFetchAgentList from '../../hooks/useFetchAgentList';
import UploadFileIcon from "@mui/icons-material/UploadFile";


const currentYear = new Date().getFullYear();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DegreeForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState(false);
  const [monthYear, setMonthYear] = useState({ month: "", year: "" });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      degreeID: "",
      degreeYear: "",
      degreeName: "",
      degreeAgent: "",
      // degreeStudentList: [{ studentID: '', studentName: '', studentContact: '', studentUsername: '', studentPassword: '', studentAssignmentList: [] }],
      degreeStudentList: [],
      degreeModules: [
        {
          moduleName: "",
          moduleCode: "",
          assignmentList: [
            { assignmentName: "", assignmentType: "", assignmentDeadline: "" },
          ],
        },
      ],
    },
  });

  // Watch for changes to the degreeID field
  const refDegreeID = watch("degreeID"); // This will hold the current value of degreeID

  const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
  } = useFieldArray({
    control,
    name: "degreeStudentList",
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "degreeModules",
  });

  const {
    fields: assignmentFields,
    append: appendAssignment,
    remove: removeAssignment,
  } = useFieldArray({
    control,
    name: "assignmentList",
  });

  const { agentList } = useFetchAgentList();

  const { sendDegreeForm } = useSendDegreeForm();

  const onSubmit = async (data) => {
    const modules = {};
    data.degreeYear = `${monthYear.month.toLowerCase()}_${monthYear.year}`;    

    data.degreeModules.forEach((module, index) => {
      module.moduleName = `Module ${index + 1}`;
      module.moduleCode = `${refDegreeID ? `${refDegreeID}_M` : ""}${
        index + 1
      }`;
    });
    setLoading(true);
    try {
      const response = await sendDegreeForm(data);
      console.log("Form Data:", data);
      // console.log('Response Data:', response);
      navigate(0);
      
      setFormSaved(true);
      setLoading(false);
    } catch (e) {
      setFormError(true);
      setLoading(false);
      setErrorMessage(e.message);
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
    populateStudentData(data);
  };

  const populateStudentData = (data) => {
    const studentListToPopulate = data.slice(1);
    for (let student of studentListToPopulate) {
      appendStudent({
        studentID: student[0],
        studentName: student[1],
        studentContact: student[2],
        studentLogin: student[3],
        studentPassword: student[4],
        studentAssignmentList: [],
      });
    }
  };

  return (
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
        Degree Form
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} sm={6} sx={{ mt: 4, mb: 3, width: "49.5%" }}>
          <Controller
            name="degreeID"
            control={control}
            render={({ field }) => (
              <Tooltip title="Enter the Degree ID">
                <TextField
                  {...field}
                  label="Degree ID"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Tooltip>
            )}
          />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Tooltip title="Select the Degree Month">
              <Select
                value={monthYear.month}
                onChange={(e) =>
                  setMonthYear({ ...monthYear, month: e.target.value })
                } // Set month
                fullWidth
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select Month
                </MenuItem>
                {months.map((month, index) => (
                  <MenuItem key={index} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </Grid>

          <Grid item xs={6}>
            <Tooltip title="Select the Degree Year">
              <Select
                value={monthYear.year}
                onChange={(e) =>
                  setMonthYear({ ...monthYear, year: e.target.value })
                } // Set year
                fullWidth
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select Year
                </MenuItem>
                {Array.from({ length: 30 }, (_, i) => (
                  <MenuItem key={i} value={currentYear - i}>
                    {currentYear - i}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="degreeName"
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter the Degree Name">
                  <TextField
                    {...field}
                    label="Degree Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Tooltip>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="degreeAgent"
              control={control}
              render={({ field }) => (
                <Tooltip title="Enter the Agent Name">
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    required
                    displayEmpty
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select Agent
                    </MenuItem>
                    {agentList?.map((agent, idx) => (
                      <MenuItem key={agent._id || idx} value={agent._id}>
                        {`${agent.firstName} ${agent.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </Tooltip>
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Degree Students
        </Typography><Typography variant="p" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Please use this <a href="https://docs.google.com/spreadsheets/d/15mkFlq3AB5YjgpTVgOyv3wNd-GzGKO1sBJqifltg7As/edit?usp=sharing" target="_blank">template</a> when uploading students in bulk using a CSV file.
        </Typography>
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
            Upload Student List
            <input type="file" onChange={handleFileChange} hidden multiple />
          </Button>
        </Grid>
        {studentFields.map((field, index) => (
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
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`degreeStudentList[${index}].studentID`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Student ID (Auto-generated)">
                          <TextField
                            {...field}
                            label="Student ID"
                            variant="outlined"
                            fullWidth
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`degreeStudentList[${index}].studentName`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Enter Student Name">
                          <TextField
                            {...field}
                            label="Student Name"
                            variant="outlined"
                            fullWidth
                            required
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`degreeStudentList[${index}].studentContact`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Enter Student Contact">
                          <TextField
                            {...field}
                            label="Student Contact"
                            variant="outlined"
                            fullWidth
                            required
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`degreeStudentList[${index}].studentLogin`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Enter Student Username">
                          <TextField
                            {...field}
                            label="Student Username"
                            variant="outlined"
                            fullWidth
                          />
                        </Tooltip>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`degreeStudentList[${index}].studentPassword`}
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Enter Student Password">
                          <TextField
                            {...field}
                            label="Student Password"
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
                onClick={() => removeStudent(index)}
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

        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.grey[200],
            color: colors.grey[900],
            "&:hover": { backgroundColor: colors.grey[100] },
          }}
          onClick={() =>
            appendStudent({
              studentID: "",
              studentName: "",
              studentContact: "",
              studentLogin: "",
              studentPassword: "",
              studentAssignmentList: [],
            })
          }
          startIcon={<AddIcon />}
        >
          Add Student
        </Button>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Degree Modules
        </Typography>
        {moduleFields.map((field, index) => (
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`degreeModules[${index}].moduleName`}
                  control={control}
                  defaultValue={`Module ${index + 1}`}
                  render={({ field }) => (
                    <Tooltip title="Module Name">
                      <TextField
                        {...field}
                        label="Module Name"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={field.value || `Module ${index + 1}`}
                      />
                    </Tooltip>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name={`degreeModules[${index}].moduleCode`}
                  control={control}
                  defaultValue={`${refDegreeID ? `${refDegreeID}_M` : ""}${
                    index + 1
                  }`}
                  render={({ field }) => (
                    <Tooltip title="Module Code">
                      <TextField
                        {...field}
                        label="Module Code"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={
                          field.value ||
                          `${refDegreeID ? `${refDegreeID}_M` : ""}${index + 1}`
                        }
                      />
                    </Tooltip>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                  Module Assignment
                </Typography>
                {assignmentFields.map((assignment, assignmentIndex) => (
                  <Box
                    key={assignment.id}
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Assignment Name"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Controller
                          name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentType`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Assignment Type"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Controller
                            name={`degreeModules[${index}].assignmentList[${assignmentIndex}].assignmentDeadline`}
                            control={control}
                            rules={{
                              required: "Assignment Deadline is required", // Validation rule to require the field
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <DatePicker
                                {...field}
                                label="Assignment Deadline"
                                inputFormat="MM/dd/yyyy" // Custom date format
                                value={
                                  field.value ? new Date(field.value) : null
                                } // Ensure the value is a Date object
                                onChange={(newValue) => {
                                  field.onChange(
                                    newValue
                                      ? format(newValue, "MM/dd/yyyy")
                                      : ""
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    error={!!error} // Display error if validation fails
                                    helperText={error ? error.message : null} // Show the error message
                                  />
                                )}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={1}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        <IconButton
                          onClick={() => removeAssignment(index)}
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
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  marginLeft: "16px",
                  backgroundColor: colors.grey[200],
                  color: colors.grey[900],
                  "&:hover": { backgroundColor: colors.grey[100] },
                }}
                onClick={() =>
                  appendAssignment({
                    assignmentName: "",
                    assignmentType: "",
                    assignmentDeadline: "",
                  })
                }
                startIcon={<AddIcon />}
              >
                Add Assignment
              </Button>

              <Grid item xs={12} sm={1} sx={{ alignSelf: "flex-start" }}>
                <IconButton
                  onClick={() => removeModule(index)}
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
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.grey[200],
              color: colors.grey[900],
              "&:hover": { backgroundColor: colors.grey[100] },
            }}
            onClick={() => appendModule({ moduleName: "", moduleCode: "" })}
            startIcon={<AddIcon />}
          >
            Add Module
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
              <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>

      <Snackbar open={formSaved} autoHideDuration={3000} onClose={handleClose}>
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
  );
};

export default DegreeForm;
