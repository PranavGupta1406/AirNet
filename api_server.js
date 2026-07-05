/* ============================================================
   AIRNET — API Server (Professional Government Grade)
   Entry point for the REST API backend
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./models/index');

const app = express();
const PORT = process.env.API_PORT || 4000;

/* ── Core Middleware ─────────────────────────────────────── */
app.use(helmet());
const allowedOrigins = [
    `http://localhost:${process.env.FRONTEND_PORT || 3005}`,
    `http://127.0.0.1:${process.env.FRONTEND_PORT || 3005}`
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(morgan('dev'));

/* ── API Routes ──────────────────────────────────────────── */
app.use('/api/v1/simulate', require('./api/simulate'));
app.use('/api/v1/sensors', require('./api/sensors'));
app.use('/api/v1/analytics', require('./api/analytics'));
app.use('/api/v1/policy', require('./api/policy'));
app.use('/api/v1/reports', require('./api/reports'));

/* ── Health Check ────────────────────────────────────────── */
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

/* ── 404 Handler ─────────────────────────────────────────── */
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

/* ── Global Error Handler ────────────────────────────────── */
app.use((err, _req, res, _next) => {
    console.error('[API Error]', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_ERROR'
    });
});

/* ── Bootstrap ───────────────────────────────────────────── */
const { syncWAQIData } = require('./utils/waqiService');

(async () => {
    await db.init();
    app.listen(PORT, async () => {
        console.log(`\n AIRNET API running → http://localhost:${PORT}/api/v1`);
        console.log(` Health check        → http://localhost:${PORT}/api/v1/health\n`);

        // Initial data sync on startup
        if (process.env.WAQI_API_KEY) {
            console.log('[WAQI] Running initial data sync...');
            await syncWAQIData().catch(e => console.error('[WAQI] Initial sync error:', e.message));

            // Auto-sync every 30 minutes
            setInterval(async () => {
                console.log('[WAQI] Running scheduled sync...');
                await syncWAQIData().catch(e => console.error('[WAQI] Scheduled sync error:', e.message));
            }, 30 * 60 * 1000);
        } else {
            console.log('[WAQI] No API key — using local data only.');
        }
    });
})();
