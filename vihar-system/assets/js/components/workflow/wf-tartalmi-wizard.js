/**
 * VAHAP Workflow Komponens - Tartalmi Vizsgálat Varázsló
 * F-0066 - Tartalmi megfelelőség vizsgálat wizard formában
 * UCE-1794 - Tartalmi vizsgálat
 */

const WfTartalmiWizard = {
    name: 'wf-tartalmi-wizard',

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
                szakmai: {
                    nev: 'Szakmai követelmények',
                    leiras: 'A kérelem szakmai és műszaki tartalmának ellenőrzése',
                    items: [
                        {
                            id: 't1',
                            title: 'Műszaki dokumentáció megfelelősége',
                            description: 'Tervek, számítások szakmailag megfelelőek',
                            help: 'Ellenőrizze, hogy a benyújtott műszaki dokumentáció megfelel-e a vonatkozó szabványoknak és előírásoknak.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Műszaki dokumentáció teljes körű és megfelelő.'
                        },
                        {
                            id: 't2',
                            title: 'Szakértői vélemények',
                            description: 'Szükséges szakvélemények rendelkezésre állnak',
                            help: 'Bizonyos esetekben független szakértői vélemény szükséges. Ellenőrizze, hogy szükséges-e és csatolva van-e.',
                            required: false,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Orvosszakértői vélemény csatolva, érvényes.'
                        },
                        {
                            id: 't3',
                            title: 'Jogszabályi előírások teljesülése',
                            description: 'Minden vonatkozó előírás teljesül',
                            help: 'A 123/2023. (XII. 15.) Korm. rendelet és egyéb vonatkozó jogszabályok szerinti tartalmi követelmények teljesülnek.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Minden jogszabályi előírás teljesül.'
                        },
                        {
                            id: 't4',
                            title: 'Adatok valódiságának ellenőrzése',
                            description: 'Kérelem adatai ellenőrizhetők és megfelelőek',
                            help: 'A kérelmező által megadott adatok helyességét ellenőrizze egyéb nyilvántartások alapján.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Adatok ellenőrizve, helytállók.'
                        }
                    ]
                },
                biztonsag: {
                    nev: 'Biztonsági követelmények',
                    leiras: 'Vasútbiztonsági és közlekedésbiztonsági követelmények vizsgálata',
                    items: [
                        {
                            id: 'b1',
                            title: 'Vasútbiztonsági előírások',
                            description: 'Biztonsági követelmények teljesülnek',
                            help: 'A vasúti közlekedés biztonságára vonatkozó előírások betartását ellenőrizze.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Biztonsági előírások teljesülnek.'
                        },
                        {
                            id: 'b2',
                            title: 'Kockázatértékelés',
                            description: 'Kockázatelemzés elvégzésre került',
                            help: 'Kockázatértékelés alapján a tevékenység biztonságos-e, vannak-e kockázatcsökkentő intézkedések.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Kockázatértékelés elvégezve, megfelelő.'
                        },
                        {
                            id: 'b3',
                            title: 'Egészségügyi alkalmassági követelmények',
                            description: 'Egészségügyi szempontból alkalmas a járművezető',
                            help: 'Az orvosi igazolás alapján a kérelmező egészségileg alkalmas-e a vasúti járművezetői tevékenységre.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Orvosi igazolás szerint alkalmas, korlátozás nélkül.'
                        }
                    ]
                },
                nyilvantartas: {
                    nev: 'Nyilvántartási adatok',
                    leiras: 'VNY024 Vasútegészségügyi nyilvántartás ellenőrzése',
                    items: [
                        {
                            id: 'n1',
                            title: 'VNY024 nyilvántartásban szerepel',
                            description: 'Kérelmező előzetes adatai ellenőrizve',
                            help: 'Ellenőrizze a VNY024 vasútegészségügyi nyilvántartásban, hogy van-e korábbi bejegyzés a kérelmezőről.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'VNY024-ben szerepel, korábbi vizsgálat: 2023.05.12, eredmény: alkalmas.'
                        },
                        {
                            id: 'n2',
                            title: 'Korábbi vizsgálatok eredménye',
                            description: 'Előzmények áttekintése',
                            help: 'Ha voltak korábbi vizsgálatok, ellenőrizze azok eredményét és időpontját.',
                            required: false,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Korábbi vizsgálatok pozitív eredményűek.'
                        },
                        {
                            id: 'n3',
                            title: 'Kizáró okok ellenőrzése',
                            description: 'Nincs kizáró ok az alkalmassági vizsgálatra',
                            help: 'Ellenőrizze, hogy van-e folyamatban hatósági eljárás vagy felfüggesztés.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Nincs kizáró ok, felfüggesztés vagy folyamatban lévő eljárás.'
                        }
                    ]
                }
            },

            // Döntés - ELŐRE KITÖLTVE
            decision: 'megfelelt',
            decisionNote: 'A tartalmi megfelelőség vizsgálata során megállapítást nyert, hogy a kérelem minden tartalmi követelménynek megfelel. A szakmai követelmények teljesülnek, a biztonsági előírások betartásra kerültek, és a nyilvántartási adatok alapján nincs akadálya az alkalmassági vizsgálat elvégzésének. Az ügy érdemi döntés előkészítésre továbbítható.',
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
                1: 'Szakmai követelmények',
                2: 'Biztonsági követelmények',
                3: 'Nyilvántartási adatok',
                4: 'Döntés meghozatala',
                5: 'Összegzés és befejezés'
            };
            return titles[this.currentStep] || '';
        },

        // Aktuális csoport
        currentGroup() {
            if (this.currentStep === 1) return this.groups.szakmai;
            if (this.currentStep === 2) return this.groups.biztonsag;
            if (this.currentStep === 3) return this.groups.nyilvantartas;
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

            if (type === 'megfelelt') {
                this.decisionNote = 'A tartalmi megfelelőség vizsgálata során megállapítást nyert, hogy a kérelem minden tartalmi követelménynek megfelel. A szakmai követelmények teljesülnek, a biztonsági előírások betartásra kerültek, és a nyilvántartási adatok alapján nincs akadálya az alkalmassági vizsgálat elvégzésének. Az ügy érdemi döntés előkészítésre továbbítható.';
            } else if (type === 'hianypotlas') {
                const hianyok = this.hianyossagokLista.map(h => h.title).join(', ');
                this.decisionNote = `A tartalmi megfelelőség vizsgálata során hiányosságok kerültek megállapításra az alábbi területeken: ${hianyok}. A kérelmező 15 napos határidővel hiánypótlásra kerül felszólításra.`;
            } else if (type === 'elutasitas') {
                this.decisionNote = 'A tartalmi megfelelőség vizsgálata során olyan súlyos szakmai vagy biztonsági hiányosságok kerültek megállapításra, amelyek miatt a kérelem nem bírálható el pozitívan. A kérelem elutasításra kerül.';
            }
        },

        // Befejezés
        complete() {
            const result = {
                type: 'tartalmi-vizsgalat',
                kod: 'F-0066',
                uce: 'UCE-1794',
                decision: this.decision,
                decisionNote: this.decisionNote,
                hianyossagok: this.hianyossagokLista,
                stats: this.stats,
                groups: this.groups,
                reviewedBy: this.reviewedBy,
                reviewDate: this.reviewDate,
                completedAt: new Date().toISOString()
            };

            console.log('Tartalmi vizsgálat befejezve:', result);
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
                            {{ n === 1 ? 'Szakmai' :
                               n === 2 ? 'Biztonsági' :
                               n === 3 ? 'Nyilvántartás' :
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
                        Az ellenőrzések alapján hozzon döntést a kérelem tartalmi megfelelőségéről.
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
                                    <h6 class="mt-3">Tartalmában megfelelt</h6>
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
                                        Pótolható szakmai hiányok
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
                                        Súlyos szakmai hiányosságok
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
                        Ellenőrizze a tartalmi vizsgálat eredményét mielőtt véglegesíti.
                    </p>

                    <div class="wizard-summary">
                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-clipboard-check me-2"></i> Vizsgálat eredménye</h6>
                            <div class="wizard-summary-value">
                                <span class="badge"
                                      :class="{
                                          'bg-success': decision === 'megfelelt',
                                          'bg-warning': decision === 'hianypotlas',
                                          'bg-danger': decision === 'elutasitas'
                                      }"
                                      style="font-size: 1rem; padding: 0.5rem 1rem;">
                                    {{ decision === 'megfelelt' ? 'TARTALMÁBAN MEGFELELT' :
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
                            <h6><i class="bi bi-person-badge me-2"></i> Vizsgálatot végezte</h6>
                            <div class="wizard-summary-value">
                                {{ reviewedBy }}
                                <small class="text-muted ms-2">{{ reviewDate }}</small>
                            </div>
                        </div>

                        <div class="alert alert-warning mt-4">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Figyelem!</strong> A tartalmi vizsgálat befejezése után a döntés visszavonhatatlan.
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
                        <i class="bi bi-check-circle"></i> Vizsgálat befejezése
                    </button>
                </div>
            </div>
        </div>
    `
};
