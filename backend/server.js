/**
 * VAHAP 2.0 Backend API Server
 *
 * Node.js + Express + SQLite backend a VAHAP rendszerhez
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const path = require('path');

// Környezeti változók betöltése
dotenv.config();

// Konfiguráció
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error('PORT környezeti változó nincs beállítva! Nézd meg a .env fájlt.');
}

const DB_PATH = process.env.DB_PATH;
if (!DB_PATH) {
    throw new Error('DB_PATH környezeti változó nincs beállítva! Nézd meg a .env fájlt.');
}

const CORS_ORIGINS = process.env.CORS_ORIGINS;
if (!CORS_ORIGINS) {
    throw new Error('CORS_ORIGINS környezeti változó nincs beállítva! Nézd meg a .env fájlt.');
}

// Express app inicializálása
const app = express();

// SQLite adatbázis kapcsolat
let db;
try {
    db = new Database(DB_PATH, { verbose: console.log });
    console.log(`✅ SQLite adatbázis kapcsolat létrehozva: ${DB_PATH}`);
} catch (error) {
    console.error('❌ Hiba az adatbázis kapcsolat létrehozásakor:', error.message);
    console.error('💡 Futtasd a következő parancsot: npm run db:init');
    process.exit(1);
}

// Middleware-ek
app.use(cors({
    origin: CORS_ORIGINS.split(',').map(o => o.trim())
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kérések naplózása
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Adatbázis objektum elérhetővé tétele az egész alkalmazásban
app.locals.db = db;

// API Route-ok betöltése
const parameterezoRoutes = require('./routes/parameterezo');
const vasutRoutes = require('./routes/vasut');
const hajozasRoutes = require('./routes/hajozas');

// Route-ok regisztrálása
app.use('/api/parameterezo', parameterezoRoutes);
app.use('/api/vasut', vasutRoutes);
app.use('/api/hajozas', hajozasRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        // Adatbázis kapcsolat tesztelése
        const result = db.prepare('SELECT 1 as test').get();
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: result.test === 1 ? 'Connected' : 'Error',
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message
        });
    }
});

// Gyökér endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'VAHAP 2.0 Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            parameterezo: '/api/parameterezo/*',
            vasut: '/api/vasut/*',
            hajozas: '/api/hajozas/*'
        },
        documentation: 'https://github.com/vahap/docs'
    });
});

// 404 kezelése
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Az endpoint (${req.method} ${req.path}) nem található.`,
        timestamp: new Date().toISOString()
    });
});

// Hibakezelés
app.use((err, req, res, next) => {
    console.error('❌ Hiba:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Szerver indítása
app.listen(PORT, () => {
    console.log('\n🚀 VAHAP Backend API elindult!');
    console.log(`📡 Szerver: http://localhost:${PORT}`);
    console.log(`🗄️  Adatbázis: ${DB_PATH}`);
    console.log(`🌐 CORS engedélyezett: ${CORS_ORIGINS}`);
    console.log('\n📚 Elérhető endpointok:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   *    http://localhost:${PORT}/api/parameterezo/*`);
    console.log(`   *    http://localhost:${PORT}/api/vasut/*`);
    console.log(`   *    http://localhost:${PORT}/api/hajozas/*`);
    console.log('\n✅ A szerver fut és készen áll a kérések fogadására.\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⏹️  Szerver leállítása...');
    db.close();
    console.log('✅ Adatbázis kapcsolat lezárva.');
    process.exit(0);
});
