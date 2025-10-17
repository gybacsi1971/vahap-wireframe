/**
 * VAHAP Workflow Komponens - Checklist
 * Ellenőrzési listák kezelése (F-0064, F-0065, F-0066)
 */

const WfChecklist = {
    name: 'wf-checklist',

    props: {
        ugy: {
            type: Object,
            required: true
        },
        stepData: {
            type: Object,
            default: () => ({
                checklistType: 'hataskor' // hataskor | formai | tartalmi
            })
        }
    },

    emits: ['action', 'complete'],

    data() {
        return {
            // Aktív ellenőrzési lista típusa
            activeChecklistType: this.stepData.checklistType || 'hataskor',

            // Ellenőrzési listák
            checklists: {
                hataskor: {
                    kod: 'F-0064',
                    nev: 'Hatáskör és illetékesség vizsgálat',
                    uce: 'UCE-1793',
                    groups: [
                        {
                            id: 'alapveto',
                            nev: 'Alapvető követelmények',
                            items: [
                                {
                                    id: 'h1',
                                    title: 'Hatáskör biztosított',
                                    description: 'A kérelem tárgya a hatóság hatáskörébe tartozik',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'h2',
                                    title: 'Illetékesség fennáll',
                                    description: 'Területi illetékesség megállapítható',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'h3',
                                    title: 'Jogosultság ellenőrzése',
                                    description: 'A kérelmező jogosult a kérelem benyújtására',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        },
                        {
                            id: 'jogszabaly',
                            nev: 'Jogszabályi megfelelés',
                            items: [
                                {
                                    id: 'j1',
                                    title: 'Vonatkozó jogszabály azonosítása',
                                    description: '123/2023. (XII. 15.) Korm. rendelet alapján',
                                    required: false,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'j2',
                                    title: 'Eljárási szabályok betartása',
                                    description: 'Ákr. szerinti eljárási szabályok alkalmazhatók',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        }
                    ]
                },
                formai: {
                    kod: 'F-0065',
                    nev: 'Formai megfelelőség vizsgálata',
                    uce: 'UCE-1799',
                    groups: [
                        {
                            id: 'kerelem',
                            nev: 'Kérelem formai követelményei',
                            items: [
                                {
                                    id: 'f1',
                                    title: 'Kérelem formanyomtatvány kitöltése',
                                    description: 'Minden kötelező mező kitöltve',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'f2',
                                    title: 'Aláírás megfelelősége',
                                    description: 'Kérelmező vagy meghatalmazott aláírása',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'f3',
                                    title: 'Dátumozás',
                                    description: 'Kérelem dátuma szerepel és érvényes',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        },
                        {
                            id: 'mellekletek',
                            nev: 'Mellékletek ellenőrzése',
                            items: [
                                {
                                    id: 'm1',
                                    title: 'Kötelező mellékletek csatolva',
                                    description: 'Minden előírt dokumentum becsatolásra került',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'm2',
                                    title: 'Mellékletek formátuma megfelelő',
                                    description: 'PDF vagy elfogadott formátum',
                                    required: false,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'm3',
                                    title: 'Mellékletek olvashatók',
                                    description: 'Dokumentumok tisztán olvashatók, nem sérültek',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        },
                        {
                            id: 'dijak',
                            nev: 'Díjfizetés ellenőrzése',
                            items: [
                                {
                                    id: 'd1',
                                    title: 'Eljárási díj megfizetése',
                                    description: 'Az előírt díj befizetésre került',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'd2',
                                    title: 'Díjfizetés igazolása',
                                    description: 'Befizetési bizonylat csatolva',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        }
                    ]
                },
                tartalmi: {
                    kod: 'F-0066',
                    nev: 'Tartalmi megfelelőség vizsgálat',
                    uce: 'UCE-1794',
                    groups: [
                        {
                            id: 'szakmai',
                            nev: 'Szakmai követelmények',
                            items: [
                                {
                                    id: 't1',
                                    title: 'Műszaki dokumentáció megfelelősége',
                                    description: 'Tervek, számítások szakmailag megfelelőek',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 't2',
                                    title: 'Szakértői vélemények',
                                    description: 'Szükséges szakvélemények rendelkezésre állnak',
                                    required: false,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 't3',
                                    title: 'Jogszabályi előírások teljesülése',
                                    description: 'Minden vonatkozó előírás teljesül',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        },
                        {
                            id: 'biztonsag',
                            nev: 'Biztonsági követelmények',
                            items: [
                                {
                                    id: 'b1',
                                    title: 'Vasútbiztonsági előírások',
                                    description: 'Biztonsági követelmények teljesülnek',
                                    required: true,
                                    checked: false,
                                    result: null
                                },
                                {
                                    id: 'b2',
                                    title: 'Kockázatértékelés',
                                    description: 'Kockázatelemzés elvégzésre került',
                                    required: true,
                                    checked: false,
                                    result: null
                                }
                            ]
                        }
                    ]
                }
            },

            // Megjegyzések
            notes: {},

            // Döntés
            decision: null,
            decisionNote: ''
        };
    },

    computed: {
        // Aktív checklist
        activeChecklist() {
            return this.checklists[this.activeChecklistType];
        },

        // Statisztika
        checklistStats() {
            let total = 0;
            let checked = 0;
            let required = 0;
            let requiredChecked = 0;

            this.activeChecklist.groups.forEach(group => {
                group.items.forEach(item => {
                    total++;
                    if (item.checked) checked++;
                    if (item.required) {
                        required++;
                        if (item.checked) requiredChecked++;
                    }
                });
            });

            return {
                total,
                checked,
                required,
                requiredChecked,
                progress: total > 0 ? Math.round((checked / total) * 100) : 0,
                requiredProgress: required > 0 ? Math.round((requiredChecked / required) * 100) : 0
            };
        },

        // Befejezhetőség
        canComplete() {
            return this.checklistStats.requiredProgress === 100 && this.decision !== null;
        },

        // Összes kötelező elem teljesült?
        allRequiredPassed() {
            let allPassed = true;
            this.activeChecklist.groups.forEach(group => {
                group.items.forEach(item => {
                    if (item.required && (!item.checked || item.result !== 'pass')) {
                        allPassed = false;
                    }
                });
            });
            return allPassed;
        }
    },

    methods: {
        // Checklist váltás
        switchChecklist(type) {
            this.activeChecklistType = type;
        },

        // Elem ellenőrzése
        toggleItem(item) {
            item.checked = !item.checked;
            if (item.checked && item.result === null) {
                item.result = 'pass'; // Alapértelmezett: megfelelt
            }
        },

        // Eredmény beállítása
        setItemResult(item, result) {
            item.result = result;
            if (result && !item.checked) {
                item.checked = true;
            }
        },

        // Megjegyzés hozzáadása
        addNote(itemId) {
            const note = prompt('Megjegyzés hozzáadása:');
            if (note) {
                this.$set(this.notes, itemId, note);
            }
        },

        // Összes kötelező automatikus kitöltése
        autoFillRequired() {
            this.activeChecklist.groups.forEach(group => {
                group.items.forEach(item => {
                    if (item.required) {
                        item.checked = true;
                        item.result = 'pass';
                    }
                });
            });
        },

        // Döntés meghozatala
        makeDecision(type) {
            this.decision = type;

            // Automatikus döntési szöveg
            if (type === 'megfelelt') {
                this.decisionNote = `A(z) ${this.activeChecklist.nev} során a kérelem minden követelménynek megfelelt.`;
            } else if (type === 'hianypotlas') {
                this.decisionNote = `A(z) ${this.activeChecklist.nev} során hiányosságok kerültek megállapításra. Hiánypótlás szükséges.`;
            } else {
                this.decisionNote = `A(z) ${this.activeChecklist.nev} során a kérelem nem felel meg a követelményeknek.`;
            }
        },

        // Checklist befejezése
        completeChecklist() {
            if (!this.canComplete) {
                alert('Kérem ellenőrizze az összes kötelező elemet és hozzon döntést!');
                return;
            }

            const result = {
                type: 'checklist',
                checklistType: this.activeChecklistType,
                kod: this.activeChecklist.kod,
                uce: this.activeChecklist.uce,
                stats: this.checklistStats,
                decision: this.decision,
                decisionNote: this.decisionNote,
                items: this.activeChecklist.groups.flatMap(g => g.items),
                notes: this.notes,
                completedAt: new Date().toISOString()
            };

            console.log('Checklist befejezve:', result);

            this.$emit('complete', result);

            alert(`Ellenőrzés befejezve!\nEredmény: ${this.decision === 'megfelelt' ? 'MEGFELELT' : this.decision === 'hianypotlas' ? 'HIÁNYPÓTLÁS SZÜKSÉGES' : 'NEM FELEL MEG'}`);
        },

        // Jelentés generálása
        generateReport() {
            let report = `ELLENŐRZÉSI JELENTÉS\n`;
            report += `========================\n\n`;
            report += `Ellenőrzés: ${this.activeChecklist.nev}\n`;
            report += `Kód: ${this.activeChecklist.kod}\n`;
            report += `UCE: ${this.activeChecklist.uce}\n`;
            report += `Ügy: ${this.ugy.ugyazonosito}\n`;
            report += `Dátum: ${new Date().toLocaleDateString('hu-HU')}\n\n`;

            report += `EREDMÉNYEK:\n`;
            report += `-----------\n`;

            this.activeChecklist.groups.forEach(group => {
                report += `\n${group.nev}:\n`;
                group.items.forEach(item => {
                    const status = item.checked ?
                        (item.result === 'pass' ? '✓' : item.result === 'fail' ? '✗' : '?') : '-';
                    report += `  [${status}] ${item.title}`;
                    if (item.required) report += ' (Kötelező)';
                    if (this.notes[item.id]) report += `\n      Megjegyzés: ${this.notes[item.id]}`;
                    report += '\n';
                });
            });

            report += `\nÖSSZESÍTÉS:\n`;
            report += `-----------\n`;
            report += `Ellenőrzött elemek: ${this.checklistStats.checked}/${this.checklistStats.total}\n`;
            report += `Kötelező elemek: ${this.checklistStats.requiredChecked}/${this.checklistStats.required}\n`;
            report += `Teljesítés: ${this.checklistStats.progress}%\n`;
            report += `\nDÖNTÉS: ${this.decision ? this.decision.toUpperCase() : 'Nincs'}\n`;
            if (this.decisionNote) {
                report += `\n${this.decisionNote}\n`;
            }

            console.log(report);
            alert('Jelentés generálva (konzolban megtekinthető)');
        }
    },

    mounted() {
        // Alapértelmezett checklist típus beállítása
        if (this.stepData.checklistType) {
            this.activeChecklistType = this.stepData.checklistType;
        }
    },

    template: `
        <div class="component-card checklist-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-list-check text-primary"></i>
                    {{ activeChecklist.nev }}
                    <span class="badge bg-secondary ms-2">{{ activeChecklist.kod }}</span>
                    <span class="badge bg-info ms-1">{{ activeChecklist.uce }}</span>
                </h5>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="generateReport">
                        <i class="bi bi-file-text"></i> Jelentés
                    </button>
                    <button class="btn btn-sm btn-outline-primary" @click="autoFillRequired">
                        <i class="bi bi-magic"></i> Kötelezők kitöltése
                    </button>
                </div>
            </div>

            <!-- Előrehaladás -->
            <div class="checklist-progress">
                <div class="d-flex justify-content-between mb-2">
                    <span>Előrehaladás</span>
                    <span class="fw-bold">{{ checklistStats.progress }}%</span>
                </div>
                <div class="checklist-progress-bar">
                    <div class="checklist-progress-fill"
                         :style="{ width: checklistStats.progress + '%' }"></div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <small class="text-muted">
                        Ellenőrzött: {{ checklistStats.checked }}/{{ checklistStats.total }}
                    </small>
                    <small class="text-muted">
                        Kötelező: {{ checklistStats.requiredChecked }}/{{ checklistStats.required }}
                    </small>
                </div>
            </div>

            <div class="component-card-body">
                <!-- Checklist típus választó -->
                <div class="btn-group w-100 mb-4" role="group">
                    <button v-for="(list, key) in checklists" :key="key"
                            type="button"
                            class="btn"
                            :class="activeChecklistType === key ? 'btn-primary' : 'btn-outline-primary'"
                            @click="switchChecklist(key)">
                        <span class="badge bg-light text-dark me-1">{{ list.kod }}</span>
                        {{ list.nev.split(' ')[0] }}
                    </button>
                </div>

                <!-- Checklist csoportok -->
                <div v-for="group in activeChecklist.groups" :key="group.id" class="checklist-group">
                    <h6 class="checklist-group-title">
                        <i class="bi bi-folder2-open me-2"></i>
                        {{ group.nev }}
                    </h6>

                    <div v-for="item in group.items" :key="item.id"
                         class="checklist-item"
                         :class="{ checked: item.checked }">
                        <input type="checkbox"
                               class="form-check-input checklist-item-checkbox"
                               :checked="item.checked"
                               @change="toggleItem(item)">
                        <div class="checklist-item-content">
                            <div class="checklist-item-title">
                                {{ item.title }}
                                <span v-if="item.required" class="badge bg-danger ms-1">Kötelező</span>
                                <span v-if="item.result" class="badge ms-1"
                                      :class="{
                                          'bg-success': item.result === 'pass',
                                          'bg-danger': item.result === 'fail',
                                          'bg-warning': item.result === 'partial'
                                      }">
                                    {{ item.result === 'pass' ? 'Megfelelt' :
                                       item.result === 'fail' ? 'Nem felelt meg' : 'Részben' }}
                                </span>
                            </div>
                            <div class="checklist-item-description">
                                {{ item.description }}
                            </div>
                            <div v-if="item.checked" class="mt-2">
                                <div class="btn-group btn-group-sm" role="group">
                                    <button type="button"
                                            class="btn"
                                            :class="item.result === 'pass' ? 'btn-success' : 'btn-outline-success'"
                                            @click="setItemResult(item, 'pass')">
                                        <i class="bi bi-check"></i> Megfelelt
                                    </button>
                                    <button type="button"
                                            class="btn"
                                            :class="item.result === 'partial' ? 'btn-warning' : 'btn-outline-warning'"
                                            @click="setItemResult(item, 'partial')">
                                        <i class="bi bi-exclamation"></i> Részben
                                    </button>
                                    <button type="button"
                                            class="btn"
                                            :class="item.result === 'fail' ? 'btn-danger' : 'btn-outline-danger'"
                                            @click="setItemResult(item, 'fail')">
                                        <i class="bi bi-x"></i> Nem felelt meg
                                    </button>
                                </div>
                                <button class="btn btn-sm btn-link" @click="addNote(item.id)">
                                    <i class="bi bi-chat-dots"></i>
                                    {{ notes[item.id] ? 'Megjegyzés szerkesztése' : 'Megjegyzés hozzáadása' }}
                                </button>
                                <div v-if="notes[item.id]" class="alert alert-info mt-2 py-1 px-2">
                                    <small><i class="bi bi-info-circle me-1"></i> {{ notes[item.id] }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Döntés panel -->
                <div class="card bg-light mt-4">
                    <div class="card-body">
                        <h6 class="card-title">
                            <i class="bi bi-clipboard-check"></i> Ellenőrzés eredménye
                        </h6>

                        <div class="row mb-3">
                            <div class="col-md-4">
                                <button class="btn btn-success w-100"
                                        :class="{ active: decision === 'megfelelt' }"
                                        @click="makeDecision('megfelelt')"
                                        :disabled="!allRequiredPassed">
                                    <i class="bi bi-check-circle"></i><br>
                                    Megfelelt
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-warning w-100"
                                        :class="{ active: decision === 'hianypotlas' }"
                                        @click="makeDecision('hianypotlas')">
                                    <i class="bi bi-exclamation-triangle"></i><br>
                                    Hiánypótlás
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-danger w-100"
                                        :class="{ active: decision === 'nemfeleltmeg' }"
                                        @click="makeDecision('nemfeleltmeg')">
                                    <i class="bi bi-x-circle"></i><br>
                                    Nem felelt meg
                                </button>
                            </div>
                        </div>

                        <div v-if="decision">
                            <label class="form-label">Döntés indoklása</label>
                            <textarea class="form-control"
                                      v-model="decisionNote"
                                      rows="3"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Műveleti gombok -->
                <div class="d-flex justify-content-between mt-4">
                    <button class="btn btn-secondary" @click="$emit('action', {type: 'cancel'})">
                        <i class="bi bi-arrow-left"></i> Vissza
                    </button>
                    <button class="btn btn-primary"
                            @click="completeChecklist"
                            :disabled="!canComplete">
                        <i class="bi bi-check2-square"></i> Ellenőrzés befejezése
                    </button>
                </div>
            </div>
        </div>
    `
};