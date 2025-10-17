# VAHAP Ügymunkalap Komponens Fejlesztési Terv

## 1. Jelenlegi Állapot Áttekintés

### ✅ Már Meglévő Architektúra

Az `ugy-munkalap-v2.html` már tartalmaz egy jól strukturált komponens-alapú architektúrát:

**Bal oszlop komponensek:**
- `vihar-workflow-nav.js` - Workflow navigáció

**Középső oszlop (munkaterület) komponensek:**
- `vihar-tab-kerelem.js` - Kérelem adatok
- `vihar-tab-hatáskor.js` - Hatáskör vizsgálat (F-0064, UCE-1793)
- `vihar-tab-formai.js` - Formai ellenőrzés (F-0065, UCE-1799)
- `vihar-tab-tartalmi.js` - Tartalmi vizsgálat (F-0066, UCE-1794)
- `vihar-tab-vny024.js` - VNY024 Vasútegészségügyi Nyilvántartás (F-0090)
- `vihar-tab-sommas.js` - Sommás eljárás döntés (UCE-1800)
- `vihar-tab-dontesi-javaslat.js` - Döntési javaslat (F-0074, UCE-1826)
- `vihar-tab-dokumentumok.js` - Dokumentum generálás (F-0091-095)
- `vihar-tab-velemenyezes.js` - Döntési javaslat véleményezése (F-0096, UCE-1824)
- `vihar-tab-lezaras.js` - Ügy lezárása (F-0097, UCE-1828)
- `vihar-tab-hianypotlas.js` - Hiánypótlási felszólítás (F-0100, UCE-2000)
- `vihar-tab-tenyallas.js` - Tényállás tisztázása (F-0102, UCE-2002)
- `vihar-tab-ertesites.js` - Ügyfél értesítés (F-0089)
- `vihar-tab-vezetoi-dontes.js` - Vezetői döntés (F-0099)

**Jobb oszlop (info panelek) komponensek:**
- `vihar-panel-dontesek.js` - Döntési pontok (F-0088)
- `vihar-panel-elozmenyek.js` - Eljárás előzmények
- `vihar-panel-dokumentumok.js` - Kapcsolódó dokumentumok
- `vihar-panel-ugyfel.js` - Ügyfél információk

**Központi fájlok:**
- `vihar-munkalap-app.js` - Fő alkalmazás logika

---

## 2. Fejlesztési Stratégia

### 2.1. Komponens Architektúra Alapelvek

#### Bal Oszlop Komponensek (Workflow Navigáció)
```
VahapWorkflowNav
├── Props: ugy, activeTab
├── Emit: select(tabId)
├── Feladatok:
│   ├── Workflow lépések listázása
│   ├── Aktuális lépés kiemelése
│   ├── UCE kódok megjelenítése
│   ├── Lépés státusz jelzése (kész/folyamatban/várakozik)
│   └── Kollapsz állapot kezelése
```

#### Középső Oszlop Komponensek (Munkaterület Tab-ok)
```
VahapTabXxx (általános struktúra)
├── Props: active, ugy
├── Emit: update, save, next, cancel
├── Template:
│   ├── v-show="active" - láthatóság kezelés
│   ├── Fejléc (cím + funkciókód + UCE kód)
│   ├── Tartalom (űrlap/lista/checklist)
│   └── Művelet gombok (Mentés/Tovább/Mégse)
├── Data:
│   ├── formData - űrlap adatok
│   ├── validationErrors - validációs hibák
│   └── loading - töltés állapot
├── Methods:
│   ├── validate() - validáció
│   ├── save() - mentés
│   ├── loadData() - adatok betöltése
│   └── reset() - alaphelyzetbe állítás
```

#### Jobb Oszlop Komponensek (Info Panelek)
```
VahapPanelXxx (általános struktúra)
├── Props: ugy, activeTab (opcionális)
├── Emit: action(type, data)
├── Template:
│   ├── Panel header (ikon + cím + badge)
│   ├── Panel body (dinamikus tartalom)
│   └── Panel footer (opcionális gombok)
├── Computed:
│   └── Dinamikus tartalom alapján
```

---

## 3. Részletes Komponens Specifikációk

### 3.1. Bal Oszlop - Workflow Navigáció

#### `vihar-workflow-nav.js` - TELJES IMPLEMENTÁCIÓ

**Funkciók:**
- Workflow lépések dinamikus listázása az ügy típusa alapján
- UCE kódok automatikus hozzárendelése
- Lépés státusz vizualizáció (ikon + szín)
- Kattintható navigáció
- Tooltip-ek részletes információkkal

**Adatstruktúra:**
```javascript
workflowSteps: [
    {
        id: 'kerelem',
        label: 'Kérelem adatok',
        icon: 'bi-file-earmark-text',
        uce: 'UCE-1761',
        funkcio: 'F-0107',
        status: 'completed', // completed | in-progress | pending | skipped
        required: true
    },
    {
        id: 'hatáskor',
        label: 'Hatáskör vizsgálat',
        icon: 'bi-shield-check',
        uce: 'UCE-1793',
        funkcio: 'F-0064',
        status: 'in-progress',
        required: true
    },
    // ... további lépések
]
```

---

### 3.2. Középső Oszlop - Munkaterület Tab Komponensek

#### `vihar-tab-hatáskor.js` - Hatáskör Vizsgálat
**F-0064** | **UCE-1793**

**Implementálandó funkciók:**
- Ellenőrzési lista betöltése a paraméterezőből
- Checkbox-ok minden kritériumhoz
- Automatikus státusz értékelés (mind teljesül → zöld, van hiba → piros)
- Megjegyzés mező minden kritériumhoz
- Mentés LocalStorage-ba
- "Tovább" gomb csak akkor engedélyezett, ha minden kötelező kritérium teljesül

**Template:**
```html
<div v-show="active" class="vahap-tab">
    <div class="tab-header">
        <h5><i class="bi bi-shield-check"></i> Hatáskör és illetékesség vizsgálata</h5>
        <div>
            <span class="badge bg-info">UCE-1793</span>
            <span class="badge bg-secondary">F-0064</span>
        </div>
    </div>

    <div class="tab-content">
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            Vizsgálja meg, hogy a hatóság hatáskörébe és illetékességébe tartozik-e az ügy.
        </div>

        <div class="checklist">
            <div v-for="kriterium in kriteriumok" :key="kriterium.id"
                 class="checklist-item"
                 :class="{'checked': formData.checks[kriterium.id]}">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                           :id="'check-' + kriterium.id"
                           v-model="formData.checks[kriterium.id]"
                           :disabled="kriterium.auto">
                    <label class="form-check-label" :for="'check-' + kriterium.id">
                        <strong>{{ kriterium.megnevezes }}</strong>
                        <span v-if="kriterium.kotelezo" class="text-danger">*</span>
                        <br>
                        <small class="text-muted">{{ kriterium.leiras }}</small>
                    </label>
                </div>
                <div v-if="formData.checks[kriterium.id]" class="mt-2">
                    <textarea class="form-control form-control-sm"
                              v-model="formData.megjegyzes[kriterium.id]"
                              placeholder="Megjegyzés (opcionális)"
                              rows="2"></textarea>
                </div>
            </div>
        </div>

        <div v-if="!isValid" class="alert alert-warning mt-3">
            <i class="bi bi-exclamation-triangle"></i>
            Nem minden kötelező kritérium teljesül!
        </div>
    </div>

    <div class="tab-footer">
        <button class="btn btn-secondary" @click="$emit('cancel')">
            <i class="bi bi-x-circle"></i> Mégse
        </button>
        <button class="btn btn-primary" @click="save" :disabled="!isValid">
            <i class="bi bi-check-circle"></i> Mentés és tovább
        </button>
    </div>
</div>
```

**Methods:**
```javascript
methods: {
    loadKriteriumok() {
        // VIHARMockData.parameterezo.ellenorzesi_lista_hataskor betöltése
        const lista = VIHARMockData.parameterezo.ellenorzesi_lista_hataskor;
        this.kriteriumok = lista.kriteriumok;
    },

    validate() {
        const kotelezoKriteriumok = this.kriteriumok.filter(k => k.kotelezo);
        return kotelezoKriteriumok.every(k => this.formData.checks[k.id]);
    },

    save() {
        if (!this.validate()) {
            alert('Kérem töltse ki az összes kötelező mezőt!');
            return;
        }

        this.$emit('update', {
            tab: 'hatáskor',
            data: this.formData,
            status: 'completed'
        });

        this.$emit('next', 'formai'); // Következő tab
    }
}
```

---

#### `vihar-tab-formai.js` - Formai Ellenőrzés
**F-0065** | **UCE-1799**

Hasonló struktúra mint a hatáskör vizsgálat, de formai kritériumokkal:
- Hiánytalan benyújtás
- Megfelelő formátumok
- Kötelező mellékletek megléte
- Aláírások érvényessége

---

#### `vihar-tab-tartalmi.js` - Tartalmi Vizsgálat
**F-0066** | **UCE-1794**

**Implementálandó funkciók:**
- Tartalmi kritériumok ellenőrzése
- Szakhatósági vélemény bekérésének jelzése
- Jogszabályi megfelelőség vizsgálata
- Automatikus riport generálás

---

#### `vihar-tab-vny024.js` - VNY024 Nyilvántartás
**F-0090**

**Implementálandó funkciók:**
- Vasútegészségügyi adatok megjelenítése
- Aktív vizsgálatok listázása
- Lejáró alkalmassági vizsgálatok jelzése
- Nyilvántartás frissítése

**FORRÁS SQL interfész kapcsolat:**
- Mock: VIHARMockData.vny024
- Valós: FORRÁS SQL API hívás

---

#### `vihar-tab-sommas.js` - Sommás Eljárás Döntés
**UCE-1800**

**Implementálandó funkciók:**
- Automatikus ellenőrzés: 8 napos határidő alkalmazható-e?
- Döntési javaslat: Sommás vagy teljes eljárás
- Indoklás mező
- Határidő automatikus számítása

**Template:**
```html
<div v-show="active" class="vahap-tab">
    <div class="tab-header">
        <h5><i class="bi bi-lightning"></i> Sommás eljárás alkalmazhatósága</h5>
        <div>
            <span class="badge bg-info">UCE-1800</span>
            <span class="badge bg-secondary">F-0088</span>
        </div>
    </div>

    <div class="tab-content">
        <div class="alert" :class="sommasAlkalmazhato ? 'alert-success' : 'alert-warning'">
            <i class="bi" :class="sommasAlkalmazhato ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
            <strong>{{ sommasAlkalmazhato ? 'Sommás eljárás alkalmazható' : 'Teljes eljárás szükséges' }}</strong>
        </div>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <strong>Automatikus értékelés</strong>
            </div>
            <div class="card-body">
                <ul class="list-unstyled mb-0">
                    <li v-for="feltétel in feltételek" :key="feltétel.id">
                        <i class="bi" :class="feltétel.teljesul ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'"></i>
                        {{ feltétel.szoveg }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Döntés indoklása</label>
            <textarea class="form-control" v-model="formData.indoklas" rows="4" required></textarea>
        </div>

        <div class="row">
            <div class="col-md-6">
                <label class="form-label">Választott eljárás típus</label>
                <select class="form-select" v-model="formData.eljarasTipus">
                    <option value="sommas">Sommás eljárás (8 nap)</option>
                    <option value="teljes">Teljes eljárás (60 nap)</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Automatikus határidő</label>
                <input type="text" class="form-control" :value="szamitottHatarido" readonly>
            </div>
        </div>
    </div>

    <div class="tab-footer">
        <button class="btn btn-secondary" @click="$emit('cancel')">Mégse</button>
        <button class="btn btn-primary" @click="save" :disabled="!formData.indoklas">
            Döntés rögzítése
        </button>
    </div>
</div>
```

---

#### `vihar-tab-dontesi-javaslat.js` - Döntési Javaslat
**F-0074** | **UCE-1826**

**Implementálandó funkciók:**
- Javaslat típus választása (engedélyező/elutasító/feltételes)
- Indoklás szerkesztő (rich text)
- Jogszabályi hivatkozások
- Előnézet funkció
- PDF generálás gomb

---

#### `vihar-tab-dokumentumok.js` - Dokumentum Generálás
**F-0091, F-0092, F-0093, F-0094, F-0095**

**Implementálandó funkciók:**
- Dokumentum típus választása (végzés/határozat/igazolás/tájékoztatás/hirdetmény)
- Sablon kiválasztása a paraméterezőből
- Dinamikus adatok behelyettesítése
- Előnézet
- PDF generálás
- Dokumentum mentése és csatolása az ügyh

**Template:**
```html
<div v-show="active" class="vahap-tab">
    <div class="tab-header">
        <h5><i class="bi bi-file-earmark-text"></i> Dokumentum generálás</h5>
        <div>
            <span class="badge bg-secondary">F-0091-095</span>
        </div>
    </div>

    <div class="tab-content">
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Dokumentum típus</label>
                <select class="form-select" v-model="selectedDokumentumTipus">
                    <option value="vegzes">Végzés (F-0091)</option>
                    <option value="hatarozat">Határozat (F-0092)</option>
                    <option value="igazolas">Igazolás (F-0093)</option>
                    <option value="tajekoztatas">Tájékoztatás (F-0094)</option>
                    <option value="hirdetmeny">Hirdetmény (F-0095)</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Sablon választás</label>
                <select class="form-select" v-model="selectedSablon">
                    <option v-for="sablon in availableSablonok" :key="sablon.id" :value="sablon">
                        {{ sablon.megnevezes }}
                    </option>
                </select>
            </div>
        </div>

        <div class="card mb-3" v-if="selectedSablon">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <strong>Dokumentum előnézet</strong>
                <button class="btn btn-sm btn-primary" @click="generatePDF">
                    <i class="bi bi-file-pdf"></i> PDF letöltés
                </button>
            </div>
            <div class="card-body">
                <div class="document-preview" v-html="renderedDocument"></div>
            </div>
        </div>
    </div>
</div>
```

---

#### `vihar-tab-velemenyezes.js` - Véleményezés
**F-0096** | **UCE-1824**

**Implementálandó funkciók:**
- Véleményező kiválasztása
- Határidő megadása
- Vélemény bekérése (email/rendszer üzenet)
- Vélemény státusz követése
- Vélemény megjelenítése

---

#### `vihar-tab-lezaras.js` - Ügy Lezárása
**F-0097** | **UCE-1828**

**Implementálandó funkciók:**
- Lezárási típus választása
- Záró dokumentum csatolása
- Értesítések kiküldése
- Archiválás
- Statisztika frissítése

---

#### `vihar-tab-hianypotlas.js` - Hiánypótlás
**F-0100** | **UCE-2000**

**Implementálandó funkciók:**
- Hiányzó dokumentumok listázása
- Határidő megadása
- Hiánypótlási felszólítás generálása
- Ügyfél értesítése
- Határidő követése

---

#### `vihar-tab-tenyallas.js` - Tényállás Tisztázása
**F-0102** | **UCE-2002**

**Implementálandó funkciók:**
- Rugalmas workflow elem hozzáadása
- Eljárási cselekmény típusának választása:
  - Szakhatósági megkeresés (UCE-2045)
  - Szemle (UCE-2051)
  - Ügyfél nyilatkozat (UCE-2052)
  - Szakértői vélemény (UCE-2053)
  - Megkeresés (UCE-2054)
  - Irat bemutatás (UCE-2055)
  - Tárgyalás (UCE-2056)
- Résztvevők megadása
- Határidő beállítása
- Eredmény rögzítése

---

#### `vihar-tab-ertesites.js` - Ügyfél Értesítés
**F-0089**

**Implementálandó funkciók:**
- Értesítés típusa (email/levél/rendszer üzenet)
- Címzettek kiválasztása
- Sablon választása
- Üzenet szerkesztése
- Előnézet és küldés

---

#### `vihar-tab-vezetoi-dontes.js` - Vezetői Döntés
**F-0099**

**Implementálandó funkciók:**
- Döntési javaslat megjelenítése
- Vélemények összesítése
- Vezetői döntés típusa (jóváhagyás/módosítás/elutasítás)
- Indoklás
- Döntés kiadmányozása

---

### 3.3. Jobb Oszlop - Info Panelek

#### `vihar-panel-dontesek.js` - Döntési Pontok
**F-0088**

**Implementálandó funkciók:**
- Kontextus-függő gombok megjelenítése az activeTab alapján
- Gyors műveletek (UCE kódokkal)
- Státusz váltás gombok
- Workflow elágazások kezelése

**Template:**
```html
<div class="panel border-bottom p-3">
    <h6 class="mb-3">
        <i class="bi bi-check-circle"></i> Döntési pontok
        <span class="badge bg-dark ms-2">F-0088</span>
    </h6>

    <div class="d-grid gap-2">
        <!-- Hatáskör vizsgálat döntések -->
        <template v-if="activeTab === 'hatáskor'">
            <button class="btn btn-success btn-sm" @click="handleDecision('hatáskor_rendben')">
                <span class="badge bg-light text-dark">UCE-1793</span>
                Hatáskör rendben → Tovább
            </button>
            <button class="btn btn-danger btn-sm" @click="handleDecision('hatáskor_hiba')">
                <span class="badge bg-light text-dark">UCE-1790</span>
                Elutasítás (hatáskör hiánya)
            </button>
        </template>

        <!-- Sommás eljárás döntések -->
        <template v-if="activeTab === 'sommas'">
            <button class="btn btn-success btn-sm" @click="handleDecision('sommas_igen')">
                <span class="badge bg-light text-dark">UCE-1800</span>
                Sommás eljárás (8 nap)
            </button>
            <button class="btn btn-warning btn-sm" @click="handleDecision('sommas_nem')">
                <span class="badge bg-light text-dark">UCE-1803</span>
                Teljes eljárás (60 nap)
            </button>
        </template>

        <!-- Hiánypótlás döntések -->
        <template v-if="activeTab === 'formai' || activeTab === 'tartalmi'">
            <button class="btn btn-warning btn-sm" @click="handleDecision('hianypotlas')">
                <span class="badge bg-light text-dark">UCE-2000</span>
                Hiánypótlás kérése
            </button>
        </template>

        <!-- Tényállás tisztázás -->
        <template v-if="activeTab === 'tartalmi'">
            <button class="btn btn-info btn-sm" @click="handleDecision('tenyallas')">
                <span class="badge bg-light text-dark">UCE-2002</span>
                Tényállás tisztázása
            </button>
        </template>

        <!-- Döntési javaslat -->
        <template v-if="activeTab === 'dontesi-javaslat'">
            <button class="btn btn-primary btn-sm" @click="handleDecision('velemenyezes')">
                <span class="badge bg-light text-dark">UCE-1824</span>
                Véleményeztetésre küldés
            </button>
            <button class="btn btn-success btn-sm" @click="handleDecision('vezetoi')">
                <span class="badge bg-light text-dark">UCE-1826</span>
                Vezetői döntésre küldés
            </button>
        </template>

        <!-- Lezárás -->
        <template v-if="activeTab === 'lezaras'">
            <button class="btn btn-success btn-sm" @click="handleDecision('lezar_engedely')">
                <span class="badge bg-light text-dark">UCE-1828</span>
                Lezárás (engedélyező)
            </button>
            <button class="btn btn-danger btn-sm" @click="handleDecision('lezar_elutasit')">
                <span class="badge bg-light text-dark">UCE-1990</span>
                Lezárás (elutasító)
            </button>
        </template>
    </div>
</div>
```

---

#### `vihar-panel-elozmenyek.js` - Előzmények

**Implementálandó funkciók:**
- Workflow lépések időrendi listázása
- Státusz változások nyomon követése
- Felhasználói tevékenységek naplózása
- Dokumentumok csatolási előzményei
- Szűrés esemény típus szerint

**Template:**
```html
<div class="panel border-bottom p-3">
    <h6 class="mb-3">
        <i class="bi bi-clock-history"></i> Eljárás előzmények
    </h6>

    <div class="timeline">
        <div v-for="esemeny in ugy.elozmenyek" :key="esemeny.id"
             class="timeline-item timeline-item-small">
            <div class="timeline-date">{{ formatDate(esemeny.datum) }}</div>
            <div class="timeline-content">
                <div class="d-flex align-items-start">
                    <i class="bi me-2" :class="getEsemenyIcon(esemeny.tipus)"></i>
                    <div class="flex-grow-1">
                        <strong>{{ esemeny.megnevezes }}</strong>
                        <br>
                        <small class="text-muted">
                            {{ esemeny.felhasznalo }}
                            <span v-if="esemeny.uce" class="badge bg-info ms-1">{{ esemeny.uce }}</span>
                        </small>
                        <p v-if="esemeny.megjegyzes" class="mb-0 mt-1 small">
                            {{ esemeny.megjegyzes }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

#### `vihar-panel-dokumentumok.js` - Dokumentumok

**Implementálandó funkciók:**
- Csatolt dokumentumok listázása
- Dokumentum letöltése
- Új dokumentum feltöltése
- Dokumentum típus szerinti csoportosítás
- Előnézet (PDF/képek esetén)

---

#### `vihar-panel-ugyfel.js` - Ügyfél Info

**Implementálandó funkciók:**
- Ügyfél adatok megjelenítése
- Kapcsolattartási információk
- Korábbi ügyek listázása
- Gyors művelet: Email küldés
- Gyors művelet: Telefonszám másolása

---

## 4. Főalkalmazás (vihar-munkalap-app.js)

### Főbb Feladatok:

```javascript
const VahapMunkalapApp = {
    data() {
        return {
            // Ügy adatok
            ugy: null,

            // Panel állapotok
            leftCollapsed: false,
            rightCollapsed: false,
            activeTab: 'kerelem',

            // Workflow
            workflowHistory: [],
            currentStep: null,

            // UI
            loading: false,
            saveStatus: 'saved' // saved | saving | error
        };
    },

    computed: {
        middleColumnClasses() {
            return {
                'col-md-7': !this.leftCollapsed && !this.rightCollapsed,
                'col-md-9': this.leftCollapsed && !this.rightCollapsed,
                'col-md-10': this.leftCollapsed && this.rightCollapsed
            };
        },

        middleColumnStyle() {
            if ((this.leftCollapsed && this.rightCollapsed) ||
                (!this.leftCollapsed && this.rightCollapsed)) {
                return { flex: '1 1 auto' };
            }
            return {};
        }
    },

    methods: {
        // Ügy betöltése
        loadUgy(ugyazonosito) {
            this.loading = true;
            // Mock: VahapMockData.vasut.ugyek_belso alapján
            // Valós: API hívás
            this.ugy = VahapMockData.vasut.ugyek_belso.find(
                u => u.ugyazonosito === ugyazonosito
            );
            this.loading = false;
        },

        // Tab váltás
        selectTab(tabId) {
            this.activeTab = tabId;
            this.addToHistory('tab_change', tabId);
        },

        // Döntés kezelése
        handleDecision(decisionType) {
            console.log('[DECISION]', decisionType);

            switch(decisionType) {
                case 'hatáskor_rendben':
                    this.activeTab = 'formai';
                    this.updateWorkflowStep('hatáskor', 'completed');
                    break;

                case 'sommas_igen':
                    this.ugy.eljaras_tipusa = 'Sommás (8 nap)';
                    this.calculateDeadline(8);
                    this.activeTab = 'dontesi-javaslat';
                    break;

                case 'hianypotlas':
                    this.activeTab = 'hianypotlas';
                    this.ugy.statusz = 'hiánypótlásra vár';
                    break;

                // ... további döntések
            }

            this.addToHistory('decision', decisionType);
        },

        // Workflow lépés frissítése
        updateWorkflowStep(stepId, status) {
            // Workflow állapot frissítése
            this.currentStep = stepId;

            // Mock mentés
            console.log('[WORKFLOW] Step updated:', stepId, status);

            // Előzmények frissítése
            this.addToHistory('workflow_step', { step: stepId, status });
        },

        // Előzmények hozzáadása
        addToHistory(type, data) {
            if (!this.ugy.elozmenyek) {
                this.ugy.elozmenyek = [];
            }

            this.ugy.elozmenyek.unshift({
                id: Date.now(),
                tipus: type,
                datum: new Date().toISOString(),
                felhasznalo: 'Dr. Szabó Péter', // Mock
                megnevezes: this.getHistoryLabel(type, data),
                data: data
            });
        },

        // Határidő számítása
        calculateDeadline(days) {
            const today = new Date();
            today.setDate(today.getDate() + days);
            this.ugy.hatarido = today.toISOString().split('T')[0];
        },

        // Autosave
        autoSave() {
            this.saveStatus = 'saving';
            setTimeout(() => {
                console.log('[AUTOSAVE] Ügy mentve');
                this.saveStatus = 'saved';
            }, 500);
        }
    },

    mounted() {
        // URL paraméterből ügy betöltése
        const urlParams = new URLSearchParams(window.location.search);
        const ugyazonosito = urlParams.get('ugy');

        if (ugyazonosito) {
            this.loadUgy(ugyazonosito);
        }

        // Autosave beállítása (2 percenként)
        setInterval(() => {
            this.autoSave();
        }, 120000);
    }
};
```

---

## 5. Implementálási Ütemterv

### Sprint 1: Alapkomponensek (1 hét)
- ✅ Workflow navigáció (vihar-workflow-nav.js)
- ✅ Hatáskör vizsgálat tab (vihar-tab-hatáskor.js)
- ✅ Formai ellenőrzés tab (vihar-tab-formai.js)
- ✅ Tartalmi vizsgálat tab (vihar-tab-tartalmi.js)
- ✅ Döntési pontok panel (vihar-panel-dontesek.js)

### Sprint 2: Döntési komponensek (1 hét)
- ✅ Sommás eljárás tab (vihar-tab-sommas.js)
- ✅ Döntési javaslat tab (vihar-tab-dontesi-javaslat.js)
- ✅ Véleményezés tab (vihar-tab-velemenyezes.js)
- ✅ Vezetői döntés tab (vihar-tab-vezetoi-dontes.js)

### Sprint 3: Dokumentumok és Nyilvántartás (1 hét)
- ✅ VNY024 tab (vihar-tab-vny024.js)
- ✅ Dokumentum generálás tab (vihar-tab-dokumentumok.js)
- ✅ Dokumentumok panel (vihar-panel-dokumentumok.js)

### Sprint 4: Ügyfél műveletek (1 hét)
- ✅ Hiánypótlás tab (vihar-tab-hianypotlas.js)
- ✅ Tényállás tisztázása tab (vihar-tab-tenyallas.js)
- ✅ Értesítés tab (vihar-tab-ertesites.js)
- ✅ Ügyfél panel (vihar-panel-ugyfel.js)

### Sprint 5: Lezárás és Előzmények (1 hét)
- ✅ Lezárás tab (vihar-tab-lezaras.js)
- ✅ Előzmények panel (vihar-panel-elozmenyek.js)
- ✅ Főalkalmazás finomítása

### Sprint 6: Tesztelés és Optimalizálás (1 hét)
- ✅ Teljes workflow tesztelés
- ✅ Cross-browser tesztelés
- ✅ Reszponzivitás tesztelése
- ✅ Teljesítmény optimalizálás
- ✅ Dokumentáció frissítése

---

## 6. Komponens Újrafelhasználhatósági Mátrix

| Komponens | Vasúti Modul | Hajózási Modul | Paraméterező | Megjegyzés |
|-----------|--------------|----------------|--------------|------------|
| vihar-workflow-nav | ✅ | ✅ | ❌ | Dinamikus workflow lépések |
| vihar-tab-kerelem | ✅ | ✅ (adaptálva) | ❌ | Ügytípus specifikus mezők |
| vihar-tab-hatáskor | ✅ | ✅ | ❌ | Paraméterezett kritériumok |
| vihar-tab-formai | ✅ | ✅ | ❌ | Paraméterezett kritériumok |
| vihar-tab-tartalmi | ✅ | ✅ | ❌ | Paraméterezett kritériumok |
| vihar-tab-vny024 | ✅ | ❌ | ❌ | **Csak vasúti modul** |
| vihar-tab-dokumentumok | ✅ | ✅ | ❌ | Sablon alapú generálás |
| vihar-tab-hianypotlas | ✅ | ✅ | ❌ | Közös logika |
| vihar-tab-tenyallas | ✅ | ✅ | ❌ | Rugalmas workflow |
| vihar-tab-lezaras | ✅ | ✅ | ❌ | Közös logika |
| vihar-panel-dontesek | ✅ | ✅ | ❌ | Kontextus-függő gombok |
| vihar-panel-elozmenyek | ✅ | ✅ | ✅ | Teljes újrafelhasználhatóság |
| vihar-panel-dokumentumok | ✅ | ✅ | ✅ | Teljes újrafelhasználhatóság |
| vihar-panel-ugyfel | ✅ | ✅ | ❌ | Közös logika |

---

## 7. Következő Lépések

### 7.1. Azonnal Implementálandó (Prioritás 1)

1. **vihar-tab-hatáskor.js teljes kifejlesztése**
   - Paraméterezett kritériumok betöltése
   - Checkbox logika implementálása
   - Validáció és mentés

2. **vihar-tab-formai.js teljes kifejlesztése**
   - Hasonló struktúra mint hatáskör
   - Formai kritériumok

3. **vihar-panel-dontesek.js kontextus-függő gombok**
   - Dinamikus gombok activeTab alapján
   - UCE kódok megjelenítése
   - Workflow elágazások

### 7.2. Második Prioritás

4. **vihar-tab-sommas.js**
5. **vihar-tab-dontesi-javaslat.js**
6. **vihar-tab-dokumentumok.js**

### 7.3. Harmadik Prioritás

7. **Összes többi tab komponens**
8. **Összes panel komponens finomítása**
9. **vihar-munkalap-app.js teljes kifejlesztése**

---

## 8. Fejlesztői Ellenőrzőlista (Komponens Létrehozáshoz)

### Minden új komponens esetén:

- [ ] **Template struktúra**
  - [ ] v-show="active" használata (tab komponenseknél)
  - [ ] Fejléc: cím + ikon + funkciókód + UCE kód
  - [ ] Tartalom: űrlap/lista/checklist
  - [ ] Lábléc: műveleti gombok

- [ ] **Props definiálása**
  - [ ] active (Boolean) - tab komponenseknél
  - [ ] ugy (Object) - ügy adatok
  - [ ] Egyéb specifikus props

- [ ] **Emit események**
  - [ ] update - adatfrissítés
  - [ ] save - mentés
  - [ ] next - következő tab
  - [ ] cancel - mégse

- [ ] **Data properties**
  - [ ] formData - űrlap adatok
  - [ ] validationErrors - validációs hibák
  - [ ] loading - töltés állapot

- [ ] **Methods**
  - [ ] validate() - validáció
  - [ ] save() - mentés
  - [ ] loadData() - adatok betöltése
  - [ ] reset() - alaphelyzetbe állítás

- [ ] **Computed properties**
  - [ ] isValid - űrlap érvényesség
  - [ ] Dinamikus tartalom számítások

- [ ] **Lifecycle hooks**
  - [ ] mounted() - adat betöltés
  - [ ] watch - reaktivitás kezelése

- [ ] **Konzisztencia**
  - [ ] Magyar nyelvűség ✅
  - [ ] Bootstrap 5 komponensek használata ✅
  - [ ] VAHAP CSS osztályok használata ✅
  - [ ] Console log-ok [KOMPONENS_NEV] prefixszel ✅

---

## 9. Kód Minták és Újrafelhasználható Snippetek

### Tab Komponens Alap Sablon
```javascript
const VahapTabXxx = {
    name: 'vahap-tab-xxx',
    props: {
        active: Boolean,
        ugy: Object
    },
    emits: ['update', 'save', 'next', 'cancel'],
    data() {
        return {
            formData: {},
            validationErrors: [],
            loading: false
        };
    },
    computed: {
        isValid() {
            return this.validationErrors.length === 0;
        }
    },
    methods: {
        validate() {
            this.validationErrors = [];
            // Validációs logika
            return this.validationErrors.length === 0;
        },
        save() {
            if (!this.validate()) return;

            this.$emit('update', {
                tab: 'xxx',
                data: this.formData,
                status: 'completed'
            });

            this.$emit('next', 'következő-tab-id');
        },
        loadData() {
            // Adatok betöltése
            if (this.ugy && this.ugy.xxx_data) {
                this.formData = { ...this.ugy.xxx_data };
            }
        },
        reset() {
            this.formData = {};
            this.validationErrors = [];
        }
    },
    mounted() {
        this.loadData();
    },
    template: `
        <div v-show="active" class="vahap-tab">
            <div class="tab-header">
                <h5><i class="bi bi-xxx"></i> Tab címe</h5>
                <div>
                    <span class="badge bg-info">UCE-xxxx</span>
                    <span class="badge bg-secondary">F-xxxx</span>
                </div>
            </div>
            <div class="tab-content">
                <!-- Tartalom -->
            </div>
            <div class="tab-footer">
                <button class="btn btn-secondary" @click="$emit('cancel')">Mégse</button>
                <button class="btn btn-primary" @click="save" :disabled="!isValid">Mentés</button>
            </div>
        </div>
    `
};
```

### Panel Komponens Alap Sablon
```javascript
const VahapPanelXxx = {
    name: 'vahap-panel-xxx',
    props: {
        ugy: Object,
        activeTab: String
    },
    emits: ['action'],
    computed: {
        // Dinamikus tartalom
    },
    methods: {
        handleAction(actionType, data) {
            this.$emit('action', { type: actionType, data });
        }
    },
    template: `
        <div class="panel border-bottom p-3">
            <h6 class="mb-3">
                <i class="bi bi-xxx"></i> Panel címe
                <span class="badge bg-dark ms-2">F-xxxx</span>
            </h6>
            <div class="panel-body">
                <!-- Tartalom -->
            </div>
        </div>
    `
};
```

---

## 10. Összegzés

Ez a dokumentum egy **teljes komponens-alapú architektúrát** definiál az ügy-munkalap rendszerhez.

**Főbb előnyök:**
- ✅ **Modularitás**: Minden komponens önálló, könnyen cserélhető
- ✅ **Újrafelhasználhatóság**: Komponensek megoszthatók vasúti és hajózási modul között
- ✅ **Karbantarthatóság**: Egyetlen komponens módosítása nem érinti a többit
- ✅ **Bővíthetőség**: Új workflow lépések könnyen hozzáadhatók
- ✅ **Tesztelhetőség**: Komponensek függetlenül tesztelhetők
- ✅ **Skálázhatóság**: Rendszer könnyen bővíthető új modulokkal

**Következő lépés:** Válaszd ki, melyik komponenssel kezdjük a teljes kifejlesztést!
