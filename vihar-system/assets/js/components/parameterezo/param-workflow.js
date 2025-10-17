/**
 * VAHAP Paraméterező - Workflow Sablonok Komponens
 * Teljes CRUD funkcionalitás alfolyamat integrációval
 */

const ParamWorkflow = {
    name: 'param-workflow',
    components: { 'param-tabla': ParamTabla },
    emits: ['save', 'change'],

    data() {
        return {
            workflows: [],
            osszesAlfolyamat: [],

            // Editor states
            showEditor: false,
            editorMode: 'create',
            editedWorkflow: null,

            // Lépés editor
            showLepesEditor: false,
            lepesEditorMode: 'create',
            editedLepes: null,
            editedLepesIndex: -1,

            // Diagram
            showDiagramModal: false,
            selectedWorkflow: null,

            // Lépés típusok
            lepesTipusok: [
                { value: 'automatikus', label: 'Automatikus', color: 'secondary' },
                { value: 'feldolgozas', label: 'Feldolgozás', color: 'primary' },
                { value: 'dontes', label: 'Döntés', color: 'warning' },
                { value: 'lezaras', label: 'Lezárás', color: 'success' },
                { value: 'visszacsatolas', label: 'Visszacsatolás', color: 'info' }
            ]
        };
    },

    computed: {
        osszesSablon() { return this.workflows.length; },
        aktivSablon() { return this.workflows.filter(w => w.aktiv).length; },
        osszesLepes() { return this.workflows.reduce((sum, w) => sum + w.lepesek.length, 0); },
        alfolyamatBeepitesek() {
            let count = 0;
            this.workflows.forEach(w => {
                w.lepesek.forEach(l => {
                    if (l.alfolyamat_beepites && l.alfolyamat_beepites.enabled && l.alfolyamat_beepites.opcio) {
                        count += l.alfolyamat_beepites.opcio.length;
                    }
                });
            });
            return count;
        },
        sortedLepesek() {
            if (!this.editedWorkflow || !this.editedWorkflow.lepesek) return [];
            return [...this.editedWorkflow.lepesek].sort((a, b) => a.sorrend - b.sorrend);
        }
    },

    template: '<div class="param-workflow">' +
        '<div class="row g-3 mb-4">' +
            '<div class="col-md-3"><div class="card border-primary"><div class="card-body text-center"><div class="display-6 text-primary">{{ osszesSablon }}</div><small class="text-muted">Összes workflow sablon</small></div></div></div>' +
            '<div class="col-md-3"><div class="card border-success"><div class="card-body text-center"><div class="display-6 text-success">{{ aktivSablon }}</div><small class="text-muted">Aktív sablonok</small></div></div></div>' +
            '<div class="col-md-3"><div class="card border-info"><div class="card-body text-center"><div class="display-6 text-info">{{ osszesLepes }}</div><small class="text-muted">Összes lépés</small></div></div></div>' +
            '<div class="col-md-3"><div class="card border-warning"><div class="card-body text-center"><div class="display-6 text-warning">{{ alfolyamatBeepitesek }}</div><small class="text-muted">Alfolyamat beépítések</small></div></div></div>' +
        '</div>' +
        '<div class="card">' +
            '<div class="card-header bg-light d-flex justify-content-between align-items-center">' +
                '<h6 class="mb-0"><i class="bi bi-diagram-3"></i> Workflow sablonok</h6>' +
                '<button class="btn btn-sm btn-primary" @click="openCreateDialog"><i class="bi bi-plus-circle"></i> Új workflow</button>' +
            '</div>' +
            '<div class="card-body">' +
                '<div class="row g-3">' +
                    '<div v-for="workflow in workflows" :key="workflow.id" class="col-md-6">' +
                        '<div class="card h-100 border-primary">' +
                            '<div class="card-header bg-primary text-white">' +
                                '<strong>{{ workflow.nev }}</strong>' +
                                '<div class="small mt-1">' +
                                    '<span class="badge bg-light text-dark me-1">{{ workflow.kod }}</span>' +
                                    '<span class="badge bg-light text-dark me-1">{{ workflow.ugytipus }}</span>' +
                                    '<span v-if="workflow.alapertelmezett" class="badge bg-warning text-dark ms-1"><i class="bi bi-star-fill"></i></span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="card-body">' +
                                '<p class="text-muted small mb-3">{{ workflow.leiras }}</p>' +
                                '<div class="mb-3">' +
                                    '<h6 class="small mb-2"><i class="bi bi-list-ol"></i> Workflow lépések ({{ workflow.lepesek.length }})</h6>' +
                                    '<div class="workflow-steps-preview">' +
                                        '<div v-for="lepes in workflow.lepesek.slice(0,3)" :key="lepes.id" class="d-flex align-items-center mb-1 small">' +
                                            '<span class="badge bg-info me-2">{{ lepes.uce }}</span>' +
                                            '<span>{{ lepes.nev }}</span>' +
                                            '<span v-if="lepes.alfolyamat_beepites && lepes.alfolyamat_beepites.enabled" class="badge bg-warning ms-auto"><i class="bi bi-diagram-2"></i></span>' +
                                        '</div>' +
                                        '<div v-if="workflow.lepesek.length > 3" class="small text-muted">... és még {{ workflow.lepesek.length - 3 }} lépés</div>' +
                                    '</div>' +
                                '</div>' +
                                '<small class="text-muted"><i class="bi bi-clock-history"></i> {{ workflow.utolso_modositas }}</small>' +
                            '</div>' +
                            '<div class="card-footer bg-light">' +
                                '<div class="btn-group btn-group-sm w-100">' +
                                    '<button class="btn btn-outline-primary" @click="editWorkflow(workflow)"><i class="bi bi-pencil"></i> Szerkeszt</button>' +
                                    '<button class="btn btn-outline-info" @click="showDiagram(workflow)"><i class="bi bi-diagram-3"></i> Diagram</button>' +
                                    '<button class="btn btn-outline-danger" @click="deleteWorkflow(workflow)"><i class="bi bi-trash"></i></button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // Editor Modal
        '<div v-if="showEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">' +
            '<div class="modal-dialog modal-xl">' +
                '<div class="modal-content">' +
                    '<div class="modal-header bg-primary text-white">' +
                        '<h5 class="modal-title"><i class="bi bi-diagram-3"></i> {{ editorMode === "create" ? "Új workflow" : "Workflow szerkesztése" }}</h5>' +
                        '<button type="button" class="btn-close btn-close-white" @click="closeEditor"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="alert alert-info"><i class="bi bi-info-circle"></i> <strong>Figyelem:</strong> Ez egy egyszerűsített workflow szerkesztő. A teljes funkcionalitáshoz használja a workflow-sablonok.html oldalt.</div>' +
                        '<div class="row g-3">' +
                            '<div class="col-md-6"><label class="form-label">Workflow kód</label><input type="text" class="form-control" v-model="editedWorkflow.kod"></div>' +
                            '<div class="col-md-6"><label class="form-label">Ügytípus</label><select class="form-select" v-model="editedWorkflow.ugytipus"><option value="V-044">V-044 - Vasút</option><option value="H-052">H-052 - Hajózás</option></select></div>' +
                            '<div class="col-md-12"><label class="form-label">Workflow neve</label><input type="text" class="form-control" v-model="editedWorkflow.nev"></div>' +
                            '<div class="col-md-12"><label class="form-label">Leírás</label><textarea class="form-control" rows="2" v-model="editedWorkflow.leiras"></textarea></div>' +
                            '<div class="col-md-4"><label class="form-label">Típus</label><select class="form-select" v-model="editedWorkflow.tipus"><option value="alapertelmezett">Alapértelmezett</option><option value="sommas">Sommás</option></select></div>' +
                            '<div class="col-md-4"><div class="form-check mt-4"><input class="form-check-input" type="checkbox" v-model="editedWorkflow.aktiv" id="wf-aktiv"><label class="form-check-label" for="wf-aktiv">Aktív</label></div></div>' +
                            '<div class="col-md-4"><div class="form-check mt-4"><input class="form-check-input" type="checkbox" v-model="editedWorkflow.alapertelmezett" id="wf-alap"><label class="form-check-label" for="wf-alap">Alapértelmezett</label></div></div>' +
                        '</div>' +
                        '<hr class="my-4">' +
                        '<div class="d-flex justify-content-between align-items-center mb-3">' +
                            '<h6 class="mb-0"><i class="bi bi-list-ol"></i> Workflow lépések</h6>' +
                            '<button class="btn btn-sm btn-success" @click="openLepesEditor(\'create\', null)"><i class="bi bi-plus-circle"></i> Új lépés</button>' +
                        '</div>' +
                        '<div v-if="editedWorkflow.lepesek.length === 0" class="alert alert-info"><i class="bi bi-info-circle"></i> Még nincsenek lépések. Kattintson az "Új lépés" gombra!</div>' +
                        '<div v-else class="table-responsive">' +
                            '<table class="table table-sm table-hover">' +
                                '<thead class="table-light">' +
                                    '<tr>' +
                                        '<th style="width:50px;">Sorrend</th>' +
                                        '<th style="width:100px;">UCE</th>' +
                                        '<th>Lépés</th>' +
                                        '<th style="width:100px;">Típus</th>' +
                                        '<th style="width:100px;">Funkció</th>' +
                                        '<th style="width:80px;">Alfolyamat</th>' +
                                        '<th style="width:120px;">Műveletek</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                    '<tr v-for="(lepes, index) in sortedLepesek" :key="lepes.id">' +
                                        '<td class="text-center"><span class="badge bg-secondary">{{ lepes.sorrend }}</span></td>' +
                                        '<td><span class="badge bg-info">{{ lepes.uce }}</span></td>' +
                                        '<td>{{ lepes.nev }}<span v-if="lepes.kotelezo" class="badge bg-danger ms-1">K</span></td>' +
                                        '<td><span class="badge" :class="lepestipusBadge(lepes.tipus)">{{ lepes.tipus }}</span></td>' +
                                        '<td><small>{{ lepes.funkciokod }}</small></td>' +
                                        '<td class="text-center">' +
                                            '<span v-if="lepes.alfolyamat_beepites && lepes.alfolyamat_beepites.enabled" class="badge bg-warning" :title="\'Alfolyamatok: \' + lepes.alfolyamat_beepites.opcio.length"><i class="bi bi-diagram-2"></i> {{ lepes.alfolyamat_beepites.opcio.length }}</span>' +
                                            '<span v-else class="text-muted">-</span>' +
                                        '</td>' +
                                        '<td>' +
                                            '<div class="btn-group btn-group-sm">' +
                                                '<button class="btn btn-outline-primary" @click="openLepesEditor(\'edit\', lepes, index)" title="Szerkesztés"><i class="bi bi-pencil"></i></button>' +
                                                '<button class="btn btn-outline-danger" @click="deleteLepes(index)" title="Törlés"><i class="bi bi-trash"></i></button>' +
                                            '</div>' +
                                        '</td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-secondary" @click="closeEditor">Mégsem</button>' +
                        '<button type="button" class="btn btn-primary" @click="saveWorkflow"><i class="bi bi-save"></i> Mentés</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // Diagram Modal
        '<div v-if="showDiagramModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">' +
            '<div class="modal-dialog modal-fullscreen">' +
                '<div class="modal-content">' +
                    '<div class="modal-header bg-dark text-white">' +
                        '<h5 class="modal-title"><i class="bi bi-diagram-3"></i> Workflow Diagram: {{ selectedWorkflow.nev }}</h5>' +
                        '<button type="button" class="btn-close btn-close-white" @click="showDiagramModal = false"></button>' +
                    '</div>' +
                    '<div class="modal-body bg-light p-4">' +
                        '<div class="alert alert-info mb-4"><strong>{{ selectedWorkflow.kod }}</strong> - {{ selectedWorkflow.ugytipus }} | {{ selectedWorkflow.lepesek.length }} lépés</div>' +
                        '<div v-for="(lepes, index) in selectedWorkflow.lepesek" :key="lepes.id" class="mb-3">' +
                            '<div class="card border-primary">' +
                                '<div class="card-header bg-primary bg-opacity-10">' +
                                    '<span class="badge bg-secondary me-2">{{ lepes.sorrend }}</span>' +
                                    '<span class="badge bg-info me-2">{{ lepes.uce }}</span>' +
                                    '<strong>{{ lepes.nev }}</strong>' +
                                    '<span class="badge ms-2" :class="lepestipusBadge(lepes.tipus)">{{ lepes.tipus }}</span>' +
                                '</div>' +
                                '<div class="card-body">' +
                                    '<div class="small mb-2"><strong>Funkció:</strong> <span class="badge bg-dark">{{ lepes.funkciokod }}</span></div>' +
                                    '<div v-if="lepes.leiras" class="small text-muted mb-2">{{ lepes.leiras }}</div>' +
                                    '<div v-if="lepes.alfolyamat_beepites && lepes.alfolyamat_beepites.enabled" class="alert alert-warning mb-0 small">' +
                                        '<strong><i class="bi bi-diagram-2"></i> Alfolyamat beépítési pontok:</strong>' +
                                        '<ul class="mb-0 mt-1">' +
                                            '<li v-for="opcio in lepes.alfolyamat_beepites.opcio" :key="opcio.alfolyamat_kod">' +
                                                '<strong>{{ opcio.alfolyamat_kod }}</strong> ({{ opcio.feltetel }}, vissza: {{ opcio.visszateres_uce }})' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div v-if="index < selectedWorkflow.lepesek.length - 1" class="text-center my-2"><i class="bi bi-arrow-down-circle-fill text-primary" style="font-size:2rem;"></i></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-secondary" @click="showDiagramModal = false">Bezárás</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // Lépés Szerkesztő Modal (2. szint)
        '<div v-if="showLepesEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); z-index: 1060;">' +
            '<div class="modal-dialog modal-lg modal-dialog-scrollable">' +
                '<div class="modal-content">' +
                    '<div class="modal-header bg-success text-white">' +
                        '<h5 class="modal-title"><i class="bi bi-list-ol"></i> {{ lepesEditorMode === "create" ? "Új lépés" : "Lépés szerkesztése" }}</h5>' +
                        '<button type="button" class="btn-close btn-close-white" @click="closeLepesEditor"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="row g-3">' +
                            '<div class="col-md-3"><label class="form-label">Sorrend *</label><input type="number" class="form-control" v-model.number="editedLepes.sorrend" min="1"></div>' +
                            '<div class="col-md-4"><label class="form-label">UCE kód *</label><input type="text" class="form-control" v-model="editedLepes.uce" placeholder="UCE-1799"></div>' +
                            '<div class="col-md-5"><label class="form-label">Funkció kód *</label><input type="text" class="form-control" v-model="editedLepes.funkciokod" placeholder="F-0065"></div>' +
                            '<div class="col-md-12"><label class="form-label">Lépés neve *</label><input type="text" class="form-control" v-model="editedLepes.nev"></div>' +
                            '<div class="col-md-12"><label class="form-label">Leírás</label><textarea class="form-control" rows="2" v-model="editedLepes.leiras"></textarea></div>' +
                            '<div class="col-md-6"><label class="form-label">Típus *</label><select class="form-select" v-model="editedLepes.tipus">' +
                                '<option v-for="tipus in lepesTipusok" :key="tipus.value" :value="tipus.value">{{ tipus.label }}</option>' +
                            '</select></div>' +
                            '<div class="col-md-6">' +
                                '<div class="form-check form-switch mt-4"><input class="form-check-input" type="checkbox" v-model="editedLepes.kotelezo" id="lepes-kotelezo"><label class="form-check-label" for="lepes-kotelezo">Kötelező lépés</label></div>' +
                                '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" v-model="editedLepes.utolso_lepes" id="lepes-utolso"><label class="form-check-label" for="lepes-utolso">Utolsó lépés</label></div>' +
                            '</div>' +
                            // Alfolyamat beépítés
                            '<div class="col-md-12">' +
                                '<div class="card border-warning">' +
                                    '<div class="card-header bg-warning bg-opacity-10">' +
                                        '<div class="form-check form-switch">' +
                                            '<input class="form-check-input" type="checkbox" v-model="editedLepes.alfolyamat_beepites.enabled" id="alfolyamat-enabled">' +
                                            '<label class="form-check-label fw-bold" for="alfolyamat-enabled"><i class="bi bi-diagram-2"></i> Alfolyamat beépítési pontok</label>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div v-if="editedLepes.alfolyamat_beepites.enabled" class="card-body">' +
                                        '<div class="mb-3"><button class="btn btn-sm btn-warning" @click="addAlfolyamatOpcio"><i class="bi bi-plus-circle"></i> Alfolyamat opció hozzáadása</button></div>' +
                                        '<div v-for="(opcio, index) in editedLepes.alfolyamat_beepites.opcio" :key="index" class="card mb-2">' +
                                            '<div class="card-body">' +
                                                '<div class="row g-2">' +
                                                    '<div class="col-md-4"><label class="form-label small">Feltétel</label><input type="text" class="form-control form-control-sm" v-model="opcio.feltetel" placeholder="formai_hiba_van"></div>' +
                                                    '<div class="col-md-4"><label class="form-label small">Alfolyamat kód</label><select class="form-select form-select-sm" v-model="opcio.alfolyamat_kod">' +
                                                        '<option value="">-- Válasszon --</option>' +
                                                        '<option v-for="alf in osszesAlfolyamat" :key="alf.kod" :value="alf.kod">{{ alf.kod }} - {{ alf.nev }}</option>' +
                                                    '</select></div>' +
                                                    '<div class="col-md-3"><label class="form-label small">Visszatérés UCE</label><input type="text" class="form-control form-control-sm" v-model="opcio.visszateres_uce" placeholder="UCE-1794"></div>' +
                                                    '<div class="col-md-1 d-flex align-items-end"><button class="btn btn-sm btn-danger w-100" @click="removeAlfolyamatOpcio(index)"><i class="bi bi-trash"></i></button></div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            // Elágazás (csak döntés típusnál)
                            '<div v-if="editedLepes.tipus === \'dontes\'" class="col-md-12">' +
                                '<div class="card border-info">' +
                                    '<div class="card-header bg-info bg-opacity-10"><h6 class="mb-0"><i class="bi bi-share"></i> Elágazás (Döntési pont)</h6></div>' +
                                    '<div class="card-body">' +
                                        '<div class="mb-3"><label class="form-label">Feltétel neve</label><input type="text" class="form-control" v-model="editedLepes.elagazas.feltetel" placeholder="formai_vizsgalat"></div>' +
                                        '<div class="mb-3"><button class="btn btn-sm btn-info" @click="addUtvonal"><i class="bi bi-plus-circle"></i> Útvonal hozzáadása</button></div>' +
                                        '<div v-for="(utvonal, index) in editedLepes.elagazas.utvonalak" :key="index" class="card mb-2">' +
                                            '<div class="card-body">' +
                                                '<div class="row g-2">' +
                                                    '<div class="col-md-3"><label class="form-label small">Érték</label><input type="text" class="form-control form-control-sm" v-model="utvonal.ertek" placeholder="megfelelt"></div>' +
                                                    '<div class="col-md-4"><label class="form-label small">Útvonal neve</label><input type="text" class="form-control form-control-sm" v-model="utvonal.nev" placeholder="Formailag megfelelt"></div>' +
                                                    '<div class="col-md-2"><label class="form-label small">Következő UCE</label><input type="text" class="form-control form-control-sm" v-model="utvonal.kovetkezo_uce" placeholder="UCE-xxxx"></div>' +
                                                    '<div class="col-md-2"><label class="form-label small">Alfolyamat</label><input type="text" class="form-control form-control-sm" v-model="utvonal.alfolyamat" placeholder="SUB-xxx"></div>' +
                                                    '<div class="col-md-1 d-flex align-items-end"><button class="btn btn-sm btn-danger w-100" @click="removeUtvonal(index)"><i class="bi bi-trash"></i></button></div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-secondary" @click="closeLepesEditor">Mégsem</button>' +
                        '<button type="button" class="btn btn-success" @click="saveLepes"><i class="bi bi-save"></i> Lépés mentése</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>',

    methods: {
        loadWorkflows() {
            if (typeof VIHARMockData !== 'undefined' && VIHARMockData.parameterezo && VIHARMockData.parameterezo.workflow_sablonok) {
                this.workflows = JSON.parse(JSON.stringify(VIHARMockData.parameterezo.workflow_sablonok));
                console.log('[ParamWorkflow] Workflows betöltve:', this.workflows.length);
            }
        },
        loadAlfolyamatok() {
            if (typeof VIHARMockData !== 'undefined' && VIHARMockData.parameterezo && VIHARMockData.parameterezo.alfolyamatok) {
                this.osszesAlfolyamat = VIHARMockData.parameterezo.alfolyamatok;
                console.log('[ParamWorkflow] Alfolyamatok betöltve:', this.osszesAlfolyamat.length);
            }
        },

        // Workflow CRUD
        openCreateDialog() {
            this.editorMode = 'create';
            this.editedWorkflow = {
                id: Date.now(),
                kod: '',
                nev: '',
                ugytipus: 'V-044',
                tipus: 'alapertelmezett',
                leiras: '',
                aktiv: true,
                alapertelmezett: false,
                lepesek: [],
                utolso_modositas: new Date().toISOString().split('T')[0],
                modositotta: 'Rendszergazda'
            };
            this.showEditor = true;
        },

        editWorkflow(workflow) {
            this.editorMode = 'edit';
            this.editedWorkflow = JSON.parse(JSON.stringify(workflow));
            this.showEditor = true;
        },

        deleteWorkflow(workflow) {
            if (confirm('Biztosan törölni szeretné a "' + workflow.nev + '" workflow sablont?')) {
                const index = this.workflows.findIndex(w => w.id === workflow.id);
                if (index !== -1) {
                    this.workflows.splice(index, 1);
                    this.handleChange();
                    console.log('[ParamWorkflow] Workflow törölve:', workflow.kod);
                }
            }
        },

        saveWorkflow() {
            if (this.editorMode === 'create') {
                this.workflows.push(this.editedWorkflow);
                console.log('[ParamWorkflow] Új workflow létrehozva:', this.editedWorkflow.kod);
            } else {
                const index = this.workflows.findIndex(w => w.id === this.editedWorkflow.id);
                if (index !== -1) {
                    this.workflows[index] = this.editedWorkflow;
                    console.log('[ParamWorkflow] Workflow frissítve:', this.editedWorkflow.kod);
                }
            }
            this.closeEditor();
            this.handleChange();
        },

        closeEditor() {
            this.showEditor = false;
            this.editedWorkflow = null;
        },

        // Diagram
        showDiagram(workflow) {
            this.selectedWorkflow = workflow;
            this.showDiagramModal = true;
        },

        // Helpers
        lepestipusBadge(tipus) {
            const found = this.lepesTipusok.find(t => t.value === tipus);
            return found ? 'bg-' + found.color : 'bg-secondary';
        },

        handleChange() {
            this.$emit('change', { workflows: this.workflows });
        },

        // Lépés CRUD metódusok
        openLepesEditor(mode, lepes, index) {
            this.lepesEditorMode = mode;
            this.editedLepesIndex = index;
            if (mode === 'create') {
                this.editedLepes = {
                    id: Date.now(),
                    uce: '',
                    nev: '',
                    sorrend: this.editedWorkflow.lepesek.length + 1,
                    tipus: 'feldolgozas',
                    funkciokod: '',
                    kotelezo: true,
                    leiras: '',
                    utolso_lepes: false,
                    alfolyamat_beepites: {
                        enabled: false,
                        opcio: []
                    },
                    elagazas: {
                        tipus: 'dontes',
                        feltetel: '',
                        utvonalak: []
                    }
                };
            } else {
                this.editedLepes = JSON.parse(JSON.stringify(lepes));
                if (!this.editedLepes.alfolyamat_beepites) {
                    this.editedLepes.alfolyamat_beepites = { enabled: false, opcio: [] };
                }
                if (!this.editedLepes.elagazas) {
                    this.editedLepes.elagazas = { tipus: 'dontes', feltetel: '', utvonalak: [] };
                }
            }
            this.showLepesEditor = true;
        },

        closeLepesEditor() {
            this.showLepesEditor = false;
            this.editedLepes = null;
            this.editedLepesIndex = -1;
        },

        saveLepes() {
            if (!this.editedLepes.uce || !this.editedLepes.nev || !this.editedLepes.funkciokod) {
                alert('Kérjük, töltse ki a kötelező mezőket (UCE, Név, Funkció kód)!');
                return;
            }

            if (this.lepesEditorMode === 'create') {
                this.editedWorkflow.lepesek.push(this.editedLepes);
                console.log('[ParamWorkflow] Új lépés hozzáadva:', this.editedLepes.uce);
            } else {
                const index = this.editedWorkflow.lepesek.findIndex(l => l.id === this.editedLepes.id);
                if (index !== -1) {
                    this.editedWorkflow.lepesek[index] = this.editedLepes;
                    console.log('[ParamWorkflow] Lépés frissítve:', this.editedLepes.uce);
                }
            }
            this.closeLepesEditor();
        },

        deleteLepes(index) {
            const lepes = this.sortedLepesek[index];
            if (confirm('Biztosan törölni szeretné a "' + lepes.nev + '" lépést?')) {
                const realIndex = this.editedWorkflow.lepesek.findIndex(l => l.id === lepes.id);
                if (realIndex !== -1) {
                    this.editedWorkflow.lepesek.splice(realIndex, 1);
                    console.log('[ParamWorkflow] Lépés törölve:', lepes.uce);
                }
            }
        },

        // Alfolyamat beépítés metódusok
        addAlfolyamatOpcio() {
            this.editedLepes.alfolyamat_beepites.opcio.push({
                feltetel: '',
                alfolyamat_kod: '',
                visszateres_uce: ''
            });
        },

        removeAlfolyamatOpcio(index) {
            this.editedLepes.alfolyamat_beepites.opcio.splice(index, 1);
        },

        // Elágazás metódusok
        addUtvonal() {
            this.editedLepes.elagazas.utvonalak.push({
                ertek: '',
                nev: '',
                kovetkezo_uce: '',
                alfolyamat: ''
            });
        },

        removeUtvonal(index) {
            this.editedLepes.elagazas.utvonalak.splice(index, 1);
        }
    },

    mounted() {
        this.loadWorkflows();
        this.loadAlfolyamatok();
        console.log('[ParamWorkflow] Komponens inicializálva');
    }
};

if (typeof window !== 'undefined') {
    window.ParamWorkflow = ParamWorkflow;
}
