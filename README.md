# VAHAP 2.0 - Vasúti és Hajózási Integrált Hatósági Rendszer

Kormányzati elektronikus ügykezelő rendszer drótvázának teljes implementációja **SQLite adatbázissal**.

---

## 🎯 Projekt Áttekintés

A VAHAP egy modern, integrált hatósági rendszer, amely:

- ✅ **Vasúti modul** (V-044) - Járművezetők alkalmassági vizsgálata
- ✅ **Hajózási modul** (H-052) - Kikötő létesítési engedélyezés
- ✅ **Paraméterező modul** - Rendszer konfigurálás (ellenőrzési listák, díjtételek, határidők, stb.)
- ✅ **SQLite Backend API** - Node.js + Express + better-sqlite3
- ✅ **Vue.js 3 Frontend** - Bootstrap 5 UI komponensek

---

## 🏗️ Architektúra

```
VAHAP2/
├── backend/                      # Node.js + Express + SQLite Backend
│   ├── server.js                # Express API szerver
│   ├── database/
│   │   ├── init.sql            # Adatbázis séma (26 tábla)
│   │   ├── seed.sql            # Tesztadatok
│   │   └── vahap.db            # SQLite adatbázis
│   ├── routes/
│   │   ├── parameterezo.js     # Paraméterező API
│   │   ├── vasut.js            # Vasúti modul API
│   │   └── hajozas.js          # Hajózási modul API
│   └── scripts/
│       ├── init-db.js          # Adatbázis inicializálás
│       └── seed-db.js          # Seed adatok betöltése
│
├── vihar-system/                # Frontend (Vue.js 3 + Bootstrap 5)
│   ├── index.html              # Főoldal
│   ├── assets/
│   │   ├── js/
│   │   │   ├── vihar-config.js          # Konfiguráció
│   │   │   ├── vihar-common.js          # Közös funkciók
│   │   │   ├── vihar-api-config.js      # API helper (ÚJ!)
│   │   │   ├── vihar-mock-data.js       # Mock adatok (legacy)
│   │   │   └── vihar-components.js      # Vue komponensek
│   │   └── css/
│   │       └── vihar-common.css         # Közös stílusok
│   ├── vasut/                   # Vasúti modul
│   │   ├── kulso/              # Ügyfél felület
│   │   └── belso/              # Ügyintéző felület
│   ├── hajozas/                 # Hajózási modul
│   │   ├── kulso/              # Ügyfél felület
│   │   └── belso/              # Ügyintéző felület
│   └── parameterezo/            # Paraméterező modul (Admin)
│       ├── index.html           # Dashboard
│       ├── ellenorzesi-listak.html  # F-0064, F-0065, F-0066
│       ├── hataridok.html       # Határidő kezelés
│       ├── dijtetelek.html      # F-0070, F-0082 Díjkalkulátor
│       ├── dokumentum-sablonok.html # F-0091-095
│       └── workflow-sablonok.html   # Workflow kezelés
│
└── spec/                        # Specifikációk és dokumentáció
    ├── VAHAP Vasúti Modul Logikai Specifikáció.md
    ├── VAHAP Hajózási Modul Logikai Specifikáció.md
    └── design.md
```

---

## 🚀 Gyors Indítás

### 1. Előfeltételek

- **Node.js** v18+ (v20 ajánlott)
- **SQLite** (általában előre telepítve macOS/Linux-on)
- Modern böngésző (Chrome, Firefox, Safari, Edge)

### 2. Backend Telepítés

```bash
# Navigálj a backend könyvtárba
cd backend

# NPM csomagok telepítése
npm install

# Környezeti változók beállítása
cp .env.example .env

# Adatbázis inicializálása
npm run db:init

# Tesztadatok feltöltése
npm run db:seed

# Backend indítása
npm start
```

A backend elindul a `http://localhost:3000` címen.

### 3. Frontend Indítása

```bash
# Python HTTP szerver (egyszerű megoldás)
cd vihar-system
python3 -m http.server 8080

# VAGY használj bármilyen más statikus fájl szervert
# npx serve vihar-system -p 8080
```

A frontend elérhető a `http://localhost:8080` címen.

### 4. Tesztelés

Nyisd meg a böngészőt:

- **Főoldal:** http://localhost:8080
- **Paraméterező Díjtételek:** http://localhost:8080/parameterezo/dijtetelek.html
- **Backend Health Check:** http://localhost:3000/api/health

---

## 📊 Adatbázis

### Adatbázis Struktúra (26 tábla)

#### Paraméterező Modul
- `ugytipus` - Ügytípusok (V-044, H-052)
- `ellenorzesi_lista`, `ellenorzesi_kriterium` - F-0064, F-0065, F-0066
- `hataridok` - Határidő paraméterek
- `dijtetelek`, `kedvezmenyek` - F-0070 Díjkalkulátor
- `dokumentum_sablonok` - F-0091-095 Sablonok
- `workflow_sablonok`, `workflow_lepesek` - Workflow kezelés
- `szerepkorok`, `jogosultsagok` - Jogosultság kezelés
- `felhasznalok` - Felhasználók

#### Ügyek Kezelése
- `ugyfelek` - Ügyféladatok
- `ugyek` - Ügyek
- `ugy_elozmeny` - Ügy előzmények (timeline)
- `ugy_workflow_allapot` - Workflow állapotok
- `dokumentumok` - Dokumentumok
- `dijkalkuklaciok`, `dijkalkulacio_tetelek` - F-0070 Díjkalkulációk

#### Nyilvántartások
- `vny024_nyilvantartas` - F-0090 Vasútegészségügyi
- `hny501_nyilvantartas` - F-0106 Hajózási létesítmények

#### Rendszer
- `schema_version` - Verzió követés
- `application_log` - Alkalmazás naplók

### Adatok Statisztikák

```bash
# Tesztadatok:
- Ügytípusok: 2 db (V-044, H-052)
- Ellenőrzési listák: 3 db (F-0064, F-0065, F-0066)
- Ellenőrzési kritériumok: 18 db
- Határidők: 10 db
- Díjtételek: 10 db (5 vasúti + 5 hajózási)
- Kedvezmények: 7 db (4 vasúti + 3 hajózási)
- Dokumentum sablonok: 12 db
- Workflow sablonok: 2 db (vasúti + hajózási)
- Workflow lépések: 26 db
- Szerepkörök: 10 db
- Jogosultságok: 29 db
- Felhasználók: 7 db
- Ügyfelek: 3 db
- Ügyek: 3 db
```

---

## 🔌 Backend API

Teljes RESTful API az összes funkcióhoz. Részletes dokumentáció: [backend/README.md](backend/README.md)

**Főbb endpointok:**

```
GET  /api/health                                      # Health check
GET  /api/parameterezo/dijtetelek/V-044              # Díjtételek
GET  /api/parameterezo/ellenorzesi-listak/F-0064/kriteriumok  # Kritériumok
GET  /api/vasut/ugyek                                 # Vasúti ügyek
GET  /api/hajozas/ugyek                               # Hajózási ügyek
```

---

## 📖 Dokumentáció

- **[Backend README](backend/README.md)** - API dokumentáció
- **[Frontend Migráció](backend/FRONTEND_MIGRATION.md)** - Mock → API átállás
- **[CLAUDE.md](CLAUDE.md)** - Fejlesztési útmutató
- **[Vasúti Specifikáció](spec/VAHAP%20Vasúti%20Modul%20Logikai%20Specifikáció.md)**
- **[Hajózási Specifikáció](spec/VAHAP%20Hajózási%20Modul%20Logikai%20Specifikáció.md)**

---

## 🤝 Közreműködés

Kérjük kövesse a [CLAUDE.md](CLAUDE.md) útmutatót a fejlesztés során.

---

**Verzió:** 1.0.0 (SQLite Backend)
**Utolsó frissítés:** 2025-10-18
**Kapcsolat:** admin@vahap.gov.hu
