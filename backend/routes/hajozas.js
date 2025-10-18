/**
 * VAHAP Hajózási Modul API Route-ok
 *
 * Hajózási modul specifikus endpointok
 */

const express = require('express');
const router = express.Router();

// ============================================================================
// ÜGYEK
// ============================================================================

// Összes hajózási ügy lekérése
router.get('/ugyek', (req, res) => {
    try {
        const db = req.app.locals.db;

        const ugyek = db.prepare(`
            SELECT u.*, ug.nev as ugyfel_nev, f.nev as ugyintezo_nev
            FROM ugyek u
            LEFT JOIN ugyfelek ug ON u.ugyfel_id = ug.id
            LEFT JOIN felhasznalok f ON u.ugyintezo_id = f.id
            WHERE u.ugytipus_kod LIKE 'H-%'
            ORDER BY u.benyujtas_datum DESC
        `).all();

        res.json({ ugyek });
    } catch (error) {
        console.error('Hiba az ügyek lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// Egy ügy részletes adatai
router.get('/ugyek/:ugyazonosito', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { ugyazonosito } = req.params;

        const ugy = db.prepare(`
            SELECT u.*, ug.*, f.nev as ugyintezo_nev
            FROM ugyek u
            LEFT JOIN ugyfelek ug ON u.ugyfel_id = ug.id
            LEFT JOIN felhasználók f ON u.ugyintezo_id = f.id
            WHERE u.ugyazonosito = ?
        `).get(ugyazonosito);

        if (!ugy) {
            return res.status(404).json({ error: 'Ügy nem található' });
        }

        // Előzmények
        const elozmények = db.prepare(`
            SELECT e.*, f.nev as felhasznalo_nev
            FROM ugy_elozmeny e
            LEFT JOIN felhasznalok f ON e.felhasznalo_id = f.id
            WHERE e.ugy_id = ?
            ORDER BY e.datum DESC
        `).all(ugy.id);

        res.json({ ugy, elozmények });
    } catch (error) {
        console.error('Hiba az ügy lekérésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// HNY501 NYILVÁNTARTÁS (F-0106)
// ============================================================================

// HNY501 lekérdezés
router.get('/nyilvantartas/hny501', (req, res) => {
    try {
        const db = req.app.locals.db;
        const { letesitmeny_neve, uzemelteto } = req.query;

        let sql = 'SELECT * FROM hny501_nyilvantartas WHERE 1=1';
        const params = [];

        if (letesitmeny_neve) {
            sql += ' AND letesitmeny_neve LIKE ?';
            params.push(`%${letesitmeny_neve}%`);
        }

        if (uzemelteto) {
            sql += ' AND uzemelteto LIKE ?';
            params.push(`%${uzemelteto}%`);
        }

        sql += ' ORDER BY ervenyesseg_vege DESC';

        const eredmenyek = db.prepare(sql).all(...params);

        res.json({ eredmenyek });
    } catch (error) {
        console.error('Hiba a HNY501 lekérdezésénél:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
