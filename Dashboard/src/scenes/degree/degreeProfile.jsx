import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';
import {
    Box, Card, CardContent, CircularProgress, Typography, useTheme, Grid, Divider, Button,
    IconButton
} from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import StudentForm from '../../components/forms/StudentForm';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


const DegreeProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // useNavigate to handle navigation
  const { degreeYear, degreeId } = useParams();
  const { degree, loading, error } = useFetchSingleDegreeData(degreeId);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {degreeName,degreeAgent,degreeStudentList = [],degreeModules} = degree || {};

  // useEffect(() => {
  //   if (degree){
  //     console.log(degree);   
  //   }
  // }, [degree])

  const studentList = [...degreeStudentList];

  const columns = [
    { field: "studentID", headerName: "Student ID", flex: 0.5 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "studentLogin", headerName: "Username", flex: 1 },
    { field: "studentPassword", headerName: "Password", flex: 1 },
    { field: "studentContact", headerName: "Contact Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevents the row click event
              handleDelete(params.row);
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevents the row click event
              handleEdit(params.row);
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleModuleClick = (module) => {
    // Assuming degreeYear is part of the degree data    
    navigate(`/task/${degreeYear}/${degreeId}/module/${module._id}`);

  };

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleRowClick = (params) => {
    const studentId = params.row.studentID;
    // Assuming degreeYear is part of the degree data
    navigate(`/task/${degreeYear}/${degreeId}/student/${studentId}`, {
      state: { degreeModules },
    }); // Navigate to the student page
  };

  const handleEdit = (data) => {
    console.log(data);
  };

  const handleDelete = (data) => {
    console.log(data);
  };

  if (loading) {
    return (
      <Box
        mt="200px"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
      </Box>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Box
      m="20px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "1000px",
          p: 3,
          background: `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
          boxShadow: 6,
          borderRadius: 4,
          "&:hover": {
            boxShadow: 12,
          },
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h3"
                color={colors.grey[100]}
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Degree Information
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Degree ID:</strong> {degreeId}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Degree Name:</strong> {degreeName}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Agent Enlisted:</strong>{" "}
                  {`${degreeAgent?.firstName} ${degreeAgent?.lastName}`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: colors.blueAccent[800],
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Degree Modules
                </Typography>
                <Divider sx={{ my: 1, borderColor: colors.grey[700] }} />
                <Box>
                  {degreeModules && degreeModules.length > 0 ? (
                    degreeModules.map((module, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        color={colors.grey[200]}
                        sx={{ textAlign: "center", mb: 1 }}
                        onClick={() => handleModuleClick(module)}
                      >
                        {module.moduleName}
                      </Typography>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      color={colors.grey[400]}
                      sx={{ textAlign: "center" }}
                    >
                      No modules available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ width: "100%", maxWidth: "1000px", mt: 3 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 2,
            color: colors.blueAccent[300],
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Student List
        </Typography>
        <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[200],
              color: colors.black,
              fontSize: "16px",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: colors.grey[50],
              color: colors.black,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: colors.blueAccent[50],
                transform: "scale(1.01)",
                transition: "transform 0.2s",
              },
            },
          }}
          rows={studentList}
          columns={columns}
          getRowId={(row) => row.studentID}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          autoHeight
          onRowClick={handleRowClick} // Add onRowClick handler
        />
        <Button
          variant="contained"
          sx={{
            mt: 3,
            display: "block",
            mx: "auto",
            backgroundColor: colors.blueAccent[500],
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
          onClick={() => setOpen(true)}
        >
          Add Student
        </Button>
      </Box>

      <StudentForm open={open} setOpen={setOpen} degreeID={degreeId} />

      {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message="New student added successfully!"
            /> */}
    </Box>
  );
};

export default DegreeProfile;
