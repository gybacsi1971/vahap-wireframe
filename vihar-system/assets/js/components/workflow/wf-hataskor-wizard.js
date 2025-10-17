/**
 * VAHAP Workflow Komponens - Hatáskör Vizsgálat Varázsló
 * F-0064 - Hatáskör és illetékesség vizsgálat wizard formában
 * UCE-1793 - Hatáskör vizsgálat
 */

const WfHataskorWizard = {
    name: 'wf-hataskor-wizard',

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
            // Wizard lépés - TELJESEN BEFEJEZETT
            currentStep: 4,
            totalSteps: 4,

            // Ellenőrzési csoportok
            groups: {
                alapveto: {
                    nev: 'Alapvető követelmények',
                    leiras: 'Hatáskör és illetékesség alapvető feltételeinek vizsgálata',
                    items: [
                        {
                            id: 'h1',
                            title: 'Hatáskör biztosított',
                            description: 'A kérelem tárgya a hatóság hatáskörébe tartozik',
                            help: 'Ellenőrizze, hogy az 123/2023. (XII. 15.) Korm. rendelet szerint a vasúti járművezetők alkalmassági vizsgálata a VHF hatáskörébe tartozik-e.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'A 123/2023. (XII. 15.) Korm. rendelet 5. § (1) bekezdése alapján a hatáskör biztosított.'
                        },
                        {
                            id: 'h2',
                            title: 'Illetékesség fennáll',
                            description: 'Területi illetékesség megállapítható',
                            help: 'A kérelmező lakhelye vagy a munkáltató székhelye alapján ellenőrizze a területi illetékességet.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'A kérelmező lakhelye Budapest, a VHF illetékessége fennáll.'
                        },
                        {
                            id: 'h3',
                            title: 'Jogosultság ellenőrzése',
                            description: 'A kérelmező jogosult a kérelem benyújtására',
                            help: 'Ellenőrizze, hogy a kérelmező a saját nevében jár-e el, vagy megfelelő meghatalmazással rendelkezik.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'A kérelmező saját nevében jár el, jogosultsága igazolt.'
                        }
                    ]
                },
                jogszabaly: {
                    nev: 'Jogszabályi megfelelés',
                    leiras: 'Vonatkozó jogszabályok és eljárási szabályok ellenőrzése',
                    items: [
                        {
                            id: 'j1',
                            title: 'Vonatkozó jogszabály azonosítása',
                            description: '123/2023. (XII. 15.) Korm. rendelet alapján',
                            help: 'Azonosítsa a vonatkozó jogszabályokat és ellenőrizze azok hatályosságát.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: '123/2023. (XII. 15.) Korm. rendelet hatályos.'
                        },
                        {
                            id: 'j2',
                            title: 'Eljárási szabályok betartása',
                            description: 'Ákr. szerinti eljárási szabályok alkalmazhatók',
                            help: 'Az általános közigazgatási rendtartásról szóló törvény szabályainak megfelelően folyik-e az eljárás.',
                            required: true,
                            checked: true,
                            result: 'pass',
                            megjegyzes: 'Az eljárás az Ákr. szabályai szerint folyik.'
                        }
                    ]
                }
            },

            // Döntés - ELŐRE KITÖLTVE
            decision: 'megfelelt',
            decisionNote: 'A hatáskör és illetékesség vizsgálata során megállapítást nyert, hogy a hatóság rendelkezik a hatáskörrel és illetékességgel az ügy elbírálására. A kérelmező jogosultsága igazolt, a vonatkozó jogszabályi előírások teljesülnek. Az eljárás folytatható.',

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
                1: 'Alapvető követelmények',
                2: 'Jogszabályi megfelelés',
                3: 'Döntés meghozatala',
                4: 'Összegzés és befejezés'
            };
            return titles[this.currentStep] || '';
        },

        // Aktuális csoport
        currentGroup() {
            if (this.currentStep === 1) return this.groups.alapveto;
            if (this.currentStep === 2) return this.groups.jogszabaly;
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
            if (this.currentStep === 1 || this.currentStep === 2) {
                // Minden kötelező elem ellenőrzve
                return this.currentGroup.items
                    .filter(item => item.required)
                    .every(item => item.checked && item.result);
            }
            if (this.currentStep === 3) {
                return this.decision !== null && this.decisionNote.length >= 30;
            }
            return true;
        },

        // Összes követelmény teljesült?
        allPassed() {
            return Object.values(this.groups).every(group =>
                group.items.every(item => !item.required || item.result === 'pass')
            );
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
                this.decisionNote = 'A hatáskör és illetékesség vizsgálata során megállapítást nyert, hogy a hatóság rendelkezik a hatáskörrel és illetékességgel az ügy elbírálására. A kérelmező jogosultsága igazolt, a vonatkozó jogszabályi előírások teljesülnek. Az eljárás folytatható.';
            } else if (type === 'nemfeleltmeg') {
                this.decisionNote = 'A hatáskör és illetékesség vizsgálata során megállapítást nyert, hogy a hatóság nem rendelkezik hatáskörrel vagy illetékességgel az ügy elbírálására. Az eljárás megszüntetésre kerül.';
            }
        },

        // Befejezés
        complete() {
            const result = {
                type: 'hataskor-vizsgalat',
                kod: 'F-0064',
                uce: 'UCE-1793',
                decision: this.decision,
                decisionNote: this.decisionNote,
                stats: this.stats,
                groups: this.groups,
                reviewedBy: this.reviewedBy,
                reviewDate: this.reviewDate,
                completedAt: new Date().toISOString()
            };

            console.log('Hatáskör vizsgálat befejezve:', result);
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
                            {{ n === 1 ? 'Alapvető' :
                               n === 2 ? 'Jogszabályi' :
                               n === 3 ? 'Döntés' :
                               'Összegzés' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard tartalom -->
            <div class="wizard-content">
                <!-- Lépés 1-2: Ellenőrzési csoportok -->
                <div v-if="currentStep === 1 || currentStep === 2" class="wizard-step-content">
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
                                        <label class="form-label small fw-bold">Megjegyzés (opcionális)</label>
                                        <textarea class="form-control form-control-sm"
                                                  rows="2"
                                                  v-model="item.megjegyzes"
                                                  placeholder="További megjegyzések..."></textarea>
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

                <!-- Lépés 3: Döntés -->
                <div v-if="currentStep === 3" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Az ellenőrzések alapján hozzon döntést a hatáskör és illetékesség fennállásáról.
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

                    <!-- Döntési gombok -->
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="wizard-card"
                                 :class="{ 'selected': decision === 'megfelelt' }"
                                 @click="makeDecision('megfelelt')">
                                <div class="text-center">
                                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                                    <h5 class="mt-3">Hatáskör fennáll</h5>
                                    <p class="text-muted small">
                                        A hatóság rendelkezik hatáskörrel és illetékességgel
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="wizard-card"
                                 :class="{ 'selected': decision === 'nemfeleltmeg' }"
                                 @click="makeDecision('nemfeleltmeg')">
                                <div class="text-center">
                                    <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
                                    <h5 class="mt-3">Hatáskör hiányzik</h5>
                                    <p class="text-muted small">
                                        A hatóság nem rendelkezik hatáskörrel vagy illetékességgel
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

                <!-- Lépés 4: Összegzés -->
                <div v-if="currentStep === 4" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Ellenőrizze a hatáskör vizsgálat eredményét mielőtt véglegesíti.
                    </p>

                    <div class="wizard-summary">
                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-clipboard-check me-2"></i> Vizsgálat eredménye</h6>
                            <div class="wizard-summary-value">
                                <span class="badge"
                                      :class="decision === 'megfelelt' ? 'bg-success' : 'bg-danger'"
                                      style="font-size: 1rem; padding: 0.5rem 1rem;">
                                    {{ decision === 'megfelelt' ? 'HATÁSKÖR FENNÁLL' : 'HATÁSKÖR HIÁNYZIK' }}
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
                                    <small class="text-muted">Megfelelt:</small>
                                    <div class="fw-bold text-success">{{ stats.passed }}</div>
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
                            <strong>Figyelem!</strong> A hatáskör vizsgálat befejezése után a döntés visszavonhatatlan.
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
