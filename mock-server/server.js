import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';

import { createSimulator, VALID_API_KEY } from './simulator.js';

const PORT = 3001;
const app = express();

app.use(cors());

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

const server = app.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

function parseApiKey(url) {
    const idx = url.indexOf('?');

    if (idx === -1) return null;
    const params = new URLSearchParams(url.slice(idx));

    return params.get('apiKey');
}

wss.on('connection', (ws, req) => {
    const apiKey = parseApiKey(req.url || '');

    if (apiKey !== VALID_API_KEY) {
        ws.close(4001, 'Invalid API key');
        return;
    }

    const simulator = createSimulator();

    simulator.start(updates => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(updates));
        }
    });

    ws.on('close', () => {
        simulator.stop();
    });
});
