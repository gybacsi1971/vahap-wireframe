/**
 * VAHAP Paraméterező - Ellenőrzési Lista Kezelő Komponens
 * Funkcióak: F-0064 (Hatáskör), F-0065 (Formai), F-0066 (Tartalmi)
 * Használat: <param-lista-kezelo :lista-tipus="'hatáskor'" @save="handleSave"></param-lista-kezelo>
 */

const ParamListaKezelo = {
    name: 'param-lista-kezelo',
    components: {
        'param-tabla': ParamTabla,
        'param-szerkeszto': ParamSzerkeszto
    },
    emits: ['save', 'change'],
    props: {
        listaTipus: {
            type: String,
            required: true,
            validator: (value) => ['hatáskor', 'formai', 'tartalmi'].includes(value)
        },
        ugytipus: {
            type: String,
            default: 'V-044' // V-044 vagy H-052
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            kriteriumok: [],
            showEditor: false,
            editedKriterium: null,
            editMode: 'create',
            draggedIndex: null,
            previewMode: false,
            hasChanges: false,
            // Schema az univerzális szerkesztőhöz
            editorSchema: [
                {
                    key: 'megnevezes',
                    label: 'Kritérium megnevezése',
                    type: 'text',
                    required: true,
                    maxLength: 200,
                    placeholder: 'pl. Hatáskör vizsgálat',
                    hint: 'A kritérium rövid megnevezése'
                },
                {
                    key: 'leiras',
                    label: 'Részletes leírás',
                    type: 'textarea',
                    required: false,
                    rows: 4,
                    maxLength: 1000,
                    placeholder: 'Részletes leírás az ellenőrzési kritériumról...',
                    hint: 'Segítség az ügyintézőnek a kritérium értelmezéséhez'
                },
                {
                    key: 'kotelezo',
                    label: 'Kötelező ellenőrzés',
                    type: 'checkbox',
                    default: true,
                    hint: 'Kötelező kitölteni az ellenőrzés során'
                },
                {
                    key: 'tipus',
                    label: 'Ellenőrzés típusa',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'igen_nem', label: 'Igen/Nem' },
                        { value: 'megfelel_nem_megfelel', label: 'Megfelel/Nem megfelel' },
                        { value: 'szoveges', label: 'Szöveges megjegyzés' },
                        { value: 'numerikus', label: 'Numerikus érték' }
                    ],
                    hint: 'Az ellenőrzés típusa határozza meg a megjelenő űrlap elemet'
                },
                {
                    key: 'suly',
                    label: 'Súlyozás',
                    type: 'number',
                    required: false,
                    min: 1,
                    max: 10,
                    default: 1,
                    hint: 'Kritérium fontossága 1-10 skálán (1=legkevésbé fontos, 10=kritikus)'
                },
                {
                    key: 'ugytipus_specifikus',
                    label: 'Ügytípus specifikus',
                    type: 'select',
                    required: false,
                    options: [
                        { value: '', label: 'Mindkettő (V-044 és H-052)' },
                        { value: 'V-044', label: 'Csak vasúti (V-044)' },
                        { value: 'H-052', label: 'Csak hajózási (H-052)' }
                    ],
                    hint: 'Ha üres, akkor mindkét ügytípusra vonatkozik'
                },
                {
                    key: 'aktiv',
                    label: 'Aktív',
                    type: 'checkbox',
                    default: true,
                    hint: 'Csak az aktív kritériumok jelennek meg az ellenőrzési listában'
                }
            ]
        };
    },
    computed: {
        listaFunkciokod() {
            const kodok = {
                'hatáskor': 'F-0064',
                'formai': 'F-0065',
                'tartalmi': 'F-0066'
            };
            return kodok[this.listaTipus];
        },
        listaCim() {
            const cimek = {
                'hatáskor': 'Hatáskör és illetékesség vizsgálat',
                'formai': 'Formai megfelelőség vizsgálat',
                'tartalmi': 'Tartalmi megfelelőség vizsgálat'
            };
            return cimek[this.listaTipus];
        },
        filteredKriteriumok() {
            return this.kriteriumok.filter(k => {
                if (!k.ugytipus_specifikus) return true;
                return k.ugytipus_specifikus === this.ugytipus;
            });
        },
        tableColumns() {
            return [
                { key: 'sorszam', label: '#', sortable: false, width: '50px' },
                { key: 'megnevezes', label: 'Kritérium', sortable: true },
                { key: 'tipus', label: 'Típus', sortable: true, format: this.formatTipus },
                { key: 'kotelezo', label: 'Kötelező', sortable: true, type: 'boolean' },
                { key: 'suly', label: 'Súly', sortable: true, width: '80px',
                  format: (val) => val ? `${val}/10` : '-' },
                { key: 'aktiv', label: 'Aktív', sortable: true, type: 'boolean' }
            ];
        },
        kriteriumokWithSorszam() {
            return this.filteredKriteriumok.map((k, index) => ({
                ...k,
                sorszam: index + 1
            }));
        },
        statisztika() {
            const osszes = this.kriteriumok.length;
            const aktiv = this.kriteriumok.filter(k => k.aktiv).length;
            const kotelezo = this.kriteriumok.filter(k => k.kotelezo).length;
            return { osszes, aktiv, kotelezo };
        }
    },
    template: `
        <div class="param-lista-kezelo">
            <!-- Fejléc -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="mb-1">
                        <i class="bi bi-list-check"></i> {{ listaCim }}
                        <span class="badge bg-primary ms-2">{{ listaFunkciokod }}</span>
                        <span class="badge bg-secondary ms-1">{{ ugytipus }}</span>
                    </h5>
                    <p class="text-muted small mb-0">
                        Összesen: <strong>{{ statisztika.osszes }}</strong> kritérium,
                        Aktív: <strong>{{ statisztika.aktiv }}</strong>,
                        Kötelező: <strong>{{ statisztika.kotelezo }}</strong>
                    </p>
                </div>
                <div class="btn-group">
                    <button v-if="!readonly"
                            class="btn btn-success"
                            @click="openCreateDialog">
                        <i class="bi bi-plus-circle"></i> Új kritérium
                    </button>
                    <button class="btn btn-outline-secondary"
                            @click="previewMode = !previewMode">
                        <i class="bi" :class="previewMode ? 'bi-pencil' : 'bi-eye'"></i>
                        {{ previewMode ? 'Szerkesztés' : 'Előnézet' }}
                    </button>
                    <button v-if="hasChanges && !readonly"
                            class="btn btn-primary"
                            @click="saveLista">
                        <i class="bi bi-save"></i> Mentés
                    </button>
                </div>
            </div>

            <!-- Módosítás figyelmeztetés -->
            <div v-if="hasChanges" class="alert alert-warning d-flex align-items-center mb-3">
                <i class="bi bi-exclamation-triangle fs-4 me-2"></i>
                <div>
                    <strong>Nem mentett módosítások!</strong>
                    A lista módosult, kattintson a Mentés gombra a változtatások alkalmazásához.
                </div>
            </div>

            <!-- Előnézet mód -->
            <div v-if="previewMode" class="card mb-3">
                <div class="card-header bg-info text-white">
                    <i class="bi bi-eye"></i> Élő előnézet - Így látják az ügyintézők
                </div>
                <div class="card-body">
                    <div class="ellenorzesi-lista-preview">
                        <div v-for="(kriterium, index) in filteredKriteriumok.filter(k => k.aktiv)"
                             :key="index"
                             class="ellenorzes-item p-3 border rounded mb-2"
                             :class="{ 'border-danger': kriterium.kotelezo }">

                            <div class="d-flex align-items-start">
                                <div class="me-3 text-muted">
                                    <strong>{{ index + 1 }}.</strong>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="d-flex align-items-center mb-2">
                                        <strong>{{ kriterium.megnevezes }}</strong>
                                        <span v-if="kriterium.kotelezo"
                                              class="badge bg-danger ms-2">Kötelező</span>
                                        <span v-if="kriterium.suly >= 8"
                                              class="badge bg-warning ms-1">Kiemelt</span>
                                    </div>

                                    <p v-if="kriterium.leiras" class="text-muted small mb-2">
                                        {{ kriterium.leiras }}
                                    </p>

                                    <!-- Típus szerinti input előnézet -->
                                    <div class="mt-2">
                                        <div v-if="kriterium.tipus === 'igen_nem'" class="btn-group">
                                            <button class="btn btn-sm btn-outline-success">Igen</button>
                                            <button class="btn btn-sm btn-outline-danger">Nem</button>
                                        </div>
                                        <div v-else-if="kriterium.tipus === 'megfelel_nem_megfelel'" class="btn-group">
                                            <button class="btn btn-sm btn-outline-success">Megfelel</button>
                                            <button class="btn btn-sm btn-outline-danger">Nem megfelel</button>
                                        </div>
                                        <div v-else-if="kriterium.tipus === 'szoveges'">
                                            <textarea class="form-control form-control-sm"
                                                      rows="2"
                                                      placeholder="Megjegyzés..."></textarea>
                                        </div>
                                        <div v-else-if="kriterium.tipus === 'numerikus'">
                                            <input type="number"
                                                   class="form-control form-control-sm"
                                                   style="max-width: 150px;"
                                                   placeholder="Érték">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Szerkesztő mód - Táblázat -->
            <div v-else>
                <param-tabla
                    :columns="tableColumns"
                    :data="kriteriumokWithSorszam"
                    :sortable="false"
                    :filterable="true"
                    :editable="!readonly"
                    :deletable="!readonly"
                    :striped="true"
                    :hover="true"
                    empty-text="Még nincsenek kritériumok definiálva"
                    @edit="editKriterium"
                    @delete="deleteKriterium">
                </param-tabla>

                <!-- Sorrend módosítás info -->
                <div v-if="!readonly && kriteriumok.length > 0" class="alert alert-info mt-3">
                    <i class="bi bi-info-circle"></i>
                    <strong>Tipp:</strong> A kritériumok sorrendjét a sorok húzásával módosíthatja.
                    (Drag & drop funkció hamarosan)
                </div>
            </div>

            <!-- Univerzális szerkesztő modal -->
            <param-szerkeszto
                :show="showEditor"
                :title="listaCim + ' kritérium'"
                :schema="editorSchema"
                :data="editedKriterium"
                :mode="editMode"
                size="lg"
                @save="handleSaveKriterium"
                @cancel="closeEditor">
            </param-szerkeszto>
        </div>
    `,
    methods: {
        async loadKriteriumok() {
            // Betöltés API-ról
            const listaKodMap = {
                'hatáskor': 'F-0064',
                'formai': 'F-0065',
                'tartalmi': 'F-0066'
            };
            const listaKod = listaKodMap[this.listaTipus];

            if (!listaKod) {
                console.error('[param-lista-kezelo] Ismeretlen lista típus:', this.listaTipus);
                return;
            }

            try {
                console.log('[param-lista-kezelo] Loading from API:', listaKod);

                const endpoint = VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod);
                const response = await VAHAP_API.get(endpoint);

                if (response && response.kriteriumok) {
                    this.kriteriumok = response.kriteriumok.map(k => ({
                        ...k,
                        kotelezo: Boolean(k.kotelezo),
                        aktiv: Boolean(k.aktiv)
                    }));
                    console.log('[param-lista-kezelo] Loaded', this.kriteriumok.length, 'kriteriumok from API');
                } else {
                    console.warn('[param-lista-kezelo] Nincs kritérium adat az API válaszban');
                    this.kriteriumok = [];
                }

                this.hasChanges = false;
            } catch (error) {
                console.error('[param-lista-kezelo] API hiba:', error);
                alert('Hiba a kritériumok betöltésekor: ' + error.message);
                this.kriteriumok = [];
            }
        },

        openCreateDialog() {
            this.editMode = 'create';
            this.editedKriterium = {
                megnevezes: '',
                leiras: '',
                kotelezo: true,
                tipus: 'igen_nem',
                suly: 5,
                ugytipus_specifikus: '',
                aktiv: true
            };
            this.showEditor = true;
        },

        editKriterium(kriterium) {
            this.editMode = 'edit';
            this.editedKriterium = { ...kriterium };
            delete this.editedKriterium.sorszam; // Remove computed field
            this.showEditor = true;
        },

        async handleSaveKriterium(data) {
            const listaKodMap = {
                'hatáskor': 'F-0064',
                'formai': 'F-0065',
                'tartalmi': 'F-0066'
            };
            const listaKod = listaKodMap[this.listaTipus];

            try {
                if (this.editMode === 'create') {
                    // Új kritérium létrehozása API-n keresztül
                    const maxSorrend = this.kriteriumok.length > 0
                        ? Math.max(...this.kriteriumok.map(k => k.sorrend || 0))
                        : 0;

                    const payload = {
                        ...data,
                        sorrend: maxSorrend + 1
                    };

                    const endpoint = VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod);
                    await VAHAP_API.post(endpoint, payload);

                    console.log('[param-lista-kezelo] Kritérium létrehozva API-n keresztül');
                } else {
                    // Meglévő kritérium módosítása API-n keresztül
                    const endpoint = `${VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod)}/${data.id}`;
                    await VAHAP_API.put(endpoint, data);

                    console.log('[param-lista-kezelo] Kritérium frissítve API-n keresztül');
                }

                // Újratöltés az API-ról
                await this.loadKriteriumok();

                this.closeEditor();
                this.$emit('change', this.kriteriumok);
            } catch (error) {
                console.error('[param-lista-kezelo] Mentési hiba:', error);
                alert('Hiba a kritérium mentésekor: ' + error.message);
            }
        },

        async deleteKriterium(kriterium) {
            if (!confirm(`Biztosan törli: ${kriterium.megnevezes}?`)) {
                return;
            }

            const listaKodMap = {
                'hatáskor': 'F-0064',
                'formai': 'F-0065',
                'tartalmi': 'F-0066'
            };
            const listaKod = listaKodMap[this.listaTipus];

            try {
                const endpoint = `${VAHAP_API.endpoints.parameterezo.ellenorzesiListaKriteriumok(listaKod)}/${kriterium.id}`;
                await VAHAP_API.delete(endpoint);

                console.log('[param-lista-kezelo] Kritérium törölve API-n keresztül');

                // Újratöltés az API-ról
                await this.loadKriteriumok();

                this.$emit('change', this.kriteriumok);
            } catch (error) {
                console.error('[param-lista-kezelo] Törlési hiba:', error);
                alert('Hiba a kritérium törlésekor: ' + error.message);
            }
        },

        closeEditor() {
            this.showEditor = false;
            this.editedKriterium = null;
        },

        async saveLista() {
            // Az adatok már mentve vannak az API-ra a handleSaveKriterium-on keresztül
            // Ez a gomb már nem szükséges API verzióban, de meghagyjuk kompatibilitás céljából

            // Emit save event
            this.$emit('save', {
                listaTipus: this.listaTipus,
                ugytipus: this.ugytipus,
                kriteriumok: this.kriteriumok
            });

            this.hasChanges = false;
            console.log('✅ Lista mentve:', this.listaCim);
            alert('Lista sikeresen mentve!');
        },

        formatTipus(value) {
            const tipusok = {
                'igen_nem': 'Igen/Nem',
                'megfelel_nem_megfelel': 'Megfelel',
                'szoveges': 'Szöveges',
                'numerikus': 'Szám'
            };
            return tipusok[value] || value;
        },

        moveKriterium(fromIndex, toIndex) {
            // Drag & drop implementáció (jövőbeli fejlesztés)
            const item = this.kriteriumok.splice(fromIndex, 1)[0];
            this.kriteriumok.splice(toIndex, 0, item);
            this.hasChanges = true;
            this.$emit('change', this.kriteriumok);
        }
    },
    mounted() {
        this.loadKriteriumok();
    },
    watch: {
        listaTipus() {
            this.loadKriteriumok();
        },
        ugytipus() {
            this.loadKriteriumok();
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamListaKezelo = ParamListaKezelo;
}
