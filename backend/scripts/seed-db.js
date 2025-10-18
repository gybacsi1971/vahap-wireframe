/**
 * VAHAP Adatbázis Seed Script
 *
 * Ez a script feltölti az adatbázist tesztadatokkal.
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

const SEED_FILE = path.join(__dirname, '../database/seed.sql');

console.log('🌱 VAHAP Adatbázis Seed (Tesztadatok feltöltése)\n');
console.log(`📂 Adatbázis útvonal: ${DB_PATH}`);
console.log(`📄 Seed fájl: ${SEED_FILE}\n`);

// Ellenőrizzük, hogy létezik-e az adatbázis
if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Hiba: Az adatbázis nem létezik!');
    console.error('💡 Futtasd először: npm run db:init\n');
    process.exit(1);
}

try {
    // Seed fájl beolvasása
    if (!fs.existsSync(SEED_FILE)) {
        throw new Error(`Seed fájl nem található: ${SEED_FILE}`);
    }

    const seedSQL = fs.readFileSync(SEED_FILE, 'utf8');
    console.log('✅ Seed fájl beolvasva.\n');

    // Adatbázis megnyitása
    const db = new Database(DB_PATH, { verbose: console.log });

    // Seed SQL végrehajtása
    console.log('📋 Tesztadatok feltöltése...\n');
    db.exec(seedSQL);

    console.log('\n✅ Tesztadatok sikeresen feltöltve!');

    // Statisztikák
    console.log('\n📊 Adatbázis statisztikák:');

    const stats = [
        { name: 'Ügytípusok', table: 'ugytipus' },
        { name: 'Ellenőrzési listák', table: 'ellenorzesi_lista' },
        { name: 'Ellenőrzési kritériumok', table: 'ellenorzesi_kriterium' },
        { name: 'Határidők', table: 'hataridok' },
        { name: 'Díjtételek', table: 'dijtetelek' },
        { name: 'Kedvezmények', table: 'kedvezmenyek' },
        { name: 'Dokumentum sablonok', table: 'dokumentum_sablonok' },
        { name: 'Workflow sablonok', table: 'workflow_sablonok' },
        { name: 'Workflow lépések', table: 'workflow_lepesek' },
        { name: 'Szerepkörök', table: 'szerepkorok' },
        { name: 'Jogosultságok', table: 'jogosultsagok' },
        { name: 'Felhasználók', table: 'felhasznalok' },
        { name: 'Ügyfelek', table: 'ugyfelek' },
        { name: 'Ügyek', table: 'ugyek' },
        { name: 'Ügy előzmények', table: 'ugy_elozmeny' },
        { name: 'VNY024 nyilvántartás', table: 'vny024_nyilvantartas' },
        { name: 'HNY501 nyilvántartás', table: 'hny501_nyilvantartas' }
    ];

    stats.forEach(stat => {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${stat.table}`).get();
        console.log(`   ${stat.name.padEnd(30)} ${count.count} rekord`);
    });

    db.close();
    console.log('\n🎉 Seed befejezve!');
    console.log('💡 Következő lépés: npm start\n');

} catch (error) {
    console.error('\n❌ Hiba a seed végrehajtása során:');
    console.error(error.message);
    process.exit(1);
}
