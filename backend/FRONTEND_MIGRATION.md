# Frontend Migráció Útmutató

Ez az útmutató segít átalakítani a frontend kódot a mock adatokról az új Backend API-ra.

---

## 🔄 Átállás Lépései

### 1. API Konfiguráció

Hozz létre egy új konfigurációs fájlt:

**`vihar-system/assets/js/vihar-api-config.js`**

```javascript
/**
 * VAHAP API Konfiguráció
 *
 * Backend API URL és helper függvények
 */

const VAHAP_API = {
    // API Base URL
    baseURL: 'http://localhost:3000/api',

    // Endpointok
    endpoints: {
        parameterezo: {
            ellenorzesiListak: '/parameterezo/ellenorzesi-listak',
            ellenorzesiListaKriteriumok: (listaKod) => `/parameterezo/ellenorzesi-listak/${listaKod}/kriteriumok`,
            hataridok: '/parameterezo/hataridok',
            dijtetelek: (ugytipusKod) => `/parameterezo/dijtetelek/${ugytipusKod}`,
            kedvezmenyek: (ugytipusKod) => `/parameterezo/kedvezmenyek/${ugytipusKod}`,
            dokumentumSablonok: '/parameterezo/dokumentum-sablonok',
            dokumentumSablonokGrouped: '/parameterezo/dokumentum-sablonok/grouped',
            szerepkorok: '/parameterezo/szerepkorok',
            felhasznalok: '/parameterezo/felhasznalok'
        },
        vasut: {
            ugyek: '/vasut/ugyek',
            ugy: (ugyazonosito) => `/vasut/ugyek/${ugyazonosito}`,
            vny024: '/vasut/nyilvantartas/vny024'
        },
        hajozas: {
            ugyek: '/hajozas/ugyek',
            ugy: (ugyazonosito) => `/hajozas/ugyek/${ugyazonosito}`,
            hny501: '/hajozas/nyilvantartas/hny501'
        },
        health: '/health'
    },

    // HTTP Metódusok
    async get(endpoint, params = {}) {
        const url = new URL(this.baseURL + endpoint);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return await response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(this.baseURL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return await response.json();
    },

    async put(endpoint, data) {
        const response = await fetch(this.baseURL + endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return await response.json();
    },

    async delete(endpoint) {
        const response = await fetch(this.baseURL + endpoint, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return await response.json();
    }
};
```

---

## 📋 Komponens Migrációs Példák

### Példa 1: Díjtételek Komponens

**ELŐTTE** (Mock adatok):

```javascript
// param-dijtetelek.js (régi verzió)
const ParamDijtetelek = {
    name: 'param-dijtetelek',
    data() {
        return {
            dijak: [],
            kedvezmenyek: []
        };
    },
    methods: {
        loadDijak() {
            // Mock adatok betöltése
            const mockKey = this.ugytipus.replace('-', '_');
            if (VIHARMockData?.parameterezo?.dijtetelek?.[mockKey]) {
                const data = VIHARMockData.parameterezo.dijtetelek[mockKey];
                this.dijak = JSON.parse(JSON.stringify(data.dijak || []));
                this.kedvezmenyek = JSON.parse(JSON.stringify(data.kedvezmenyek || []));
            }
        }
    },
    mounted() {
        this.loadDijak();
    }
};
```

**UTÁNA** (Backend API):

```javascript
// param-dijtetelek.js (új verzió)
const ParamDijtetelek = {
    name: 'param-dijtetelek',
    data() {
        return {
            dijak: [],
            kedvezmenyek: [],
            ugytipusInfo: {},
            loading: false,
            error: null
        };
    },
    methods: {
        async loadDijak() {
            this.loading = true;
            this.error = null;
            try {
                // API hívás
                const response = await VAHAP_API.get(
                    VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus)
                );

                // Adatok beállítása
                this.ugytipusInfo = response.ugytipus;
                this.dijak = response.dijak;
                this.kedvezmenyek = response.kedvezmenyek;

                console.log(`[API] Betöltve: ${this.dijak.length} díjtétel, ${this.kedvezmenyek.length} kedvezmény`);
            } catch (error) {
                console.error('[API] Hiba a díjtételek betöltésénél:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async saveDij(dij) {
            try {
                if (dij.id) {
                    // Módosítás
                    await VAHAP_API.put(
                        VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus) + `/${dij.id}`,
                        dij
                    );
                } else {
                    // Új létrehozása
                    await VAHAP_API.post(
                        VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus),
                        dij
                    );
                }
                // Újratöltés
                await this.loadDijak();
            } catch (error) {
                console.error('[API] Hiba a díjtétel mentésénél:', error);
                alert('Hiba történt a mentés során!');
            }
        },

        async deleteDij(dij) {
            if (!confirm(`Biztosan törli: ${dij.megnevezes}?`)) {
                return;
            }

            try {
                await VAHAP_API.delete(
                    VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus) + `/${dij.id}`
                );
                // Újratöltés
                await this.loadDijak();
            } catch (error) {
                console.error('[API] Hiba a díjtétel törlésénél:', error);
                alert('Hiba történt a törlés során!');
            }
        }
    },
    async mounted() {
        await this.loadDijak();
    }
};
```

---

### Példa 2: Ellenőrzési Listák Komponens

**ELŐTTE** (Mock adatok):

```javascript
// param-lista-kezelo.js (régi verzió)
methods: {
    loadKriteriumok() {
        const mockKey = `ellenorzesi_lista_${this.listaTipus}`;
        if (VIHARMockData?.parameterezo?.[mockKey]) {
            this.kriteriumok = JSON.parse(JSON.stringify(
                VIHARMockData.parameterezo[mockKey].kriteriumok || []
            ));
        }
    }
}
```

**UTÁNA** (Backend API):

```javascript
// param-lista-kezelo.js (új verzió)
methods: {
    async loadKriteriumok() {
        this.loading = true;
        this.error = null;
        try {
            const listaKod = this.getListaKod(); // pl. 'F-0064'
            const response = await VAHAP_API.get(
                VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod)
            );

            this.listaInfo = response.lista;
            this.kriteriumok = response.kriteriumok;

            console.log(`[API] Betöltve: ${this.kriteriumok.length} kritérium`);
        } catch (error) {
            console.error('[API] Hiba a kritériumok betöltésénél:', error);
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    },

    getListaKod() {
        // Mapping: listaTipus -> F-kód
        const mapping = {
            'hataskor': 'F-0064',
            'formai': 'F-0065',
            'tartalmi': 'F-0066'
        };
        return mapping[this.listaTipus] || 'F-0064';
    },

    async saveKriterium(kriterium) {
        const listaKod = this.getListaKod();
        try {
            if (kriterium.id) {
                // Módosítás
                await VAHAP_API.put(
                    VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod) + `/${kriterium.id}`,
                    kriterium
                );
            } else {
                // Új létrehozása
                await VAHAP_API.post(
                    VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod),
                    kriterium
                );
            }
            await this.loadKriteriumok();
        } catch (error) {
            console.error('[API] Hiba a kritérium mentésénél:', error);
            alert('Hiba történt a mentés során!');
        }
    },

    async deleteKriterium(kriterium) {
        if (!confirm(`Biztosan törli: ${kriterium.megnevezes}?`)) {
            return;
        }

        const listaKod = this.getListaKod();
        try {
            await VAHAP_API.delete(
                VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod) + `/${kriterium.id}`
            );
            await this.loadKriteriumok();
        } catch (error) {
            console.error('[API] Hiba a kritérium törlésénél:', error);
            alert('Hiba történt a törlés során!');
        }
    }
}
```

---

### Példa 3: Loading és Error State Kezelés

**HTML template:**

```html
<div id="app">
    <param-header :breadcrumb="breadcrumb"></param-header>

    <div class="container-fluid py-4">
        <!-- Loading állapot -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Betöltés...</span>
            </div>
            <p class="mt-3">Adatok betöltése...</p>
        </div>

        <!-- Hiba állapot -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            <strong>Hiba történt!</strong>
            {{ error }}
            <button @click="loadDijak" class="btn btn-sm btn-outline-danger ms-3">
                Újrapróbálás
            </button>
        </div>

        <!-- Tartalom (sikeres betöltés után) -->
        <div v-else>
            <param-dijtetelek :ugytipus="ugytipus"></param-dijtetelek>
        </div>
    </div>
</div>
```

---

## 🔧 HTML Fájlok Módosítása

**Régi script betöltések:**

```html
<!-- RÉGI -->
<script src="../../assets/js/vihar-config.js"></script>
<script src="../../assets/js/vihar-common.js"></script>
<script src="../../assets/js/vihar-mock-data.js"></script>
<script src="../../assets/js/vihar-components.js"></script>
```

**Új script betöltések:**

```html
<!-- ÚJ - API verzió -->
<script src="../../assets/js/vihar-config.js"></script>
<script src="../../assets/js/vihar-common.js"></script>
<script src="../../assets/js/vihar-api-config.js"></script>  <!-- ÚJ! -->
<!-- vihar-mock-data.js TÖRLÉSE -->
<script src="../../assets/js/vihar-components.js"></script>
```

---

## ✅ Migráció Checklist

### Paraméterező Modul

- [ ] `param-dijtetelek.js` - Díjtételek CRUD
- [ ] `param-lista-kezelo.js` - Ellenőrzési listák CRUD
- [ ] `param-hataridok.js` - Határidők CRUD
- [ ] `param-dokumentum.js` - Dokumentum sablonok READ
- [ ] `param-workflow.js` - Workflow sablonok READ

### HTML Oldalak

- [ ] `parameterezo/dijtetelek.html`
- [ ] `parameterezo/ellenorzesi-listak.html`
- [ ] `parameterezo/hataridok.html`
- [ ] `parameterezo/dokumentum-sablonok.html`
- [ ] `parameterezo/workflow-sablonok.html`

### Tesztelés

- [ ] Backend elindul (`npm start`)
- [ ] Health check működik (`/api/health`)
- [ ] Frontend betölti az adatokat
- [ ] CRUD műveletek működnek (Create, Read, Update, Delete)
- [ ] Hibakezelés működik (ha backend nem elérhető)

---

## 🐛 Gyakori Hibák és Megoldások

### 1. CORS hiba

**Hiba:**
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Megoldás:**
Ellenőrizd a backend `.env` fájlt:
```ini
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### 2. Backend nem elérhető

**Hiba:**
```
TypeError: Failed to fetch
```

**Megoldás:**
- Ellenőrizd, hogy a backend fut-e: `npm start` a `backend/` könyvtárban
- Nézd meg a backend URL-t a `vihar-api-config.js`-ben

### 3. Adatok nem jelennek meg

**Hiba:**
Üres lista jelenik meg.

**Megoldás:**
- Nyisd meg a böngésző DevTools > Network fület
- Ellenőrizd az API válaszokat
- Nézd meg a console log-okat (`console.log()`)

---

## 📊 Teljesítmény Optimalizálás

### Caching implementálása

```javascript
// Egyszerű cache implementáció
const APICache = {
    cache: {},
    ttl: 60000, // 1 perc

    get(key) {
        const item = this.cache[key];
        if (!item) return null;
        if (Date.now() > item.expires) {
            delete this.cache[key];
            return null;
        }
        return item.data;
    },

    set(key, data) {
        this.cache[key] = {
            data: data,
            expires: Date.now() + this.ttl
        };
    },

    clear() {
        this.cache = {};
    }
};

// Használat
async loadDijak() {
    const cacheKey = `dijtetelek_${this.ugytipus}`;

    // Cache ellenőrzés
    const cached = APICache.get(cacheKey);
    if (cached) {
        this.dijak = cached.dijak;
        this.kedvezmenyek = cached.kedvezmenyek;
        return;
    }

    // API hívás
    const response = await VAHAP_API.get(...);

    // Cache mentés
    APICache.set(cacheKey, response);

    this.dijak = response.dijak;
    this.kedvezmenyek = response.kedvezmenyek;
}
```

---

## 🎯 Következő Lépések

1. **Komponensek átírása egyenként**
   - Kezdd a legegyszerűbbekével (pl. `param-hataridok.js`)
   - Teszteld minden komponens után
   - Commitolj Git-be minden működő változtatás után

2. **Új funkciók hozzáadása**
   - Keresés
   - Szűrés
   - Rendezés
   - Lapozás

3. **Haladó funkciók**
   - Optimista UI frissítés
   - Offline működés (Service Worker)
   - Real-time frissítés (WebSocket)

---

## 📚 További Dokumentáció

- [Backend README](./README.md)
- [CLAUDE.md](../CLAUDE.md)
- [Vasúti Modul Specifikáció](../spec/VAHAP%20Vasúti%20Modul%20Logikai%20Specifikáció.md)
- [Hajózási Modul Specifikáció](../spec/VAHAP%20Hajózási%20Modul%20Logikai%20Specifikáció.md)
