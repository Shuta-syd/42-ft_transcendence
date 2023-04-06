import React from 'react';
import {Badge } from '@mui/material';
import Grid from '@mui/material/Grid';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationButton = () => {
    console.log('notification button');
    return (
        <Grid item xs={4}>
        <Badge
            badgeContent={4}
            color={"error"}
            overlap="circular"
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <NotificationsIcon
                sx={{
                    color: "blue",
                    fontSize: "4rem",
                }}
            />
        </Badge>
        </Grid>
    )
}

export default NotificationButton;
