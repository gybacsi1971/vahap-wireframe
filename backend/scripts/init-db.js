/**
 * VAHAP Adatbázis Inicializáló Script
 *
 * Ez a script létrehozza az SQLite adatbázist és végrehajtja a séma SQL-t.
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Környezeti változók betöltése
dotenv.config();

const DB_PATH = process.env.DB_PATH;
if (!DB_PATH) {
    throw new Error('DB_PATH környezeti változó nincs beállítva! Nézd meg a .env fájlt.');
}

const SCHEMA_FILE = path.join(__dirname, '../database/init.sql');

console.log('🔧 VAHAP Adatbázis Inicializálás\n');
console.log(`📂 Adatbázis útvonal: ${DB_PATH}`);
console.log(`📄 Séma fájl: ${SCHEMA_FILE}\n`);

// Ellenőrizzük, hogy létezik-e már az adatbázis
const dbExists = fs.existsSync(DB_PATH);
if (dbExists) {
    console.log('⚠️  Az adatbázis már létezik!');
    console.log('❓ Folytatod? Az adatbázis TÖRLÉSRE kerül! (Ctrl+C a megszakításhoz)');

    // 3 másodperc várakozás
    setTimeout(() => {
        console.log('\n🗑️  Régi adatbázis törlése...');
        fs.unlinkSync(DB_PATH);
        console.log('✅ Régi adatbázis törölve.\n');
        createDatabase();
    }, 3000);
} else {
    createDatabase();
}

function createDatabase() {
    try {
        // Séma fájl beolvasása
        if (!fs.existsSync(SCHEMA_FILE)) {
            throw new Error(`Séma fájl nem található: ${SCHEMA_FILE}`);
        }

        const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
        console.log('✅ Séma fájl beolvasva.\n');

        // Adatbázis létrehozása
        console.log('🔨 Adatbázis létrehozása...');
        const db = new Database(DB_PATH, { verbose: console.log });

        // Séma végrehajtása
        console.log('\n📋 Séma végrehajtása...\n');
        db.exec(schema);

        console.log('\n✅ Adatbázis sikeresen létrehozva!');
        console.log(`📍 Elérési út: ${DB_PATH}`);

        // Táblák ellenőrzése
        const tables = db.prepare(`
            SELECT name FROM sqlite_master
            WHERE type='table'
            ORDER BY name
        `).all();

        console.log(`\n📊 Létrehozott táblák (${tables.length} db):`);
        tables.forEach(table => {
            console.log(`   - ${table.name}`);
        });

        db.close();
        console.log('\n🎉 Inicializálás befejezve!');
        console.log('💡 Következő lépés: npm run db:seed\n');

    } catch (error) {
        console.error('\n❌ Hiba az adatbázis inicializálása során:');
        console.error(error.message);
        process.exit(1);
    }
}
