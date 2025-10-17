/**
 * VAHAP Workflow Komponens - Kiadmányozás
 * F-0099 - Érdemi döntés: vezetői döntés
 * UCE-1815 - Jóváhagyott döntési javaslat? (Döntési pont)
 * UCE-1820 - Jóváhagyás elutasításának indoklása
 *
 * FONTOS: Ez egy vezetői döntéshozó workflow lépés!
 * A vezető jóváhagyja vagy elutasítja a döntési javaslatot és dokumentum tervezeteket.
 */

const WfKiadmanyozas = {
    name: 'wf-kiadmanyozas',

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
            // Aktív kiadmányozási feladat
            kiadmanyozas: null,

            // Döntési formok
            showElutasitasForm: false,
            elutasitasIndoklas: '',

            // Bejelentkezett felhasználó (mock)
            currentUserId: 'VZ001', // Dr. Nagy András (Vezető)

            // Státusz
            loading: true
        };
    },

    computed: {
        // Én vagyok a kiadmányozó?
        enVagyokAKiadmanyozo() {
            if (!this.kiadmanyozas) return false;
            return this.kiadmanyozas.kiadmanyozo.id === this.currentUserId;
        },

        // Dokumentum típus badge színe
        dokumentumTipusBadge() {
            const tipus = this.kiadmanyozas?.dokumentum?.tipus;
            const badges = {
                'határozat': 'bg-success',
                'végzés': 'bg-warning',
                'igazolás': 'bg-info',
                'tájékoztatás': 'bg-secondary',
                'hirdetmény': 'bg-primary'
            };
            return badges[tipus] || 'bg-secondary';
        },

        // Határidő szín
        hataridoSzin() {
            if (!this.kiadmanyozas) return 'text-muted';
            const napok = this.kiadmanyozas.napok_hatra;
            if (napok <= 1) return 'text-danger';
            if (napok <= 3) return 'text-warning';
            return 'text-success';
        }
    },

    methods: {
        // Mock adatok betöltése
        loadMockData() {
            console.log('[Kiadmányozás] Mock adatok betöltése...');

            // Próbáljuk mindkét névvel (VahapMockData és window.VahapMockData)
            const mockDataSource = typeof VahapMockData !== 'undefined' ? VahapMockData : window.VahapMockData;

            if (mockDataSource && mockDataSource.kiadmanyozas) {
                const mockData = mockDataSource.kiadmanyozas;
                console.log('[Kiadmányozás] Mock data talált:', mockData);

                // Vesszük az első aktív feladatot (mock)
                if (mockData.aktivFeladatok && mockData.aktivFeladatok.length > 0) {
                    this.kiadmanyozas = JSON.parse(JSON.stringify(mockData.aktivFeladatok[0]));
                    console.log('[Kiadmányozás] Aktív feladat betöltve:', this.kiadmanyozas);
                } else {
                    console.warn('[Kiadmányozás] Nincs aktív kiadmányozási feladat');
                }
            } else {
                console.error('[Kiadmányozás] Mock adatok nem találhatók!');
                console.error('[Kiadmányozás] VahapMockData:', typeof VahapMockData !== 'undefined' ? 'létezik' : 'NEM létezik');
                console.error('[Kiadmányozás] window.VahapMockData:', typeof window.VahapMockData !== 'undefined' ? 'létezik' : 'NEM létezik');
            }

            this.loading = false;
        },

        // Tervezet elfogadása
        elfogadTervezet() {
            if (!this.enVagyokAKiadmanyozo) {
                alert('Ön nem jogosult a kiadmányozásra!');
                return;
            }

            if (!confirm('Biztosan jóváhagyja a döntési javaslatot és a dokumentum tervezetet?\n\nElfogadás után a dokumentum expediálásra kerül.')) {
                return;
            }

            // Kiadmányozás végrehajtása
            this.kiadmanyozas.statusz = 'jóváhagyott';
            this.kiadmanyozas.kiadmanyozas_datum = new Date().toISOString().split('T')[0];
            this.kiadmanyozas.dontes = 'elfogadva';
            this.kiadmanyozas.indoklas = null;

            console.log('[Kiadmányozás] Tervezet elfogadva:', this.kiadmanyozas);

            // Workflow továbbléptetése
            setTimeout(() => {
                alert('✅ Döntési javaslat jóváhagyva!\n\n' +
                      'A dokumentum expediálásra került.\n' +
                      'Következő lépés: Nyilvántartás frissítése vagy ügy lezárása');

                this.$emit('complete', {
                    action: 'approved',
                    result: 'Dokumentum jóváhagyva',
                    nextStep: 'expedialas'
                });
            }, 300);
        },

        // Tervezet elutasítása
        elutasitTervezet() {
            if (!this.enVagyokAKiadmanyozo) {
                alert('Ön nem jogosult a kiadmányozásra!');
                return;
            }

            this.showElutasitasForm = true;
            this.elutasitasIndoklas = '';
        },

        // Elutasítás megerősítése és indoklás mentése
        mentElutasitas() {
            if (!this.elutasitasIndoklas || this.elutasitasIndoklas.trim().length < 20) {
                alert('Kérem adjon meg részletes indoklást (legalább 20 karakter)!');
                return;
            }

            if (!confirm('Biztosan elutasítja a döntési javaslatot?\n\nElutasítás után a dokumentum visszakerül az ügyintézőhöz módosításra.')) {
                return;
            }

            // Elutasítás végrehajtása (UCE-1820)
            this.kiadmanyozas.statusz = 'elutasított';
            this.kiadmanyozas.kiadmanyozas_datum = new Date().toISOString().split('T')[0];
            this.kiadmanyozas.dontes = 'elutasítva';
            this.kiadmanyozas.indoklas = this.elutasitasIndoklas;

            console.log('[Kiadmányozás] Tervezet elutasítva:', this.kiadmanyozas);

            setTimeout(() => {
                alert('❌ Döntési javaslat elutasítva!\n\n' +
                      'Indoklás rögzítve.\n' +
                      'A dokumentum visszakerül az ügyintézőhöz módosításra.\n\n' +
                      'Következő lépés: Tényállás tisztázása vagy döntési javaslat újrakészítése');

                this.$emit('complete', {
                    action: 'rejected',
                    result: 'Dokumentum elutasítva',
                    indoklas: this.elutasitasIndoklas,
                    nextStep: 'dontes'
                });

                this.showElutasitasForm = false;
            }, 300);
        },

        // Elutasítás megszakítása
        cancelElutasitas() {
            this.showElutasitasForm = false;
            this.elutasitasIndoklas = '';
        },

        // Dokumentum előnézet
        previewDokumentum() {
            const doc = this.kiadmanyozas.dokumentum;
            console.log('[Kiadmányozás] Dokumentum előnézet:', doc);
            alert(`Dokumentum előnézet:\n\n` +
                  `Típus: ${doc.tipus}\n` +
                  `Sablon: ${doc.sablon_nev}\n` +
                  `Fájlnév: ${doc.fajl_nev}\n\n` +
                  `(Mock: PDF megjelenítés itt történne)`);
        },

        // Döntési javaslat megtekintése
        viewDontesiJavaslat() {
            const javaslat = this.kiadmanyozas.dontesi_javaslat;
            console.log('[Kiadmányozás] Döntési javaslat:', javaslat);
            alert(`Döntési javaslat:\n\n` +
                  `Javaslat: ${javaslat.javaslat}\n` +
                  `Indoklás: ${javaslat.indoklas}\n` +
                  `Készítette: ${this.kiadmanyozas.keszitette.nev}\n` +
                  `Dátum: ${this.kiadmanyozas.benyujtas_datum}\n\n` +
                  `(Mock: Részletes javaslat megjelenítése itt történne)`);
        },

        // Vélemények megtekintése
        viewVelemenyek() {
            if (!this.kiadmanyozas.velemenyezes_eredmeny) {
                alert('Nincs véleményezési eredmény.');
                return;
            }

            const eredmeny = this.kiadmanyozas.velemenyezes_eredmeny;
            alert(`Véleményezési eredmények:\n\n` +
                  `Összes címzett: ${eredmeny.osszes}\n` +
                  `Elfogadva: ${eredmeny.elfogad}\n` +
                  `Módosítással: ${eredmeny.modositas}\n\n` +
                  `(Mock: Részletes vélemények itt jelennének meg)`);
        },

        // Formázási segédfüggvények
        formatDatum(datum) {
            if (!datum) return '-';
            const [ev, honap, nap] = datum.split('-');
            return `${ev}.${honap}.${nap}`;
        }
    },

    mounted() {
        this.loadMockData();
        console.log('[Kiadmányozás] Komponens inicializálva');
        console.log('[Kiadmányozás] Ügy:', this.ugy);
    },

    template: `
        <div class="kiadmanyozas-container" style="padding: 2rem;">
            <!-- Betöltés -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Betöltés...</span>
                </div>
                <p class="mt-3 text-muted">Kiadmányozási feladat betöltése...</p>
            </div>

            <!-- Nincs feladat -->
            <div v-else-if="!kiadmanyozas" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                Nincs aktív kiadmányozási feladat.
            </div>

            <!-- Kiadmányozási felület -->
            <div v-else>
                <!-- Fejléc -->
                <div class="component-card mb-4">
                    <div class="component-card-header">
                        <h5 class="component-card-title mb-0">
                            <i class="bi bi-pen text-primary"></i>
                            Kiadmányozás
                            <span class="badge bg-secondary ms-2">F-0099</span>
                            <span class="badge bg-info ms-1">UCE-1815</span>
                        </h5>
                    </div>
                    <div class="component-card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <small class="text-muted d-block">Ügyazonosító</small>
                                <strong>{{ kiadmanyozas.ugy_azonosito }}</strong>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted d-block">Ügyfél</small>
                                <strong>{{ kiadmanyozas.ugyfel_nev }}</strong>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted d-block">Határidő</small>
                                <strong :class="hataridoSzin">
                                    {{ formatDatum(kiadmanyozas.hatarido) }}
                                    <small>({{ kiadmanyozas.napok_hatra }} nap)</small>
                                </strong>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted d-block">Státusz</small>
                                <span class="badge bg-warning">Kiadmányozásra vár</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2 oszlopos layout -->
                <div class="row">
                    <!-- BAL OLDAL: Dokumentum és döntési javaslat előnézet -->
                    <div class="col-md-8">
                        <!-- Dokumentum tervezet -->
                        <div class="component-card mb-4">
                            <div class="component-card-header">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-file-earmark-text"></i>
                                    Dokumentum tervezet
                                    <span :class="['badge', 'ms-2', dokumentumTipusBadge]">
                                        {{ kiadmanyozas.dokumentum.tipus }}
                                    </span>
                                </h6>
                                <button class="btn btn-sm btn-outline-primary" @click="previewDokumentum">
                                    <i class="bi bi-eye"></i> Előnézet
                                </button>
                            </div>
                            <div class="component-card-body">
                                <div class="document-preview-mock" style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 2rem; min-height: 400px;">
                                    <div class="text-center mb-4">
                                        <i class="bi bi-file-earmark-pdf" style="font-size: 4rem; color: #dc3545;"></i>
                                        <h5 class="mt-3">{{ kiadmanyozas.dokumentum.fajl_nev }}</h5>
                                        <p class="text-muted">{{ kiadmanyozas.dokumentum.sablon_nev }}</p>
                                    </div>
                                    <div class="document-details">
                                        <p><strong>Dokumentum típus:</strong> {{ kiadmanyozas.dokumentum.tipus }}</p>
                                        <p><strong>Generálás dátuma:</strong> {{ formatDatum(kiadmanyozas.dokumentum.generalt_datum) }}</p>
                                        <p><strong>Sablon verzió:</strong> {{ kiadmanyozas.dokumentum.sablon_verzio }}</p>
                                        <p class="text-muted fst-italic mt-4">
                                            <i class="bi bi-info-circle"></i>
                                            Mock környezetben a PDF dokumentum teljes előnézete itt jelenne meg.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Döntési javaslat összefoglalója -->
                        <div class="component-card">
                            <div class="component-card-header">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-lightbulb"></i>
                                    Döntési javaslat összefoglalója
                                </h6>
                                <button class="btn btn-sm btn-outline-secondary" @click="viewDontesiJavaslat">
                                    <i class="bi bi-arrow-up-right-square"></i> Részletek
                                </button>
                            </div>
                            <div class="component-card-body">
                                <div class="mb-3">
                                    <strong>Javaslat:</strong>
                                    <p class="mt-2">{{ kiadmanyozas.dontesi_javaslat.javaslat }}</p>
                                </div>
                                <div class="mb-3">
                                    <strong>Indoklás:</strong>
                                    <p class="mt-2 text-muted">{{ kiadmanyozas.dontesi_javaslat.indoklas }}</p>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <small class="text-muted">Készítette</small>
                                        <p class="mb-0"><strong>{{ kiadmanyozas.keszitette.nev }}</strong></p>
                                        <small>{{ kiadmanyozas.keszitette.beosztas }}</small>
                                    </div>
                                    <div class="col-md-6">
                                        <small class="text-muted">Benyújtás dátuma</small>
                                        <p class="mb-0"><strong>{{ formatDatum(kiadmanyozas.benyujtas_datum) }}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- JOBB OLDAL: Döntési panel -->
                    <div class="col-md-4">
                        <!-- Kiadmányozó információk -->
                        <div class="component-card mb-4">
                            <div class="component-card-header">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-person-badge"></i>
                                    Kiadmányozó
                                </h6>
                            </div>
                            <div class="component-card-body">
                                <div class="text-center mb-3">
                                    <div class="avatar-circle bg-primary text-white mb-2" style="width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem;">
                                        <i class="bi bi-person-fill"></i>
                                    </div>
                                    <h6 class="mb-0">{{ kiadmanyozas.kiadmanyozo.nev }}</h6>
                                    <small class="text-muted">{{ kiadmanyozas.kiadmanyozo.beosztas }}</small>
                                </div>
                                <hr>
                                <div class="mb-2">
                                    <small class="text-muted">Szervezeti egység</small>
                                    <p class="mb-0 small">{{ kiadmanyozas.kiadmanyozo.szervezet }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Döntési műveletek -->
                        <div v-if="!showElutasitasForm" class="component-card mb-4">
                            <div class="component-card-header bg-light">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-check-circle"></i>
                                    Vezetői döntés
                                </h6>
                            </div>
                            <div class="component-card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-success btn-lg" @click="elfogadTervezet" :disabled="!enVagyokAKiadmanyozo">
                                        <i class="bi bi-check-circle-fill"></i>
                                        Tervezet elfogadása
                                    </button>
                                    <button class="btn btn-danger btn-lg" @click="elutasitTervezet" :disabled="!enVagyokAKiadmanyozo">
                                        <i class="bi bi-x-circle-fill"></i>
                                        Tervezet elutasítása
                                    </button>
                                </div>
                                <div v-if="!enVagyokAKiadmanyozo" class="alert alert-warning mt-3 mb-0">
                                    <small>
                                        <i class="bi bi-exclamation-triangle"></i>
                                        Ön nem jogosult a kiadmányozásra.
                                    </small>
                                </div>
                            </div>
                        </div>

                        <!-- Elutasítás form -->
                        <div v-if="showElutasitasForm" class="component-card mb-4">
                            <div class="component-card-header bg-danger text-white">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-x-circle"></i>
                                    Elutasítás indoklása
                                    <span class="badge bg-light text-dark ms-2">UCE-1820</span>
                                </h6>
                            </div>
                            <div class="component-card-body">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Indoklás <span class="text-danger">*</span>
                                    </label>
                                    <textarea
                                        v-model="elutasitasIndoklas"
                                        class="form-control"
                                        rows="6"
                                        placeholder="Kérem adjon meg részletes indoklást az elutasításhoz (min. 20 karakter)..."
                                    ></textarea>
                                    <small class="text-muted">
                                        {{ elutasitasIndoklas.length }} / 20 minimum karakter
                                    </small>
                                </div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-danger" @click="mentElutasitas" :disabled="!elutasitasIndoklas || elutasitasIndoklas.trim().length < 20">
                                        <i class="bi bi-save"></i> Elutasítás megerősítése
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="cancelElutasitas">
                                        <i class="bi bi-x"></i> Mégsem
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Véleményezési eredmények -->
                        <div v-if="kiadmanyozas.velemenyezes_eredmeny" class="component-card mb-4">
                            <div class="component-card-header">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-chat-square-dots"></i>
                                    Véleményezés
                                    <span class="badge bg-info ms-2">F-0096</span>
                                </h6>
                                <button class="btn btn-sm btn-outline-secondary" @click="viewVelemenyek">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                            <div class="component-card-body">
                                <div class="velemeny-stats">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Összes címzett:</span>
                                        <strong>{{ kiadmanyozas.velemenyezes_eredmeny.osszes }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2 text-success">
                                        <span><i class="bi bi-check-circle"></i> Elfogadva:</span>
                                        <strong>{{ kiadmanyozas.velemenyezes_eredmeny.elfogad }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2 text-warning">
                                        <span><i class="bi bi-pencil"></i> Módosítással:</span>
                                        <strong>{{ kiadmanyozas.velemenyezes_eredmeny.modositas }}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Előzmények -->
                        <div class="component-card">
                            <div class="component-card-header">
                                <h6 class="component-card-title mb-0">
                                    <i class="bi bi-clock-history"></i>
                                    Ügy előzményei
                                </h6>
                            </div>
                            <div class="component-card-body">
                                <div class="timeline-small">
                                    <div v-for="(esemeny, index) in kiadmanyozas.elozmények || []" :key="index" class="timeline-item mb-3">
                                        <div class="d-flex">
                                            <div class="timeline-icon me-2">
                                                <i :class="['bi', esemeny.icon, 'text-primary']"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="small fw-bold">{{ esemeny.nev }}</div>
                                                <div class="small text-muted">{{ esemeny.datum }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};