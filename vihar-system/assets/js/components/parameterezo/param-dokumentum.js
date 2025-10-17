/**
 * VAHAP Paraméterező - Dokumentum Sablon Kezelő Komponens
 * Funkciók: F-0091 (Végzés), F-0092 (Határozat), F-0093 (Igazolás), F-0094 (Tájékoztatás), F-0095 (Hirdetmény)
 * Használat: <param-dokumentum :sablon-tipus="'vegzes'" @save="handleSave"></param-dokumentum>
 */

const ParamDokumentum = {
    name: 'param-dokumentum',
    components: {
        'param-tabla': ParamTabla
    },
    emits: ['save', 'change'],
    props: {
        sablonTipus: {
            type: String,
            default: 'vegzes',
            validator: (value) => ['vegzes', 'hatarozat', 'igazolas', 'tajekoztatas', 'hirdetmeny'].includes(value)
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            sablonok: [],
            selectedSablon: null,
            showEditor: false,
            showPreview: false,
            editMode: 'create',
            previewData: {
                UGYAZONOSITO: 'VAHAP-V-2024-001234',
                UGYTIPUS: 'V-044',
                UGYFEL_NEV: 'Minta János',
                UGYFEL_CIM: '1011 Budapest, Fő utca 1.',
                DATUM: new Date().toLocaleDateString('hu-HU'),
                HATARIDO: new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('hu-HU'),
                UGYINTEZO_NEV: 'Dr. Szabó Péter',
                UGYINTEZO_BEOSZTAS: 'vezető ügyintéző',
                SZERVEZET: 'Építési és Közlekedési Minisztérium',
                HATAROZAT_SZAM: 'EKM/V/2024/12345'
            },
            hasChanges: false,
            editorSchema: []
        };
    },
    computed: {
        sablonFunkciokod() {
            const kodok = {
                'vegzes': 'F-0091',
                'hatarozat': 'F-0092',
                'igazolas': 'F-0093',
                'tajekoztatas': 'F-0094',
                'hirdetmeny': 'F-0095'
            };
            return kodok[this.sablonTipus];
        },
        sablonCim() {
            const cimek = {
                'vegzes': 'Végzés sablonok',
                'hatarozat': 'Határozat sablonok',
                'igazolas': 'Igazolás sablonok',
                'tajekoztatas': 'Tájékoztatás sablonok',
                'hirdetmeny': 'Hirdetmény sablonok'
            };
            return cimek[this.sablonTipus];
        },
        tableColumns() {
            return [
                { key: 'nev', label: 'Sablon neve', sortable: true },
                { key: 'kod', label: 'Kód', sortable: true, width: '120px' },
                { key: 'verzio', label: 'Verzió', sortable: true, width: '80px' },
                { key: 'aktiv', label: 'Aktív', sortable: true, type: 'boolean', width: '80px' },
                { key: 'modositva', label: 'Módosítva', sortable: true, type: 'date', width: '120px' }
            ];
        },
        availablePlaceholders() {
            return [
                { kod: '@UGYAZONOSITO@', leiras: 'Ügy azonosító (pl. VAHAP-V-2024-001234)' },
                { kod: '@UGYTIPUS@', leiras: 'Ügytípus kód (V-044 vagy H-052)' },
                { kod: '@UGYFEL_NEV@', leiras: 'Ügyfél teljes neve' },
                { kod: '@UGYFEL_CIM@', leiras: 'Ügyfél címe' },
                { kod: '@DATUM@', leiras: 'Mai dátum' },
                { kod: '@HATARIDO@', leiras: 'Számított határidő' },
                { kod: '@UGYINTEZO_NEV@', leiras: 'Ügyintéző neve' },
                { kod: '@UGYINTEZO_BEOSZTAS@', leiras: 'Ügyintéző beosztása' },
                { kod: '@SZERVEZET@', leiras: 'Szervezet neve' },
                { kod: '@HATAROZAT_SZAM@', leiras: 'Határozat száma' },
                { kod: '@TARGY@', leiras: 'Eljárás tárgya' },
                { kod: '@INDOKLAS@', leiras: 'Döntés indoklása' },
                { kod: '@JOGORVOSLAT@', leiras: 'Jogorvoslati információk' }
            ];
        }
    },
    template: `
        <div class="param-dokumentum">
            <!-- Fejléc -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="mb-1">
                        <i class="bi bi-file-earmark-text"></i> {{ sablonCim }}
                        <span class="badge bg-primary ms-2">{{ sablonFunkciokod }}</span>
                    </h5>
                    <p class="text-muted small mb-0">
                        Összesen: <strong>{{ sablonok.length }}</strong> sablon,
                        Aktív: <strong>{{ sablonok.filter(s => s.aktiv).length }}</strong>
                    </p>
                </div>
                <div class="btn-group">
                    <button v-if="!readonly"
                            class="btn btn-success"
                            @click="openCreateDialog">
                        <i class="bi bi-plus-circle"></i> Új sablon
                    </button>
                    <button v-if="selectedSablon"
                            class="btn btn-outline-secondary"
                            @click="showPreview = !showPreview">
                        <i class="bi" :class="showPreview ? 'bi-pencil' : 'bi-eye'"></i>
                        {{ showPreview ? 'Szerkesztés' : 'Előnézet' }}
                    </button>
                    <button v-if="hasChanges && !readonly"
                            class="btn btn-primary"
                            @click="saveSablonok">
                        <i class="bi bi-save"></i> Mentés
                    </button>
                </div>
            </div>

            <!-- Módosítás figyelmeztetés -->
            <div v-if="hasChanges" class="alert alert-warning d-flex align-items-center mb-3">
                <i class="bi bi-exclamation-triangle fs-4 me-2"></i>
                <div>
                    <strong>Nem mentett módosítások!</strong>
                    A sablonok módosultak, kattintson a Mentés gombra a változtatások alkalmazásához.
                </div>
            </div>

            <!-- Placeholder súgó -->
            <div class="card mb-3 border-info">
                <div class="card-header bg-info text-white">
                    <i class="bi bi-info-circle"></i> Használható helyettesítő változók
                    <button class="btn btn-sm btn-light float-end"
                            @click="copyPlaceholders">
                        <i class="bi bi-clipboard"></i> Összes másolása
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div v-for="ph in availablePlaceholders"
                             :key="ph.kod"
                             class="col-md-6 mb-2">
                            <div class="d-flex align-items-center">
                                <code class="bg-light p-1 rounded me-2 flex-grow-1">{{ ph.kod }}</code>
                                <small class="text-muted">{{ ph.leiras }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sablon lista -->
            <div v-if="!showPreview">
                <param-tabla
                    :columns="tableColumns"
                    :data="sablonok"
                    :sortable="true"
                    :filterable="true"
                    :editable="!readonly"
                    :deletable="!readonly"
                    :striped="true"
                    :hover="true"
                    empty-text="Még nincsenek sablonok definiálva"
                    @edit="editSablon"
                    @delete="deleteSablon">
                </param-tabla>
            </div>

            <!-- Sablon előnézet -->
            <div v-else-if="selectedSablon" class="card">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="bi bi-file-earmark-text"></i>
                            <strong>{{ selectedSablon.nev }}</strong>
                            <span class="badge bg-secondary ms-2">{{ selectedSablon.kod }}</span>
                            <span class="badge bg-info ms-1">v{{ selectedSablon.verzio }}</span>
                        </div>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary"
                                    @click="downloadPreview">
                                <i class="bi bi-download"></i> PDF letöltés
                            </button>
                            <button class="btn btn-outline-secondary"
                                    @click="showPreview = false">
                                <i class="bi bi-x"></i> Bezárás
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body bg-white p-5" style="min-height: 500px;">
                    <div class="dokumentum-preview" v-html="renderSablon(selectedSablon.tartalom)"></div>
                </div>
            </div>

            <!-- Sablon szerkesztő modal -->
            <div v-if="showEditor" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi" :class="editMode === 'create' ? 'bi-plus-circle' : 'bi-pencil'"></i>
                                {{ editMode === 'create' ? 'Új sablon' : 'Sablon szerkesztése' }}
                            </h5>
                            <button type="button" class="btn-close" @click="closeEditor"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="handleSaveSablon">
                                <!-- Alapadatok -->
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Sablon neve <span class="text-danger">*</span></label>
                                        <input type="text"
                                               class="form-control"
                                               v-model="selectedSablon.nev"
                                               required
                                               placeholder="pl. Végzés - Hatáskör vizsgálat elutasítás">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Sablon kód <span class="text-danger">*</span></label>
                                        <input type="text"
                                               class="form-control"
                                               v-model="selectedSablon.kod"
                                               required
                                               placeholder="pl. VEG-001">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Verzió</label>
                                        <input type="text"
                                               class="form-control"
                                               v-model="selectedSablon.verzio"
                                               readonly>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <label class="form-label">Leírás</label>
                                        <input type="text"
                                               class="form-control"
                                               v-model="selectedSablon.leiras"
                                               placeholder="Rövid leírás a sablon használatáról">
                                    </div>
                                </div>

                                <div class="form-check mb-3">
                                    <input type="checkbox"
                                           class="form-check-input"
                                           id="aktivCheckbox"
                                           v-model="selectedSablon.aktiv">
                                    <label class="form-check-label" for="aktivCheckbox">
                                        Aktív sablon (használható az ügyintézésben)
                                    </label>
                                </div>

                                <!-- Sablon tartalom szerkesztő -->
                                <div class="mb-3">
                                    <label class="form-label">Sablon tartalom <span class="text-danger">*</span></label>
                                    <div class="alert alert-info small">
                                        <i class="bi bi-lightbulb"></i>
                                        <strong>Tipp:</strong> Használja a fenti @ változókat a dinamikus tartalomhoz.
                                        A sablon HTML formázást támogat.
                                    </div>
                                    <textarea class="form-control font-monospace"
                                              v-model="selectedSablon.tartalom"
                                              rows="15"
                                              required
                                              placeholder="Írja be a sablon tartalmát..."></textarea>
                                </div>

                                <!-- Élő előnézet -->
                                <div class="card border-secondary">
                                    <div class="card-header bg-light">
                                        <i class="bi bi-eye"></i> Élő előnézet
                                    </div>
                                    <div class="card-body bg-white">
                                        <div v-html="renderSablon(selectedSablon.tartalom)"></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeEditor">
                                <i class="bi bi-x-circle"></i> Mégse
                            </button>
                            <button v-if="editMode === 'edit'"
                                    type="button"
                                    class="btn btn-info"
                                    @click="cloneSablon">
                                <i class="bi bi-files"></i> Klónozás új verzióként
                            </button>
                            <button type="button" class="btn btn-primary" @click="handleSaveSablon">
                                <i class="bi bi-check-circle"></i> Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        loadSablonok() {
            // Betöltés mock adatokból
            const mockKey = 'dokumentum_sablonok';
            console.log('[param-dokumentum] Loading sablonTipus:', this.sablonTipus);

            if (typeof VIHARMockData !== 'undefined' && VIHARMockData.parameterezo && VIHARMockData.parameterezo[mockKey]) {
                const allSablonok = VIHARMockData.parameterezo[mockKey];
                console.log('[param-dokumentum] Available types:', Object.keys(allSablonok));
                this.sablonok = JSON.parse(JSON.stringify(
                    allSablonok[this.sablonTipus] || []
                ));
                console.log('[param-dokumentum] Loaded', this.sablonok.length, 'sablonok');
            } else {
                console.warn('[param-dokumentum] Mock data not found');
            }
            this.hasChanges = false;
        },

        openCreateDialog() {
            this.editMode = 'create';
            this.selectedSablon = {
                id: Date.now(),
                nev: '',
                kod: '',
                verzio: '1.0',
                leiras: '',
                tartalom: this.getDefaultTemplate(),
                aktiv: true,
                letrehozva: new Date().toISOString(),
                modositva: new Date().toISOString()
            };
            this.showEditor = true;
        },

        editSablon(sablon) {
            this.editMode = 'edit';
            this.selectedSablon = { ...sablon };
            this.showEditor = true;
        },

        handleSaveSablon() {
            if (!this.selectedSablon.nev || !this.selectedSablon.kod || !this.selectedSablon.tartalom) {
                alert('Kérem töltse ki a kötelező mezőket!');
                return;
            }

            if (this.editMode === 'create') {
                this.sablonok.push({ ...this.selectedSablon });
            } else {
                const index = this.sablonok.findIndex(s => s.id === this.selectedSablon.id);
                if (index > -1) {
                    // Verzió növelése módosításkor
                    const currentVersion = parseFloat(this.selectedSablon.verzio);
                    this.selectedSablon.verzio = (currentVersion + 0.1).toFixed(1);
                    this.selectedSablon.modositva = new Date().toISOString();
                    this.sablonok[index] = { ...this.selectedSablon };
                }
            }

            this.hasChanges = true;
            this.closeEditor();
            this.$emit('change', this.sablonok);
        },

        cloneSablon() {
            const cloned = {
                ...this.selectedSablon,
                id: Date.now(),
                nev: this.selectedSablon.nev + ' (másolat)',
                kod: this.selectedSablon.kod + '-COPY',
                verzio: '1.0',
                letrehozva: new Date().toISOString(),
                modositva: new Date().toISOString()
            };

            this.sablonok.push(cloned);
            this.hasChanges = true;
            this.closeEditor();
            this.$emit('change', this.sablonok);
        },

        deleteSablon(sablon) {
            const index = this.sablonok.findIndex(s => s.id === sablon.id);
            if (index > -1) {
                this.sablonok.splice(index, 1);
                this.hasChanges = true;
                this.$emit('change', this.sablonok);
            }
        },

        closeEditor() {
            this.showEditor = false;
            this.selectedSablon = null;
        },

        saveSablonok() {
            this.$emit('save', {
                sablonTipus: this.sablonTipus,
                sablonok: this.sablonok
            });
            this.hasChanges = false;
            console.log('✅ Sablonok mentve:', this.sablonCim);
        },

        renderSablon(tartalom) {
            if (!tartalom) return '';

            let rendered = tartalom;

            // Helyettesítő változók cseréje
            Object.keys(this.previewData).forEach(key => {
                const placeholder = `@${key}@`;
                const value = this.previewData[key];
                rendered = rendered.replace(new RegExp(placeholder, 'g'), `<strong>${value}</strong>`);
            });

            return rendered;
        },

        getDefaultTemplate() {
            const templates = {
                'vegzes': `<h3 style="text-align: center;">VÉGZÉS</h3>
<p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@<br>
<strong>Ügytípus:</strong> @UGYTIPUS@</p>

<p><strong>@SZERVEZET@</strong><br>
mint első fokú hatóság</p>

<p><strong>@UGYFEL_NEV@</strong> (@UGYFEL_CIM@) kérelmező kérelmét az alábbi rendelkezésben részesíti:</p>

<h4>RENDELKEZŐ RÉSZ</h4>
<p>[A rendelkezés tartalma]</p>

<h4>INDOKOLÁS</h4>
<p>@INDOKLAS@</p>

<h4>JOGORVOSLAT</h4>
<p>@JOGORVOSLAT@</p>

<p>Kelt: @DATUM@</p>
<p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>`,

                'hatarozat': `<h3 style="text-align: center;">HATÁROZAT</h3>
<p><strong>Határozat száma:</strong> @HATAROZAT_SZAM@<br>
<strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p>

<p><strong>@SZERVEZET@</strong> mint első fokú hatóság az alábbi határozatot hozza:</p>

<h4>RENDELKEZŐ RÉSZ</h4>
<p>[A határozat rendelkező része]</p>

<h4>INDOKOLÁS</h4>
<p>@INDOKLAS@</p>

<p>Kelt: @DATUM@</p>
<p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>`,

                'igazolas': `<h3 style="text-align: center;">IGAZOLÁS</h3>
<p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p>

<p>Igazolom, hogy <strong>@UGYFEL_NEV@</strong> (@UGYFEL_CIM@) az alábbi eljárásban részt vett:</p>

<p>[Az igazolás tartalma]</p>

<p>Kelt: @DATUM@</p>
<p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@<br>@SZERVEZET@</p>`,

                'tajekoztatas': `<h3 style="text-align: center;">TÁJÉKOZTATÁS</h3>
<p><strong>Címzett:</strong> @UGYFEL_NEV@<br>
<strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p>

<p>Tisztelt @UGYFEL_NEV@!</p>

<p>Tájékoztatjuk, hogy [a tájékoztatás tartalma]</p>

<p>Kelt: @DATUM@</p>
<p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>`,

                'hirdetmeny': `<h3 style="text-align: center;">HIRDETMÉNY</h3>
<p><strong>@SZERVEZET@</strong></p>
<p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p>

<p>Hirdetményi úton értesítjük az érintetteket, hogy [a hirdetmény tartalma]</p>

<p>A hirdetmény kifüggesztve: @DATUM@</p>
<p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>`
            };

            return templates[this.sablonTipus] || '';
        },

        copyPlaceholders() {
            const text = this.availablePlaceholders.map(ph => ph.kod).join(' ');
            navigator.clipboard.writeText(text).then(() => {
                alert('Változók a vágólapra másolva!');
            });
        },

        downloadPreview() {
            alert('PDF generálás funkció (jövőbeli fejlesztés)');
            console.log('PDF letöltés:', this.selectedSablon.nev);
        }
    },
    mounted() {
        this.loadSablonok();
    },
    watch: {
        sablonTipus() {
            this.loadSablonok();
            this.showPreview = false;
            this.selectedSablon = null;
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamDokumentum = ParamDokumentum;
}
