import { Box, Card, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../theme';

const OrderCard = ({ orderID, referenceNumber, handleIDClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card
      onClick={() => handleIDClick(orderID)}
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
            <Typography variant="h5" component="div">
              Order ID
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {orderID}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="h5" component="div">
              Ref. No
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {referenceNumber}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard