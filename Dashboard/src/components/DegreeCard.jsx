import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { useLocation, useNavigate } from 'react-router-dom';

const DegreeCard = ({ degreeYear, degreeId, degreeName, totalStudents, degreeAgent, totalPayment }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();


    const handleClick = () => {
        navigate(`/task/${degreeYear}/${degreeId}`);
    };

    return (
      <Card
        onClick={handleClick}
        sx={{
          minWidth: "100%",
          // background: `linear-gradient(210deg, ${colors.blueAccent[500]}, ${colors.blueAccent[700]})`,
          background: colors.blueAccent[800],
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
          color: colors.grey[50],
        }}
      >
        <CardActionArea>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {degreeName}
              </Typography>
              <Typography variant="subtitle1" component="div">
                {degreeId}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body1">Total Students:</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {totalStudents}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body1">Agent:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {degreeAgent.firstName} {degreeAgent.lastName}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body1">Total Amount:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {totalPayment}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    );
};

export default DegreeCard;
