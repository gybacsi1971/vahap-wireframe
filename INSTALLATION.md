# VAHAP 2.0 - Telepítési és Indítási Útmutató

Ez az útmutató végigvezet a VAHAP 2.0 SQLite Backend + Vue.js Frontend telepítésén és indításán.

---

## 📋 Rendszerkövetelmények

- **Node.js** v18+ (v20 ajánlott)
- **Python 3** (HTTP szerver futtatáshoz)
- **SQLite 3** (általában előre telepítve macOS/Linux-on)
- Modern böngésző (Chrome, Firefox, Safari, Edge - WebSocket és Fetch API támogatás)

---

## 🚀 Gyors Telepítés (5 lépés)

### 1. Projekt Klónozása / Letöltése

```bash
cd /path/to/VAHAP2
```

### 2. Backend Telepítése

```bash
# Navigálj a backend könyvtárba
cd backend

# NPM csomagok telepítése
npm install

# Környezeti változók beállítása
cp .env.example .env

# Szerkeszd a .env fájlt szükség esetén
# nano .env
```

###3. Adatbázis Inicializálása

```bash
# Adatbázis séma létrehozása (26 tábla)
npm run db:init

# Tesztadatok feltöltése
npm run db:seed
```

**Várható kimenet:**
```
✅ Adatbázis sikeresen létrehozva!
📊 Létrehozott táblák (26 db):
   - ugytipus
   - ellenorzesi_lista
   - ...

✅ Tesztadatok sikeresen feltöltve!
📊 Adatbázis statisztikák:
   Ügytípusok: 2 rekord
   Díjtételek: 10 rekord
   ...
```

### 4. Backend Indítása

```bash
# Még mindig a backend/ könyvtárban
npm start
```

**Várható kimenet:**
```
🚀 VAHAP Backend API elindult!
📡 Szerver: http://localhost:3000
🗄️  Adatbázis: ./database/vahap.db
🌐 CORS engedélyezett: http://localhost:8080,http://127.0.0.1:8080
```

**FONTOS:** Hagyd futni ezt a terminált! Nyiss egy új terminált a következő lépéshez.

### 5. Frontend Indítása

Új terminálban:

```bash
# Navigálj a vihar-system könyvtárba
cd vihar-system

# Python HTTP szerver indítása
python3 -m http.server 8080
```

**Várható kimenet:**
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

---

## ✅ Ellenőrzés

### Backend Teszt

Új terminálban:

```bash
# Health check
curl http://localhost:3000/api/health

# Várható válasz:
# {"status":"OK","timestamp":"...","database":"Connected","version":"1.0.0"}
```

### Frontend Teszt

Nyisd meg a böngészőben:

- **Főoldal:** http://localhost:8080
- **API Demo:** http://localhost:8080/api-demo.html
- **Paraméterező Díjtételek:** http://localhost:8080/parameterezo/dijtetelek.html

---

## 🎯 API Demo Használata

1. Nyisd meg: **http://localhost:8080/api-demo.html**
2. Ellenőrizd, hogy a jobb felső sarokban **"Backend Online"** zöld badge látható
3. Kattints a bal oldali menüben bármelyik API tesztre
4. Nézd meg a JSON válaszokat a jobb oldalon

**Elérhető tesztek:**
- ✅ Health Check
- ✅ Ellenőrzési Listák (F-0064, F-0065, F-0066)
- ✅ Díjtételek (V-044 Vasúti)
- ✅ Díjtételek (H-052 Hajózási)
- ✅ Határidők
- ✅ Vasúti Ügyek
- ✅ Hajózási Ügyek

---

## 🛑 Leállítás

### Backend Leállítása
```bash
# A backend terminálban: Ctrl+C

# VAGY minden backend példány leállítása:
lsof -ti:3000 | xargs kill -9
```

### Frontend Leállítása
```bash
# A frontend terminálban: Ctrl+C

# VAGY:
lsof -ti:8080 | xargs kill -9
```

---

## 🔄 Adatbázis Újraindítása

Ha el kell távolítani az összes adatot és újrakezdeni:

```bash
cd backend

# FIGYELEM: Ez TÖRLI az összes adatot!
npm run db:reset

# Ez egyenértékű az alábbival:
# npm run db:init && npm run db:seed
```

---

## 📁 Port Beállítások

### Backend Port Módosítása

Szerkeszd a `backend/.env` fájlt:

```ini
PORT=3000  # Változtasd meg pl. 3001-re
```

### Frontend Port Módosítása

```bash
# Másik port használata
python3 -m http.server 9000
```

**FONTOS:** Ha megváltoztatod a frontend portot, módosítsd a backend `.env` fájlban a CORS beállítást is:

```ini
CORS_ORIGINS=http://localhost:9000,http://127.0.0.1:9000
```

---

## 🐛 Hibaelhárítás

### "Port already in use" hiba

**Backend (3000):**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

**Frontend (8080):**
```bash
lsof -ti:8080 | xargs kill -9
python3 -m http.server 8080
```

### "Database not found" hiba

```bash
cd backend
npm run db:init
npm run db:seed
```

### "CORS error" a böngészőben

1. Ellenőrizd a `backend/.env` fájlt:
   ```ini
   CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
   ```

2. Indítsd újra a backend-et:
   ```bash
   cd backend
   npm start
   ```

### "Backend Offline" az API Demo oldalon

1. Ellenőrizd, hogy a backend fut-e:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. Ha nem fut, indítsd el:
   ```bash
   cd backend
   npm start
   ```

### "Cannot find module" hiba

```bash
cd backend
rm -rf node_modules
npm install
```

---

## 📊 Adatbázis Információk

### Közvetlen SQLite Elérés

```bash
# SQLite CLI megnyitása
sqlite3 backend/database/vahap.db

# Táblák listázása
.tables

# Példa lekérdezés
SELECT * FROM dijtetelek WHERE ugytipus_kod = 'V-044';

# Kilépés
.quit
```

### Adatbázis Statisztikák

```bash
cd backend
npm run db:seed
```

**Rekordok száma:**
- Ügytípusok: 2 db
- Ellenőrzési listák: 3 db
- Ellenőrzési kritériumok: 18 db
- Határidők: 10 db
- Díjtételek: 10 db
- Kedvezmények: 7 db
- Dokumentum sablonok: 12 db
- Workflow sablonok: 2 db
- Szerepkörök: 10 db
- Felhasználók: 7 db
- Ügyek: 3 db
- Ügyfelek: 3 db

---

## 🎓 Fejlesztői Mód

### Backend Auto-Reload (nodemon)

```bash
cd backend
npm run dev
```

Ez automatikusan újraindítja a szervert minden fájl módosításnál.

### API Tesztelés cURL-lel

```bash
# GET kérés
curl http://localhost:3000/api/parameterezo/hataridok

# POST kérés
curl -X POST http://localhost:3000/api/parameterezo/hataridok \
  -H "Content-Type: application/json" \
  -d '{"megnevezes":"Új határidő","napok":10,"tipus":"munkanap"}'

# PUT kérés
curl -X PUT http://localhost:3000/api/parameterezo/hataridok/1 \
  -H "Content-Type: application/json" \
  -d '{"megnevezes":"Módosított határidő","napok":15,"tipus":"munkanap","aktiv":1}'

# DELETE kérés
curl -X DELETE http://localhost:3000/api/parameterezo/hataridok/1
```

---

## 📚 További Dokumentáció

- **Backend API:** [backend/README.md](backend/README.md)
- **Frontend Migráció:** [backend/FRONTEND_MIGRATION.md](backend/FRONTEND_MIGRATION.md)
- **Fejlesztési Útmutató:** [CLAUDE.md](CLAUDE.md)
- **Projekt README:** [README.md](README.md)

---

## ✨ Sikeres Telepítés Ellenőrző Lista

- [ ] Node.js telepítve (v18+)
- [ ] Backend NPM csomagok telepítve
- [ ] Adatbázis inicializálva (26 tábla)
- [ ] Seed adatok feltöltve
- [ ] Backend fut (http://localhost:3000)
- [ ] Frontend fut (http://localhost:8080)
- [ ] Health check működik
- [ ] API Demo működik
- [ ] "Backend Online" zöld badge látható

**Ha minden pipálva van: SIKER! A VAHAP 2.0 rendszer használatra kész!** 🎉

---

**Verzió:** 1.0.0 (SQLite Backend)
**Utolsó frissítés:** 2025-10-18
**Kapcsolat:** admin@vahap.gov.hu
