import { observer } from 'mobx-react-lite';
import { objectsStore } from '@/stores/objectsStore.ts';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingOverlay = observer(() => {
    if (!objectsStore.isLoading) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1.5,
                bgcolor: 'rgba(255,255,255,0.65)',
                zIndex: 1000,
                pointerEvents: 'none',
            }}
        >
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
                Очікуємо дані…
            </Typography>
        </Box>
    );
});
