/**
 * VAHAP - Workflow Navigáció Komponens (TELJES VERZIÓ)
 * Bal oldali workflow lépések dinamikus megjelenítése
 * Használat: <vahap-workflow-nav :ugy="ugy" :active-tab="activeTab" @select="selectTab"></vahap-workflow-nav>
 *
 * Funkciók:
 * - Workflow lépések dinamikus listázása az ügy állapota alapján
 * - UCE és F kódok automatikus hozzárendelése
 * - Lépés státusz vizualizáció (kész/folyamatban/várakozik/kihagyva)
 * - Tooltip-ek részletes információkkal
 * - Kollapsz állapot támogatása
 */

const VahapWorkflowNav = {
    name: 'vahap-workflow-nav',
    emits: ['select'],
    props: {
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        },
        activeTab: {
            type: String,
            default: 'kerelem'
        }
    },
    data() {
        return {
            // Teljes workflow lépések definíciója (vasúti modul - V-044)
            allWorkflowSteps: [
                {
                    id: 'kerelem',
                    label: 'Beadott kérelem',
                    icon: 'bi-file-earmark-text',
                    uce: null,
                    funkcio: 'F-0107',
                    required: true,
                    tooltip: 'Kérelem adatlap megtekintése',
                    order: 1
                },
                {
                    id: 'hatáskor',
                    label: 'Hatáskör vizsgálat',
                    icon: 'bi-shield-check',
                    uce: 'UCE-1793',
                    funkcio: 'F-0064',
                    required: true,
                    tooltip: 'Hatáskör és illetékesség vizsgálata',
                    order: 2
                },
                {
                    id: 'formai',
                    label: 'Formai megfelelőség',
                    icon: 'bi-file-check',
                    uce: 'UCE-1799',
                    funkcio: 'F-0065',
                    required: true,
                    tooltip: 'Formai megfelelőség vizsgálata',
                    order: 3
                },
                {
                    id: 'tartalmi',
                    label: 'Tartalmi megfelelőség',
                    icon: 'bi-clipboard-check',
                    uce: 'UCE-1794',
                    funkcio: 'F-0066',
                    required: true,
                    tooltip: 'Tartalmi megfelelőség vizsgálata',
                    order: 4
                },
                {
                    id: 'vny024',
                    label: 'VNY024 Adatok',
                    icon: 'bi-database',
                    uce: null,
                    funkcio: 'F-0090',
                    required: false,
                    tooltip: 'Vasútegészségügyi Nyilvántartás',
                    subtitle: 'Vasútegészségügy',
                    order: 5
                },
                {
                    id: 'sommas',
                    label: 'Sommás eljárás döntés',
                    icon: 'bi-lightning',
                    uce: 'UCE-1800',
                    funkcio: 'F-0088',
                    required: true,
                    tooltip: '8 napos vagy 60 napos eljárás választása',
                    order: 6
                },
                {
                    id: 'tenyallas',
                    label: 'Tényállás tisztázás',
                    icon: 'bi-search',
                    uce: 'UCE-2002',
                    funkcio: 'F-0102',
                    required: false,
                    tooltip: 'Rugalmas workflow - Tényállás tisztázása',
                    subtitle: 'Rugalmas workflow',
                    order: 7,
                    optional: true
                },
                {
                    id: 'dontesi-javaslat',
                    label: 'Döntési javaslat',
                    icon: 'bi-pencil-square',
                    uce: 'UCE-1826',
                    funkcio: 'F-0074',
                    required: true,
                    tooltip: 'Döntési javaslat elkészítése',
                    order: 8
                },
                {
                    id: 'dokumentumok',
                    label: 'Dokumentum tervezetek',
                    icon: 'bi-file-earmark-text',
                    uce: 'UCE-1809',
                    funkcio: 'F-0091',
                    required: true,
                    tooltip: 'Végzés/Határozat/Igazolás tervezetek',
                    subtitle: 'F-0091/92/93/94/95',
                    order: 9
                },
                {
                    id: 'hianypotlas',
                    label: 'Hiánypótlás',
                    icon: 'bi-exclamation-circle',
                    uce: 'UCE-2000',
                    funkcio: 'F-0100',
                    required: false,
                    tooltip: 'Hiánypótlási felszólítás készítése',
                    order: 10,
                    optional: true
                },
                {
                    id: 'ertesites',
                    label: 'Ügyfél értesítés',
                    icon: 'bi-envelope',
                    uce: null,
                    funkcio: 'F-0089',
                    required: false,
                    tooltip: 'Email/Levél küldés ügyfélnek',
                    subtitle: 'Email/Levél küldés',
                    order: 11,
                    optional: true
                },
                {
                    id: 'velemenyezes',
                    label: 'Véleményeztetés',
                    icon: 'bi-chat-square-text',
                    uce: 'UCE-1824',
                    funkcio: 'F-0096',
                    required: false,
                    tooltip: 'Döntési javaslat véleményeztetése',
                    order: 12,
                    optional: true
                },
                {
                    id: 'vezetoi-dontes',
                    label: 'Vezetői döntés',
                    icon: 'bi-award',
                    uce: null,
                    funkcio: 'F-0099',
                    required: true,
                    tooltip: 'Vezetői jóváhagyás/elutasítás',
                    subtitle: 'Jóváhagyás/Elutasítás',
                    order: 13
                },
                {
                    id: 'lezaras',
                    label: 'Ügy lezárása',
                    icon: 'bi-check-circle',
                    uce: 'UCE-1828',
                    funkcio: 'F-0097',
                    required: true,
                    tooltip: 'Ügy lezárása és archiválás',
                    order: 14
                }
            ]
        };
    },
    computed: {
        // Aktív workflow lépések az ügy állapota alapján
        visibleSteps() {
            if (!this.ugy || !this.ugy.workflow_steps) {
                return this.allWorkflowSteps.filter(s => s.required);
            }

            // Ügy workflow_steps alapján szűrés
            return this.allWorkflowSteps.filter(step => {
                if (step.required) return true;
                return this.ugy.workflow_steps && this.ugy.workflow_steps[step.id];
            });
        },

        // Modulkód (V-044 vagy H-052)
        modulKod() {
            if (!this.ugy || !this.ugy.ugytipus) return 'V-044';
            return this.ugy.ugytipus.startsWith('H-') ? 'H-052' : 'V-044';
        },

        // Modul szín
        modulColor() {
            return this.modulKod === 'V-044' ? 'vasut' : 'hajozas';
        },

        // Modul név
        modulNev() {
            return this.modulKod === 'V-044' ? 'Vasúti Modul' : 'Hajózási Modul';
        }
    },
    methods: {
        // Lépés státusz meghatározása
        getStepStatus(step) {
            if (!this.ugy || !this.ugy.workflow_steps) {
                return step.id === this.activeTab ? 'in-progress' : 'pending';
            }

            const stepData = this.ugy.workflow_steps[step.id];
            if (!stepData) return 'pending';

            return stepData.status || 'pending';
        },

        // Státusz badge szöveg
        getStatusLabel(status) {
            const labels = {
                'completed': 'kész',
                'in-progress': 'folyamatban',
                'pending': 'várakozik',
                'skipped': 'kihagyva',
                'optional': 'opcionális'
            };
            return labels[status] || 'várakozik';
        },

        // Státusz CSS osztály
        getStatusClass(step) {
            const status = this.getStepStatus(step);

            const classes = [];

            if (status === 'completed') classes.push('completed');
            if (status === 'in-progress') classes.push('in-progress');
            if (status === 'skipped') classes.push('skipped');
            if (step.optional) classes.push('optional');

            return classes.join(' ');
        },

        // Kattinthatóság ellenőrzése
        isClickable(step) {
            // Mindig kattintható (ügyintéző bármikor ugorhat)
            return true;
        },

        // Lépés kiválasztása
        selectStep(step) {
            if (!this.isClickable(step)) return;

            console.log('[WORKFLOW-NAV] Step selected:', step.id);
            this.$emit('select', step.id);
        },

        // Ikon osztályok kollapsz állapothoz
        getCollapsedIcon(step) {
            const status = this.getStepStatus(step);
            const iconClass = step.icon;

            let colorClass = '';
            if (status === 'completed') colorClass = 'text-success';
            else if (status === 'in-progress') colorClass = 'text-warning';
            else colorClass = 'text-muted';

            return `${iconClass} ${colorClass}`;
        }
    },
    template: `
        <div class="sidebar-content">
            <!-- Modul fejléc -->
            <div class="p-3 border-bottom bg-white">
                <h6 class="mb-0 fw-bold" :class="'text-' + modulColor">
                    <i class="bi" :class="modulKod === 'V-044' ? 'bi-train-front' : 'bi-water'"></i>
                    VAHAP - {{ modulNev }}
                </h6>
                <span class="badge mt-2" :class="'bg-' + modulColor">{{ modulKod }}</span>
            </div>

            <!-- Navigációs menü - Workflow lépések -->
            <div class="flex-grow-1 overflow-auto p-2">
                <div class="nav flex-column">

                    <div v-for="step in visibleSteps"
                         :key="step.id"
                         class="workflow-nav-item"
                         :class="[
                             getStatusClass(step),
                             { active: activeTab === step.id },
                             { disabled: !isClickable(step) }
                         ]"
                         @click="selectStep(step)"
                         :title="step.tooltip">

                        <!-- Első sor: UCE/F-kód + Ikon/Státusz -->
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span v-if="step.uce" class="badge badge-uce">{{ step.uce }}</span>
                            <span v-else-if="step.funkcio" class="badge badge-function">{{ step.funkcio }}</span>
                            <span v-else class="badge bg-secondary">-</span>

                            <span class="status-badge" :class="getStepStatus(step)">
                                {{ getStatusLabel(getStepStatus(step)) }}
                            </span>
                        </div>

                        <!-- Második sor: Megnevezés -->
                        <div class="small fw-bold">
                            <i class="bi me-1" :class="step.icon"></i>
                            {{ step.label }}
                        </div>

                        <!-- Harmadik sor: További információk -->
                        <div class="mt-1">
                            <span v-if="step.subtitle" class="badge badge-subtitle">
                                {{ step.subtitle }}
                            </span>
                            <span v-else-if="step.funkcio && step.uce" class="badge badge-function">
                                {{ step.funkcio }}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            <!-- Vissza gomb -->
            <div class="border-top p-3 bg-white">
                <a href="munkalista.html" class="btn btn-outline-secondary btn-sm w-100">
                    <i class="bi bi-arrow-left"></i> Vissza a listára
                </a>
            </div>
        </div>

        <!-- Kollapsz ikon sáv -->
        <div class="collapsed-icon-bar bg-light">
            <div class="text-center mb-3">
                <i class="bi"
                   :class="modulKod === 'V-044' ? 'bi-train-front' : 'bi-water'"
                   style="font-size: 1.5rem;"
                   :style="'color: var(--' + modulColor + '-color);'"></i>
            </div>

            <div v-for="step in visibleSteps.slice(0, 6)"
                 :key="'collapsed-' + step.id"
                 class="text-center mb-2"
                 :title="step.label">
                <i class="bi" :class="getCollapsedIcon(step)"></i>
            </div>

            <div class="text-center mt-3" v-if="visibleSteps.length > 6">
                <span class="badge bg-secondary">+{{ visibleSteps.length - 6 }}</span>
            </div>
        </div>
    `
};
