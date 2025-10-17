/**
 * VAHAP - F-0088 Sommás eljárás döntés Tab (TELJES VERZIÓ)
 * UCE-1800 - Sommás eljárás alkalmazhatóságának vizsgálata
 * Döntés-előkészítés: sommás (8 munkanap) vagy teljes eljárás (60 nap)
 * Használat: <vahap-tab-sommas :active="activeTab === 'sommas'" :ugy="ugy" @update="handleUpdate"></vahap-tab-sommas>
 *
 * Funkciók:
 * - Előfeltételek ellenőrzése (hatáskör, formai, tartalmi)
 * - Sommás vs. Teljes eljárás döntés
 * - Határidő számítás (8 munkanap / 60 nap)
 * - Döntés indoklása
 * - Automatikus workflow státusz frissítés
 * - Mentés és következő lépés ajánlása
 */

const VahapTabSommas = {
    name: 'vahap-tab-sommas',
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
            // Űrlap adatok
            formData: {
                selectedOption: null,      // 'sommas_8nap' | 'teljes_60nap'
                indoklas: '',
                hataridoNap: null,         // 8 vagy 60
                hataridoDatum: null,       // Számított határidő
                dontesDatum: null,
                dontesIdopontja: null,
                ellenorzoNeve: '',
                elofeltetelekTeljesultek: false
            },

            // Validációs hibák
            validationErrors: [],

            // Módosítás flag
            hasChanges: false
        };
    },
    computed: {
        // Hatáskör vizsgálat kész?
        hatáskorReady() {
            if (!this.ugy.workflow_steps || !this.ugy.workflow_steps.hatáskor) {
                return false;
            }
            return this.ugy.workflow_steps.hatáskor.status === 'completed';
        },

        // Formai ellenőrzés kész?
        formaiReady() {
            if (!this.ugy.workflow_steps || !this.ugy.workflow_steps.formai) {
                return false;
            }
            return this.ugy.workflow_steps.formai.status === 'completed';
        },

        // Tartalmi ellenőrzés kész?
        tartalmiReady() {
            if (!this.ugy.workflow_steps || !this.ugy.workflow_steps.tartalmi) {
                return false;
            }
            return this.ugy.workflow_steps.tartalmi.status === 'completed';
        },

        // Minden előfeltétel teljesült?
        canSelectSommas() {
            return this.hatáskorReady && this.formaiReady && this.tartalmiReady;
        },

        // Teljes eljárás mindig választható
        canSelectTeljes() {
            return true;
        },

        // Validáció
        isValid() {
            return this.formData.selectedOption &&
                   this.formData.indoklas.trim().length >= 20;
        },

        // Státusz badge
        statuszBadge() {
            if (!this.formData.selectedOption) {
                return { text: 'Folyamatban', class: 'bg-warning' };
            }

            if (this.formData.selectedOption === 'sommas_8nap') {
                return { text: 'Sommás eljárás (8 nap)', class: 'bg-success' };
            }

            if (this.formData.selectedOption === 'teljes_60nap') {
                return { text: 'Teljes eljárás (60 nap)', class: 'bg-primary' };
            }

            return { text: 'Ismeretlen', class: 'bg-secondary' };
        },

        // Progress számítás
        progressPercent() {
            let teljesult = 0;
            if (this.hatáskorReady) teljesult++;
            if (this.formaiReady) teljesult++;
            if (this.tartalmiReady) teljesult++;
            return Math.round((teljesult / 3) * 100);
        }
    },
    methods: {
        // Opció választása
        selectOption(option) {
            this.formData.selectedOption = option;

            // Határidő nap beállítása
            if (option === 'sommas_8nap') {
                this.formData.hataridoNap = 8;
            } else if (option === 'teljes_60nap') {
                this.formData.hataridoNap = 60;
            }

            // Határidő dátum számítása
            this.calculateDeadline();

            this.hasChanges = true;
        },

        // Határidő számítás (munkanapok)
        calculateDeadline() {
            if (!this.formData.hataridoNap) return;

            const today = new Date();
            let businessDaysAdded = 0;
            let currentDate = new Date(today);

            while (businessDaysAdded < this.formData.hataridoNap) {
                currentDate.setDate(currentDate.getDate() + 1);
                const dayOfWeek = currentDate.getDay();

                // Hétfő-Péntek (1-5)
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    businessDaysAdded++;
                }
            }

            this.formData.hataridoDatum = currentDate.toISOString().split('T')[0];
        },

        // Validáció
        validate() {
            this.validationErrors = [];

            if (!this.formData.selectedOption) {
                this.validationErrors.push({
                    field: 'selectedOption',
                    message: 'Válasszon eljárási formát!'
                });
            }

            if (this.formData.indoklas.trim().length < 20) {
                this.validationErrors.push({
                    field: 'indoklas',
                    message: 'Az indoklás legalább 20 karakter hosszú legyen!'
                });
            }

            if (this.formData.selectedOption === 'sommas_8nap' && !this.canSelectSommas) {
                this.validationErrors.push({
                    field: 'elofeltetel',
                    message: 'Sommás eljárás csak akkor választható, ha minden előfeltétel teljesült!'
                });
            }

            return this.validationErrors.length === 0;
        },

        // Mentés
        save() {
            if (!this.validate()) {
                alert('Kérem töltse ki az összes kötelező mezőt!');
                return;
            }

            this.formData.dontesDatum = new Date().toISOString().split('T')[0];
            this.formData.dontesIdopontja = new Date().toISOString();
            this.formData.elofeltetelekTeljesultek = this.canSelectSommas;

            console.log('[F-0088] Sommás/Teljes eljárás döntés mentése:', this.formData);

            // Emit update esemény
            this.$emit('update', {
                tab: 'sommas',
                data: this.formData,
                status: 'completed'
            });

            this.hasChanges = false;

            const tipusNev = this.formData.selectedOption === 'sommas_8nap' ? 'Sommás' : 'Teljes';
            alert(`${tipusNev} eljárás döntés sikeresen rögzítve!\nHatáridő: ${this.formData.hataridoDatum}`);

            // Következő lépés ajánlása
            if (this.formData.selectedOption === 'sommas_8nap') {
                this.$emit('next', 'dontesi-javaslat');
            } else {
                this.$emit('next', 'tenyallas');
            }
        },

        // Mentett adatok betöltése
        loadData() {
            if (this.ugy && this.ugy.sommas_data) {
                console.log('[F-0088] Mentett adatok betöltése');
                this.formData = { ...this.ugy.sommas_data };
                this.hasChanges = false;
            } else {
                // Alapértelmezett ellenőrző neve
                this.formData.ellenorzoNeve = 'Dr. Szabó Péter'; // Mock
            }
        },

        // Alaphelyzetbe állítás
        reset() {
            if (confirm('Biztosan alaphelyzetbe állítja a döntést?')) {
                this.formData = {
                    selectedOption: null,
                    indoklas: '',
                    hataridoNap: null,
                    hataridoDatum: null,
                    dontesDatum: null,
                    dontesIdopontja: null,
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    elofeltetelekTeljesultek: false
                };
                this.hasChanges = true;
            }
        },

        // Change tracking
        markChanged() {
            this.hasChanges = true;
        }
    },
    mounted() {
        console.log('[F-0088] Sommás eljárás döntés tab betöltve');
        this.loadData();
    },
    template: `
        <div v-show="active" class="vahap-tab">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5>
                    <i class="bi bi-lightning"></i>
                    Sommás eljárás alkalmazhatóságának vizsgálata
                </h5>
                <div class="mt-2">
                    <span class="badge bg-info">UCE-1800</span>
                    <span class="badge bg-secondary">F-0088</span>
                    <span class="badge ms-2" :class="statuszBadge.class">{{ statuszBadge.text }}</span>
                </div>
            </div>

            <!-- Tab tartalom -->
            <div class="tab-content">
                <!-- Info panel -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Döntés-előkészítés:</strong> Határozza meg, hogy a kérelem sommás vagy teljes eljárásban kerüljön elbírálásra.
                </div>

                <!-- Sommás eljárás információ -->
                <div class="card mb-3 border-success">
                    <div class="card-header bg-success text-white">
                        <strong>
                            <i class="bi bi-lightning-charge"></i>
                            Sommás eljárás feltételei (8 munkanap)
                        </strong>
                    </div>
                    <div class="card-body">
                        <ul class="mb-0">
                            <li>A kérelem minden szempontból megfelel (hatáskör, formai, tartalmi)</li>
                            <li>Nincs szükség további tényállás tisztázására</li>
                            <li>Nincs szükség szakhatósági állásfoglalásra</li>
                            <li>Nincs szükség helyszíni szemlére</li>
                            <li><strong>Határidő: 8 munkanap</strong></li>
                        </ul>
                    </div>
                </div>

                <!-- Teljes eljárás információ -->
                <div class="card mb-3 border-primary">
                    <div class="card-header bg-primary text-white">
                        <strong>
                            <i class="bi bi-calendar-range"></i>
                            Teljes eljárás (60 nap)
                        </strong>
                    </div>
                    <div class="card-body">
                        <ul class="mb-0">
                            <li>Összetett ügy, több vizsgálat szükséges</li>
                            <li>Tényállás tisztázása szükséges (helyszíni szemle, szakértő stb.)</li>
                            <li>Szakhatósági állásfoglalás szükséges</li>
                            <li><strong>Határidő: 60 nap</strong></li>
                        </ul>
                    </div>
                </div>

                <!-- Előfeltételek ellenőrzése -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-list-check"></i>
                            Előfeltételek ellenőrzése
                        </strong>
                    </div>
                    <div class="card-body p-0">
                        <div class="checklist-item" :class="{ 'checked': hatáskorReady }">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <i class="bi me-2 fs-5"
                                       :class="hatáskorReady ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'"></i>
                                    <div>
                                        <strong>Hatáskör vizsgálat befejezve</strong>
                                        <div class="small text-muted">UCE-1793 - F-0064</div>
                                    </div>
                                </div>
                                <span v-if="hatáskorReady" class="badge bg-success">Kész</span>
                                <span v-else class="badge bg-secondary">Folyamatban</span>
                            </div>
                        </div>
                        <div class="checklist-item" :class="{ 'checked': formaiReady }">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <i class="bi me-2 fs-5"
                                       :class="formaiReady ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'"></i>
                                    <div>
                                        <strong>Formai ellenőrzés befejezve</strong>
                                        <div class="small text-muted">UCE-1799 - F-0065</div>
                                    </div>
                                </div>
                                <span v-if="formaiReady" class="badge bg-success">Kész</span>
                                <span v-else class="badge bg-secondary">Folyamatban</span>
                            </div>
                        </div>
                        <div class="checklist-item" :class="{ 'checked': tartalmiReady }">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <i class="bi me-2 fs-5"
                                       :class="tartalmiReady ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'"></i>
                                    <div>
                                        <strong>Tartalmi ellenőrzés befejezve</strong>
                                        <div class="small text-muted">UCE-1794 - F-0066</div>
                                    </div>
                                </div>
                                <span v-if="tartalmiReady" class="badge bg-success">Kész</span>
                                <span v-else class="badge bg-secondary">Folyamatban</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Teljesítés</small>
                            <small class="text-muted">
                                <strong>{{ progressPercent }}%</strong>
                            </small>
                        </div>
                        <div class="progress mt-1" style="height: 5px;">
                            <div class="progress-bar"
                                 :class="canSelectSommas ? 'bg-success' : 'bg-warning'"
                                 :style="'width: ' + progressPercent + '%'">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Figyelmeztetés ha előfeltételek nem teljesülnek -->
                <div v-if="!canSelectSommas" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Figyelem!</strong> Sommás eljárás csak akkor választható, ha minden előfeltétel teljesült.
                    A teljes eljárás választása mindig lehetséges.
                </div>

                <!-- Döntési opciók -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-check-square"></i>
                            Eljárási forma döntése
                        </strong>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-3">

                            <!-- Sommás eljárás opció -->
                            <button class="btn btn-lg text-start"
                                    :class="formData.selectedOption === 'sommas_8nap' ? 'btn-success' : 'btn-outline-success'"
                                    @click="selectOption('sommas_8nap')"
                                    :disabled="!canSelectSommas">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="bi bi-lightning-charge fs-4 me-2"></i>
                                            <strong class="fs-5">Sommás eljárás alkalmazása</strong>
                                        </div>
                                        <div class="small">
                                            <span class="badge bg-light text-dark me-2">UCE-1826</span>
                                            Határidő: <strong>8 munkanap</strong>
                                        </div>
                                        <div class="small text-muted mt-1">
                                            Egyszerű, gyors elbírálás - előfeltételek teljesültek
                                        </div>
                                    </div>
                                    <i v-if="formData.selectedOption === 'sommas_8nap'"
                                       class="bi bi-check-circle-fill fs-3"></i>
                                </div>
                            </button>

                            <!-- Teljes eljárás opció -->
                            <button class="btn btn-lg text-start"
                                    :class="formData.selectedOption === 'teljes_60nap' ? 'btn-primary' : 'btn-outline-primary'"
                                    @click="selectOption('teljes_60nap')">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="bi bi-calendar-range fs-4 me-2"></i>
                                            <strong class="fs-5">Teljes eljárás lefolytatása</strong>
                                        </div>
                                        <div class="small">
                                            <span class="badge bg-light text-dark me-2">UCE-1826</span>
                                            Határidő: <strong>60 nap</strong>
                                        </div>
                                        <div class="small text-muted mt-1">
                                            Részletes vizsgálat, tényállás tisztázás szükséges
                                        </div>
                                    </div>
                                    <i v-if="formData.selectedOption === 'teljes_60nap'"
                                       class="bi bi-check-circle-fill fs-3"></i>
                                </div>
                            </button>

                        </div>
                    </div>
                </div>

                <!-- Határidő megjelenítése (ha van választás) -->
                <div v-if="formData.selectedOption && formData.hataridoDatum" class="alert alert-light border">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-calendar-event fs-3 me-3 text-primary"></i>
                        <div>
                            <strong>Számított ügyintézési határidő:</strong>
                            <div class="fs-5 text-primary mt-1">
                                {{ formData.hataridoDatum }}
                                <span class="badge bg-primary ms-2">{{ formData.hataridoNap }} munkanap</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Indoklás -->
                <div v-if="formData.selectedOption" class="mb-3">
                    <label class="form-label">
                        <i class="bi bi-chat-left-text"></i>
                        Döntés indoklása
                        <span class="text-danger">*</span>
                    </label>
                    <textarea class="form-control"
                              v-model="formData.indoklas"
                              rows="4"
                              placeholder="Adja meg a döntés részletes indoklását (min. 20 karakter)..."
                              @input="markChanged"></textarea>
                    <div class="form-text">
                        Röviden indokolja meg, hogy miért választotta ezt az eljárási formát.
                        Hivatkozzon a kérelem jellemzőire és a vizsgálat eredményeire.
                    </div>
                    <div v-if="formData.indoklas.length > 0" class="form-text">
                        Karakter: {{ formData.indoklas.length }} / min. 20
                    </div>
                </div>

                <!-- Ellenőrző -->
                <div v-if="formData.selectedOption" class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Döntéshozó neve</label>
                        <input type="text"
                               class="form-control"
                               v-model="formData.ellenorzoNeve"
                               readonly>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Döntés dátuma</label>
                        <input type="date"
                               class="form-control"
                               v-model="formData.dontesDatum"
                               readonly>
                    </div>
                </div>

                <!-- Validációs hibák -->
                <div v-if="validationErrors.length > 0" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Hiányosságok:</strong>
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
                        Döntés rögzítése
                        <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `
};
