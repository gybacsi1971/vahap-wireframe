/**
 * VAHAP - F-0096 Véleményezés Tab (TELJES VERZIÓ)
 * UCE-1824 - Döntési javaslat véleményeztetése
 * Használat: <vahap-tab-velemenyezes :active="activeTab === 'velemenyezes'" :ugy="ugy" @update="handleUpdate"></vahap-tab-velemenyezes>
 *
 * Funkciók:
 * - Döntési javaslat összefoglalójának megjelenítése
 * - Véleményezők hozzáadása és kezelése
 * - Vélemények bekérése és rögzítése
 * - Vélemények státuszkövetése
 * - Vélemények összesítése
 */

const VahapTabVelemenyezes = {
    name: 'vahap-tab-velemenyezes',
    emits: ['update', 'save', 'next'],
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
            // Döntési javaslat adatok (előzmény)
            dontesiJavaslat: null,

            // Véleményezők listája
            velemenyezok: [],

            // Új véleményező hozzáadása
            ujVelemenyezo: {
                nev: '',
                beosztas: '',
                szervezet: '',
                email: '',
                hatarido: null
            },

            // Form állapotok
            showAddForm: false,
            selectedVelemenyezo: null,
            showVelemenyForm: false,

            // Validáció
            validationErrors: [],

            // Loading
            loading: false,
            hasChanges: false
        };
    },
    computed: {
        // Előfeltételek ellenőrzése
        elofeltetelekTeljesultek() {
            return this.ugy.workflow_steps &&
                   this.ugy.workflow_steps['dontesi-javaslat'] &&
                   this.ugy.workflow_steps['dontesi-javaslat'].status === 'completed';
        },

        // Összes vélemény beérkezett?
        osszesVelemenyBeerkezett() {
            if (this.velemenyezok.length === 0) return false;
            return this.velemenyezok.every(v => v.velemeny_statusz === 'beerkezett');
        },

        // Vélemények statisztika
        velemenyStatisztika() {
            const osszes = this.velemenyezok.length;
            const varva = this.velemenyezok.filter(v => v.velemeny_statusz === 'varva').length;
            const beerkezett = this.velemenyezok.filter(v => v.velemeny_statusz === 'beerkezett').length;
            const lejart_hatarido = this.velemenyezok.filter(v => {
                if (!v.hatarido) return false;
                const today = new Date();
                const deadline = new Date(v.hatarido);
                return v.velemeny_statusz === 'varva' && today > deadline;
            }).length;

            return {
                osszes,
                varva,
                beerkezett,
                lejart_hatarido,
                progress: osszes > 0 ? Math.round((beerkezett / osszes) * 100) : 0
            };
        },

        // Validáció
        isValid() {
            return this.velemenyezok.length > 0 && this.osszesVelemenyBeerkezett;
        },

        // Minimális határidő (mai nap + 3 nap)
        minimalisHatarido() {
            const ma = new Date();
            ma.setDate(ma.getDate() + 3);
            return ma.toISOString().split('T')[0];
        }
    },
    methods: {
        // Döntési javaslat betöltése
        loadDontesiJavaslat() {
            if (!this.elofeltetelekTeljesultek) {
                console.warn('[F-0096] Előfeltétel nem teljesült: döntési javaslat nem készült el');
                return;
            }

            if (this.ugy.dontesi_javaslat_data) {
                this.dontesiJavaslat = { ...this.ugy.dontesi_javaslat_data };
                console.log('[F-0096] Döntési javaslat betöltve:', this.dontesiJavaslat);
            }
        },

        // Mentett véleményezők betöltése
        loadVelemenyezok() {
            if (this.ugy.velemenyezes_data && this.ugy.velemenyezes_data.velemenyezok) {
                this.velemenyezok = JSON.parse(JSON.stringify(this.ugy.velemenyezes_data.velemenyezok));
                console.log(`[F-0096] ${this.velemenyezok.length} véleményező betöltve`);
            } else {
                // Mock alapértelmezett véleményezők
                this.velemenyezok = [
                    {
                        id: 1,
                        nev: 'Dr. Kiss László',
                        beosztas: 'Főosztályvezető-helyettes',
                        szervezet: 'Vasúti Hatósági Főosztály',
                        email: 'kiss.laszlo@ekm.gov.hu',
                        hatarido: this.getDefaultHatarido(5),
                        kikuldve: new Date().toISOString().split('T')[0],
                        velemeny_statusz: 'varva',
                        velemeny: null,
                        velemeny_datum: null
                    }
                ];
            }
        },

        // Alapértelmezett határidő (munkanapok)
        getDefaultHatarido(munkanapok) {
            const today = new Date();
            let businessDaysAdded = 0;
            let currentDate = new Date(today);

            while (businessDaysAdded < munkanapok) {
                currentDate.setDate(currentDate.getDate() + 1);
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    businessDaysAdded++;
                }
            }

            return currentDate.toISOString().split('T')[0];
        },

        // Véleményező hozzáadása form megnyitása
        openAddForm() {
            this.ujVelemenyezo = {
                nev: '',
                beosztas: '',
                szervezet: 'Vasúti Hatósági Főosztály',
                email: '',
                hatarido: this.getDefaultHatarido(5)
            };
            this.showAddForm = true;
        },

        // Véleményező hozzáadása
        addVelemenyezo() {
            // Validáció
            this.validationErrors = [];

            if (!this.ujVelemenyezo.nev.trim()) {
                this.validationErrors.push('Véleményező neve kötelező');
            }
            if (!this.ujVelemenyezo.beosztas.trim()) {
                this.validationErrors.push('Beosztás kötelező');
            }
            if (!this.ujVelemenyezo.email.trim()) {
                this.validationErrors.push('E-mail cím kötelező');
            }
            if (!this.ujVelemenyezo.hatarido) {
                this.validationErrors.push('Határidő kötelező');
            }

            if (this.validationErrors.length > 0) {
                return;
            }

            // Hozzáadás
            const ujId = this.velemenyezok.length > 0
                ? Math.max(...this.velemenyezok.map(v => v.id)) + 1
                : 1;

            this.velemenyezok.push({
                id: ujId,
                ...this.ujVelemenyezo,
                kikuldve: new Date().toISOString().split('T')[0],
                velemeny_statusz: 'varva',
                velemeny: null,
                velemeny_datum: null
            });

            this.showAddForm = false;
            this.hasChanges = true;
            console.log('[F-0096] Új véleményező hozzáadva:', this.ujVelemenyezo.nev);
        },

        // Véleményező törlése
        deleteVelemenyezo(id) {
            if (confirm('Biztosan törli a véleményezőt?')) {
                const index = this.velemenyezok.findIndex(v => v.id === id);
                if (index > -1) {
                    this.velemenyezok.splice(index, 1);
                    this.hasChanges = true;
                }
            }
        },

        // Vélemény rögzítése form megnyitása
        openVelemenyForm(velemenyezo) {
            this.selectedVelemenyezo = { ...velemenyezo };
            if (!this.selectedVelemenyezo.velemeny) {
                this.selectedVelemenyezo.velemeny = {
                    allaspont: '', // 'egyetert' | 'nem_ert_egyet' | 'modositassal_egyetert'
                    indoklas: '',
                    megjegyzes: ''
                };
            }
            this.showVelemenyForm = true;
        },

        // Vélemény mentése
        saveVelemeny() {
            if (!this.selectedVelemenyezo.velemeny.allaspont) {
                alert('Kérem válasszon álláspontot!');
                return;
            }

            if (!this.selectedVelemenyezo.velemeny.indoklas ||
                this.selectedVelemenyezo.velemeny.indoklas.length < 20) {
                alert('Az indoklás minimum 20 karakter hosszú kell legyen!');
                return;
            }

            // Vélemény rögzítése
            const index = this.velemenyezok.findIndex(v => v.id === this.selectedVelemenyezo.id);
            if (index > -1) {
                this.velemenyezok[index].velemeny = { ...this.selectedVelemenyezo.velemeny };
                this.velemenyezok[index].velemeny_statusz = 'beerkezett';
                this.velemenyezok[index].velemeny_datum = new Date().toISOString().split('T')[0];
            }

            this.showVelemenyForm = false;
            this.hasChanges = true;
            console.log('[F-0096] Vélemény rögzítve:', this.selectedVelemenyezo.nev);
        },

        // Véleményezés befejezése
        completeVelemenyezes() {
            if (!this.isValid) {
                alert('Nem minden vélemény érkezett be!');
                return;
            }

            console.log('[F-0096] Véleményezés befejezve');

            // Emit update esemény
            this.$emit('update', {
                tab: 'velemenyezes',
                data: {
                    velemenyezok: this.velemenyezok,
                    befejezve: true,
                    befejezve_datum: new Date().toISOString().split('T')[0]
                },
                status: 'completed'
            });

            this.hasChanges = false;
            alert('Véleményezés sikeresen befejezve!');

            // Következő lépés
            this.$emit('next', 'vezetoi-dontes');
        },

        // Állapot szöveg
        getStatuszText(statusz) {
            const map = {
                'varva': 'Véleményre vár',
                'beerkezett': 'Beérkezett'
            };
            return map[statusz] || statusz;
        },

        // Állapot badge osztály
        getStatuszBadgeClass(statusz) {
            const map = {
                'varva': 'bg-warning',
                'beerkezett': 'bg-success'
            };
            return map[statusz] || 'bg-secondary';
        },

        // Álláspont szöveg
        getAllaspontText(allaspont) {
            const map = {
                'egyetert': 'Egyetért',
                'nem_ert_egyet': 'Nem ért egyet',
                'modositassal_egyetert': 'Módosítással egyetért'
            };
            return map[allaspont] || allaspont;
        }
    },
    watch: {
        ugy: {
            handler() {
                this.loadDontesiJavaslat();
                this.loadVelemenyezok();
            },
            deep: true
        }
    },
    mounted() {
        console.log('[F-0096] Véleményezés tab betöltve');
        this.loadDontesiJavaslat();
        this.loadVelemenyezok();
    },
    template: `
        <div v-show="active" class="vahap-tab">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5>
                    <i class="bi bi-chat-left-quote"></i>
                    Döntési javaslat véleményeztetése
                </h5>
                <div class="mt-2">
                    <span class="badge bg-info">UCE-1824</span>
                    <span class="badge bg-secondary">F-0096</span>
                </div>
            </div>

            <!-- Tab tartalom -->
            <div class="tab-content">
                <!-- Előfeltétel ellenőrzés -->
                <div v-if="!elofeltetelekTeljesultek" class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Előfeltétel nem teljesült</strong>
                    <p class="mb-0 mt-2">
                        A véleményezéshez előbb el kell készíteni a döntési javaslatot.
                    </p>
                </div>

                <template v-else>
                    <!-- Info panel -->
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>Véleményeztetés</strong>: A döntési javaslat szakmai véleményeztetése
                        több véleményezőtől. Minden véleménynek be kell érkeznie a továbbhaladáshoz.
                    </div>

                    <!-- Döntési javaslat összefoglaló -->
                    <div v-if="dontesiJavaslat" class="card mb-3">
                        <div class="card-header bg-light">
                            <strong>
                                <i class="bi bi-file-text"></i>
                                Döntési javaslat összefoglalója
                            </strong>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Döntés típusa:</strong> {{ dontesiJavaslat.dontesiTipus }}</p>
                                    <p><strong>Jóváhagyás:</strong>
                                        <span :class="dontesiJavaslat.jovahagyas ? 'text-success' : 'text-danger'">
                                            {{ dontesiJavaslat.jovahagyas ? 'Igen' : 'Nem' }}
                                        </span>
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Elkészítve:</strong> {{ dontesiJavaslat.dontesDatum }}</p>
                                    <p><strong>Készítő:</strong> {{ dontesiJavaslat.ellenorzoNeve }}</p>
                                </div>
                            </div>
                            <div class="mt-2">
                                <p><strong>Indoklás:</strong></p>
                                <p class="text-muted small">{{ dontesiJavaslat.indoklas }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Progress bar -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1">
                            <small class="text-muted">Vélemények</small>
                            <small class="text-muted">
                                <strong>{{ velemenyStatisztika.beerkezett }}</strong> / {{ velemenyStatisztika.osszes }}
                            </small>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar"
                                 :class="osszesVelemenyBeerkezett ? 'bg-success' : 'bg-warning'"
                                 :style="'width: ' + velemenyStatisztika.progress + '%'">
                            </div>
                        </div>
                        <div v-if="velemenyStatisztika.lejart_hatarido > 0" class="text-danger small mt-1">
                            <i class="bi bi-exclamation-circle"></i>
                            {{ velemenyStatisztika.lejart_hatarido }} vélemény határideje lejárt
                        </div>
                    </div>

                    <!-- Véleményezők listája -->
                    <div class="card mb-3">
                        <div class="card-header bg-light d-flex justify-content-between align-items-center">
                            <strong>
                                <i class="bi bi-people"></i>
                                Véleményezők listája
                            </strong>
                            <button class="btn btn-sm btn-primary" @click="openAddForm">
                                <i class="bi bi-plus-lg"></i>
                                Új véleményező
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="velemenyezok.length === 0" class="p-3 text-center text-muted">
                                <i class="bi bi-inbox"></i> Még nincs véleményező hozzáadva
                            </div>

                            <div v-else class="list-group list-group-flush">
                                <div v-for="velemenyezo in velemenyezok"
                                     :key="velemenyezo.id"
                                     class="list-group-item">

                                    <div class="d-flex justify-content-between align-items-start">
                                        <div class="flex-grow-1">
                                            <h6 class="mb-1">
                                                {{ velemenyezo.nev }}
                                                <span class="badge ms-2" :class="getStatuszBadgeClass(velemenyezo.velemeny_statusz)">
                                                    {{ getStatuszText(velemenyezo.velemeny_statusz) }}
                                                </span>
                                            </h6>
                                            <p class="mb-1 small text-muted">
                                                {{ velemenyezo.beosztas }} - {{ velemenyezo.szervezet }}
                                            </p>
                                            <p class="mb-0 small">
                                                <i class="bi bi-envelope"></i> {{ velemenyezo.email }}
                                                <span class="ms-3">
                                                    <i class="bi bi-calendar-event"></i>
                                                    Határidő: {{ velemenyezo.hatarido }}
                                                </span>
                                            </p>

                                            <!-- Vélemény összefoglaló -->
                                            <div v-if="velemenyezo.velemeny_statusz === 'beerkezett'" class="mt-2 p-2 bg-light rounded">
                                                <p class="mb-1 small">
                                                    <strong>Álláspont:</strong>
                                                    <span :class="{
                                                        'text-success': velemenyezo.velemeny.allaspont === 'egyetert',
                                                        'text-danger': velemenyezo.velemeny.allaspont === 'nem_ert_egyet',
                                                        'text-warning': velemenyezo.velemeny.allaspont === 'modositassal_egyetert'
                                                    }">
                                                        {{ getAllaspontText(velemenyezo.velemeny.allaspont) }}
                                                    </span>
                                                </p>
                                                <p class="mb-0 small text-muted">
                                                    {{ velemenyezo.velemeny.indoklas }}
                                                </p>
                                                <p class="mb-0 small text-muted mt-1">
                                                    <i class="bi bi-calendar-check"></i>
                                                    Beérkezett: {{ velemenyezo.velemeny_datum }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="ms-3">
                                            <button v-if="velemenyezo.velemeny_statusz === 'varva'"
                                                    class="btn btn-sm btn-outline-primary me-2"
                                                    @click="openVelemenyForm(velemenyezo)">
                                                <i class="bi bi-pencil"></i>
                                                Vélemény rögzítése
                                            </button>
                                            <button v-else
                                                    class="btn btn-sm btn-outline-secondary me-2"
                                                    @click="openVelemenyForm(velemenyezo)">
                                                <i class="bi bi-eye"></i>
                                                Megtekintés
                                            </button>
                                            <button class="btn btn-sm btn-link text-danger"
                                                    @click="deleteVelemenyezo(velemenyezo.id)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Új véleményező form (modal) -->
                    <div v-if="showAddForm" class="modal-backdrop show"></div>
                    <div v-if="showAddForm" class="modal show d-block" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Új véleményező hozzáadása</h5>
                                    <button type="button" class="btn-close" @click="showAddForm = false"></button>
                                </div>
                                <div class="modal-body">
                                    <div v-if="validationErrors.length > 0" class="alert alert-danger">
                                        <ul class="mb-0">
                                            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                                        </ul>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Név <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="ujVelemenyezo.nev">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Beosztás <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="ujVelemenyezo.beosztas">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Szervezet</label>
                                        <input type="text" class="form-control" v-model="ujVelemenyezo.szervezet">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">E-mail <span class="text-danger">*</span></label>
                                        <input type="email" class="form-control" v-model="ujVelemenyezo.email">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Határidő <span class="text-danger">*</span></label>
                                        <input type="date"
                                               class="form-control"
                                               v-model="ujVelemenyezo.hatarido"
                                               :min="minimalisHatarido">
                                        <small class="text-muted">Minimum 3 munkanap</small>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="showAddForm = false">Mégse</button>
                                    <button type="button" class="btn btn-primary" @click="addVelemenyezo">
                                        <i class="bi bi-check-lg"></i> Hozzáad
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vélemény rögzítése form (modal) -->
                    <div v-if="showVelemenyForm" class="modal-backdrop show"></div>
                    <div v-if="showVelemenyForm" class="modal show d-block" tabindex="-1">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">
                                        Vélemény rögzítése - {{ selectedVelemenyezo.nev }}
                                    </h5>
                                    <button type="button" class="btn-close" @click="showVelemenyForm = false"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="form-label">Álláspont <span class="text-danger">*</span></label>
                                        <div class="form-check">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   id="egyetert"
                                                   value="egyetert"
                                                   v-model="selectedVelemenyezo.velemeny.allaspont"
                                                   :disabled="selectedVelemenyezo.velemeny_statusz === 'beerkezett'">
                                            <label class="form-check-label text-success" for="egyetert">
                                                <i class="bi bi-check-circle"></i> Egyetértek a döntési javaslattal
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   id="modositassal"
                                                   value="modositassal_egyetert"
                                                   v-model="selectedVelemenyezo.velemeny.allaspont"
                                                   :disabled="selectedVelemenyezo.velemeny_statusz === 'beerkezett'">
                                            <label class="form-check-label text-warning" for="modositassal">
                                                <i class="bi bi-exclamation-circle"></i> Módosítással egyetértek
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   id="nem_egyetert"
                                                   value="nem_ert_egyet"
                                                   v-model="selectedVelemenyezo.velemeny.allaspont"
                                                   :disabled="selectedVelemenyezo.velemeny_statusz === 'beerkezett'">
                                            <label class="form-check-label text-danger" for="nem_egyetert">
                                                <i class="bi bi-x-circle"></i> Nem értek egyet a döntési javaslattal
                                            </label>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Indoklás <span class="text-danger">*</span></label>
                                        <textarea class="form-control"
                                                  rows="5"
                                                  v-model="selectedVelemenyezo.velemeny.indoklas"
                                                  :readonly="selectedVelemenyezo.velemeny_statusz === 'beerkezett'"
                                                  placeholder="Részletes indoklás (minimum 20 karakter)..."></textarea>
                                        <small class="text-muted">
                                            {{ selectedVelemenyezo.velemeny.indoklas ? selectedVelemenyezo.velemeny.indoklas.length : 0 }} / 20 karakter
                                        </small>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">További megjegyzések</label>
                                        <textarea class="form-control"
                                                  rows="3"
                                                  v-model="selectedVelemenyezo.velemeny.megjegyzes"
                                                  :readonly="selectedVelemenyezo.velemeny_statusz === 'beerkezett'"
                                                  placeholder="Opcionális megjegyzések..."></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="showVelemenyForm = false">
                                        {{ selectedVelemenyezo.velemeny_statusz === 'beerkezett' ? 'Bezár' : 'Mégse' }}
                                    </button>
                                    <button v-if="selectedVelemenyezo.velemeny_statusz === 'varva'"
                                            type="button"
                                            class="btn btn-primary"
                                            @click="saveVelemeny">
                                        <i class="bi bi-check-lg"></i> Vélemény mentése
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
            </div>

            <!-- Tab footer (gombok) -->
            <div v-if="elofeltetelekTeljesultek" class="tab-footer">
                <button class="btn btn-secondary" @click="$emit('cancel')">
                    <i class="bi bi-x-circle"></i>
                    Mégse
                </button>
                <div>
                    <button class="btn btn-primary"
                            @click="completeVelemenyezes"
                            :disabled="!isValid">
                        <i class="bi bi-check-circle"></i>
                        Véleményezés befejezése
                        <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `
};
