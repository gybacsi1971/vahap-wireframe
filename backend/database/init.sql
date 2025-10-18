-- ============================================================================
-- VAHAP 2.0 - Vasúti és Hajózási Hatósági Rendszer
-- SQLite Adatbázis Séma
-- ============================================================================
-- Verzió: 1.0
-- Dátum: 2025-10-18
-- Leírás: Teljes adatbázis struktúra a VAHAP rendszerhez
-- ============================================================================

-- ====================
-- PARAMÉTEREZŐ MODUL
-- ====================

-- Ügytípusok (V-044, H-052)
CREATE TABLE IF NOT EXISTS ugytipus (
    kod TEXT PRIMARY KEY,                           -- 'V-044', 'H-052'
    megnevezes TEXT NOT NULL,
    modul TEXT CHECK(modul IN ('vasut', 'hajozas')) NOT NULL,
    jogszabaly TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ellenőrzési listák (F-0064, F-0065, F-0066)
CREATE TABLE IF NOT EXISTS ellenorzesi_lista (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lista_kod TEXT UNIQUE NOT NULL,                 -- 'F-0064', 'F-0065', 'F-0066'
    megnevezes TEXT NOT NULL,
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ellenorzesi_kriterium (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lista_id INTEGER NOT NULL,
    megnevezes TEXT NOT NULL,
    leiras TEXT,
    sorrend INTEGER NOT NULL DEFAULT 0,
    kotelezo BOOLEAN DEFAULT 0,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lista_id) REFERENCES ellenorzesi_lista(id) ON DELETE CASCADE
);

-- Index az ellenőrzési kritériumokhoz
CREATE INDEX IF NOT EXISTS idx_kriterium_lista ON ellenorzesi_kriterium(lista_id);
CREATE INDEX IF NOT EXISTS idx_kriterium_sorrend ON ellenorzesi_kriterium(lista_id, sorrend);

-- Határidők
CREATE TABLE IF NOT EXISTS hataridok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    megnevezes TEXT NOT NULL,
    kod TEXT UNIQUE,                                -- 'HAT-001', opcionális
    napok INTEGER NOT NULL,
    tipus TEXT CHECK(tipus IN ('munkanap', 'naptari')) DEFAULT 'munkanap',
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Díjtételek (F-0070)
CREATE TABLE IF NOT EXISTS dijtetelek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugytipus_kod TEXT NOT NULL,
    megnevezes TEXT NOT NULL,
    osszeg INTEGER NOT NULL,                        -- Forintban
    tipus TEXT CHECK(tipus IN ('alapdij', 'potdij')) DEFAULT 'potdij',
    kotelezo BOOLEAN DEFAULT 0,
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugytipus_kod) REFERENCES ugytipus(kod) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dijtetelek_ugytipus ON dijtetelek(ugytipus_kod);

-- Kedvezmények
CREATE TABLE IF NOT EXISTS kedvezmenyek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugytipus_kod TEXT NOT NULL,
    megnevezes TEXT NOT NULL,
    szazalek INTEGER NOT NULL CHECK(szazalek >= 0 AND szazalek <= 100),
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugytipus_kod) REFERENCES ugytipus(kod) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_kedvezmenyek_ugytipus ON kedvezmenyek(ugytipus_kod);

-- Dokumentum sablonok (F-0091 - F-0095)
CREATE TABLE IF NOT EXISTS dokumentum_sablonok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kod TEXT UNIQUE NOT NULL,                       -- 'V-VGZ-001', 'H-HAT-002'
    megnevezes TEXT NOT NULL,
    tipus TEXT CHECK(tipus IN ('vegzes', 'hatrozat', 'igazolas', 'tajekoztatas', 'hirdetmeny')) NOT NULL,
    modul TEXT CHECK(modul IN ('vasut', 'hajozas', 'kozos')),
    sablon_fajl TEXT,                               -- Fájl elérési út
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dokumentum_tipus ON dokumentum_sablonok(tipus);

-- Workflow sablonok
CREATE TABLE IF NOT EXISTS workflow_sablonok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kod TEXT UNIQUE NOT NULL,                       -- 'WF-V044-001'
    megnevezes TEXT NOT NULL,
    ugytipus_kod TEXT,
    lepesek_szama INTEGER,
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugytipus_kod) REFERENCES ugytipus(kod) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS workflow_lepesek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,
    uce_kod TEXT,                                   -- 'UCE-1987'
    megnevezes TEXT NOT NULL,
    sorrend INTEGER NOT NULL,
    kotelezo BOOLEAN DEFAULT 1,
    hataridő_napok INTEGER,
    felelős_szerepkor TEXT,
    leiras TEXT,
    FOREIGN KEY (workflow_id) REFERENCES workflow_sablonok(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflow_lepesek ON workflow_lepesek(workflow_id, sorrend);

-- Szerepkörök
CREATE TABLE IF NOT EXISTS szerepkorok (
    kod TEXT PRIMARY KEY,                           -- 'VHF_ADMIN', 'VHF_UGYINTEZO'
    nev TEXT NOT NULL,
    leiras TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jogosultságok
CREATE TABLE IF NOT EXISTS jogosultsagok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    szerepkor_kod TEXT NOT NULL,
    jogosultsag TEXT NOT NULL,                      -- 'kerelem_vizsgalat', 'formai_ellenorzes'
    leiras TEXT,
    FOREIGN KEY (szerepkor_kod) REFERENCES szerepkorok(kod) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_jogosultsagok_szerepkor ON jogosultsagok(szerepkor_kod);

-- Felhasználók
CREATE TABLE IF NOT EXISTS felhasznalok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    azonosito TEXT UNIQUE NOT NULL,                 -- 'EKM001'
    nev TEXT NOT NULL,
    email TEXT,
    telefonszam TEXT,
    beosztas TEXT,
    szervezet TEXT,
    szervezeti_egyseg TEXT,
    szerepkor_kod TEXT,
    aktiv BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (szerepkor_kod) REFERENCES szerepkorok(kod) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_felhasznalok_szerepkor ON felhasznalok(szerepkor_kod);

-- ====================
-- ÜGYEK ÉS WORKFLOW
-- ====================

-- Ügyfelek
CREATE TABLE IF NOT EXISTS ugyfelek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nev TEXT NOT NULL,
    szuletesi_nev TEXT,
    szuletesi_hely TEXT,
    szuletesi_datum DATE,
    anya_neve TEXT,
    lakcim_iranyitoszam TEXT,
    lakcim_telepules TEXT,
    lakcim_kozterulet TEXT,
    lakcim_hazszam TEXT,
    ertesitesi_cim_iranyitoszam TEXT,
    ertesitesi_cim_telepules TEXT,
    ertesitesi_cim_kozterulet TEXT,
    ertesitesi_cim_hazszam TEXT,
    telefonszam TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ügyek
CREATE TABLE IF NOT EXISTS ugyek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugyazonosito TEXT UNIQUE NOT NULL,              -- 'VAHAP-V-2024-001234'
    ugytipus_kod TEXT NOT NULL,
    ugyfel_id INTEGER NOT NULL,
    statusz TEXT NOT NULL,                          -- 'beerkezett', 'folyamatban', 'lezart', stb.
    benyujtas_datum DATE,
    hatarido DATE,
    lezaras_datum DATE,
    ugyintezo_id INTEGER,
    workflow_sablon_id INTEGER,
    megjegyzesek TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugytipus_kod) REFERENCES ugytipus(kod),
    FOREIGN KEY (ugyfel_id) REFERENCES ugyfelek(id),
    FOREIGN KEY (ugyintezo_id) REFERENCES felhasznalok(id) ON DELETE SET NULL,
    FOREIGN KEY (workflow_sablon_id) REFERENCES workflow_sablonok(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ugyek_statusz ON ugyek(statusz);
CREATE INDEX IF NOT EXISTS idx_ugyek_ugyintezo ON ugyek(ugyintezo_id);
CREATE INDEX IF NOT EXISTS idx_ugyek_ugytipus ON ugyek(ugytipus_kod);

-- Ügy előzmények (timeline)
CREATE TABLE IF NOT EXISTS ugy_elozmeny (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER NOT NULL,
    datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    esemeny_tipus TEXT NOT NULL,                    -- 'statusz_valtas', 'megjegyzes', 'dokumentum', stb.
    leiras TEXT NOT NULL,
    regi_ertek TEXT,
    uj_ertek TEXT,
    felhasznalo_id INTEGER,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE CASCADE,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_elozmeny_ugy ON ugy_elozmeny(ugy_id, datum DESC);

-- Workflow példányok (egy ügy aktuális workflow állapota)
CREATE TABLE IF NOT EXISTS ugy_workflow_allapot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER NOT NULL,
    workflow_lepes_id INTEGER NOT NULL,
    statusz TEXT CHECK(statusz IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
    kezdes_datum DATETIME,
    befejezес_datum DATETIME,
    felelős_id INTEGER,
    megjegyzesek TEXT,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE CASCADE,
    FOREIGN KEY (workflow_lepes_id) REFERENCES workflow_lepesek(id),
    FOREIGN KEY (felelős_id) REFERENCES felhasznalok(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_workflow_allapot_ugy ON ugy_workflow_allapot(ugy_id);

-- Dokumentumok
CREATE TABLE IF NOT EXISTS dokumentumok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER NOT NULL,
    dokumentum_sablon_id INTEGER,
    megnevezes TEXT NOT NULL,
    fajlnev TEXT,
    fajl_utvonal TEXT,
    fajl_meret INTEGER,                             -- byte-okban
    mime_tipus TEXT,
    tipus TEXT,                                     -- 'kerelem', 'vegzes', 'hatrozat', stb.
    verzio INTEGER DEFAULT 1,
    statusz TEXT,                                   -- 'tervezet', 'vegleges', 'archivalt'
    feltolto_id INTEGER,
    feltoltes_datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE CASCADE,
    FOREIGN KEY (dokumentum_sablon_id) REFERENCES dokumentum_sablonok(id) ON DELETE SET NULL,
    FOREIGN KEY (feltolto_id) REFERENCES felhasznalok(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_dokumentumok_ugy ON dokumentumok(ugy_id);

-- Díjkalkulációk (F-0070)
CREATE TABLE IF NOT EXISTS dijkalkuklaciok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER NOT NULL,
    alapdij INTEGER NOT NULL DEFAULT 0,
    potdijak INTEGER NOT NULL DEFAULT 0,
    kedvezmeny_id INTEGER,
    kedvezmeny_osszeg INTEGER NOT NULL DEFAULT 0,
    vegosszeg INTEGER NOT NULL,
    statusz TEXT,                                   -- 'tervezet', 'generalt', 'kifizetve'
    generalasDatum DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE CASCADE,
    FOREIGN KEY (kedvezmeny_id) REFERENCES kedvezmenyek(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dijkalkulacio_tetelek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dijkalkulacio_id INTEGER NOT NULL,
    dijtetel_id INTEGER NOT NULL,
    osszeg INTEGER NOT NULL,
    FOREIGN KEY (dijkalkulacio_id) REFERENCES dijkalkuklaciok(id) ON DELETE CASCADE,
    FOREIGN KEY (dijtetel_id) REFERENCES dijtetelek(id)
);

-- ====================
-- NYILVÁNTARTÁSOK
-- ====================

-- Vasútegészségügyi Nyilvántartás (F-0090 - VNY024)
CREATE TABLE IF NOT EXISTS vny024_nyilvantartas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER,
    nev TEXT NOT NULL,
    szuletesi_datum DATE,
    vizsgalat_tipusa TEXT,
    vizsgalat_eredmeny TEXT,
    ervenyesseg_kezdete DATE,
    ervenyesseg_vege DATE,
    megjegyzesek TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE SET NULL
);

-- Hajózási Létesítmények Nyilvántartása (F-0106 - HNY501)
CREATE TABLE IF NOT EXISTS hny501_nyilvantartas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ugy_id INTEGER,
    letesitmeny_neve TEXT NOT NULL,
    letesitmeny_tipus TEXT,
    helyszin TEXT,
    uzemelteto TEXT,
    engedelyszam TEXT,
    ervenyesseg_kezdete DATE,
    ervenyesseg_vege DATE,
    megjegyzesek TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ugy_id) REFERENCES ugyek(id) ON DELETE SET NULL
);

-- ====================
-- RENDSZER TÁBLÁK
-- ====================

-- Adatbázis verziózás
CREATE TABLE IF NOT EXISTS schema_version (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Alkalmazás naplózás
CREATE TABLE IF NOT EXISTS application_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    level TEXT CHECK(level IN ('INFO', 'WARNING', 'ERROR', 'DEBUG')),
    modul TEXT,
    uzenet TEXT,
    felhasznalo_id INTEGER,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_log_timestamp ON application_log(timestamp DESC);

-- ====================
-- INITIAL VERSION
-- ====================

INSERT INTO schema_version (version, description) VALUES ('1.0', 'Kezdeti adatbázis séma');

-- ====================
-- VÉGÜL
-- ====================

-- Vacuum optimalizálás
VACUUM;

-- Analyze statisztikák
ANALYZE;
