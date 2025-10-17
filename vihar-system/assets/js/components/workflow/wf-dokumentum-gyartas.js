/**
 * VAHAP Workflow Komponens - Dokumentum gyártás
 * Dokumentumok generálása sablonok alapján (F-0091 - F-0095)
 */

const WfDokumentumGyartas = {
    name: 'wf-dokumentum-gyartas',

    props: {
        ugy: {
            type: Object,
            required: true
        },
        stepData: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['action', 'complete'],

    data() {
        return {
            // Dokumentum sablonok
            templates: {
                vegzes: {
                    kod: 'F-0091',
                    nev: 'Végzés',
                    icon: 'bi-file-earmark-text',
                    color: 'primary',
                    sablonok: [
                        {
                            id: 'v1',
                            nev: 'Hiánypótlási felszólítás',
                            kod: 'V-VGZ-001',
                            uce: 'UCE-2071',
                            fields: ['ugyfel', 'hianyok', 'hatarido']
                        },
                        {
                            id: 'v2',
                            nev: 'Eljárás felfüggesztése',
                            kod: 'V-VGZ-002',
                            fields: ['indok', 'feltetel']
                        },
                        {
                            id: 'v3',
                            nev: 'Eljárás megszüntetése',
                            kod: 'V-VGZ-003',
                            fields: ['jogalap', 'indokolas']
                        }
                    ]
                },
                hatrozat: {
                    kod: 'F-0092',
                    nev: 'Határozat',
                    icon: 'bi-file-earmark-check',
                    color: 'success',
                    sablonok: [
                        {
                            id: 'h1',
                            nev: 'Engedélyező határozat',
                            kod: 'V-HAT-001',
                            uce: 'UCE-1810',
                            fields: ['engedelyezett_tevekenyseg', 'feltetel', 'ervenyes']
                        },
                        {
                            id: 'h2',
                            nev: 'Elutasító határozat',
                            kod: 'V-HAT-002',
                            fields: ['elutasitas_oka', 'jogalap', 'jogorvoslat']
                        },
                        {
                            id: 'h3',
                            nev: 'Részben engedélyező határozat',
                            kod: 'V-HAT-003',
                            fields: ['engedelyezett', 'elutasitott', 'indokolas']
                        }
                    ]
                },
                igazolas: {
                    kod: 'F-0093',
                    nev: 'Igazolás',
                    icon: 'bi-patch-check',
                    color: 'info',
                    sablonok: [
                        {
                            id: 'i1',
                            nev: 'Alkalmassági igazolás',
                            kod: 'V-IGZ-001',
                            uce: 'UCE-1811',
                            fields: ['nev', 'szuletesi_adatok', 'alkalmas_tevekenyseg', 'ervenyes']
                        },
                        {
                            id: 'i2',
                            nev: 'Nyilvántartásba vétel igazolása',
                            kod: 'V-IGZ-002',
                            fields: ['nyilvantartasi_szam', 'adatok']
                        }
                    ]
                },
                tajekoztatas: {
                    kod: 'F-0094',
                    nev: 'Tájékoztatás',
                    icon: 'bi-info-circle',
                    color: 'warning',
                    sablonok: [
                        {
                            id: 't1',
                            nev: 'Ügyintézési határidő tájékoztatás',
                            kod: 'V-TAJ-001',
                            fields: ['ugyintezesi_hatarido', 'indok']
                        },
                        {
                            id: 't2',
                            nev: 'Eljárási cselekmény tájékoztatás',
                            kod: 'V-TAJ-002',
                            fields: ['cselekmeny', 'idopont', 'helyszin']
                        }
                    ]
                },
                hirdetmeny: {
                    kod: 'F-0095',
                    nev: 'Hirdetmény',
                    icon: 'bi-megaphone',
                    color: 'secondary',
                    sablonok: [
                        {
                            id: 'hir1',
                            nev: 'Közmeghallgatási hirdetmény',
                            kod: 'V-HIR-001',
                            fields: ['targy', 'idopont', 'helyszin', 'megjegyzes']
                        },
                        {
                            id: 'hir2',
                            nev: 'Határozat közhírré tétele',
                            kod: 'V-HIR-002',
                            fields: ['hatarozat_szam', 'targy', 'kozzetetel_napja']
                        }
                    ]
                }
            },

            // Kiválasztott sablon
            selectedTemplateType: null,
            selectedTemplate: null,

            // Kitöltött mezők
            fieldValues: {},

            // Előnézet
            generatedDocument: null,
            showPreview: false
        };
    },

    computed: {
        // Kiválasztott sablon típus adatai
        selectedTypeData() {
            if (!this.selectedTemplateType) return null;
            return this.templates[this.selectedTemplateType];
        },

        // Validáció
        canGenerate() {
            if (!this.selectedTemplate) return false;

            // Minden kötelező mező kitöltve?
            const requiredFields = this.selectedTemplate.fields || [];
            for (let field of requiredFields) {
                if (!this.fieldValues[field] || this.fieldValues[field].trim() === '') {
                    return false;
                }
            }
            return true;
        }
    },

    methods: {
        // Sablon típus választása
        selectTemplateType(type) {
            this.selectedTemplateType = type;
            this.selectedTemplate = null;
            this.fieldValues = {};
            this.generatedDocument = null;
        },

        // Sablon választása
        selectTemplate(template) {
            this.selectedTemplate = template;
            this.fieldValues = {};
            this.initializeFields();
        },

        // Mezők inicializálása
        initializeFields() {
            if (!this.selectedTemplate) return;

            // Alapértelmezett értékek beállítása
            this.selectedTemplate.fields.forEach(field => {
                switch(field) {
                    case 'ugyfel':
                        this.fieldValues[field] = this.ugy.ugyfel.nev;
                        break;
                    case 'hatarido':
                        // 15 munkanap hozzáadása
                        const date = new Date();
                        date.setDate(date.getDate() + 21);
                        this.fieldValues[field] = date.toISOString().split('T')[0];
                        break;
                    case 'ugyintezesi_hatarido':
                        this.fieldValues[field] = '60 nap';
                        break;
                    case 'ervenyes':
                        // 5 év érvényesség
                        const validDate = new Date();
                        validDate.setFullYear(validDate.getFullYear() + 5);
                        this.fieldValues[field] = validDate.toISOString().split('T')[0];
                        break;
                    default:
                        this.fieldValues[field] = '';
                }
            });
        },

        // Mező címke lekérése
        getFieldLabel(field) {
            const labels = {
                'ugyfel': 'Ügyfél neve',
                'hianyok': 'Hiányosságok felsorolása',
                'hatarido': 'Határidő',
                'indok': 'Indokolás',
                'feltetel': 'Feltétel',
                'jogalap': 'Jogalap',
                'indokolas': 'Részletes indokolás',
                'engedelyezett_tevekenyseg': 'Engedélyezett tevékenység',
                'ervenyes': 'Érvényesség dátuma',
                'elutasitas_oka': 'Elutasítás oka',
                'jogorvoslat': 'Jogorvoslati tájékoztatás',
                'engedelyezett': 'Engedélyezett rész',
                'elutasitott': 'Elutasított rész',
                'nev': 'Név',
                'szuletesi_adatok': 'Születési adatok',
                'alkalmas_tevekenyseg': 'Alkalmas tevékenységek',
                'nyilvantartasi_szam': 'Nyilvántartási szám',
                'adatok': 'Nyilvántartott adatok',
                'cselekmeny': 'Eljárási cselekmény',
                'idopont': 'Időpont',
                'helyszin': 'Helyszín',
                'targy': 'Tárgy',
                'megjegyzes': 'Megjegyzés',
                'hatarozat_szam': 'Határozat száma',
                'kozzetetel_napja': 'Közzététel napja'
            };
            return labels[field] || field;
        },

        // Dokumentum generálása
        generateDocument() {
            if (!this.canGenerate) {
                alert('Kérem töltse ki az összes mezőt!');
                return;
            }

            // Dokumentum összeállítása
            const doc = {
                id: 'DOC-' + Date.now(),
                tipus: this.selectedTemplateType,
                sablon: this.selectedTemplate,
                kod: this.selectedTemplate.kod,
                uce: this.selectedTemplate.uce,
                ugy: {
                    azonosito: this.ugy.ugyazonosito,
                    ugyfel: this.ugy.ugyfel.nev
                },
                mezok: { ...this.fieldValues },
                keszitesDatum: new Date().toISOString(),
                keszito: 'Dr. Szabó Péter',
                statusz: 'tervezet'
            };

            // Dokumentum tartalom generálása
            doc.tartalom = this.generateContent(doc);

            this.generatedDocument = doc;
            this.showPreview = true;

            console.log('Generált dokumentum:', doc);
        },

        // Tartalom generálása
        generateContent(doc) {
            let content = `
                <div style="font-family: Arial; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2>ÉPÍTÉSI ÉS KÖZLEKEDÉSI MINISZTÉRIUM</h2>
                        <h3>Vasúti Hatósági Főosztály</h3>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <strong>Iktatószám:</strong> ${doc.id}<br>
                        <strong>Ügyiratszám:</strong> ${doc.ugy.azonosito}<br>
                        <strong>Ügyintéző:</strong> ${doc.keszito}<br>
                        <strong>Kelt:</strong> Budapest, ${new Date().toLocaleDateString('hu-HU')}
                    </div>

                    <h3 style="text-align: center; margin: 30px 0;">
                        ${doc.sablon.nev.toUpperCase()}
                    </h3>

                    <div style="margin: 20px 0;">
                        <strong>Címzett:</strong> ${doc.mezok.ugyfel || doc.ugy.ugyfel}<br>
                    </div>

                    <div style="margin: 30px 0; text-align: justify;">
            `;

            // Sablon specifikus tartalom
            if (doc.tipus === 'vegzes' && doc.sablon.id === 'v1') {
                content += `
                    <p>Értesítem, hogy a ${doc.ugy.azonosito} ügyiratszámú ügyében benyújtott kérelme
                    ügyében az alábbi hiányosságokat állapítottam meg:</p>

                    <div style="margin: 20px; padding: 15px; background: #f0f0f0;">
                        ${doc.mezok.hianyok.split('\n').map(h => `<li>${h}</li>`).join('')}
                    </div>

                    <p>Felhívom, hogy a hiányokat <strong>${doc.mezok.hatarido}</strong> határidőig
                    pótolja. A határidő elmulasztása esetén az eljárást megszüntetem.</p>
                `;
            } else if (doc.tipus === 'hatrozat' && doc.sablon.id === 'h1') {
                content += `
                    <p>A ${doc.ugy.azonosito} számú ügyben benyújtott kérelem alapján az alábbi</p>

                    <h4 style="text-align: center;">HATÁROZATOT</h4>

                    <p>hozom:</p>

                    <p>Engedélyezem a következő tevékenységet:<br>
                    <strong>${doc.mezok.engedelyezett_tevekenyseg}</strong></p>

                    <p>Az engedély érvényessége: <strong>${doc.mezok.ervenyes}</strong></p>

                    <p>Feltételek:<br>${doc.mezok.feltetel}</p>
                `;
            } else if (doc.tipus === 'igazolas' && doc.sablon.id === 'i1') {
                content += `
                    <h4 style="text-align: center;">IGAZOLÁS</h4>

                    <p>Igazolom, hogy</p>

                    <div style="margin: 20px 0;">
                        <strong>${doc.mezok.nev}</strong><br>
                        ${doc.mezok.szuletesi_adatok}
                    </div>

                    <p>a mai napon elvégzett vizsgálat alapján</p>

                    <p><strong>ALKALMAS</strong></p>

                    <p>az alábbi tevékenység(ek) végzésére:<br>
                    ${doc.mezok.alkalmas_tevekenyseg}</p>

                    <p>Az igazolás érvényes: <strong>${doc.mezok.ervenyes}</strong></p>
                `;
            }

            content += `
                    </div>

                    <div style="margin-top: 50px;">
                        <div style="float: right; text-align: center;">
                            <p>.......................................<br>
                            ${doc.keszito}<br>
                            vezető ügyintéző</p>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                    <div style="margin-top: 30px; font-size: 0.9em; color: #666;">
                        <p><strong>Kiadmányozás előtt!</strong> Ez egy tervezet.</p>
                    </div>
                </div>
            `;

            return content;
        },

        // Dokumentum mentése
        saveDocument() {
            if (!this.generatedDocument) return;

            this.generatedDocument.statusz = 'mentett';

            this.$emit('complete', {
                type: 'dokumentum_gyartas',
                document: this.generatedDocument
            });

            alert(`Dokumentum sikeresen mentve!\nAzonosító: ${this.generatedDocument.id}`);
        },

        // PDF exportálás (mock)
        exportPDF() {
            console.log('PDF export:', this.generatedDocument);
            alert('Dokumentum exportálva PDF formátumban.\n(Mock művelet - valós implementációban PDF generálás történne)');
        },

        // Dokumentum újragenerálása
        regenerate() {
            this.showPreview = false;
            this.generatedDocument = null;
        }
    },

    template: `
        <div class="component-card dokgyartas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-file-earmark-text text-primary"></i>
                    Dokumentum generálás
                    <span v-if="selectedTemplate" class="badge bg-secondary ms-2">
                        {{ selectedTemplate.kod }}
                    </span>
                </h5>
                <div v-if="generatedDocument">
                    <button class="btn btn-sm btn-outline-success me-2" @click="exportPDF">
                        <i class="bi bi-file-pdf"></i> PDF export
                    </button>
                    <button class="btn btn-sm btn-outline-primary" @click="regenerate">
                        <i class="bi bi-arrow-clockwise"></i> Újragenerálás
                    </button>
                </div>
            </div>

            <div class="component-card-body">
                <!-- Dokumentum típus választó -->
                <div v-if="!selectedTemplateType || !showPreview">
                    <h6 class="mb-3">1. Válasszon dokumentum típust</h6>
                    <div class="dokgyartas-template-grid mb-4">
                        <div v-for="(type, key) in templates" :key="key"
                             class="dokgyartas-template-card"
                             :class="{ selected: selectedTemplateType === key }"
                             @click="selectTemplateType(key)">
                            <div class="dokgyartas-template-icon">
                                <i :class="type.icon" :style="{ color: 'var(--bs-' + type.color + ')' }"></i>
                            </div>
                            <div class="dokgyartas-template-name">{{ type.nev }}</div>
                            <div class="dokgyartas-template-code">{{ type.kod }}</div>
                        </div>
                    </div>
                </div>

                <!-- Sablon választó -->
                <div v-if="selectedTemplateType && !selectedTemplate && !showPreview">
                    <h6 class="mb-3">2. Válasszon sablont</h6>
                    <div class="list-group">
                        <a v-for="template in selectedTypeData.sablonok" :key="template.id"
                           class="list-group-item list-group-item-action"
                           @click="selectTemplate(template)">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-1">{{ template.nev }}</h6>
                                    <small class="text-muted">
                                        Kód: {{ template.kod }}
                                        <span v-if="template.uce" class="badge bg-info ms-1">{{ template.uce }}</span>
                                    </small>
                                </div>
                                <i class="bi bi-chevron-right"></i>
                            </div>
                        </a>
                    </div>
                    <button class="btn btn-secondary mt-3" @click="selectedTemplateType = null">
                        <i class="bi bi-arrow-left"></i> Vissza
                    </button>
                </div>

                <!-- Mezők kitöltése -->
                <div v-if="selectedTemplate && !showPreview" class="dokgyartas-fields">
                    <h6 class="mb-3">
                        3. Töltse ki a mezőket
                        <span class="badge bg-primary ms-2">{{ selectedTemplate.nev }}</span>
                    </h6>

                    <div v-for="field in selectedTemplate.fields" :key="field"
                         class="dokgyartas-field-group">
                        <label class="dokgyartas-field-label">
                            {{ getFieldLabel(field) }}
                            <span class="text-danger">*</span>
                        </label>

                        <textarea v-if="field.includes('hianyok') || field.includes('indok') ||
                                       field.includes('feltetel') || field.includes('tevekenyseg')"
                                  class="form-control"
                                  v-model="fieldValues[field]"
                                  rows="3"
                                  :placeholder="'Adja meg: ' + getFieldLabel(field)">
                        </textarea>

                        <input v-else-if="field.includes('hatarido') || field.includes('ervenyes') ||
                                         field.includes('idopont') || field.includes('napja')"
                               type="date"
                               class="form-control"
                               v-model="fieldValues[field]">

                        <input v-else
                               type="text"
                               class="form-control"
                               v-model="fieldValues[field]"
                               :placeholder="'Adja meg: ' + getFieldLabel(field)">
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <button class="btn btn-secondary" @click="selectedTemplate = null">
                            <i class="bi bi-arrow-left"></i> Vissza
                        </button>
                        <button class="btn btn-primary"
                                @click="generateDocument"
                                :disabled="!canGenerate">
                            <i class="bi bi-file-earmark-plus"></i> Dokumentum generálása
                        </button>
                    </div>
                </div>

                <!-- Előnézet -->
                <div v-if="showPreview && generatedDocument" class="dokgyartas-preview">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="mb-0">
                            <i class="bi bi-eye"></i> Dokumentum előnézet
                        </h6>
                        <div>
                            <span class="badge bg-warning me-2">Tervezet</span>
                            <span class="badge bg-secondary">{{ generatedDocument.id }}</span>
                        </div>
                    </div>

                    <div class="border rounded p-3 bg-white" style="max-height: 500px; overflow-y: auto;">
                        <div v-html="generatedDocument.tartalom"></div>
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <button class="btn btn-secondary" @click="showPreview = false">
                            <i class="bi bi-pencil"></i> Szerkesztés
                        </button>
                        <div>
                            <button class="btn btn-outline-primary me-2" @click="exportPDF">
                                <i class="bi bi-file-pdf"></i> PDF letöltés
                            </button>
                            <button class="btn btn-success" @click="saveDocument">
                                <i class="bi bi-save"></i> Mentés és tovább
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};