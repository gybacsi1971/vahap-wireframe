# VAHAP 2.0 Backend API

**Vasúti és Hajózási Integrált Hatósági Rendszer - Backend**

Node.js + Express + SQLite backend API a VAHAP drótvázhoz.

---

## 📋 Tartalom

- [Áttekintés](#áttekintés)
- [Technológiák](#technológiák)
- [Telepítés](#telepítés)
- [Használat](#használat)
- [API Dokumentáció](#api-dokumentáció)
- [Adatbázis](#adatbázis)
- [Fejlesztői útmutató](#fejlesztői-útmutató)

---

## 🎯 Áttekintés

A VAHAP Backend egy RESTful API, amely SQLite adatbázist használ az összes paraméterező, vasúti és hajózási modul adatainak kezelésére.

### Főbb funkciók

- ✅ Paraméterező modul teljes CRUD API
  - Ellenőrzési listák (F-0064, F-0065, F-0066)
  - Határidők
  - Díjtételek (F-0070)
  - Kedvezmények
  - Dokumentum sablonok (F-0091 - F-0095)
  - Szerepkörök és jogosultságok
  - Felhasználók

- ✅ Vasúti modul API
  - Ügyek kezelése
  - VNY024 nyilvántartás (F-0090)

- ✅ Hajózási modul API
  - Ügyek kezelése
  - HNY501 nyilvántartás (F-0106)

---

## 🛠️ Technológiák

- **Node.js** v18+ (v20 ajánlott)
- **Express** 4.x - Web framework
- **better-sqlite3** - SQLite driver (szinkron, gyors)
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Környezeti változók kezelése

---

## 📦 Telepítés

### 1. Node.js telepítése

```bash
# macOS (Homebrew)
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
# Töltsd le: https://nodejs.org/
```

### 2. Projekt klónozása

```bash
cd /path/to/VAHAP2/backend
```

### 3. Függőségek telepítése

```bash
npm install
```

### 4. Környezeti változók beállítása

Másold le a `.env.example` fájlt `.env` néven, és állítsd be az értékeket:

```bash
cp .env.example .env
```

`.env` tartalma:

```ini
PORT=3000
DB_PATH=./database/vahap.db
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
NODE_ENV=development
LOG_LEVEL=debug
```

### 5. Adatbázis inicializálása

```bash
# Adatbázis séma létrehozása
npm run db:init

# Tesztadatok feltöltése
npm run db:seed
```

### 6. Szerver indítása

```bash
# Produkciós mód
npm start

# Fejlesztői mód (auto-reload)
npm run dev
```

A szerver elindul a `http://localhost:3000` címen.

---

## 🚀 Használat

### Gyors teszt

```bash
# Health check
curl http://localhost:3000/api/health

# Díjtételek lekérése (V-044)
curl http://localhost:3000/api/parameterezo/dijtetelek/V-044

# Ellenőrzési lista (F-0064)
curl http://localhost:3000/api/parameterezo/ellenorzesi-listak/F-0064/kriteriumok
```

### NPM Scriptek

```bash
npm start          # Szerver indítása
npm run dev        # Dev mód (nodemon)
npm run db:init    # Adatbázis inicializálás
npm run db:seed    # Tesztadatok feltöltése
npm run db:reset   # Adatbázis újraindítás (init + seed)
```

---

## 📚 API Dokumentáció

### Alap URL

```
http://localhost:3000/api
```

### Endpointok

#### Általános

| Metódus | Endpoint        | Leírás            |
|---------|-----------------|-------------------|
| GET     | `/`             | API információk   |
| GET     | `/api/health`   | Health check      |

---

### Paraméterező Modul API

#### Ellenőrzési Listák (F-0064, F-0065, F-0066)

| Metódus | Endpoint                                              | Leírás                         |
|---------|-------------------------------------------------------|--------------------------------|
| GET     | `/api/parameterezo/ellenorzesi-listak`                | Összes lista                   |
| GET     | `/api/parameterezo/ellenorzesi-listak/:lista_kod/kriteriumok` | Lista kritériumai |
| POST    | `/api/parameterezo/ellenorzesi-listak/:lista_kod/kriteriumok` | Új kritérium       |
| PUT     | `/api/parameterezo/ellenorzesi-listak/:lista_kod/kriteriumok/:id` | Kritérium módosítása |
| DELETE  | `/api/parameterezo/ellenorzesi-listak/:lista_kod/kriteriumok/:id` | Kritérium törlése |

**Példa válasz** (GET `/api/parameterezo/ellenorzesi-listak/F-0064/kriteriumok`):

```json
{
  "lista": {
    "id": 1,
    "lista_kod": "F-0064",
    "megnevezes": "Hatáskör és illetékesség vizsgálat",
    "leiras": "UCE-1793, UCE-1987 használati esetekhez",
    "aktiv": 1
  },
  "kriteriumok": [
    {
      "id": 1,
      "lista_id": 1,
      "megnevezes": "Az ügytípus a megfelelő hatóság hatáskörébe tartozik",
      "leiras": "V-044: Vasúti Hatósági Főosztály...",
      "sorrend": 1,
      "kotelezo": 1,
      "aktiv": 1
    }
  ]
}
```

#### Határidők

| Metódus | Endpoint                          | Leírás                |
|---------|-----------------------------------|-----------------------|
| GET     | `/api/parameterezo/hataridok`     | Összes határidő       |
| POST    | `/api/parameterezo/hataridok`     | Új határidő           |
| PUT     | `/api/parameterezo/hataridok/:id` | Határidő módosítása   |
| DELETE  | `/api/parameterezo/hataridok/:id` | Határidő törlése      |

#### Díjtételek (F-0070)

| Metódus | Endpoint                                           | Leírás                    |
|---------|----------------------------------------------------|---------------------------|
| GET     | `/api/parameterezo/dijtetelek/:ugytipus_kod`       | Ügytípus díjtételei       |
| POST    | `/api/parameterezo/dijtetelek/:ugytipus_kod`       | Új díjtétel               |
| PUT     | `/api/parameterezo/dijtetelek/:ugytipus_kod/:id`   | Díjtétel módosítása       |
| DELETE  | `/api/parameterezo/dijtetelek/:ugytipus_kod/:id`   | Díjtétel törlése          |

**Példa válasz** (GET `/api/parameterezo/dijtetelek/V-044`):

```json
{
  "ugytipus": {
    "kod": "V-044",
    "megnevezes": "Vasúti járművezetők előzetes alkalmassági vizsgálata",
    "modul": "vasut",
    "jogszabaly": "123/2023. (XII. 15.) Korm. rendelet"
  },
  "dijak": [
    {
      "id": 1,
      "ugytipus_kod": "V-044",
      "megnevezes": "Előzetes alkalmassági vizsgálat alapdíja",
      "osszeg": 12000,
      "tipus": "alapdij",
      "kotelezo": 1
    }
  ],
  "kedvezmenyek": [
    {
      "id": 1,
      "ugytipus_kod": "V-044",
      "megnevezes": "Munkahelyi átképzés keretében",
      "szazalek": 30
    }
  ]
}
```

#### Kedvezmények

| Metódus | Endpoint                                            | Leírás                    |
|---------|-----------------------------------------------------|---------------------------|
| POST    | `/api/parameterezo/kedvezmenyek/:ugytipus_kod`      | Új kedvezmény             |
| PUT     | `/api/parameterezo/kedvezmenyek/:ugytipus_kod/:id`  | Kedvezmény módosítása     |
| DELETE  | `/api/parameterezo/kedvezmenyek/:ugytipus_kod/:id`  | Kedvezmény törlése        |

#### Dokumentum Sablonok (F-0091 - F-0095)

| Metódus | Endpoint                                   | Leírás                          |
|---------|--------------------------------------------|---------------------------------|
| GET     | `/api/parameterezo/dokumentum-sablonok`    | Összes sablon (szűrhető)        |
| GET     | `/api/parameterezo/dokumentum-sablonok/grouped` | Típusok szerint csoportosítva |

**Query paraméterek:**
- `tipus`: `vegzes`, `hatrozat`, `igazolas`, `tajekoztatas`, `hirdetmeny`
- `modul`: `vasut`, `hajozas`, `kozos`

#### Szerepkörök

| Metódus | Endpoint                          | Leírás                          |
|---------|-----------------------------------|---------------------------------|
| GET     | `/api/parameterezo/szerepkorok`   | Összes szerepkör jogosultságokkal |

#### Felhasználók

| Metódus | Endpoint                           | Leírás                    |
|---------|------------------------------------|---------------------------|
| GET     | `/api/parameterezo/felhasznalok`   | Összes felhasználó        |

---

### Vasúti Modul API

| Metódus | Endpoint                                | Leírás                         |
|---------|-----------------------------------------|--------------------------------|
| GET     | `/api/vasut/ugyek`                      | Összes vasúti ügy              |
| GET     | `/api/vasut/ugyek/:ugyazonosito`        | Egy ügy részletes adatai       |
| GET     | `/api/vasut/nyilvantartas/vny024`       | VNY024 nyilvántartás lekérdezés |

**Query paraméterek (VNY024):**
- `nev`: Név szerinti keresés
- `szuletesi_datum`: Születési dátum (YYYY-MM-DD)

---

### Hajózási Modul API

| Metódus | Endpoint                                | Leírás                           |
|---------|-----------------------------------------|----------------------------------|
| GET     | `/api/hajozas/ugyek`                    | Összes hajózási ügy              |
| GET     | `/api/hajozas/ugyek/:ugyazonosito`      | Egy ügy részletes adatai         |
| GET     | `/api/hajozas/nyilvantartas/hny501`     | HNY501 nyilvántartás lekérdezés  |

**Query paraméterek (HNY501):**
- `letesitmeny_neve`: Létesítmény neve szerinti keresés
- `uzemelteto`: Üzemeltető szerinti keresés

---

## 🗄️ Adatbázis

### Séma

Az adatbázis séma 26 táblát tartalmaz:

**Paraméterező:**
- `ugytipus`
- `ellenorzesi_lista`, `ellenorzesi_kriterium`
- `hataridok`
- `dijtetelek`, `kedvezmenyek`
- `dokumentum_sablonok`
- `workflow_sablonok`, `workflow_lepesek`
- `szerepkorok`, `jogosultsagok`
- `felhasznalok`

**Ügyek:**
- `ugyfelek`
- `ugyek`
- `ugy_elozmeny`
- `ugy_workflow_allapot`
- `dokumentumok`
- `dijkalkuklaciok`, `dijkalkulacio_tetelek`

**Nyilvántartások:**
- `vny024_nyilvantartas` (F-0090 - Vasúti)
- `hny501_nyilvantartas` (F-0106 - Hajózási)

**Rendszer:**
- `schema_version`
- `application_log`

### Adatbázis műveletek

```bash
# Adatbázis újraindítása (WARNING: törli az összes adatot!)
npm run db:reset

# Csak seed újrafuttatása
npm run db:seed

# Csak inicializálás
npm run db:init
```

### SQLite közvetlen elérés

```bash
# SQLite CLI megnyitása
sqlite3 backend/database/vahap.db

# Táblák listázása
.tables

# Adatok lekérdezése
SELECT * FROM dijtetelek WHERE ugytipus_kod = 'V-044';

# Kilépés
.quit
```

---

## 👨‍💻 Fejlesztői útmutató

### Projekt struktúra

```
backend/
├── server.js                 # Express szerver
├── package.json              # NPM konfiguráció
├── .env                      # Környezeti változók
├── database/
│   ├── init.sql             # Adatbázis séma
│   ├── seed.sql             # Tesztadatok
│   └── vahap.db             # SQLite adatbázis fájl
├── routes/
│   ├── parameterezo.js      # Paraméterező API
│   ├── vasut.js             # Vasúti API
│   └── hajozas.js           # Hajózási API
└── scripts/
    ├── init-db.js           # DB inicializáló script
    └── seed-db.js           # Seed script
```

### Új endpoint hozzáadása

1. **Route fájl szerkesztése** (`routes/parameterezo.js`)

```javascript
// Új endpoint hozzáadása
router.get('/uj-endpoint', (req, res) => {
    try {
        const db = req.app.locals.db;
        const adatok = db.prepare('SELECT * FROM tabla').all();
        res.json({ adatok });
    } catch (error) {
        console.error('Hiba:', error);
        res.status(500).json({ error: error.message });
    }
});
```

2. **Tesztelés**

```bash
curl http://localhost:3000/api/parameterezo/uj-endpoint
```

### Új tábla hozzáadása

1. **Séma módosítása** (`database/init.sql`)

```sql
CREATE TABLE IF NOT EXISTS uj_tabla (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    megnevezes TEXT NOT NULL,
    aktiv BOOLEAN DEFAULT 1
);
```

2. **Seed adatok** (`database/seed.sql`)

```sql
INSERT INTO uj_tabla (megnevezes, aktiv) VALUES
('Első elem', 1),
('Második elem', 1);
```

3. **Adatbázis újraindítása**

```bash
npm run db:reset
```

### Hibakeresés

```bash
# Console logok ellenőrzése
tail -f backend/console.log  # Ha van log fájl

# SQLite lekérdezés debug módban
# server.js verbose: console.log opció mutatja az SQL lekérdezéseket
```

---

## 🐛 Hibaelhárítás

### Port már használatban

```bash
# Meglévő folyamat leállítása
lsof -ti:3000 | xargs kill -9

# Vagy módosítsd a .env PORT értékét
```

### Adatbázis fájl nem található

```bash
# Futtasd újra az inicializálást
npm run db:init
npm run db:seed
```

### CORS hiba

Ellenőrizd a `.env` fájlban a `CORS_ORIGINS` értékét.

```ini
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

---

## 📝 Licensz

Ez egy belső fejlesztésű projekt a VAHAP rendszerhez.

---

## 🤝 Közreműködés

Kérjük kövesse a [CLAUDE.md](../CLAUDE.md) útmutatót a fejlesztés során.

---

## 📞 Kapcsolat

Kérdések esetén: admin@vahap.gov.hu
