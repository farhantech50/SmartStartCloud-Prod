import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'

const DynamicBreadcrumbs = () => {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x)

    const excludedRoutes = ["/login", "/signUp"];
    if (excludedRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {/* Home Link */}
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
                <Typography variant="h5" color="text.secondary">
                    Home
                </Typography>
            </Link>

            {/* Dynamically Generated Breadcrumb Links */}
            {pathnames.map((value, index) => {
                // Create the route to link based on index
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                // Last breadcrumb is shown as text, not a link
                <Typography variant="h5" color="text.secondary" key={index}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Typography>
                ) : (
                // Intermediate breadcrumbs are links
                <Link
                    component={RouterLink}
                    to={routeTo}
                    underline="hover"
                    color="inherit"
                    key={index}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
                );
            })}
        </Breadcrumbs>
    )
}

export default DynamicBreadcrumbs