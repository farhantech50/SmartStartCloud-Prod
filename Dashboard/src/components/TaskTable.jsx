import {useTheme, Box } from '@mui/material'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from '../theme'
import { mockDataContacts } from '../data/mockData'
import React from 'react'

const TaskTable = ({columnDetails}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Box m="0" p="0" height="auto"
            sx={{
                width: '100%',
                maxHeight: '75vh', // Adjust as needed
                overflow: 'auto',
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                }
            }}
        >
            <DataGrid
                rows={mockDataContacts}
                columns={columnDetails}
                slots={{ toolbar: GridToolbar }} 
                pageSize={10} // Adjust as needed
                rowsPerPageOptions={[10, 25, 50]} // Adjust as needed
            />
        </Box>
    )
}

export default TaskTable