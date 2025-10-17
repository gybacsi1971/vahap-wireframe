/**
 * VAHAP Workflow Komponens - Rugalmas Workflow
 * Tényállás tisztázás dinamikus workflow (F-0102)
 *
 * UCE kódok:
 * - UCE-1854: Tényállás tisztázás szükséges (kezdés)
 * - UCE-1855: Cselekmények meghatározása
 * - UCE-1860: Megkeresés
 * - UCE-1851: Szakhatósági állásfoglalás
 * - UCE-1858: Ügyfél nyilatkozattétel
 * - UCE-1853: Tanú meghallgatás
 * - UCE-1857: Szemle lefolytatás
 * - UCE-1861: Irat bemutatás
 * - UCE-1859: Szakértői vélemény
 * - UCE-1862: Tárgyalás összehívás
 * - UCE-1856: Egyedi eljárási cselekmény
 * - UCE-1846: Összegzés és további cselekmény vizsgálata
 * - UCE-1863: Szükség van további tényállás tisztázó eljárási cselekményre?
 */

const WfRugalmasWorkflow = {
    name: 'wf-rugalmas-workflow',

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
            // Aktív nézet: 'overview' | 'action-detail'
            activeView: 'overview',

            // Kiválasztott cselekmény
            selectedAction: null,

            // Elérhető eljárási cselekmények (UCE-1855)
            availableActions: [
                {
                    id: 'megkereses',
                    uce: 'UCE-1860',
                    name: 'Megkeresés',
                    icon: 'bi-envelope-paper',
                    description: 'Más hatóság, szervezet megkeresése információkérés céljából',
                    color: '#2196F3',
                    executed: false,
                    result: null
                },
                {
                    id: 'szakhatosag',
                    uce: 'UCE-1851',
                    name: 'Szakhatósági állásfoglalás',
                    icon: 'bi-building',
                    description: 'Szakhatóság bevonása az ügy elbírálásába',
                    color: '#FF9800',
                    executed: false,
                    result: null
                },
                {
                    id: 'ugyfel_nyilatkozat',
                    uce: 'UCE-1858',
                    name: 'Ügyfél nyilatkozattétel',
                    icon: 'bi-chat-square-text',
                    description: 'Ügyfél nyilatkozatának bekérése',
                    color: '#4CAF50',
                    executed: false,
                    result: null
                },
                {
                    id: 'tanu',
                    uce: 'UCE-1853',
                    name: 'Tanú meghallgatás',
                    icon: 'bi-mic',
                    description: 'Tanú meghallgatásának lefolytatása',
                    color: '#9C27B0',
                    executed: false,
                    result: null
                },
                {
                    id: 'szemle',
                    uce: 'UCE-1857',
                    name: 'Szemle lefolytatás',
                    icon: 'bi-eye',
                    description: 'Helyszíni szemle végrehajtása',
                    color: '#00BCD4',
                    executed: false,
                    result: null
                },
                {
                    id: 'irat',
                    uce: 'UCE-1861',
                    name: 'Irat bemutatás',
                    icon: 'bi-file-earmark-arrow-up',
                    description: 'Iratok bemutatásának kérése',
                    color: '#795548',
                    executed: false,
                    result: null
                },
                {
                    id: 'szakerto',
                    uce: 'UCE-1859',
                    name: 'Szakértői vélemény',
                    icon: 'bi-mortarboard',
                    description: 'Szakértő bevonása, vélemény bekérése',
                    color: '#E91E63',
                    executed: false,
                    result: null
                },
                {
                    id: 'targyalas',
                    uce: 'UCE-1862',
                    name: 'Tárgyalás összehívás',
                    icon: 'bi-calendar-event',
                    description: 'Tárgyalás időpontjának kitűzése és összehívása',
                    color: '#FF5722',
                    executed: false,
                    result: null
                },
                {
                    id: 'egyedi',
                    uce: 'UCE-1856',
                    name: 'Egyedi eljárási cselekmény',
                    icon: 'bi-gear',
                    description: 'Egyedi, eseti eljárási cselekmény végrehajtása',
                    color: '#607D8B',
                    executed: false,
                    result: null
                }
            ],

            // Végrehajtott cselekmények (körök)
            executedRounds: [],
            currentRound: 1,

            // Cselekmény részletező form
            actionForm: {
                targySzervezet: '',
                hatarido: '',
                leiras: '',
                dokumentumok: [],
                megjegyzes: ''
            },

            // Összegzés (UCE-1846)
            summary: {
                show: false,
                osszefoglalo: '',
                tovabbi_cselekmenyek_szuksegessege: null // true/false (UCE-1863)
            }
        };
    },

    computed: {
        // Végrehajtott cselekmények száma
        executedActionsCount() {
            return this.availableActions.filter(a => a.executed).length;
        },

        // Összes cselekmény száma
        totalActionsCount() {
            return this.availableActions.length;
        },

        // Van-e legalább egy végrehajtott cselekmény?
        hasExecutedActions() {
            return this.executedActionsCount > 0;
        },

        // Előrehaladás százalék (opcionális, csak vizualizációhoz)
        progressPercent() {
            if (this.totalActionsCount === 0) return 0;
            return Math.round((this.executedActionsCount / this.totalActionsCount) * 100);
        }
    },

    methods: {
        // Cselekmény kiválasztása végrehajtáshoz
        selectAction(action) {
            this.selectedAction = { ...action };
            this.activeView = 'action-detail';
            this.resetActionForm();
        },

        // Form reset
        resetActionForm() {
            this.actionForm = {
                targySzervezet: '',
                hatarido: this.getDefaultDeadline(),
                leiras: '',
                dokumentumok: [],
                megjegyzes: ''
            };
        },

        // Alapértelmezett határidő (15 nap)
        getDefaultDeadline() {
            const date = new Date();
            date.setDate(date.getDate() + 15);
            return date.toISOString().split('T')[0];
        },

        // Cselekmény végrehajtása
        executeAction() {
            if (!this.selectedAction) return;

            // Validáció
            if (!this.actionForm.targySzervezet) {
                alert('Kérem adja meg a célszervezetet / személyt!');
                return;
            }

            if (!this.actionForm.leiras) {
                alert('Kérem adja meg a cselekmény leírását!');
                return;
            }

            // Cselekmény megjelölése végrehajtottnak
            const actionIndex = this.availableActions.findIndex(a => a.id === this.selectedAction.id);
            if (actionIndex > -1) {
                this.availableActions[actionIndex].executed = true;
                this.availableActions[actionIndex].result = {
                    round: this.currentRound,
                    targySzervezet: this.actionForm.targySzervezet,
                    hatarido: this.actionForm.hatarido,
                    leiras: this.actionForm.leiras,
                    megjegyzes: this.actionForm.megjegyzes,
                    vegrehajtasDatum: new Date().toISOString().split('T')[0]
                };
            }

            // Körök nyilvántartása
            this.executedRounds.push({
                round: this.currentRound,
                actionId: this.selectedAction.id,
                actionName: this.selectedAction.name,
                uce: this.selectedAction.uce,
                result: { ...this.actionForm },
                timestamp: new Date().toISOString()
            });

            console.log(`[${this.selectedAction.uce}] ${this.selectedAction.name} végrehajtva`, this.actionForm);

            alert(`${this.selectedAction.name} cselekmény sikeresen rögzítve!\n\nCélszervezet: ${this.actionForm.targySzervezet}\nHatáridő: ${this.actionForm.hatarido}`);

            // Vissza az áttekintéshez
            this.activeView = 'overview';
            this.selectedAction = null;
        },

        // Cselekmény törlése
        removeAction(action) {
            if (!confirm(`Biztosan törli a végrehajtott cselekményt: ${action.name}?`)) {
                return;
            }

            const actionIndex = this.availableActions.findIndex(a => a.id === action.id);
            if (actionIndex > -1) {
                this.availableActions[actionIndex].executed = false;
                this.availableActions[actionIndex].result = null;
            }

            // Köröktől is törlés
            this.executedRounds = this.executedRounds.filter(r => r.actionId !== action.id);
        },

        // Összegzés megjelenítése (UCE-1846)
        showSummary() {
            if (!this.hasExecutedActions) {
                alert('Legalább egy eljárási cselekményt végre kell hajtani!');
                return;
            }

            this.summary.show = true;
            this.activeView = 'summary';
        },

        // Összegzés mentése és döntés (UCE-1863)
        saveSummaryAndDecide(needMoreActions) {
            // UCE-1863: Szükség van további tényállás tisztázó eljárási cselekményre?
            this.summary.tovabbi_cselekmenyek_szuksegessege = needMoreActions;

            if (!this.summary.osszefoglalo) {
                alert('Kérem töltse ki az összefoglaló szöveget!');
                return;
            }

            if (needMoreActions) {
                // Újabb kör indul (UCE-1855 - vissza)
                this.currentRound++;
                this.summary.show = false;
                this.activeView = 'overview';
                alert(`Újabb tényállás tisztázási kör indul (${this.currentRound}. kör).\n\nVálasszon további eljárási cselekményeket!`);
            } else {
                // Befejezés és visszatérés az indító folyamatba (UCE-1864)
                const result = {
                    osszefoglalo: this.summary.osszefoglalo,
                    vegrehajtott_cselekmények: this.executedRounds,
                    korok_szama: this.currentRound,
                    befejezve: true
                };

                console.log('[UCE-1864] Tényállás tisztázás befejezve, visszatérés:', result);

                alert('Tényállás tisztázás sikeresen befejezve!\n\nA folyamat visszatér az érdemi döntés előkészítéséhez.');

                // Complete esemény küldése
                this.$emit('complete', result);
            }
        },

        // Mégse gomb
        cancelAction() {
            this.activeView = 'overview';
            this.selectedAction = null;
        },

        // Dokumentum hozzáadása (mock)
        addDocument() {
            const docName = prompt('Dokumentum neve:');
            if (docName) {
                this.actionForm.dokumentumok.push({
                    nev: docName,
                    datum: new Date().toISOString().split('T')[0]
                });
            }
        },

        // Dokumentum törlése
        removeDocument(index) {
            this.actionForm.dokumentumok.splice(index, 1);
        }
    },

    template: `
        <div class="rugalmas-workflow-component p-4">
            <!-- Fejléc -->
            <div class="mb-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h4 class="mb-1">
                            <i class="bi bi-diagram-3 text-primary"></i>
                            Tényállás tisztázása - Rugalmas Workflow
                            <span class="badge bg-secondary ms-2">F-0102</span>
                            <span class="badge bg-info ms-2">UCE-1854</span>
                        </h4>
                        <p class="text-muted mb-0">
                            Dinamikus eljárási cselekmények végrehajtása a tényállás tisztázásához
                        </p>
                    </div>
                    <div class="text-end">
                        <div class="badge bg-primary" style="font-size: 1.5rem; padding: 0.75rem 1.25rem;">
                            Kör: {{ currentRound }}
                        </div>
                    </div>
                </div>

                <!-- Progress bar -->
                <div v-if="activeView === 'overview'" class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                        <small class="text-muted">Végrehajtott cselekmények</small>
                        <small class="text-muted">
                            <strong>{{ executedActionsCount }}</strong> / {{ totalActionsCount }}
                        </small>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-success"
                             :style="{ width: progressPercent + '%' }"
                             role="progressbar"></div>
                    </div>
                </div>
            </div>

            <!-- ÁTTEKINTŐ NÉZET (UCE-1855) -->
            <div v-if="activeView === 'overview'" class="overview-section">
                <div class="alert alert-info mb-4">
                    <i class="bi bi-info-circle"></i>
                    <strong>Rugalmas workflow:</strong> Válassza ki és hajtsa végre a szükséges eljárási cselekményeket a tényállás tisztázásához.
                    A cselekmények párhuzamosan vagy egymás után is végrehajthatók.
                </div>

                <!-- Cselekmények kártyái -->
                <div class="row g-3 mb-4">
                    <div v-for="action in availableActions"
                         :key="action.id"
                         class="col-md-6 col-lg-4">
                        <div class="card h-100 action-card"
                             :class="{ 'border-success': action.executed }"
                             style="cursor: pointer; transition: all 0.3s;"
                             @click="selectAction(action)">
                            <div class="card-body">
                                <div class="d-flex align-items-start mb-3">
                                    <div class="action-icon me-3"
                                         :style="{
                                             background: action.executed ? '#4CAF50' : action.color,
                                             width: '48px',
                                             height: '48px',
                                             borderRadius: '12px',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             color: 'white',
                                             fontSize: '1.5rem'
                                         }">
                                        <i :class="action.icon"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1" :style="{ color: action.executed ? '#4CAF50' : '#212529' }">
                                            {{ action.name }}
                                            <i v-if="action.executed" class="bi bi-check-circle-fill text-success ms-2"></i>
                                        </h6>
                                        <small class="text-muted">{{ action.uce }}</small>
                                    </div>
                                </div>
                                <p class="small text-muted mb-3">{{ action.description }}</p>

                                <!-- Végrehajtott státusz info -->
                                <div v-if="action.executed && action.result" class="mt-3 pt-3 border-top">
                                    <small class="text-muted d-block mb-1">
                                        <i class="bi bi-calendar-check"></i>
                                        {{ action.result.vegrehajtasDatum }}
                                    </small>
                                    <small class="text-muted d-block">
                                        <i class="bi bi-building"></i>
                                        {{ action.result.targySzervezet }}
                                    </small>
                                    <button class="btn btn-sm btn-outline-danger mt-2 w-100"
                                            @click.stop="removeAction(action)">
                                        <i class="bi bi-trash"></i> Törlés
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Műveletek -->
                <div class="d-flex gap-2 justify-content-between">
                    <button class="btn btn-outline-secondary" @click="$emit('action', { type: 'cancel' })">
                        <i class="bi bi-arrow-left"></i> Vissza
                    </button>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary"
                                @click="showSummary"
                                :disabled="!hasExecutedActions">
                            <i class="bi bi-list-check"></i> Összegzés és befejezés
                            <span class="badge bg-light text-dark ms-2">UCE-1846</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- CSELEKMÉNY RÉSZLETEK NÉZET -->
            <div v-if="activeView === 'action-detail' && selectedAction" class="action-detail-section">
                <div class="card mb-4">
                    <div class="card-header" :style="{ background: selectedAction.color, color: 'white' }">
                        <h5 class="mb-0">
                            <i :class="selectedAction.icon"></i>
                            {{ selectedAction.name }}
                            <span class="badge bg-light text-dark ms-2">{{ selectedAction.uce }}</span>
                        </h5>
                        <small>{{ selectedAction.description }}</small>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="executeAction">
                            <!-- Célszervezet / Személy -->
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-building"></i>
                                    Célszervezet / Személy <span class="text-danger">*</span>
                                </label>
                                <input type="text"
                                       class="form-control"
                                       v-model="actionForm.targySzervezet"
                                       placeholder="pl. Közlekedési Hatóság, Szakértő neve"
                                       required>
                            </div>

                            <!-- Határidő -->
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-calendar"></i>
                                    Válaszadási határidő
                                </label>
                                <input type="date"
                                       class="form-control"
                                       v-model="actionForm.hatarido">
                            </div>

                            <!-- Leírás -->
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-card-text"></i>
                                    Cselekmény leírása <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control"
                                          rows="4"
                                          v-model="actionForm.leiras"
                                          placeholder="Részletes leírás a tényállás tisztázási cselekményről..."
                                          required></textarea>
                            </div>

                            <!-- Megjegyzés -->
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-chat-left-text"></i>
                                    Megjegyzés (opcionális)
                                </label>
                                <textarea class="form-control"
                                          rows="2"
                                          v-model="actionForm.megjegyzes"
                                          placeholder="Belső megjegyzések..."></textarea>
                            </div>

                            <!-- Dokumentumok (Mock) -->
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-paperclip"></i>
                                    Kapcsolódó dokumentumok
                                </label>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                    <span v-for="(doc, index) in actionForm.dokumentumok"
                                          :key="index"
                                          class="badge bg-secondary">
                                        {{ doc.nev }}
                                        <i class="bi bi-x-circle ms-1"
                                           style="cursor: pointer;"
                                           @click="removeDocument(index)"></i>
                                    </span>
                                </div>
                                <button type="button"
                                        class="btn btn-sm btn-outline-secondary"
                                        @click="addDocument">
                                    <i class="bi bi-plus-circle"></i> Dokumentum hozzáadása
                                </button>
                            </div>

                            <!-- Műveletek -->
                            <div class="d-flex gap-2 justify-content-between mt-4">
                                <button type="button"
                                        class="btn btn-outline-secondary"
                                        @click="cancelAction">
                                    <i class="bi bi-x"></i> Mégse
                                </button>
                                <button type="submit"
                                        class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Cselekmény végrehajtása
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- ÖSSZEGZÉS NÉZET (UCE-1846) -->
            <div v-if="activeView === 'summary'" class="summary-section">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">
                            <i class="bi bi-list-check"></i>
                            Tényállás tisztázás összegzése
                            <span class="badge bg-light text-dark ms-2">UCE-1846</span>
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- Végrehajtott cselekmények összefoglalója -->
                        <div class="mb-4">
                            <h6 class="mb-3">Végrehajtott eljárási cselekmények ({{ executedActionsCount }} db):</h6>
                            <div class="list-group">
                                <div v-for="round in executedRounds"
                                     :key="round.timestamp"
                                     class="list-group-item">
                                    <div class="d-flex align-items-start">
                                        <div class="me-3">
                                            <span class="badge bg-info">{{ round.uce }}</span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="mb-1">{{ round.actionName }}</h6>
                                            <p class="mb-1 small">
                                                <strong>Célszervezet:</strong> {{ round.result.targySzervezet }}<br>
                                                <strong>Határidő:</strong> {{ round.result.hatarido }}<br>
                                                <strong>Leírás:</strong> {{ round.result.leiras }}
                                            </p>
                                            <small class="text-muted">Kör: {{ round.round }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Összefoglaló szöveg -->
                        <div class="mb-4">
                            <label class="form-label">
                                <i class="bi bi-file-text"></i>
                                Összefoglaló értékelés <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control"
                                      rows="6"
                                      v-model="summary.osszefoglalo"
                                      placeholder="A tényállás tisztázási folyamat összefoglaló értékelése, eredmények, következtetések..."
                                      required></textarea>
                            <small class="text-muted">
                                Összefoglalás a végrehajtott eljárási cselekmények eredményéről és az ügyre vonatkozó megállapításokról.
                            </small>
                        </div>

                        <!-- Döntés: További cselekmények szükségessége (UCE-1863) -->
                        <div class="mb-4">
                            <h6 class="mb-3">
                                <i class="bi bi-question-circle"></i>
                                Szükség van további tényállás tisztázó eljárási cselekményre?
                                <span class="badge bg-secondary ms-2">UCE-1863</span>
                            </h6>
                            <div class="alert alert-warning">
                                <i class="bi bi-info-circle"></i>
                                <strong>Döntési pont:</strong> Ha további cselekmények szükségesek, új kör indul ({{ currentRound + 1 }}. kör).
                                Ellenkező esetben a tényállás tisztázás befejeződik.
                            </div>
                        </div>

                        <!-- Műveletek -->
                        <div class="d-flex gap-2 justify-content-between">
                            <button class="btn btn-outline-secondary"
                                    @click="activeView = 'overview'; summary.show = false">
                                <i class="bi bi-arrow-left"></i> Vissza
                            </button>
                            <div class="d-flex gap-2">
                                <button class="btn btn-success"
                                        @click="saveSummaryAndDecide(false)">
                                    <i class="bi bi-check-circle"></i> Nem, befejezés
                                    <small class="d-block" style="font-size: 0.7rem;">UCE-1864: Visszatérés</small>
                                </button>
                                <button class="btn btn-warning"
                                        @click="saveSummaryAndDecide(true)">
                                    <i class="bi bi-arrow-repeat"></i> Igen, újabb kör
                                    <small class="d-block" style="font-size: 0.7rem;">UCE-1855: Új cselekmények</small>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    mounted() {
        console.log('[F-0102] Tényállás tisztázás - Rugalmas workflow inicializálva');
        console.log('Ügy:', this.ugy);
        console.log('Elérhető cselekmények:', this.availableActions.length);
    }
};