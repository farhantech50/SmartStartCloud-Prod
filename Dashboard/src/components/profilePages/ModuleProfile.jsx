import React from 'react'
import { useParams } from 'react-router-dom'
import { tokens } from '../../theme'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

const ModuleProfile = () => {
  const { moduleId } = useParams()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(moduleId);
  
  return (
    <Box m="20px auto" display="flex" flexDirection="column" maxWidth="1000px">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Card
          sx={{
            width: "100%",
            p: 2,
            background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
            boxShadow: 6,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              color={colors.grey[100]}
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Module Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Code:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {1}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Name:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {"a"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Type:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {"Essay"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Abstract:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color={colors.grey[100]}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestias maiores laborum repellat voluptatibus. Sed, possimus
                  porro aliquam quos expedita qui commodi tempora debitis, illo
                  voluptas inventore ipsa dolore recusandae totam. Nostrum
                  explicabo consectetur a illum, molestiae ad odio velit
                  accusantium quo corrupti at eligendi quia, iure porro veniam
                  quos, impedit inventore voluptatum. Ut magnam doloremque
                  quidem unde voluptatibus? Veritatis exercitationem accusamus
                  facilis tempora quidem animi. Quasi ea expedita dicta tempore
                  eveniet modi, adipisci sapiente accusamus explicabo tempora?
                  Numquam voluptate laborum quia ab qui quis. Ad in sapiente,
                  dolore nulla ab fuga quasi? Qui iusto error expedita eligendi!
                  Repellendus, qui nobis?
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ModuleProfile