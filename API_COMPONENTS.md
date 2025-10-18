# VAHAP - API Komponensek Összefoglalója

## 📋 Áttekintés

Ez a dokumentum bemutatja a VAHAP rendszer **API-alapú Vue.js komponenseit**, amelyek a **SQLite backend**-et használják perzisztens adattárolásra.

---

## ✅ Elkészült API Komponensek

### 1. ParamHataridokAPI - Határidők Kezelő

**Fájl:** `vihar-system/assets/js/components/parameterezo/param-hataridok-api.js`

**Demo oldal:** `vihar-system/parameterezo/hataridok-api-demo.html`

**Funkciók:**
- ✅ Határidők listázása (GET)
- ✅ Új határidő létrehozása (POST)
- ✅ Határidő szerkesztése (PUT)
- ✅ Határidő törlése (DELETE / soft delete)
- ✅ Statisztikák (összes, aktív, inaktív)
- ✅ Típus szerinti szűrés (munkanap, naptári nap, óra)

**API Endpointok:**
```
GET     /api/parameterezo/hataridok
POST    /api/parameterezo/hataridok
PUT     /api/parameterezo/hataridok/:id
DELETE  /api/parameterezo/hataridok/:id
```

**Adatmodell:**
```javascript
{
    id: Number,           // AUTO_INCREMENT
    megnevezes: String,   // Határidő neve
    kod: String,          // Egyedi kód (pl. HAT-001)
    napok: Number,        // Napok száma
    tipus: String,        // 'munkanap' | 'naptari_nap' | 'ora'
    leiras: String,       // Leírás (opcionális)
    aktiv: Boolean,       // Aktív/inaktív
    created_at: DateTime,
    updated_at: DateTime
}
```

**Használat:**
```html
<param-hataridok-api @change="onComponentChange"></param-hataridok-api>
```

---

### 2. ParamDijtételekAPI - Díjtételek és Díjkalkulátor

**Fájl:** `vihar-system/assets/js/components/parameterezo/param-dijtetelek-api.js`

**Demo oldal:** `vihar-system/parameterezo/dijtetelek-api-demo.html`

**Funkciók:**
- ✅ Díjtételek listázása ügytípus szerint (GET)
- ✅ Új díj létrehozása (POST)
- ✅ Díj szerkesztése (PUT)
- ✅ Díj törlése (DELETE / soft delete)
- ✅ Kedvezmények kezelése (CRUD)
- ✅ **F-0070 Díjkalkulátor** - Interaktív díjszámítás
- ✅ **F-0082 Díjbekérő generálás** - PDF mock
- ✅ Statisztikák (összes, alapdíj, pótdíj, kedvezmények)
- ✅ Ügytípus váltás (V-044, H-052)

**API Endpointok:**
```
GET     /api/parameterezo/dijtetelek/:ugytipusKod
POST    /api/parameterezo/dijtetelek/:ugytipusKod
PUT     /api/parameterezo/dijak/:id
DELETE  /api/parameterezo/dijak/:id

GET     /api/parameterezo/kedvezmenyek/:ugytipusKod
POST    /api/parameterezo/kedvezmenyek/:ugytipusKod
PUT     /api/parameterezo/kedvezmenyek/:id
DELETE  /api/parameterezo/kedvezmenyek/:id

GET     /api/parameterezo/ugytipusok
```

**Adatmodell - Díjak:**
```javascript
{
    id: Number,           // AUTO_INCREMENT
    ugytipus_id: Number,  // Foreign key → ugytipus
    ugytipus_kod: String, // V-044 vagy H-052
    megnevezes: String,   // Díj neve
    osszeg: Number,       // Forintban
    tipus: String,        // 'alapdij' | 'potdij'
    kotelezo: Boolean,    // Kötelező díj?
    leiras: String,       // Leírás (opcionális)
    aktiv: Boolean,
    created_at: DateTime,
    updated_at: DateTime
}
```

**Adatmodell - Kedvezmények:**
```javascript
{
    id: Number,           // AUTO_INCREMENT
    ugytipus_id: Number,  // Foreign key → ugytipus
    megnevezes: String,   // Kedvezmény neve
    szazalek: Number,     // Kedvezmény % (0-100)
    aktiv: Boolean,
    created_at: DateTime,
    updated_at: DateTime
}
```

**Díjkalkulátor használat:**
```javascript
// Kalkulátor megnyitása
calculatorAlapdij     // Alapdíjak összege
calculatorPotdij      // Pótdíjak összege
calculatorKedvezmeny  // Választott kedvezmény
calculatorKedvezmenyOsszeg  // Kedvezmény Ft-ban
calculatorVegosszeg   // Végösszeg
```

**Használat:**
```html
<param-dijtetelek-api
    :ugytipus="selectedUgytipus"
    @change="onComponentChange">
</param-dijtetelek-api>
```

---

## 🏗️ Komponens Architektúra

### Közös Jellemzők (minden API komponens)

#### 1. Data tulajdonságok
```javascript
data() {
    return {
        // API állapotkezelés
        loading: false,      // Betöltés folyamatban?
        error: null,         // Hiba üzenet

        // Adatok
        items: [],           // Komponens-specifikus adat

        // UI állapot
        hasChanges: false,   // Változás történt?
        showEditor: false,   // Modal megnyitva?
        editMode: 'create',  // 'create' | 'edit'
        selectedItem: null   // Kiválasztott elem
    };
}
```

#### 2. Metódusok
```javascript
// CRUD műveletek (aszinkron)
async loadItems()         // GET - Betöltés
async createItem(item)    // POST - Létrehozás
async updateItem(id, item)// PUT - Módosítás
async deleteItem(id)      // DELETE - Törlés (soft)

// UI műveletek
openCreateDialog()        // Új elem modal
editItem(item)            // Szerkesztés modal
closeEditor()             // Modal bezárás
saveItem()                // Mentés végrehajtás
```

#### 3. Lifecycle
```javascript
async mounted() {
    await this.loadItems();  // Betöltés mount-kor
}

watch: {
    propName() {
        this.loadItems();    // Újratöltés prop változáskor
    }
}
```

#### 4. Template struktúra
```html
<div>
    <!-- Betöltés jelző -->
    <div v-if="loading">...</div>

    <!-- Hiba üzenet -->
    <div v-else-if="error">...</div>

    <!-- Tartalom -->
    <div v-else>
        <!-- Statisztikák -->
        <!-- Műveletek -->
        <!-- Táblázat / Lista -->
    </div>

    <!-- Modal szerkesztő -->
    <div v-if="showEditor">...</div>
</div>
```

---

## 📊 API Hívások Mintái

### GET - Betöltés
```javascript
async loadData() {
    this.loading = true;
    this.error = null;

    try {
        const response = await VAHAP_API.get(
            VAHAP_API.endpoints.parameterezo.hataridok
        );

        if (response && response.hataridok) {
            this.hataridok = response.hataridok;
        } else {
            throw new Error('Érvénytelen API válasz');
        }

    } catch (err) {
        console.error('[Component] Hiba:', err);
        this.error = `Hiba a betöltés során: ${err.message}`;
        this.hataridok = [];
    } finally {
        this.loading = false;
    }
}
```

### POST - Létrehozás
```javascript
async createItem(item) {
    this.loading = true;
    this.error = null;

    try {
        const response = await VAHAP_API.post(
            VAHAP_API.endpoints.parameterezo.hataridok,
            item
        );

        // ✅ KRITIKUS: Újratöltés a szerverről
        await this.loadData();

        this.hasChanges = true;
        this.$emit('change', { action: 'create', data: response });

        return response;

    } catch (err) {
        console.error('[Component] Hiba:', err);
        this.error = `Hiba a létrehozás során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

### PUT - Módosítás
```javascript
async updateItem(id, item) {
    this.loading = true;
    this.error = null;

    try {
        const response = await VAHAP_API.put(
            VAHAP_API.endpoints.parameterezo.hataridoById(id),
            item
        );

        // ✅ KRITIKUS: Újratöltés a szerverről
        await this.loadData();

        this.hasChanges = true;
        this.$emit('change', { action: 'update', data: response });

        return response;

    } catch (err) {
        console.error('[Component] Hiba:', err);
        this.error = `Hiba a módosítás során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

### DELETE - Törlés
```javascript
async deleteItem(id) {
    if (!confirm('Biztosan törli?')) {
        return;
    }

    this.loading = true;
    this.error = null;

    try {
        const response = await VAHAP_API.delete(
            VAHAP_API.endpoints.parameterezo.hataridoById(id)
        );

        // ✅ KRITIKUS: Újratöltés a szerverről
        await this.loadData();

        this.hasChanges = true;
        this.$emit('change', { action: 'delete', data: { id } });

        return response;

    } catch (err) {
        console.error('[Component] Hiba:', err);
        this.error = `Hiba a törlés során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

---

## 🎯 Következő Komponensek (Tervezett)

### 3. ParamEllenorzesiListakAPI
- Ellenőrzési listák kezelése (F-0064, F-0065, F-0066)
- Kritériumok CRUD
- Többszintű hierarchia

### 4. ParamDokumentumSablonokAPI
- Dokumentum sablonok (F-0091-095)
- Típus szerinti csoportosítás (végzés, határozat, igazolás, stb.)
- Read-only (szerkesztés később)

### 5. ParamWorkflowSablonokAPI
- Workflow sablonok
- Workflow lépések CRUD
- Többtáblás kapcsolat

---

## 📚 Használati Útmutató

### Backend Indítása
```bash
cd backend
npm start
# Backend fut: http://localhost:3000
```

### Frontend Indítása
```bash
cd vihar-system
python3 -m http.server 8080
# Frontend fut: http://localhost:8080
```

### Demo Oldalak Tesztelése

1. **Határidők API Demo:**
   - URL: http://localhost:8080/parameterezo/hataridok-api-demo.html
   - Tesztek: Létrehozás, szerkesztés, törlés
   - Ellenőrizd: Adatok megmaradnak újratöltés után

2. **Díjtételek API Demo:**
   - URL: http://localhost:8080/parameterezo/dijtetelek-api-demo.html
   - Tesztek:
     - Ügytípus váltás (V-044 ↔ H-052)
     - Díjak és kedvezmények CRUD
     - Díjkalkulátor (F-0070)
     - Díjbekérő generálás (F-0082) - mock

### API Tesztelés curl-lel

```bash
# Health check
curl http://localhost:3000/api/health

# Határidők listázása
curl http://localhost:3000/api/parameterezo/hataridok

# Új határidő létrehozása
curl -X POST http://localhost:3000/api/parameterezo/hataridok \
  -H "Content-Type: application/json" \
  -d '{"megnevezes":"Teszt határidő","kod":"HAT-TEST","napok":5,"tipus":"munkanap","aktiv":true}'

# Díjtételek V-044-hez
curl http://localhost:3000/api/parameterezo/dijtetelek/V-044

# Ügytípusok listázása
curl http://localhost:3000/api/parameterezo/ugytipusok
```

---

## 🐛 Hibakeresés

### 1. Backend nem elérhető
```bash
# Ellenőrizd, hogy fut-e
lsof -i:3000

# Ha nem fut, indítsd el
cd backend && npm start
```

### 2. CORS hiba
```bash
# Ellenőrizd backend/.env fájlt
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### 3. Adatok nem jelennek meg
```javascript
// Nyisd meg a böngésző Console-t (F12)
// Keresd az API hívásokat:
[ParamHataridokAPI] Határidők betöltése API-ból...
[ParamHataridokAPI] API válasz: {...}
[ParamHataridokAPI] Betöltve 10 határidő
```

### 4. "VAHAP_API is not defined"
```html
<!-- Ellenőrizd, hogy betöltődött-e a vihar-api-config.js -->
<script src="../assets/js/vihar-api-config.js"></script>
```

---

## 📖 Kapcsolódó Dokumentáció

- **[API Migráció Minta](API_MIGRATION_PATTERN.md)** - Mock → API átállás részletes útmutató
- **[Backend README](backend/README.md)** - Teljes API dokumentáció
- **[Telepítési Útmutató](INSTALLATION.md)** - Projekt telepítés
- **[Frontend Migráció](backend/FRONTEND_MIGRATION.md)** - Komponens migráció guide

---

**Verzió:** 1.0.0
**Utolsó frissítés:** 2025-10-18
**Komponensek száma:** 2 (+ további tervezés alatt)
