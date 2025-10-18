# CLAUDE.md

Ez a fájl útmutatást ad a Claude Code-nak (claude.ai/code) a VAHAP rendszerrel végzett munka során.

## Projekt áttekintés

A **VAHAP** (Vasúti és Hajózási Integrált Hatósági Rendszer) egy magyar kormányzati elektronikus ügykezelő rendszer vasúti és hajózási hatósági folyamatokhoz. A rendszer külső (ügyféloldali) és belső (ügyintézői) modulokból áll, Bootstrap 5-tel és Vue.js 3-mal építve.

FONTOS: drótvázat készítünk teszadatokkal és minden dolgot csak mockolni kell!!! A drótváznak a teljes működő rendszert kell tudni bemutatni.

### Rendszer architektúra
```
VAHAP Főoldal
├── Vasúti Modul (V-044)
│   ├── Külső rendszer (Ügyfél)
│   └── Belső rendszer (Ügyintéző)
├── Hajózási Modul (H-052)
│   ├── Külső rendszer (Ügyfél)
│   └── Belső rendszer (Ügyintéző)
└── Paraméterező Modul
    ├── Dashboard
    ├── Ellenőrzési listák (F-0064, F-0065, F-0066)
    ├── Határidők
    ├── Díjtételek (F-0070, F-0082)
    ├── Dokumentum sablonok (F-0091-095)
    ├── Workflow sablonok
    ├── Nyilvántartások (F-0090, F-0106)
    ├── Felhasználók
    └── Szerepkörök
```

## 🚨 KRITIKUS SZABÁLYOK

### Magyar nyelvűség
**KÖTELEZŐ**: Ez egy magyar kormányzati projekt. MINDEN kommunikáció, kód komment, felhasználói felület szövege és dokumentáció **KIZÁRÓLAG MAGYAR** nyelvű legyen!

### Specifikáció követés
**KÖTELEZŐ**: Fejlesztés előtt MINDIG olvasd el és kövesd:
- `VAHAP Vasúti Modul Logikai Specifikáció.md`
- `VAHAP Hajózási Modul Logikai Specifikáció.md`

## 🎯 FEJLESZTÉSI FOLYAMAT

### MINDEN modul fejlesztése előtt:

1. **Specifikáció elemzése**
   - Azonosítsd az ügytípust (V-044 vagy H-052)
   - Listázd ki a szükséges funkciókat (F-xxxx kódok)
   - Térképezd fel a workflow lépéseket (UCE-xxxx kódok)

2. **Alrendszer meghatározása**
   - **Külső**: Ügyfél által használt felület (External)
   - **Belső**: Ügyintéző által használt felület (Internal)

3. **Közös funkciók azonosítása**
   - Mindkét modulban használt funkciók
   - Paraméterezett komponensek

## 🏗️ Kötelező struktúrák

### Fájlnévkonvenciók
```
/vihar-system/
├── index.html                    # Főoldal
├── README.md                     # Projekt dokumentáció
├── FEJLESZTOI_UTMUTATO.md       # Modularizált fejlesztési útmutató
├── CLAUDE.md                     # ⭐ Fejlesztési útmutató Claude Code-hoz
├── assets/
│   ├── css/
│   │   └── vihar-common.css     # Közös stílusok
│   └── js/
│       ├── vihar-config.js      # ⭐ Központi konfiguráció (konstansok, beállítások)
│       ├── vihar-common.js      # ⭐ Újrafelhasználható funkciók (validátorok, formázók)
│       ├── vihar-mock-data.js   # ⭐ Központosított tesztadatok (összes modul)
│       ├── vihar-components.js  # ⭐ Vue komponensek (újrafelhasználható UI elemek)
│       └── components/
│           └── parameterezo/    # ⭐ Paraméterező komponensek
│               ├── param-header.js        # Fejléc komponens
│               ├── param-tabla.js         # ⭐ Táblázat komponens (alap)
│               ├── param-szerkeszto.js    # ⭐ Modal szerkesztő (alap)
│               ├── param-lista-kezelo.js  # Ellenőrzési listák (F-0064-066)
│               ├── param-hataridok.js     # Határidő kezelő
│               ├── param-dijtetelek.js    # Díjtételek (F-0070, F-0082)
│               ├── param-dokumentum.js    # Dokumentum sablonok (F-0091-095)
│               └── param-workflow.js      # Workflow sablonok
├── vasut/
│   ├── kulso/                   # Ügyfél felület
│   │   └── index.html
│   └── belso/                   # Ügyintéző felület
│       └── index.html
├── hajozas/
│   ├── kulso/                   # Ügyfél felület
│   │   └── index.html
│   └── belso/                   # Ügyintéző felület
│       └── index.html
└── parameterezo/                # ⭐ Paraméterező modul (Admin)
    ├── index.html               # Dashboard
    ├── ellenorzesi-listak.html  # F-0064, F-0065, F-0066
    ├── hataridok.html           # Határidő paraméterek
    ├── dijtetelek.html          # F-0070, F-0082 Díjkalkulátor
    ├── dokumentum-sablonok.html # F-0091-095 Dokumentum sablonok
    ├── workflow-sablonok.html   # Workflow sablonok
    ├── nyilvantartasok.html     # F-0090, F-0106 Nyilvántartások
    ├── felhasznalok.html        # Felhasználó kezelés
    └── szerepkorok.html         # Szerepkör kezelés
```

### ⭐ KRITIKUS: Központi JavaScript Fájlok (MINDIG használd!)

**Minden új oldal létrehozásánál ezeket a script-eket kell betölteni:**

```html
<!-- VAHAP Központi Fájlok - KÖTELEZŐ SORREND! -->
<script src="../../assets/js/vihar-config.js"></script>      <!-- 1. Konfiguráció -->
<script src="../../assets/js/vihar-common.js"></script>      <!-- 2. Közös funkciók -->
<script src="../../assets/js/vihar-mock-data.js"></script>   <!-- 3. Mock adatok -->
<script src="../../assets/js/vihar-components.js"></script>  <!-- 4. Vue komponensek -->
```

### Külső rendszer (Ügyfél) - Layout

```html
<!-- Kötelező struktúra -->
<div class="container-fluid vh-100 d-flex flex-column">
    <!-- Fejléc -->
    <nav class="navbar navbar-light bg-light border-bottom">
        <div class="container">
            <span class="navbar-brand">
                <img src="logo.png" height="40"> VAHAP - [Modul név]
            </span>
            <div class="ms-auto">
                <span class="me-3">Üdvözöljük!</span>
                <button class="btn btn-outline-primary btn-sm">Súgó</button>
            </div>
        </div>
    </nav>
    
    <!-- Tartalom -->
    <div class="flex-grow-1 overflow-auto">
        <div class="container py-4">
            <!-- Előrehaladás jelző -->
            <div class="progress-wizard mb-4">
                <!-- Varázsló lépések -->
            </div>
            
            <!-- Űrlap terület -->
            <div class="card shadow-sm">
                <div class="card-body">
                    <!-- Tartalom -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Lábléc műveletsáv -->
    <div class="border-top bg-light p-3">
        <div class="container d-flex justify-content-between">
            <button class="btn btn-secondary">Vissza</button>
            <button class="btn btn-primary">Tovább</button>
        </div>
    </div>
</div>
```

### Belső rendszer (Ügyintéző) - Kötelező 3 oszlopos layout

**KRITIKUS CSS követelmények:**
```css
/* Layout alapok - KÖTELEZŐ */
.vh-100.row {
    flex-wrap: nowrap !important;
    margin: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
}

body {
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
}

.container-fluid {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
}

html {
    overflow-x: hidden !important;
}

/* Független scrollozás mindhárom oszlopban - KÖTELEZŐ */
.sidebar-left, .sidebar-right {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.sidebar-left .sidebar-content,
.sidebar-right .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
}

.middle-column {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.middle-column .case-header {
    flex-shrink: 0; /* Fejléc fix marad */
}

.middle-column .flex-grow-1.overflow-auto {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
}

/* Kollapsz funkció - KÖTELEZŐ */
.sidebar-left, .sidebar-right {
    transition: width 0.3s ease, flex 0.3s ease, max-width 0.3s ease;
    position: relative;
    overflow: hidden;
}

.sidebar-left.collapsed {
    max-width: 50px !important;
    min-width: 50px !important;
    flex: 0 0 50px !important;
    width: 50px !important;
    box-sizing: border-box !important;
    border-right: none !important;
}

.sidebar-right.collapsed {
    max-width: 50px !important;
    min-width: 50px !important;
    flex: 0 0 50px !important;
    width: 50px !important;
    box-sizing: border-box !important;
    border-left: none !important;
}

.collapsed .sidebar-content {
    opacity: 0;
    visibility: hidden;
    position: absolute;
}

.collapsed .collapsed-icon-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 50px;
    padding: 1rem 0;
    overflow: hidden;
    border: none !important;
}
```

**Vue.js dinamikus grid sizing - KÖTELEZŐ:**
```javascript
// Középső oszlop dinamikus méretezése
:class="{
    'col-md-7': !leftCollapsed && !rightCollapsed,
    'col-md-9': leftCollapsed && !rightCollapsed
}"
:style="{
    flex: (leftCollapsed && rightCollapsed) || (!leftCollapsed && rightCollapsed) ? '1 1 auto' : ''
}"

// Bal sidebar border kezelés
:class="{
    collapsed: leftCollapsed,
    'border-end': !leftCollapsed
}"

// Jobb sidebar border kezelés
:class="{
    collapsed: rightCollapsed,
    'border-start': !rightCollapsed
}"
```

```html
<!-- KRITIKUS: Ez a struktúra NEM változtatható! -->
<div class="container-fluid">
    <div class="row vh-100">
        <!-- 1. BAL OSZLOP - Navigáció (2 col) -->
        <div class="col-md-2 bg-light p-0 d-flex flex-column sidebar-left"
             :class="{ collapsed: leftCollapsed, 'border-end': !leftCollapsed }"
             :style="{
                 flex: leftCollapsed ? '0 0 50px' : '',
                 maxWidth: leftCollapsed ? '50px' : '',
                 width: leftCollapsed ? '50px' : ''
             }">

            <!-- Toggle gomb -->
            <button class="toggle-btn toggle-btn-left" @click="leftCollapsed = !leftCollapsed">
                <i class="bi" :class="leftCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
            </button>

            <!-- Normál nézet tartalma -->
            <div class="sidebar-content">
            <div class="d-flex flex-column h-100">
                <!-- Modul fejléc -->
                <div class="p-3 border-bottom">
                    <h6 class="mb-0">
                        <i class="bi bi-train-front"></i> Vasúti Modul
                        <span class="badge bg-secondary">V-044</span>
                    </h6>
                </div>
                
                <!-- Navigációs menü -->
                <div class="flex-grow-1 overflow-auto p-2">
                    <div class="nav flex-column">
                        <a class="nav-link active">
                            <span class="badge bg-info me-2">UCE-1987</span>
                            Hatáskör vizsgálat
                        </a>
                        <a class="nav-link">
                            <span class="badge bg-info me-2">UCE-1993</span>
                            Formai ellenőrzés
                        </a>
                        <!-- További menüpontok -->
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 2. KÖZÉPSŐ OSZLOP - Munkaterület (6-8 col) -->
        <div class="col-md-7 p-0 d-flex flex-column">
            <!-- Ügyfejléc -->
            <div class="bg-primary text-white p-3">
                <div class="row">
                    <div class="col">
                        <small>Ügyazonosító</small>
                        <h6 class="mb-0">VAHAP-2024-001234</h6>
                    </div>
                    <div class="col">
                        <small>Ügyfél</small>
                        <h6 class="mb-0">Minta János</h6>
                    </div>
                    <div class="col">
                        <small>Határidő</small>
                        <h6 class="mb-0">2024.11.15</h6>
                    </div>
                </div>
            </div>
            
            <!-- Munka fülek -->
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active">
                        Vizsgálat
                        <span class="badge bg-secondary ms-1">F-0064</span>
                    </a>
                </li>
            </ul>
            
            <!-- Munkaterület -->
            <div class="flex-grow-1 overflow-auto p-3">
                <!-- Űrlapok, ellenőrző listák -->
            </div>
        </div>
        
        <!-- 3. JOBB OSZLOP - Döntési és info panelek (3 col) -->
        <div class="col-md-3 bg-light border-start p-0">
            <div class="d-flex flex-column h-100 overflow-auto">
                
                <!-- KÖTELEZŐ 1. PANEL: Döntési/Műveleti -->
                <div class="border-bottom p-3">
                    <h6 class="mb-3">
                        <i class="bi bi-check-circle"></i> Döntési pontok
                        <span class="badge bg-dark ms-2">F-0088</span>
                    </h6>
                    <div class="d-grid gap-2">
                        <button class="btn btn-success">
                            <span class="badge bg-light text-dark">UCE-1994</span>
                            Sommás eljárás
                        </button>
                        <button class="btn btn-warning">
                            <span class="badge bg-light text-dark">UCE-2000</span>
                            Hiánypótlás
                        </button>
                        <button class="btn btn-danger">
                            <span class="badge bg-light text-dark">UCE-1990</span>
                            Elutasítás
                        </button>
                    </div>
                </div>
                
                <!-- KÖTELEZŐ 2. PANEL: Előzmények -->
                <div class="border-bottom p-3">
                    <h6 class="mb-3">
                        <i class="bi bi-clock-history"></i> Eljárás előzmények
                    </h6>
                    <div class="timeline">
                        <!-- Előzmény lista -->
                    </div>
                </div>
                
                <!-- KÖTELEZŐ 3. PANEL: Dokumentumok -->
                <div class="border-bottom p-3">
                    <h6 class="mb-3">
                        <i class="bi bi-file-text"></i> Kapcsolódó dokumentumok
                    </h6>
                    <div class="list-group list-group-flush">
                        <!-- Dokumentum lista -->
                    </div>
                </div>
                
                <!-- OPCIONÁLIS: További információk -->
                <div class="p-3">
                    <!-- Extra információk -->
                </div>
            </div>
        </div>
    </div>
</div>
```

## 🎨 Kötelező dizájn elemek

### CSS változók (vihar-common.css)
```css
:root {
    /* DÁP Design System színpaletta */
    --vahap-primary: #4650FB;      /* DÁP Indigo - primér szín */
    --vahap-neutral-500: #64748B;  /* DÁP szürke */
    --vahap-positive: #059669;     /* DÁP pozitív (zöld) */
    --vahap-warning: #D97706;      /* DÁP figyelmeztető (narancs) */
    --vahap-negative: #DC2626;     /* DÁP negatív (piros) */
    --vahap-informative: #0284C7;  /* DÁP informatív (kék) */

    /* Modul specifikus színek - DÁP compliance */
    --vahap-vasut: #4650FB;        /* DÁP Indigo - vasúti modul */
    --vahap-hajozas: #4650FB;      /* DÁP Indigo - hajózási modul */

    /* Funkció kategória színek */
    --func-external: #e3f2fd;      /* Világoskék háttér */
    --func-internal: #fff3e0;      /* Világos narancs háttér */
    --func-interface: #f3e5f5;     /* Világos lila háttér */
}
```

### Bootstrap komponens testreszabások
```scss
// Kormányzati gomb stílusok
.btn-gov-primary {
    background-color: var(--vihar-primary);
    border-color: var(--vihar-primary);
    color: white;
    
    &:hover {
        background-color: darken(var(--vihar-primary), 10%);
    }
}

// Állapot jelvények
.badge-status {
    &.badge-new { background-color: #6c757d; }
    &.badge-pending { background-color: #ffc107; }
    &.badge-approved { background-color: #28a745; }
    &.badge-rejected { background-color: #dc3545; }
    &.badge-expired { background-color: #343a40; }
}
```

## 📋 Funkciókódok és használati esetek

### Paraméterező Modul (Kereszt-modul admin funkciók)

#### Paraméterező funkciók
```javascript
// Ellenőrzési listák
// F-0064 - Hatáskör és illetékesség vizsgálat kritériumai
// F-0065 - Formai megfelelőség vizsgálat kritériumai
// F-0066 - Tartalmi megfelelőség vizsgálat kritériumai

// Díjak és fizetés
// F-0070 - Díjkalkulátor (paraméterezett díjtételekkel)
// F-0082 - Díjbekérő előállítása (paraméterezett sablonból)

// Dokumentum generálás
// F-0091 - Végzés tervezet (paraméterezett sablon)
// F-0092 - Határozat tervezet (paraméterezett sablon)
// F-0093 - Igazolás tervezet (paraméterezett sablon)
// F-0094 - Tájékoztatás tervezet (paraméterezett sablon)
// F-0095 - Hirdetmény tervezet (paraméterezett sablon)

// Nyilvántartási interfészek
// F-0090 - VNY024 Vasútegészségügyi Nyilvántartás
// F-0106 - HNY501 Hajózási Létesítmények Nyilvántartása

// Workflow és határidők
// Határidő paraméterek (nincsen F-kód, admin funkció)
// Workflow sablon paraméterek (nincsen F-kód, admin funkció)
```

**FONTOS**: A paraméterező modul nem használ UCE kódokat, mert ez nem egy workflow-alapú folyamat, hanem adminisztrációs CRUD műveletek gyűjteménye.

### Vasúti Modul (V-044)

#### Külső funkciók
```javascript
// F-0069 - Kérelem kitöltése
// F-0070 - Díjkalkulátor  
// F-0082 - Díjbekérő előállítása
// F-0083 - Online díjfizetés
// F-0084 - Kérelem mellékletek
// F-0085 - Kérelem véglegesítése
// F-0086 - PDF generálás
// F-0087 - Kérelem benyújtása
// F-0101 - Hiánypótlás benyújtása
// F-0107 - Kérelem adatlap
```

#### Belső funkciók
```javascript
// F-0064 - Hatáskör és illetékesség vizsgálat
// F-0065 - Formai megfelelőség vizsgálata
// F-0066 - Tartalmi megfelelőség vizsgálat
// F-0074 - Érdemi döntés: döntési javaslat
// F-0088 - Döntés-előkészítés döntés
// F-0089 - Döntés-előkészítés: ügyfél értesítés
// F-0090 - VNY024 Vasútegészségügyi adatok (VASÚT SPECIFIKUS)
// F-0091 - Végzés tervezet
// F-0092 - Határozat tervezet
// F-0093 - Igazolás tervezet
// F-0094 - Tájékoztatás tervezet
// F-0095 - Hirdetmény tervezet
// F-0096 - Döntési javaslat véleményezés
// F-0097 - Ügy lezárása
// F-0098 - FORRÁS SQL interfész
// F-0099 - Érdemi döntés: vezetői döntés
// F-0100 - Hiánypótlási felszólítás
// F-0102 - Tényállás tisztázása: Rugalmas workflow
```

#### Használati eset kódok
```javascript
// UCE-1761 - Kérelem adatrögzítés megkezdése
// UCE-1771 - Kérelem benyújtása
// UCE-1776 - Kérelem véglegesítése
// UCE-1793 - Hatáskör vizsgálat
// UCE-1794 - Tartalmi megfelelőség vizsgálata
// UCE-1799 - Formai megfelelőség vizsgálata
// UCE-1800 - Sommás eljárás alkalmazható?
// UCE-1803 - Párhuzamos elágazás
// UCE-1809 - Végzés tervezet
// UCE-1810 - Határozat tervezet
// UCE-1811 - Igazolás tervezet
// UCE-1824 - Döntési javaslat véleményeztetése
// UCE-1826 - Döntési javaslat elkészítése
// UCE-1828 - Ügy lezárása
```

### Hajózási Modul (H-052)

#### Külső funkciók
```javascript
// Ugyanazok mint a vasúti, de hajózás specifikus tartalommal
// + kikötő típus, víziút kategória mezők
```

#### Belső funkciók
```javascript
// Közös funkciók (F-0064 - F-0099) 
// + F-0106 - HNY501 Hajózási Létesítmények (HAJÓZÁS SPECIFIKUS)
```

#### Használati eset kódok
```javascript
// UCE-1955 - Kérelem adatrögzítés megkezdése
// UCE-1965 - Kérelem benyújtása
// UCE-1970 - Kérelem véglegesítése
// UCE-1983 - Hatáskör biztosított?
// UCE-1987 - Hatáskör vizsgálat
// UCE-1988 - Tartalmi megfelelőség vizsgálata
// UCE-1993 - Formai megfelelőség vizsgálata
// UCE-1994 - Sommás eljárás alkalmazható?
// UCE-2003 - Végzés tervezet
// UCE-2004 - Határozat tervezet
// UCE-2005 - Igazolás tervezet
// UCE-2018 - Döntési javaslat véleményeztetése
// UCE-2020 - Döntési javaslat elkészítése
// UCE-2022 - Ügy lezárása
// UCE-2023 - Nyilvántartás frissítése
// UCE-2045 - Szakhatósági állásfoglalás
// UCE-2050 - Egyedi eljárási cselekmény
// UCE-2051 - Szemle lefolytatás
// UCE-2052 - Ügyfél nyilatkozattétel
// UCE-2053 - Szakértői vélemény
// UCE-2054 - Megkeresés
// UCE-2055 - Irat bemutatás
// UCE-2056 - Tárgyalás összehívás
// UCE-2071 - Hiánypótlási felszólítás
```

## 🔄 Vue.js komponens struktúra

### Alapkomponens template
```vue
<template>
  <div class="vihar-component">
    <h6 class="component-header">
      <i :class="iconClass"></i> {{ componentTitle }}
      <span class="badge bg-secondary ms-2">{{ functionCode }}</span>
      <span class="badge bg-info ms-1">{{ useCaseCode }}</span>
    </h6>
    <div class="component-body">
      <!-- Tartalom -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'VahapComponent',
  props: {
    functionCode: String,  // pl. 'F-0064'
    useCaseCode: String,   // pl. 'UCE-1987'
    componentTitle: String // pl. 'Hatáskör vizsgálat'
  },
  data() {
    return {
      // F-0064 - Hatáskör vizsgálat implementáció
    }
  },
  methods: {
    // UCE-1987 - Hatáskör vizsgálat végrehajtása
    executeJurisdictionCheck() {
      console.log(`Végrehajtás: ${this.functionCode} - ${this.useCaseCode}`);
      // Implementáció
    }
  }
}
</script>
```

## 🎛️ Paraméterező Modul Architektúra

### Általános áttekintés
A Paraméterező modul egy központi adminisztrációs rendszer, amely lehetővé teszi a VAHAP rendszer konfigurálását mock adatokon keresztül. A modul újrafelhasználható Vue.js komponenseket használ a CRUD műveletek egységes kezeléséhez.

### Paraméterező komponens hierarchia
```
ParamHeader (param-header.js)
    ├── Breadcrumb navigáció
    ├── Mentés/Vissza gombok
    └── Admin felhasználó info

ParamTabla (param-tabla.js)
    ├── Dinamikus oszlopok
    ├── Rendezés
    ├── Szűrés
    ├── Akciógombok (szerkesztés, törlés)
    └── Új elem hozzáadás

ParamSzerkeszto (param-szerkeszto.js)
    ├── Modal dialógus
    ├── Dinamikus mezők
    └── Validáció

ParamListaKezelo (param-lista-kezelo.js)
    ├── Ellenőrzési listák kezelése
    ├── F-0064, F-0065, F-0066 támogatás
    └── ParamTabla + ParamSzerkeszto használata

ParamHataridok (param-hataridok.js)
    ├── Határidő paraméterek
    └── ParamTabla használata

ParamDijtetelek (param-dijtetelek.js)
    ├── Díjtétel CRUD
    ├── Kedvezmény CRUD
    ├── F-0070 Díjkalkulátor
    ├── F-0082 Díjbekérő
    └── ParamTabla használata

ParamDokumentum (param-dokumentum.js)
    ├── Dokumentum sablonok
    ├── F-0091-095 támogatás
    └── ParamTabla használata

ParamWorkflow (param-workflow.js)
    ├── Workflow sablonok
    └── ParamTabla használata
```

### KRITIKUS: Komponens regisztráció minta

**FONTOS**: Minden paraméterező komponensnek regisztrálnia kell a gyermek komponenseket, amelyeket használ!

```javascript
// ✅ HELYES - Komponens regisztráció
const ParamListaKezelo = {
    name: 'param-lista-kezelo',
    components: {
        'param-tabla': ParamTabla,
        'param-szerkeszto': ParamSzerkeszto
    },
    emits: ['save', 'change'],
    props: {
        listaTipus: String
    },
    // ... további kód
};

// ❌ HELYTELEN - Komponens regisztráció hiányzik
const ParamListaKezelo = {
    name: 'param-lista-kezelo',
    emits: ['save', 'change'],  // components: {} hiányzik!
    props: {
        listaTipus: String
    },
    // ... Vue warning: Failed to resolve component: param-tabla
};
```

### Script betöltési sorrend (KRITIKUS!)

A komponenseket a függőségi sorrendben kell betölteni:

```html
<!-- HELYES SORREND -->
<script src="../assets/js/vihar-config.js"></script>
<script src="../assets/js/vihar-common.js"></script>
<script src="../assets/js/vihar-mock-data.js"></script>

<!-- Alap komponensek ELŐSZÖR -->
<script src="../assets/js/components/parameterezo/param-header.js"></script>
<script src="../assets/js/components/parameterezo/param-tabla.js"></script>
<script src="../assets/js/components/parameterezo/param-szerkeszto.js"></script>

<!-- Összetett komponensek UTÁNA -->
<script src="../assets/js/components/parameterezo/param-lista-kezelo.js"></script>
<script src="../assets/js/components/parameterezo/param-hataridok.js"></script>
<script src="../assets/js/components/parameterezo/param-dijtetelek.js"></script>
<script src="../assets/js/components/parameterezo/param-dokumentum.js"></script>
<script src="../assets/js/components/parameterezo/param-workflow.js"></script>
```

### Mock adatok struktúra a paraméterezőhöz

```javascript
// vihar-mock-data.js
const VIHARMockData = {
    parameterezo: {
        // Ellenőrzési listák - F-0064, F-0065, F-0066
        ellenorzesi_lista_hataskor: {
            lista_kod: "F-0064",
            megnevezes: "Hatáskör és illetékesség vizsgálat",
            kriteriumok: [
                {
                    id: 1,
                    megnevezes: "Hatáskör biztosított",
                    sorrend: 1,
                    kotelezo: true,
                    aktiv: true
                }
                // ... további kritériumok
            ]
        },

        // Határidők
        hataridok: [
            {
                id: 1,
                megnevezes: "Formai ellenőrzés határideje",
                napok: 8,
                tipus: "munkanap",
                aktiv: true
            }
            // ... további határidők
        ],

        // Díjtételek - F-0070, F-0082
        dijtetelek: {
            V_044: {
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                dijak: [
                    {
                        id: 1,
                        megnevezes: "Előzetes alkalmassági vizsgálat alapdíja",
                        osszeg: 12000,
                        tipus: "alapdij",  // vagy "potdij"
                        kotelezo: true,
                        aktiv: true
                    }
                ],
                kedvezmenyek: [
                    {
                        id: 1,
                        megnevezes: "Munkahelyi átképzés keretében",
                        szazalek: 30,
                        aktiv: true
                    }
                ],
                jogszabaly: "123/2023. (XII. 15.) Korm. rendelet"
            },
            H_052: {
                // Hasonló struktúra hajózási modulhoz
            }
        },

        // Dokumentum sablonok - F-0091-095
        dokumentum_sablonok: {
            vegzes: [
                {
                    id: 1,
                    kod: "V-VGZ-001",
                    megnevezes: "Hiánypótlási felszólítás végzés",
                    tipus: "vegzes",
                    sablon_fajl: "v_vegzes_hianypotlas.docx"
                }
            ],
            hatrozat: [ /* ... */ ],
            igazolas: [ /* ... */ ],
            tajekoztatas: [ /* ... */ ],
            hirdetmeny: [ /* ... */ ]
        },

        // Workflow sablonok
        workflow_sablonok: [
            {
                id: 1,
                kod: "WF-V044-001",
                megnevezes: "Vasúti járművezető alkalmassági vizsgálat",
                lepesek: 12,
                aktiv: true
            }
        ],

        // Szerepkörök
        szerepkorok: [
            {
                kod: "VHF_ADMIN",
                nev: "Rendszergazda",
                leiras: "Teljes hozzáférés",
                jogosultsagok: ["*"]
            }
        ]
    }
};
```

### Paraméterező komponens implementációs minta

```javascript
// param-dijtetelek.js - Teljes CRUD példa
const ParamDijtetelek = {
    name: 'param-dijtetelek',

    // KRITIKUS: Gyermek komponensek regisztrálása
    components: {
        'param-tabla': ParamTabla
    },

    emits: ['save', 'change'],

    props: {
        ugytipus: {
            type: String,
            default: 'V-044',
            validator: (value) => ['V-044', 'H-052'].includes(value)
        }
    },

    data() {
        return {
            dijak: [],
            kedvezmenyek: [],
            metaInfo: {},
            hasChanges: false,
            showDijEditor: false,
            selectedDij: null,
            editMode: 'create'
        };
    },

    computed: {
        // Számított értékek
        alapdijOsszeg() {
            return this.dijak
                .filter(d => d.tipus === 'alapdij' && d.aktiv)
                .reduce((sum, d) => sum + d.osszeg, 0);
        },

        dijStatisztika() {
            return {
                osszes: this.dijak.length,
                aktiv: this.dijak.filter(d => d.aktiv).length,
                alapdij: this.dijak.filter(d => d.tipus === 'alapdij').length,
                potdij: this.dijak.filter(d => d.tipus === 'potdij').length
            };
        }
    },

    methods: {
        // CREATE
        openCreateDijDialog() {
            this.editMode = 'create';
            this.selectedDij = {
                megnevezes: '',
                osszeg: 0,
                tipus: 'potdij',
                kotelezo: false,
                aktiv: true
            };
            this.showDijEditor = true;
        },

        // UPDATE
        editDij(dij) {
            this.editMode = 'edit';
            this.selectedDij = { ...dij };
            this.showDijEditor = true;
        },

        // DELETE
        deleteDij(dij) {
            if (confirm(`Biztosan törli: ${dij.megnevezes}?`)) {
                const index = this.dijak.findIndex(d => d.id === dij.id);
                if (index > -1) {
                    this.dijak.splice(index, 1);
                    this.hasChanges = true;
                    this.$emit('change', { dijak: this.dijak });
                }
            }
        },

        // SAVE
        saveDij() {
            if (this.editMode === 'create') {
                this.dijak.push({
                    id: Date.now(),
                    ...this.selectedDij
                });
            } else {
                const index = this.dijak.findIndex(d => d.id === this.selectedDij.id);
                if (index > -1) {
                    this.dijak[index] = { ...this.selectedDij };
                }
            }
            this.hasChanges = true;
            this.closeDijEditor();
            this.$emit('change', { dijak: this.dijak });
        },

        // LOAD
        loadDijak() {
            const mockKey = this.ugytipus.replace('-', '_');
            if (VIHARMockData?.parameterezo?.dijtetelek?.[mockKey]) {
                const data = VIHARMockData.parameterezo.dijtetelek[mockKey];
                this.dijak = JSON.parse(JSON.stringify(data.dijak || []));
                this.kedvezmenyek = JSON.parse(JSON.stringify(data.kedvezmenyek || []));
                this.metaInfo = { ...data };
            }
        }
    },

    watch: {
        ugytipus() {
            this.loadDijak();
        }
    },

    mounted() {
        this.loadDijak();
    }
};
```

### F-0070 Díjkalkulátor implementáció

```javascript
// Díjkalkulátor logika
computed: {
    // Alapdíj összesen
    calculatorAlapdij() {
        return this.calculatorSelectedDijak
            .filter(d => d.tipus === 'alapdij')
            .reduce((sum, d) => sum + d.osszeg, 0);
    },

    // Pótdíjak összesen
    calculatorPotdij() {
        return this.calculatorSelectedDijak
            .filter(d => d.tipus === 'potdij')
            .reduce((sum, d) => sum + d.osszeg, 0);
    },

    // Kedvezmény összege
    calculatorKedvezmenyOsszeg() {
        if (!this.calculatorKedvezmeny) return 0;
        const osszeg = this.calculatorAlapdij + this.calculatorPotdij;
        return Math.round(osszeg * this.calculatorKedvezmeny.szazalek / 100);
    },

    // Végösszeg
    calculatorVegosszeg() {
        return this.calculatorAlapdij +
               this.calculatorPotdij -
               this.calculatorKedvezmenyOsszeg;
    }
},

methods: {
    // F-0082 - Díjbekérő generálás
    generateDijbekero() {
        const dijbekero = {
            ugyazonosito: this.ugyazonosito,
            ugytipus: this.ugytipus,
            alapdij: this.calculatorAlapdij,
            potdijak: this.calculatorPotdij,
            kedvezmeny: this.calculatorKedvezmenyOsszeg,
            vegosszeg: this.calculatorVegosszeg,
            generalasDatum: new Date().toISOString()
        };

        // Mock: PDF generálás jelzése
        console.log('[F-0082] Díjbekérő generálva:', dijbekero);
        alert('Díjbekérő PDF generálva: ' +
              this.formatCurrency(dijbekero.vegosszeg));
    },

    formatCurrency(value) {
        return new Intl.NumberFormat('hu-HU', {
            style: 'currency',
            currency: 'HUF',
            maximumFractionDigits: 0
        }).format(value);
    }
}
```

### Navigáció konzisztencia a paraméterező modulban

**MINDEN** paraméterező oldal bal oldali menüjében ezek a menüpontok jelennek meg (ebben a sorrendben):

```html
<div class="list-group list-group-flush">
    <a href="../index.html" class="list-group-item list-group-item-action">
        <i class="bi bi-house"></i> Főoldal
    </a>
    <a href="index.html" class="list-group-item list-group-item-action">
        <i class="bi bi-sliders"></i> Paraméterező Dashboard
    </a>
    <hr class="my-0">
    <a href="ellenorzesi-listak.html" class="list-group-item list-group-item-action">
        <i class="bi bi-list-check"></i> Ellenőrzési Listák
    </a>
    <a href="hataridok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-calendar-event"></i> Határidők
    </a>
    <a href="dijtetelek.html" class="list-group-item list-group-item-action">
        <i class="bi bi-cash-stack"></i> Díjtételek
    </a>
    <a href="dokumentum-sablonok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-file-earmark-text"></i> Dokumentum Sablonok
    </a>
    <a href="workflow-sablonok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-diagram-3"></i> Workflow Sablonok
    </a>
    <a href="nyilvantartasok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-database"></i> Nyilvántartások
    </a>
    <a href="felhasznalok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-people"></i> Felhasználók
    </a>
    <a href="szerepkorok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-shield-check"></i> Szerepkörök
    </a>
</div>
```

Az aktív oldalnál használd az `active` class-t és egy badge-et:
```html
<a href="dijtetelek.html" class="list-group-item list-group-item-action active">
    <i class="bi bi-cash-stack"></i> Díjtételek
    <span class="badge bg-success float-end">Aktív</span>
</a>
```

## 📊 Mintaadatok

### Ügyfél adatok (Külső rendszer)
```javascript
const mintaUgyfel = {
  nev: "Minta János",
  szuletesiNev: "Minta János",
  szuletesiHely: "Budapest",
  szuletesiDatum: "1985-03-15",
  anyaNeve: "Nagy Mária",
  lakcim: {
    iranyitoszam: "1011",
    telepules: "Budapest",
    kozterulet: "Fő utca",
    hazszam: "1"
  },
  ertesitesiCim: null, // ugyanaz mint lakcím
  telefonszam: "+36301234567",
  email: "minta.janos@example.hu"
};
```

### Ügyintéző adatok (Belső rendszer)
```javascript
const mintaUgyintezo = {
  azonosito: "EKM001",
  nev: "Dr. Szabó Péter",
  beosztas: "vezető ügyintéző",
  szervezet: "Építési és Közlekedési Minisztérium",
  szervezetiEgyseg: "Vasúti Hatósági Főosztály",
  szerepkor: "VHF_UGYINTEZO",
  jogosultsagok: [
    "kérelem_vizsgálat",
    "formai_ellenőrzés", 
    "tartalmi_ellenőrzés",
    "döntés_előkészítés"
  ]
};
```

### Ügy adatok
```javascript
const mintaUgy = {
  // Vasúti ügy
  vasut: {
    ugyazonosito: "VAHAP-V-2024-001234",
    ugytipus: "V-044",
    megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
    statusz: "folyamatban",
    benyujtasDatum: "2024-10-15",
    hatarido: "2024-11-15",
    ugyintezo: "Dr. Szabó Péter"
  },
  
  // Hajózási ügy
  hajozas: {
    ugyazonosito: "VAHAP-H-2024-005678",
    ugytipus: "H-052",
    megnevezes: "Országos közforgalmú kikötő létesítése",
    statusz: "hiánypótlás",
    benyujtasDatum: "2024-10-01",
    hatarido: "2024-12-01",
    ugyintezo: "Nagy Andrea"
  }
};
```

## 🌐 Interfész kapcsolatok

### EKEIDR interfész
```javascript
// F-0078 - VAHAP érkeztetés
const erkeztetes = {
  endpoint: '/api/ekeidr/erkeztetes',
  method: 'POST',
  bemenet: 'DS-0090', // VAHAP érkeztetési adatok
  kimenet: 'DS-0102'  // EKEIDR érkeztetési adatok
};

// F-0079 - VAHAP bejövő iktatás
const bejovo_iktatas = {
  endpoint: '/api/ekeidr/bejovo-iktatas',
  method: 'POST',
  bemenet: 'DS-0089', // Adatok EKEIDR bejövő alszámos iktatáshoz
  kimenet: 'DS-0086'  // EKEIDR bejövő iktatási adatok
};
```

## 📝 Magyar terminológia - Bővített

### Általános kifejezések
```
Ügyintézés – Case management
Kérelem – Application/Request
Hatáskör – Jurisdiction
Illetékesség – Competence
Hiánypótlás – Supplementation
Tényállás tisztázása – Fact-finding
Döntéshozatal – Decision making
Kiadmányozás – Issuance
Jogorvoslat – Legal remedy
Fellebbezés – Appeal
```

### Vasúti specifikus
```
Járművezető – Train driver
Alkalmassági vizsgálat – Fitness examination
Vasútegészségügyi – Railway health
Előzetes vizsgálat – Preliminary examination
Képesítés – Qualification
```

### Hajózási specifikus
```
Kikötő – Port/Harbor
Víziút – Waterway
Létesítmény – Facility
Hajózási hatóság – Maritime authority
Szakhatóság – Specialized authority
Helyszíni szemle – On-site inspection
Műszaki terv – Technical plan
```

### Státuszok (bővített)
```
Beérkezett – Received
Érkeztetett – Registered
Folyamatban – In progress
Hiánypótlásra vár – Awaiting supplementation
Tényállás tisztázás alatt – Under fact-finding
Döntésre vár – Awaiting decision
Kiadmányozva – Issued
Lezárt – Closed
Felfüggesztett – Suspended
Visszavont – Withdrawn
```

### Űrlap mezők
```
Kötelező mező – Required field
Opcionális – Optional
Érvénytelen – Invalid
Helyes formátum – Valid format
Hiányzó adat – Missing data
Maximális hossz – Maximum length
Minimum érték – Minimum value
```

## ⚠️ Fontos figyelmeztetések

### Mit NE csináljunk
```
❌ NE használj angol nyelvű elemeket
❌ NE térj el a 3 oszlopos struktúrától a belső rendszerben
❌ NE hagyj ki funkciókódokat és UCE kódokat
❌ NE keverd a vasúti és hajózási specifikus funkciókat
❌ NE használj nem specifikált színeket
❌ NE módosítsd a jobb oldali panelek sorrendjét
❌ NE implementálj backend logikát
❌ NE használj valós személyes adatokat
❌ NE felejtsd el regisztrálni a gyermek komponenseket (components: {})
❌ NE töltsd be a script-eket rossz sorrendben
❌ NE hagyj ki menüpontokat a paraméterező oldalakról
```

### Mit MINDIG tegyünk
```
✅ MINDIG magyar nyelvű legyen minden
✅ MINDIG tüntesd fel a funkciókódokat
✅ MINDIG kövesd a specifikációt
✅ MINDIG használd a megfelelő layout struktúrát
✅ MINDIG teszteld a reszponzivitást
✅ MINDIG használj Vue.js reaktivitást
✅ MINDIG kommentezz magyarul
✅ MINDIG validáld az űrlap adatokat
✅ MINDIG regisztráld a gyermek komponenseket (ParamTabla, ParamSzerkeszto)
✅ MINDIG töltsd be a függőségeket először (param-tabla.js előbb, mint param-lista-kezelo.js)
✅ MINDIG add hozzá a teljes navigációs menüt minden paraméterező oldalhoz
✅ MINDIG használj emits: ['save', 'change'] eseményeket a paraméterező komponensekben
✅ MINDIG deep copy-t készíts a mock adatokból (JSON.parse(JSON.stringify()))
```

## 📚 Dokumentációk

### Kötelező olvasmányok fejlesztés előtt
1. `VAHAP Vasúti Modul Logikai Specifikáció.md` - Vasúti modul teljes specifikációja
2. `VAHAP Hajózási Modul Logikai Specifikáció.md` - Hajózási modul teljes specifikációja
3. Ez a `CLAUDE.md` fájl - Fejlesztési útmutató

### Fejlesztési ellenőrzőlista

#### Vasúti/Hajózási modulok fejlesztéséhez
```markdown
- [ ] Specifikáció tanulmányozása
- [ ] Funkciókódok azonosítása
- [ ] UCE kódok azonosítása
- [ ] Modul típus meghatározása (külső/belső)
- [ ] Layout struktúra kiválasztása
- [ ] Komponensek tervezése
- [ ] Magyar feliratok előkészítése
- [ ] Vue komponensek implementálása
- [ ] Funkciókódok megjelenítése
- [ ] UCE kódok megjelenítése
- [ ] Mintaadatok beillesztése
- [ ] Reszponzivitás tesztelése
- [ ] Kereszt-modul funkciók ellenőrzése
- [ ] Dokumentáció frissítése
```

#### Paraméterező modul komponens fejlesztéséhez
```markdown
- [ ] Komponens nevének meghatározása (pl. param-xyz.js)
- [ ] Funkciókódok azonosítása (F-xxxx)
- [ ] Mock adatstruktúra megtervezése (VIHARMockData.parameterezo)
- [ ] Gyermek komponensek azonosítása (ParamTabla, ParamSzerkeszto)
- [ ] Komponens regisztráció implementálása (components: {})
- [ ] Props és emits definiálása
- [ ] CRUD metódusok implementálása (create, read, update, delete)
- [ ] Data reaktivitás biztosítása (hasChanges)
- [ ] Computed properties (összesítések, szűrések)
- [ ] Mock adatok betöltése (loadXxx() metódus)
- [ ] Deep copy használata (JSON.parse(JSON.stringify()))
- [ ] Change events küldése (@emit('change'))
- [ ] HTML oldal létrehozása
- [ ] Script betöltési sorrend ellenőrzése
- [ ] Navigációs menü hozzáadása (mind a 9 menüpont)
- [ ] Active állapot jelzése
- [ ] Breadcrumb beállítása
- [ ] Funkció tesztelése
- [ ] Console hibák ellenőrzése
```

## 🚀 Kezdő lépések

1. **Főoldal létrehozása**
   ```html
   <!-- index.html -->
   <h1>VAHAP - Vasúti és Hajózási Integrált Hatósági Rendszer</h1>
   <div class="row">
     <div class="col-md-6">
       <h3>Vasúti Modul (V-044)</h3>
       <a href="/vasut/kulso/">Ügyfél belépés</a>
       <a href="/vasut/belso/">Ügyintéző belépés</a>
     </div>
     <div class="col-md-6">
       <h3>Hajózási Modul (H-052)</h3>
       <a href="/hajozas/kulso/">Ügyfél belépés</a>
       <a href="/hajozas/belso/">Ügyintéző belépés</a>
     </div>
   </div>
   ```

2. **Közös CSS beállítása**
3. **Vue.js inicializálása**
4. **Első modul implementálása**

## 🐛 Gyakori hibák és megoldások

### 1. "Failed to resolve component: param-tabla"

**Hiba:**
```
[Vue warn]: Failed to resolve component: param-tabla
[Vue warn]: Failed to resolve component: param-szerkeszto
```

**Ok:** A komponens használja a `<param-tabla>` vagy `<param-szerkeszto>` komponenst a template-ben, de nem regisztrálta őket a `components` objektumban.

**Megoldás:**
```javascript
// ✅ HELYES
const ParamListaKezelo = {
    name: 'param-lista-kezelo',
    components: {
        'param-tabla': ParamTabla,
        'param-szerkeszto': ParamSzerkeszto
    },
    // ... további kód
};

// ❌ HELYTELEN (components hiányzik)
const ParamListaKezelo = {
    name: 'param-lista-kezelo',
    emits: ['save', 'change'],
    // ... további kód
};
```

### 2. "ParamTabla is not defined"

**Hiba:**
```
param-lista-kezelo.js:9 Uncaught ReferenceError: ParamTabla is not defined
```

**Ok:** A HTML fájlban a script fájlok rossz sorrendben vannak betöltve. A `param-tabla.js` nincs betöltve, amikor a `param-lista-kezelo.js` próbálja használni.

**Megoldás:**
```html
<!-- ✅ HELYES SORREND -->
<script src="../assets/js/vihar-config.js"></script>
<script src="../assets/js/vihar-common.js"></script>
<script src="../assets/js/vihar-mock-data.js"></script>

<!-- Alap komponensek ELŐSZÖR -->
<script src="../assets/js/components/parameterezo/param-tabla.js"></script>
<script src="../assets/js/components/parameterezo/param-szerkeszto.js"></script>

<!-- Összetett komponensek UTÁNA -->
<script src="../assets/js/components/parameterezo/param-lista-kezelo.js"></script>

<!-- ❌ HELYTELEN (param-tabla.js hiányzik vagy rossz helyen van) -->
<script src="../assets/js/components/parameterezo/param-lista-kezelo.js"></script>
<script src="../assets/js/components/parameterezo/param-tabla.js"></script>
```

### 3. "Unexpected identifier" szintaktikai hiba

**Hiba:**
```
Uncaught SyntaxError: Unexpected identifier 'isztazas'
```

**Ok:** Elírás a metódus nevében, általában extra space karakter.

**Megoldás:**
```html
<!-- ✅ HELYES -->
<button @click="benyujtTenyallasTisztazas">Benyújtás</button>

<!-- ❌ HELYTELEN (szóköz a névben) -->
<button @click="benyujtTenyallasT isztazas">Benyújtás</button>
```

### 4. Mock adatok nem töltődnek be

**Hiba:** A komponens betölt, de az adatok üresek, console log mutatja: `Loaded 0 kriteriumok`

**Ok:** Rossz mock data kulcs vagy a mock data struktúra nem egyezik.

**Megoldás:**
```javascript
// ✅ HELYES
loadKriteriumok() {
    const mockKey = `ellenorzesi_lista_${this.listaTipus}`;  // pl. "ellenorzesi_lista_hataskor"

    if (VIHARMockData?.parameterezo?.[mockKey]) {
        this.kriteriumok = JSON.parse(JSON.stringify(
            VIHARMockData.parameterezo[mockKey].kriteriumok || []
        ));
    }
}

// ❌ HELYTELEN (rossz kulcs formátum)
loadKriteriumok() {
    const mockKey = `lista-${this.listaTipus}`;  // hibás formátum
    // ...
}
```

**Debug tipp:**
```javascript
loadKriteriumok() {
    const mockKey = `ellenorzesi_lista_${this.listaTipus}`;
    console.log('[DEBUG] Looking for key:', mockKey);
    console.log('[DEBUG] Available keys:',
        VIHARMockData?.parameterezo ? Object.keys(VIHARMockData.parameterezo) : 'N/A'
    );
    // ... további kód
}
```

### 5. Adatmódosítások nem mentődnek el

**Hiba:** Szerkesztés után a változások nem jelennek meg vagy elvesznek.

**Ok:** Nem készítettél deep copy-t a mock adatokból, így a referencia miatt felülíródnak.

**Megoldás:**
```javascript
// ✅ HELYES - Deep copy
loadDijak() {
    const data = VIHARMockData.parameterezo.dijtetelek.V_044;
    this.dijak = JSON.parse(JSON.stringify(data.dijak || []));
    this.kedvezmenyek = JSON.parse(JSON.stringify(data.kedvezmenyek || []));
}

// ❌ HELYTELEN - Referencia másolás
loadDijak() {
    const data = VIHARMockData.parameterezo.dijtetelek.V_044;
    this.dijak = data.dijak;  // Referencia, nem deep copy!
    this.kedvezmenyek = data.kedvezmenyek;
}
```

### 6. Díjkalkulátor nem számol jól

**Hiba:** A díjkalkulátor összege 0 vagy NaN.

**Ok:** A `calculatorSelectedDijak` tömb nem inicializálódott vagy nincs benne adat.

**Megoldás:**
```javascript
// ✅ HELYES - Kötelező díjak auto-kiválasztása
watch: {
    showCalculator(newVal) {
        if (newVal && this.currentDijak) {
            // Kötelező díjak automatikus kiválasztása
            this.calculatorSelectedDijak = this.currentDijak.dijak
                .filter(d => d.kotelezo && d.aktiv);
        }
    }
},

mounted() {
    // Inicializálás mountoláskor is
    if (this.currentDijak) {
        this.calculatorSelectedDijak = this.currentDijak.dijak
            .filter(d => d.kotelezo && d.aktiv);
    }
}

// ❌ HELYTELEN - Nincs inicializálás
data() {
    return {
        calculatorSelectedDijak: []  // Üres marad
    };
}
```

### 7. Navigációs menü hiányzik egyes oldalakon

**Hiba:** Egyes paraméterező oldalakon hiányzik a "Díjtételek" vagy más menüpont.

**Ok:** Új oldal hozzáadásakor elfelejtetted frissíteni a többi oldal menüjét.

**Megoldás:** Használd ezt a teljes menü template-et MINDEN paraméterező oldalon:

```html
<div class="list-group list-group-flush">
    <a href="../index.html" class="list-group-item list-group-item-action">
        <i class="bi bi-house"></i> Főoldal
    </a>
    <a href="index.html" class="list-group-item list-group-item-action">
        <i class="bi bi-sliders"></i> Paraméterező Dashboard
    </a>
    <hr class="my-0">
    <a href="ellenorzesi-listak.html" class="list-group-item list-group-item-action">
        <i class="bi bi-list-check"></i> Ellenőrzési Listák
    </a>
    <a href="hataridok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-calendar-event"></i> Határidők
    </a>
    <a href="dijtetelek.html" class="list-group-item list-group-item-action">
        <i class="bi bi-cash-stack"></i> Díjtételek
    </a>
    <a href="dokumentum-sablonok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-file-earmark-text"></i> Dokumentum Sablonok
    </a>
    <a href="workflow-sablonok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-diagram-3"></i> Workflow Sablonok
    </a>
    <a href="nyilvantartasok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-database"></i> Nyilvántartások
    </a>
    <a href="felhasznalok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-people"></i> Felhasználók
    </a>
    <a href="szerepkorok.html" class="list-group-item list-group-item-action">
        <i class="bi bi-shield-check"></i> Szerepkörök
    </a>
</div>
```

### 8. VIHARMockData vagy VahapMockData?

**Hiba:** Néha `VIHARMockData` működik, néha nem, vagy `VahapMockData` van használva.

**Ok:** Konzisztencia hiánya a mock data objektum elnevezésében.

**Megoldás:**

**HIVATALOS NÉV**: `VIHARMockData` (régebbi részeken `VahapMockData` lehet, de ne használd!)

```javascript
// ✅ HELYES
if (VIHARMockData?.parameterezo?.dijtetelek) {
    // ...
}

// ❌ HELYTELEN (régi név)
if (VahapMockData?.parameterezo?.dijtetelek) {
    // ...
}
```

**Átnevezési útmutató:** Ha `VahapMockData`-t találsz a kódban, nevezd át `VIHARMockData`-ra konzisztencia érdekében.

## 🎓 Best Practices Összefoglaló

### Vue.js komponensek
1. **Mindig regisztráld** a gyermek komponenseket (`components: {}`)
2. **Használj emits** deklarációt (`emits: ['save', 'change']`)
3. **Deep copy** a mock adatokból (`JSON.parse(JSON.stringify())`)
4. **Prop validáció** fontos típusoknál
5. **Computed properties** összesítésekhez, ne methods
6. **Watch** használata prop változásokra való reagáláshoz

### Mock adatok
1. **Központosított** struktúra (`VIHARMockData.parameterezo`)
2. **Konzisztens** kulcs nevek (snake_case: `ellenorzesi_lista_hataskor`)
3. **Minden objektumnak** legyen `id` mezője
4. **Boolean flagek** (`aktiv`, `kotelezo`) alapértéke mindig definiált legyen

### HTML oldalak
1. **Script sorrend** kritikus (függőségek először)
2. **Teljes navigációs menü** minden paraméterező oldalon
3. **Breadcrumb** minden oldalon legyen
4. **Fejléc komponens** (`param-header`) használata kötelező

### Hibakeresés
1. **Console.log** használata a debug módban
2. **Browser DevTools** Vue.js kiterjesztés használata
3. **Network tab** ellenőrzése (betöltődtek-e a script-ek?)
4. **Console errors** mindig először javítandók