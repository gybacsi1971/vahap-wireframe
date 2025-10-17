/**
 * VAHAP Paraméterező - Határidők Kezelő Komponens
 * Használat: <param-hataridok :ugytipus="'V-044'" @save="handleSave"></param-hataridok>
 */

const ParamHataridok = {
    name: 'param-hataridok',
    components: {
        'param-tabla': ParamTabla
    },
    emits: ['save', 'change'],
    props: {
        ugytipus: {
            type: String,
            default: 'V-044',
            validator: (value) => ['V-044', 'H-052'].includes(value)
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            hataridok: {
                sommas_eljaras: 8,
                teljes_eljaras: 30,
                hianypotlas: 15,
                tenyallas_tisztazas: 30,
                max_hianypotlasi_korok: 3,
                jogorvoslat: 15,
                szakhatosagi_megkereses: 30,
                fellebbezes: 15,
                ertesitesi_hatarido: 15
            },
            napTipus: {
                sommas_eljaras: 'munkanap',
                teljes_eljaras: 'munkanap',
                hianypotlas: 'naptari',
                tenyallas_tisztazas: 'munkanap',
                jogorvoslat: 'naptari',
                szakhatosagi_megkereses: 'munkanap',
                fellebbezes: 'naptari',
                ertesitesi_hatarido: 'naptari'
            },
            hasChanges: false,
            showPreview: false,
            previewDate: new Date().toISOString().split('T')[0],
            validationErrors: {}
        };
    },
    computed: {
        ugytipusCim() {
            return this.ugytipus === 'V-044'
                ? 'Vasúti járművezetők alkalmassági vizsgálata'
                : 'Hajózási létesítmények engedélyezése';
        },
        hataridoDefiniciok() {
            return [
                {
                    key: 'sommas_eljaras',
                    label: 'Sommás eljárás határideje',
                    ikon: 'bi-lightning-charge',
                    leiras: 'Ha a kérelem tartalmilag és formailag hibátlan, sommás eljárásban intézhető.',
                    min: 5,
                    max: 15,
                    ajanlott: 8,
                    egyseg: 'nap'
                },
                {
                    key: 'teljes_eljaras',
                    label: 'Teljes eljárás határideje',
                    ikon: 'bi-calendar-check',
                    leiras: 'Alapértelmezett eljárási határidő, ha nem sommás.',
                    min: 15,
                    max: 90,
                    ajanlott: 30,
                    egyseg: 'nap'
                },
                {
                    key: 'hianypotlas',
                    label: 'Hiánypótlási határidő',
                    ikon: 'bi-exclamation-triangle',
                    leiras: 'Ügyféltől hiánypótlás kérése esetén a teljesítési határidő.',
                    min: 8,
                    max: 30,
                    ajanlott: 15,
                    egyseg: 'nap'
                },
                {
                    key: 'max_hianypotlasi_korok',
                    label: 'Maximális hiánypótlási körök',
                    ikon: 'bi-arrow-repeat',
                    leiras: 'Hányszor kérhető hiánypótlás ugyanazon ügyben.',
                    min: 1,
                    max: 5,
                    ajanlott: 3,
                    egyseg: 'alkalom'
                },
                {
                    key: 'tenyallas_tisztazas',
                    label: 'Tényállás tisztázás határideje',
                    ikon: 'bi-search',
                    leiras: 'További vizsgálatok, szakhatósági megkeresések, szemle időtartama.',
                    min: 15,
                    max: 60,
                    ajanlott: 30,
                    egyseg: 'nap'
                },
                {
                    key: 'szakhatosagi_megkereses',
                    label: 'Szakhatósági megkeresés',
                    ikon: 'bi-person-badge',
                    leiras: 'Szakhatósági állásfoglalás bekérésének határideje.',
                    min: 15,
                    max: 45,
                    ajanlott: 30,
                    egyseg: 'nap'
                },
                {
                    key: 'jogorvoslat',
                    label: 'Jogorvoslati határidő',
                    ikon: 'bi-shield-check',
                    leiras: 'Ügyféltől jogorvoslati kérelem benyújtási határideje.',
                    min: 8,
                    max: 30,
                    ajanlott: 15,
                    egyseg: 'nap'
                },
                {
                    key: 'fellebbezes',
                    label: 'Fellebbezési határidő',
                    ikon: 'bi-arrow-up-circle',
                    leiras: 'Határozat elleni fellebbezés benyújtási határideje.',
                    min: 8,
                    max: 30,
                    ajanlott: 15,
                    egyseg: 'nap'
                },
                {
                    key: 'ertesitesi_hatarido',
                    label: 'Értesítési határidő',
                    ikon: 'bi-envelope',
                    leiras: 'Határozat kézbesítése és annak érvénybelépése közötti idő.',
                    min: 3,
                    max: 15,
                    ajanlott: 15,
                    egyseg: 'nap'
                }
            ];
        },
        osszesHatarido() {
            // Legrosszabb eset számítása
            return this.hataridok.teljes_eljaras +
                   (this.hataridok.hianypotlas * this.hataridok.max_hianypotlasi_korok) +
                   this.hataridok.tenyallas_tisztazas +
                   this.hataridok.ertesitesi_hatarido;
        },
        isValid() {
            return Object.keys(this.validationErrors).length === 0;
        }
    },
    template: `
        <div class="param-hataridok">
            <!-- Fejléc -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="mb-1">
                        <i class="bi bi-calendar-event"></i> Határidők paraméterezése
                        <span class="badge bg-primary ms-2">{{ ugytipus }}</span>
                    </h5>
                    <p class="text-muted small mb-0">{{ ugytipusCim }}</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary"
                            @click="showPreview = !showPreview">
                        <i class="bi" :class="showPreview ? 'bi-pencil' : 'bi-calculator'"></i>
                        {{ showPreview ? 'Szerkesztés' : 'Kalkulátor' }}
                    </button>
                    <button class="btn btn-outline-warning"
                            @click="resetToDefaults"
                            :disabled="readonly">
                        <i class="bi bi-arrow-counterclockwise"></i> Alapértékek
                    </button>
                    <button v-if="hasChanges && !readonly"
                            class="btn btn-primary"
                            @click="saveHataridok"
                            :disabled="!isValid">
                        <i class="bi bi-save"></i> Mentés
                    </button>
                </div>
            </div>

            <!-- Módosítás figyelmeztetés -->
            <div v-if="hasChanges" class="alert alert-warning d-flex align-items-center mb-3">
                <i class="bi bi-exclamation-triangle fs-4 me-2"></i>
                <div>
                    <strong>Nem mentett módosítások!</strong>
                    A határidők módosultak, kattintson a Mentés gombra a változtatások alkalmazásához.
                </div>
            </div>

            <!-- Validációs hibák -->
            <div v-if="!isValid" class="alert alert-danger mb-3">
                <i class="bi bi-x-circle"></i>
                <strong>Érvénytelen beállítások:</strong>
                <ul class="mb-0 mt-2">
                    <li v-for="(error, key) in validationErrors" :key="key">
                        {{ error }}
                    </li>
                </ul>
            </div>

            <!-- Határidő kalkulátor előnézet -->
            <div v-if="showPreview" class="card mb-3">
                <div class="card-header bg-info text-white">
                    <i class="bi bi-calculator"></i> Határidő kalkulátor - Előnézet
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <label class="form-label">Benyújtás dátuma</label>
                            <input type="date"
                                   class="form-control"
                                   v-model="previewDate">
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="card border-success">
                                <div class="card-body">
                                    <h6 class="text-success">
                                        <i class="bi bi-lightning-charge"></i> Sommás eljárás
                                    </h6>
                                    <p class="text-muted small">Ha minden hibátlan</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>Határidő:</span>
                                        <strong class="fs-5 text-success">
                                            {{ calculateDeadline(previewDate, hataridok.sommas_eljaras, napTipus.sommas_eljaras) }}
                                        </strong>
                                    </div>
                                    <small class="text-muted">
                                        {{ hataridok.sommas_eljaras }} {{ napTipus.sommas_eljaras }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card border-primary">
                                <div class="card-body">
                                    <h6 class="text-primary">
                                        <i class="bi bi-calendar-check"></i> Teljes eljárás
                                    </h6>
                                    <p class="text-muted small">Alapértelmezett ütemezés</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>Határidő:</span>
                                        <strong class="fs-5 text-primary">
                                            {{ calculateDeadline(previewDate, hataridok.teljes_eljaras, napTipus.teljes_eljaras) }}
                                        </strong>
                                    </div>
                                    <small class="text-muted">
                                        {{ hataridok.teljes_eljaras }} {{ napTipus.teljes_eljaras }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-secondary mt-3">
                        <strong>Legrosszabb eset (maximális időtartam):</strong>
                        <div class="mt-2">
                            Teljes eljárás ({{ hataridok.teljes_eljaras }} nap) +
                            {{ hataridok.max_hianypotlasi_korok }}x hiánypótlás ({{ hataridok.max_hianypotlasi_korok }}×{{ hataridok.hianypotlas }} = {{ hataridok.max_hianypotlasi_korok * hataridok.hianypotlas }} nap) +
                            Tényállás tisztázás ({{ hataridok.tenyallas_tisztazas }} nap) +
                            Értesítési határidő ({{ hataridok.ertesitesi_hatarido }} nap)
                            = <strong class="text-danger">{{ osszesHatarido }} nap</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Határidők szerkesztése -->
            <div v-else>
                <div class="row g-3">
                    <div v-for="def in hataridoDefiniciok"
                         :key="def.key"
                         class="col-md-6">
                        <div class="card h-100"
                             :class="{
                                 'border-danger': validationErrors[def.key],
                                 'border-warning': hasChanges && hataridok[def.key] !== def.ajanlott
                             }">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="bi" :class="def.ikon"></i>
                                    {{ def.label }}
                                    <span v-if="hataridok[def.key] !== def.ajanlott"
                                          class="badge bg-warning text-dark ms-2">
                                        Módosítva
                                    </span>
                                </h6>
                                <p class="card-text text-muted small">{{ def.leiras }}</p>

                                <div class="row align-items-center">
                                    <div class="col-7">
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary"
                                                    type="button"
                                                    @click="decrementHatarido(def.key, def.min)"
                                                    :disabled="readonly || hataridok[def.key] <= def.min">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number"
                                                   class="form-control text-center fw-bold"
                                                   :class="{ 'is-invalid': validationErrors[def.key] }"
                                                   v-model.number="hataridok[def.key]"
                                                   :min="def.min"
                                                   :max="def.max"
                                                   :disabled="readonly"
                                                   @input="validateHatarido(def)">
                                            <button class="btn btn-outline-secondary"
                                                    type="button"
                                                    @click="incrementHatarido(def.key, def.max)"
                                                    :disabled="readonly || hataridok[def.key] >= def.max">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                            <span class="input-group-text">{{ def.egyseg }}</span>
                                        </div>
                                        <div v-if="validationErrors[def.key]" class="invalid-feedback d-block">
                                            {{ validationErrors[def.key] }}
                                        </div>
                                    </div>

                                    <div v-if="def.key !== 'max_hianypotlasi_korok'" class="col-5">
                                        <select class="form-select form-select-sm"
                                                v-model="napTipus[def.key]"
                                                :disabled="readonly"
                                                @change="markAsChanged">
                                            <option value="munkanap">Munkanap</option>
                                            <option value="naptari">Naptári nap</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mt-2 small">
                                    <span class="text-muted">Ajánlott:</span>
                                    <strong>{{ def.ajanlott }} {{ def.egyseg }}</strong>
                                    <span class="text-muted ms-2">
                                        ({{ def.min }}-{{ def.max }})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Összesítő kártya -->
            <div class="card mt-3 border-primary">
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-3">
                            <div class="border-end">
                                <div class="fs-3 text-success fw-bold">{{ hataridok.sommas_eljaras }}</div>
                                <small class="text-muted">Sommás eljárás (nap)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="border-end">
                                <div class="fs-3 text-primary fw-bold">{{ hataridok.teljes_eljaras }}</div>
                                <small class="text-muted">Teljes eljárás (nap)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="border-end">
                                <div class="fs-3 text-warning fw-bold">{{ hataridok.max_hianypotlasi_korok }}</div>
                                <small class="text-muted">Max hiánypótlás (kör)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="fs-3 text-danger fw-bold">{{ osszesHatarido }}</div>
                            <small class="text-muted">Max időtartam (nap)</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        loadHataridok() {
            // Betöltés mock adatokból
            if (typeof VIHARMockData !== 'undefined' && VIHARMockData.parameterezo && VIHARMockData.parameterezo.hataridok) {
                const saved = VIHARMockData.parameterezo.hataridok[this.ugytipus];
                if (saved) {
                    // Mock data konverzió: nested objektumokból flat értékekbe
                    if (saved.sommas_eljaras && saved.sommas_eljaras.nap !== undefined) {
                        this.hataridok.sommas_eljaras = saved.sommas_eljaras.nap;
                        this.napTipus.sommas_eljaras = saved.sommas_eljaras.tipus === 'munkanap' ? 'munkanap' : 'naptari';
                    }
                    if (saved.teljes_eljaras && saved.teljes_eljaras.nap !== undefined) {
                        this.hataridok.teljes_eljaras = saved.teljes_eljaras.nap;
                        this.napTipus.teljes_eljaras = saved.teljes_eljaras.tipus === 'munkanap' ? 'munkanap' : 'naptari';
                    }
                    if (saved.hianypotlas && saved.hianypotlas.default_nap !== undefined) {
                        this.hataridok.hianypotlas = saved.hianypotlas.default_nap;
                        this.napTipus.hianypotlas = saved.hianypotlas.tipus === 'munkanap' ? 'munkanap' : 'naptari';
                        if (saved.hianypotlas.max_korok !== undefined) {
                            this.hataridok.max_hianypotlasi_korok = saved.hianypotlas.max_korok;
                        }
                    }
                    if (saved.tenyallas_tisztazas && saved.tenyallas_tisztazas.default_nap !== undefined) {
                        this.hataridok.tenyallas_tisztazas = saved.tenyallas_tisztazas.default_nap;
                        this.napTipus.tenyallas_tisztazas = saved.tenyallas_tisztazas.tipus === 'munkanap' ? 'munkanap' : 'naptari';
                    }
                    if (saved.jogorvoslat && saved.jogorvoslat.nap !== undefined) {
                        this.hataridok.jogorvoslat = saved.jogorvoslat.nap;
                        this.napTipus.jogorvoslat = saved.jogorvoslat.tipus === 'naptári_nap' ? 'naptari' : 'munkanap';
                    }
                    if (saved.szakhatosagi_megkereses && saved.szakhatosagi_megkereses.nap !== undefined) {
                        this.hataridok.szakhatosagi_megkereses = saved.szakhatosagi_megkereses.nap;
                        this.napTipus.szakhatosagi_megkereses = saved.szakhatosagi_megkereses.tipus === 'munkanap' ? 'munkanap' : 'naptari';
                    }
                    if (saved.fellebbezes && saved.fellebbezes.nap !== undefined) {
                        this.hataridok.fellebbezes = saved.fellebbezes.nap;
                        this.napTipus.fellebbezes = saved.fellebbezes.tipus === 'naptári_nap' ? 'naptari' : 'munkanap';
                    }
                    if (saved.ertesitesi_hatarido && saved.ertesitesi_hatarido.nap !== undefined) {
                        this.hataridok.ertesitesi_hatarido = saved.ertesitesi_hatarido.nap;
                        this.napTipus.ertesitesi_hatarido = saved.ertesitesi_hatarido.tipus === 'naptári_nap' ? 'naptari' : 'munkanap';
                    }

                    console.log('[ParamHataridok] Határidők betöltve:', this.ugytipus, this.hataridok);
                }
            }
            this.hasChanges = false;
            this.validateAll();
        },

        validateHatarido(def) {
            const value = this.hataridok[def.key];

            if (value < def.min) {
                this.validationErrors[def.key] = `Minimum ${def.min} ${def.egyseg}`;
            } else if (value > def.max) {
                this.validationErrors[def.key] = `Maximum ${def.max} ${def.egyseg}`;
            } else {
                delete this.validationErrors[def.key];
            }

            this.markAsChanged();
        },

        validateAll() {
            this.validationErrors = {};
            this.hataridoDefiniciok.forEach(def => {
                this.validateHatarido(def);
            });
        },

        incrementHatarido(key, max) {
            if (this.hataridok[key] < max) {
                this.hataridok[key]++;
                const def = this.hataridoDefiniciok.find(d => d.key === key);
                this.validateHatarido(def);
            }
        },

        decrementHatarido(key, min) {
            if (this.hataridok[key] > min) {
                this.hataridok[key]--;
                const def = this.hataridoDefiniciok.find(d => d.key === key);
                this.validateHatarido(def);
            }
        },

        markAsChanged() {
            this.hasChanges = true;
            this.$emit('change', this.hataridok);
        },

        resetToDefaults() {
            if (confirm('Biztosan visszaállítja az ajánlott alapértékeket?')) {
                this.hataridoDefiniciok.forEach(def => {
                    this.hataridok[def.key] = def.ajanlott;
                });
                this.validateAll();
                this.markAsChanged();
            }
        },

        saveHataridok() {
            if (!this.isValid) {
                alert('Kérem javítsa a hibás határidő értékeket!');
                return;
            }

            this.$emit('save', {
                ugytipus: this.ugytipus,
                hataridok: this.hataridok,
                napTipus: this.napTipus
            });

            this.hasChanges = false;
            console.log('✅ Határidők mentve:', this.ugytipus);
        },

        calculateDeadline(startDate, days, napType) {
            const start = new Date(startDate);
            let calculated = new Date(start);

            if (napType === 'munkanap') {
                let addedDays = 0;
                while (addedDays < days) {
                    calculated.setDate(calculated.getDate() + 1);
                    const dayOfWeek = calculated.getDay();
                    // Skip weekends (0 = Sunday, 6 = Saturday)
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        addedDays++;
                    }
                }
            } else {
                // Naptári nap
                calculated.setDate(calculated.getDate() + days);
            }

            return calculated.toLocaleDateString('hu-HU');
        }
    },
    mounted() {
        this.loadHataridok();
    },
    watch: {
        ugytipus() {
            this.loadHataridok();
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamHataridok = ParamHataridok;
}
