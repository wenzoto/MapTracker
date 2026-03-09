type WebSocketClientOptions = {
    getUrl: () => string;
    reconnectDelayMs?: number;
    shouldReconnect?: () => boolean;
    onOpen?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
};

export function createWebSocketClient({
    getUrl,
    reconnectDelayMs = 3000,
    shouldReconnect = () => true,
    onOpen,
    onMessage,
    onClose,
    onError,
}: WebSocketClientOptions) {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectEnabled = true;

    function clearReconnectTimer() {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    }

    function connect() {
        reconnectEnabled = true;

        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const socket = new WebSocket(getUrl());

        ws = socket;

        socket.onopen = () => {
            if (ws !== socket) return;
            onOpen?.();
        };

        socket.onmessage = event => {
            if (ws !== socket) return;
            onMessage?.(event);
        };

        socket.onclose = event => {
            const isCurrentSocket = ws === socket;

            if (isCurrentSocket) {
                ws = null;
            }

            onClose?.(event);

            if (!isCurrentSocket) {
                return;
            }

            if (!reconnectEnabled || !shouldReconnect()) {
                return;
            }

            if (!reconnectTimer) {
                reconnectTimer = setTimeout(() => {
                    reconnectTimer = null;
                    connect();
                }, reconnectDelayMs);
            }
        };

        socket.onerror = event => {
            if (ws !== socket) return;
            onError?.(event);
        };
    }

    function disconnect() {
        reconnectEnabled = false;
        clearReconnectTimer();

        if (ws) {
            const socket = ws;

            ws = null;
            socket.close();
        }
    }

    function disableReconnect() {
        reconnectEnabled = false;
        clearReconnectTimer();
    }

    function getSocket(): WebSocket | null {
        return ws;
    }

    return {
        connect,
        disconnect,
        disableReconnect,
        getSocket,
    };
}
