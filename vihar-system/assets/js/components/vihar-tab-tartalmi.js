/**
 * VAHAP - F-0066 Tartalmi megfelelőség vizsgálat Tab (TELJES VERZIÓ)
 * UCE-1794 - Tartalmi megfelelőség vizsgálata
 * Használat: <vahap-tab-tartalmi :active="activeTab === 'tartalmi'" :ugy="ugy" @update="handleUpdate"></vahap-tab-tartalmi>
 *
 * Funkciók:
 * - Paraméterezett ellenőrzési lista betöltése
 * - Kötelező és opcionális kritériumok kezelése
 * - Megjegyzés mezők kritériumenként
 * - Automatikus életkor számítás
 * - VNY024 nyilvántartás integráció (F-0090)
 * - Automatikus státusz értékelés
 * - Mentés és validáció
 * - Következő lépés ajánlása
 */

const VahapTabTartalmi = {
    name: 'vahap-tab-tartalmi',
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
                dontes: null,         // 'megfelel' | 'nem_megfelel' | 'felteteles_megfelel'
                dontesDatum: null,
                ellenorzoNeve: '',
                tartalmi_hibak: []    // Lista a tartalmi hibákról
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
                return { text: 'Tartalmilag megfelelő', class: 'bg-success' };
            }

            if (this.formData.dontes === 'felteteles_megfelel') {
                return { text: 'Feltételesen megfelelő', class: 'bg-info' };
            }

            if (this.formData.dontes === 'nem_megfelel') {
                return { text: 'Tartalmilag nem megfelelő', class: 'bg-danger' };
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

        // Hiányzó kötelező kritériumok listája
        hianyzoKotelezoKriteriumok() {
            return this.kriteriumok.filter(k => k.kotelezo && !this.formData.checks[k.id]);
        },

        // Kérelmező életkora (ha van adat)
        ugyfelEletkora() {
            if (!this.ugy || !this.ugy.ugyfel || !this.ugy.ugyfel.szuletesi_datum) {
                return null;
            }
            return this.calculateAge(this.ugy.ugyfel.szuletesi_datum);
        }
    },
    methods: {
        // Kritériumok betöltése a paraméterezőből
        loadKriteriumok() {
            console.log('[F-0066] Kritériumok betöltése...');

            // VIHARMockData.parameterezo.ellenorzesi_lista_tartalmi betöltése
            if (VIHARMockData?.parameterezo?.ellenorzesi_lista_tartalmi) {
                const lista = VIHARMockData.parameterezo.ellenorzesi_lista_tartalmi;
                this.kriteriumok = JSON.parse(JSON.stringify(lista.kriteriumok || []));

                console.log(`[F-0066] Betöltve ${this.kriteriumok.length} kritérium`);

                // Checks inicializálása
                this.kriteriumok.forEach(k => {
                    if (this.formData.checks[k.id] === undefined) {
                        this.formData.checks[k.id] = false;
                    }
                    if (this.formData.megjegyzesek[k.id] === undefined) {
                        this.formData.megjegyzesek[k.id] = '';
                    }
                });
            } else {
                console.warn('[F-0066] Nincs paraméterezett kritérium lista!');
                // Fallback: Alapértelmezett kritériumok
                this.kriteriumok = [
                    {
                        id: 1,
                        megnevezes: 'Kérelmező életkora megfelelő (min. 18 év)',
                        leiras: 'Kérelmező betöltötte a 18. életévét',
                        sorrend: 1,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 2,
                        megnevezes: 'Egészségügyi alkalmasság érvényes',
                        leiras: 'Vasútegészségügyi alkalmassági igazolás érvényes',
                        sorrend: 2,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 3,
                        megnevezes: 'VNY024 nyilvántartás adatok ellenőrizve (F-0090)',
                        leiras: 'Vasútegészségügyi nyilvántartásban szereplő adatok ellenőrizve',
                        sorrend: 3,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 4,
                        megnevezes: 'Szakmai előképzettség igazolt',
                        leiras: 'Szükséges képzettség és szakmai gyakorlat igazolt',
                        sorrend: 4,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 5,
                        megnevezes: 'Nincs kizáró ok (pl. büntetett előélet)',
                        leiras: 'Büntetlen előélet és egyéb kizáró okok hiánya',
                        sorrend: 5,
                        kotelezo: true,
                        aktiv: true
                    },
                    {
                        id: 6,
                        megnevezes: 'Képzési követelmények teljesítve',
                        leiras: 'Szükséges képzések és továbbképzések teljesítve',
                        sorrend: 6,
                        kotelezo: false,
                        aktiv: true
                    }
                ];
            }
        },

        // Mentett adatok betöltése
        loadData() {
            if (this.ugy && this.ugy.tartalmi_data) {
                console.log('[F-0066] Mentett adatok betöltése');
                this.formData = { ...this.ugy.tartalmi_data };
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
            const kotelezoTeljesul = this.kriteriumok
                .filter(k => k.kotelezo)
                .every(k => this.formData.checks[k.id] === true);

            const opcionalisTeljesul = this.kriteriumok
                .filter(k => !k.kotelezo && k.aktiv)
                .every(k => this.formData.checks[k.id] === true);

            if (kotelezoTeljesul && opcionalisTeljesul) {
                this.formData.dontes = 'megfelel';
                this.formData.dontesDatum = new Date().toISOString().split('T')[0];
                this.formData.tartalmi_hibak = [];
            } else if (kotelezoTeljesul && !opcionalisTeljesul) {
                // Kötelező teljesül, opcionális nem
                this.formData.dontes = 'felteteles_megfelel';
                this.formData.dontesDatum = new Date().toISOString().split('T')[0];

                const hianyzo_opcionalis = this.kriteriumok
                    .filter(k => !k.kotelezo && k.aktiv && !this.formData.checks[k.id])
                    .map(k => k.megnevezes);

                this.formData.tartalmi_hibak = hianyzo_opcionalis;
            } else {
                // Kötelező nem teljesül
                const hianyzok = this.kriteriumok
                    .filter(k => k.kotelezo && !this.formData.checks[k.id])
                    .map(k => k.megnevezes);

                this.formData.tartalmi_hibak = hianyzok;
                this.formData.dontes = 'nem_megfelel';
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

            console.log('[F-0066] Tartalmi ellenőrzés mentése:', this.formData);

            // Emit update esemény
            this.$emit('update', {
                tab: 'tartalmi',
                data: this.formData,
                status: this.formData.dontes === 'megfelel' || this.formData.dontes === 'felteteles_megfelel'
                    ? 'completed'
                    : 'rejected'
            });

            this.hasChanges = false;
            alert('Tartalmi ellenőrzés sikeresen mentve!');

            // Következő lépés ajánlása
            if (this.formData.dontes === 'megfelel' || this.formData.dontes === 'felteteles_megfelel') {
                this.$emit('next', 'sommas');
            }
        },

        // Alaphelyzetbe állítás
        reset() {
            if (confirm('Biztosan alaphelyzetbe állítja a tartalmi ellenőrzést?')) {
                this.formData = {
                    checks: {},
                    megjegyzesek: {},
                    altalanosMegjegyzes: '',
                    dontes: null,
                    dontesDatum: null,
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    tartalmi_hibak: []
                };

                this.kriteriumok.forEach(k => {
                    this.formData.checks[k.id] = false;
                    this.formData.megjegyzesek[k.id] = '';
                });

                this.hasChanges = true;
            }
        },

        // Életkor számítás
        calculateAge(birthDate) {
            if (!birthDate) return null;
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
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
        console.log('[F-0066] Tartalmi ellenőrzés tab betöltve');
        this.loadKriteriumok();
        this.loadData();
    },
    template: `
        <div v-show="active" class="vahap-tab">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5>
                    <i class="bi bi-clipboard-check"></i>
                    Tartalmi megfelelőség vizsgálata
                </h5>
                <div class="mt-2">
                    <span class="badge bg-info">UCE-1794</span>
                    <span class="badge bg-secondary">F-0066</span>
                    <span class="badge ms-2" :class="statuszBadge.class">{{ statuszBadge.text }}</span>
                </div>
            </div>

            <!-- Tab tartalom -->
            <div class="tab-content">
                <!-- Info panel -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Vizsgálja meg</strong>, hogy a kérelem tartalmilag megfelel-e a jogszabályi
                    követelményeknek. Mind a {{ kriteriumok.filter(k => k.kotelezo).length }}
                    kötelező kritériumnak teljesülnie kell a folytatáshoz.
                </div>

                <!-- Ügyfél életkor info (ha van adat) -->
                <div v-if="ugyfelEletkora !== null" class="alert alert-light border">
                    <i class="bi bi-person"></i>
                    <strong>Kérelmező életkora:</strong>
                    <span class="badge ms-2" :class="ugyfelEletkora >= 18 ? 'bg-success' : 'bg-danger'">
                        {{ ugyfelEletkora }} év
                    </span>
                    <span v-if="ugyfelEletkora >= 18" class="text-success ms-2">
                        <i class="bi bi-check-circle"></i> Megfelelő
                    </span>
                    <span v-else class="text-danger ms-2">
                        <i class="bi bi-x-circle"></i> Nem megfelelő (min. 18 év szükséges)
                    </span>
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
                                    <span v-else class="badge bg-secondary ms-2">Opcionális</span>
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

                <!-- VNY024 nyilvántartás hivatkozás -->
                <div class="alert alert-light border">
                    <i class="bi bi-database"></i>
                    <strong>VNY024 Nyilvántartás ellenőrzés</strong>
                    <div class="small mt-2">
                        A VNY024 Vasútegészségügyi Nyilvántartás adatainak ellenőrzéséhez váltson a
                        <strong>"VNY024 Adatok"</strong> fülre.
                        <span class="badge badge-function ms-2">F-0090</span>
                    </div>
                </div>

                <!-- Hiányzó kötelező kritériumok listája (ha vannak) -->
                <div v-if="hianyzoKotelezoKriteriumok.length > 0" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Hiányzó kötelező kritériumok:</strong>
                    <ul class="mb-0 mt-2">
                        <li v-for="hianyzik in hianyzoKotelezoKriteriumok" :key="hianyzik.id">
                            {{ hianyzik.megnevezes }}
                        </li>
                    </ul>
                </div>

                <!-- Általános megjegyzés -->
                <div class="mb-3">
                    <label class="form-label">
                        <i class="bi bi-chat-left-text"></i>
                        Általános megjegyzés / Tartalmi hiányosságok részletezése
                    </label>
                    <textarea class="form-control"
                              v-model="formData.altalanosMegjegyzes"
                              rows="3"
                              placeholder="Tartalmi ellenőrzéshez kapcsolódó megjegyzések, észrevételek..."
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
                         'alert-info': formData.dontes === 'felteteles_megfelel',
                         'alert-danger': formData.dontes === 'nem_megfelel'
                     }">
                    <div class="d-flex align-items-center">
                        <i class="bi fs-3 me-3"
                           :class="{
                               'bi-check-circle': formData.dontes === 'megfelel',
                               'bi-info-circle': formData.dontes === 'felteteles_megfelel',
                               'bi-x-circle': formData.dontes === 'nem_megfelel'
                           }"></i>
                        <div>
                            <strong>Döntés:</strong> {{ statuszBadge.text }}
                            <div class="small mt-1">
                                <i class="bi bi-calendar"></i>
                                {{ formData.dontesDatum }}
                            </div>
                            <div v-if="formData.tartalmi_hibak.length > 0" class="mt-2">
                                <strong>
                                    {{ formData.dontes === 'felteteles_megfelel' ? 'Hiányzó opcionális kritériumok:' : 'Tartalmi hibák:' }}
                                </strong>
                                <ul class="mb-0 small">
                                    <li v-for="(h, idx) in formData.tartalmi_hibak" :key="idx">{{ h }}</li>
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
