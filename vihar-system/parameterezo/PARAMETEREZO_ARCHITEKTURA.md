# VAHAP PARAMÉTEREZŐ ALRENDSZER - ARCHITEKTÚRA

## 📋 ÁTTEKINTÉS

A Paraméterező Alrendszer a VAHAP rendszer működési paramétereinek központi kezelését biztosítja. Komponens-alapú architektúrával, a vasúti belső modullal azonos minőségben és karbantarthatósággal.

---

## 🏗️ KOMPONENS ARCHITEKTÚRA

### Fájl Struktúra

```
vihar-system/
├── parameterezo/
│   ├── index.html                          # Dashboard (refaktorált)
│   ├── ellenorzesi-listak.html            # Ellenőrzési listák kezelő
│   ├── hataridok.html                     # Határidők kezelő
│   ├── dokumentum-sablonok.html           # Dokumentum sablonok
│   ├── workflow-sablonok.html             # Workflow sablonok
│   ├── nyilvantartasok.html               # Nyilvántartás paraméterek
│   └── felhasznalok.html                  # Felhasználó és szerepkör kezelés
│
├── assets/
│   ├── js/
│   │   ├── components/
│   │   │   ├── parameterezo/              # ⭐ ÚJ: Paraméterező komponensek
│   │   │   │   ├── param-menu.js          # Bal oldali navigációs menü
│   │   │   │   ├── param-header.js        # Közös fejléc
│   │   │   │   ├── param-lista-kezelo.js  # Ellenőrzési listák kezelő
│   │   │   │   ├── param-hataridok.js     # Határidő beállítások
│   │   │   │   ├── param-dokumentum.js    # Dokumentum sablon szerkesztő
│   │   │   │   ├── param-workflow.js      # Workflow sablon szerkesztő
│   │   │   │   ├── param-tabla.js         # Közös táblázat komponens
│   │   │   │   └── param-szerkeszto.js    # Univerzális szerkesztő modal
│   │   │   │
│   │   ├── vihar-config.js                # Központi konfiguráció
│   │   ├── vihar-common.js                # Közös funkciók
│   │   └── vihar-mock-data.js             # Mock adatok (bővítve)
│   │
│   └── css/
│       ├── vihar-common.css               # Közös stílusok
│       ├── vihar-parameterezo.css         # ⭐ ÚJ: Paraméterező specifikus
│       └── vihar-layout.css               # Layout stílusok
```

---

## 🎯 PARAMÉTEREZŐ FUNKCIÓK

### 1. Ellenőrzési Listák Kezelése

**Funkciók:**
- F-0064: Hatáskör és illetékesség vizsgálat lista
- F-0065: Formai megfelelőség vizsgálat lista
- F-0066: Tartalmi megfelelőség vizsgálat lista

**Komponens:** `param-lista-kezelo.js`

**Funkciók:**
- ✅ Kritériumok CRUD műveletek
- ✅ Sorrend módosítás (drag & drop)
- ✅ Kötelező/opcionális jelölés
- ✅ Ügytípus specifikus listák (V-044, H-052)
- ✅ Élő előnézet
- ✅ Verziókezelés

### 2. Határidők Kezelése

**Komponens:** `param-hataridok.js`

**Paraméterek:**
- Sommás eljárás határideje (nap)
- Teljes eljárás határideje (nap)
- Hiánypótlás határideje (nap)
- Tényállás tisztázás határideje (nap)
- Maximális hiánypótlási körök száma
- Jogorvoslati határidő (nap)

**Funkciók:**
- ✅ Ügytípus szerinti határidők
- ✅ Validáció (min/max értékek)
- ✅ Számított határidők preview
- ✅ Munkanap/naptári nap választás

### 3. Dokumentum Sablonok

**Komponens:** `param-dokumentum.js`

**Sablon típusok:**
- Végzés sablonok (F-0091)
- Határozat sablonok (F-0092)
- Igazolás sablonok (F-0093)
- Tájékoztatás sablonok (F-0094)
- Hirdetmény sablonok (F-0095)
- Hiánypótlási felszólítás (F-0100)

**Funkciók:**
- ✅ Rich text editor
- ✅ Placeholder változók (@UGYFEL_NEV@, @DATUM@, stb.)
- ✅ Sablon verziók kezelése
- ✅ PDF preview
- ✅ Sablon klónozás

### 4. Workflow Sablonok

**Komponens:** `param-workflow.js`

**Workflow típusok:**
- Alapértelmezett workflow (V-044, H-052)
- Gyorsított workflow (sommás eljárás)
- Komplex workflow (többkörös hiánypótlás)

**Funkciók:**
- ✅ UCE lépések konfiguráció
- ✅ Döntési pontok beállítása
- ✅ Automatikus átmenet szabályok
- ✅ Értesítési pontok
- ✅ Workflow diagram preview

### 5. Nyilvántartás Paraméterek

**Komponens:** `param-nyilvantartas.js`

**Nyilvántartások:**
- VNY024 Vasútegészségügyi (F-0090)
- HNY501 Hajózási Létesítmények (F-0106)
- Egyéb külső nyilvántartások

**Funkciók:**
- ✅ API endpoint konfiguráció
- ✅ Autentikációs beállítások
- ✅ Kapcsolat teszt
- ✅ Cache beállítások

### 6. Felhasználók és Szerepkörök

**Komponens:** `param-felhasznalok.js`

**Szerepkörök:**
- VHF_UGYINTEZO
- VHF_DONTESHOZO
- VHF_ADMIN
- UGYFEL
- KEPVISELO

**Funkciók:**
- ✅ Felhasználó CRUD
- ✅ Szerepkör jogosultság matrix
- ✅ Workflow jogosultságok
- ✅ Funkció hozzáférések

---

## 🔧 KOMPONENS SPECIFIKÁCIÓK

### Közös Komponensek

#### 1. param-header.js

```javascript
/**
 * Paraméterező fejléc komponens
 * Props:
 *   - title: string (oldal cím)
 *   - breadcrumbs: array (navigációs útvonal)
 *   - showSave: boolean (mentés gomb megjelenítése)
 * Emits:
 *   - save: mentés esemény
 */
```

#### 2. param-menu.js

```javascript
/**
 * Navigációs menü komponens
 * Props:
 *   - activeModule: string (aktív modul azonosító)
 *   - modules: array (elérhető modulok listája)
 * Emits:
 *   - navigate: navigációs esemény
 */
```

#### 3. param-tabla.js

```javascript
/**
 * Univerzális táblázat komponens
 * Props:
 *   - columns: array (oszlop definíciók)
 *   - data: array (táblázat adatok)
 *   - sortable: boolean
 *   - filterable: boolean
 *   - editable: boolean
 * Emits:
 *   - edit: szerkesztés esemény
 *   - delete: törlés esemény
 *   - sort: rendezés esemény
 */
```

#### 4. param-szerkeszto.js

```javascript
/**
 * Univerzális modal szerkesztő komponens
 * Props:
 *   - schema: object (mező definíciók)
 *   - data: object (szerkesztett adat)
 *   - mode: string ('create' | 'edit')
 * Emits:
 *   - save: mentés esemény
 *   - cancel: mégse esemény
 */
```

---

## 📊 MOCK ADATOK STRUKTÚRA

### vihar-mock-data.js bővítés

```javascript
// Paraméterező mock adatok
parameterezo: {
    // Ellenőrzési listák
    ellenorzesi_listak: {
        hatáskor: [...],
        formai: [...],
        tartalmi: [...]
    },

    // Határidők
    hataridok: {
        'V-044': {...},
        'H-052': {...}
    },

    // Dokumentum sablonok
    dokumentum_sablonok: {
        vegzes: [...],
        hatarozat: [...],
        igazolas: [...]
    },

    // Workflow sablonok
    workflow_sablonok: {
        'alapértelmezett': {...},
        'sommás': {...}
    },

    // Felhasználók
    felhasznalok: [...],

    // Szerepkörök
    szerepkorok: [...]
}
```

---

## 🎨 DESIGN PATTERNS

### 1. Komponens Kommunikáció

```javascript
// Parent -> Child: Props
<param-tabla :columns="tableColumns" :data="tableData"></param-tabla>

// Child -> Parent: Events
this.$emit('save', formData);

// Globális state: vihar-config.js
const currentConfig = VIHARConfig.parameterezo.hataridok;
```

### 2. Validáció Pattern

```javascript
// Validátorok vihar-common.js-ben
VIHARValidators.hataridoValidator(nap) {
    return nap >= 8 && nap <= 90;
}

// Használat komponensben
if (!VIHARValidators.hataridoValidator(this.hataridoNap)) {
    this.errors.push('Határidő 8-90 nap között lehet');
}
```

### 3. State Management Pattern

```javascript
// Lokális state komponensben
data() {
    return {
        lista: [],
        editing: null,
        filters: {}
    }
}

// Computed properties reaktivitáshoz
computed: {
    filteredLista() {
        return this.lista.filter(item =>
            item.megnevezes.includes(this.filters.kereses)
        );
    }
}
```

---

## 🔐 JOGOSULTSÁG KEZELÉS

```javascript
// vihar-config.js
parameterezo_jogosultsagok: {
    'VHF_ADMIN': ['*'],  // Minden modul
    'VHF_UGYINTEZO': ['ellenorzesi-listak', 'view-only'],
    'VHF_DONTESHOZO': ['hataridok', 'workflow-sablonok']
}

// Használat komponensben
if (!VIHARAuth.hasAccess('ellenorzesi-listak', 'edit')) {
    return; // Csak olvasási jogosultság
}
```

---

## 🧪 TESZTELÉSI STRATÉGIA

### 1. Komponens tesztek
- Render teszt (megjelenik-e)
- Props teszt (adatok átadása)
- Emit teszt (esemény kiváltása)
- Validáció teszt

### 2. Integráci ós tesztek
- Mentés teszt (mock API)
- Navigáció teszt
- Multi-komponens együttműködés

### 3. E2E tesztek
- Teljes workflow paraméterezés
- Konfigurációváltás élesítése

---

## 📝 KÖVETKEZŐ LÉPÉSEK

1. ✅ Komponens könyvtár létrehozása
2. ✅ Mock adatok bővítése
3. ✅ param-header.js implementálás
4. ✅ param-menu.js implementálás
5. ✅ param-tabla.js implementálás
6. ✅ param-szerkeszto.js implementálás
7. ✅ Dashboard refaktorálás
8. ✅ Ellenőrzési listák modul
9. ✅ Határidők modul
10. ✅ Dokumentum sablonok modul

---

**Utolsó frissítés:** 2025-10-04
**Verzió:** 1.0
**Készítette:** Claude Code
