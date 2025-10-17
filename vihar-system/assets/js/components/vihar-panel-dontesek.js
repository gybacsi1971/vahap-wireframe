/**
 * VAHAP - Döntési Pontok Panel (TELJES VERZIÓ - Jobb oldal)
 * F-0088 - Döntés-előkészítés döntés
 * Aktív tab szerint dinamikus döntési gombok
 * Használat: <vahap-panel-dontesek :active-tab="activeTab" :ugy="ugy" @decision="handleDecision"></vahap-panel-dontesek>
 *
 * Funkciók:
 * - Dinamikus döntési gombok minden workflow lépéshez
 * - UCE és F kódok megjelenítése
 * - Ügy állapot alapú gombok engedélyezése/tiltása
 * - Döntési előzmények megjelenítése
 * - Következő lépés ajánlása
 */

const VahapPanelDontesek = {
    name: 'vahap-panel-dontesek',
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
            dontesiElozmenyek: []
        };
    },
    computed: {
        // Aktuális workflow lépés információi
        currentStepInfo() {
            const stepMapping = {
                'kerelem': {
                    title: 'Kérelem áttekintés',
                    funkcio: 'F-0107',
                    uce: null,
                    hasDecisions: false
                },
                'hatáskor': {
                    title: 'Hatáskör vizsgálat',
                    funkcio: 'F-0064',
                    uce: 'UCE-1793',
                    hasDecisions: true
                },
                'formai': {
                    title: 'Formai ellenőrzés',
                    funkcio: 'F-0065',
                    uce: 'UCE-1799',
                    hasDecisions: true
                },
                'tartalmi': {
                    title: 'Tartalmi vizsgálat',
                    funkcio: 'F-0066',
                    uce: 'UCE-1794',
                    hasDecisions: true
                },
                'vny024': {
                    title: 'VNY024 Adatok',
                    funkcio: 'F-0090',
                    uce: null,
                    hasDecisions: false
                },
                'sommas': {
                    title: 'Sommás eljárás döntés',
                    funkcio: 'F-0088',
                    uce: 'UCE-1800',
                    hasDecisions: true
                },
                'tenyallas': {
                    title: 'Tényállás tisztázás',
                    funkcio: 'F-0102',
                    uce: 'UCE-2002',
                    hasDecisions: true
                },
                'dontesi-javaslat': {
                    title: 'Döntési javaslat',
                    funkcio: 'F-0074',
                    uce: 'UCE-1826',
                    hasDecisions: true
                },
                'dokumentumok': {
                    title: 'Dokumentum tervezetek',
                    funkcio: 'F-0091',
                    uce: 'UCE-1809',
                    hasDecisions: true
                },
                'hianypotlas': {
                    title: 'Hiánypótlás',
                    funkcio: 'F-0100',
                    uce: 'UCE-2000',
                    hasDecisions: true
                },
                'ertesites': {
                    title: 'Ügyfél értesítés',
                    funkcio: 'F-0089',
                    uce: null,
                    hasDecisions: true
                },
                'velemenyezes': {
                    title: 'Véleményeztetés',
                    funkcio: 'F-0096',
                    uce: 'UCE-1824',
                    hasDecisions: true
                },
                'vezetoi-dontes': {
                    title: 'Vezetői döntés',
                    funkcio: 'F-0099',
                    uce: null,
                    hasDecisions: true
                },
                'lezaras': {
                    title: 'Ügy lezárása',
                    funkcio: 'F-0097',
                    uce: 'UCE-1828',
                    hasDecisions: true
                }
            };

            return stepMapping[this.activeTab] || {
                title: 'Ismeretlen lépés',
                funkcio: null,
                uce: null,
                hasDecisions: false
            };
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
            console.log('[PANEL-DONTESEK] Navigálás:', tabId);
            this.$emit('navigate', tabId);
        },

        // Előzmények betöltése (ha van mentett adat)
        loadHistory() {
            if (this.ugy && this.ugy.dontesi_elozmenyek) {
                this.dontesiElozmenyek = [...this.ugy.dontesi_elozmenyek];
            }
        }
    },
    mounted() {
        this.loadHistory();
    },
    template: `
        <div class="border-bottom p-3 bg-white">
            <!-- Panel fejléc -->
            <h6 class="mb-1">
                <i class="bi bi-check-circle"></i> Döntési pontok
            </h6>
            <div class="small text-muted mb-3">
                <span v-if="currentStepInfo.funkcio" class="badge badge-function me-1">
                    {{ currentStepInfo.funkcio }}
                </span>
                <span v-if="currentStepInfo.uce" class="badge badge-uce">
                    {{ currentStepInfo.uce }}
                </span>
            </div>

            <!-- Utolsó döntés indikátor (ha van) -->
            <div v-if="lastDecisionForCurrentTab" class="alert alert-sm alert-light border mb-3">
                <small>
                    <i class="bi bi-clock-history"></i>
                    <strong>Utolsó döntés:</strong> {{ lastDecisionForCurrentTab.decision }}
                    <br>
                    <span class="text-muted">{{ new Date(lastDecisionForCurrentTab.timestamp).toLocaleString('hu-HU') }}</span>
                </small>
            </div>

            <!-- KÉRELEM TAB - Nincs döntési pont -->
            <div v-if="activeTab === 'kerelem'" class="text-muted text-center py-3">
                <i class="bi bi-file-earmark-text fs-2"></i>
                <div class="small mt-2">Kérelem megtekintése</div>
                <div class="small">Nincs döntési pont</div>
            </div>

            <!-- HATÁSKÖR TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'hatáskor'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm" @click="emitDecision('hatáskor_van')">
                    <i class="bi bi-check-circle"></i>
                    Hatáskör biztosított
                </button>
                <button class="btn btn-warning btn-sm" @click="emitDecision('illetekesseg_nincs')">
                    <i class="bi bi-arrow-left-right"></i>
                    Illetékesség hiányzik
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('hatáskor_nincs')">
                    <i class="bi bi-x-circle"></i>
                    Hatáskör nincs - Áttétel
                </button>
            </div>

            <!-- FORMAI TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'formai'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm" @click="emitDecision('megfelel')">
                    <i class="bi bi-check-circle"></i>
                    Formailag megfelelő
                </button>
                <button class="btn btn-warning btn-sm" @click="emitDecision('hianypotlas_szukseges'); navigateTo('hianypotlas')">
                    <span class="badge bg-light text-dark me-1">F-0100</span>
                    Hiánypótlás szükséges
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('nem_megfelel')">
                    <i class="bi bi-x-circle"></i>
                    Formailag elutasítás
                </button>
            </div>

            <!-- TARTALMI TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'tartalmi'" class="d-grid gap-2">
                <button class="btn btn-success btn-sm" @click="emitDecision('megfelel')">
                    <i class="bi bi-check-circle"></i>
                    Tartalmilag megfelelő
                </button>
                <button class="btn btn-info btn-sm" @click="emitDecision('felteteles_megfelel')">
                    <i class="bi bi-info-circle"></i>
                    Feltételesen megfelelő
                </button>
                <button class="btn btn-warning btn-sm" @click="emitDecision('hianypotlas'); navigateTo('hianypotlas')">
                    <span class="badge bg-light text-dark me-1">F-0100</span>
                    Hiánypótlás
                </button>
                <button class="btn btn-outline-primary btn-sm" @click="emitDecision('tenyallas'); navigateTo('tenyallas')">
                    <span class="badge bg-primary me-1">F-0102</span>
                    Tényállás tisztázás
                </button>
            </div>

            <!-- VNY024 TAB - Információs -->
            <div v-else-if="activeTab === 'vny024'" class="text-muted text-center py-3">
                <i class="bi bi-database fs-2"></i>
                <div class="small mt-2">VNY024 Nyilvántartás</div>
                <button class="btn btn-outline-primary btn-sm mt-2" @click="emitDecision('vny024_ellenorizve')">
                    <i class="bi bi-check"></i>
                    Adatok ellenőrizve
                </button>
            </div>

            <!-- SOMMÁS ELJÁRÁS TAB DÖNTÉSEK -->
            <div v-else-if="activeTab === 'sommas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-lightning"></i>
                    <strong>Eljárás típusa</strong>
                </div>
                <button class="btn btn-warning btn-sm" @click="emitDecision('sommas_8nap', { hatarido_nap: 8 })">
                    <i class="bi bi-lightning-charge"></i>
                    Sommás eljárás (8 nap)
                </button>
                <button class="btn btn-primary btn-sm" @click="emitDecision('teljes_60nap', { hatarido_nap: 60 })">
                    <i class="bi bi-calendar-range"></i>
                    Teljes eljárás (60 nap)
                </button>
            </div>

            <!-- TÉNYÁLLÁS TISZTÁZÁS TAB -->
            <div v-else-if="activeTab === 'tenyallas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-search"></i>
                    <strong>Rugalmas workflow</strong>
                </div>
                <button class="btn btn-outline-primary btn-sm" @click="emitDecision('szemle')">
                    <span class="badge bg-primary me-1">UCE-2051</span>
                    Helyszíni szemle
                </button>
                <button class="btn btn-outline-info btn-sm" @click="emitDecision('szakertoi_velemeny')">
                    <span class="badge bg-info me-1">UCE-2053</span>
                    Szakértői vélemény
                </button>
                <button class="btn btn-outline-secondary btn-sm" @click="emitDecision('megkerese')">
                    <span class="badge bg-secondary me-1">UCE-2054</span>
                    Megkeresés
                </button>
                <button class="btn btn-success btn-sm mt-2" @click="emitDecision('tenyallas_tisztazott')">
                    <i class="bi bi-check-circle"></i>
                    Tényállás tisztázott
                </button>
            </div>

            <!-- DÖNTÉSI JAVASLAT TAB -->
            <div v-else-if="activeTab === 'dontesi-javaslat'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-pencil-square"></i>
                    <strong>Javaslat típusa</strong>
                </div>
                <button class="btn btn-success btn-sm" @click="emitDecision('engedelyezes')">
                    <span class="badge bg-light text-success me-1">F-0092</span>
                    Engedélyező javaslat
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('elutasitas')">
                    <span class="badge bg-light text-danger me-1">F-0092</span>
                    Elutasító javaslat
                </button>
                <button class="btn btn-outline-primary btn-sm mt-2" @click="navigateTo('dokumentumok')">
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
                <button class="btn btn-outline-primary btn-sm" @click="emitDecision('vegzes_tervezet')">
                    <span class="badge bg-primary me-1">F-0091</span>
                    Végzés tervezet
                </button>
                <button class="btn btn-outline-success btn-sm" @click="emitDecision('hatarozat_tervezet')">
                    <span class="badge bg-success me-1">F-0092</span>
                    Határozat tervezet
                </button>
                <button class="btn btn-outline-info btn-sm" @click="emitDecision('igazolas_tervezet')">
                    <span class="badge bg-info me-1">F-0093</span>
                    Igazolás tervezet
                </button>
                <button class="btn btn-outline-secondary btn-sm" @click="emitDecision('tajekoztatas_tervezet')">
                    <span class="badge bg-secondary me-1">F-0094</span>
                    Tájékoztatás tervezet
                </button>
            </div>

            <!-- HIÁNYPÓTLÁS TAB -->
            <div v-else-if="activeTab === 'hianypotlas'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <span class="badge badge-uce">UCE-2000</span>
                    Hiánypótlás kezelése
                </div>
                <button class="btn btn-warning btn-sm" @click="emitDecision('felszolitas_kikuldes')">
                    <i class="bi bi-envelope"></i>
                    Felszólítás kiküldése
                </button>
                <button class="btn btn-success btn-sm" @click="emitDecision('teljesitve')">
                    <i class="bi bi-check-circle"></i>
                    Hiánypótlás teljesítve
                </button>
                <button class="btn btn-info btn-sm" @click="emitDecision('reszben_teljesitve')">
                    <i class="bi bi-info-circle"></i>
                    Részben teljesítve
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('nem_teljesitve')">
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
                <button class="btn btn-outline-primary btn-sm" @click="emitDecision('email')">
                    <i class="bi bi-envelope-at"></i>
                    E-mail értesítés
                </button>
                <button class="btn btn-outline-secondary btn-sm" @click="emitDecision('level')">
                    <i class="bi bi-mailbox"></i>
                    Postai levél
                </button>
                <button class="btn btn-outline-info btn-sm" @click="emitDecision('ekr')">
                    <i class="bi bi-file-earmark-lock"></i>
                    EKR értesítés
                </button>
            </div>

            <!-- VÉLEMÉNYEZÉS TAB -->
            <div v-else-if="activeTab === 'velemenyezes'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <span class="badge badge-uce">UCE-1824</span>
                    Véleményeztetés típusa
                </div>
                <button class="btn btn-primary btn-sm" @click="emitDecision('vezeto_velemenyezes')">
                    <i class="bi bi-person-badge"></i>
                    Vezető véleményezés
                </button>
                <button class="btn btn-info btn-sm" @click="emitDecision('kollegialis_velemenyezes')">
                    <i class="bi bi-people"></i>
                    Kollegiális véleményezés
                </button>
                <button class="btn btn-success btn-sm mt-2" @click="emitDecision('velemenyezes_kesz')">
                    <i class="bi bi-check-circle"></i>
                    Véleményezés kész
                </button>
            </div>

            <!-- VEZETŐI DÖNTÉS TAB -->
            <div v-else-if="activeTab === 'vezetoi-dontes'" class="d-grid gap-2">
                <div class="small text-muted mb-2">
                    <i class="bi bi-award"></i>
                    <strong>Vezetői jóváhagyás</strong>
                </div>
                <button class="btn btn-success btn-sm" @click="emitDecision('jovahagyva')">
                    <i class="bi bi-check-circle"></i>
                    Jóváhagyva
                </button>
                <button class="btn btn-warning btn-sm" @click="emitDecision('modositassal_jovahagyva')">
                    <i class="bi bi-pencil"></i>
                    Módosítással jóváhagyva
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('elutasitva')">
                    <i class="bi bi-x-circle"></i>
                    Elutasítva
                </button>
                <button class="btn btn-info btn-sm" @click="emitDecision('visszakuldve_javitasra')">
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
                <button class="btn btn-success btn-sm" @click="emitDecision('engedelyezve_forras')">
                    <span class="badge bg-light text-success me-1">F-0098</span>
                    Engedélyezve + FORRÁS
                </button>
                <button class="btn btn-danger btn-sm" @click="emitDecision('elutasitva')">
                    <i class="bi bi-x-circle"></i>
                    Elutasítva
                </button>
                <button class="btn btn-secondary btn-sm" @click="emitDecision('visszavont')">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Visszavont
                </button>
                <button class="btn btn-warning btn-sm" @click="emitDecision('felfuggesztett')">
                    <i class="bi bi-pause-circle"></i>
                    Felfüggesztett
                </button>
            </div>

            <!-- DEFAULT - Nincs specifikus döntési pont -->
            <div v-else class="text-muted text-center py-3">
                <i class="bi bi-info-circle fs-2"></i>
                <div class="small mt-2">{{ currentStepInfo.title }}</div>
                <div class="small">Nincs aktív döntési pont</div>
            </div>

            <!-- Előzmények számláló (ha van) -->
            <div v-if="dontesiElozmenyek.length > 0" class="mt-3 pt-2 border-top">
                <small class="text-muted">
                    <i class="bi bi-clock-history"></i>
                    {{ dontesiElozmenyek.length }} döntés rögzítve
                </small>
            </div>
        </div>
    `
};
