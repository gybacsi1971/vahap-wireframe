/**
 * VAHAP - F-0097 Ügy lezárása Tab
 * UCE-1828 - Ügy lezárása
 * Használat: <vahap-tab-lezaras :active="activeTab === 'lezaras'" :ugy="ugy"></vahap-tab-lezaras>
 */

const VahapTabLezaras = {
    name: 'vahap-tab-lezaras',
    emits: ['save', 'update', 'case-closed'],
    props: {
        active: {
            type: Boolean,
            default: false
        },
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            // Lezárás űrlap adatai
            formData: {
                lezarasTipus: '', // sikeres, elutasitott, visszavont
                dokumentumok_kiadasra_kerultek: false,
                ertesitesek_elkuldve: false,
                nyilvantartas_frissitve: false,
                forrás_frissitve: false,
                ekeidr_lezarva: false,
                archivalva: false,
                lezaroMegjegyzes: ''
            },

            // Ügy összefoglalása
            ugyOsszefoglalas: {
                ugyazonosito: '',
                ugytipus: '',
                ugyfel_nev: '',
                benyujtas_datum: '',
                lezaras_datum: '',
                atfutasi_ido_nap: 0,
                vegso_dontes: '',
                dontes_tipusa: '',
                vezeto_nev: '',
                ugyintezo_nev: ''
            },

            // Workflow lépések összesítése
            workflowOsszesites: {
                osszes_lepes: 0,
                befejezett_lepesek: 0,
                kihagyott_lepesek: 0,
                lepesek: []
            },

            // Dokumentumok listája
            kiadottDokumentumok: [],

            // Értesítések listája
            elkuldottErtesitesek: [],

            // Előfeltételek
            elofeltetelekTeljesultek: false,
            hianyzoElofeltetelek: [],

            // Státusz
            processing: false,
            saved: false,
            lezarva: false,
            lezarasDatum: new Date().toISOString().split('T')[0],
            lezaroNeve: 'Dr. Szabó Péter'
        };
    },

    computed: {
        // Validáció
        isValid() {
            return this.formData.lezarasTipus &&
                   this.formData.dokumentumok_kiadasra_kerultek &&
                   this.formData.ertesitesek_elkuldve &&
                   this.formData.nyilvantartas_frissitve;
        },

        // Összes feladat teljesítése
        osszesFeladatTeljesitve() {
            return this.formData.dokumentumok_kiadasra_kerultek &&
                   this.formData.ertesitesek_elkuldve &&
                   this.formData.nyilvantartas_frissitve &&
                   this.formData.forrás_frissitve &&
                   this.formData.ekeidr_lezarva;
        },

        // Progress
        progressPercent() {
            let score = 0;
            let total = 6;

            if (this.formData.lezarasTipus) score++;
            if (this.formData.dokumentumok_kiadasra_kerultek) score++;
            if (this.formData.ertesitesek_elkuldve) score++;
            if (this.formData.nyilvantartas_frissitve) score++;
            if (this.formData.forrás_frissitve) score++;
            if (this.formData.ekeidr_lezarva) score++;

            return Math.round((score / total) * 100);
        },

        progressBarClass() {
            if (this.progressPercent < 50) return 'bg-danger';
            if (this.progressPercent < 80) return 'bg-warning';
            return 'bg-success';
        },

        // Átfutási idő színezés
        atfutasiIdoClass() {
            if (this.ugyOsszefoglalas.atfutasi_ido_nap <= 8) return 'text-success';
            if (this.ugyOsszefoglalas.atfutasi_ido_nap <= 15) return 'text-warning';
            return 'text-danger';
        }
    },

    watch: {
        ugy: {
            handler(newVal) {
                if (newVal && Object.keys(newVal).length > 0) {
                    this.loadPreviousData();
                }
            },
            immediate: true,
            deep: true
        }
    },

    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header mb-3">
                <h5 class="mb-2">
                    <span class="badge badge-uce">UCE-1828</span>
                    Ügy lezárása
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0097</span>
                    Az eljárás lezárása és archiválása
                </p>
            </div>

            <!-- Előfeltétel figyelmeztetés -->
            <div v-if="!elofeltetelekTeljesultek" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <strong>Előfeltételek nem teljesültek!</strong>
                <p class="mb-0 mt-2">Hiányzó lépések:</p>
                <ul class="mb-0">
                    <li v-for="hiba in hianyzoElofeltetelek" :key="hiba">{{ hiba }}</li>
                </ul>
            </div>

            <!-- Sikeres lezárás -->
            <div v-if="lezarva" class="alert alert-success">
                <i class="bi bi-check-circle-fill"></i>
                <strong>Ügy sikeresen lezárva!</strong><br>
                <small>Ügyazonosító: {{ ugyOsszefoglalas.ugyazonosito }}</small><br>
                <small>Lezárás dátuma: {{ lezarasDatum }}</small><br>
                <small>Lezárta: {{ lezaroNeve }}</small>
            </div>

            <!-- Ügy összefoglalása -->
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-file-earmark-check"></i>
                    <strong>Ügy összefoglalása</strong>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p class="mb-2"><strong>Ügyazonosító:</strong> {{ ugyOsszefoglalas.ugyazonosito }}</p>
                            <p class="mb-2"><strong>Ügytípus:</strong> {{ ugyOsszefoglalas.ugytipus }}</p>
                            <p class="mb-2"><strong>Ügyfél:</strong> {{ ugyOsszefoglalas.ugyfel_nev }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-2"><strong>Benyújtás:</strong> {{ ugyOsszefoglalas.benyujtas_datum }}</p>
                            <p class="mb-2"><strong>Lezárás:</strong> {{ lezarasDatum }}</p>
                            <p class="mb-2">
                                <strong>Átfutási idő:</strong>
                                <span :class="atfutasiIdoClass">
                                    {{ ugyOsszefoglalas.atfutasi_ido_nap }} munkanap
                                </span>
                            </p>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-2"><strong>Végső döntés:</strong>
                                <span class="badge" :class="{
                                    'bg-success': ugyOsszefoglalas.vegso_dontes === 'jovahagyas',
                                    'bg-danger': ugyOsszefoglalas.vegso_dontes === 'elutasitas'
                                }">
                                    {{ getDontesiTipusText(ugyOsszefoglalas.vegso_dontes) }}
                                </span>
                            </p>
                            <p class="mb-2"><strong>Döntés típusa:</strong> {{ ugyOsszefoglalas.dontes_tipusa }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-2"><strong>Ügyintéző:</strong> {{ ugyOsszefoglalas.ugyintezo_nev }}</p>
                            <p class="mb-2"><strong>Jóváhagyó vezető:</strong> {{ ugyOsszefoglalas.vezeto_nev }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Workflow összesítés -->
            <div class="card mb-3">
                <div class="card-header bg-info text-white">
                    <i class="bi bi-diagram-3"></i>
                    <strong>Workflow lépések összesítése</strong>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-4 text-center">
                            <h3 class="mb-0">{{ workflowOsszesites.osszes_lepes }}</h3>
                            <small class="text-muted">Összes lépés</small>
                        </div>
                        <div class="col-md-4 text-center">
                            <h3 class="mb-0 text-success">{{ workflowOsszesites.befejezett_lepesek }}</h3>
                            <small class="text-muted">Befejezett</small>
                        </div>
                        <div class="col-md-4 text-center">
                            <h3 class="mb-0 text-secondary">{{ workflowOsszesites.kihagyott_lepesek }}</h3>
                            <small class="text-muted">Kihagyott</small>
                        </div>
                    </div>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Lépés</th>
                                <th>Státusz</th>
                                <th>Dátum</th>
                                <th>Ügyintéző</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="lepes in workflowOsszesites.lepesek" :key="lepes.nev">
                                <td>{{ lepes.nev }}</td>
                                <td>
                                    <span class="badge" :class="{
                                        'bg-success': lepes.status === 'completed',
                                        'bg-warning': lepes.status === 'in-progress',
                                        'bg-secondary': lepes.status === 'skipped',
                                        'bg-light text-dark': lepes.status === 'pending'
                                    }">
                                        {{ getStatusText(lepes.status) }}
                                    </span>
                                </td>
                                <td>{{ lepes.datum || '-' }}</td>
                                <td>{{ lepes.ugyintezo || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Lezárási feladatok -->
            <div class="card mb-3">
                <div class="card-header bg-warning text-dark">
                    <i class="bi bi-list-check"></i>
                    <strong>Lezárási feladatok</strong>
                </div>
                <div class="card-body">
                    <!-- Lezárás típusa -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            Lezárás típusa <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="formData.lezarasTipus">
                            <option value="">-- Válasszon --</option>
                            <option value="sikeres">Sikeres ügyintézés</option>
                            <option value="elutasitott">Elutasított kérelem</option>
                            <option value="visszavont">Visszavont kérelem</option>
                        </select>
                    </div>

                    <!-- Kötelező feladatok -->
                    <div class="mb-3">
                        <p class="fw-bold mb-2">Kötelező feladatok:</p>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.dokumentumok_kiadasra_kerultek"
                                   id="chkDokumentumok">
                            <label class="form-check-label" for="chkDokumentumok">
                                <i class="bi" :class="formData.dokumentumok_kiadasra_kerultek ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                Dokumentumok kiadásra kerültek
                                <span class="badge bg-info ms-2">{{ kiadottDokumentumok.length }} db</span>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.ertesitesek_elkuldve"
                                   id="chkErtesitesek">
                            <label class="form-check-label" for="chkErtesitesek">
                                <i class="bi" :class="formData.ertesitesek_elkuldve ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                Értesítések elküldve
                                <span class="badge bg-info ms-2">{{ elkuldottErtesitesek.length }} db</span>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.nyilvantartas_frissitve"
                                   id="chkNyilvantartas">
                            <label class="form-check-label" for="chkNyilvantartas">
                                <i class="bi" :class="formData.nyilvantartas_frissitve ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                VNY024 nyilvántartás frissítve
                                <span class="badge bg-secondary ms-2">F-0090</span>
                            </label>
                        </div>
                    </div>

                    <!-- Opcionális feladatok -->
                    <div class="mb-3">
                        <p class="fw-bold mb-2">Opcionális feladatok:</p>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.forrás_frissitve"
                                   id="chkForras">
                            <label class="form-check-label" for="chkForras">
                                <i class="bi" :class="formData.forrás_frissitve ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                FORRÁS rendszer frissítve
                                <span class="badge bg-secondary ms-2">F-0098</span>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.ekeidr_lezarva"
                                   id="chkEkeidr">
                            <label class="form-check-label" for="chkEkeidr">
                                <i class="bi" :class="formData.ekeidr_lezarva ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                EKEIDR ügy lezárva
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox"
                                   v-model="formData.archivalva"
                                   id="chkArchivalva">
                            <label class="form-check-label" for="chkArchivalva">
                                <i class="bi" :class="formData.archivalva ? 'bi-check-circle-fill text-success' : 'bi-circle'"></i>
                                Dokumentumok archiválva
                            </label>
                        </div>
                    </div>

                    <!-- Záró megjegyzés -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-chat-left-text"></i>
                            Záró megjegyzés (opcionális)
                        </label>
                        <textarea class="form-control" rows="3" v-model="formData.lezaroMegjegyzes"
                                  placeholder="Esetleges megjegyzések az ügy lezárásával kapcsolatban..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Lezárási adatok -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong>Lezárási adatok</strong>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Lezáró ügyintéző</label>
                            <input type="text" class="form-control" v-model="lezaroNeve" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Lezárás dátuma</label>
                            <input type="date" class="form-control" v-model="lezarasDatum">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Progress bar -->
            <div class="mb-3">
                <label class="form-label small">Lezárási feladatok teljesítése: {{ progressPercent }}%</label>
                <div class="progress">
                    <div class="progress-bar" :class="progressBarClass" :style="{width: progressPercent + '%'}">
                        {{ progressPercent }}%
                    </div>
                </div>
            </div>

            <!-- Műveleti gombok -->
            <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-outline-secondary" @click="cancel">
                    <i class="bi bi-x-circle"></i> Mégse
                </button>
                <button class="btn btn-success btn-lg" @click="closeCase"
                        :disabled="!isValid || !elofeltetelekTeljesultek || processing || lezarva">
                    <span v-if="processing">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Lezárás folyamatban...
                    </span>
                    <span v-else>
                        <i class="bi bi-lock-fill"></i> Ügy lezárása
                    </span>
                </button>
            </div>
        </div>
    `,

    methods: {
        // Előfeltételek ellenőrzése
        checkPrerequisites() {
            this.hianyzoElofeltetelek = [];

            // Vezetői döntés kell legyen
            if (!this.ugy.workflow_steps?.['vezetoi-dontes'] ||
                this.ugy.workflow_steps['vezetoi-dontes'].status !== 'completed') {
                this.hianyzoElofeltetelek.push('Vezetői döntés nincs befejezve');
            }

            this.elofeltetelekTeljesultek = this.hianyzoElofeltetelek.length === 0;
        },

        // Korábbi adatok betöltése
        loadPreviousData() {
            this.checkPrerequisites();

            // Ügy összefoglalása
            this.ugyOsszefoglalas = {
                ugyazonosito: this.ugy.ugyazonosito || '',
                ugytipus: this.ugy.ugytipus || '',
                ugyfel_nev: this.ugy.ugyfel?.nev || '',
                benyujtas_datum: this.ugy.benyujtasDatum || '',
                lezaras_datum: this.lezarasDatum,
                atfutasi_ido_nap: this.calculateAtfutasiIdo(),
                vegso_dontes: this.ugy.vezetoi_dontes_data?.dontesiTipus || '',
                dontes_tipusa: this.ugy.dontesi_javaslat_data?.dontesiTipus || '',
                vezeto_nev: this.ugy.workflow_steps?.['vezetoi-dontes']?.vezeto || '',
                ugyintezo_nev: this.ugy.workflow_steps?.kerelem?.ugyintezo || ''
            };

            // Workflow összesítés
            this.calculateWorkflowSummary();

            // Kiadott dokumentumok
            this.kiadottDokumentumok = this.ugy.dokumentumok?.filter(d => d.tipus === 'hatosagi') || [];

            // Értesítések
            this.elkuldottErtesitesek = this.ugy.dontesi_javaslat_data?.ertesitendo_felek || [];

            // Mentett lezárási adatok betöltése (ha van)
            if (this.ugy.lezaras_data) {
                this.formData = { ...this.ugy.lezaras_data };
                this.lezarva = true;
            }

            console.log('[F-0097] Korábbi adatok betöltve', {
                ugyOsszefoglalas: this.ugyOsszefoglalas,
                workflowOsszesites: this.workflowOsszesites,
                elofeltetelekTeljesultek: this.elofeltetelekTeljesultek
            });
        },

        // Átfutási idő számítása (munkanapok)
        calculateAtfutasiIdo() {
            if (!this.ugy.benyujtasDatum) return 0;

            const start = new Date(this.ugy.benyujtasDatum);
            const end = new Date(this.lezarasDatum);
            let businessDays = 0;
            let current = new Date(start);

            while (current <= end) {
                const dayOfWeek = current.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    businessDays++;
                }
                current.setDate(current.getDate() + 1);
            }

            return businessDays;
        },

        // Workflow összesítés számítása
        calculateWorkflowSummary() {
            const steps = this.ugy.workflow_steps || {};
            const lepesNevek = [
                { key: 'kerelem', nev: 'Kérelem' },
                { key: 'hatáskor', nev: 'Hatáskör vizsgálat' },
                { key: 'formai', nev: 'Formai ellenőrzés' },
                { key: 'tartalmi', nev: 'Tartalmi ellenőrzés' },
                { key: 'vny024', nev: 'VNY024 ellenőrzés' },
                { key: 'sommas', nev: 'Sommás eljárás' },
                { key: 'dontesi-javaslat', nev: 'Döntési javaslat' },
                { key: 'vezetoi-dontes', nev: 'Vezetői döntés' }
            ];

            let osszes = 0;
            let befejezett = 0;
            let kihagyott = 0;
            const lepesek = [];

            lepesNevek.forEach(({ key, nev }) => {
                const lepes = steps[key];
                if (lepes) {
                    osszes++;
                    if (lepes.status === 'completed') befejezett++;
                    if (lepes.status === 'skipped') kihagyott++;

                    lepesek.push({
                        nev: nev,
                        status: lepes.status,
                        datum: lepes.datum || '',
                        ugyintezo: lepes.ugyintezo || ''
                    });
                }
            });

            this.workflowOsszesites = {
                osszes_lepes: osszes,
                befejezett_lepesek: befejezett,
                kihagyott_lepesek: kihagyott,
                lepesek: lepesek
            };
        },

        // Szöveg formázók
        getDontesiTipusText(tipus) {
            const map = {
                'jovahagyas': 'Jóváhagyva',
                'elutasitas': 'Elutasítva',
                'modositas': 'Módosítással jóváhagyva'
            };
            return map[tipus] || tipus;
        },

        getStatusText(status) {
            const map = {
                'completed': 'Befejezve',
                'in-progress': 'Folyamatban',
                'pending': 'Várakozik',
                'skipped': 'Kihagyva'
            };
            return map[status] || status;
        },

        // Ügy lezárása
        closeCase() {
            if (!this.isValid || !this.elofeltetelekTeljesultek) {
                alert('Kérjük töltse ki az összes kötelező mezőt, és biztosítsa, hogy az előfeltételek teljesülnek!');
                return;
            }

            if (!confirm('Biztosan lezárja az ügyet? Ez a művelet nem vonható vissza!')) {
                return;
            }

            this.processing = true;

            // Szimuláljuk a lezárási folyamatot
            setTimeout(() => {
                // F-0097 - Ügy lezárása
                const lezarasData = {
                    ...this.formData,
                    lezarasDatum: this.lezarasDatum,
                    lezarasIdopontja: new Date().toISOString(),
                    lezaroNeve: this.lezaroNeve,
                    ugyOsszefoglalas: this.ugyOsszefoglalas,
                    workflowOsszesites: this.workflowOsszesites
                };

                console.log('[F-0097] UCE-1828 - Ügy lezárva', lezarasData);

                this.$emit('save', {
                    tab: 'lezaras',
                    data: lezarasData,
                    funkcio: 'F-0097',
                    uce: 'UCE-1828'
                });

                this.$emit('update', {
                    'lezaras': {
                        status: 'completed',
                        datum: this.lezarasDatum,
                        lezaro: this.lezaroNeve,
                        lezarasTipus: this.formData.lezarasTipus
                    }
                });

                this.$emit('case-closed', {
                    ugyazonosito: this.ugyOsszefoglalas.ugyazonosito,
                    lezarasDatum: this.lezarasDatum,
                    lezarasTipus: this.formData.lezarasTipus
                });

                this.processing = false;
                this.lezarva = true;

                alert('Ügy sikeresen lezárva!\n\nÜgyazonosító: ' + this.ugyOsszefoglalas.ugyazonosito);
            }, 3000);
        },

        // Mégse
        cancel() {
            if (confirm('Biztosan elveti a módosításokat?')) {
                this.loadPreviousData();
                this.$emit('cancel');
            }
        }
    },

    mounted() {
        console.log('[F-0097] Lezárás komponens betöltve');
        if (this.ugy && Object.keys(this.ugy).length > 0) {
            this.loadPreviousData();
        }
    }
};
