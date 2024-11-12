import React, { useContext } from 'react'
import { Box, IconButton, Typography, Divider, useTheme } from "@mui/material"
import { ColorModeContext, tokens } from '../../theme'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { useAuthContext } from '../../context/AuthContext'
import DynamicBreadcrumbs from '../../components/DynamicBreadcrumbs'
import Logo from '../global/SmartstartLogo-removebg-preview.png'

const Topbar = ({ logOut }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const colorMode = useContext(ColorModeContext)
  const { authUser } = useAuthContext()

  return  (
          <Box display='flex' flexDirection='column'>
            <Box display="flex" justifyContent="space-between" p={2}>
              <Box display="flex" gap="20px">
                <Box display="flex" alignItems="center">
                 <img src={Logo} alt="SmartStart Logo" style={{ height: '40px' }} />
                </Box>
              </Box>
              <Box display="flex" gap="10px" alignItems="center">
                {authUser && (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end">
                      <Typography variant="overline" color={colors.grey[100]} fontWeight="bold" sx={{ lineHeight: '1.5' }}>
                        {authUser.name}
                      </Typography>
                      <Typography variant="caption" color={colors.grey[100]}>
                      {authUser.role}
                      </Typography>
                    </Box>
                )}
                {authUser && <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />}
                <Box display="flex" alignItems="center" gap="10px">
                  <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                  </IconButton>
                  {authUser && (
                      <>
                        <IconButton>
                          <SettingsOutlinedIcon />
                        </IconButton>
                        <Box display="flex" alignItems="center" gap="8px">
                          <PersonOutlinedIcon />
                          <Typography variant="body1" color={colors.grey[100]} fontWeight="bold">
                            {authUser.userName}
                          </Typography>
                        </Box>
                        <IconButton onClick={logOut} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ExitToAppOutlinedIcon />
                          <Typography variant="body1" color={colors.grey[100]}>
                            Logout
                          </Typography>
                        </IconButton>
                      </>
                  )}
                </Box>
              </Box>
            </Box>
            {authUser && <Box display="flex" justifyContent="space-between" px={2}>
              <DynamicBreadcrumbs />
            </Box>}
          </Box>
   )
 }

export default Topbar
