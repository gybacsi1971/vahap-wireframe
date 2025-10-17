/**
 * VAHAP - Interaktív Ellenőrző Lista Komponens
 * Formai és tartalmi ellenőrzéshez használható checkbox lista
 * F-0064, F-0065, F-0066 funkciókódokhoz
 */

const ViharEllenorzoLista = {
    name: 'vihar-ellenorzo-lista',

    props: {
        tipus: {
            type: String,
            required: true,
            validator: (value) => ['hataskor', 'formai', 'tartalmi'].includes(value)
        },
        funkciokod: {
            type: String,
            default: ''
        },
        uce: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },

    emits: ['kritérium-változás', 'ellenőrzés-kész', 'döntés'],

    data() {
        return {
            kriteriumok: [],
            megjegyzes: '',
            osszesKritériumTeljesült: false
        };
    },

    computed: {
        listaConfig() {
            const configs = {
                'hataskor': {
                    cim: 'Hatáskör és Illetékesség Vizsgálat',
                    kod: 'F-0064',
                    uce: 'UCE-1793',
                    szin: 'primary'
                },
                'formai': {
                    cim: 'Formai Megfelelőség Vizsgálat',
                    kod: 'F-0065',
                    uce: 'UCE-1799',
                    szin: 'info'
                },
                'tartalmi': {
                    cim: 'Tartalmi Megfelelőség Vizsgálat',
                    kod: 'F-0066',
                    uce: 'UCE-1794',
                    szin: 'warning'
                }
            };
            return configs[this.tipus] || configs.formai;
        },

        teljesítettKritériumok() {
            return this.kriteriumok.filter(k => k.teljesült).length;
        },

        osszesKritérium() {
            return this.kriteriumok.length;
        },

        teljesítésSzázalék() {
            if (this.osszesKritérium === 0) return 0;
            return Math.round((this.teljesítettKritériumok / this.osszesKritérium) * 100);
        },

        vanHiányosság() {
            return this.kriteriumok.some(k => k.kotelezo && !k.teljesült);
        },

        ellenőrzésKész() {
            // Minden kötelező kritérium teljesült
            return !this.kriteriumok.some(k => k.kotelezo && k.allapot === 'pending');
        }
    },

    methods: {
        loadKriteriumok() {
            // Mock kritériumok betöltése típus alapján
            const mockKriteriumok = {
                'hataskor': [
                    { id: 1, megnevezes: 'A kérelem tárgya vasúti járművezetői alkalmassági vizsgálat', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 2, megnevezes: 'A kérelmező magyar állampolgár vagy EU tagállam polgára', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 3, megnevezes: 'Az EKM Vasúti Hatósági Főosztály illetékes a kérelem elbírálására', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 4, megnevezes: 'Nincs kizáró ok (más hatóság hatásköre)', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 5, megnevezes: 'A kérelem nem ismételt (6 hónapon belül)', kotelezo: false, allapot: 'pending', teljesült: false }
                ],

                'formai': [
                    { id: 1, megnevezes: 'Kérelem formanyomtatvány kitöltve', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 2, megnevezes: 'Személyes adatok hiánytalanul megadva', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 3, megnevezes: 'Aláírás megléte', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 4, megnevezes: 'Személyi igazolvány másolat csatolva', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 5, megnevezes: 'Lakcímkártya másolat csatolva', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 6, megnevezes: 'Orvosi alkalmassági igazolás csatolva', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 7, megnevezes: 'Végzettséget igazoló dokumentum csatolva', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 8, megnevezes: 'Igazgatási szolgáltatási díj befizetve', kotelezo: true, allapot: 'pending', teljesült: false, megjegyzes: '' },
                    { id: 9, megnevezes: 'Meghatalmazás (ha szükséges)', kotelezo: false, allapot: 'pending', teljesült: false, megjegyzes: '' }
                ],

                'tartalmi': [
                    { id: 1, megnevezes: 'Életkor megfelel (18-65 év)', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 2, megnevezes: 'Egészségügyi alkalmasság igazolt', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 3, megnevezes: 'Szakmai végzettség megfelelő', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 4, megnevezes: 'Nincs kizáró büntetett előélet', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 5, megnevezes: 'Vasúti ismeretek vizsga teljesítve', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 6, megnevezes: 'Pszichológiai alkalmasság igazolt', kotelezo: true, allapot: 'pending', teljesült: false },
                    { id: 7, megnevezes: 'Munkahelyi igazolás (ha releváns)', kotelezo: false, allapot: 'pending', teljesült: false }
                ]
            };

            this.kriteriumok = JSON.parse(JSON.stringify(mockKriteriumok[this.tipus] || []));
        },

        toggleKriterium(kriterium) {
            if (this.readonly) return;

            kriterium.teljesült = !kriterium.teljesült;
            kriterium.allapot = kriterium.teljesült ? 'teljesult' : 'nem_teljesult';

            this.$emit('kritérium-változás', {
                kriterium: kriterium,
                osszesito: {
                    teljesitett: this.teljesítettKritériumok,
                    osszes: this.osszesKritérium,
                    szazalek: this.teljesítésSzázalék
                }
            });

            this.checkOsszesKriterium();
        },

        checkOsszesKriterium() {
            // Minden kötelező teljesült?
            const mindenKotelezoTeljesult = !this.kriteriumok.some(k => k.kotelezo && !k.teljesült);

            if (mindenKotelezoTeljesult && !this.osszesKritériumTeljesült) {
                this.osszesKritériumTeljesült = true;
                this.$emit('ellenőrzés-kész', {
                    tipus: this.tipus,
                    teljesult: true,
                    hianyossagok: this.getHianyossagok()
                });
            }
        },

        getHianyossagok() {
            return this.kriteriumok
                .filter(k => k.kotelezo && !k.teljesült)
                .map(k => ({
                    id: k.id,
                    megnevezes: k.megnevezes,
                    megjegyzes: k.megjegyzes || ''
                }));
        },

        megjegyzesHozzaadas(kriterium) {
            const megjegyzes = prompt('Megjegyzés hozzáadása:', kriterium.megjegyzes || '');
            if (megjegyzes !== null) {
                kriterium.megjegyzes = megjegyzes;
            }
        },

        dontes(tipus) {
            const hianyossagok = this.getHianyossagok();

            this.$emit('döntés', {
                tipus: this.tipus,
                dontes: tipus,
                hianyossagok: hianyossagok,
                megjegyzes: this.megjegyzes,
                kriteriumok: this.kriteriumok
            });
        },

        exportToPDF() {
            // Mock PDF export
            console.log('[Ellenőrző Lista] PDF export:', {
                tipus: this.tipus,
                teljesitett: this.teljesítettKritériumok,
                osszes: this.osszesKritérium,
                hianyossagok: this.getHianyossagok()
            });

            alert('Ellenőrző lista exportálva PDF-be (mock funkció)');
        }
    },

    template: `
        <div class="vihar-ellenorzo-lista card">
            <div class="card-header" :class="'bg-' + listaConfig.szin + ' text-white'">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">
                            <i class="bi bi-list-check"></i> {{ listaConfig.cim }}
                        </h5>
                        <small>
                            <span class="badge bg-light text-dark me-1">{{ listaConfig.kod }}</span>
                            <span class="badge bg-light text-dark">{{ listaConfig.uce }}</span>
                        </small>
                    </div>
                    <div class="text-end">
                        <div class="h4 mb-0">{{ teljesítésSzázalék }}%</div>
                        <small>{{ teljesítettKritériumok }}/{{ osszesKritérium }}</small>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <!-- Progress bar -->
                <div class="progress mb-4" style="height: 25px;">
                    <div class="progress-bar"
                         :class="{
                             'bg-success': teljesítésSzázalék === 100,
                             'bg-warning': teljesítésSzázalék >= 50 && teljesítésSzázalék < 100,
                             'bg-danger': teljesítésSzázalék < 50
                         }"
                         :style="{ width: teljesítésSzázalék + '%' }">
                        {{ teljesítettKritériumok }} / {{ osszesKritérium }} teljesítve
                    </div>
                </div>

                <!-- Kritériumok lista -->
                <div class="list-group mb-4">
                    <div v-for="kriterium in kriteriumok"
                         :key="kriterium.id"
                         class="list-group-item">
                        <div class="d-flex align-items-start">
                            <div class="form-check flex-grow-1">
                                <input type="checkbox"
                                       class="form-check-input"
                                       :id="'krit_' + tipus + '_' + kriterium.id"
                                       :checked="kriterium.teljesült"
                                       :disabled="readonly"
                                       @change="toggleKriterium(kriterium)">
                                <label class="form-check-label"
                                       :for="'krit_' + tipus + '_' + kriterium.id">
                                    {{ kriterium.megnevezes }}
                                    <span v-if="kriterium.kotelezo" class="text-danger">*</span>
                                    <span v-if="!kriterium.kotelezo" class="badge bg-secondary ms-1">Opcionális</span>
                                </label>

                                <!-- Megjegyzés -->
                                <div v-if="kriterium.megjegyzes" class="small text-muted mt-1">
                                    <i class="bi bi-chat-left-text"></i> {{ kriterium.megjegyzes }}
                                </div>
                            </div>

                            <div class="ms-2">
                                <button v-if="!readonly && !kriterium.teljesült"
                                        class="btn btn-sm btn-outline-secondary"
                                        @click="megjegyzesHozzaadas(kriterium)"
                                        title="Megjegyzés hozzáadása">
                                    <i class="bi bi-chat-left-text"></i>
                                </button>

                                <span v-if="kriterium.teljesült" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i>
                                </span>
                                <span v-else-if="kriterium.allapot === 'nem_teljesult'" class="badge bg-danger">
                                    <i class="bi bi-x-circle"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hiányosságok összefoglaló -->
                <div v-if="vanHiányosság" class="alert alert-warning">
                    <h6><i class="bi bi-exclamation-triangle"></i> Hiányosságok:</h6>
                    <ul class="mb-0">
                        <li v-for="hiany in getHianyossagok()" :key="hiany.id">
                            {{ hiany.megnevezes }}
                        </li>
                    </ul>
                </div>

                <!-- Összesített megjegyzés -->
                <div v-if="!readonly" class="mb-3">
                    <label class="form-label">
                        <i class="bi bi-chat-left-dots"></i> Összesített megjegyzés:
                    </label>
                    <textarea v-model="megjegyzes"
                              class="form-control"
                              rows="3"
                              placeholder="Opcionális megjegyzés az ellenőrzéshez..."></textarea>
                </div>

                <!-- Műveletek -->
                <div v-if="!readonly" class="d-flex justify-content-between">
                    <button class="btn btn-outline-secondary" @click="exportToPDF">
                        <i class="bi bi-file-pdf"></i> PDF Export
                    </button>

                    <div class="btn-group">
                        <button v-if="!vanHiányosság"
                                class="btn btn-success"
                                @click="dontes('megfelel')">
                            <i class="bi bi-check-circle"></i> Megfelel
                        </button>
                        <button v-else
                                class="btn btn-warning"
                                @click="dontes('hianypotlas')">
                            <i class="bi bi-exclamation-triangle"></i> Hiánypótlás szükséges
                        </button>
                        <button class="btn btn-danger"
                                @click="dontes('elutasit')">
                            <i class="bi bi-x-circle"></i> Elutasít
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,

    mounted() {
        console.log('[VAHAP] Ellenőrző lista komponens betöltve:', this.tipus);
        this.loadKriteriumok();
    }
};