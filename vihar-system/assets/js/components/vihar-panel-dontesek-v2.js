/**
 * VAHAP - Döntési Pontok Panel V2 (INTELLIGENS VERZIÓ)
 * F-0088 - Döntés-előkészítés döntés
 * Workflow-állapot függő dinamikus döntési gombok
 *
 * Funkciók:
 * - Workflow állapot alapú gomb engedélyezés/tiltás
 * - Kontextus-specifikus információk megjelenítése
 * - Előfeltételek ellenőrzése
 * - Következő ajánlott lépés jelzése
 * - Részletes tooltipek és magyarázatok
 */

const VahapPanelDontesekV2 = {
    name: 'vahap-panel-dontesek-v2',
    emits: ['decision', 'navigate'],
    props: {
        activeTab: {
            type: String,
            required: false,
            default: 'kerelem'
        },
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            // Döntési előzmények
            dontesiElozmenyek: [],
            // Tooltip megjelenítés
            showTooltip: {}
        };
    },
    computed: {
        // Workflow lépések állapota
        workflowStatus() {
            return this.ugy.workflow_steps || {};
        },

        // Aktuális lépés állapota
        currentStepStatus() {
            return this.workflowStatus[this.activeTab] || { status: 'pending' };
        },

        // Aktuális workflow lépés információi
        currentStepInfo() {
            const stepMapping = {
                'kerelem': {
                    title: 'Kérelem áttekintés',
                    funkcio: 'F-0107',
                    uce: null,
                    hasDecisions: false,
                    description: 'Kérelem adatainak megtekintése és áttekintése'
                },
                'hatáskor': {
                    title: 'Hatáskör vizsgálat',
                    funkcio: 'F-0064',
                    uce: 'UCE-1793',
                    hasDecisions: true,
                    description: 'Hatáskör és illetékesség megállapítása',
                    prerequisites: []
                },
                'formai': {
                    title: 'Formai ellenőrzés',
                    funkcio: 'F-0065',
                    uce: 'UCE-1799',
                    hasDecisions: true,
                    description: 'Formai megfelelőség vizsgálata',
                    prerequisites: ['hatáskor']
                },
                'tartalmi': {
                    title: 'Tartalmi vizsgálat',
                    funkcio: 'F-0066',
                    uce: 'UCE-1794',
                    hasDecisions: true,
                    description: 'Tartalmi megfelelőség vizsgálata',
                    prerequisites: ['hatáskor', 'formai']
                },
                'vny024': {
                    title: 'VNY024 Adatok',
                    funkcio: 'F-0090',
                    uce: null,
                    hasDecisions: false,
                    description: 'Vasútegészségügyi nyilvántartás ellenőrzése',
                    prerequisites: ['hatáskor', 'formai', 'tartalmi']
                },
                'sommas': {
                    title: 'Sommás eljárás döntés',
                    funkcio: 'F-0088',
                    uce: 'UCE-1800',
                    hasDecisions: true,
                    description: '8 munkanap vs 60 munkanap eljárás döntés',
                    prerequisites: ['hatáskor', 'formai', 'tartalmi']
                },
                'tenyallas': {
                    title: 'Tényállás tisztázás',
                    funkcio: 'F-0102',
                    uce: 'UCE-2002',
                    hasDecisions: true,
                    description: 'Rugalmas workflow - további cselekmények',
                    prerequisites: []
                },
                'dontesi-javaslat': {
                    title: 'Döntési javaslat',
                    funkcio: 'F-0074',
                    uce: 'UCE-1826',
                    hasDecisions: true,
                    description: 'Érdemi döntési javaslat készítése',
                    prerequisites: ['hatáskor', 'formai', 'tartalmi', 'sommas']
                },
                'dokumentumok': {
                    title: 'Dokumentum tervezetek',
                    funkcio: 'F-0091',
                    uce: 'UCE-1809',
                    hasDecisions: true,
                    description: 'Végzés, Határozat, Igazolás generálása',
                    prerequisites: ['dontesi-javaslat']
                },
                'hianypotlas': {
                    title: 'Hiánypótlás',
                    funkcio: 'F-0100',
                    uce: 'UCE-2000',
                    hasDecisions: true,
                    description: 'Hiánypótlási felszólítás készítése',
                    prerequisites: []
                },
                'ertesites': {
                    title: 'Ügyfél értesítés',
                    funkcio: 'F-0089',
                    uce: null,
                    hasDecisions: true,
                    description: 'Ügyfél értesítések küldése',
                    prerequisites: []
                },
                'velemenyezes': {
                    title: 'Véleményeztetés',
                    funkcio: 'F-0096',
                    uce: 'UCE-1824',
                    hasDecisions: true,
                    description: 'Döntési javaslat véleményeztetése',
                    prerequisites: ['dontesi-javaslat']
                },
                'vezetoi-dontes': {
                    title: 'Vezetői döntés',
                    funkcio: 'F-0099',
                    uce: null,
                    hasDecisions: true,
                    description: 'Osztályvezető jóváhagyása',
                    prerequisites: ['dontesi-javaslat']
                },
                'lezaras': {
                    title: 'Ügy lezárása',
                    funkcio: 'F-0097',
                    uce: 'UCE-1828',
                    hasDecisions: true,
                    description: 'Ügy lezárása és archíválása',
                    prerequisites: ['vezetoi-dontes']
                }
            };

            return stepMapping[this.activeTab] || {
                title: 'Ismeretlen lépés',
                funkcio: null,
                uce: null,
                hasDecisions: false,
                description: '',
                prerequisites: []
            };
        },

        // Előfeltételek teljesülnek-e?
        prerequisitesMet() {
            if (!this.currentStepInfo.prerequisites || this.currentStepInfo.prerequisites.length === 0) {
                return true;
            }

            return this.currentStepInfo.prerequisites.every(prereq => {
                const status = this.workflowStatus[prereq];
                return status && status.status === 'completed';
            });
        },

        // Hiányzó előfeltételek
        missingPrerequisites() {
            if (!this.currentStepInfo.prerequisites) return [];

            return this.currentStepInfo.prerequisites.filter(prereq => {
                const status = this.workflowStatus[prereq];
                return !status || status.status !== 'completed';
            });
        },

        // Következő ajánlott lépés
        nextRecommendedStep() {
            const steps = ['kerelem', 'hatáskor', 'formai', 'tartalmi', 'vny024', 'sommas',
                          'dontesi-javaslat', 'velemenyezes', 'vezetoi-dontes', 'dokumentumok', 'lezaras'];

            for (const step of steps) {
                const status = this.workflowStatus[step];
                if (!status || status.status === 'pending') {
                    return step;
                }
            }
            return null;
        },

        // Kontextus-specifikus statisztika
        contextStats() {
            const stats = {};

            // Hatáskör tab
            if (this.activeTab === 'hatáskor') {
                const data = this.ugy.hatáskor_data;
                if (data) {
                    const checks = Object.values(data.checks || {});
                    stats.teljesult = checks.filter(c => c === true).length;
                    stats.osszes = checks.length;
                    stats.dontes = data.dontes;
                }
            }

            // Formai tab
            if (this.activeTab === 'formai') {
                const data = this.ugy.formai_data;
                if (data) {
                    const checks = Object.values(data.checks || {});
                    stats.teljesult = checks.filter(c => c === true).length;
                    stats.osszes = checks.length;
                    stats.hianyossagok = (data.hianyossagok || []).length;
                }
            }

            // Tartalmi tab
            if (this.activeTab === 'tartalmi') {
                const data = this.ugy.tartalmi_data;
                if (data) {
                    const checks = Object.values(data.checks || {});
                    stats.teljesult = checks.filter(c => c === true).length;
                    stats.osszes = checks.length;
                    stats.hibak = (data.tartalmi_hibak || []).length;
                }
            }

            // Sommás tab
            if (this.activeTab === 'sommas') {
                const data = this.ugy.sommas_data;
                if (data) {
                    stats.valasztott = data.selectedOption === 'sommas_8nap' ? '8 munkanap' : '60 munkanap';
                    stats.hatarido = data.hataridoDatum;
                }
            }

            // Döntési javaslat
            if (this.activeTab === 'dontesi-javaslat') {
                const data = this.ugy.dontesi_javaslat_data;
                if (data) {
                    stats.tipus = data.dontesiTipus;
                    stats.feltetelek = (data.feltetelek || []).length;
                    stats.ertesitendok = (data.ertesitendo_felek || []).length;
                }
            }

            return stats;
        },

        // Van-e döntési előzmény az aktuális tabhoz
        hasHistoryForCurrentTab() {
            return this.dontesiElozmenyek.some(e => e.tab === this.activeTab);
        },

        // Utolsó döntés az aktuális tabhoz
        lastDecisionForCurrentTab() {
            const history = this.dontesiElozmenyek.filter(e => e.tab === this.activeTab);
            return history.length > 0 ? history[history.length - 1] : null;
        }
    },
    methods: {
        // Döntés kibocsátása
        emitDecision(decision, metadata = {}) {
            const decisionData = {
                tab: this.activeTab,
                decision: decision,
                timestamp: new Date().toISOString(),
                funkcio: this.currentStepInfo.funkcio,
                uce: this.currentStepInfo.uce,
                ...metadata
            };

            console.log('[F-0088] Döntési pont:', decisionData);

            // Előzmény rögzítése
            this.dontesiElozmenyek.push(decisionData);

            this.$emit('decision', decisionData);
        },

        // Navigálás workflow lépésre
        navigateTo(tabId) {
            console.log('[PANEL-DONTESEK-V2] Navigálás:', tabId);
            this.$emit('navigate', tabId);
        },

        // Előzmények betöltése
        loadHistory() {
            if (this.ugy && this.ugy.dontesi_elozmenyek) {
                this.dontesiElozmenyek = [...this.ugy.dontesi_elozmenyek];
            }
        },

        // Státusz badge osztály
        getStatusBadgeClass(status) {
            const map = {
                'completed': 'bg-success',
                'in-progress': 'bg-warning',
                'pending': 'bg-secondary',
                'skipped': 'bg-light text-dark'
            };
            return map[status] || 'bg-secondary';
        },

        // Státusz szöveg
        getStatusText(status) {
            const map = {
                'completed': 'Befejezve',
                'in-progress': 'Folyamatban',
                'pending': 'Várakozik',
                'skipped': 'Kihagyva'
            };
            return map[status] || status;
        }
    },
    watch: {
        ugy: {
            handler() {
                this.loadHistory();
            },
            deep: true
        }
    },
    mounted() {
        this.loadHistory();
    },
    template: `
        <div class="border-bottom p-3 bg-white">
            <!-- Panel fejléc -->
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1">
                        <i class="bi bi-check-circle"></i> Döntési pontok
                    </h6>
                    <div class="small text-muted">
                        <span v-if="currentStepInfo.funkcio" class="badge badge-function me-1">
                            {{ currentStepInfo.funkcio }}
                        </span>
                        <span v-if="currentStepInfo.uce" class="badge badge-uce">
                            {{ currentStepInfo.uce }}
                        </span>
                    </div>
                </div>
                <span class="badge" :class="getStatusBadgeClass(currentStepStatus.status)">
                    {{ getStatusText(currentStepStatus.status) }}
                </span>
            </div>

            <!-- Lépés leírás -->
            <div class="alert alert-light border mb-3">
                <small class="text-muted">
                    <i class="bi bi-info-circle"></i>
                    {{ currentStepInfo.description }}
                </small>
            </div>

            <!-- Előfeltételek figyelmeztetés -->
            <div v-if="!prerequisitesMet && currentStepInfo.prerequisites.length > 0"
                 class="alert alert-warning mb-3">
                <small>
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Előfeltételek hiányoznak:</strong>
                    <ul class="mb-0 mt-1">
                        <li v-for="prereq in missingPrerequisites" :key="prereq">
                            {{ prereq }}
                        </li>
                    </ul>
                </small>
            </div>

            <!-- Kontextus statisztika -->
            <div v-if="Object.keys(contextStats).length > 0" class="alert alert-info border mb-3">
                <small>
                    <strong><i class="bi bi-graph-up"></i> Aktuális állapot:</strong>
                    <div class="mt-1">
                        <div v-if="contextStats.teljesult !== undefined">
                            Teljesített: {{ contextStats.teljesult }} / {{ contextStats.osszes }}
                        </div>
                        <div v-if="contextStats.hianyossagok !== undefined">
                            Hiányosságok: {{ contextStats.hianyossagok }}
                        </div>
                        <div v-if="contextStats.hibak !== undefined">
                            Hibák: {{ contextStats.hibak }}
                        </div>
                        <div v-if="contextStats.dontes">
                            Döntés: <strong>{{ contextStats.dontes }}</strong>
                        </div>
                        <div v-if="contextStats.valasztott">
                            Eljárás: <strong>{{ contextStats.valasztott }}</strong>
                        </div>
                        <div v-if="contextStats.hatarido">
                            Határidő: <strong>{{ contextStats.hatarido }}</strong>
                        </div>
                        <div v-if="contextStats.tipus">
                            Javaslat: <strong>{{ contextStats.tipus }}</strong>
                        </div>
                        <div v-if="contextStats.feltetelek !== undefined">
                            Feltételek: {{ contextStats.feltetelek }} db
                        </div>
                    </div>
                </small>
            </div>

            <!-- Utolsó döntés indikátor (ha van) -->
            <div v-if="lastDecisionForCurrentTab" class="alert alert-sm alert-success border mb-3">
                <small>
                    <i class="bi bi-check-circle"></i>
                    <strong>Utolsó döntés:</strong> {{ lastDecisionForCurrentTab.decision }}
                    <br>
                    <span class="text-muted">{{ new Date(lastDecisionForCurrentTab.timestamp).toLocaleString('hu-HU') }}</span>
                </small>
            </div>

            <!-- KÉRELEM TAB - Nincs döntési pont -->
            <div v-if="activeTab === 'kerelem'" class="text-center py-3">
                <i class="bi bi-file-earmark-text text-primary fs-2"></i>
                <div class="small mt-2 text-muted">Kérelem megtekintése</div>
                <div class="small text-muted">Nincs döntési pont</div>
                <button class="btn btn-outline-primary btn-sm mt-3"
                        @click="navigateTo('hatáskor')">
                    <i class="bi bi-arrow-right"></i>
                    Következő: Hatáskör vizsgálat
                </button>
            </div>

            <!-- HATÁSKÖR TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'hatáskor'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('hatáskor_van'); navigateTo('formai')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-check-circle"></i>
                    Hatáskör biztosított
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('illetekesseg_nincs')">
                    <i class="bi bi-arrow-left-right"></i>
                    Illetékesség hiányzik
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('hatáskor_nincs')">
                    <i class="bi bi-x-circle"></i>
                    Hatáskör nincs - Áttétel
                </button>
            </div>

            <!-- FORMAI TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'formai'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('megfelel'); navigateTo('tartalmi')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-check-circle"></i>
                    Formailag megfelelő
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('hianypotlas_szukseges'); navigateTo('hianypotlas')">
                    <span class="badge bg-light text-dark me-1">F-0100</span>
                    Hiánypótlás szükséges
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('nem_megfelel')">
                    <i class="bi bi-x-circle"></i>
                    Formailag elutasítás
                </button>
            </div>

            <!-- TARTALMI TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'tartalmi'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('megfelel'); navigateTo('sommas')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-check-circle"></i>
                    Tartalmilag megfelelő
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-info btn-sm"
                        @click="emitDecision('felteteles_megfelel')">
                    <i class="bi bi-info-circle"></i>
                    Feltételesen megfelelő
                </button>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('hianypotlas'); navigateTo('hianypotlas')">
                    <span class="badge bg-light text-dark me-1">F-0100</span>
                    Hiánypótlás
                </button>
                <button class="btn btn-outline-primary btn-sm"
                        @click="emitDecision('tenyallas'); navigateTo('tenyallas')">
                    <span class="badge bg-primary me-1">F-0102</span>
                    Tényállás tisztázás
                </button>
            </div>

            <!-- VNY024 TAB -->
            <div v-else-if="activeTab === 'vny024'" class="text-center py-3">
                <i class="bi bi-database text-info fs-2"></i>
                <div class="small mt-2 text-muted">VNY024 Nyilvántartás</div>
                <button class="btn btn-outline-primary btn-sm mt-3"
                        @click="emitDecision('vny024_ellenorizve'); navigateTo('sommas')">
                    <i class="bi bi-check"></i>
                    Adatok ellenőrizve
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>

            <!-- SOMMÁS ELJÁRÁS TAB -->
            <div v-else-if="activeTab === 'sommas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-lightning"></i>
                    <strong>Eljárás típusa</strong>
                </div>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('sommas_8nap', { hatarido_nap: 8 }); navigateTo('dontesi-javaslat')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-lightning-charge"></i>
                    Sommás eljárás (8 nap)
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-primary btn-sm"
                        @click="emitDecision('teljes_60nap', { hatarido_nap: 60 }); navigateTo('dontesi-javaslat')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-calendar-range"></i>
                    Teljes eljárás (60 nap)
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>

            <!-- TÉNYÁLLÁS TISZTÁZÁS TAB -->
            <div v-else-if="activeTab === 'tenyallas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-search"></i>
                    <strong>Rugalmas workflow</strong>
                </div>
                <button class="btn btn-outline-primary btn-sm"
                        @click="emitDecision('szemle')">
                    <span class="badge bg-primary me-1">UCE-2051</span>
                    Helyszíni szemle
                </button>
                <button class="btn btn-outline-info btn-sm"
                        @click="emitDecision('szakertoi_velemeny')">
                    <span class="badge bg-info me-1">UCE-2053</span>
                    Szakértői vélemény
                </button>
                <button class="btn btn-outline-secondary btn-sm"
                        @click="emitDecision('megkerese')">
                    <span class="badge bg-secondary me-1">UCE-2054</span>
                    Megkeresés
                </button>
                <button class="btn btn-success btn-sm mt-2"
                        @click="emitDecision('tenyallas_tisztazott'); navigateTo('dontesi-javaslat')">
                    <i class="bi bi-check-circle"></i>
                    Tényállás tisztázott
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>

            <!-- DÖNTÉSI JAVASLAT TAB -->
            <div v-else-if="activeTab === 'dontesi-javaslat'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-pencil-square"></i>
                    <strong>Javaslat típusa</strong>
                </div>
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('engedelyezes'); navigateTo('vezetoi-dontes')"
                        :disabled="!prerequisitesMet">
                    <span class="badge bg-light text-success me-1">F-0092</span>
                    Engedélyező javaslat
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('elutasitas')"
                        :disabled="!prerequisitesMet">
                    <span class="badge bg-light text-danger me-1">F-0092</span>
                    Elutasító javaslat
                </button>
                <button class="btn btn-outline-primary btn-sm mt-2"
                        @click="navigateTo('dokumentumok')">
                    <i class="bi bi-file-earmark-text"></i>
                    Tervezetek készítése
                </button>
            </div>

            <!-- DOKUMENTUMOK TAB -->
            <div v-else-if="activeTab === 'dokumentumok'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-file-earmark-text"></i>
                    <strong>Dokumentum generálás</strong>
                </div>
                <button class="btn btn-outline-primary btn-sm"
                        @click="emitDecision('vegzes_tervezet')">
                    <span class="badge bg-primary me-1">F-0091</span>
                    Végzés tervezet
                </button>
                <button class="btn btn-outline-success btn-sm"
                        @click="emitDecision('hatarozat_tervezet')">
                    <span class="badge bg-success me-1">F-0092</span>
                    Határozat tervezet
                </button>
                <button class="btn btn-outline-info btn-sm"
                        @click="emitDecision('igazolas_tervezet')">
                    <span class="badge bg-info me-1">F-0093</span>
                    Igazolás tervezet
                </button>
                <button class="btn btn-success btn-sm mt-2"
                        @click="navigateTo('vezetoi-dontes')">
                    <i class="bi bi-arrow-right"></i>
                    Tovább: Vezetői döntés
                </button>
            </div>

            <!-- HIÁNYPÓTLÁS TAB -->
            <div v-else-if="activeTab === 'hianypotlas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <span class="badge badge-uce">UCE-2000</span>
                    Hiánypótlás kezelése
                </div>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('felszolitas_kikuldes')">
                    <i class="bi bi-envelope"></i>
                    Felszólítás kiküldése
                </button>
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('teljesitve'); navigateTo(nextRecommendedStep)">
                    <i class="bi bi-check-circle"></i>
                    Hiánypótlás teljesítve
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-info btn-sm"
                        @click="emitDecision('reszben_teljesitve')">
                    <i class="bi bi-info-circle"></i>
                    Részben teljesítve (új kör)
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('nem_teljesitve')">
                    <i class="bi bi-x-circle"></i>
                    Nem teljesítve - Elutasítás
                </button>
            </div>

            <!-- ÜGYFÉL ÉRTESÍTÉS TAB -->
            <div v-else-if="activeTab === 'ertesites'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-envelope"></i>
                    <strong>Értesítés módja</strong>
                </div>
                <button class="btn btn-outline-primary btn-sm"
                        @click="emitDecision('email')">
                    <i class="bi bi-envelope-at"></i>
                    E-mail értesítés
                </button>
                <button class="btn btn-outline-secondary btn-sm"
                        @click="emitDecision('level')">
                    <i class="bi bi-mailbox"></i>
                    Postai levél
                </button>
                <button class="btn btn-outline-info btn-sm"
                        @click="emitDecision('ekr')">
                    <i class="bi bi-file-earmark-lock"></i>
                    EKR értesítés
                </button>
            </div>

            <!-- VÉLEMÉNYEZÉS TAB -->
            <div v-else-if="activeTab === 'velemenyezes'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <span class="badge badge-uce">UCE-1824</span>
                    Véleményeztetés
                </div>
                <button class="btn btn-primary btn-sm"
                        @click="emitDecision('vezeto_velemenyezes')">
                    <i class="bi bi-person-badge"></i>
                    Vezető véleményezés
                </button>
                <button class="btn btn-info btn-sm"
                        @click="emitDecision('kollegialis_velemenyezes')">
                    <i class="bi bi-people"></i>
                    Kollegiális véleményezés
                </button>
                <button class="btn btn-success btn-sm mt-2"
                        @click="emitDecision('velemenyezes_kesz'); navigateTo('vezetoi-dontes')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-check-circle"></i>
                    Véleményezés kész
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>

            <!-- VEZETŐI DÖNTÉS TAB -->
            <div v-else-if="activeTab === 'vezetoi-dontes'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-award"></i>
                    <strong>Vezetői jóváhagyás</strong>
                </div>
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('jovahagyva'); navigateTo('lezaras')"
                        :disabled="!prerequisitesMet">
                    <i class="bi bi-check-circle"></i>
                    Jóváhagyva
                    <i class="bi bi-arrow-right ms-1"></i>
                </button>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('modositassal_jovahagyva')">
                    <i class="bi bi-pencil"></i>
                    Módosítással jóváhagyva
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('elutasitva')">
                    <i class="bi bi-x-circle"></i>
                    Elutasítva
                </button>
                <button class="btn btn-info btn-sm"
                        @click="emitDecision('visszakuldve_javitasra'); navigateTo('dontesi-javaslat')">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Visszaküldve javításra
                </button>
            </div>

            <!-- LEZÁRÁS TAB -->
            <div v-else-if="activeTab === 'lezaras'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <span class="badge badge-uce">UCE-1828</span>
                    Ügy lezárás típusa
                </div>
                <button class="btn btn-success btn-sm"
                        @click="emitDecision('engedelyezve_forras')"
                        :disabled="!prerequisitesMet">
                    <span class="badge bg-light text-success me-1">F-0098</span>
                    Engedélyezve + FORRÁS
                </button>
                <button class="btn btn-danger btn-sm"
                        @click="emitDecision('elutasitva')">
                    <i class="bi bi-x-circle"></i>
                    Elutasítva
                </button>
                <button class="btn btn-secondary btn-sm"
                        @click="emitDecision('visszavont')">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Visszavont
                </button>
                <button class="btn btn-warning btn-sm"
                        @click="emitDecision('felfuggesztett')">
                    <i class="bi bi-pause-circle"></i>
                    Felfüggesztett
                </button>
            </div>

            <!-- DEFAULT -->
            <div v-else class="text-muted text-center py-3">
                <i class="bi bi-info-circle fs-2"></i>
                <div class="small mt-2">{{ currentStepInfo.title }}</div>
                <div class="small">Nincs aktív döntési pont</div>
            </div>

            <!-- Következő ajánlott lépés -->
            <div v-if="nextRecommendedStep && nextRecommendedStep !== activeTab"
                 class="mt-3 pt-2 border-top">
                <small class="text-muted d-block mb-2">
                    <i class="bi bi-lightbulb"></i>
                    Következő ajánlott lépés:
                </small>
                <button class="btn btn-outline-primary btn-sm w-100"
                        @click="navigateTo(nextRecommendedStep)">
                    <i class="bi bi-arrow-right"></i>
                    {{ nextRecommendedStep }}
                </button>
            </div>

            <!-- Döntési előzmények számláló -->
            <div v-if="dontesiElozmenyek.length > 0" class="mt-3 pt-2 border-top">
                <small class="text-muted">
                    <i class="bi bi-clock-history"></i>
                    {{ dontesiElozmenyek.length }} döntés rögzítve
                </small>
            </div>
        </div>
    `
};
