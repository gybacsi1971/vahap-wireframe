/**
 * VAHAP - F-0074 Döntési javaslat Tab
 * UCE-1826 - Döntési javaslat elkészítése
 * Érdemi döntés előkészítése
 * Használat: <vahap-tab-dontesi-javaslat :active="activeTab === 'dontesi-javaslat'" :ugy="ugy"></vahap-tab-dontesi-javaslat>
 */

const VahapTabDontesiJavaslat = {
    name: 'vahap-tab-dontesi-javaslat',
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
            // Döntési javaslat űrlap adatai
            formData: {
                dontesiTipus: '',
                jovahagyas: true,
                indoklas: '',
                jogszabaly: '',
                feltetelek: [],
                ertesitendo_felek: []
            },

            // Korábbi vizsgálatok összefoglalása
            vizsgalatokOsszefoglalo: {
                hataskor: { eredmeny: '', datum: '', megjegyzes: '' },
                formai: { eredmeny: '', datum: '', megjegyzes: '' },
                tartalmi: { eredmeny: '', datum: '', megjegyzes: '' },
                sommas: { eredmeny: '', datum: '', hataridoDatum: '' }
            },

            // Dokumentum sablon kiválasztás
            dokumentumSablon: {
                tipus: '',
                sablon_id: null
            },

            // Határidő információk
            hataridoInfo: {
                eljarasTipus: '',
                hataridoNap: 0,
                szamitottHatarido: '',
                maradekNap: 0
            },

            // Előfeltételek ellenőrzése
            elofeltetelekTeljesultek: false,
            hianyzoElofeltetelek: [],

            // Szerkesztési állapot
            saved: false,
            ellenorzoNeve: 'Dr. Szabó Péter',
            dontesDatum: new Date().toISOString().split('T')[0]
        };
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header mb-3">
                <h5 class="mb-2">
                    <span class="badge badge-uce">UCE-1826</span>
                    Döntési javaslat elkészítése
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0074</span>
                    Érdemi döntés: Döntési javaslat
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

            <!-- Korábbi vizsgálatok összefoglalása -->
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-clipboard-check"></i>
                    <strong>Korábbi vizsgálatok összefoglalása</strong>
                </div>
                <div class="card-body">
                    <div class="row">
                        <!-- Hatáskör -->
                        <div class="col-md-6 mb-3">
                            <div class="p-3 border rounded">
                                <h6 class="mb-2">
                                    <span class="badge bg-info">F-0064</span>
                                    Hatáskör vizsgálat
                                </h6>
                                <div class="mb-1">
                                    <strong>Eredmény:</strong>
                                    <span :class="{'text-success': vizsgalatokOsszefoglalo.hataskor.eredmeny === 'hatáskor_van', 'text-danger': vizsgalatokOsszefoglalo.hataskor.eredmeny !== 'hatáskor_van'}">
                                        {{ getHataskorText(vizsgalatokOsszefoglalo.hataskor.eredmeny) }}
                                    </span>
                                </div>
                                <div class="small text-muted">
                                    Dátum: {{ vizsgalatokOsszefoglalo.hataskor.datum }}
                                </div>
                                <div v-if="vizsgalatokOsszefoglalo.hataskor.megjegyzes" class="mt-2 small">
                                    <em>{{ vizsgalatokOsszefoglalo.hataskor.megjegyzes }}</em>
                                </div>
                            </div>
                        </div>

                        <!-- Formai -->
                        <div class="col-md-6 mb-3">
                            <div class="p-3 border rounded">
                                <h6 class="mb-2">
                                    <span class="badge bg-info">F-0065</span>
                                    Formai ellenőrzés
                                </h6>
                                <div class="mb-1">
                                    <strong>Eredmény:</strong>
                                    <span :class="{'text-success': vizsgalatokOsszefoglalo.formai.eredmeny === 'megfelel', 'text-danger': vizsgalatokOsszefoglalo.formai.eredmeny !== 'megfelel'}">
                                        {{ getFormaiText(vizsgalatokOsszefoglalo.formai.eredmeny) }}
                                    </span>
                                </div>
                                <div class="small text-muted">
                                    Dátum: {{ vizsgalatokOsszefoglalo.formai.datum }}
                                </div>
                                <div v-if="vizsgalatokOsszefoglalo.formai.megjegyzes" class="mt-2 small">
                                    <em>{{ vizsgalatokOsszefoglalo.formai.megjegyzes }}</em>
                                </div>
                            </div>
                        </div>

                        <!-- Tartalmi -->
                        <div class="col-md-6 mb-3">
                            <div class="p-3 border rounded">
                                <h6 class="mb-2">
                                    <span class="badge bg-info">F-0066</span>
                                    Tartalmi ellenőrzés
                                </h6>
                                <div class="mb-1">
                                    <strong>Eredmény:</strong>
                                    <span :class="{'text-success': vizsgalatokOsszefoglalo.tartalmi.eredmeny === 'megfelel', 'text-danger': vizsgalatokOsszefoglalo.tartalmi.eredmeny !== 'megfelel'}">
                                        {{ getTartalmiText(vizsgalatokOsszefoglalo.tartalmi.eredmeny) }}
                                    </span>
                                </div>
                                <div class="small text-muted">
                                    Dátum: {{ vizsgalatokOsszefoglalo.tartalmi.datum }}
                                </div>
                                <div v-if="vizsgalatokOsszefoglalo.tartalmi.megjegyzes" class="mt-2 small">
                                    <em>{{ vizsgalatokOsszefoglalo.tartalmi.megjegyzes }}</em>
                                </div>
                            </div>
                        </div>

                        <!-- Sommás eljárás -->
                        <div class="col-md-6 mb-3">
                            <div class="p-3 border rounded">
                                <h6 class="mb-2">
                                    <span class="badge bg-info">F-0088</span>
                                    Sommás eljárás
                                </h6>
                                <div class="mb-1">
                                    <strong>Döntés:</strong>
                                    <span :class="{'text-success': vizsgalatokOsszefoglalo.sommas.eredmeny === 'sommas_8nap'}">
                                        {{ getSommasText(vizsgalatokOsszefoglalo.sommas.eredmeny) }}
                                    </span>
                                </div>
                                <div class="small text-muted">
                                    Dátum: {{ vizsgalatokOsszefoglalo.sommas.datum }}
                                </div>
                                <div v-if="vizsgalatokOsszefoglalo.sommas.hataridoDatum" class="mt-2">
                                    <span class="badge bg-warning text-dark">
                                        <i class="bi bi-calendar-event"></i>
                                        Határidő: {{ vizsgalatokOsszefoglalo.sommas.hataridoDatum }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Határidő információk -->
                    <div class="alert alert-info mb-0 mt-2">
                        <i class="bi bi-clock-history"></i>
                        <strong>Határidő információk:</strong><br>
                        Eljárás típusa: {{ hataridoInfo.eljarasTipus }}<br>
                        Számított határidő: {{ hataridoInfo.szamitottHatarido }}<br>
                        <span :class="{'text-danger': hataridoInfo.maradekNap < 3, 'text-warning': hataridoInfo.maradekNap >= 3 && hataridoInfo.maradekNap < 5}">
                            Hátralévő napok: {{ hataridoInfo.maradekNap }} munkanap
                        </span>
                    </div>
                </div>
            </div>

            <!-- Döntési javaslat űrlap -->
            <div class="card mb-3">
                <div class="card-header bg-success text-white">
                    <i class="bi bi-file-earmark-text"></i>
                    <strong>Döntési javaslat</strong>
                </div>
                <div class="card-body">

                    <!-- Döntés típusa -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-check-circle"></i>
                            Javasolt döntés típusa <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="formData.dontesiTipus" @change="onDontesiTipusChange">
                            <option value="">-- Válasszon döntési típust --</option>
                            <optgroup label="Jóváhagyó döntések">
                                <option value="engedelyezo_vegzes">Engedélyező végzés (F-0091)</option>
                                <option value="engedelyezo_hatarozat">Engedélyező határozat (F-0092)</option>
                                <option value="alkalmasság_igazolas">Alkalmassági igazolás (F-0093)</option>
                            </optgroup>
                            <optgroup label="Elutasító döntések">
                                <option value="elutasito_hatarozat">Elutasító határozat (F-0092)</option>
                                <option value="elutasito_vegzes">Elutasító végzés (F-0091)</option>
                            </optgroup>
                            <optgroup label="Egyéb döntések">
                                <option value="hianypotlas">Hiánypótlási felszólítás (F-0100)</option>
                                <option value="tenyallas_tisztazas">Tényállás tisztázása (F-0102)</option>
                            </optgroup>
                        </select>
                        <div class="form-text">
                            Válassza ki a javasolt döntés típusát a vizsgálatok eredményei alapján
                        </div>
                    </div>

                    <!-- Döntés jellege -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            Döntés jellege
                        </label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" v-model="formData.jovahagyas" :value="true" id="jovahagyo">
                            <label class="form-check-label" for="jovahagyo">
                                <i class="bi bi-check-circle text-success"></i> Jóváhagyó
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" v-model="formData.jovahagyas" :value="false" id="elutasito">
                            <label class="form-check-label" for="elutasito">
                                <i class="bi bi-x-circle text-danger"></i> Elutasító / Egyéb
                            </label>
                        </div>
                    </div>

                    <!-- Indoklás -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-chat-left-text"></i>
                            Döntési javaslat indoklása <span class="text-danger">*</span>
                        </label>
                        <textarea class="form-control" rows="8" v-model="formData.indoklas"
                                  placeholder="Részletes indoklás a javasolt döntéshez...

Példa struktúra:
1. Vizsgálatok eredményének összefoglalása
2. Jogszabályi megfelelőség értékelése
3. Javasolt döntés indoklása
4. Előírások, feltételek (ha vannak)
5. További intézkedések szükségessége"></textarea>
                        <div class="form-text">
                            Minimum 100 karakter szükséges (jelenlegi: {{ formData.indoklas.length }})
                        </div>
                    </div>

                    <!-- Jogszabályi hivatkozás -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-book"></i>
                            Jogszabályi hivatkozások <span class="text-danger">*</span>
                        </label>
                        <textarea class="form-control" rows="4" v-model="formData.jogszabaly"
                                  placeholder="Jogszabályi hivatkozások...

Példa:
- 2005. évi CLXXXIII. törvény a vasúti közlekedésről 43. § (1) bekezdés
- 123/2023. (XII. 15.) Korm. rendelet 15. § (2) bekezdés
- ..."></textarea>
                        <div class="form-text">
                            Adja meg a releváns jogszabályokat és paragrafusokat
                        </div>
                    </div>

                    <!-- Feltételek (opcionális) -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-list-check"></i>
                            Feltételek és előírások (opcionális)
                        </label>
                        <div class="input-group mb-2" v-for="(feltetel, index) in formData.feltetelek" :key="index">
                            <input type="text" class="form-control" v-model="formData.feltetelek[index]"
                                   placeholder="Feltétel vagy előírás szövege">
                            <button class="btn btn-outline-danger" type="button" @click="removeFeltetel(index)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        <button class="btn btn-sm btn-outline-secondary" @click="addFeltetel">
                            <i class="bi bi-plus-circle"></i> Feltétel hozzáadása
                        </button>
                        <div class="form-text">
                            Például: éves jelentéstételi kötelezettség, biztonsági felülvizsgálat, stb.
                        </div>
                    </div>

                    <!-- Értesítendő felek -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-people"></i>
                            Értesítendő felek és szervezetek
                        </label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="ugyfel" v-model="formData.ertesitendo_felek" id="ertUgyfel">
                            <label class="form-check-label" for="ertUgyfel">Ügyfél</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="mav" v-model="formData.ertesitendo_felek" id="ertMav">
                            <label class="form-check-label" for="ertMav">MÁV-START Zrt.</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="nkh" v-model="formData.ertesitendo_felek" id="ertNkh">
                            <label class="form-check-label" for="ertNkh">Nemzeti Közlekedési Hatóság</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="forrás" v-model="formData.ertesitendo_felek" id="ertForras">
                            <label class="form-check-label" for="ertForras">FORRÁS rendszer</label>
                        </div>
                    </div>

                    <!-- Dokumentum sablon választás -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-file-earmark-pdf"></i>
                            Dokumentum sablon kiválasztása
                        </label>
                        <select class="form-select" v-model="dokumentumSablon.sablon_id">
                            <option value="">-- Válasszon sablont --</option>
                            <option v-if="formData.dontesiTipus === 'engedelyezo_vegzes'" value="VGZ-001">Engedélyező végzés - Alapértelmezett sablon</option>
                            <option v-if="formData.dontesiTipus === 'engedelyezo_hatarozat'" value="HTR-001">Engedélyező határozat - Alapértelmezett sablon</option>
                            <option v-if="formData.dontesiTipus === 'alkalmasság_igazolas'" value="IGZ-001">Alkalmassági igazolás - Alapértelmezett sablon</option>
                            <option v-if="formData.dontesiTipus === 'elutasito_hatarozat'" value="HTR-002">Elutasító határozat - Alapértelmezett sablon</option>
                        </select>
                        <div class="form-text">
                            A kiválasztott sablon alapján fog elkészülni a döntési dokumentum tervezete
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ellenőrzési adatok -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong>Ellenőrzési adatok</strong>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Ügyintéző neve</label>
                            <input type="text" class="form-control" v-model="ellenorzoNeve" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Döntés dátuma</label>
                            <input type="date" class="form-control" v-model="dontesDatum">
                        </div>
                    </div>
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
                <div>
                    <button class="btn btn-outline-primary me-2" @click="generatePreview" :disabled="!isValid">
                        <i class="bi bi-eye"></i> Előnézet
                    </button>
                    <button class="btn btn-success" @click="save" :disabled="!isValid || !elofeltetelekTeljesultek">
                        <i class="bi bi-check-circle"></i> Döntési javaslat rögzítése
                    </button>
                </div>
            </div>

            <!-- Sikeres mentés üzenet -->
            <div v-if="saved" class="alert alert-success mt-3">
                <i class="bi bi-check-circle-fill"></i>
                Döntési javaslat sikeresen rögzítve! A vezetői döntés lépésre továbbküldve.
            </div>
        </div>
    `,
    computed: {
        // Validáció
        isValid() {
            return this.formData.dontesiTipus &&
                   this.formData.indoklas.trim().length >= 100 &&
                   this.formData.jogszabaly.trim().length >= 20;
        },

        // Progress
        progressPercent() {
            let score = 0;
            let total = 5;

            if (this.formData.dontesiTipus) score++;
            if (this.formData.indoklas.length >= 100) score++;
            if (this.formData.jogszabaly.length >= 20) score++;
            if (this.formData.ertesitendo_felek.length > 0) score++;
            if (this.dokumentumSablon.sablon_id) score++;

            return Math.round((score / total) * 100);
        },

        progressBarClass() {
            if (this.progressPercent < 50) return 'bg-danger';
            if (this.progressPercent < 80) return 'bg-warning';
            return 'bg-success';
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

    methods: {
        // Előfeltételek ellenőrzése
        checkPrerequisites() {
            this.hianyzoElofeltetelek = [];

            // Hatáskör vizsgálat
            if (!this.ugy.workflow_steps?.hatáskor || this.ugy.workflow_steps.hatáskor.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Hatáskör vizsgálat nem került befejezésre');
            } else if (this.ugy.hatáskor_data?.dontes !== 'hatáskor_van') {
                this.hianyzoElofeltetelek.push('Hatáskör vizsgálat eredménye: nincs hatáskör');
            }

            // Formai ellenőrzés
            if (!this.ugy.workflow_steps?.formai || this.ugy.workflow_steps.formai.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Formai ellenőrzés nem került befejezésre');
            } else if (this.ugy.formai_data?.dontes !== 'megfelel') {
                this.hianyzoElofeltetelek.push('Formai ellenőrzés eredménye: nem megfelelő');
            }

            // Tartalmi ellenőrzés
            if (!this.ugy.workflow_steps?.tartalmi || this.ugy.workflow_steps.tartalmi.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Tartalmi ellenőrzés nem került befejezésre');
            } else if (this.ugy.tartalmi_data?.dontes !== 'megfelel') {
                this.hianyzoElofeltetelek.push('Tartalmi ellenőrzés eredménye: nem megfelelő');
            }

            // Sommás döntés
            if (!this.ugy.workflow_steps?.sommas || this.ugy.workflow_steps.sommas.status !== 'completed') {
                this.hianyzoElofeltetelek.push('Sommás eljárás döntés nem került befejezésre');
            }

            this.elofeltetelekTeljesultek = this.hianyzoElofeltetelek.length === 0;
        },

        // Korábbi adatok betöltése
        loadPreviousData() {
            this.checkPrerequisites();

            // Vizsgálatok összefoglalása
            if (this.ugy.hatáskor_data) {
                this.vizsgalatokOsszefoglalo.hataskor = {
                    eredmeny: this.ugy.hatáskor_data.dontes || '',
                    datum: this.ugy.workflow_steps?.hatáskor?.datum || '',
                    megjegyzes: this.ugy.hatáskor_data.altalanosMegjegyzes || ''
                };
            }

            if (this.ugy.formai_data) {
                this.vizsgalatokOsszefoglalo.formai = {
                    eredmeny: this.ugy.formai_data.dontes || '',
                    datum: this.ugy.workflow_steps?.formai?.datum || '',
                    megjegyzes: this.ugy.formai_data.altalanosMegjegyzes || ''
                };
            }

            if (this.ugy.tartalmi_data) {
                this.vizsgalatokOsszefoglalo.tartalmi = {
                    eredmeny: this.ugy.tartalmi_data.dontes || '',
                    datum: this.ugy.workflow_steps?.tartalmi?.datum || '',
                    megjegyzes: this.ugy.tartalmi_data.altalanosMegjegyzes || ''
                };
            }

            if (this.ugy.sommas_data) {
                this.vizsgalatokOsszefoglalo.sommas = {
                    eredmeny: this.ugy.sommas_data.selectedOption || '',
                    datum: this.ugy.workflow_steps?.sommas?.datum || '',
                    hataridoDatum: this.ugy.sommas_data.hataridoDatum || ''
                };
            }

            // Határidő információk
            if (this.ugy.sommas_data) {
                this.hataridoInfo.eljarasTipus = this.ugy.sommas_data.selectedOption === 'sommas_8nap' ? 'Sommás (8 munkanap)' : 'Teljes (60 munkanap)';
                this.hataridoInfo.hataridoNap = this.ugy.sommas_data.hataridoNap || 0;
                this.hataridoInfo.szamitottHatarido = this.ugy.sommas_data.hataridoDatum || '';

                // Hátralévő munkanapok számítása
                if (this.ugy.sommas_data.hataridoDatum) {
                    const today = new Date();
                    const deadline = new Date(this.ugy.sommas_data.hataridoDatum);
                    let businessDays = 0;
                    let current = new Date(today);

                    while (current < deadline) {
                        current.setDate(current.getDate() + 1);
                        const dayOfWeek = current.getDay();
                        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                            businessDays++;
                        }
                    }

                    this.hataridoInfo.maradekNap = businessDays;
                }
            }

            // Mentett adatok betöltése (ha van)
            if (this.ugy.dontesi_javaslat_data) {
                this.formData = { ...this.ugy.dontesi_javaslat_data };
                this.dokumentumSablon = this.ugy.dontesi_javaslat_data.dokumentumSablon || { tipus: '', sablon_id: null };
            }

            console.log('[F-0074] Korábbi adatok betöltve', {
                vizsgalatok: this.vizsgalatokOsszefoglalo,
                hataridoInfo: this.hataridoInfo,
                elofeltetelekTeljesultek: this.elofeltetelekTeljesultek
            });
        },

        // Szöveg formázók
        getHataskorText(ertek) {
            const map = {
                'hatáskor_van': '✓ Hatáskör biztosított',
                'nincs_hataskor': '✗ Nincs hatáskör',
                'illetekesseg_nincs': '✗ Nincs illetékesség'
            };
            return map[ertek] || 'Nincs adat';
        },

        getFormaiText(ertek) {
            const map = {
                'megfelel': '✓ Megfelel',
                'hianypotlas': '△ Hiánypótlás szükséges',
                'elutasitas': '✗ Elutasítandó'
            };
            return map[ertek] || 'Nincs adat';
        },

        getTartalmiText(ertek) {
            const map = {
                'megfelel': '✓ Megfelel',
                'hianypotlas': '△ Hiánypótlás szükséges',
                'tenyallas': '△ Tényállás tisztázása',
                'elutasitas': '✗ Elutasítandó'
            };
            return map[ertek] || 'Nincs adat';
        },

        getSommasText(ertek) {
            const map = {
                'sommas_8nap': 'Sommás eljárás (8 munkanap)',
                'teljes_60nap': 'Teljes eljárás (60 munkanap)'
            };
            return map[ertek] || 'Nincs adat';
        },

        // Döntési típus változás
        onDontesiTipusChange() {
            // Döntés jellege automatikus beállítása
            if (['engedelyezo_vegzes', 'engedelyezo_hatarozat', 'alkalmasság_igazolas'].includes(this.formData.dontesiTipus)) {
                this.formData.jovahagyas = true;
            } else if (['elutasito_hatarozat', 'elutasito_vegzes'].includes(this.formData.dontesiTipus)) {
                this.formData.jovahagyas = false;
            }

            // Dokumentum típus beállítása
            this.dokumentumSablon.tipus = this.formData.dontesiTipus;

            console.log('[F-0074] Döntési típus megváltozott:', this.formData.dontesiTipus);
        },

        // Feltétel hozzáadása
        addFeltetel() {
            this.formData.feltetelek.push('');
        },

        // Feltétel eltávolítása
        removeFeltetel(index) {
            this.formData.feltetelek.splice(index, 1);
        },

        // Előnézet generálás
        generatePreview() {
            console.log('[F-0074] Döntési javaslat előnézet generálása', {
                formData: this.formData,
                vizsgalatok: this.vizsgalatokOsszefoglalo,
                dokumentumSablon: this.dokumentumSablon
            });

            alert('Döntési javaslat előnézet:\n\n' +
                  'Döntés típusa: ' + this.formData.dontesiTipus + '\n' +
                  'Indoklás hossza: ' + this.formData.indoklas.length + ' karakter\n' +
                  'Jogszabályi hivatkozások: ' + (this.formData.jogszabaly.length > 0 ? 'Megadva' : 'Hiányzik') + '\n' +
                  'Értesítendő felek: ' + this.formData.ertesitendo_felek.length + ' db\n' +
                  'Feltételek: ' + this.formData.feltetelek.length + ' db');
        },

        // Mentés
        save() {
            if (!this.isValid || !this.elofeltetelekTeljesultek) {
                alert('Kérjük töltse ki az összes kötelező mezőt, és biztosítsa, hogy az előfeltételek teljesülnek!');
                return;
            }

            // F-0074 - Döntési javaslat rögzítése
            const javaslatData = {
                ...this.formData,
                dokumentumSablon: this.dokumentumSablon,
                ellenorzoNeve: this.ellenorzoNeve,
                dontesDatum: this.dontesDatum,
                dontesIdopontja: new Date().toISOString(),
                vizsgalatokOsszefoglalo: this.vizsgalatokOsszefoglalo,
                hataridoInfo: this.hataridoInfo
            };

            console.log('[F-0074] UCE-1826 - Döntési javaslat rögzítve', javaslatData);

            this.$emit('save', {
                tab: 'dontesi-javaslat',
                data: javaslatData,
                funkcio: 'F-0074',
                uce: 'UCE-1826'
            });

            this.$emit('update', {
                'dontesi-javaslat': {
                    status: 'completed',
                    datum: this.dontesDatum,
                    ugyintezo: this.ellenorzoNeve,
                    dontesiTipus: this.formData.dontesiTipus
                }
            });

            this.saved = true;

            // 3 másodperc után automatikus továbbküldés a vezetői döntéshez
            setTimeout(() => {
                this.$emit('next', 'vezetoi-dontes');
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
        console.log('[F-0074] Döntési javaslat komponens betöltve');
        if (this.ugy && Object.keys(this.ugy).length > 0) {
            this.loadPreviousData();
        }
    }
};
