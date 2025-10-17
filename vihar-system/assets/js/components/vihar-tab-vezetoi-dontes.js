/**
 * VAHAP - F-0099 Érdemi döntés: Vezetői döntés Tab
 * UCE-1828 - Vezetői jóváhagyási workflow
 * Használat: <vahap-tab-vezetoi-dontes :active="activeTab === 'vezetoi-dontes'" :ugy="ugy"></vahap-tab-vezetoi-dontes>
 */

const VahapTabVezetoiDontes = {
    name: 'vahap-tab-vezetoi-dontes',
    emits: ['save', 'update', 'next', 'cancel'],
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
            // Vezetői döntés űrlap adatai
            formData: {
                dontesiTipus: '', // jovahagyas, elutasitas, modositas
                indoklas: '',
                modositasok: [],
                megjegyzesek: ''
            },

            // Vezető adatai
            vezetoAdatok: {
                nev: 'Dr. Nagy Andrea',
                beosztas: 'Főosztályvezető',
                szervezet: 'Építési és Közlekedési Minisztérium',
                szervezetiEgyseg: 'Vasúti Hatósági Főosztály'
            },

            // Döntési javaslat betöltött adatai
            dontesiJavaslat: {
                dontesiTipus: '',
                indoklas: '',
                jogszabaly: '',
                feltetelek: [],
                ertesitendo_felek: [],
                dokumentumSablon: {},
                datum: '',
                ugyintezo: ''
            },

            // Korábbi vizsgálatok összefoglalása
            vizsgalatokOsszefoglalo: {
                hataskor: { eredmeny: '', datum: '' },
                formai: { eredmeny: '', datum: '' },
                tartalmi: { eredmeny: '', datum: '' },
                sommas: { eredmeny: '', datum: '', hataridoDatum: '' }
            },

            // Előfeltételek
            elofeltetelekTeljesultek: false,
            hianyzoElofeltetelek: [],

            // Státusz
            processing: false,
            saved: false,
            dontesDatum: new Date().toISOString().split('T')[0]
        };
    },
    computed: {
        // Validáció
        isValid() {
            if (!this.formData.dontesiTipus) return false;

            if (this.formData.dontesiTipus === 'elutasitas') {
                return this.formData.indoklas.trim().length >= 50;
            }

            if (this.formData.dontesiTipus === 'modositas') {
                return this.formData.indoklas.trim().length >= 50 &&
                       this.formData.modositasok.length > 0;
            }

            // Jóváhagyás esetén nem kell indoklás
            return true;
        },

        // Progress
        progressPercent() {
            let score = 0;
            let total = 3;

            if (this.formData.dontesiTipus) score++;

            if (this.formData.dontesiTipus === 'jovahagyas') {
                score += 2; // Jóváhagyásnál nincs több követelmény
            } else if (this.formData.dontesiTipus === 'elutasitas') {
                if (this.formData.indoklas.length >= 50) score += 2;
            } else if (this.formData.dontesiTipus === 'modositas') {
                if (this.formData.indoklas.length >= 50) score++;
                if (this.formData.modositasok.length > 0) score++;
            }

            return Math.round((score / total) * 100);
        },

        progressBarClass() {
            if (this.progressPercent < 50) return 'bg-danger';
            if (this.progressPercent < 80) return 'bg-warning';
            return 'bg-success';
        },

        // Döntési javaslat típus szövege
        dontesiJavaslatTipusText() {
            const map = {
                'engedelyezo_vegzes': 'Engedélyező végzés',
                'engedelyezo_hatarozat': 'Engedélyező határozat',
                'alkalmasság_igazolas': 'Alkalmassági igazolás',
                'elutasito_hatarozat': 'Elutasító határozat',
                'elutasito_vegzes': 'Elutasító végzés'
            };
            return map[this.dontesiJavaslat.dontesiTipus] || this.dontesiJavaslat.dontesiTipus;
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
                    Érdemi döntés: Vezetői döntés
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0099</span>
                    Döntési javaslat vezetői jóváhagyása vagy elutasítása
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

            <!-- Sikeres mentés üzenet -->
            <div v-if="saved" class="alert alert-success alert-dismissible fade show">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Vezetői döntés rögzítve!</strong><br>
                <small>Döntés típusa: {{ getDontesiTipusText(formData.dontesiTipus) }}</small><br>
                <small>Vezető: {{ vezetoAdatok.nev }} - {{ vezetoAdatok.beosztas }}</small>
                <button type="button" class="btn-close" @click="saved = false"></button>
            </div>

            <!-- Döntési javaslat összefoglalója -->
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-file-earmark-text"></i> Döntési javaslat összefoglalója
                    <span class="badge bg-light text-dark ms-2">F-0074</span>
                </div>
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Ügyazonosító:</strong> {{ ugy.ugyazonosito }}</p>
                            <p class="mb-1"><strong>Ügyintéző:</strong> {{ dontesiJavaslat.ugyintezo }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Javaslat dátuma:</strong> {{ dontesiJavaslat.datum }}</p>
                            <p class="mb-1">
                                <strong>Státusz:</strong>
                                <span class="badge bg-warning">Vezetői jóváhagyásra vár</span>
                            </p>
                        </div>
                    </div>
                    <hr>
                    <div class="mb-2">
                        <strong>Javasolt döntés típusa:</strong>
                        <span class="badge bg-success ms-2">{{ dontesiJavaslatTipusText }}</span>
                    </div>
                    <div class="mb-2">
                        <strong>Indoklás:</strong>
                        <p class="text-muted mb-0">{{ dontesiJavaslat.indoklas || 'Nincs adat' }}</p>
                    </div>
                    <div class="mb-2">
                        <strong>Jogszabályi hivatkozás:</strong>
                        <p class="text-muted mb-0">{{ dontesiJavaslat.jogszabaly || 'Nincs adat' }}</p>
                    </div>
                    <div class="mb-0" v-if="vizsgalatokOsszefoglalo.sommas.hataridoDatum">
                        <strong>Határidő:</strong> {{ vizsgalatokOsszefoglalo.sommas.hataridoDatum }}
                    </div>
                </div>
            </div>

            <!-- Vezető adatai -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-person-badge"></i> Vezető adatai
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Vezető neve</label>
                            <input type="text"
                                   class="form-control"
                                   v-model="vezetoAdatok.nev"
                                   readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Beosztás</label>
                            <input type="text"
                                   class="form-control"
                                   v-model="vezetoAdatok.beosztas"
                                   readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vezetői döntés -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-clipboard-check"></i> Vezetői döntés <span class="text-danger">*</span>
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        <!-- Jóváhagyás -->
                        <div class="col-md-4">
                            <input type="radio"
                                   class="btn-check"
                                   id="dontes-jovahagyas"
                                   v-model="formData.dontesiTipus"
                                   value="jovahagyas"
                                   autocomplete="off"
                                   @change="onDontesiTipusChange">
                            <label class="btn btn-outline-success w-100 h-100 d-flex flex-column justify-content-center"
                                   for="dontes-jovahagyas">
                                <i class="bi bi-check-circle" style="font-size: 2rem;"></i>
                                <strong class="mt-2">Jóváhagyás</strong>
                                <small class="text-muted">Döntési javaslat jóváhagyása</small>
                            </label>
                        </div>

                        <!-- Elutasítás -->
                        <div class="col-md-4">
                            <input type="radio"
                                   class="btn-check"
                                   id="dontes-elutasitas"
                                   v-model="formData.dontesiTipus"
                                   value="elutasitas"
                                   autocomplete="off"
                                   @change="onDontesiTipusChange">
                            <label class="btn btn-outline-danger w-100 h-100 d-flex flex-column justify-content-center"
                                   for="dontes-elutasitas">
                                <i class="bi bi-x-circle" style="font-size: 2rem;"></i>
                                <strong class="mt-2">Elutasítás</strong>
                                <small class="text-muted">Visszaküldés módosításra</small>
                            </label>
                        </div>

                        <!-- Módosítás -->
                        <div class="col-md-4">
                            <input type="radio"
                                   class="btn-check"
                                   id="dontes-modositas"
                                   v-model="formData.dontesiTipus"
                                   value="modositas"
                                   autocomplete="off"
                                   @change="onDontesiTipusChange">
                            <label class="btn btn-outline-warning w-100 h-100 d-flex flex-column justify-content-center"
                                   for="dontes-modositas">
                                <i class="bi bi-pencil-square" style="font-size: 2rem;"></i>
                                <strong class="mt-2">Módosítással jóváhagy</strong>
                                <small class="text-muted">Módosításokkal együtt jóváhagy</small>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Indoklás (elutasítás vagy módosítás esetén) -->
            <div v-if="formData.dontesiTipus === 'elutasitas' || formData.dontesiTipus === 'modositas'" class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-chat-left-text"></i> Indoklás <span class="text-danger">*</span>
                </div>
                <div class="card-body">
                    <label class="form-label">
                        {{ formData.dontesiTipus === 'elutasitas' ? 'Elutasítás indoklása' : 'Módosítás indoklása' }}
                        <span class="badge bg-secondary ms-2">{{ formData.indoklas.length }} / min. 50 karakter</span>
                    </label>
                    <textarea class="form-control"
                              v-model="formData.indoklas"
                              rows="4"
                              :placeholder="formData.dontesiTipus === 'elutasitas' ?
                                  'Adja meg az elutasítás indokát (minimum 50 karakter)...' :
                                  'Adja meg a módosítás szükségességének indokát (minimum 50 karakter)...'"
                              :class="{ 'is-invalid': formData.indoklas.length > 0 && formData.indoklas.length < 50 }"></textarea>
                    <div class="invalid-feedback">
                        Az indoklás legalább 50 karakter hosszú legyen
                    </div>
                </div>
            </div>

            <!-- Kért módosítások részletezése -->
            <div v-if="formData.dontesiTipus === 'modositas'" class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-list-check"></i> Módosítások részletezése <span class="text-danger">*</span>
                </div>
                <div class="card-body">
                    <p class="form-label fw-bold">Kért módosítások:</p>
                    <div class="input-group mb-2" v-for="(mod, index) in formData.modositasok" :key="index">
                        <input type="text" class="form-control" v-model="mod.leiras"
                               placeholder="Módosítás leírása...">
                        <button class="btn btn-outline-danger" type="button" @click="removeModositas(index)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary" @click="addModositas">
                        <i class="bi bi-plus-circle"></i> Módosítás hozzáadása
                    </button>
                    <div class="form-text mt-2">
                        Példa: "A határozat rendelkező részében javítandó a szakmai végzettség pontos megnevezése..."
                    </div>
                </div>
            </div>

            <!-- Jóváhagyás megerősítése (jóváhagyás esetén) -->
            <div v-if="formData.dontesiTipus === 'jovahagyas'" class="card mb-3 border-success">
                <div class="card-header bg-success text-white">
                    <i class="bi bi-info-circle"></i> Jóváhagyás megerősítése
                </div>
                <div class="card-body">
                    <p class="mb-2">
                        <i class="bi bi-check-circle text-success"></i>
                        A döntési javaslat jóváhagyásával a következő történik:
                    </p>
                    <ul class="mb-0">
                        <li>A döntés véglegesítésre kerül</li>
                        <li>A dokumentum kiadmányozható lesz</li>
                        <li>Az ügyfél értesítést kap</li>
                        <li>Az ügy következő szakaszba kerül</li>
                    </ul>
                </div>
            </div>

            <!-- Progress bar -->
            <div class="mb-3">
                <label class="form-label small">Kitöltöttség: {{ progressPercent }}%</label>
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
                <button class="btn btn-lg"
                        :class="{
                            'btn-success': formData.dontesiTipus === 'jovahagyas',
                            'btn-danger': formData.dontesiTipus === 'elutasitas',
                            'btn-warning': formData.dontesiTipus === 'modositas',
                            'btn-secondary': !formData.dontesiTipus
                        }"
                        @click="save"
                        :disabled="!isValid || !elofeltetelekTeljesultek || processing">
                    <span v-if="processing">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Feldolgozás...
                    </span>
                    <span v-else>
                        <i class="bi" :class="{
                            'bi-check-circle-fill': formData.dontesiTipus === 'jovahagyas',
                            'bi-x-circle-fill': formData.dontesiTipus === 'elutasitas',
                            'bi-pencil-fill': formData.dontesiTipus === 'modositas'
                        }"></i>
                        {{ formData.dontesiTipus === 'jovahagyas' ? 'Jóváhagyom' :
                           formData.dontesiTipus === 'elutasitas' ? 'Elutasítom' :
                           formData.dontesiTipus === 'modositas' ? 'Módosítással jóváhagyom' :
                           'Vezetői döntés rögzítése' }}
                    </span>
                </button>
            </div>

        </div>
    `,
    methods: {
        // Előfeltételek ellenőrzése
        checkPrerequisites() {
            this.hianyzoElofeltetelek = [];

            // Döntési javaslat kell legyen elkészítve
            if (!this.ugy.workflow_steps?.['dontesi-javaslat'] ||
                this.ugy.workflow_steps['dontesi-javaslat'].status !== 'completed') {
                this.hianyzoElofeltetelek.push('Döntési javaslat nem került elkészítésre');
            }

            // Hatáskör, formai, tartalmi, sommás mind completed kell legyen
            if (!this.ugy.workflow_steps?.hatáskor || this.ugy.workflow_steps.hatáskor.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Hatáskör vizsgálat nincs befejezve');
            }

            if (!this.ugy.workflow_steps?.formai || this.ugy.workflow_steps.formai.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Formai ellenőrzés nincs befejezve');
            }

            if (!this.ugy.workflow_steps?.tartalmi || this.ugy.workflow_steps.tartalmi.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Tartalmi ellenőrzés nincs befejezve');
            }

            if (!this.ugy.workflow_steps?.sommas || this.ugy.workflow_steps.sommas.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Sommás eljárás döntés nincs befejezve');
            }

            this.elofeltetelekTeljesultek = this.hianyzoElofeltetelek.length === 0;
        },

        // Korábbi adatok betöltése
        loadPreviousData() {
            this.checkPrerequisites();

            // Döntési javaslat adatainak betöltése
            if (this.ugy.dontesi_javaslat_data) {
                this.dontesiJavaslat = {
                    dontesiTipus: this.ugy.dontesi_javaslat_data.dontesiTipus || '',
                    indoklas: this.ugy.dontesi_javaslat_data.indoklas || '',
                    jogszabaly: this.ugy.dontesi_javaslat_data.jogszabaly || '',
                    feltetelek: this.ugy.dontesi_javaslat_data.feltetelek || [],
                    ertesitendo_felek: this.ugy.dontesi_javaslat_data.ertesitendo_felek || [],
                    dokumentumSablon: this.ugy.dontesi_javaslat_data.dokumentumSablon || {},
                    datum: this.ugy.workflow_steps?.['dontesi-javaslat']?.datum || '',
                    ugyintezo: this.ugy.workflow_steps?.['dontesi-javaslat']?.ugyintezo || ''
                };
            }

            // Vizsgálatok összefoglalása
            if (this.ugy.hatáskor_data) {
                this.vizsgalatokOsszefoglalo.hataskor = {
                    eredmeny: this.ugy.hatáskor_data.dontes || '',
                    datum: this.ugy.workflow_steps?.hatáskor?.datum || ''
                };
            }

            if (this.ugy.formai_data) {
                this.vizsgalatokOsszefoglalo.formai = {
                    eredmeny: this.ugy.formai_data.dontes || '',
                    datum: this.ugy.workflow_steps?.formai?.datum || ''
                };
            }

            if (this.ugy.tartalmi_data) {
                this.vizsgalatokOsszefoglalo.tartalmi = {
                    eredmeny: this.ugy.tartalmi_data.dontes || '',
                    datum: this.ugy.workflow_steps?.tartalmi?.datum || ''
                };
            }

            if (this.ugy.sommas_data) {
                this.vizsgalatokOsszefoglalo.sommas = {
                    eredmeny: this.ugy.sommas_data.selectedOption || '',
                    datum: this.ugy.workflow_steps?.sommas?.datum || '',
                    hataridoDatum: this.ugy.sommas_data.hataridoDatum || ''
                };
            }

            // Mentett vezetői döntés betöltése (ha van)
            if (this.ugy.vezetoi_dontes_data) {
                this.formData = { ...this.ugy.vezetoi_dontes_data };
            }

            console.log('[F-0099] Korábbi adatok betöltve', {
                dontesiJavaslat: this.dontesiJavaslat,
                vizsgalatok: this.vizsgalatokOsszefoglalo,
                elofeltetelekTeljesultek: this.elofeltetelekTeljesultek
            });
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

        // Módosítás hozzáadása
        addModositas() {
            this.formData.modositasok.push({
                id: Date.now(),
                leiras: '',
                prioritas: 'normal'
            });
        },

        // Módosítás eltávolítása
        removeModositas(index) {
            this.formData.modositasok.splice(index, 1);
        },

        // Döntési típus változás
        onDontesiTipusChange() {
            // Tisztítás típus változáskor
            if (this.formData.dontesiTipus === 'jovahagyas') {
                this.formData.indoklas = '';
                this.formData.modositasok = [];
            } else if (this.formData.dontesiTipus === 'elutasitas') {
                this.formData.modositasok = [];
            }

            console.log('[F-0099] Döntési típus megváltozott:', this.formData.dontesiTipus);
        },

        // Mentés
        save() {
            if (!this.isValid || !this.elofeltetelekTeljesultek) {
                alert('Kérjük töltse ki az összes kötelező mezőt, és biztosítsa, hogy az előfeltételek teljesülnek!');
                return;
            }

            this.processing = true;

            // Szimuláljuk a feldolgozást
            setTimeout(() => {
                // F-0099 - Vezetői döntés rögzítése
                const vezetoiDontesData = {
                    ...this.formData,
                    vezetoAdatok: this.vezetoAdatok,
                    dontesDatum: this.dontesDatum,
                    dontesIdopontja: new Date().toISOString(),
                    dontesiJavaslat: this.dontesiJavaslat
                };

                console.log('[F-0099] UCE-1828 - Vezetői döntés rögzítve', vezetoiDontesData);

                this.$emit('save', {
                    tab: 'vezetoi-dontes',
                    data: vezetoiDontesData,
                    funkcio: 'F-0099',
                    uce: 'UCE-1828'
                });

                this.$emit('update', {
                    'vezetoi-dontes': {
                        status: 'completed',
                        datum: this.dontesDatum,
                        vezeto: this.vezetoAdatok.nev,
                        dontesiTipus: this.formData.dontesiTipus
                    }
                });

                this.processing = false;
                this.saved = true;

                // 3 másodperc után automatikus továbbküldés
                setTimeout(() => {
                    if (this.formData.dontesiTipus === 'jovahagyas') {
                        this.$emit('next', 'lezaras');
                    } else if (this.formData.dontesiTipus === 'elutasitas') {
                        this.$emit('next', 'dontesi-javaslat');
                    } else if (this.formData.dontesiTipus === 'modositas') {
                        this.$emit('next', 'dontesi-javaslat');
                    }
                }, 3000);
            }, 2000);
        },

        // Mégse
        cancel() {
            if (confirm('Biztosan elveti a módosításokat?')) {
                this.loadPreviousData();
                this.$emit('cancel');
            }
        },

        // Form visszaállítása
        resetForm() {
            this.formData = {
                dontesiTipus: '',
                indoklas: '',
                modositasok: [],
                megjegyzesek: ''
            };
        }
    },

    mounted() {
        console.log('[F-0099] Vezetői döntés komponens betöltve');
        if (this.ugy && Object.keys(this.ugy).length > 0) {
            this.loadPreviousData();
        }
    }
};
