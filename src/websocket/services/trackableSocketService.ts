import { authStore } from '@/stores/authStore';
import { objectsStore } from '@/stores/objectsStore';
import type { IObjectUpdate } from '@/types/trackable';
import { createWebSocketClient } from '../client';
import { WEBSOCKET_CONFIG } from '@/config/constants';

let currentApiKey = '';

function buildWsUrl(apiKey: string): string {
    return `${WEBSOCKET_CONFIG.URL}?apiKey=${encodeURIComponent(apiKey)}`;
}

function handleInvalidApiKey(client: ReturnType<typeof createWebSocketClient>): void {
    client.disableReconnect();

    authStore.logout();
    objectsStore.clear();

    const socket = client.getSocket();

    if (socket) {
        try {
            socket.close();
        } catch (err) {
            console.warn('ws.close() failed', err);
        }
    }
}

function handleMessage(event: MessageEvent) {
    try {
        const data = JSON.parse(event.data);

        if (data?.type === 'done') {
            return;
        }

        if (Array.isArray(data?.updates)) {
            data.updates.forEach((update: IObjectUpdate) => {
                objectsStore.addOrUpdate(update);
            });
        }

        if(objectsStore.isLoading) objectsStore.markAsLoaded();
    } catch (err) {
        console.warn('ws.onmessage :: updates :: failed', err);
    }
}

const client = createWebSocketClient({
    getUrl: () => buildWsUrl(currentApiKey),
    reconnectDelayMs: WEBSOCKET_CONFIG.RECONNECT_DELAY_MS,
    shouldReconnect: () => authStore.isAuthenticated,

    onOpen: () => {
        objectsStore.startStaleCheck();
    },

    onMessage: handleMessage,

    onClose: ({ code, reason }) => {
        objectsStore.stopStaleCheck();

        if (code === WEBSOCKET_CONFIG.INVALID_API_KEY_CLOSE_CODE || reason === 'Invalid API key') {
            handleInvalidApiKey(client);
        }
    },

    onError: event => {
        console.warn('WebSocket error', event);
    },
});

export function connect(apiKey: string) {
    currentApiKey = apiKey;
    client.connect();
}

export function disconnect() {
    client.disconnect();
    objectsStore.stopStaleCheck();
    objectsStore.clear();
}
