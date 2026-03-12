import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Box } from '@mui/material';

import { MarkersLayer, LoadingOverlay } from './';
import { MAP_CONFIG } from '@/config/constants';

import 'leaflet/dist/leaflet.css';

function CenterWithChromeOffset() {
    const map = useMap();

    useEffect(() => {
        map.panBy([MAP_CONFIG.CHROME_OFFSET.x, MAP_CONFIG.CHROME_OFFSET.y], { animate: false });
        map.invalidateSize();
    }, [map]);

    return null;
}

export const Map = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapContainer
                center={MAP_CONFIG.CENTER}
                zoom={MAP_CONFIG.ZOOM}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom
            >
                <CenterWithChromeOffset />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkersLayer />
            </MapContainer>

            <LoadingOverlay />
        </Box>
    );
};
