/**
 * VAHAP - F-0090 VNY024 Vasútegészségügyi adatok Tab
 * Vasúti járművezetők egészségügyi nyilvántartási adatainak lekérdezése
 * VASÚT SPECIFIKUS FUNKCIÓ
 * Használat: <vahap-tab-vny024 :active="activeTab === 'vny024'" :ugy="ugy"></vahap-tab-vny024>
 */

const VahapTabVny024 = {
    name: 'vahap-tab-vny024',
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
            vny024Data: null,
            loading: false,
            lastUpdate: null,
            error: null
        };
    },
    mounted() {
        // Automatikus lekérdezés komponens betöltésekor
        this.fetchVNY024Data();
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <span class="badge badge-function">F-0090</span>
                    VNY024 Vasútegészségügyi adatok
                </h5>
                <p class="mb-0 small text-muted">
                    Vasúti járművezetők egészségügyi nyilvántartási adatainak lekérdezése
                </p>
            </div>

            <!-- Interfész információ -->
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                <strong>VNY024 nyilvántartás</strong>
                <div class="small mt-1">
                    Vasútegészségügyi alkalmasság nyilvántartási adatok központi rendszerből
                </div>
            </div>

            <!-- Betöltés állapot -->
            <div v-if="loading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Betöltés...</span>
                </div>
                <div class="mt-3">
                    <small class="text-muted">VNY024 adatok lekérdezése...</small>
                </div>
            </div>

            <!-- Hiba állapot -->
            <div v-else-if="error" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Hiba történt a lekérdezés során</strong>
                <div class="small mt-1">{{ error }}</div>
                <button class="btn btn-sm btn-outline-danger mt-2" @click="fetchVNY024Data">
                    <i class="bi bi-arrow-repeat"></i> Újrapróbálás
                </button>
            </div>

            <!-- Adatok megjelenítése -->
            <div v-else-if="vny024Data" class="mt-3">

                <!-- Ügyfél alapadatok -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-person-badge"></i> Ügyfél azonosítás
                        </strong>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">Név:</small>
                                <div class="fw-bold">{{ vny024Data.nev }}</div>
                            </div>
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">Születési dátum:</small>
                                <div class="fw-bold">{{ vny024Data.szuletesi_datum }}</div>
                            </div>
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">Anyja neve:</small>
                                <div class="fw-bold">{{ vny024Data.anya_neve }}</div>
                            </div>
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">TAJ szám:</small>
                                <div class="fw-bold">{{ vny024Data.taj_szam }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Egészségügyi alkalmasság -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-heart-pulse"></i> Vasútegészségügyi alkalmasság
                        </strong>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">Alkalmassági kategória:</small>
                                <div>
                                    <span class="badge bg-success">{{ vny024Data.alkalmasság.kategoria }}</span>
                                </div>
                            </div>
                            <div class="col-md-6 mb-2">
                                <small class="text-muted">Érvényesség:</small>
                                <div class="fw-bold">
                                    {{ vny024Data.alkalmasság.ervenyesseg_kezdete }} -
                                    {{ vny024Data.alkalmasság.ervenyesseg_vege }}
                                    <span v-if="isValidUntil(vny024Data.alkalmasság.ervenyesseg_vege)"
                                          class="badge bg-success ms-2">Érvényes</span>
                                    <span v-else class="badge bg-danger ms-2">Lejárt</span>
                                </div>
                            </div>
                            <div class="col-md-12 mb-2">
                                <small class="text-muted">Vizsgálat helye:</small>
                                <div class="fw-bold">{{ vny024Data.alkalmasság.vizsgalat_helye }}</div>
                            </div>
                            <div class="col-md-12 mb-2">
                                <small class="text-muted">Vizsgáló orvos:</small>
                                <div class="fw-bold">{{ vny024Data.alkalmasság.vizsgalo_orvos }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Korlátozások -->
                <div v-if="vny024Data.korlatozasok && vny024Data.korlatozasok.length > 0" class="card mb-3">
                    <div class="card-header bg-warning">
                        <strong>
                            <i class="bi bi-exclamation-triangle"></i> Korlátozások
                        </strong>
                    </div>
                    <div class="card-body">
                        <ul class="mb-0">
                            <li v-for="(korlatozas, index) in vny024Data.korlatozasok" :key="index">
                                {{ korlatozas }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Megjegyzések -->
                <div v-if="vny024Data.megjegyzes" class="card mb-3">
                    <div class="card-header bg-light">
                        <strong>
                            <i class="bi bi-chat-left-text"></i> Megjegyzések
                        </strong>
                    </div>
                    <div class="card-body">
                        <p class="mb-0">{{ vny024Data.megjegyzes }}</p>
                    </div>
                </div>

                <!-- Utolsó frissítés -->
                <div class="text-muted small text-end">
                    <i class="bi bi-clock-history"></i>
                    Utolsó lekérdezés: {{ lastUpdate }}
                </div>

            </div>

            <!-- Nincs adat -->
            <div v-else class="alert alert-warning">
                <i class="bi bi-exclamation-circle"></i>
                <strong>Nincs elérhető adat</strong>
                <div class="small mt-1">A VNY024 nyilvántartásban nem található adat a kérelmezőhöz.</div>
            </div>

            <!-- Újralekérdezés gomb -->
            <div class="mt-3">
                <button class="btn btn-primary" @click="fetchVNY024Data" :disabled="loading">
                    <i class="bi bi-arrow-repeat"></i> Adatok újralekérdezése
                </button>
            </div>

        </div>
    `,
    methods: {
        fetchVNY024Data() {
            // F-0090 - VNY024 interfész hívás (MOCK)
            this.loading = true;
            this.error = null;

            // Szimulált API hívás
            setTimeout(() => {
                try {
                    // Mock VNY024 adat
                    this.vny024Data = {
                        nev: this.ugy.ugyfel?.nev || 'Szabó Gábor',
                        szuletesi_datum: this.ugy.ugyfel?.szuletesi_datum || '1995-03-08',
                        anya_neve: this.ugy.ugyfel?.anya_neve || 'Kiss Mária',
                        taj_szam: '123-456-789',
                        alkalmasság: {
                            kategoria: 'A1 - Járművezető',
                            ervenyesseg_kezdete: '2024-01-15',
                            ervenyesseg_vege: '2026-01-15',
                            vizsgalat_helye: 'MÁV Kórház és Rendelőintézet',
                            vizsgalo_orvos: 'Dr. Nagy Péter'
                        },
                        korlatozasok: [
                            'Látáskorrekcióval (szemüveg/kontaktlencse) alkalmas'
                        ],
                        megjegyzes: 'Évenkénti felülvizsgálat szükséges.'
                    };

                    this.lastUpdate = new Date().toLocaleString('hu-HU');
                    this.loading = false;

                    // Emit event a szülő komponensnek
                    this.$emit('vny024-loaded', this.vny024Data);

                } catch (err) {
                    this.error = 'Hiba a VNY024 rendszer elérése során. Kérem próbálja újra később.';
                    this.loading = false;
                }
            }, 1500); // 1.5 másodperc késleltetés a betöltés szimulálásához
        },
        isValidUntil(endDate) {
            if (!endDate) return false;
            const today = new Date();
            const end = new Date(endDate);
            return end >= today;
        },
        save() {
            // F-0090 - VNY024 adatok mentése
            console.log('F-0090 - VNY024 adatok rögzítve', this.vny024Data);
            this.$emit('save', this.vny024Data);
        }
    }
};
