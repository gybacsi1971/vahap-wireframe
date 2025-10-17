/**
 * VAHAP - F-0065 Formai megfelelőség vizsgálat Tab (TELJES VERZIÓ)
 * UCE-1799 - Formai megfelelőség vizsgálata
 * Használat: <vahap-tab-formai :active="activeTab === 'formai'" :ugy="ugy" @update="handleUpdate"></vahap-tab-formai>
 *
 * Funkciók:
 * - Paraméterezett ellenőrzési lista betöltése
 * - Kötelező és opcionális kritériumok kezelése
 * - Megjegyzés mezők kritériumenként
 * - Automatikus státusz értékelés
 * - Mentés és validáció
 * - Következő lépés ajánlása
 */

const VahapTabFormai = {
    name: 'vahap-tab-formai',
    emits: ['update', 'save', 'next', 'cancel'],
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
            // Ellenőrzési lista kritériumai (paraméterezőből)
            kriteriumok: [],

            // Űrlap adatok
            formData: {
                checks: {},           // { kriterium_id: true/false }
                megjegyzesek: {},     // { kriterium_id: 'szöveg' }
                altalanosMegjegyzes: '',
                dontes: null,         // 'megfelel' | 'nem_megfelel' | 'hianypotlas_szukseges'
                dontesDatum: null,
                ellenorzoNeve: '',
                hianyossagok: []      // Lista a hiányzó dokumentumokról
            },

            // Validációs hibák
            validationErrors: [],

            // Betöltési állapot
            loading: false,

            // Módosítás flag
            hasChanges: false
        };
    },
    computed: {
        // Összes kötelező kritérium teljesült?
        isValid() {
            const kotelezoKriteriumok = this.kriteriumok.filter(k => k.kotelezo);
            return kotelezoKriteriumok.every(k => this.formData.checks[k.id] === true);
        },

        // Státusz badge szöveg és szín
        statuszBadge() {
            if (!this.formData.dontes) {
                return { text: 'Folyamatban', class: 'bg-warning' };
            }

            if (this.formData.dontes === 'megfelel') {
                return { text: 'Formailag megfelelő', class: 'bg-success' };
            }

            if (this.formData.dontes === 'hianypotlas_szukseges') {
                return { text: 'Hiánypótlás szükséges', class: 'bg-warning' };
            }

            if (this.formData.dontes === 'nem_megfelel') {
                return { text: 'Formailag nem megfelelő', class: 'bg-danger' };
            }

            return { text: 'Ismeretlen', class: 'bg-secondary' };
        },

        // Teljesült kritériumok száma
        teljesultKriteriumokSzama() {
            return Object.values(this.formData.checks).filter(v => v === true).length;
        },

        // Progress százalék
        progressPercent() {
            if (this.kriteriumok.length === 0) return 0;
            return Math.round((this.teljesultKriteriumokSzama / this.kriteriumok.length) * 100);
        },

        // Hiányzó kritériumok listája
        hianyzoKriteriumok() {
            return this.kriteriumok.filter(k => k.kotelezo && !this.formData.checks[k.id]);
        }
    },
    methods: {
        // Kritériumok betöltése a paraméterezőből
        loadKriteriumok() {
            console.log('[F-0065] Kritériumok betöltése...');

            // VIHARMockData.parameterezo.ellenorzesi_lista_formai betöltése
            if (VIHARMockData?.parameterezo?.ellenorzesi_lista_formai) {
                const lista = VIHARMockData.parameterezo.ellenorzesi_lista_formai;
                this.kriteriumok = JSON.parse(JSON.stringify(lista.kriteriumok || []));

                console.log(`[F-0065] Betöltve ${this.kriteriumok.length} kritérium`);

                // Checks inicializálása (Vue 3 compatible)
                this.kriteriumok.forEach(k => {
                    if (this.formData.checks[k.id] === undefined) {
                        this.formData.checks[k.id] = false;
                    }
                    if (this.formData.megjegyzesek[k.id] === undefined) {
                        this.formData.megjegyzesek[k.id] = '';
                    }
                });
            } else {
                console.warn('[F-0065] Nincs paraméterezett kritérium lista!');
                // Fallback: Alapértelmezett kritériumok
                this.kriteriumok = [
                    {
                        id: 1,
                        megnevezes: 'Kérelem űrlap szabályszerűen kitöltve',
                        leiras: 'Az űrlap minden kötelező mezője kitöltésre került',
                        sorrend: 1,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 2,
                        megnevezes: 'Kötelező mellékletek csatolva',
                        leiras: 'Minden szükséges melléklet csatolva van',
                        sorrend: 2,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 3,
                        megnevezes: 'Személyazonosító okmány másolat',
                        leiras: 'Érvényes személyi igazolvány vagy útlevél másolat',
                        sorrend: 3,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 4,
                        megnevezes: 'Lakcímkártya másolat',
                        leiras: 'Érvényes lakcímkártya másolat csatolva',
                        sorrend: 4,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 5,
                        megnevezes: 'Vasútegészségügyi alkalmasság igazolása',
                        leiras: 'Érvényes vasútegészségügyi alkalmassági igazolás',
                        sorrend: 5,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 6,
                        megnevezes: 'Eljárási díj megfizetve',
                        leiras: 'Díjbekérő szerinti összeg befizetésre került',
                        sorrend: 6,
                        kotelezo: true,
                        aktiv: true
                    }
                ];
            }
        },

        // Mentett adatok betöltése
        loadData() {
            if (this.ugy && this.ugy.formai_data) {
                console.log('[F-0065] Mentett adatok betöltése');
                this.formData = { ...this.ugy.formai_data };
                this.hasChanges = false;
            } else {
                // Alapértelmezett ellenőrző neve
                this.formData.ellenorzoNeve = 'Dr. Szabó Péter'; // Mock
            }
        },

        // Validáció
        validate() {
            this.validationErrors = [];

            const kotelezoKriteriumok = this.kriteriumok.filter(k => k.kotelezo);

            kotelezoKriteriumok.forEach(k => {
                if (!this.formData.checks[k.id]) {
                    this.validationErrors.push({
                        field: k.id,
                        message: `Kötelező: ${k.megnevezes}`
                    });
                }
            });

            return this.validationErrors.length === 0;
        },

        // Automatikus döntés értékelése
        evaluateDecision() {
            const osszesCriteriaTeljesul = this.kriteriumok
                .filter(k => k.kotelezo)
                .every(k => this.formData.checks[k.id] === true);

            if (osszesCriteriaTeljesul) {
                this.formData.dontes = 'megfelel';
                this.formData.dontesDatum = new Date().toISOString().split('T')[0];
                this.formData.hianyossagok = [];
            } else {
                // Hiányzó kritériumok listája
                const hianyzok = this.kriteriumok
                    .filter(k => k.kotelezo && !this.formData.checks[k.id])
                    .map(k => k.megnevezes);

                this.formData.hianyossagok = hianyzok;

                // Ha van megjegyzés bármelyik hiányzó kritériumnál, akkor hiánypótlás
                const vanMegjegyzes = hianyzok.some(h => {
                    const k = this.kriteriumok.find(kr => kr.megnevezes === h);
                    return k && this.formData.megjegyzesek[k.id];
                });

                if (vanMegjegyzes || this.formData.altalanosMegjegyzes) {
                    this.formData.dontes = 'hianypotlas_szukseges';
                } else {
                    this.formData.dontes = 'nem_megfelel';
                }

                this.formData.dontesDatum = new Date().toISOString().split('T')[0];
            }
        },

        // Mentés
        save() {
            if (!this.validate()) {
                alert('Kérem töltse ki az összes kötelező kritériumot!');
                return;
            }

            this.evaluateDecision();

            console.log('[F-0065] Formai ellenőrzés mentése:', this.formData);

            // Emit update esemény
            this.$emit('update', {
                tab: 'formai',
                data: this.formData,
                status: this.formData.dontes === 'megfelel' ? 'completed' :
                        this.formData.dontes === 'hianypotlas_szukseges' ? 'pending' : 'rejected'
            });

            this.hasChanges = false;
            alert('Formai ellenőrzés sikeresen mentve!');

            // Következő lépés ajánlása
            if (this.formData.dontes === 'megfelel') {
                this.$emit('next', 'tartalmi');
            } else if (this.formData.dontes === 'hianypotlas_szukseges') {
                this.$emit('next', 'hianypotlas');
            }
        },

        // Alaphelyzetbe állítás
        reset() {
            if (confirm('Biztosan alaphelyzetbe állítja a formai ellenőrzést?')) {
                this.formData = {
                    checks: {},
                    megjegyzesek: {},
                    altalanosMegjegyzes: '',
                    dontes: null,
                    dontesDatum: null,
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    hianyossagok: []
                };

                this.kriteriumok.forEach(k => {
                    this.formData.checks[k.id] = false;
                    this.formData.megjegyzesek[k.id] = '';
                });

                this.hasChanges = true;
            }
        },

        // Change tracking
        markChanged() {
            this.hasChanges = true;
        }
    },
    watch: {
        // Automatikus értékelés amikor checkbox változik
        'formData.checks': {
            handler() {
                this.evaluateDecision();
                this.markChanged();
            },
            deep: true
        }
    },
    mounted() {
        console.log('[F-0065] Formai ellenőrzés tab betöltve');
        this.loadKriteriumok();
        this.loadData();
    },
    template: `
        <div v-show="active" class="vahap-tab">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5>
                    <i class="bi bi-file-check"></i>
                    Formai megfelelőség vizsgálata
                </h5>
                <div class="mt-2">
                    <span class="badge bg-info">UCE-1799</span>
                    <span class="badge bg-secondary">F-0065</span>
                    <span class="badge ms-2" :class="statuszBadge.class">{{ statuszBadge.text }}</span>
                </div>
            </div>

            <!-- Tab tartalom -->
            <div class="tab-content">
                <!-- Info panel -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Vizsgálja meg</strong>, hogy a kérelem formailag megfelelő-e, minden kötelező
                    melléklet csatolásra került-e. Mind a {{ kriteriumok.filter(k => k.kotelezo).length }}
                    kötelező kritériumnak teljesülnie kell a folytatáshoz.
                </div>

                <!-- Progress bar -->
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted">Teljesítés</small>
                        <small class="text-muted">
                            <strong>{{ teljesultKriteriumokSzama }}</strong> / {{ kriteriumok.length }}
                        </small>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar"
                             :class="isValid ? 'bg-success' : 'bg-warning'"
                             :style="'width: ' + progressPercent + '%'">
                        </div>
                    </div>
                </div>

                <!-- Ellenőrzési lista -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-list-check"></i>
                            Ellenőrzési lista
                        </strong>
                    </div>
                    <div class="card-body p-0">
                        <div v-for="kriterium in kriteriumok"
                             :key="kriterium.id"
                             class="checklist-item"
                             :class="{ 'checked': formData.checks[kriterium.id] }">

                            <div class="form-check">
                                <input type="checkbox"
                                       :id="'check-' + kriterium.id"
                                       class="form-check-input checklist-checkbox"
                                       v-model="formData.checks[kriterium.id]"
                                       :disabled="!kriterium.aktiv">
                                <label :for="'check-' + kriterium.id" class="form-check-label">
                                    <strong>{{ kriterium.megnevezes }}</strong>
                                    <span v-if="kriterium.kotelezo" class="text-danger">*</span>
                                    <br>
                                    <small class="text-muted">{{ kriterium.leiras }}</small>
                                </label>
                            </div>

                            <!-- Megjegyzés mező (ha be van pipálva) -->
                            <div v-if="formData.checks[kriterium.id]" class="mt-2 ps-4">
                                <textarea class="form-control form-control-sm"
                                          v-model="formData.megjegyzesek[kriterium.id]"
                                          placeholder="Megjegyzés (opcionális)"
                                          rows="2"
                                          @input="markChanged"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hiányosságok listája (ha vannak) -->
                <div v-if="hianyzoKriteriumok.length > 0" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Hiányzó kötelező kritériumok:</strong>
                    <ul class="mb-0 mt-2">
                        <li v-for="hianyzik in hianyzoKriteriumok" :key="hianyzik.id">
                            {{ hianyzik.megnevezes }}
                        </li>
                    </ul>
                </div>

                <!-- Általános megjegyzés -->
                <div class="mb-3">
                    <label class="form-label">
                        <i class="bi bi-chat-left-text"></i>
                        Általános megjegyzés / Hiányosságok részletezése
                    </label>
                    <textarea class="form-control"
                              v-model="formData.altalanosMegjegyzes"
                              rows="3"
                              placeholder="Formai ellenőrzéshez kapcsolódó megjegyzések, hiányosságok részletes leírása..."
                              @input="markChanged"></textarea>
                </div>

                <!-- Ellenőrző -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Ellenőrző neve</label>
                        <input type="text"
                               class="form-control"
                               v-model="formData.ellenorzoNeve"
                               readonly>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Ellenőrzés dátuma</label>
                        <input type="date"
                               class="form-control"
                               v-model="formData.dontesDatum"
                               readonly>
                    </div>
                </div>

                <!-- Döntés összegzés -->
                <div v-if="formData.dontes" class="alert"
                     :class="{
                         'alert-success': formData.dontes === 'megfelel',
                         'alert-warning': formData.dontes === 'hianypotlas_szukseges',
                         'alert-danger': formData.dontes === 'nem_megfelel'
                     }">
                    <div class="d-flex align-items-center">
                        <i class="bi fs-3 me-3"
                           :class="{
                               'bi-check-circle': formData.dontes === 'megfelel',
                               'bi-exclamation-triangle': formData.dontes === 'hianypotlas_szukseges',
                               'bi-x-circle': formData.dontes === 'nem_megfelel'
                           }"></i>
                        <div>
                            <strong>Döntés:</strong> {{ statuszBadge.text }}
                            <div class="small mt-1">
                                <i class="bi bi-calendar"></i>
                                {{ formData.dontesDatum }}
                            </div>
                            <div v-if="formData.hianyossagok.length > 0" class="mt-2">
                                <strong>Hiányosságok:</strong>
                                <ul class="mb-0 small">
                                    <li v-for="(h, idx) in formData.hianyossagok" :key="idx">{{ h }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Validációs hibák -->
                <div v-if="validationErrors.length > 0" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Hiányzó kötelező kritériumok:</strong>
                    <ul class="mb-0 mt-2">
                        <li v-for="error in validationErrors" :key="error.field">
                            {{ error.message }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Tab footer (gombok) -->
            <div class="tab-footer">
                <button class="btn btn-secondary" @click="reset">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Alaphelyzetbe
                </button>
                <div>
                    <button class="btn btn-outline-secondary me-2" @click="$emit('cancel')">
                        <i class="bi bi-x-circle"></i>
                        Mégse
                    </button>
                    <button class="btn btn-primary"
                            @click="save"
                            :disabled="!isValid">
                        <i class="bi bi-check-circle"></i>
                        Mentés és tovább
                        <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `
};
