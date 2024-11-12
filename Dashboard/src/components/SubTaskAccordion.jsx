import {useTheme, Typography } from '@mui/material'
import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { tokens } from '../theme'
import TaskTable from './TaskTable'


const SubTaskAccordion = ({taskTable}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const columns = [
        {field: "id", headerName: "ID", flex: .5},
        {field: "registrarId", headerName: "Registrar ID", flex: .5},
        {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
        {field: "email", headerName: "Email", flex: 1},
        {field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left"},
        {field: "phone", headerName: "Phone Number", flex: 1},
        {field: "address", headerName: "Address", flex: 1},
        {field: "city", headerName: "City", flex: 1},
        {field: "zipCode", headerName: "ZipCode", flex: 1},
        
    ]
    
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color={colors.grey[100]} variant='h5'>
                    {taskTable.taskName}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TaskTable columnDetails={columns} />
            </AccordionDetails>
        </Accordion>
    )
}

export default SubTaskAccordion