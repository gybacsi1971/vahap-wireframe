/**
 * VAHAP - Kérelem Megtekintése Tab
 * F-0107 - Kérelem adatlap megjelenítése
 * Az ügyfél által beadott kérelem űrlap teljes tartalmának megtekintése
 * Használat: <vahap-tab-kerelem :active="activeTab === 'kerelem'" :ugy="ugy"></vahap-tab-kerelem>
 */

const VahapTabKerelem = {
    name: 'vahap-tab-kerelem',
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
    computed: {
        kerelemAdatok() {
            // Mock kérelem adatok - később API-ból töltődik
            // Biztos inicializáljuk az ugyfel objektumot
            const ugyfel = (this.ugy && this.ugy.ugyfel) ? this.ugy.ugyfel : {
                nev: 'N/A',
                szuletesi_datum: 'N/A',
                anya_neve: 'N/A',
                lakcim: 'N/A',
                telefon: '',
                email: ''
            };

            // Ha létezik this.ugy.kerelem, akkor azt adjuk vissza, de biztosítjuk az ugyfel és mellekletek property-ket
            if (this.ugy && this.ugy.kerelem) {
                return {
                    ...this.ugy.kerelem,
                    ugyfel: this.ugy.kerelem.ugyfel || ugyfel,
                    mellekletek: this.ugy.kerelem.mellekletek || (this.ugy.dokumentumok || [])
                };
            }

            // Alapértelmezett fallback
            return {
                benyujtas_datum: '2024-09-25 14:30',
                benyujto_modja: 'Online (VAHAP rendszer)',
                kerelemtipus: 'V-044 - Vasúti járművezető előzetes alkalmassági vizsgálat',
                ugyfel: ugyfel,
                kerelem_adatok: {
                    vegzettseg: 'Vasúti járművezető',
                    kepzes_tipus: 'Alapképzés',
                    orvosi_alkalmas: true,
                    orvosi_ervenyesseg: '2026-01-15',
                    elozmenyek: 'Nincs korábbi vizsgálat',
                    megjegyzes: 'Első alkalom kérvényezem a vizsgálatot'
                },
                mellekletek: (this.ugy && this.ugy.dokumentumok) ? this.ugy.dokumentumok : []
            };
        },
        osszesMelleklet() {
            return (this.kerelemAdatok && this.kerelemAdatok.mellekletek)
                ? this.kerelemAdatok.mellekletek.length
                : 0;
        }
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <i class="bi bi-file-earmark-text"></i>
                    Beadott Kérelem Megtekintése
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0107</span>
                    A kérelmező által benyújtott űrlap teljes tartalma
                </p>
            </div>

            <!-- Kérelem fejléc információk -->
            <div class="card mb-3 border-primary">
                <div class="card-header bg-primary text-white">
                    <i class="bi bi-info-circle"></i> Kérelem azonosító adatok
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <small class="text-muted">Ügyazonosító</small>
                            <div class="fw-bold">{{ ugy.ugyazonosito || 'N/A' }}</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <small class="text-muted">Benyújtás dátuma</small>
                            <div class="fw-bold">{{ kerelemAdatok.benyujtas_datum }}</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <small class="text-muted">Benyújtás módja</small>
                            <div>{{ kerelemAdatok.benyujto_modja }}</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <small class="text-muted">Kérelem típusa</small>
                            <div>{{ kerelemAdatok.kerelemtipus }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kérelmező adatok -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-person-circle"></i> Kérelmező személyes adatai
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Név</label>
                            <div class="form-control-plaintext fw-bold">
                                {{ kerelemAdatok.ugyfel.nev || 'N/A' }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Születési dátum</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.ugyfel.szuletesi_datum || 'N/A' }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Anyja neve</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.ugyfel.anya_neve || 'N/A' }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Lakcím</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.ugyfel.lakcim || 'N/A' }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Telefonszám</label>
                            <div class="form-control-plaintext">
                                <a v-if="kerelemAdatok.ugyfel.telefon"
                                   :href="'tel:' + kerelemAdatok.ugyfel.telefon">
                                    {{ kerelemAdatok.ugyfel.telefon }}
                                </a>
                                <span v-else>N/A</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">E-mail cím</label>
                            <div class="form-control-plaintext">
                                <a v-if="kerelemAdatok.ugyfel.email"
                                   :href="'mailto:' + kerelemAdatok.ugyfel.email">
                                    {{ kerelemAdatok.ugyfel.email }}
                                </a>
                                <span v-else>N/A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kérelem tartalmi adatok -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-clipboard-data"></i> Kérelem tartalmi adatai
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Kért végzettség</label>
                            <div class="form-control-plaintext fw-bold">
                                {{ kerelemAdatok.kerelem_adatok.vegzettseg }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Képzés típusa</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.kerelem_adatok.kepzes_tipus }}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Orvosi alkalmasság</label>
                            <div class="form-control-plaintext">
                                <span v-if="kerelemAdatok.kerelem_adatok.orvosi_alkalmas"
                                      class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Alkalmas
                                </span>
                                <span v-else class="badge bg-danger">
                                    <i class="bi bi-x-circle"></i> Nem alkalmas
                                </span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted small">Alkalmasság érvényessége</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.kerelem_adatok.orvosi_ervenyesseg }}
                            </div>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label text-muted small">Előzmények</label>
                            <div class="form-control-plaintext">
                                {{ kerelemAdatok.kerelem_adatok.elozmenyek }}
                            </div>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label text-muted small">Megjegyzés, egyéb információk</label>
                            <div class="form-control-plaintext border rounded p-2 bg-light">
                                {{ kerelemAdatok.kerelem_adatok.megjegyzes }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mellékletek -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-paperclip"></i> Csatolt mellékletek
                    <span class="badge bg-primary ms-2">{{ osszesMelleklet }} db</span>
                </div>
                <div class="card-body">
                    <div v-if="kerelemAdatok.mellekletek.length > 0" class="list-group">
                        <div v-for="(melleklet, index) in kerelemAdatok.mellekletek"
                             :key="index"
                             class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi bi-file-earmark-pdf text-danger me-2"></i>
                                <strong>{{ melleklet.nev }}</strong>
                                <small class="text-muted ms-2">{{ melleklet.datum }}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-primary" @click="downloadMelleklet(melleklet)">
                                <i class="bi bi-download"></i> Letöltés
                            </button>
                        </div>
                    </div>
                    <div v-else class="alert alert-warning mb-0">
                        <i class="bi bi-exclamation-triangle"></i>
                        Nincs csatolt melléklet a kérelemhez.
                    </div>
                </div>
            </div>

            <!-- Műveletek -->
            <div class="card border-info">
                <div class="card-header bg-info text-white">
                    <i class="bi bi-tools"></i> Műveletek a kérelemmel
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" @click="printKerelem">
                            <i class="bi bi-printer"></i> Kérelem nyomtatása
                        </button>
                        <button class="btn btn-outline-secondary" @click="exportPDF">
                            <i class="bi bi-file-earmark-pdf"></i> Exportálás PDF-be
                        </button>
                        <button class="btn btn-outline-info" @click="keresElozmenyek">
                            <i class="bi bi-search"></i> Ügyfél korábbi kérelmei
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        downloadMelleklet(melleklet) {
            console.log('[F-0107] Melléklet letöltése:', melleklet.nev);
            alert(`Melléklet letöltése:\n${melleklet.nev}\n\nEz a funkció a drótvázban mock adatokkal működik.`);
        },
        printKerelem() {
            console.log('[F-0107] Kérelem nyomtatása');
            window.print();
        },
        exportPDF() {
            console.log('[F-0107] Kérelem PDF export');
            alert('Kérelem PDF exportálása...\n\nEz a funkció a drótvázban mock adatokkal működik.');
        },
        keresElozmenyek() {
            console.log('[F-0107] Ügyfél előzmények keresése:', this.kerelemAdatok.ugyfel.nev);
            alert(`Ügyfél korábbi kérelmeinek keresése:\n${this.kerelemAdatok.ugyfel.nev}\n\nEz a funkció a drótvázban mock adatokkal működik.`);
        }
    },
    mounted() {
        console.log('[VAHAP] F-0107 - Kérelem adatlap megtekintő betöltve');
    }
};
