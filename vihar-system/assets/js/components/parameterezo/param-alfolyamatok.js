/**
 * VAHAP Paraméterező - Alfolyamatok (Subprocesses) Kezelő Komponens
 * Használat: <param-alfolyamatok @save="handleSave"></param-alfolyamatok>
 *
 * Funkcionalitás:
 * - Alfolyamatok (hiánypótlás, tényállás tisztázás, stb.) CRUD műveletek
 * - Alfolyamat lépések kezelése
 * - Beépítési pontok meghatározása (hol kapcsolódnak a fő workflow-hoz)
 * - Ismétlési szabályok
 */

const ParamAlfolyamatok = {
    name: 'param-alfolyamatok',

    components: {
        'param-tabla': ParamTabla
    },

    emits: ['save', 'change'],

    data() {
        return {
            alfolyamatok: [],
            selectedAlfolyamat: null,
            showEditor: false,
            showLepesEditor: false,
            showBeepitesEditor: false,
            selectedLepes: null,
            selectedBeepites: null,
            editMode: 'create',
            hasChanges: false,

            // Lépés típusok
            lepesTipusok: [
                { value: 'feldolgozas', label: 'Feldolgozás', icon: 'bi-gear' },
                { value: 'dokumentum_generalas', label: 'Dokumentum generálás', icon: 'bi-file-earmark-text' },
                { value: 'hatarido_beallitas', label: 'Határidő beállítás', icon: 'bi-calendar-event' },
                { value: 'ertesites', label: 'Értesítés', icon: 'bi-envelope' },
                { value: 'varakozas', label: 'Várakozás', icon: 'bi-hourglass' },
                { value: 'befogadas', label: 'Befogadás', icon: 'bi-inbox' },
                { value: 'dontes', label: 'Döntési pont', icon: 'bi-signpost-split' },
                { value: 'koordinacio', label: 'Koordináció', icon: 'bi-people' },
                { value: 'terep_munka', label: 'Terepmunka', icon: 'bi-geo-alt' },
                { value: 'kuldes', label: 'Küldés', icon: 'bi-send' }
            ]
        };
    },

    computed: {
        tableColumns() {
            return [
                { key: 'kod', label: 'Kód', sortable: true, width: '100px' },
                { key: 'nev', label: 'Alfolyamat neve', sortable: true },
                { key: 'funkciokod', label: 'Funkciókódok', sortable: false, width: '150px' },
                { key: 'ugytipusok', label: 'Ügytípusok', sortable: false, width: '120px',
                  format: (val) => val ? val.join(', ') : '-' },
                { key: 'lepesek_szama', label: 'Lépések', sortable: true, width: '80px',
                  format: (val, row) => row.lepesek ? row.lepesek.length : 0 },
                { key: 'ismetelheto', label: 'Ismételhető', sortable: true, type: 'boolean', width: '100px' },
                { key: 'aktiv', label: 'Aktív', sortable: true, type: 'boolean', width: '80px' }
            ];
        },

        lepesekTableColumns() {
            return [
                { key: 'sorrend', label: '#', sortable: true, width: '50px' },
                { key: 'uce', label: 'UCE kód', sortable: false, width: '120px' },
                { key: 'nev', label: 'Lépés neve', sortable: false },
                { key: 'tipus', label: 'Típus', sortable: false, width: '150px',
                  format: this.formatLepesTipus },
                { key: 'funkciokod', label: 'Funkció', sortable: false, width: '100px' },
                { key: 'kotelezo', label: 'Kötelező', sortable: false, type: 'boolean', width: '80px' }
            ];
        },

        beepitesiPontokTableColumns() {
            return [
                { key: 'uce', label: 'UCE kód', sortable: true, width: '120px' },
                { key: 'nev', label: 'Beépítési pont', sortable: true },
                { key: 'ugytipus', label: 'Ügytípus', sortable: true, width: '100px' },
                { key: 'feltetel', label: 'Feltétel', sortable: false, width: '180px' }
            ];
        },

        alfolyamatStatisztika() {
            return {
                osszes: this.alfolyamatok.length,
                aktiv: this.alfolyamatok.filter(a => a.aktiv).length,
                ismetelheto: this.alfolyamatok.filter(a => a.ismetelheto).length,
                vasut: this.alfolyamatok.filter(a => a.ugytipusok?.includes('V-044')).length,
                hajozas: this.alfolyamatok.filter(a => a.ugytipusok?.includes('H-052')).length
            };
        }
    },

    template: `
        <div class="param-alfolyamatok">
            <!-- Fejléc -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="mb-1">
                        <i class="bi bi-diagram-2"></i> Alfolyamatok (Subprocesses)
                    </h5>
                    <p class="text-muted small mb-0">
                        Workflow elágazások és alfolyamatok paraméterezése
                    </p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-success" @click="openCreateDialog">
                        <i class="bi bi-plus-circle"></i> Új alfolyamat
                    </button>
                    <button v-if="hasChanges" class="btn btn-primary" @click="saveAlfolyamatok">
                        <i class="bi bi-save"></i> Mentés
                    </button>
                </div>
            </div>

            <!-- Statisztika kártyák -->
            <div class="row g-3 mb-4">
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body py-2">
                            <h4 class="mb-0">{{ alfolyamatStatisztika.osszes }}</h4>
                            <small class="text-muted">Összes</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center border-success">
                        <div class="card-body py-2">
                            <h4 class="mb-0 text-success">{{ alfolyamatStatisztika.aktiv }}</h4>
                            <small class="text-muted">Aktív</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center border-info">
                        <div class="card-body py-2">
                            <h4 class="mb-0 text-info">{{ alfolyamatStatisztika.ismetelheto }}</h4>
                            <small class="text-muted">Ismételhető</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center border-primary">
                        <div class="card-body py-2">
                            <h4 class="mb-0 text-primary">{{ alfolyamatStatisztika.vasut }}</h4>
                            <small class="text-muted">Vasúti (V-044)</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center border-info">
                        <div class="card-body py-2">
                            <h4 class="mb-0 text-info">{{ alfolyamatStatisztika.hajozas }}</h4>
                            <small class="text-muted">Hajózási (H-052)</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Módosítás figyelmeztetés -->
            <div v-if="hasChanges" class="alert alert-warning d-flex align-items-center mb-3">
                <i class="bi bi-exclamation-triangle fs-4 me-2"></i>
                <div>
                    <strong>Nem mentett módosítások!</strong>
                    Az alfolyamatok módosultak, kattintson a Mentés gombra.
                </div>
            </div>

            <!-- Alfolyamatok táblázat -->
            <param-tabla
                :columns="tableColumns"
                :data="alfolyamatok"
                :actions="['edit', 'delete', 'view']"
                @edit="editAlfolyamat"
                @delete="deleteAlfolyamat"
                @view="viewAlfolyamat">
            </param-tabla>

            <!-- Alfolyamat szerkesztő modal -->
            <div v-if="showEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-diagram-2"></i>
                                {{ editMode === 'create' ? 'Új alfolyamat' : 'Alfolyamat szerkesztése' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeEditor"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <!-- Alapadatok -->
                                <div class="col-md-6">
                                    <label class="form-label required">Kód</label>
                                    <input type="text" class="form-control" v-model="selectedAlfolyamat.kod"
                                           placeholder="SUB-XXX" :disabled="editMode === 'edit'">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label required">Alfolyamat neve</label>
                                    <input type="text" class="form-control" v-model="selectedAlfolyamat.nev"
                                           placeholder="Pl. Hiánypótlási felszólítás">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Funkciókódok</label>
                                    <input type="text" class="form-control" v-model="selectedAlfolyamat.funkciokod"
                                           placeholder="F-0100, F-0101">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label required">Ügytípusok</label>
                                    <div class="d-flex gap-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="V-044"
                                                   v-model="selectedAlfolyamat.ugytipusok" id="ugy-v044">
                                            <label class="form-check-label" for="ugy-v044">V-044 (Vasút)</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="H-052"
                                                   v-model="selectedAlfolyamat.ugytipusok" id="ugy-h052">
                                            <label class="form-check-label" for="ugy-h052">H-052 (Hajózás)</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Leírás</label>
                                    <textarea class="form-control" v-model="selectedAlfolyamat.leiras" rows="2"
                                              placeholder="Az alfolyamat rövid leírása"></textarea>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-model="selectedAlfolyamat.ismetelheto" id="ismetelheto">
                                        <label class="form-check-label" for="ismetelheto">Ismételhető alfolyamat</label>
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="selectedAlfolyamat.ismetelheto">
                                    <label class="form-label">Max. ismétlések száma</label>
                                    <input type="number" class="form-control" v-model.number="selectedAlfolyamat.max_ismetles" min="1" max="10">
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-model="selectedAlfolyamat.aktiv" id="aktiv">
                                        <label class="form-check-label" for="aktiv">Aktív</label>
                                    </div>
                                </div>
                            </div>

                            <!-- Lépések -->
                            <div class="mt-4" v-if="editMode === 'edit'">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="mb-0">
                                        <i class="bi bi-list-ol"></i> Alfolyamat lépései
                                        <span class="badge bg-secondary ms-2">{{ selectedAlfolyamat.lepesek?.length || 0 }}</span>
                                    </h6>
                                    <button class="btn btn-sm btn-success" @click="openLepesEditor('create')">
                                        <i class="bi bi-plus"></i> Új lépés
                                    </button>
                                </div>
                                <param-tabla
                                    v-if="selectedAlfolyamat.lepesek?.length > 0"
                                    :columns="lepesekTableColumns"
                                    :data="selectedAlfolyamat.lepesek"
                                    :actions="['edit', 'delete']"
                                    @edit="openLepesEditor('edit', $event)"
                                    @delete="deleteLepes">
                                </param-tabla>
                                <div v-else class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> Még nincsenek lépések hozzáadva.
                                </div>
                            </div>

                            <!-- Beépítési pontok -->
                            <div class="mt-4" v-if="editMode === 'edit'">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="mb-0">
                                        <i class="bi bi-link-45deg"></i> Beépítési pontok
                                        <span class="badge bg-secondary ms-2">{{ selectedAlfolyamat.beepitesi_pontok?.length || 0 }}</span>
                                    </h6>
                                    <button class="btn btn-sm btn-success" @click="openBeepitesEditor('create')">
                                        <i class="bi bi-plus"></i> Új beépítési pont
                                    </button>
                                </div>
                                <param-tabla
                                    v-if="selectedAlfolyamat.beepitesi_pontok?.length > 0"
                                    :columns="beepitesiPontokTableColumns"
                                    :data="selectedAlfolyamat.beepitesi_pontok"
                                    :actions="['edit', 'delete']"
                                    @edit="openBeepitesEditor('edit', $event)"
                                    @delete="deleteBeepites">
                                </param-tabla>
                                <div v-else class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> Még nincsenek beépítési pontok definiálva.
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeEditor">Mégse</button>
                            <button type="button" class="btn btn-primary" @click="saveAlfolyamat">
                                <i class="bi bi-check-circle"></i> {{ editMode === 'create' ? 'Létrehozás' : 'Mentés' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lépés szerkesztő modal -->
            <div v-if="showLepesEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 1060;">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-list-check"></i>
                                {{ selectedLepes.id ? 'Lépés szerkesztése' : 'Új lépés' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeLepesEditor"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label class="form-label required">Sorrend</label>
                                    <input type="number" class="form-control" v-model.number="selectedLepes.sorrend" min="1">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label required">UCE kód</label>
                                    <input type="text" class="form-control" v-model="selectedLepes.uce" placeholder="UCE-HP-001">
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label required">Típus</label>
                                    <select class="form-select" v-model="selectedLepes.tipus">
                                        <option value="">Válasszon...</option>
                                        <option v-for="tipus in lepesTipusok" :key="tipus.value" :value="tipus.value">
                                            {{ tipus.label }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label required">Lépés neve</label>
                                    <input type="text" class="form-control" v-model="selectedLepes.nev" placeholder="Pl. Hiányok azonosítása">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Leírás</label>
                                    <textarea class="form-control" v-model="selectedLepes.leiras" rows="2"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Funkciókód</label>
                                    <input type="text" class="form-control" v-model="selectedLepes.funkciokod" placeholder="F-0100">
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check form-switch mt-4">
                                        <input class="form-check-input" type="checkbox" v-model="selectedLepes.kotelezo" id="lepes-kotelezo">
                                        <label class="form-check-label" for="lepes-kotelezo">Kötelező lépés</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeLepesEditor">Mégse</button>
                            <button type="button" class="btn btn-success" @click="saveLepes">
                                <i class="bi bi-check-circle"></i> Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Beépítés szerkesztő modal -->
            <div v-if="showBeepitesEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 1060;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-link"></i>
                                {{ selectedBeepites.uce ? 'Beépítési pont szerkesztése' : 'Új beépítési pont' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeBeepitesEditor"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label required">UCE kód</label>
                                    <input type="text" class="form-control" v-model="selectedBeepites.uce" placeholder="UCE-1993">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label required">Ügytípus</label>
                                    <select class="form-select" v-model="selectedBeepites.ugytipus">
                                        <option value="">Válasszon...</option>
                                        <option value="V-044">V-044 (Vasút)</option>
                                        <option value="H-052">H-052 (Hajózás)</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label required">Beépítési pont neve</label>
                                    <input type="text" class="form-control" v-model="selectedBeepites.nev"
                                           placeholder="Pl. Formai ellenőrzés után">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Feltétel</label>
                                    <input type="text" class="form-control" v-model="selectedBeepites.feltetel"
                                           placeholder="Pl. formai_hiba_van">
                                    <small class="text-muted">Az alfolyamat beépítésének feltétele</small>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeBeepitesEditor">Mégse</button>
                            <button type="button" class="btn btn-info" @click="saveBeepites">
                                <i class="bi bi-check-circle"></i> Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    methods: {
        // Alfolyamat CRUD
        openCreateDialog() {
            this.editMode = 'create';
            this.selectedAlfolyamat = {
                kod: '',
                nev: '',
                funkciokod: '',
                leiras: '',
                ugytipusok: [],
                ismetelheto: false,
                max_ismetles: 2,
                aktiv: true,
                lepesek: [],
                beepitesi_pontok: []
            };
            this.showEditor = true;
        },

        editAlfolyamat(alfolyamat) {
            this.editMode = 'edit';
            this.selectedAlfolyamat = JSON.parse(JSON.stringify(alfolyamat));
            this.showEditor = true;
        },

        viewAlfolyamat(alfolyamat) {
            this.editAlfolyamat(alfolyamat);
        },

        deleteAlfolyamat(alfolyamat) {
            if (confirm(`Biztosan törli: ${alfolyamat.nev}?`)) {
                const index = this.alfolyamatok.findIndex(a => a.id === alfolyamat.id);
                if (index > -1) {
                    this.alfolyamatok.splice(index, 1);
                    this.hasChanges = true;
                    this.$emit('change', this.alfolyamatok);
                }
            }
        },

        saveAlfolyamat() {
            if (!this.selectedAlfolyamat.kod || !this.selectedAlfolyamat.nev || !this.selectedAlfolyamat.ugytipusok?.length) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            if (this.editMode === 'create') {
                this.selectedAlfolyamat.id = Date.now();
                this.alfolyamatok.push(this.selectedAlfolyamat);
            } else {
                const index = this.alfolyamatok.findIndex(a => a.id === this.selectedAlfolyamat.id);
                if (index > -1) {
                    this.alfolyamatok[index] = this.selectedAlfolyamat;
                }
            }

            this.hasChanges = true;
            this.closeEditor();
            this.$emit('change', this.alfolyamatok);
        },

        closeEditor() {
            this.showEditor = false;
            this.selectedAlfolyamat = null;
        },

        // Lépés CRUD
        openLepesEditor(mode, lepes = null) {
            if (mode === 'create') {
                this.selectedLepes = {
                    uce: '',
                    nev: '',
                    sorrend: (this.selectedAlfolyamat.lepesek?.length || 0) + 1,
                    tipus: '',
                    funkciokod: null,
                    kotelezo: true,
                    leiras: ''
                };
            } else {
                this.selectedLepes = JSON.parse(JSON.stringify(lepes));
            }
            this.showLepesEditor = true;
        },

        saveLepes() {
            if (!this.selectedLepes.uce || !this.selectedLepes.nev || !this.selectedLepes.tipus) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            if (!this.selectedAlfolyamat.lepesek) {
                this.selectedAlfolyamat.lepesek = [];
            }

            if (this.selectedLepes.id) {
                const index = this.selectedAlfolyamat.lepesek.findIndex(l => l.id === this.selectedLepes.id);
                if (index > -1) {
                    this.selectedAlfolyamat.lepesek[index] = this.selectedLepes;
                }
            } else {
                this.selectedLepes.id = Date.now();
                this.selectedAlfolyamat.lepesek.push(this.selectedLepes);
            }

            // Sorrend szerint rendezés
            this.selectedAlfolyamat.lepesek.sort((a, b) => a.sorrend - b.sorrend);

            this.closeLepesEditor();
        },

        deleteLepes(lepes) {
            if (confirm(`Biztosan törli a lépést: ${lepes.nev}?`)) {
                const index = this.selectedAlfolyamat.lepesek.findIndex(l => l.id === lepes.id);
                if (index > -1) {
                    this.selectedAlfolyamat.lepesek.splice(index, 1);
                }
            }
        },

        closeLepesEditor() {
            this.showLepesEditor = false;
            this.selectedLepes = null;
        },

        // Beépítési pont CRUD
        openBeepitesEditor(mode, beepites = null) {
            if (mode === 'create') {
                this.selectedBeepites = {
                    uce: '',
                    nev: '',
                    ugytipus: '',
                    feltetel: ''
                };
            } else {
                this.selectedBeepites = JSON.parse(JSON.stringify(beepites));
            }
            this.showBeepitesEditor = true;
        },

        saveBeepites() {
            if (!this.selectedBeepites.uce || !this.selectedBeepites.nev || !this.selectedBeepites.ugytipus) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            if (!this.selectedAlfolyamat.beepitesi_pontok) {
                this.selectedAlfolyamat.beepitesi_pontok = [];
            }

            const existingIndex = this.selectedAlfolyamat.beepitesi_pontok.findIndex(b =>
                b.uce === this.selectedBeepites.uce && b.ugytipus === this.selectedBeepites.ugytipus
            );

            if (existingIndex > -1) {
                this.selectedAlfolyamat.beepitesi_pontok[existingIndex] = this.selectedBeepites;
            } else {
                this.selectedAlfolyamat.beepitesi_pontok.push(this.selectedBeepites);
            }

            this.closeBeepitesEditor();
        },

        deleteBeepites(beepites) {
            if (confirm(`Biztosan törli a beépítési pontot: ${beepites.nev}?`)) {
                const index = this.selectedAlfolyamat.beepitesi_pontok.findIndex(b =>
                    b.uce === beepites.uce && b.ugytipus === beepites.ugytipus
                );
                if (index > -1) {
                    this.selectedAlfolyamat.beepitesi_pontok.splice(index, 1);
                }
            }
        },

        closeBeepitesEditor() {
            this.showBeepitesEditor = false;
            this.selectedBeepites = null;
        },

        // Formázás
        formatLepesTipus(value) {
            const tipus = this.lepesTipusok.find(t => t.value === value);
            return tipus ? tipus.label : value;
        },

        // Adatok betöltése és mentése
        loadAlfolyamatok() {
            if (VIHARMockData?.parameterezo?.alfolyamatok) {
                this.alfolyamatok = JSON.parse(JSON.stringify(VIHARMockData.parameterezo.alfolyamatok));
                console.log('[param-alfolyamatok] Betöltve:', this.alfolyamatok.length, 'alfolyamat');
            }
        },

        saveAlfolyamatok() {
            console.log('✅ Alfolyamatok mentve:', this.alfolyamatok);
            this.hasChanges = false;
            this.$emit('save', this.alfolyamatok);
        }
    },

    mounted() {
        this.loadAlfolyamatok();
        console.log('[VAHAP] Alfolyamatok komponens betöltve');
    }
};

if (typeof window !== 'undefined') {
    window.ParamAlfolyamatok = ParamAlfolyamatok;
}
