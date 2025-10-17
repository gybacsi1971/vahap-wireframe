/**
 * VAHAP - F-0100 Hiánypótlási felszólítás Tab
 * UCE-2000 - Hiánypótlási felszólítás összeállítása
 * Használat: <vahap-tab-hianypotlas :active="activeTab === 'hianypotlas'" :ugy="ugy"></vahap-tab-hianypotlas>
 */

const VahapTabHianypotlas = {
    name: 'vahap-tab-hianypotlas',
    emits: ['generated'],
    props: {
        active: {
            type: Boolean,
            default: false
        },
        felvezeto_tab: {
            type: String,
            default: 'formai' // melyik tab-ból érkeztünk (formai/tartalmi)
        },
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            felszolitas: {
                hivatkozas: '',
                hatarido: null,
                hianyossagok: [],
                peldany_szam: 2,
                mellekletek: [],
                indoklas: '',
                jogszabaly: '2004. évi CXL. törvény 37. § (1) bekezdés',
                statusz: 'draft',
                kor_szama: 1 // ⭐ Többkörös hiánypótlás
            },
            ujHianyossag: '',
            generatingPDF: false,
            maxKorok: 3 // UCE-1882: Maximum 3 kör
        };
    },
    mounted() {
        // Betöltjük a meglévő hiánypótlási körök adatait
        if (this.ugy.hianypotlas_korok && this.ugy.hianypotlas_korok.length > 0) {
            this.felszolitas.kor_szama = this.ugy.hianypotlas_aktualis_kor || this.ugy.hianypotlas_korok.length + 1;
        }
    },
    computed: {
        minimalisHatarido() {
            const ma = new Date();
            ma.setDate(ma.getDate() + 8); // minimum 8 nap
            return ma.toISOString().split('T')[0];
        },
        maximalisHatarido() {
            const ma = new Date();
            ma.setDate(ma.getDate() + 30); // maximum 30 nap
            return ma.toISOString().split('T')[0];
        },
        isValid() {
            return this.felszolitas.hatarido &&
                   this.felszolitas.hianyossagok.length > 0 &&
                   this.felszolitas.indoklas.length > 10;
        },
        korokListaja() {
            // ⭐ Meglévő hiánypótlási körök listája
            return this.ugy.hianypotlas_korok || [];
        },
        megengedettUjKor() {
            // UCE-1882: Lehet-e még újabb kört indítani?
            return this.korokListaja.length < this.maxKorok;
        }
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <span class="badge badge-uce">UCE-1871</span>
                    Hiánypótlási felszólítás összeállítása
                    <span v-if="korokListaja.length > 0" class="badge bg-warning ms-2">
                        {{ felszolitas.kor_szama }}. kör
                    </span>
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0100</span>
                    Hiánypótlási felszólítás dokumentum előkészítése és generálása
                    <span v-if="!megengedettUjKor" class="text-danger ms-2">
                        <i class="bi bi-exclamation-circle"></i> Maximum {{ maxKorok }} kör engedélyezett
                    </span>
                </p>
            </div>

            <!-- ⭐ TÖBBKÖRÖS HIÁNYPÓTLÁS ELŐZMÉNYEK -->
            <div v-if="korokListaja.length > 0" class="card mb-3 border-warning">
                <div class="card-header bg-warning text-dark">
                    <strong><i class="bi bi-arrow-repeat"></i> Korábbi hiánypótlási körök</strong>
                    <span class="badge bg-dark ms-2">UCE-1882</span>
                </div>
                <div class="card-body">
                    <div v-for="(kor, index) in korokListaja" :key="index" class="mb-3 pb-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6>
                                <span class="badge bg-secondary">{{ kor.kor }}. kör</span>
                                <span class="badge badge-uce ms-2">{{ kor.UCE_kod }}</span>
                                <span class="badge badge-function ms-1">{{ kor.F_kod }}</span>
                            </h6>
                            <span v-if="kor.aktiv" class="badge bg-warning">Aktív</span>
                            <span v-else-if="kor.ellenorzes_eredmeny === 'reszben_teljesitett'" class="badge bg-warning">Részben teljesített</span>
                            <span v-else-if="kor.benyujtva" class="badge bg-success">Benyújtva</span>
                        </div>

                        <div class="row small">
                            <div class="col-md-6">
                                <strong>Kiküldve:</strong> {{ kor.kikuldve }}<br>
                                <strong>Határidő:</strong> {{ kor.hatarido }}
                                <span v-if="kor.benyujtva"><br><strong>Benyújtva:</strong> {{ kor.benyujtva }}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Hiányosságok:</strong>
                                <ul class="mb-0 mt-1">
                                    <li v-for="(h, hi) in kor.hianyossagok" :key="hi">{{ h }}</li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="kor.megjegyzes" class="alert alert-sm alert-warning mt-2 mb-0">
                            <small>
                                <i class="bi bi-info-circle"></i>
                                <strong>Ellenőrzés eredménye (UCE-1880):</strong> {{ kor.megjegyzes }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Állapot jelző -->
            <div class="alert" :class="korokListaja.length > 0 ? 'alert-danger' : 'alert-warning'">
                <i class="bi bi-exclamation-triangle"></i>
                <strong v-if="korokListaja.length > 0">
                    Ismételt hiánypótlás szükséges ({{ felszolitas.kor_szama }}. kör)
                </strong>
                <strong v-else>Hiánypótlás szükséges</strong>
                <div class="small mt-1">
                    <span v-if="korokListaja.length > 0">
                        A korábbi hiánypótlás nem volt teljes körű, újabb felszólítás szükséges.
                    </span>
                    <span v-else>
                        A {{ felvezeto_tab === 'formai' ? 'formai' : 'tartalmi' }} vizsgálat során hiányosságok merültek fel.
                    </span>
                </div>
            </div>

            <!-- Hiánypótlási határidő -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong><i class="bi bi-calendar-event"></i> Határidő meghatározása ({{ felszolitas.kor_szama }}. kör)</strong>
                </div>
                <div class="card-body">
                    <!-- Kör információ -->
                    <div v-if="korokListaja.length > 0" class="alert alert-info mb-3">
                        <small>
                            <i class="bi bi-info-circle"></i>
                            <strong>{{ felszolitas.kor_szama }}. hiánypótlási kör</strong> - Az előző kör hiányosságai nem teljes körűen lettek pótolva.
                        </small>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">
                                Hiánypótlás határideje <span class="text-danger">*</span>
                            </label>
                            <input type="date"
                                   class="form-control"
                                   v-model="felszolitas.hatarido"
                                   :min="minimalisHatarido"
                                   :max="maximalisHatarido">
                            <small class="text-muted">
                                Minimum 8 nap, maximum 30 nap
                            </small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Jogszabályi hivatkozás</label>
                            <input type="text"
                                   class="form-control"
                                   v-model="felszolitas.jogszabaly"
                                   readonly>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hiányosságok listája -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong><i class="bi bi-list-check"></i> Hiányosságok felsorolása</strong>
                </div>
                <div class="card-body">
                    <!-- Meglévő hiányosságok -->
                    <div v-if="felszolitas.hianyossagok.length > 0" class="mb-3">
                        <div v-for="(hiany, index) in felszolitas.hianyossagok"
                             :key="index"
                             class="d-flex align-items-start mb-2 p-2 border-start border-3 border-warning bg-light">
                            <div class="flex-grow-1">
                                <strong>{{ index + 1 }}.</strong> {{ hiany }}
                            </div>
                            <button class="btn btn-sm btn-link text-danger p-0"
                                    @click="removeHianyossag(index)">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Új hiányosság hozzáadása -->
                    <div class="input-group">
                        <input type="text"
                               class="form-control"
                               v-model="ujHianyossag"
                               @keyup.enter="addHianyossag"
                               placeholder="Új hiányosság megadása...">
                        <button class="btn btn-outline-primary"
                                @click="addHianyossag"
                                :disabled="!ujHianyossag">
                            <i class="bi bi-plus-lg"></i> Hozzáad
                        </button>
                    </div>
                </div>
            </div>

            <!-- Indoklás -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong><i class="bi bi-chat-left-text"></i> Indoklás</strong>
                </div>
                <div class="card-body">
                    <textarea class="form-control"
                              rows="5"
                              v-model="felszolitas.indoklas"
                              placeholder="A hiánypótlás szükségességének részletes indoklása..."></textarea>
                    <small class="text-muted">
                        Minimum 10 karakter szükséges
                    </small>
                </div>
            </div>

            <!-- Mellékletek hivatkozása -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong><i class="bi bi-paperclip"></i> Hivatkozott dokumentumok</strong>
                </div>
                <div class="card-body">
                    <p class="small text-muted mb-2">
                        Válassza ki, mely dokumentumokra hivatkozik a hiánypótlási felszólítás:
                    </p>
                    <div class="form-check" v-for="dok in ugy.dokumentumok || []" :key="dok.nev">
                        <input class="form-check-input"
                               type="checkbox"
                               :id="'dok-' + dok.nev"
                               :value="dok.nev"
                               v-model="felszolitas.mellekletek">
                        <label class="form-check-label" :for="'dok-' + dok.nev">
                            {{ dok.nev }} ({{ dok.datum }})
                        </label>
                    </div>
                </div>
            </div>

            <!-- Dokumentum előnézet és generálás -->
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <strong><i class="bi bi-file-earmark-pdf"></i> Dokumentum generálás</strong>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Példányszám</label>
                            <input type="number"
                                   class="form-control"
                                   v-model.number="felszolitas.peldany_szam"
                                   min="1"
                                   max="5">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Státusz</label>
                            <select class="form-select" v-model="felszolitas.statusz">
                                <option value="draft">Tervezet</option>
                                <option value="review">Felülvizsgálatra vár</option>
                                <option value="approved">Jóváhagyott</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-grid gap-2 mt-3">
                        <button class="btn btn-primary"
                                @click="generatePDF"
                                :disabled="!isValid || generatingPDF">
                            <span v-if="generatingPDF">
                                <span class="spinner-border spinner-border-sm me-2"></span>
                                Generálás...
                            </span>
                            <span v-else>
                                <i class="bi bi-file-earmark-pdf"></i>
                                Hiánypótlási felszólítás generálása
                            </span>
                        </button>
                        <button class="btn btn-outline-secondary"
                                @click="previewDocument"
                                :disabled="!isValid">
                            <i class="bi bi-eye"></i> Előnézet
                        </button>
                    </div>
                </div>
            </div>

            <!-- Validációs figyelmeztető -->
            <div v-if="!isValid" class="alert alert-danger">
                <strong>Hiányos kitöltés!</strong>
                <ul class="mb-0 mt-2">
                    <li v-if="!felszolitas.hatarido">Határidő megadása kötelező</li>
                    <li v-if="felszolitas.hianyossagok.length === 0">Legalább egy hiányosság megadása szükséges</li>
                    <li v-if="felszolitas.indoklas.length < 10">Részletes indoklás szükséges (minimum 10 karakter)</li>
                </ul>
            </div>
        </div>
    `,
    methods: {
        addHianyossag() {
            if (this.ujHianyossag.trim()) {
                this.felszolitas.hianyossagok.push(this.ujHianyossag.trim());
                this.ujHianyossag = '';
            }
        },
        removeHianyossag(index) {
            this.felszolitas.hianyossagok.splice(index, 1);
        },
        generatePDF() {
            console.log('[F-0100] Hiánypótlási felszólítás generálása:', this.felszolitas);
            this.generatingPDF = true;

            // Mock PDF generálás
            setTimeout(() => {
                this.generatingPDF = false;
                alert('Hiánypótlási felszólítás sikeresen generálva!\n\n' +
                      'Ügyazonosító: ' + (this.ugy.ugyazonosito || 'N/A') + '\n' +
                      'Határidő: ' + this.felszolitas.hatarido + '\n' +
                      'Hiányosságok száma: ' + this.felszolitas.hianyossagok.length);

                this.$emit('generated', {
                    tipus: 'hianypotlas',
                    adatok: this.felszolitas
                });
            }, 2000);
        },
        previewDocument() {
            console.log('[F-0100] Hiánypótlási felszólítás előnézet:', this.felszolitas);
            alert('Előnézet megnyitása...\n\nEz a funkció a drótvázban mock adatokkal működik.');
        }
    }
};
