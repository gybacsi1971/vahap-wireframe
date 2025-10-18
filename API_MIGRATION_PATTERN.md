# VAHAP - API Migráció Minta (Frontend)

## Áttekintés

Ez a dokumentum bemutatja, hogyan kell a meglévő mock-alapú Vue.js komponenseket SQLite backend API-ra migrálni.

## 🎯 Migráció eredménye

- **Mock adatok** (`vihar-mock-data.js`) helyett → **Valós API hívások** (`vihar-api-config.js`)
- **Memóriában tárolt adatok** → **Perzisztens SQLite adatbázis**
- **Kliens oldali CRUD** → **Szerver oldali CRUD (Node.js + Express)**
- **Nem perzisztens** → **Perzisztens adatok** (újraindítás után is megmaradnak)

## 📁 Összehasonlítás: Mock vs API

### Mock verzió (régi)
```
vihar-system/assets/js/
├── vihar-mock-data.js          ← Mock adatok (több ezer sor)
└── components/parameterezo/
    └── param-hataridok.js      ← Mock adatokat használ
```

**Jellemzők:**
- Memóriában tárolt adatok
- Nem perzisztens (frissítéskor elveszik)
- Nincs backend kapcsolat
- Offline működik

### API verzió (új)
```
backend/
├── database/vahap.db           ← SQLite adatbázis
├── server.js                   ← Express API szerver
└── routes/parameterezo.js      ← CRUD API endpointok

vihar-system/assets/js/
├── vihar-api-config.js         ← API helper funkciók
└── components/parameterezo/
    └── param-hataridok-api.js  ← API-t használ
```

**Jellemzők:**
- SQLite adatbázisban tárolt adatok
- Perzisztens (újraindítás után is megmarad)
- Backend API kapcsolat szükséges
- Online működés (backend szerver kell)

## 🏗️ API Komponens Struktúra

### 1. Data tulajdonságok (bővített)

Mock verzióhoz képest új mezők:

```javascript
data() {
    return {
        // Meglévő mezők (mint mock verzióban)
        hataridok: [],
        hasChanges: false,
        showEditor: false,
        selectedHatarido: null,

        // ✅ ÚJ: API állapotkezelés
        loading: false,      // Töltés folyamatban?
        error: null,         // Hiba üzenet (ha van)
    };
}
```

### 2. API metódusok (új)

#### loadHataridok() - Adatok betöltése API-ból

**Mock verzió:**
```javascript
loadHataridok() {
    // Másolás a mock adatokból
    this.hataridok = JSON.parse(JSON.stringify(
        VIHARMockData.parameterezo.hataridok || []
    ));
}
```

**API verzió:**
```javascript
async loadHataridok() {
    this.loading = true;
    this.error = null;

    try {
        console.log('[Component] Határidők betöltése API-ból...');

        const response = await VAHAP_API.get(
            VAHAP_API.endpoints.parameterezo.hataridok
        );

        if (response && response.hataridok) {
            this.hataridok = response.hataridok;
            console.log(`[Component] Betöltve ${this.hataridok.length} határidő`);
        } else {
            throw new Error('Érvénytelen API válasz formátum');
        }

    } catch (err) {
        console.error('[Component] Hiba a betöltés során:', err);
        this.error = `Hiba a határidők betöltése során: ${err.message}`;
        this.hataridok = [];
    } finally {
        this.loading = false;
    }
}
```

**Fontos különbségek:**
- `async` kulcsszó (aszinkron hívás)
- `try-catch` blokk hibakezeléshez
- `loading` és `error` állapot beállítása
- Console logolás debug célokra

#### createHatarido() - Új elem létrehozása

**Mock verzió:**
```javascript
createHatarido() {
    this.hataridok.push({
        id: Date.now(),  // Generált ID
        ...this.selectedHatarido
    });
    this.hasChanges = true;
}
```

**API verzió:**
```javascript
async createHatarido(hatarido) {
    this.loading = true;
    this.error = null;

    try {
        console.log('[Component] Új határidő létrehozása:', hatarido);

        const response = await VAHAP_API.post(
            VAHAP_API.endpoints.parameterezo.hataridok,
            hatarido
        );

        console.log('[Component] Létrehozva:', response);

        // ✅ KRITIKUS: Újratöltés az adatbázisból
        await this.loadHataridok();

        this.hasChanges = true;
        this.$emit('change', { action: 'create', data: response });

        return response;

    } catch (err) {
        console.error('[Component] Hiba a létrehozás során:', err);
        this.error = `Hiba a határidő létrehozása során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

**Fontos különbségek:**
- API POST hívás
- Újratöltés a szerverről (`await this.loadHataridok()`)
- Nincs kliens oldali ID generálás (szerver oldali AUTO_INCREMENT)
- Esemény emit a szülő komponens felé

#### updateHatarido() - Elem módosítása

**Mock verzió:**
```javascript
updateHatarido(id, hatarido) {
    const index = this.hataridok.findIndex(h => h.id === id);
    if (index > -1) {
        this.hataridok[index] = { ...hatarido };
        this.hasChanges = true;
    }
}
```

**API verzió:**
```javascript
async updateHatarido(id, hatarido) {
    this.loading = true;
    this.error = null;

    try {
        console.log('[Component] Határidő módosítása:', id, hatarido);

        const response = await VAHAP_API.put(
            VAHAP_API.endpoints.parameterezo.hataridoById(id),
            hatarido
        );

        console.log('[Component] Módosítva:', response);

        // ✅ KRITIKUS: Újratöltés az adatbázisból
        await this.loadHataridok();

        this.hasChanges = true;
        this.$emit('change', { action: 'update', data: response });

        return response;

    } catch (err) {
        console.error('[Component] Hiba a módosítás során:', err);
        this.error = `Hiba a határidő módosítása során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

**Fontos különbségek:**
- API PUT hívás
- Dinamikus endpoint (`hataridoById(id)`)
- Újratöltés a módosítás után

#### deleteHatarido() - Elem törlése (soft delete)

**Mock verzió:**
```javascript
deleteHatarido(id) {
    if (confirm('Biztosan törli?')) {
        const index = this.hataridok.findIndex(h => h.id === id);
        if (index > -1) {
            this.hataridok.splice(index, 1);
            this.hasChanges = true;
        }
    }
}
```

**API verzió:**
```javascript
async deleteHatarido(id) {
    if (!confirm('Biztosan törli ezt a határidőt?')) {
        return;
    }

    this.loading = true;
    this.error = null;

    try {
        console.log('[Component] Határidő törlése:', id);

        const response = await VAHAP_API.delete(
            VAHAP_API.endpoints.parameterezo.hataridoById(id)
        );

        console.log('[Component] Törölve:', response);

        // ✅ KRITIKUS: Újratöltés az adatbázisból
        await this.loadHataridok();

        this.hasChanges = true;
        this.$emit('change', { action: 'delete', data: { id } });

        return response;

    } catch (err) {
        console.error('[Component] Hiba a törlés során:', err);
        this.error = `Hiba a határidő törlése során: ${err.message}`;
        throw err;
    } finally {
        this.loading = false;
    }
}
```

**Fontos különbségek:**
- API DELETE hívás
- Backend soft delete (`aktiv = 0`)
- Kliens oldalon csak újratöltés kell

### 3. Lifecycle hook módosítások

**Mock verzió:**
```javascript
mounted() {
    this.loadHataridok();  // Szinkron hívás
}
```

**API verzió:**
```javascript
async mounted() {
    console.log('[Component] Komponens mounted');
    await this.loadHataridok();  // ✅ Aszinkron hívás, várunk rá
}
```

### 4. Template módosítások

#### Betöltés jelző (ÚJ)

```html
<!-- Betöltés jelző -->
<div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
    </div>
    <p class="mt-3">Határidők betöltése...</p>
</div>
```

#### Hiba üzenet (ÚJ)

```html
<!-- Hiba üzenet -->
<div v-else-if="error" class="alert alert-danger" role="alert">
    <i class="bi bi-exclamation-triangle"></i>
    <strong>Hiba!</strong>
    <p class="mb-0 mt-2">{{ error }}</p>
    <button @click="loadHataridok" class="btn btn-sm btn-outline-danger mt-2">
        <i class="bi bi-arrow-clockwise"></i> Újrapróbálás
    </button>
</div>
```

#### Tartalom (módosított)

```html
<!-- Főtartalom - csak akkor jelenik meg, ha nincs betöltés vagy hiba -->
<div v-else>
    <!-- Statisztikák, táblázat, stb. -->
</div>
```

## 📋 Migráció lépései (Checklist)

Használd ezt a listát, amikor átállítasz egy komponenst mock-ról API-ra:

### 1. Data tulajdonságok
- [ ] `loading: false` hozzáadása
- [ ] `error: null` hozzáadása

### 2. Metódusok átírása
- [ ] `loadXxx()` → `async loadXxx()` + API GET hívás + try-catch
- [ ] `createXxx()` → `async createXxx()` + API POST hívás + újratöltés
- [ ] `updateXxx()` → `async updateXxx()` + API PUT hívás + újratöltés
- [ ] `deleteXxx()` → `async deleteXxx()` + API DELETE hívás + újratöltés

### 3. Lifecycle hooks
- [ ] `mounted()` → `async mounted()`
- [ ] `await this.loadXxx()` hívás

### 4. Template módosítások
- [ ] Betöltés jelző (`v-if="loading"`) hozzáadása
- [ ] Hiba üzenet (`v-else-if="error"`) hozzáadása
- [ ] Tartalom (`v-else`) wrapper hozzáadása

### 5. HTML oldal módosítások
- [ ] `vihar-api-config.js` script betöltése
- [ ] Backend státusz badge hozzáadása (opcionális)
- [ ] Debug panel hozzáadása (opcionális, fejlesztéshez)

### 6. Tesztelés
- [ ] Backend szerver fut (`npm start` a backend könyvtárban)
- [ ] Frontend szerver fut (`python3 -m http.server 8080`)
- [ ] Betöltés működik (adatok megjelennek)
- [ ] Létrehozás működik (POST)
- [ ] Módosítás működik (PUT)
- [ ] Törlés működik (DELETE)
- [ ] Hibaüzenetek megjelennek (backend leállítás teszt)
- [ ] Console logok tiszták (nincs hiba)

## 🚀 Példa projekt

**Demo komponens:** `param-hataridok-api.js`
**Demo HTML:** `parameterezo/hataridok-api-demo.html`

### Kipróbálás:

1. **Backend indítása:**
   ```bash
   cd backend
   npm start
   ```

2. **Frontend indítása:**
   ```bash
   cd vihar-system
   python3 -m http.server 8080
   ```

3. **Böngésző megnyitása:**
   ```
   http://localhost:8080/parameterezo/hataridok-api-demo.html
   ```

4. **Funkciók tesztelése:**
   - Kattints "Új határidő" gombra
   - Töltsd ki a mezőket
   - Mentsd el
   - Frissítsd az oldalt → Az adat megmarad! (perzisztens)
   - Szerkeszd meg
   - Töröld

## ⚠️ Gyakori hibák

### 1. "VAHAP_API is not defined"
**Probléma:** Nem töltődött be a `vihar-api-config.js`

**Megoldás:**
```html
<script src="../assets/js/vihar-api-config.js"></script>
```

### 2. "CORS error" a böngésző konzolon
**Probléma:** Backend CORS nincs beállítva

**Megoldás:** Ellenőrizd `backend/.env`:
```ini
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### 3. "Failed to fetch" hiba
**Probléma:** Backend nem fut

**Megoldás:**
```bash
cd backend
npm start
```

### 4. Adatok nem jelennek meg
**Probléma:** API válasz formátum nem megfelelő

**Debug:**
```javascript
console.log('[DEBUG] API response:', response);
```

**Ellenőrizd:**
- Backend válasz formátum: `{ "hataridok": [...] }`
- Frontend kód: `response.hataridok` helyesen van használva

### 5. "Cannot read property 'length' of undefined"
**Probléma:** API válasz nem tartalmazza a várt mezőt

**Megoldás:**
```javascript
if (response && response.hataridok) {
    this.hataridok = response.hataridok;
} else {
    throw new Error('Érvénytelen API válasz formátum');
}
```

## 📊 Összehasonlító táblázat

| Jellemző | Mock verzió | API verzió |
|----------|-------------|------------|
| **Adattárolás** | Memória (JavaScript objektum) | SQLite adatbázis |
| **Perzisztencia** | Nem perzisztens | Perzisztens |
| **Backend szükséges** | Nem | Igen (Node.js + Express) |
| **Offline működés** | Igen | Nem |
| **Adatok inicializálása** | `VIHARMockData.parameterezo.*` | API GET hívás |
| **CRUD műveletek** | Kliens oldali tömb műveletek | HTTP POST/PUT/DELETE |
| **ID generálás** | Kliens oldal (`Date.now()`) | Szerver oldal (AUTO_INCREMENT) |
| **Hibakezelés** | Nem szükséges | try-catch blokkok |
| **Állapotkezelés** | Egyszerű (`hasChanges`) | Bővített (`loading`, `error`) |
| **Console logolás** | Opcionális | Ajánlott (debug) |
| **Komponens típus** | Szinkron metódusok | Aszinkron metódusok (`async/await`) |

## 🎓 Best Practices

### 1. Mindig újratöltés módosítás után
```javascript
// ✅ HELYES
await VAHAP_API.post(...);
await this.loadHataridok();  // Újratöltés a szerverről

// ❌ HELYTELEN
await VAHAP_API.post(...);
this.hataridok.push(newItem);  // Kliens oldali módosítás (nem biztos, hogy egyezik a szerver állapottal)
```

### 2. Konzisztens hibaüzenetek
```javascript
this.error = `Hiba a határidő létrehozása során: ${err.message}`;
```

### 3. Console logolás fejlesztéshez
```javascript
console.log('[ComponentNév] Művelet leírás:', adatok);
```

### 4. Emit események a szülő komponens felé
```javascript
this.$emit('change', { action: 'create', data: response });
```

### 5. Loading állapot minden API híváskor
```javascript
this.loading = true;
try {
    // API hívás
} finally {
    this.loading = false;  // Mindig állítsd vissza!
}
```

## 🔗 Kapcsolódó dokumentáció

- **Backend API:** [backend/README.md](backend/README.md)
- **Frontend migráció:** [backend/FRONTEND_MIGRATION.md](backend/FRONTEND_MIGRATION.md)
- **Telepítési útmutató:** [INSTALLATION.md](INSTALLATION.md)
- **API Demo:** [vihar-system/api-demo.html](vihar-system/api-demo.html)

---

**Verzió:** 1.0.0 (API Migráció Minta)
**Utolsó frissítés:** 2025-10-18
**Készítette:** Claude Code
