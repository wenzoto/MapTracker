import { nanoid } from 'nanoid';

const SIM_OBJECT_COUNT = 200;
const TICK_INTERVAL_MS = 1000;

const MOSCOW_LAT = 55.7558;
const MOSCOW_LNG = 37.6173;

const SPAWN_RADIUS_KM = 17;
const BOUNDARY_RADIUS_KM = 21;

const MIN_SPEED_KM_PER_TICK = 0.02;
const MAX_SPEED_KM_PER_TICK = 0.08;

const MAX_TURN_DEG = 2;

const VALID_API_KEY = 'demo-key-123';

const latRad = (MOSCOW_LAT * Math.PI) / 180;

//1 градус широти (lat) майже всюди на Землі ≈ 111.32 км.
const KM_PER_DEG_LAT = 111.32;
const KM_PER_DEG_LNG = 111.32 * Math.cos(latRad);

function randomInRange(min, max) {
    return min + Math.random() * (max - min);
}

function toLocalKm(lat, lng) {
    const dLat = (lat - MOSCOW_LAT) * KM_PER_DEG_LAT;
    const dLng = (lng - MOSCOW_LNG) * KM_PER_DEG_LNG;

    return { x: dLng, y: dLat };
}

function fromLocalKm(x, y) {
    const lat = MOSCOW_LAT + y / KM_PER_DEG_LAT;
    const lng = MOSCOW_LNG + x / KM_PER_DEG_LNG;

    return { lat, lng };
}

function createObject(index) {
    const r = Math.sqrt(Math.random()) * SPAWN_RADIUS_KM;
    const theta = Math.random() * Math.PI * 2;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const { lat, lng } = fromLocalKm(x, y);

    const direction = Math.random() * 360;
    const speedKmPerTick = randomInRange(MIN_SPEED_KM_PER_TICK, MAX_SPEED_KM_PER_TICK);

    return {
        publicId: `${nanoid(7)}_${index}`,
        lat,
        lng,
        direction,
        speedKmPerTick,
    };
}

function normalize360(deg) {
    return ((deg % 360) + 360) % 360;
}

function moveObject(obj) {
    let direction = obj.direction ?? Math.random() * 360;

    direction = normalize360(direction + randomInRange(-MAX_TURN_DEG, MAX_TURN_DEG));

    const speedKmPerTick = obj.speedKmPerTick ?? randomInRange(MIN_SPEED_KM_PER_TICK, MAX_SPEED_KM_PER_TICK);

    const rad = (direction * Math.PI) / 180;

    const { x, y } = toLocalKm(obj.lat, obj.lng);
    let newX = x + Math.sin(rad) * speedKmPerTick;
    let newY = y + Math.cos(rad) * speedKmPerTick;

    const distKm = Math.sqrt(newX * newX + newY * newY);

    if (distKm > BOUNDARY_RADIUS_KM) {
        const factor = BOUNDARY_RADIUS_KM / distKm;

        newX *= factor * 0.98;
        newY *= factor * 0.98;

        const toCenterDeg = normalize360((Math.atan2(-newX, -newY) * 180) / Math.PI);

        direction = normalize360(toCenterDeg + randomInRange(-15, 15));
    }

    const { lat, lng } = fromLocalKm(newX, newY);

    return { ...obj, lat, lng, direction, speedKmPerTick };
}

export function createSimulator() {
    const objects = new Map();

    for (let i = 1; i <= SIM_OBJECT_COUNT; i++) {
        objects.set(`obj-${i}`, createObject(i));
    }

    const activeSimIds = new Set(objects.keys());

    let intervalId = null;

    function getUpdates() {
        const updates = [];

        for (const simId of activeSimIds) {
            const obj = objects.get(simId);

            if (!obj) continue;

            const updated = moveObject(obj);

            objects.set(simId, updated);

            updates.push({
                id: updated.publicId,
                lat: updated.lat,
                lng: updated.lng,
                direction: updated.direction,
            });
        }
        return updates;
    }

    function stopSendingSome() {
        const ids = Array.from(activeSimIds);
        const toStop = Math.max(1, Math.floor(ids.length * 0.1));

        for (let i = 0; i < toStop && ids.length > 0; i++) {
            const idx = Math.floor(Math.random() * ids.length);

            activeSimIds.delete(ids[idx]);
            ids.splice(idx, 1);
        }
    }

    return {
        start(broadcast) {
            let tick = 0;

            intervalId = setInterval(() => {
                const updates = getUpdates();

                if (updates.length > 0) {
                    broadcast({ type: 'updates', updates });
                } else {
                    broadcast({ type: 'done' });
                    clearInterval(intervalId);
                    intervalId = null;
                }

                tick++;

                if (tick % 3 === 0) stopSendingSome();
            }, TICK_INTERVAL_MS);
        },
        stop() {
            if (!intervalId) return;
            clearInterval(intervalId);
            intervalId = null;
        },
    };
}

export { VALID_API_KEY };
