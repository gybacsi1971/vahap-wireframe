# VAHAP - Fejlesztői Útmutató

## 🎯 Modularizált Rendszer Áttekintése

A VAHAP rendszer **újrafelhasználható komponensekre** lett bontva, hogy könnyű legyen továbbfejleszteni és bővíteni.

### 📦 Központi JavaScript Fájlok

```
assets/js/
├── vihar-config.js       # Konfigurációk, konstansok
├── vihar-common.js       # Közös utility funkciók
├── vihar-mock-data.js    # Központosított tesztadatok
└── vihar-components.js   # Vue komponensek
```

## 🚀 Gyors Kezdés - Új Oldal Létrehozása

### 1. Alapvető HTML Struktúra

```html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VAHAP - Új Modul</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- VAHAP Közös Stílusok -->
    <link rel="stylesheet" href="../../assets/css/vihar-common.css">
</head>
<body>
    <div id="app">
        <!-- Tartalom -->
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Vue.js 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

    <!-- VAHAP Központi Fájlok -->
    <script src="../../assets/js/vihar-config.js"></script>
    <script src="../../assets/js/vihar-common.js"></script>
    <script src="../../assets/js/vihar-mock-data.js"></script>
    <script src="../../assets/js/vihar-components.js"></script>

    <!-- Oldal-specifikus Vue App -->
    <script>
        const { createApp } = Vue;

        createApp({
            components: VahapComponents,
            data() {
                return {
                    // Adatok
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

## 🧩 Komponensek Használata

### ProgressWizard - Lépésenkénti Folyamat (Külső Rendszer)

```html
<ProgressWizard
    :steps="workflowSteps"
    :currentStep="currentStep"
/>
```

```javascript
data() {
    return {
        currentStep: 1,
        workflowSteps: VahapMockData.vasut.workflowSteps
        // Vagy manuálisan:
        // [
        //     { code: 'UCE-1761', label: 'Adatrögzítés' },
        //     { code: 'UCE-1773', label: 'Adatok kitöltése' },
        //     ...
        // ]
    }
}
```

### CaseHeader - Ügyfejléc (Belső Rendszer)

```html
<CaseHeader
    :caseData="caseData"
    :color="moduleColor"
/>
```

```javascript
data() {
    return {
        caseData: VahapMockData.vasut.ugy,
        moduleColor: VahapConfig.modules.vasut.color
    }
}
```

### ChecklistItem - Ellenőrzési Lista Elem

```html
<ChecklistItem
    id="check1"
    label="Hatáskör biztosított"
    description="Az ügy a hatóság hatáskörébe tartozik"
    :checked="checks.hataskort"
    @update:checked="checks.hataskort = $event"
/>
```

### SideNavigation - Bal Oldali Navigáció (Belső Rendszer)

```html
<SideNavigation
    :moduleInfo="moduleInfo"
    :userInfo="userInfo"
    :menuItems="menuItems"
    :actions="actions"
    :activeTab="activeTab"
    @tab-change="activeTab = $event"
/>
```

```javascript
data() {
    return {
        moduleInfo: VahapMockData.helpers.getModuleInfo('vasut'),
        userInfo: VahapMockData.helpers.getUserInfo('vasut'),
        menuItems: VahapMockData.helpers.getNavMenu('vasut'),
        actions: VahapMockData.helpers.getActionsMenu('vasut'),
        activeTab: 'hataskort'
    }
}
```

### Timeline - Előzmények

```html
<Timeline :items="timelineData" />
```

```javascript
data() {
    return {
        timelineData: VahapMockData.vasut.timeline
    }
}
```

### DocumentList - Dokumentum Lista

```html
<DocumentList
    :documents="documents"
    :color="moduleColor"
    @document-click="openDocument"
/>
```

### DecisionPanel - Döntési Pontok Panel

```html
<DecisionPanel
    :decisions="decisions"
    functionCode="F-0088"
    @decision-click="handleDecision"
/>
```

```javascript
data() {
    return {
        decisions: VahapMockData.vasut.dontesiPontok
    }
},
methods: {
    handleDecision(decision) {
        console.log('Döntés:', decision);
        VahapCommon.notifications.info(decision.label);
    }
}
```

### AttachmentList - Melléklet Feltöltő

```html
<AttachmentList
    :attachments="attachments"
    @upload="handleUpload"
/>
```

### StatisticsPanel - Statisztika Panel

```html
<StatisticsPanel :statistics="statistics" />
```

```javascript
data() {
    return {
        statistics: VahapMockData.vasut.statistics
    }
}
```

## 🛠️ Utility Funkciók Használata

### Validáció

```javascript
// Email validáció
if (VahapCommon.validators.email(email)) {
    // OK
}

// Telefonszám validáció
if (VahapCommon.validators.phone(phone)) {
    // OK
}

// Űrlap validáció
const result = VahapCommon.forms.validate(formData, {
    email: ['required', 'email'],
    phone: ['required', 'phone']
});

if (result.isValid) {
    // Mentés
} else {
    console.log(result.errors);
}
```

### Formázás

```javascript
// Dátum formázás
const formatted = VahapCommon.formatters.date('2024-10-15'); // "2024.10.15"

// Pénznem formázás
const amount = VahapCommon.formatters.currency(15000); // "15 000 Ft"

// Telefonszám formázás
const phone = VahapCommon.formatters.phone('+36301234567'); // "+36 30 123 4567"

// Ügyazonosító generálás
const caseId = VahapCommon.formatters.caseId('V', 2024, 1234); // "VAHAP-V-2024-001234"
```

### Határidő Számítások

```javascript
// Határidő hozzáadása (munkanapokban)
const deadline = VahapCommon.deadlines.addBusinessDays(new Date(), 8);

// Hátralévő napok
const remaining = VahapCommon.deadlines.remainingDays('2024-11-15');

// Eltelt napok
const elapsed = VahapCommon.deadlines.elapsedDays('2024-10-15');

// Határidő státusz
const status = VahapCommon.deadlines.getDeadlineStatus('2024-11-15');
// 'expired', 'urgent', 'warning', 'ok'
```

### Értesítések

```javascript
// Sikeres művelet
VahapCommon.notifications.success('Kérelem sikeresen benyújtva');

// Hiba
VahapCommon.notifications.error('Nem sikerült a mentés');

// Figyelmeztetés
VahapCommon.notifications.warning('Hiányos adat');

// Információ
VahapCommon.notifications.info('Folyamatban...');
```

### Local Storage

```javascript
// Mentés
VahapCommon.storage.save('draft', formData);

// Betöltés
const draft = VahapCommon.storage.load('draft');

// Törlés
VahapCommon.storage.remove('draft');

// Összes törlése
VahapCommon.storage.clear();
```

### API Hívások (Mock)

```javascript
// Kérelem benyújtása
const response = await VahapCommon.api.submitApplication('vasut', formData);
if (response.success) {
    console.log('Ügyazonosító:', response.data.ugyazonosito);
}

// Ügy lekérdezése
const caseData = await VahapCommon.api.getCase('VAHAP-V-2024-001234');

// Döntés mentése
await VahapCommon.api.saveDecision(caseId, decision);
```

## 📊 Konfiguráció Használata

### Modul Konfiguráció

```javascript
// Vasúti modul konfigurációja
const vasutConfig = VahapConfig.modules.vasut;

console.log(vasutConfig.code);        // "V-044"
console.log(vasutConfig.name);        // "Vasúti Modul"
console.log(vasutConfig.color);       // "#8B4513"
console.log(vasutConfig.deadlines.sommas); // 8
console.log(vasutConfig.fees.eljarasi);    // 15000
```

### Funkció és Use Case Nevek

```javascript
// Funkció név lekérése
const funcName = VahapConfig.helpers.getFunctionName('F-0064');
// "Hatáskör és illetékesség vizsgálat"

// Use case név lekérése
const useCaseName = VahapConfig.helpers.getUseCaseName('UCE-1793', 'vasut');
// "Hatáskör és illetékesség vizsgálata"

// Státusz név
const status = VahapConfig.helpers.getStatusName('pending');
// "Folyamatban"
```

### Validációs Szabályok

```javascript
// Email pattern
const emailPattern = VahapConfig.validation.email.pattern;
const emailMessage = VahapConfig.validation.email.message;

// Telefon validáció
if (!VahapConfig.validation.phone.pattern.test(phone)) {
    alert(VahapConfig.validation.phone.message);
}
```

## 🎨 Mock Adatok Használata

### Vasúti Modul

```javascript
// Ügyfél adatok
const ugyfel = VahapMockData.vasut.ugyfel;

// Ügy adatok
const ugy = VahapMockData.vasut.ugy;

// VEÜ adatok
const veuAdatok = VahapMockData.vasut.veuAdatok;

// Workflow lépések
const steps = VahapMockData.vasut.workflowSteps;

// Timeline
const timeline = VahapMockData.vasut.timeline;

// Dokumentumok
const docs = VahapMockData.vasut.dokumentumok;
```

### Hajózási Modul

```javascript
// Kérelmező adatok
const kerelmező = VahapMockData.hajozas.kerelmező;

// Létesítmény adatok
const letesitmeny = VahapMockData.hajozas.letesitmenyAdatok;

// Szakhatóságok
const szakhatosagok = VahapMockData.hajozas.szakhatosagok;
```

### Helper Funkciók

```javascript
// Modul adatok
const moduleData = VahapMockData.helpers.getModuleData('vasut');

// Ügyintéző info
const userInfo = VahapMockData.helpers.getUserInfo('hajozas');

// Modul info
const moduleInfo = VahapMockData.helpers.getModuleInfo('vasut');

// Navigációs menü
const navMenu = VahapMockData.helpers.getNavMenu('hajozas');

// Műveletek menü
const actions = VahapMockData.helpers.getActionsMenu('vasut');
```

## 📝 Teljes Példa - Belső Rendszer Oldal

```html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Vasúti Modul - Ügyintéző</title>

    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../../assets/css/vihar-common.css">
</head>
<body>
    <div id="app" class="container-fluid">
        <div class="row vh-100">
            <!-- Bal oszlop: Navigáció -->
            <SideNavigation
                :moduleInfo="moduleInfo"
                :userInfo="userInfo"
                :menuItems="menuItems"
                :actions="actions"
                :activeTab="activeTab"
                @tab-change="activeTab = $event"
            />

            <!-- Középső oszlop: Munkaterület -->
            <div class="col-md-7 p-0 d-flex flex-column">
                <CaseHeader :caseData="caseData" :color="moduleColor" />

                <div class="flex-grow-1 overflow-auto p-3">
                    <div v-if="activeTab === 'hataskort'">
                        <h5>Hatáskör vizsgálat</h5>
                        <ChecklistItem
                            v-for="(item, key) in checklistItems"
                            :key="key"
                            :id="key"
                            :label="item.label"
                            :description="item.description"
                            :checked="checks[key]"
                            @update:checked="checks[key] = $event"
                        />
                    </div>
                </div>
            </div>

            <!-- Jobb oszlop: Döntési panel -->
            <div class="col-md-3 bg-light border-start p-0">
                <div class="d-flex flex-column h-100 overflow-auto">
                    <DecisionPanel
                        :decisions="decisions"
                        @decision-click="handleDecision"
                    />

                    <div class="border-bottom p-3">
                        <h6 class="mb-3">Előzmények</h6>
                        <Timeline :items="timeline" />
                    </div>

                    <div class="border-bottom p-3">
                        <h6 class="mb-3">Dokumentumok</h6>
                        <DocumentList
                            :documents="documents"
                            @document-click="openDocument"
                        />
                    </div>

                    <StatisticsPanel :statistics="statistics" />
                </div>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="../../assets/js/vihar-config.js"></script>
    <script src="../../assets/js/vihar-common.js"></script>
    <script src="../../assets/js/vihar-mock-data.js"></script>
    <script src="../../assets/js/vihar-components.js"></script>

    <script>
        const { createApp } = Vue;

        createApp({
            components: VahapComponents,
            data() {
                return {
                    activeTab: 'hataskort',
                    moduleInfo: VahapMockData.helpers.getModuleInfo('vasut'),
                    userInfo: VahapMockData.helpers.getUserInfo('vasut'),
                    menuItems: VahapMockData.helpers.getNavMenu('vasut'),
                    actions: VahapMockData.helpers.getActionsMenu('vasut'),
                    caseData: VahapMockData.vasut.ugy,
                    moduleColor: VahapConfig.modules.vasut.color,
                    decisions: VahapMockData.vasut.dontesiPontok,
                    timeline: VahapMockData.vasut.timeline,
                    documents: VahapMockData.vasut.dokumentumok,
                    statistics: VahapMockData.vasut.statistics,
                    checks: {
                        hataskort1: false,
                        hataskort2: false
                    },
                    checklistItems: {
                        hataskort1: {
                            label: 'Hatáskör biztosított',
                            description: 'A hatóság hatáskörébe tartozik'
                        },
                        hataskort2: {
                            label: 'Illetékesség rendben',
                            description: 'Területi illetékesség megfelelő'
                        }
                    }
                }
            },
            methods: {
                handleDecision(decision) {
                    console.log('Döntés:', decision);
                    VahapCommon.notifications.info(decision.label);
                },
                openDocument(doc) {
                    console.log('Dokumentum megnyitása:', doc);
                    alert(`Dokumentum: ${doc.name}`);
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

## 🔧 Továbbfejlesztési Lehetőségek

### 1. Új Modul Hozzáadása

1. **Konfiguráció bővítése** (`vihar-config.js`):
```javascript
modules: {
    // ...meglévők
    uj_modul: {
        code: 'X-999',
        name: 'Új Modul',
        color: '#123456',
        // ...
    }
}
```

2. **Mock adatok** (`vihar-mock-data.js`):
```javascript
uj_modul: {
    ugyfel: { /* ... */ },
    ugy: { /* ... */ }
}
```

3. **HTML oldal létrehozása** az útmutató alapján

### 2. Új Komponens Létrehozása

```javascript
// vihar-components.js-ben
const UjKomponens = {
    name: 'UjKomponens',
    props: {
        // ...
    },
    template: `
        <div>
            <!-- ... -->
        </div>
    `
};

// Regisztráció
window.VahapComponents.UjKomponens = UjKomponens;
```

### 3. Új Utility Funkció

```javascript
// vihar-common.js-ben
VahapCommon.ujModul = {
    ujFunkció() {
        // ...
    }
};
```

## ✅ Best Practices

1. **Mindig használd a központi konfigurációt**
   - Ne hardkódolj értékeket
   - Használd a `VahapConfig` objektumot

2. **Mock adatokat központilag kezeld**
   - Ne duplikálj adatokat
   - Használd a `VahapMockData` objektumot

3. **Komponenseket újrafelhasználd**
   - Ne írj új komponenst, ha van meglévő
   - Bővítsd a meglévőket props-okkal

4. **Validációt használj**
   - Minden űrlapon validálj
   - Használd a `VahapCommon.validators` funkciókat

5. **Konzisztens kódolj**
   - Magyar nyelvű minden
   - Funkció és UCE kódokat mindig tüntesd fel
   - Kommentezz magyarul

## 🚀 Összefoglalás

A VAHAP rendszer **teljesen moduláris és újrafelhasználható**:

- ✅ **Komponens-alapú**: Vue komponensek mindenhol
- ✅ **Központi konfiguráció**: Egy helyen minden beállítás
- ✅ **Mock adatok**: Könnyen cserélhető valós API-ra
- ✅ **Utility funkciók**: Közös logika újrafelhasználása
- ✅ **Könnyen bővíthető**: Új modulok egyszerűen hozzáadhatók
- ✅ **Konzisztens**: Egységes kódstílus és struktúra

**Szerverrel működtetni NEM KELL** - ez egy tisztán frontend drótvázmodell, de könnyedén átírható valós backend-re!
