import { useEffect, useMemo, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { observer } from 'mobx-react-lite';

import type { IObjectMarkerProps } from '@/types/trackable';

export const ObjectMarker = observer(({ obj }: IObjectMarkerProps) => {
    const markerRef = useRef<L.Marker | null>(null);

    const icon = useMemo(() => {
        return L.divIcon({
            className: 'object-marker',
            html: `<div class="triangle" style="
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-bottom: 20px solid #1976d2;
              will-change: transform;
            "></div>`,
            iconSize: [ 16, 20 ],
            iconAnchor: [ 8, 0 ],
        });
    }, []);

    useEffect(() => {
        const el = markerRef.current?.getElement();

        if (!el) return;

        const tri = el.querySelector<HTMLElement>('.triangle');

        if (!tri) return;

        tri.style.transformOrigin = '50% 50%';
        tri.style.transform = `rotate(${obj.direction}deg)`;
    }, [ obj.direction ]);

    useEffect(() => {
        const el = markerRef.current?.getElement();
        const tri = el?.querySelector<HTMLElement>('.triangle');

        if (!tri) return;

        tri.style.borderBottomColor = obj.status === 'lost' ? '#9e9e9e' : '#1976d2';
    }, [ obj.status ]);

    return (
        <Marker
            ref={ m => {
                markerRef.current = m as unknown as L.Marker | null;
            } }
            position={ [ obj.lat, obj.lng ] }
            icon={ icon }
            zIndexOffset={ 100 }
        >
            <Popup>
                <strong>{obj.id}</strong>
                <br />
                Широта: {obj.lat.toFixed(5)}, Довгота: {obj.lng.toFixed(5)}
                <br />
                Напрямок: { Math.round(obj.direction) }°
            </Popup>
        </Marker>
    );
});
