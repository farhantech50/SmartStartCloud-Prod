import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Tooltip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileUpload from '../FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AssignmentForm from '../forms/AssignmentForm';
import Slide from '@mui/material/Slide';
import useDeleteObjects from '../../hooks/useDeleteObjects';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AssignmentList = ({ list, degreeModules, student }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('orderID');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [orderIdToPass, setOrderIdToPass] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const {deleteAssignment} = useDeleteObjects()
  // console.log("students from parent ::::", student)
  const handleEditAssignment = (assignment) => {
    setCurrentAssignment(assignment);    
    setOpenDialog(true);
  };

  const handleDeleteAssignment = async (assignment) => {
    try{
      const response = await deleteAssignment(assignment._id)
      console.log("Response Data:", response);
      window.location.reload();
    }catch (e) {
        console.log("Error submitting form: ", e.message)
    }
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredList = list.filter((assignment) =>
    assignment.assignmentName && assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedList = filteredList.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Order ID', 'Assignment Name', 'Assignment Type', 'Deadline', 'Progress', 'Payment', 'Grade'],
      ...sortedList.map(assignment => [
        assignment.orderID,
        assignment.assignmentName,
        assignment.assignmentType,
        assignment.assignmentDeadline,
        assignment.assignmentProgress,
        assignment.assignmentPayment,
        assignment.assignmentGrade
      ])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'assignments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAssignment(null);
  }

  const renderTooltipContent = (assignment) => {
    return (
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          width: 250,
        }}
      >
        <LinearProgress 
          variant="determinate" 
          value={Number(assignment.assignmentProgress)} 
          sx={{
            height: 10,
            borderRadius: 5,
            '& .MuiLinearProgress-bar': {
              backgroundColor: assignment.assignmentProgress > 75 
                ? '#76c7c0' 
                : assignment.assignmentProgress > 50 
                ? '#ffcc00' 
                : '#ff5733'
            },
          }} 
        />
      </Box>
    );
  };

  const handleFileOpen = (orderID) => {    
    setOrderIdToPass(orderID);
    setOpen(true);
  }

  

  return (
    <Box>
      {list && (
        <Box mt={3} width="100%">
          <TextField
            label="Search Assignments"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadCSV}
            sx={{ mb: 2 }}
          >
            Download CSV
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "orderID"}
                      direction={orderBy === "orderID" ? order : "asc"}
                      onClick={() => handleRequestSort("orderID")}
                    >
                      Order ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentName"}
                      direction={orderBy === "assignmentName" ? order : "asc"}
                      onClick={() => handleRequestSort("assignmentName")}
                    >
                      Assignment Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentType"}
                      direction={orderBy === "assignmentType" ? order : "asc"}
                      onClick={() => handleRequestSort("assignmentType")}
                    >
                      Assignment Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentDeadline"}
                      direction={
                        orderBy === "assignmentDeadline" ? order : "asc"
                      }
                      onClick={() => handleRequestSort("assignmentDeadline")}
                    >
                      Deadline
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentProgress"}
                      direction={
                        orderBy === "assignmentProgress" ? order : "asc"
                      }
                      onClick={() => handleRequestSort("assignmentProgress")}
                    >
                      Progress
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentPayment"}
                      direction={
                        orderBy === "assignmentPayment" ? order : "asc"
                      }
                      onClick={() => handleRequestSort("assignmentPayment")}
                    >
                      Payment Status (GBP)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "assignmentGrade"}
                      direction={orderBy === "assignmentGrade" ? order : "asc"}
                      onClick={() => handleRequestSort("assignmentGrade")}
                    >
                      Grade
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((assignment, index) => (
                    <TableRow key={index}>
                      {[
                        "orderID",
                        "assignmentName",
                        "assignmentType",
                        "assignmentDeadline",
                        "assignmentProgress",
                        "assignmentPayment",
                        "assignmentGrade",
                      ].map((key) => (
                        <TableCell key={key}>
                          <Tooltip
                            title={
                              key === "assignmentProgress"
                                ? renderTooltipContent(assignment)
                                : ""
                            } // Conditionally render the tooltip content
                            arrow
                            interactive={key === "assignmentProgress"}
                          >
                            {/* Ensure that assignment[key] is rendered properly */}
                            <span>
                              {assignment[key] !== undefined
                                ? key === "assignmentPayment"
                                  ? assignment[key] === 0
                                    ? "NOT PAID"
                                    : assignment[key]
                                  : assignment[key]
                                : "N/A"}
                            </span>
                          </Tooltip>
                        </TableCell>
                      ))}
                      <TableCell>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Tooltip title="Open Files">
                            <IconButton
                              onClick={() => handleFileOpen(assignment.orderID)}
                            >
                              <FolderOpenOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditAssignment(assignment)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteAssignment(assignment)}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
      {open && (
        <FileUpload setOpen={setOpen} open={open} orderID={orderIdToPass} />
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        PaperProps={{ style: { height: "50vh", overflow: "hidden" } }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{ height: "100%", width: "100%", overflowY: "auto" }}>
            <AssignmentForm
              studentData={student._id}
              degreeModulesData={degreeModules}
              editMode={true}
              assignmentData={currentAssignment}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssignmentList;
