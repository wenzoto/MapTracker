// WebSocket configuration
export const WEBSOCKET_CONFIG = {
    URL: 'ws://localhost:3001',
    RECONNECT_DELAY_MS: 3000,
    INVALID_API_KEY_CLOSE_CODE: 4001,
} as const;

// Object tracking configuration
export const OBJECT_CONFIG = {
    MARK_LOST_AFTER_MS: 5_000, // 5 seconds
    REMOVE_AFTER_MS: 300_000, // 5 minutes
    CHECK_INTERVAL_MS: 1_000, // 1 second
} as const;

// Map configuration
export const MAP_CONFIG = {
    CENTER: [ 55.7558, 37.6173 ] as [number, number],
    ZOOM: 11,
    CHROME_OFFSET: { x: -80, y: -30 },
} as const;

// UI dimensions
export const UI_CONFIG = {
    APP_BAR_HEIGHT: 56,
    SIDEBAR_WIDTH: 300,
} as const;

// Authentication configuration
export const AUTH_CONFIG = {
    STORAGE_KEY: 'tracker_api_key',
} as const;
