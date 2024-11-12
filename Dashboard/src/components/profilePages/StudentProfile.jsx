import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useFetchSingleStudentData from '../../hooks/useFetchSingleStudentData';
import {Box,Button,Card,CardContent,CircularProgress,Grid,Typography,Dialog,useTheme,DialogTitle,DialogContent,IconButton,} from '@mui/material';
import { tokens } from '../../theme';
import AssignmentForm from '../forms/AssignmentForm';
import AssignmentList from './AssignmentList';
import useFetchAssignmentList from '../../hooks/useFetchAssignmentList';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const StudentProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const { studentId } = useParams();
    
    const { student, loading, error } = useFetchSingleStudentData(studentId);

    const { fetchAssignmentList } = useFetchAssignmentList();

    const { _id, studentName, studentContact, studentLogin, studentPassword } = student || {};
    // console.log("student :::", student);
    
    const { degreeModules } = location.state || [];    

    const [open, setOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(degreeModules[0]?._id || null);
    const [selectedModuleName, setSelectedModuleName] = useState(degreeModules[0]?.moduleName || "");
    const [assignmentList, setAssignmentList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState(false);
    const [listErrorMessage, setListErrorMessage] = useState('');

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleModuleClick = async (moduleId, moduleName) => {
        setSelectedModule(moduleId);
        setSelectedModuleName(moduleName);
        setListLoading(true);
        setListError(false);
        setAssignmentList([]);

        try {
            const response = await fetchAssignmentList(moduleId, _id);
            if (Array.isArray(response)) {
                setAssignmentList([{ moduleName }, ...response]);                
            } else {
                throw new Error("Invalid response from the server");
            }
        } catch (e) {
            setListError(true);
            setListErrorMessage(e.message);
        } finally {
            console.log(assignmentList);
            
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (degreeModules.length > 0 && student) {
            handleModuleClick(degreeModules[0]._id, degreeModules[0].moduleName);
        }
    }, [degreeModules, student]);

    if (loading) {
        return (
            <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
            </Box>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <Box m="20px auto" display="flex" flexDirection="column" maxWidth="1000px">
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Card
                    sx={{
                        width: '50%',
                        p: 2,
                        background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
                        boxShadow: 6,
                        borderRadius: 4,
                    }}
                >
                    <CardContent>
                        <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
                            Student Information
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontWeight: 'bold' }}>
                                    Student ID:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {studentId}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontWeight: 'bold' }}>
                                    Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {studentName}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontWeight: 'bold' }}>
                                    Contact:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {studentContact}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontWeight: 'bold' }}>
                                    Login:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {studentLogin}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]} sx={{ fontWeight: 'bold' }}>
                                    Password:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" color={colors.grey[100]}>
                                    {studentPassword}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Box sx={{marginLeft:"20px", width: '50%' }}>
                    <Typography variant="h4" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
                        Module List
                    </Typography>
                    <Grid container spacing={2}>
                        {degreeModules.map((module) => (
                            <Grid item xs={12} key={module._id}>
                                <Card
                                    onClick={() => handleModuleClick(module._id, module.moduleName)}
                                    sx={{
                                        p: 3,
                                        background: selectedModule === module._id ? `rgba(0, 0, 0, 0.1)` : `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
                                        boxShadow: selectedModule === module._id ? 12 : 6,
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="h5" color={colors.grey[100]}>{module.moduleName} - {module.moduleCode}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
                <Box mt={2} sx={{ position: 'relative' }}>
                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            backgroundColor: colors.blueAccent[500],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[600],
                            },
                        }}
                    >
                        Add Assignment
                    </Button>
                </Box>

                {listLoading ? (
                    <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
                    </Box>
                ) : (
                    <Box mt={2} mb={10}>
                        <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
                        Assignments List for {selectedModuleName}
                        </Typography>
                        <AssignmentList list={assignmentList} degreeModules={degreeModules} student={student} />
                        {assignmentList.length === 0 && (
                            <Typography align="center" color={colors.grey[200]}>
                                No assignments found for this module.
                            </Typography>
                        )}
                        {/* {listError && (
                            <Typography align="center" color="red">
                                {listErrorMessage}
                            </Typography>
                        )} */}
                    </Box>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{ style: { height: '50vh', overflow: 'hidden' } }}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: 0 }}>
                    <Box sx={{ height: '100%', width: '100%', overflowY: 'auto' }}>
                        <AssignmentForm studentData={student._id} degreeModulesData={degreeModules} editMode={false} />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default StudentProfile;
