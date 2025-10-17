/**
 * VAHAP Workflow Komponens - Formai Ellenőrzés Varázsló
 * F-0065 - Formai megfelelőség vizsgálata wizard formában
 * UCE-1799 - Formai ellenőrzés
 */

const WfFormaiWizard = {
    name: 'wf-formai-wizard',

    props: {
        ugy: {
            type: Object,
            required: true
        },
        stepData: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['action', 'complete'],

    data() {
        return {
            // Wizard lépés - KEZDŐ ÁLLAPOT
            currentStep: 1,
            totalSteps: 5,

            // Ellenőrzési csoportok
            groups: {
                kerelem: {
                    nev: 'Kérelem formai követelményei',
                    leiras: 'A kérelem formanyomtatványának és kötelező elemeinek ellenőrzése',
                    items: [
                        {
                            id: 'f1',
                            title: 'Kérelem formanyomtatvány kitöltése',
                            description: 'Minden kötelező mező kitöltve',
                            help: 'Ellenőrizze, hogy minden *-al jelölt kötelező mező ki van-e töltve. Különös figyelmet fordítson a személyes adatokra, lakcímre és elérhetőségekre.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Minden kötelező mező megfelelően kitöltésre került.'
                        },
                        {
                            id: 'f2',
                            title: 'Aláírás megfelelősége',
                            description: 'Kérelmező vagy meghatalmazott aláírása',
                            help: 'Kézzel írt vagy elektronikus aláírás szerepel. Ha meghatalmazott írja alá, a meghatalmazás csatolásra került.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Elektronikus aláírás érvényes.'
                        },
                        {
                            id: 'f3',
                            title: 'Dátumozás',
                            description: 'Kérelem dátuma szerepel és érvényes',
                            help: 'A kérelem dátuma nem lehet jövőbeli, és maximum 30 napnál nem régebbi.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Kérelem dátuma: 2025.09.15, érvényes.'
                        },
                        {
                            id: 'f4',
                            title: 'Azonosító adatok',
                            description: 'Személyazonosító adatok (név, születési hely, dátum, anyja neve)',
                            help: 'Minden azonosító adat kitöltésre került és egyértelműen olvasható.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Azonosító adatok helyesek és olvashatók.'
                        }
                    ]
                },
                mellekletek: {
                    nev: 'Mellékletek ellenőrzése',
                    leiras: 'A kérelem kötelező és opcionális mellékleteinek vizsgálata',
                    items: [
                        {
                            id: 'm1',
                            title: 'Kötelező mellékletek csatolva',
                            description: 'Minden előírt dokumentum becsatolásra került',
                            help: 'V-044 ügytípusnál kötelező: személyi igazolvány másolat, orvosi igazolás, munkáltatói igazolás.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Személyi ig., orvosi igazolás, munkáltatói igazolás csatolva.'
                        },
                        {
                            id: 'm2',
                            title: 'Mellékletek formátuma megfelelő',
                            description: 'PDF vagy elfogadott formátum',
                            help: 'Elfogadott formátumok: PDF, JPG, PNG. Max fájlméret: 10 MB.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Minden melléklet PDF formátumban.'
                        },
                        {
                            id: 'm3',
                            title: 'Mellékletek olvashatók',
                            description: 'Dokumentumok tisztán olvashatók, nem sérültek',
                            help: 'Minden melléklet jó minőségű, szövegek olvashatók, nincs elfedve semmilyen fontos információ.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Dokumentumok jó minőségűek, tisztán olvashatók.'
                        },
                        {
                            id: 'm4',
                            title: 'Mellékletek naprakészek',
                            description: 'Dokumentumok dátuma megfelelő (pl. orvosi igazolás max 30 napos)',
                            help: 'Különösen az orvosi igazolásoknál és időkorláttal rendelkező dokumentumoknál ellenőrizze a dátumot.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Orvosi igazolás kelte: 2025.09.10, érvényes.'
                        }
                    ]
                },
                dijak: {
                    nev: 'Díjfizetés ellenőrzése',
                    leiras: 'Eljárási díj befizetésének és igazolásának vizsgálata',
                    items: [
                        {
                            id: 'd1',
                            title: 'Eljárási díj megfizetése',
                            description: 'Az előírt díj befizetésre került',
                            help: 'V-044 ügytípus esetén az alapdíj: 12 000 Ft. Ellenőrizze a FORRÁS rendszerben a befizetést.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: '12 000 Ft befizetésre került 2025.09.14-én.'
                        },
                        {
                            id: 'd2',
                            title: 'Díjfizetés igazolása',
                            description: 'Befizetési bizonylat csatolva',
                            help: 'Átutalási bizonylat vagy bankkivonat, amely tartalmazza az ügyazonosítót és a pontos összeget.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Banki átutalási bizonylat csatolva.'
                        },
                        {
                            id: 'd3',
                            title: 'Díj összege helyes',
                            description: 'A befizetett összeg megegyezik az előírt díjjal',
                            help: 'Ellenőrizze, hogy nincs-e alul vagy túlfizetés. Ha van eltérés, jelezze a kérelmezőnek.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'A befizetett összeg pontos, 12 000 Ft.'
                        }
                    ]
                }
            },

            // Döntés - ELŐRE KITÖLTVE
            decision: 'megfelelt',
            decisionNote: 'A formai megfelelőség vizsgálata során megállapítást nyert, hogy a kérelem minden formai követelménynek megfelel. A kérelem formanyomtatványának kitöltése megfelelő, a szükséges mellékletek csatolásra kerültek, és az eljárási díj befizetésre került. Az ügy érdemi vizsgálatra továbbítható.',
            hianyossagok: [],

            // Összegzés adatok
            reviewedBy: 'Dr. Szabó Péter',
            reviewDate: new Date().toISOString().split('T')[0]
        };
    },

    computed: {
        // Progress százalék
        progressPercent() {
            return Math.round((this.currentStep / this.totalSteps) * 100);
        },

        // Lépés címe
        stepTitle() {
            const titles = {
                1: 'Kérelem formai követelményei',
                2: 'Mellékletek ellenőrzése',
                3: 'Díjfizetés ellenőrzése',
                4: 'Döntés meghozatala',
                5: 'Összegzés és befejezés'
            };
            return titles[this.currentStep] || '';
        },

        // Aktuális csoport
        currentGroup() {
            if (this.currentStep === 1) return this.groups.kerelem;
            if (this.currentStep === 2) return this.groups.mellekletek;
            if (this.currentStep === 3) return this.groups.dijak;
            return null;
        },

        // Statisztika
        stats() {
            let total = 0;
            let checked = 0;
            let passed = 0;
            let failed = 0;

            Object.values(this.groups).forEach(group => {
                group.items.forEach(item => {
                    total++;
                    if (item.checked) checked++;
                    if (item.result === 'pass') passed++;
                    if (item.result === 'fail') failed++;
                });
            });

            return { total, checked, passed, failed };
        },

        // Lépés validáció
        canProceed() {
            if (this.currentStep >= 1 && this.currentStep <= 3) {
                // Minden kötelező elem ellenőrzve
                return this.currentGroup.items
                    .filter(item => item.required)
                    .every(item => item.checked && item.result);
            }
            if (this.currentStep === 4) {
                return this.decision !== null && this.decisionNote.length >= 30;
            }
            return true;
        },

        // Összes követelmény teljesült?
        allPassed() {
            return Object.values(this.groups).every(group =>
                group.items.every(item => !item.required || item.result === 'pass')
            );
        },

        // Hiányosságok listája
        hianyossagokLista() {
            const lista = [];
            Object.values(this.groups).forEach(group => {
                group.items.forEach(item => {
                    if (item.result === 'fail') {
                        lista.push({
                            group: group.nev,
                            title: item.title,
                            megjegyzes: item.megjegyzes
                        });
                    }
                });
            });
            return lista;
        }
    },

    methods: {
        // Következő lépés
        nextStep() {
            if (!this.canProceed) {
                alert('Kérem végezze el az összes kötelező ellenőrzést!');
                return;
            }
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;

                // Ha döntés lépésre lépünk, automatikus hiányosság lista
                if (this.currentStep === 4) {
                    this.hianyossagok = this.hianyossagokLista;
                }

                this.$nextTick(() => {
                    const content = document.querySelector('.wizard-content');
                    if (content) content.scrollTop = 0;
                });
            }
        },

        // Előző lépés
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.$nextTick(() => {
                    const content = document.querySelector('.wizard-content');
                    if (content) content.scrollTop = 0;
                });
            }
        },

        // Lépés ugrás
        goToStep(step) {
            if (step <= this.currentStep) {
                this.currentStep = step;
            } else if (step === this.currentStep + 1 && this.canProceed) {
                this.currentStep = step;
            }
            this.$nextTick(() => {
                const content = document.querySelector('.wizard-content');
                if (content) content.scrollTop = 0;
            });
        },

        // Elem ellenőrzése
        checkItem(item) {
            item.checked = !item.checked;
            if (!item.checked) {
                item.result = null;
            }
        },

        // Eredmény beállítása
        setResult(item, result) {
            item.result = result;
            if (!item.checked) {
                item.checked = true;
            }
        },

        // Döntés
        makeDecision(type) {
            this.decision = type;

            // Automatikus indoklás
            if (type === 'megfelelt') {
                this.decisionNote = 'A formai megfelelőség vizsgálata során megállapítást nyert, hogy a kérelem minden formai követelménynek megfelel. A kérelem formanyomtatványának kitöltése megfelelő, a szükséges mellékletek csatolásra kerültek, és az eljárási díj befizetésre került. Az ügy érdemi vizsgálatra továbbítható.';
            } else if (type === 'hianypotlas') {
                const hianyok = this.hianyossagokLista.map(h => h.title).join(', ');
                this.decisionNote = `A formai megfelelőség vizsgálata során hiányosságok kerültek megállapításra az alábbi területeken: ${hianyok}. A kérelmező 15 napos határidővel hiánypótlásra kerül felszólításra.`;
            } else if (type === 'elutasitas') {
                this.decisionNote = 'A formai megfelelőség vizsgálata során olyan súlyos hiányosságok kerültek megállapításra, amelyek miatt a kérelem nem bírálható el. A kérelem elutasításra kerül.';
            }
        },

        // Befejezés
        complete() {
            const result = {
                type: 'formai-ellenorzes',
                kod: 'F-0065',
                uce: 'UCE-1799',
                decision: this.decision,
                decisionNote: this.decisionNote,
                hianyossagok: this.hianyossagokLista,
                stats: this.stats,
                groups: this.groups,
                reviewedBy: this.reviewedBy,
                reviewDate: this.reviewDate,
                completedAt: new Date().toISOString()
            };

            console.log('Formai ellenőrzés befejezve:', result);
            this.$emit('complete', result);
        }
    },

    template: `
        <div class="wizard-container">
            <!-- Wizard fejléc -->
            <div class="wizard-header">
                <!-- Progress bar -->
                <div class="wizard-progress mb-3">
                    <div class="wizard-progress-bar" :style="{ width: progressPercent + '%' }"></div>
                </div>

                <!-- Step indicators -->
                <div class="wizard-steps">
                    <div v-for="n in totalSteps" :key="n"
                         class="wizard-step-indicator"
                         :class="{
                             'active': n === currentStep,
                             'completed': n < currentStep,
                             'disabled': n > currentStep && !canProceed
                         }"
                         @click="goToStep(n)"
                         :style="{ cursor: n <= currentStep || (n === currentStep + 1 && canProceed) ? 'pointer' : 'not-allowed' }">
                        <div class="wizard-step-circle">
                            <i v-if="n < currentStep" class="bi bi-check"></i>
                            <span v-else>{{ n }}</span>
                        </div>
                        <div class="wizard-step-label">
                            {{ n === 1 ? 'Kérelem' :
                               n === 2 ? 'Mellékletek' :
                               n === 3 ? 'Díjfizetés' :
                               n === 4 ? 'Döntés' :
                               'Összegzés' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard tartalom -->
            <div class="wizard-content">
                <!-- Lépés 1-3: Ellenőrzési csoportok -->
                <div v-if="currentStep >= 1 && currentStep <= 3" class="wizard-step-content">
                    <div class="alert alert-info mb-4">
                        <i class="bi bi-info-circle me-2"></i>
                        {{ currentGroup.leiras }}
                    </div>

                    <div v-for="item in currentGroup.items" :key="item.id" class="checklist-item-wizard mb-4">
                        <div class="d-flex align-items-start">
                            <input type="checkbox"
                                   class="form-check-input me-3 mt-1"
                                   :checked="item.checked"
                                   @change="checkItem(item)"
                                   style="width: 24px; height: 24px;">

                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="mb-0">
                                        {{ item.title }}
                                        <span v-if="item.required" class="badge bg-danger ms-2">Kötelező</span>
                                        <span v-if="item.result" class="badge ms-2"
                                              :class="{
                                                  'bg-success': item.result === 'pass',
                                                  'bg-danger': item.result === 'fail'
                                              }">
                                            {{ item.result === 'pass' ? 'Megfelelt' : 'Nem felelt meg' }}
                                        </span>
                                    </h6>
                                </div>

                                <p class="text-muted mb-2">{{ item.description }}</p>

                                <div class="alert alert-light py-2 px-3 mb-3">
                                    <small><i class="bi bi-lightbulb me-1"></i> <strong>Segítség:</strong> {{ item.help }}</small>
                                </div>

                                <div v-if="item.checked" class="mt-3">
                                    <div class="btn-group mb-3" role="group">
                                        <button type="button"
                                                class="btn"
                                                :class="item.result === 'pass' ? 'btn-success' : 'btn-outline-success'"
                                                @click="setResult(item, 'pass')">
                                            <i class="bi bi-check-circle"></i> Megfelelt
                                        </button>
                                        <button type="button"
                                                class="btn"
                                                :class="item.result === 'fail' ? 'btn-danger' : 'btn-outline-danger'"
                                                @click="setResult(item, 'fail')">
                                            <i class="bi bi-x-circle"></i> Nem felelt meg
                                        </button>
                                    </div>

                                    <div class="mt-2">
                                        <label class="form-label small fw-bold">
                                            Megjegyzés
                                            <span v-if="item.result === 'fail'" class="text-danger">(kötelező hiányosságnál)</span>
                                        </label>
                                        <textarea class="form-control form-control-sm"
                                                  rows="2"
                                                  v-model="item.megjegyzes"
                                                  :placeholder="item.result === 'fail' ? 'Részletezze a hiányosságot...' : 'További megjegyzések...'"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-secondary mt-4">
                        <strong>Ellenőrzött elemek:</strong>
                        {{ currentGroup.items.filter(i => i.checked).length }} / {{ currentGroup.items.length }}
                    </div>
                </div>

                <!-- Lépés 4: Döntés -->
                <div v-if="currentStep === 4" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Az ellenőrzések alapján hozzon döntést a kérelem formai megfelelőségéről.
                    </p>

                    <!-- Statisztika -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-primary mb-0">{{ stats.total }}</h3>
                                    <small class="text-muted">Összes elem</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-info mb-0">{{ stats.checked }}</h3>
                                    <small class="text-muted">Ellenőrzött</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-success mb-0">{{ stats.passed }}</h3>
                                    <small class="text-muted">Megfelelt</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-danger mb-0">{{ stats.failed }}</h3>
                                    <small class="text-muted">Nem felelt meg</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hiányosságok listája -->
                    <div v-if="hianyossagok.length > 0" class="alert alert-warning mb-4">
                        <h6 class="alert-heading">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Megállapított hiányosságok ({{ hianyossagok.length }})
                        </h6>
                        <ul class="mb-0">
                            <li v-for="(hiany, index) in hianyossagok" :key="index">
                                <strong>{{ hiany.group }}:</strong> {{ hiany.title }}
                                <div v-if="hiany.megjegyzes" class="text-muted small mt-1">
                                    {{ hiany.megjegyzes }}
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Döntési gombok -->
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': decision === 'megfelelt', 'disabled': !allPassed }"
                                 @click="allPassed && makeDecision('megfelelt')">
                                <div class="text-center">
                                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Formailag megfelelt</h6>
                                    <p class="text-muted small">
                                        Minden követelmény teljesül
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': decision === 'hianypotlas' }"
                                 @click="makeDecision('hianypotlas')">
                                <div class="text-center">
                                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Hiánypótlás szükséges</h6>
                                    <p class="text-muted small">
                                        Pótolható hiányosságok
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': decision === 'elutasitas' }"
                                 @click="makeDecision('elutasitas')">
                                <div class="text-center">
                                    <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Elutasítás</h6>
                                    <p class="text-muted small">
                                        Súlyos hiányosságok
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Indoklás -->
                    <div v-if="decision" class="mt-4">
                        <label class="form-label fw-bold">
                            <i class="bi bi-journal-text"></i> Döntés indoklása
                        </label>
                        <textarea class="form-control"
                                  rows="6"
                                  v-model="decisionNote"
                                  placeholder="Írja le részletesen a döntés indokait..."></textarea>
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted">Minimum 30 karakter szükséges</small>
                            <small :class="decisionNote.length >= 30 ? 'text-success' : 'text-danger'">
                                {{ decisionNote.length }}/30 karakter
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Lépés 5: Összegzés -->
                <div v-if="currentStep === 5" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Ellenőrizze a formai ellenőrzés eredményét mielőtt véglegesíti.
                    </p>

                    <div class="wizard-summary">
                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-clipboard-check me-2"></i> Ellenőrzés eredménye</h6>
                            <div class="wizard-summary-value">
                                <span class="badge"
                                      :class="{
                                          'bg-success': decision === 'megfelelt',
                                          'bg-warning': decision === 'hianypotlas',
                                          'bg-danger': decision === 'elutasitas'
                                      }"
                                      style="font-size: 1rem; padding: 0.5rem 1rem;">
                                    {{ decision === 'megfelelt' ? 'FORMAILAG MEGFELELT' :
                                       decision === 'hianypotlas' ? 'HIÁNYPÓTLÁS SZÜKSÉGES' :
                                       'ELUTASÍTÁS' }}
                                </span>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-bar-chart me-2"></i> Statisztika</h6>
                            <div class="row">
                                <div class="col-6">
                                    <small class="text-muted">Ellenőrzött elemek:</small>
                                    <div class="fw-bold">{{ stats.checked }} / {{ stats.total }}</div>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Megfelelt / Nem felelt meg:</small>
                                    <div class="fw-bold">
                                        <span class="text-success">{{ stats.passed }}</span> /
                                        <span class="text-danger">{{ stats.failed }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="hianyossagok.length > 0" class="wizard-summary-section">
                            <h6><i class="bi bi-exclamation-triangle me-2 text-warning"></i> Hiányosságok</h6>
                            <div class="list-group">
                                <div v-for="(hiany, index) in hianyossagok" :key="index" class="list-group-item">
                                    <div class="fw-bold">{{ hiany.title }}</div>
                                    <small class="text-muted">{{ hiany.group }}</small>
                                    <div v-if="hiany.megjegyzes" class="mt-1 small text-muted">
                                        {{ hiany.megjegyzes }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-journal-text me-2"></i> Indoklás</h6>
                            <div class="wizard-summary-value text-muted" style="white-space: pre-wrap;">
                                {{ decisionNote }}
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-person-badge me-2"></i> Ellenőrzést végezte</h6>
                            <div class="wizard-summary-value">
                                {{ reviewedBy }}
                                <small class="text-muted ms-2">{{ reviewDate }}</small>
                            </div>
                        </div>

                        <div class="alert alert-warning mt-4">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Figyelem!</strong> A formai ellenőrzés befejezése után a döntés visszavonhatatlan.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard footer -->
            <div class="wizard-footer">
                <div class="d-flex justify-content-between">
                    <button class="btn btn-secondary"
                            @click="prevStep"
                            :disabled="currentStep === 1">
                        <i class="bi bi-arrow-left"></i> Előző
                    </button>

                    <button v-if="currentStep < totalSteps"
                            class="btn btn-primary"
                            @click="nextStep"
                            :disabled="!canProceed">
                        Következő <i class="bi bi-arrow-right"></i>
                    </button>

                    <button v-if="currentStep === totalSteps"
                            class="btn btn-success btn-lg"
                            @click="complete">
                        <i class="bi bi-check-circle"></i> Ellenőrzés befejezése
                    </button>
                </div>
            </div>
        </div>
    `
};
