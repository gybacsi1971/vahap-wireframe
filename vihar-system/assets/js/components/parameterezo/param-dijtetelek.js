/**
 * VAHAP Paraméterező - Díjtételek Kezelő Komponens
 * Funkciók: F-0070 (Díjkalkulátor), F-0082 (Díjbekérő előállítása)
 * Használat: <param-dijtetelek :ugytipus="'V-044'" @save="handleSave"></param-dijtetelek>
 */

const ParamDijtetelek = {
    name: 'param-dijtetelek',
    components: {
        'param-tabla': ParamTabla
    },
    emits: ['save', 'change'],
    props: {
        ugytipus: {
            type: String,
            default: 'V-044',
            validator: (value) => ['V-044', 'H-052'].includes(value)
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dijak: [],
            kedvezmenyek: [],
            selectedDij: null,
            selectedKedvezmeny: null,
            showDijEditor: false,
            showKedvezmenyEditor: false,
            editMode: 'create',
            hasChanges: false,
            loading: false,  // API loading state
            error: null,     // API error state
            // Meta adatok
            metaAdatok: {
                utolso_modositas: '',
                ervenyesseg_kezdete: '',
                jogszabaly: '',
                megnevezes: ''
            }
        };
    },
    computed: {
        dijTableColumns() {
            return [
                { key: 'megnevezes', label: 'Díjtétel megnevezése', sortable: true },
                { key: 'osszeg', label: 'Összeg', sortable: true, width: '150px',
                  format: (val) => this.formatCurrency(val) },
                { key: 'tipus', label: 'Típus', sortable: true, width: '120px',
                  format: (val) => val === 'alapdij' ? 'Alapdíj' : 'Pótdíj' },
                { key: 'kotelezo', label: 'Kötelező', sortable: true, type: 'boolean', width: '100px' },
                { key: 'aktiv', label: 'Aktív', sortable: true, type: 'boolean', width: '80px' }
            ];
        },
        kedvezmenyTableColumns() {
            return [
                { key: 'megnevezes', label: 'Kedvezmény megnevezése', sortable: true },
                { key: 'szazalek', label: 'Mérték', sortable: true, width: '120px',
                  format: (val) => `-${val}%` },
                { key: 'aktiv', label: 'Aktív', sortable: true, type: 'boolean', width: '80px' }
            ];
        },
        alapdijOsszeg() {
            return this.dijak.filter(d => d.tipus === 'alapdij' && d.aktiv)
                .reduce((sum, d) => sum + d.osszeg, 0);
        },
        potdijOsszeg() {
            return this.dijak.filter(d => d.tipus === 'potdij' && d.aktiv)
                .reduce((sum, d) => sum + d.osszeg, 0);
        },
        dijStatisztika() {
            return {
                osszes: this.dijak.length,
                aktiv: this.dijak.filter(d => d.aktiv).length,
                alapdij: this.dijak.filter(d => d.tipus === 'alapdij').length,
                potdij: this.dijak.filter(d => d.tipus === 'potdij').length
            };
        },
        kedvezmenyStatisztika() {
            return {
                osszes: this.kedvezmenyek.length,
                aktiv: this.kedvezmenyek.filter(k => k.aktiv).length,
                maxKedvezmeny: Math.max(...this.kedvezmenyek.map(k => k.szazalek), 0)
            };
        }
    },
    template: `
        <div class="param-dijtetelek">
            <!-- Meta információk kártya -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <h6 class="mb-0">
                        <i class="bi bi-info-circle"></i> Díjtétel információk - {{ ugytipus }}
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><strong>Ügytípus megnevezése:</strong></label>
                                <input type="text" class="form-control" v-model="metaAdatok.megnevezes"
                                       :readonly="readonly" @input="hasChanges = true">
                            </div>
                            <div class="mb-3">
                                <label class="form-label"><strong>Jogszabályi alap:</strong></label>
                                <input type="text" class="form-control" v-model="metaAdatok.jogszabaly"
                                       :readonly="readonly" @input="hasChanges = true"
                                       placeholder="pl. 123/2023. (XII. 15.) Korm. rendelet">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label"><strong>Érvényesség kezdete:</strong></label>
                                <input type="date" class="form-control" v-model="metaAdatok.ervenyesseg_kezdete"
                                       :readonly="readonly" @input="hasChanges = true">
                            </div>
                            <div class="mb-3">
                                <label class="form-label"><strong>Utolsó módosítás:</strong></label>
                                <input type="date" class="form-control" v-model="metaAdatok.utolso_modositas"
                                       :readonly="readonly" @input="hasChanges = true">
                            </div>
                        </div>
                    </div>

                    <!-- Összesítő statisztika -->
                    <div class="row mt-3">
                        <div class="col-md-3">
                            <div class="p-3 bg-primary bg-opacity-10 rounded text-center">
                                <div class="fs-4 fw-bold text-primary">{{ dijStatisztika.osszes }}</div>
                                <div class="small">Összes díjtétel</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3 bg-success bg-opacity-10 rounded text-center">
                                <div class="fs-4 fw-bold text-success">{{ formatCurrency(alapdijOsszeg) }}</div>
                                <div class="small">Alapdíj összesen</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3 bg-info bg-opacity-10 rounded text-center">
                                <div class="fs-4 fw-bold text-info">{{ dijStatisztika.potdij }}</div>
                                <div class="small">Pótdíjak száma</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="p-3 bg-warning bg-opacity-10 rounded text-center">
                                <div class="fs-4 fw-bold text-warning">{{ kedvezmenyStatisztika.osszes }}</div>
                                <div class="small">Kedvezmények</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Díjtételek lista -->
            <div class="card mb-4">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="bi bi-cash-coin"></i> Díjtételek
                        <span class="badge bg-secondary ms-2">{{ dijStatisztika.osszes }} tétel</span>
                        <span class="badge bg-success ms-1">{{ dijStatisztika.aktiv }} aktív</span>
                    </h6>
                    <button v-if="!readonly" class="btn btn-success btn-sm" @click="openCreateDijDialog">
                        <i class="bi bi-plus-circle"></i> Új díjtétel
                    </button>
                </div>
                <div class="card-body">
                    <param-tabla
                        :columns="dijTableColumns"
                        :data="dijak"
                        :sortable="true"
                        :filterable="true"
                        :editable="!readonly"
                        :deletable="!readonly"
                        :striped="true"
                        :hover="true"
                        empty-text="Még nincsenek díjtételek definiálva"
                        @edit="editDij"
                        @delete="deleteDij">
                    </param-tabla>
                </div>
            </div>

            <!-- Kedvezmények lista -->
            <div class="card mb-4">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="bi bi-percent"></i> Kedvezmények
                        <span class="badge bg-secondary ms-2">{{ kedvezmenyStatisztika.osszes }} kedvezmény</span>
                        <span class="badge bg-success ms-1">{{ kedvezmenyStatisztika.aktiv }} aktív</span>
                    </h6>
                    <button v-if="!readonly" class="btn btn-warning btn-sm" @click="openCreateKedvezmenyDialog">
                        <i class="bi bi-plus-circle"></i> Új kedvezmény
                    </button>
                </div>
                <div class="card-body">
                    <param-tabla
                        :columns="kedvezmenyTableColumns"
                        :data="kedvezmenyek"
                        :sortable="true"
                        :filterable="true"
                        :editable="!readonly"
                        :deletable="!readonly"
                        :striped="true"
                        :hover="true"
                        empty-text="Még nincsenek kedvezmények definiálva"
                        @edit="editKedvezmeny"
                        @delete="deleteKedvezmeny">
                    </param-tabla>
                </div>
            </div>

            <!-- Díjtétel szerkesztő modal -->
            <div v-if="showDijEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-cash-coin"></i>
                                {{ editMode === 'create' ? 'Új díjtétel hozzáadása' : 'Díjtétel szerkesztése' }}
                            </h5>
                            <button type="button" class="btn-close" @click="closeDijEditor"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Megnevezés <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="selectedDij.megnevezes"
                                       placeholder="pl. Előzetes alkalmassági vizsgálat alapdíja" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Összeg (Ft) <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model.number="selectedDij.osszeg"
                                               min="0" step="1000" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Típus <span class="text-danger">*</span></label>
                                        <select class="form-select" v-model="selectedDij.tipus" required>
                                            <option value="alapdij">Alapdíj</option>
                                            <option value="potdij">Pótdíj</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Megjegyzés</label>
                                <textarea class="form-control" v-model="selectedDij.megjegyzes" rows="3"
                                          placeholder="Részletes leírás a díjtételről..."></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedDij.kotelezo"
                                               id="dijKotelezo">
                                        <label class="form-check-label" for="dijKotelezo">
                                            Kötelező díjtétel
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedDij.aktiv"
                                               id="dijAktiv">
                                        <label class="form-check-label" for="dijAktiv">
                                            Aktív
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeDijEditor">Mégse</button>
                            <button type="button" class="btn btn-primary" @click="saveDij">
                                <i class="bi bi-save"></i> Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kedvezmény szerkesztő modal -->
            <div v-if="showKedvezmenyEditor" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-percent"></i>
                                {{ editMode === 'create' ? 'Új kedvezmény hozzáadása' : 'Kedvezmény szerkesztése' }}
                            </h5>
                            <button type="button" class="btn-close" @click="closeKedvezmenyEditor"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Megnevezés <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="selectedKedvezmeny.megnevezes"
                                       placeholder="pl. Állami tulajdonú kikötő" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Kedvezmény mértéke (%) <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" v-model.number="selectedKedvezmeny.szazalek"
                                       min="0" max="100" step="1" required>
                                <div class="form-text">0-100 közötti érték</div>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="selectedKedvezmeny.aktiv"
                                       id="kedvezmenyAktiv">
                                <label class="form-check-label" for="kedvezmenyAktiv">
                                    Aktív kedvezmény
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeKedvezmenyEditor">Mégse</button>
                            <button type="button" class="btn btn-primary" @click="saveKedvezmeny">
                                <i class="bi bi-save"></i> Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        async loadDijak() {
            console.log('[param-dijtetelek] Loading díjak for:', this.ugytipus);
            this.loading = true;
            this.error = null;

            try {
                const response = await VAHAP_API.get(
                    VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus)
                );

                console.log('[param-dijtetelek] API response:', response);

                if (response && response.ugytipus) {
                    this.dijak = response.dijak || [];
                    this.kedvezmenyek = response.kedvezmenyek || [];
                    this.metaAdatok = {
                        megnevezes: response.ugytipus.megnevezes || '',
                        jogszabaly: response.ugytipus.jogszabaly || '',
                        ervenyesseg_kezdete: response.ugytipus.created_at?.split(' ')[0] || '',
                        utolso_modositas: response.ugytipus.updated_at?.split(' ')[0] || ''
                    };
                    console.log('[param-dijtetelek] Loaded', this.dijak.length, 'díjak,', this.kedvezmenyek.length, 'kedvezmények');
                } else {
                    throw new Error('Érvénytelen API válasz');
                }

                this.hasChanges = false;

            } catch (err) {
                console.error('[param-dijtetelek] Hiba a betöltés során:', err);
                this.error = `Hiba a díjak betöltése során: ${err.message}`;
                this.dijak = [];
                this.kedvezmenyek = [];
            } finally {
                this.loading = false;
            }
        },

        openCreateDijDialog() {
            this.editMode = 'create';
            this.selectedDij = {
                megnevezes: '',
                osszeg: 0,
                tipus: 'potdij',
                kotelezo: false,
                aktiv: true,
                megjegyzes: ''
            };
            this.showDijEditor = true;
        },

        editDij(dij) {
            this.editMode = 'edit';
            this.selectedDij = { ...dij };
            this.showDijEditor = true;
        },

        async saveDij() {
            if (!this.selectedDij.megnevezes || this.selectedDij.osszeg <= 0) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                if (this.editMode === 'create') {
                    // POST - Új díj létrehozása
                    await VAHAP_API.post(
                        VAHAP_API.endpoints.parameterezo.dijtetelek(this.ugytipus),
                        this.selectedDij
                    );
                } else {
                    // PUT - Díj módosítása
                    await VAHAP_API.put(
                        VAHAP_API.endpoints.parameterezo.dijById(this.selectedDij.id),
                        this.selectedDij
                    );
                }

                // Újratöltés a szerverről
                await this.loadDijak();

                this.hasChanges = true;
                this.closeDijEditor();
                this.$emit('change', { dijak: this.dijak, kedvezmenyek: this.kedvezmenyek });

            } catch (err) {
                console.error('[param-dijtetelek] Hiba a díj mentése során:', err);
                this.error = `Hiba a díj mentése során: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },

        async deleteDij(dij) {
            if (!confirm(`Biztosan törli: ${dij.megnevezes}?`)) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await VAHAP_API.delete(
                    VAHAP_API.endpoints.parameterezo.dijById(dij.id)
                );

                // Újratöltés a szerverről
                await this.loadDijak();

                this.hasChanges = true;
                this.$emit('change', { dijak: this.dijak, kedvezmenyek: this.kedvezmenyek });

            } catch (err) {
                console.error('[param-dijtetelek] Hiba a díj törlése során:', err);
                this.error = `Hiba a díj törlése során: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },

        closeDijEditor() {
            this.showDijEditor = false;
            this.selectedDij = null;
        },

        openCreateKedvezmenyDialog() {
            this.editMode = 'create';
            this.selectedKedvezmeny = {
                megnevezes: '',
                szazalek: 0,
                aktiv: true
            };
            this.showKedvezmenyEditor = true;
        },

        editKedvezmeny(kedv) {
            this.editMode = 'edit';
            this.selectedKedvezmeny = { ...kedv };
            this.showKedvezmenyEditor = true;
        },

        async saveKedvezmeny() {
            if (!this.selectedKedvezmeny.megnevezes || this.selectedKedvezmeny.szazalek <= 0) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                if (this.editMode === 'create') {
                    // POST - Új kedvezmény létrehozása
                    await VAHAP_API.post(
                        VAHAP_API.endpoints.parameterezo.kedvezmenyek(this.ugytipus),
                        this.selectedKedvezmeny
                    );
                } else {
                    // PUT - Kedvezmény módosítása
                    await VAHAP_API.put(
                        VAHAP_API.endpoints.parameterezo.kedvezmenyById(this.selectedKedvezmeny.id),
                        this.selectedKedvezmeny
                    );
                }

                // Újratöltés a szerverről
                await this.loadDijak();

                this.hasChanges = true;
                this.closeKedvezmenyEditor();
                this.$emit('change', { dijak: this.dijak, kedvezmenyek: this.kedvezmenyek });

            } catch (err) {
                console.error('[param-dijtetelek] Hiba a kedvezmény mentése során:', err);
                this.error = `Hiba a kedvezmény mentése során: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },

        async deleteKedvezmeny(kedv) {
            if (!confirm(`Biztosan törli: ${kedv.megnevezes}?`)) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await VAHAP_API.delete(
                    VAHAP_API.endpoints.parameterezo.kedvezmenyById(kedv.id)
                );

                // Újratöltés a szerverről
                await this.loadDijak();

                this.hasChanges = true;
                this.$emit('change', { dijak: this.dijak, kedvezmenyek: this.kedvezmenyek });

            } catch (err) {
                console.error('[param-dijtetelek] Hiba a kedvezmény törlése során:', err);
                this.error = `Hiba a kedvezmény törlése során: ${err.message}`;
            } finally {
                this.loading = false;
            }
        },

        closeKedvezmenyEditor() {
            this.showKedvezmenyEditor = false;
            this.selectedKedvezmeny = null;
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('hu-HU', {
                style: 'currency',
                currency: 'HUF',
                maximumFractionDigits: 0
            }).format(value);
        }
    },
    async mounted() {
        await this.loadDijak();
    },
    watch: {
        ugytipus() {
            this.loadDijak();
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamDijtetelek = ParamDijtetelek;
}
