import { useEffect } from 'react';
import { AppBar, Box, Button, Paper, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { observer } from 'mobx-react-lite';

import { authStore } from '@/stores/authStore';
import { connect, disconnect } from '@/websocket/services';
import { Map } from '@/components/Map';
import { ObjectList } from '@/components/ObjectList';
import { UI_CONFIG } from '@/config/constants';

export const MapPage= observer(() => {
    useEffect(() => {
        if(authStore.apiKey) {
            connect(authStore.apiKey);
        }

        return () => disconnect();
    }, []);

    const handleLogout = () => {
        disconnect();
        authStore.logout();
    };

    return (
        <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                }}
            >
                <Map />
            </Box>

            <AppBar
                position="absolute"
                sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    height: UI_CONFIG.APP_BAR_HEIGHT,
                }}
            >
                <Toolbar sx={{ minHeight: `${UI_CONFIG.APP_BAR_HEIGHT}px !important` }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> Відстеження об'єктів </Typography>
                    <Button color="inherit" startIcon={ <LogoutIcon /> } onClick={ handleLogout }> Вийти </Button>
                </Toolbar>
            </AppBar>

            <Paper
                elevation={ 3 }
                sx={{
                    position: 'absolute',
                    top: UI_CONFIG.APP_BAR_HEIGHT,
                    left: 0,
                    width: UI_CONFIG.SIDEBAR_WIDTH,
                    height: `calc(100vh - ${UI_CONFIG.APP_BAR_HEIGHT}px)`,
                    zIndex: 1000,
                    borderRadius: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <ObjectList />
            </Paper>
        </Box>
    );
});
