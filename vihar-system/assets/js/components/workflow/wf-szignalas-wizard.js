/**
 * VAHAP Workflow Komponens - Szignálás Varázsló
 * Ügy szignálása wizard formában több lépésben
 * UCE-1761 - Szignálás
 */

const WfSzignalasWizard = {
    name: 'wf-szignalas-wizard',

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
            currentStep: 5,
            totalSteps: 5,

            // Adatok - ELŐRE KITÖLTVE PÉLDAADATOKKAL
            sulyossag: 'normal',
            selectedTarget: 'vhf',
            selectedUgyintezo: 'u001',
            hatarido: '',
            megjegyzes: 'Az ügy a Vasúti Hatósági Főosztály hatáskörébe tartozik. A kérelmező vasúti járművezető alkalmassági vizsgálatot kért. Kérem az ügy feldolgozását a standard eljárásrend szerint. A kérelem formailag rendben van, minden szükséges melléklet csatolásra került.',

            // Szervezeti egységek
            szervezetiEgysegek: [
                {
                    id: 'vhf',
                    nev: 'Vasúti Hatósági Főosztály',
                    rovid: 'VHF',
                    vezeto: 'Dr. Nagy Péter',
                    letszam: 15,
                    aktiv_ugyek: 42
                },
                {
                    id: 'vef',
                    nev: 'Vasúti Engedélyezési Főosztály',
                    rovid: 'VEF',
                    vezeto: 'Kiss Andrea',
                    letszam: 12,
                    aktiv_ugyek: 38
                },
                {
                    id: 'vmf',
                    nev: 'Vasúti Műszaki Főosztály',
                    rovid: 'VMF',
                    vezeto: 'Szabó János',
                    letszam: 8,
                    aktiv_ugyek: 25
                }
            ],

            // Ügyintézők
            ugyintezok: [
                {
                    id: 'u001',
                    nev: 'Dr. Kovács Péter',
                    beosztas: 'vezető ügyintéző',
                    szervezet: 'vhf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 8,
                    szakterulet: ['vasútegészségügy', 'alkalmassági vizsgálat']
                },
                {
                    id: 'u002',
                    nev: 'Nagy Andrea',
                    beosztas: 'ügyintéző',
                    szervezet: 'vhf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 12,
                    szakterulet: ['formai ellenőrzés', 'hiánypótlás']
                },
                {
                    id: 'u003',
                    nev: 'Tóth László',
                    beosztas: 'kiemelt ügyintéző',
                    szervezet: 'vef',
                    elerhetoseg: 'elfoglalt',
                    aktiv_ugyek: 15,
                    szakterulet: ['engedélyezés', 'műszaki vizsgálat']
                },
                {
                    id: 'u004',
                    nev: 'Molnár Éva',
                    beosztas: 'ügyintéző',
                    szervezet: 'vmf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 6,
                    szakterulet: ['műszaki dokumentáció', 'terv felülvizsgálat']
                }
            ],

            // Szignálási típusok
            szignalásTipusok: [
                {
                    value: 'normal',
                    label: 'Normál',
                    icon: 'bi-envelope',
                    color: 'primary',
                    leiras: 'Standard ügyintézési határidő',
                    napok: 8
                },
                {
                    value: 'surgos',
                    label: 'Sürgős',
                    icon: 'bi-exclamation-triangle',
                    color: 'warning',
                    leiras: 'Prioritás emelt, rövidített határidő',
                    napok: 3
                },
                {
                    value: 'azonnali',
                    label: 'Azonnali',
                    icon: 'bi-lightning',
                    color: 'danger',
                    leiras: 'Azonnali intézkedés szükséges',
                    napok: 1
                }
            ]
        };
    },

    computed: {
        // Progress százalék
        progressPercent() {
            return Math.round((this.currentStep / this.totalSteps) * 100);
        },

        // Aktuális lépés címe
        stepTitle() {
            const titles = {
                1: 'Sürgősség meghatározása',
                2: 'Célszervezet kiválasztása',
                3: 'Ügyintéző kiválasztása',
                4: 'Határidő és instrukciók',
                5: 'Összegzés és befejezés'
            };
            return titles[this.currentStep] || '';
        },

        // Szűrt ügyintézők
        filteredUgyintezok() {
            if (!this.selectedTarget) return [];
            return this.ugyintezok.filter(u => u.szervezet === this.selectedTarget);
        },

        // Ajánlott ügyintézők
        ajanlottUgyintezok() {
            return this.filteredUgyintezok
                .filter(u => u.elerhetoseg === 'elérhető')
                .sort((a, b) => a.aktiv_ugyek - b.aktiv_ugyek)
                .slice(0, 3);
        },

        // Lépés validáció
        canProceed() {
            switch (this.currentStep) {
                case 1:
                    return this.sulyossag !== null;
                case 2:
                    return this.selectedTarget !== null;
                case 3:
                    return this.selectedUgyintezo !== null;
                case 4:
                    return this.hatarido && this.megjegyzes.length >= 20;
                case 5:
                    return true;
                default:
                    return false;
            }
        },

        // Kiválasztott típus
        selectedTipus() {
            return this.szignalásTipusok.find(t => t.value === this.sulyossag);
        },

        // Kiválasztott szervezet
        selectedSzervezet() {
            return this.szervezetiEgysegek.find(sz => sz.id === this.selectedTarget);
        },

        // Kiválasztott ügyintéző
        selectedUgyintezoObj() {
            return this.ugyintezok.find(u => u.id === this.selectedUgyintezo);
        }
    },

    methods: {
        // Következő lépés
        nextStep() {
            if (!this.canProceed) {
                alert('Kérem töltse ki az összes kötelező mezőt!');
                return;
            }

            if (this.currentStep < this.totalSteps) {
                this.currentStep++;

                // Automatikus műveletek
                if (this.currentStep === 4 && !this.hatarido) {
                    this.calculateDeadline();
                }

                // Scroll a tetejére
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

                // Scroll a tetejére
                this.$nextTick(() => {
                    const content = document.querySelector('.wizard-content');
                    if (content) content.scrollTop = 0;
                });
            }
        },

        // Lépés ugrás
        goToStep(step) {
            // Előre csak akkor lehet lépni, ha az aktuális lépés validált
            if (step <= this.currentStep) {
                // Visszafelé mindig lehet
                this.currentStep = step;
            } else if (step === this.currentStep + 1 && this.canProceed) {
                // Egyet előre ha validált
                this.currentStep = step;
            }

            // Scroll a tetejére
            this.$nextTick(() => {
                const content = document.querySelector('.wizard-content');
                if (content) content.scrollTop = 0;
            });
        },

        // Sürgősség választás
        selectSulyossag(tipus) {
            this.sulyossag = tipus.value;
        },

        // Szervezet választás
        selectSzervezet(egyseg) {
            this.selectedTarget = egyseg.id;
            this.selectedUgyintezo = null;

            // Auto-select ajánlott ügyintéző
            if (this.ajanlottUgyintezok.length > 0) {
                this.selectedUgyintezo = this.ajanlottUgyintezok[0].id;
            }
        },

        // Ügyintéző választás
        selectUgyintezo(ugyintezo) {
            this.selectedUgyintezo = ugyintezo.id;
        },

        // Határidő számítás
        calculateDeadline() {
            const today = new Date();
            const tipus = this.szignalásTipusok.find(t => t.value === this.sulyossag);
            let days = tipus ? tipus.napok : 8;

            let deadline = new Date(today);
            let addedDays = 0;

            while (addedDays < days) {
                deadline.setDate(deadline.getDate() + 1);
                if (deadline.getDay() !== 0 && deadline.getDay() !== 6) {
                    addedDays++;
                }
            }

            this.hatarido = deadline.toISOString().split('T')[0];
        },

        // Szignálás végrehajtása
        executeSzignalas() {
            const szignalas = {
                ugyId: this.ugy.ugyazonosito,
                sulyossag: this.sulyossag,
                celSzervezet: this.selectedTarget,
                ugyintezoId: this.selectedUgyintezo,
                hatarido: this.hatarido,
                megjegyzes: this.megjegyzes,
                szignalásDatum: new Date().toISOString(),
                szignaló: 'Rendszer'
            };

            console.log('Szignálás végrehajtva:', szignalas);

            this.$emit('complete', {
                type: 'szignalas',
                data: szignalas
            });
        }
    },

    mounted() {
        this.calculateDeadline();
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
                            {{ n === 1 ? 'Sürgősség' :
                               n === 2 ? 'Szervezet' :
                               n === 3 ? 'Ügyintéző' :
                               n === 4 ? 'Határidő' :
                               'Összegzés' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard tartalom -->
            <div class="wizard-content">
                <!-- Lépés 1: Sürgősség -->
                <div v-if="currentStep === 1" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Határozza meg az ügy sürgősségi szintjét. Ez befolyásolja a feldolgozás határidejét és prioritását.
                    </p>

                    <div class="row g-3">
                        <div v-for="tipus in szignalásTipusok" :key="tipus.value" class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': sulyossag === tipus.value }"
                                 @click="selectSulyossag(tipus)">
                                <div class="wizard-card-icon" :class="'text-' + tipus.color">
                                    <i :class="tipus.icon" style="font-size: 2.5rem;"></i>
                                </div>
                                <h6 class="mt-3">{{ tipus.label }}</h6>
                                <p class="text-muted small mb-2">{{ tipus.leiras }}</p>
                                <div class="badge" :class="'bg-' + tipus.color">
                                    {{ tipus.napok }} munkanap
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lépés 2: Szervezet -->
                <div v-if="currentStep === 2" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Válassza ki azt a szervezeti egységet, amely hatáskörébe tartozik az ügy feldolgozása.
                    </p>

                    <div class="row g-3">
                        <div v-for="egyseg in szervezetiEgysegek" :key="egyseg.id" class="col-md-6">
                            <div class="wizard-card"
                                 :class="{ 'selected': selectedTarget === egyseg.id }"
                                 @click="selectSzervezet(egyseg)">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h6 class="mb-1">{{ egyseg.nev }}</h6>
                                        <span class="badge bg-secondary">{{ egyseg.rovid }}</span>
                                    </div>
                                    <i v-if="selectedTarget === egyseg.id"
                                       class="bi bi-check-circle-fill text-primary"
                                       style="font-size: 1.5rem;"></i>
                                </div>
                                <div class="d-flex justify-content-between text-muted small">
                                    <span><i class="bi bi-person me-1"></i> Vezető: {{ egyseg.vezeto }}</span>
                                </div>
                                <div class="d-flex justify-content-between text-muted small mt-2">
                                    <span><i class="bi bi-people me-1"></i> {{ egyseg.letszam }} fő</span>
                                    <span><i class="bi bi-folder me-1"></i> {{ egyseg.aktiv_ugyek }} aktív ügy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lépés 3: Ügyintéző -->
                <div v-if="currentStep === 3" class="wizard-step-content">
                    <p class="text-muted mb-3">
                        Válassza ki az ügyintézőt a <strong>{{ selectedSzervezet?.nev }}</strong> szervezetből.
                    </p>

                    <div v-if="ajanlottUgyintezok.length > 0" class="alert alert-info mb-4">
                        <i class="bi bi-lightbulb-fill me-2"></i>
                        <strong>Ajánlott ügyintézők</strong> - A legkevesebb aktív üggyel rendelkező elérhető munkatársak
                    </div>

                    <div class="row g-3">
                        <div v-for="ugyintezo in filteredUgyintezok" :key="ugyintezo.id" class="col-md-6">
                            <div class="wizard-card"
                                 :class="{
                                     'selected': selectedUgyintezo === ugyintezo.id,
                                     'disabled': ugyintezo.elerhetoseg !== 'elérhető'
                                 }"
                                 @click="selectUgyintezo(ugyintezo)">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 class="mb-1">{{ ugyintezo.nev }}</h6>
                                        <small class="text-muted">{{ ugyintezo.beosztas }}</small>
                                    </div>
                                    <i v-if="selectedUgyintezo === ugyintezo.id"
                                       class="bi bi-check-circle-fill text-primary"
                                       style="font-size: 1.5rem;"></i>
                                </div>
                                <div class="mb-2">
                                    <span class="badge"
                                          :class="ugyintezo.elerhetoseg === 'elérhető' ? 'bg-success' : 'bg-warning'">
                                        {{ ugyintezo.elerhetoseg }}
                                    </span>
                                    <span class="badge bg-secondary ms-1">
                                        {{ ugyintezo.aktiv_ugyek }} aktív ügy
                                    </span>
                                </div>
                                <div class="text-muted small">
                                    <i class="bi bi-award me-1"></i>
                                    {{ ugyintezo.szakterulet.join(', ') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lépés 4: Határidő és instrukciók -->
                <div v-if="currentStep === 4" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Adja meg a feldolgozás határidejét és az ügyintéző számára szóló instrukciókat.
                    </p>

                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <label class="form-label fw-bold">
                                <i class="bi bi-calendar-event"></i> Feldolgozási határidő
                            </label>
                            <input type="date"
                                   class="form-control form-control-lg"
                                   v-model="hatarido"
                                   :min="new Date().toISOString().split('T')[0]">
                            <small class="text-muted">
                                Automatikusan számított munkanapok alapján: {{ selectedTipus?.napok }} nap
                            </small>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-chat-text"></i> Instrukciók az ügyintézőnek
                        </label>
                        <textarea class="form-control"
                                  rows="6"
                                  v-model="megjegyzes"
                                  placeholder="Írja le részletesen az ügy jellegét, a szükséges intézkedéseket, és minden releváns információt ami segíti a feldolgozást..."></textarea>
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted">
                                Minimum 20 karakter szükséges
                            </small>
                            <small :class="megjegyzes.length >= 20 ? 'text-success' : 'text-danger'">
                                {{ megjegyzes.length }}/20 karakter
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Lépés 5: Összegzés -->
                <div v-if="currentStep === 5" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Ellenőrizze a szignálás adatait mielőtt véglegesíti.
                    </p>

                    <div class="wizard-summary">
                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-speedometer2 me-2"></i> Sürgősség</h6>
                            <div class="wizard-summary-value">
                                <span class="badge" :class="'bg-' + selectedTipus?.color">
                                    <i :class="selectedTipus?.icon"></i>
                                    {{ selectedTipus?.label }}
                                </span>
                                <span class="ms-2 text-muted">{{ selectedTipus?.napok }} munkanap</span>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-building me-2"></i> Célszervezet</h6>
                            <div class="wizard-summary-value">
                                {{ selectedSzervezet?.nev }}
                                <span class="badge bg-secondary ms-2">{{ selectedSzervezet?.rovid }}</span>
                            </div>
                            <small class="text-muted">Vezető: {{ selectedSzervezet?.vezeto }}</small>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-person-check me-2"></i> Kijelölt ügyintéző</h6>
                            <div class="wizard-summary-value">
                                {{ selectedUgyintezoObj?.nev }}
                                <span class="badge bg-success ms-2">{{ selectedUgyintezoObj?.elerhetoseg }}</span>
                            </div>
                            <small class="text-muted">
                                {{ selectedUgyintezoObj?.beosztas }} |
                                Aktív ügyek: {{ selectedUgyintezoObj?.aktiv_ugyek }}
                            </small>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-calendar-check me-2"></i> Határidő</h6>
                            <div class="wizard-summary-value">
                                {{ new Date(hatarido).toLocaleDateString('hu-HU', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                }) }}
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-chat-square-text me-2"></i> Instrukciók</h6>
                            <div class="wizard-summary-value text-muted" style="white-space: pre-wrap;">
                                {{ megjegyzes }}
                            </div>
                        </div>

                        <div class="alert alert-info mt-4">
                            <i class="bi bi-info-circle me-2"></i>
                            A szignálás után az ügyintéző értesítést kap és megkezdheti a feldolgozást.
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
                            class="btn btn-success"
                            @click="executeSzignalas">
                        <i class="bi bi-check-circle"></i> Szignálás véglegesítése
                    </button>
                </div>
            </div>
        </div>
    `
};
