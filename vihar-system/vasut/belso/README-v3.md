# VAHAP Vasúti Ügyintézői Munkalap v3

## Áttekintés

Az új **v3 verzió** egy modern, 2 oszlopos layoutú ügyintézői felület egységes workflow komponensekkel.

## Főbb jellemzők

### Architektúra
- **2 oszlopos layout**: Munkaterület (bal) + Összecsukható oldalsáv (jobb)
- **Vue.js 3** alapú reaktív komponensek
- **Moduláris workflow komponensek**: Minden lépés önálló komponens
- **Egységes dizájn**: Bootstrap 5 + egyedi VAHAP stílusok

### Workflow komponensek

#### Teljes implementációval:
1. **Szignálás** (`wf-szignalas.js`) - Ügy hozzárendelése ügyintézőhöz
2. **Checklist** (`wf-checklist.js`) - Ellenőrzési listák (F-0064, F-0065, F-0066)
3. **Dokumentum gyártás** (`wf-dokumentum-gyartas.js`) - Sablonok alapú generálás (F-0091-F-0095)
4. **Döntés** (`wf-dontes.js`) - Workflow elágazási pontok

#### Placeholder implementációval:
5. **Iktatás** (`wf-iktatas.js`)
6. **Nyilvántartás** (`wf-nyilvantartas.js`)
7. **Véleményezés** (`wf-velemenyezes.js`)
8. **Kiadmányozás** (`wf-kiadmanyozas.js`)
9. **Expediálás** (`wf-expedialas.js`)
10. **Rugalmas workflow** (`wf-rugalmas-workflow.js`)

## Fájlstruktúra

```
vasut/belso/
├── ugy-munkalap-v3.html          # Fő alkalmazás
├── test-v3.html                   # Egyszerű teszt oldal
└── README-v3.md                   # Ez a fájl

assets/
├── css/
│   └── vihar-workflow-v3.css      # Workflow specifikus stílusok
└── js/
    ├── vihar-config.js             # Konfiguráció
    ├── vihar-common.js             # Közös funkciók
    ├── vihar-mock-data.js          # Tesztadatok
    ├── components/workflow/        # Workflow komponensek
    │   ├── wf-szignalas.js
    │   ├── wf-checklist.js
    │   ├── wf-dokumentum-gyartas.js
    │   ├── wf-dontes.js
    │   ├── wf-iktatas.js
    │   ├── wf-nyilvantartas.js
    │   ├── wf-velemenyezes.js
    │   ├── wf-kiadmanyozas.js
    │   ├── wf-expedialas.js
    │   └── wf-rugalmas-workflow.js
    └── apps/
        └── vihar-munkalap-v3-app.js  # Főalkalmazás
```

## Használat

### 1. Teszt oldal (egyszerű)
```
vasut/belso/test-v3.html
```
Ez egy egyszerű oldal, ami csak a Vue működését teszteli.

### 2. Teljes alkalmazás
```
vasut/belso/ugy-munkalap-v3.html
```
A teljes workflow rendszer minden komponenssel.

### Böngészőben való megnyitás

**FONTOS**: A fájlokat **webszerver-en keresztül** kell megnyitni, nem `file://` protokollal!

#### Opció 1: Python webszerver (ajánlott)
```bash
cd "/Users/galamboslaszlo/Library/Mobile Documents/com~apple~CloudDocs/_claude project/VAHAP/vihar-system"

# Python 3
python3 -m http.server 8000

# Majd nyisd meg: http://localhost:8000/vasut/belso/ugy-munkalap-v3.html
```

#### Opció 2: Node.js http-server
```bash
npx http-server -p 8000
```

#### Opció 3: VS Code Live Server
- Telepítsd a "Live Server" extensiont
- Jobb klikk az `ugy-munkalap-v3.html` fájlra
- "Open with Live Server"

## Hibaelhárítás

### 1. Az oldal üres / Vue nem töltődik be

**Tünet**: A képernyőn csak `{{ }}` jelölések látszanak

**Megoldás**:
1. Nyisd meg a böngésző Console-t (F12)
2. Nézd meg a Debug üzeneteket:
   ```
   === VAHAP v3 Debug Info ===
   Vue betöltve: true
   VahapMunkalapV3App létezik: true
   ```
3. Ha `false` értékeket látsz, ellenőrizd:
   - Internetkapcsolat (Vue CDN betöltéséhez)
   - JavaScript fájlok elérhetők-e
   - Console hibák

### 2. "CORS policy" hiba

**Tünet**: Console-ban CORS error üzenetek

**Megoldás**:
- NE nyisd meg `file://` protokollal!
- Használj webszervert (lásd fent)

### 3. Komponensek nem jelennek meg

**Tünet**: "Komponens betöltése..." üzenet

**Ellenőrzés**:
```javascript
// Console-ban:
console.log(typeof WfChecklist);  // Kellene: "object"
console.log(typeof WfSzignalas);  // Kellene: "object"
```

**Megoldás**:
- Ellenőrizd a script betöltési sorrendet
- Töröld a böngésző cache-t (Ctrl+Shift+Del)
- Hard reload (Ctrl+F5)

### 4. Workflow lépések nem működnek

**Tünet**: Kattintás a workflow lépésekre nem vált

**Megoldás**:
1. Nézd meg a Console-t hibákért
2. Ellenőrizd, hogy az előző lépések be vannak-e fejezve
3. Csak a befejezett vagy az aktuális lépés választható

## Fejlesztés

### Új komponens hozzáadása

1. **Komponens létrehozása**:
```javascript
// assets/js/components/workflow/wf-uj-komponens.js
const WfUjKomponens = {
    name: 'wf-uj-komponens',
    props: {
        ugy: { type: Object, required: true },
        stepData: { type: Object, default: () => ({}) }
    },
    emits: ['action', 'complete'],
    template: `
        <div class="component-card">
            <!-- Komponens tartalma -->
        </div>
    `
};
```

2. **Betöltés a HTML-ben**:
```html
<script src="../../assets/js/components/workflow/wf-uj-komponens.js"></script>
```

3. **Regisztráció az app-ban**:
```javascript
// vihar-munkalap-v3-app.js
components: {
    'wf-uj-komponens': typeof WfUjKomponens !== 'undefined' ? WfUjKomponens : { ... }
}
```

4. **Workflow lépés hozzáadása**:
```javascript
workflowSteps: [
    // ...
    {
        id: 'uj_lepes',
        name: 'Új lépés',
        code: 'UCE-XXXX',
        icon: 'bi-icon-name',
        component: 'wf-uj-komponens',
        completed: false
    }
]
```

## Jelenlegi állapot

### Működik ✅
- 2 oszlopos layout
- Workflow státusz sáv
- Akta fa struktúra
- Döntési pontok
- Szignálás komponens (teljes)
- Checklist komponens (teljes)
- Dokumentum gyártás (teljes)
- Döntés komponens (alap)

### Fejlesztés alatt 🚧
- Iktatás (EKEIDR interfész)
- Nyilvántartás (VNY024, HNY501)
- Véleményezés
- Kiadmányozás
- Expediálás
- Rugalmas workflow

## Specifikáció szerint

A rendszer a következő specifikációkat követi:
- **VAHAP Vasúti Modul Logikai Specifikáció.md**
- **CLAUDE.md** - Fejlesztési útmutató

### Funkciókódok
- F-0064: Hatáskör vizsgálat ✅
- F-0065: Formai ellenőrzés ✅
- F-0066: Tartalmi vizsgálat ✅
- F-0091-095: Dokumentum generálás ✅
- F-0088: Döntés előkészítés ✅

### UCE kódok
- UCE-1761: Szignálás ✅
- UCE-1793: Hatáskör vizsgálat ✅
- UCE-1799: Formai ellenőrzés ✅
- UCE-1794: Tartalmi vizsgálat ✅
- UCE-1800: Döntési pont ✅
- UCE-1810: Határozat készítés ✅

## Teljesítmény

- **Oldal betöltés**: < 2s (jó internet esetén)
- **Komponens váltás**: < 100ms
- **Reaktivitás**: Azonnali (Vue.js)

## Támogatás

Ha problémád van:
1. Nézd meg a Console-t (F12)
2. Ellenőrizd a Debug üzeneteket
3. Teszteld először a `test-v3.html` oldalt
4. Ellenőrizd, hogy webszerver-en keresztül töltöd-e be

## Következő lépések

1. ✅ 2 oszlopos layout
2. ✅ Alapvető komponensek
3. ✅ Workflow kezelés
4. 🚧 Hiányzó komponensek implementálása
5. 🚧 EKEIDR integráció
6. 🚧 Nyilvántartás integráció
7. 📋 Felhasználói tesztelés
8. 📋 Produkciós deploy

---

**Verzió**: 3.0.0
**Utolsó frissítés**: 2024-10-16
**Készítette**: Claude Code
