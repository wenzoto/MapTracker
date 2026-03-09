import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { observer } from 'mobx-react-lite';

import { Box, CircularProgress, Typography } from '@mui/material';
import { ObjectMarker } from './ObjectMarker';
import { objectsStore } from '@/stores/objectsStore';
import { MAP_CONFIG } from '@/config/constants';

import 'leaflet/dist/leaflet.css';

function CenterWithChromeOffset() {
    const map = useMap();

    useEffect(() => {
        map.panBy([ MAP_CONFIG.CHROME_OFFSET.x, MAP_CONFIG.CHROME_OFFSET.y ], { animate: false });
        map.invalidateSize();
    }, [ map ]);

    return null;
}

export const Map = observer(() => {
    const objects = objectsStore.objectsArray;

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapContainer
                center={ MAP_CONFIG.CENTER }
                zoom={ MAP_CONFIG.ZOOM }
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom
            >
                <CenterWithChromeOffset />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    objects.map(
                        obj => <ObjectMarker key={ obj.id } obj={ obj } />,
                    )
                }
            </MapContainer>

            {
                objectsStore.isLoading
                && <Box
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
                    <CircularProgress size={ 32 } />
                    <Typography variant="body2" color="text.secondary"> Очікуємо дані… </Typography>
                </Box>
            }
        </Box>
    );
});
