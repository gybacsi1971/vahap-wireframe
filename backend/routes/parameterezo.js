/**
 * VAHAP Paraméterező Modul API Route-ok
 *
 * Összes paraméterező funkcióhoz tartozó endpoint
 */

const express = require('express');
const router = express.Router();

// ============================================================================
// ELLENŐRZÉSI LISTÁK (F-0064, F-0065, F-0066)
// ============================================================================

// Összes ellenőrzési lista lekérése
router.get('/ellenorzesi-listak', (req, res) => {
    try {
        const db = req.app.locals.db;
        const listak = db.prepare(`
            SELECT * FROM ellenorzesi_lista
            WHERE aktiv = 1
            ORDER BY lista_kod
        `).all();

        res.json({ listak });
    } catch (error) {
        console.error('Hiba az ellenőrzési listák lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Egy ellenőrzési lista kritériumainak lekérése
router.get('/ellenorzesi-listak/:lista_kod/kriteriumok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { lista_kod } = req.params;

        // Lista lekérése
        const lista = db.prepare(`
            SELECT * FROM ellenorzesi_lista
            WHERE lista_kod = ? AND aktiv = 1
        `).get(lista_kod);

        if (!lista) {
            return res.status(404).json({ error: 'Lista nem található' });
        }

        // Kritériumok lekérése
        const kriteriumok = db.prepare(`
            SELECT * FROM ellenorzesi_kriterium
            WHERE lista_id = ? AND aktiv = 1
            ORDER BY sorrend
        `).all(lista.id);

        res.json({
            lista,
            kriteriumok
        });
    } catch (error) {
        console.error('Hiba a kritériumok lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új kritérium hozzáadása
router.post('/ellenorzesi-listak/:lista_kod/kriteriumok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { lista_kod } = req.params;
        const { megnevezes, leiras, sorrend, kotelezo, tipus, suly, ugytipus_specifikus } = req.body;

        // Lista ID lekérése
        const lista = db.prepare(`
            SELECT id FROM ellenorzesi_lista WHERE lista_kod = ?
        `).get(lista_kod);

        if (!lista) {
            return res.status(404).json({ error: 'Lista nem található' });
        }

        // Új kritérium beszúrása
        const stmt = db.prepare(`
            INSERT INTO ellenorzesi_kriterium (
                lista_id, megnevezes, leiras, sorrend, kotelezo,
                tipus, suly, ugytipus_specifikus, aktiv
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);

        const result = stmt.run(
            lista.id,
            megnevezes,
            leiras || null,
            sorrend,
            kotelezo ? 1 : 0,
            tipus || 'igen_nem',
            suly || 5,
            ugytipus_specifikus || null
        );

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Kritérium sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a kritérium létrehozásánál:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kritérium módosítása
router.put('/ellenorzesi-listak/:lista_kod/kriteriumok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, leiras, sorrend, kotelezo, tipus, suly, ugytipus_specifikus, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE ellenorzesi_kriterium
            SET megnevezes = ?, leiras = ?, sorrend = ?, kotelezo = ?,
                tipus = ?, suly = ?, ugytipus_specifikus = ?, aktiv = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(
            megnevezes,
            leiras || null,
            sorrend,
            kotelezo ? 1 : 0,
            tipus || 'igen_nem',
            suly || 5,
            ugytipus_specifikus || null,
            aktiv ? 1 : 0,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kritérium nem található' });
        }

        res.json({ message: 'Kritérium sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a kritérium frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kritérium törlése (soft delete)
router.delete('/ellenorzesi-listak/:lista_kod/kriteriumok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE ellenorzesi_kriterium
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kritérium nem található' });
        }

        res.json({ message: 'Kritérium sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a kritérium törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// HATÁRIDŐK
// ============================================================================

// Összes határidő lekérése
router.get('/hataridok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const hataridok = db.prepare(`
            SELECT * FROM hataridok
            WHERE aktiv = 1
            ORDER BY megnevezes
        `).all();

        res.json({ hataridok });
    } catch (error) {
        console.error('Hiba a határidők lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új határidő hozzáadása
router.post('/hataridok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { megnevezes, kod, napok, tipus, leiras } = req.body;

        const stmt = db.prepare(`
            INSERT INTO hataridok (megnevezes, kod, napok, tipus, leiras, aktiv)
            VALUES (?, ?, ?, ?, ?, 1)
        `);

        const result = stmt.run(megnevezes, kod || null, napok, tipus || 'munkanap', leiras || null);

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Határidő sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a határidő létrehozásánál:', error);
        res.status(500).json({ error: error.message });
    }
});

// Határidő módosítása
router.put('/hataridok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, kod, napok, tipus, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE hataridok
            SET megnevezes = ?, kod = ?, napok = ?, tipus = ?, leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(megnevezes, kod || null, napok, tipus || 'munkanap', leiras || null, aktiv ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Határidő nem található' });
        }

        res.json({ message: 'Határidő sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a határidő frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Határidő törlése
router.delete('/hataridok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE hataridok
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Határidő nem található' });
        }

        res.json({ message: 'Határidő sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a határidő törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// DÍJTÉTELEK (F-0070)
// ============================================================================

// Ügytípus díjtételeinek lekérése
router.get('/dijtetelek/:ugytipus_kod', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { ugytipus_kod } = req.params;

        // Ügytípus adatok
        const ugytipus = db.prepare(`
            SELECT * FROM ugytipus WHERE kod = ? AND aktiv = 1
        `).get(ugytipus_kod);

        if (!ugytipus) {
            return res.status(404).json({ error: 'Ügytípus nem található' });
        }

        // Díjtételek
        const dijak = db.prepare(`
            SELECT * FROM dijtetelek
            WHERE ugytipus_kod = ? AND aktiv = 1
            ORDER BY tipus, megnevezes
        `).all(ugytipus_kod);

        // Kedvezmények
        const kedvezmenyek = db.prepare(`
            SELECT * FROM kedvezmenyek
            WHERE ugytipus_kod = ? AND aktiv = 1
            ORDER BY megnevezes
        `).all(ugytipus_kod);

        res.json({
            ugytipus,
            dijak,
            kedvezmenyek
        });
    } catch (error) {
        console.error('Hiba a díjtételek lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új díjtétel hozzáadása
router.post('/dijtetelek/:ugytipus_kod', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { ugytipus_kod } = req.params;
        const { megnevezes, osszeg, tipus, kotelezo, leiras } = req.body;

        const stmt = db.prepare(`
            INSERT INTO dijtetelek (ugytipus_kod, megnevezes, osszeg, tipus, kotelezo, leiras, aktiv)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `);

        const result = stmt.run(ugytipus_kod, megnevezes, osszeg, tipus || 'potdij', kotelezo ? 1 : 0, leiras || null);

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Díjtétel sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a díjtétel létrehozásánál:', error);
        res.status(500).json({ error: error.message });
    }
});

// Díjtétel módosítása
router.put('/dijtetelek/:ugytipus_kod/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, osszeg, tipus, kotelezo, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE dijtetelek
            SET megnevezes = ?, osszeg = ?, tipus = ?, kotelezo = ?, leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(megnevezes, osszeg, tipus, kotelezo ? 1 : 0, leiras || null, aktiv ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Díjtétel nem található' });
        }

        res.json({ message: 'Díjtétel sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a díjtétel frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Díjtétel törlése
router.delete('/dijtetelek/:ugytipus_kod/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE dijtetelek
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Díjtétel nem található' });
        }

        res.json({ message: 'Díjtétel sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a díjtétel törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Díjtétel módosítása (egyszerűsített endpoint)
router.put('/dijak/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, osszeg, tipus, kotelezo, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE dijtetelek
            SET megnevezes = ?, osszeg = ?, tipus = ?, kotelezo = ?, leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(megnevezes, osszeg, tipus, kotelezo ? 1 : 0, leiras || null, aktiv !== false ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Díjtétel nem található' });
        }

        res.json({ id, message: 'Díjtétel sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a díjtétel frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Díjtétel törlése (egyszerűsített endpoint)
router.delete('/dijak/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE dijtetelek
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Díjtétel nem található' });
        }

        res.json({ message: 'Díjtétel sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a díjtétel törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// KEDVEZMÉNYEK
// ============================================================================

// Új kedvezmény hozzáadása
router.post('/kedvezmenyek/:ugytipus_kod', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { ugytipus_kod } = req.params;
        const { megnevezes, szazalek, leiras } = req.body;

        const stmt = db.prepare(`
            INSERT INTO kedvezmenyek (ugytipus_kod, megnevezes, szazalek, leiras, aktiv)
            VALUES (?, ?, ?, ?, 1)
        `);

        const result = stmt.run(ugytipus_kod, megnevezes, szazalek, leiras || null);

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Kedvezmény sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a kedvezmény létrehozásánál:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kedvezmény módosítása
router.put('/kedvezmenyek/:ugytipus_kod/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, szazalek, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE kedvezmenyek
            SET megnevezes = ?, szazalek = ?, leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(megnevezes, szazalek, leiras || null, aktiv ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kedvezmény nem található' });
        }

        res.json({ message: 'Kedvezmény sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a kedvezmény frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kedvezmény törlése
router.delete('/kedvezmenyek/:ugytipus_kod/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE kedvezmenyek
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kedvezmény nem található' });
        }

        res.json({ message: 'Kedvezmény sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a kedvezmény törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kedvezmény módosítása (egyszerűsített endpoint)
router.put('/kedvezmenyek/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { megnevezes, szazalek, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE kedvezmenyek
            SET megnevezes = ?, szazalek = ?, leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(megnevezes, szazalek, leiras || null, aktiv !== false ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kedvezmény nem található' });
        }

        res.json({ id, message: 'Kedvezmény sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a kedvezmény frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kedvezmény törlése (egyszerűsített endpoint)
router.delete('/kedvezmenyek/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE kedvezmenyek
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Kedvezmény nem található' });
        }

        res.json({ message: 'Kedvezmény sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a kedvezmény törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// DOKUMENTUM SABLONOK (F-0091 - F-0095)
// ============================================================================

// Összes dokumentum sablon lekérése
router.get('/dokumentum-sablonok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { tipus, modul } = req.query;

        let sql = 'SELECT * FROM dokumentum_sablonok WHERE aktiv = 1';
        const params = [];

        if (tipus) {
            sql += ' AND tipus = ?';
            params.push(tipus);
        }

        if (modul) {
            sql += ' AND (modul = ? OR modul = "kozos")';
            params.push(modul);
        }

        sql += ' ORDER BY tipus, megnevezes';

        const sablonok = db.prepare(sql).all(...params);

        res.json({ sablonok });
    } catch (error) {
        console.error('Hiba a dokumentum sablonok lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Dokumentum sablon típusok gruppálva
router.get('/dokumentum-sablonok/grouped', (req, res) => {
    try {
        const db = req.app.locals.db;

        const grouped = {
            vegzes: db.prepare("SELECT * FROM dokumentum_sablonok WHERE tipus = 'vegzes' AND aktiv = 1 ORDER BY megnevezes").all(),
            hatrozat: db.prepare("SELECT * FROM dokumentum_sablonok WHERE tipus = 'hatrozat' AND aktiv = 1 ORDER BY megnevezes").all(),
            igazolas: db.prepare("SELECT * FROM dokumentum_sablonok WHERE tipus = 'igazolas' AND aktiv = 1 ORDER BY megnevezes").all(),
            tajekoztatas: db.prepare("SELECT * FROM dokumentum_sablonok WHERE tipus = 'tajekoztatas' AND aktiv = 1 ORDER BY megnevezes").all(),
            hirdetmeny: db.prepare("SELECT * FROM dokumentum_sablonok WHERE tipus = 'hirdetmeny' AND aktiv = 1 ORDER BY megnevezes").all()
        };

        res.json(grouped);
    } catch (error) {
        console.error('Hiba a gruppált dokumentum sablonok lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új dokumentum sablon létrehozása
router.post('/dokumentum-sablonok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { kod, megnevezes, tipus, modul, sablon_fajl, leiras, verzio, tartalom, aktiv } = req.body;

        const stmt = db.prepare(`
            INSERT INTO dokumentum_sablonok (
                kod, megnevezes, tipus, modul, sablon_fajl, leiras, verzio, tartalom, aktiv
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            kod,
            megnevezes,
            tipus,
            modul || 'kozos',
            sablon_fajl || null,
            leiras || null,
            verzio || '1.0',
            tartalom || null,
            aktiv !== undefined ? (aktiv ? 1 : 0) : 1
        );

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Dokumentum sablon sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a dokumentum sablon létrehozásánál:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Ez a sablon kód már létezik' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Dokumentum sablon módosítása
router.put('/dokumentum-sablonok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { kod, megnevezes, tipus, modul, sablon_fajl, leiras, verzio, tartalom, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE dokumentum_sablonok
            SET kod = ?, megnevezes = ?, tipus = ?, modul = ?, sablon_fajl = ?,
                leiras = ?, verzio = ?, tartalom = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(
            kod,
            megnevezes,
            tipus,
            modul || 'kozos',
            sablon_fajl || null,
            leiras || null,
            verzio || '1.0',
            tartalom || null,
            aktiv ? 1 : 0,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Dokumentum sablon nem található' });
        }

        res.json({ message: 'Dokumentum sablon sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a dokumentum sablon frissítésénél:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Ez a sablon kód már létezik' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Dokumentum sablon törlése (soft delete)
router.delete('/dokumentum-sablonok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE dokumentum_sablonok
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Dokumentum sablon nem található' });
        }

        res.json({ message: 'Dokumentum sablon sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a dokumentum sablon törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// SZEREPKÖRÖK ÉS JOGOSULTSÁGOK
// ============================================================================

// Összes szerepkör lekérése jogosultságokkal
router.get('/szerepkorok', (req, res) => {
    try {
        const db = req.app.locals.db;

        const szerepkorok = db.prepare(`
            SELECT * FROM szerepkorok WHERE aktiv = 1 ORDER BY kod
        `).all();

        // Minden szerepkörhöz lekérjük a jogosultságokat
        szerepkorok.forEach(szerepkor => {
            szerepkor.jogosultsagok = db.prepare(`
                SELECT jogosultsag, leiras
                FROM jogosultsagok
                WHERE szerepkor_kod = ?
            `).all(szerepkor.kod);
        });

        res.json({ szerepkorok });
    } catch (error) {
        console.error('Hiba a szerepkörök lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// FELHASZNÁLÓK
// ============================================================================

// Összes felhasználó lekérése
router.get('/felhasznalok', (req, res) => {
    try {
        const db = req.app.locals.db;

        const felhasznalok = db.prepare(`
            SELECT f.*, s.nev as szerepkor_nev
            FROM felhasznalok f
            LEFT JOIN szerepkorok s ON f.szerepkor_kod = s.kod
            WHERE f.aktiv = 1
            ORDER BY f.nev
        `).all();

        res.json({ felhasznalok });
    } catch (error) {
        console.error('Hiba a felhasználók lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// WORKFLOW SABLONOK
// ============================================================================

// Összes workflow sablon lekérése (lépésekkel együtt)
router.get('/workflow-sablonok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { ugytipus_kod } = req.query;

        let sql = 'SELECT * FROM workflow_sablonok WHERE aktiv = 1';
        const params = [];

        if (ugytipus_kod) {
            sql += ' AND ugytipus_kod = ?';
            params.push(ugytipus_kod);
        }

        sql += ' ORDER BY megnevezes';

        const sablonok = db.prepare(sql).all(...params);

        // Minden sablonhoz lekérjük a lépéseket
        sablonok.forEach(sablon => {
            sablon.lepesek = db.prepare(`
                SELECT * FROM workflow_lepesek
                WHERE workflow_id = ?
                ORDER BY sorrend
            `).all(sablon.id);
        });

        res.json({ sablonok });
    } catch (error) {
        console.error('Hiba a workflow sablonok lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Egy workflow sablon lekérése (lépésekkel)
router.get('/workflow-sablonok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const sablon = db.prepare(`
            SELECT * FROM workflow_sablonok WHERE id = ?
        `).get(id);

        if (!sablon) {
            return res.status(404).json({ error: 'Workflow sablon nem található' });
        }

        // Lépések lekérése
        sablon.lepesek = db.prepare(`
            SELECT * FROM workflow_lepesek
            WHERE workflow_id = ?
            ORDER BY sorrend
        `).all(id);

        res.json(sablon);
    } catch (error) {
        console.error('Hiba a workflow sablon lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új workflow sablon létrehozása
router.post('/workflow-sablonok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { kod, megnevezes, ugytipus_kod, lepesek_szama, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            INSERT INTO workflow_sablonok (
                kod, megnevezes, ugytipus_kod, lepesek_szama, leiras, aktiv
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            kod,
            megnevezes,
            ugytipus_kod || null,
            lepesek_szama || 0,
            leiras || null,
            aktiv !== undefined ? (aktiv ? 1 : 0) : 1
        );

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Workflow sablon sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a workflow sablon létrehozásánál:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Ez a workflow kód már létezik' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Workflow sablon módosítása
router.put('/workflow-sablonok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { kod, megnevezes, ugytipus_kod, lepesek_szama, leiras, aktiv } = req.body;

        const stmt = db.prepare(`
            UPDATE workflow_sablonok
            SET kod = ?, megnevezes = ?, ugytipus_kod = ?, lepesek_szama = ?,
                leiras = ?, aktiv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(
            kod,
            megnevezes,
            ugytipus_kod || null,
            lepesek_szama || 0,
            leiras || null,
            aktiv ? 1 : 0,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Workflow sablon nem található' });
        }

        res.json({ message: 'Workflow sablon sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a workflow sablon frissítésénél:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Ez a workflow kód már létezik' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Workflow sablon törlése (soft delete + cascade lépések)
router.delete('/workflow-sablonok/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const stmt = db.prepare(`
            UPDATE workflow_sablonok
            SET aktiv = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Workflow sablon nem található' });
        }

        res.json({ message: 'Workflow sablon sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a workflow sablon törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// WORKFLOW LÉPÉSEK (nested resource)
// ============================================================================

// Workflow lépések lekérése
router.get('/workflow-sablonok/:workflow_id/lepesek', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { workflow_id } = req.params;

        const lepesek = db.prepare(`
            SELECT * FROM workflow_lepesek
            WHERE workflow_id = ?
            ORDER BY sorrend
        `).all(workflow_id);

        res.json({ lepesek });
    } catch (error) {
        console.error('Hiba a workflow lépések lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Új workflow lépés hozzáadása
router.post('/workflow-sablonok/:workflow_id/lepesek', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { workflow_id } = req.params;
        const { uce_kod, megnevezes, sorrend, kotelezo, hataridо_napok, felelos_szerepkor, leiras } = req.body;

        const stmt = db.prepare(`
            INSERT INTO workflow_lepesek (
                workflow_id, uce_kod, megnevezes, sorrend, kotelezo,
                hataridо_napok, felelos_szerepkor, leiras
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            workflow_id,
            uce_kod || null,
            megnevezes,
            sorrend,
            kotelezo !== undefined ? (kotelezo ? 1 : 0) : 1,
            hataridо_napok || null,
            felelos_szerepkor || null,
            leiras || null
        );

        // Lépések számának frissítése a sablonban
        db.prepare(`
            UPDATE workflow_sablonok
            SET lepesek_szama = (
                SELECT COUNT(*) FROM workflow_lepesek WHERE workflow_id = ?
            ),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(workflow_id, workflow_id);

        res.status(201).json({
            id: result.lastInsertRowid,
            message: 'Workflow lépés sikeresen létrehozva'
        });
    } catch (error) {
        console.error('Hiba a workflow lépés létrehozásánál:', error);
        res.status(500).json({ error: error.message });
    }
});

// Workflow lépés módosítása
router.put('/workflow-sablonok/:workflow_id/lepesek/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { workflow_id, id } = req.params;
        const { uce_kod, megnevezes, sorrend, kotelezo, hataridо_napok, felelos_szerepkor, leiras } = req.body;

        const stmt = db.prepare(`
            UPDATE workflow_lepesek
            SET uce_kod = ?, megnevezes = ?, sorrend = ?, kotelezo = ?,
                hataridо_napok = ?, felelos_szerepkor = ?, leiras = ?
            WHERE id = ? AND workflow_id = ?
        `);

        const result = stmt.run(
            uce_kod || null,
            megnevezes,
            sorrend,
            kotelezo ? 1 : 0,
            hataridо_napok || null,
            felelos_szerepkor || null,
            leiras || null,
            id,
            workflow_id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Workflow lépés nem található' });
        }

        res.json({ message: 'Workflow lépés sikeresen frissítve' });
    } catch (error) {
        console.error('Hiba a workflow lépés frissítésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Workflow lépés törlése
router.delete('/workflow-sablonok/:workflow_id/lepesek/:id', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { workflow_id, id } = req.params;

        const stmt = db.prepare(`
            DELETE FROM workflow_lepesek
            WHERE id = ? AND workflow_id = ?
        `);

        const result = stmt.run(id, workflow_id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Workflow lépés nem található' });
        }

        // Lépések számának frissítése a sablonban
        db.prepare(`
            UPDATE workflow_sablonok
            SET lepesek_szama = (
                SELECT COUNT(*) FROM workflow_lepesek WHERE workflow_id = ?
            ),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(workflow_id, workflow_id);

        res.json({ message: 'Workflow lépés sikeresen törölve' });
    } catch (error) {
        console.error('Hiba a workflow lépés törlésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// ÜGYTÍPUSOK
// ============================================================================

// Összes ügytípus lekérése
router.get('/ugytipusok', (req, res) => {
    try {
        const db = req.app.locals.db;
        const ugytipusok = db.prepare(`
            SELECT * FROM ugytipus
            WHERE aktiv = 1
            ORDER BY kod
        `).all();

        res.json({ ugytipusok });
    } catch (error) {
        console.error('Hiba az ügytípusok lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
