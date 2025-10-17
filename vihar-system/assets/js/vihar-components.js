/**
 * VAHAP - Újrafelhasználható Vue.js Komponensek
 *
 * Ez a fájl tartalmazza az összes közös Vue komponenst,
 * amelyek modulok között megoszthatók.
 */

// Progress Wizard Komponens (Külső rendszer)
const ProgressWizard = {
    name: 'ProgressWizard',
    props: {
        steps: {
            type: Array,
            required: true
        },
        currentStep: {
            type: Number,
            required: true
        }
    },
    template: `
        <div class="progress-wizard mb-4">
            <div
                v-for="(step, index) in steps"
                :key="index"
                class="progress-step"
                :class="{
                    'completed': currentStep > index + 1,
                    'active': currentStep === index + 1
                }"
            >
                <div class="progress-step-circle">
                    <i class="bi" :class="currentStep > index + 1 ? 'bi-check-lg' : 'bi-' + (index + 1) + '-circle'"></i>
                </div>
                <div class="progress-step-label">
                    <small>{{ step.code }}</small><br>
                    {{ step.label }}
                </div>
            </div>
        </div>
    `
};

// Ellenőrzési Lista Komponens (Belső rendszer)
const ChecklistItem = {
    name: 'ChecklistItem',
    props: {
        id: String,
        label: String,
        description: String,
        checked: Boolean
    },
    emits: ['update:checked'],
    template: `
        <div class="checklist-item" :class="{'checked': checked}">
            <div class="form-check">
                <input
                    class="form-check-input checklist-checkbox"
                    type="checkbox"
                    :checked="checked"
                    @change="$emit('update:checked', $event.target.checked)"
                    :id="id"
                >
                <label class="form-check-label" :for="id">
                    <strong>{{ label }}</strong><br>
                    <small class="text-muted">{{ description }}</small>
                </label>
            </div>
        </div>
    `
};

// Ügy Fejléc Komponens (Belső rendszer)
const CaseHeader = {
    name: 'CaseHeader',
    props: {
        caseData: {
            type: Object,
            required: true
        },
        color: {
            type: String,
            default: 'var(--vihar-primary)'
        }
    },
    template: `
        <div class="case-header" :style="{ background: 'linear-gradient(135deg, ' + color + ' 0%, #0066b3 100%)' }">
            <div class="row">
                <div class="col case-info-item">
                    <div class="case-info-label">Ügyazonosító</div>
                    <div class="case-info-value">{{ caseData.ugyazonosito }}</div>
                </div>
                <div class="col case-info-item">
                    <div class="case-info-label">{{ caseData.ugyfelLabel || 'Ügyfél' }}</div>
                    <div class="case-info-value">{{ caseData.ugyfel }}</div>
                </div>
                <div class="col case-info-item">
                    <div class="case-info-label">Határidő</div>
                    <div class="case-info-value">{{ caseData.hatarido }}</div>
                </div>
                <div class="col case-info-item">
                    <div class="case-info-label">Állapot</div>
                    <div class="case-info-value">
                        <span class="badge badge-status" :class="'badge-' + caseData.statuszClass">
                            {{ caseData.statusz }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Timeline Komponens (Belső rendszer)
const TimelineItem = {
    name: 'TimelineItem',
    props: {
        date: String,
        title: String,
        description: String
    },
    template: `
        <div class="timeline-item timeline-item-small">
            <div class="timeline-date">{{ date }}</div>
            <div class="timeline-content">
                <strong>{{ title }}</strong><br>
                <small>{{ description }}</small>
            </div>
        </div>
    `
};

const Timeline = {
    name: 'Timeline',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    components: {
        TimelineItem
    },
    template: `
        <div class="timeline">
            <TimelineItem
                v-for="(item, index) in items"
                :key="index"
                :date="item.date"
                :title="item.title"
                :description="item.description"
            />
        </div>
    `
};

// Dokumentum Lista Komponens
const DocumentList = {
    name: 'DocumentList',
    props: {
        documents: {
            type: Array,
            required: true
        },
        color: {
            type: String,
            default: 'var(--vihar-info)'
        }
    },
    template: `
        <div>
            <div
                v-for="(doc, index) in documents"
                :key="index"
                class="document-link"
                :style="{ borderLeftColor: color }"
                @click="$emit('document-click', doc)"
            >
                <i :class="'bi ' + doc.icon + ' text-danger'"></i>
                {{ doc.name }}
            </div>
        </div>
    `
};

// Döntési Gombok Panel (Belső rendszer)
const DecisionPanel = {
    name: 'DecisionPanel',
    props: {
        decisions: {
            type: Array,
            required: true
        },
        functionCode: {
            type: String,
            default: 'F-0088'
        }
    },
    template: `
        <div class="border-bottom p-3">
            <h6 class="mb-3">
                <i class="bi bi-check-circle"></i> Döntési pontok
                <span class="badge bg-dark ms-2">{{ functionCode }}</span>
            </h6>
            <div class="decision-buttons">
                <button
                    v-for="(decision, index) in decisions"
                    :key="index"
                    :class="'btn btn-' + decision.variant"
                    @click="$emit('decision-click', decision)"
                >
                    <span v-if="decision.code" class="badge bg-light text-dark">{{ decision.code }}</span>
                    {{ decision.label }}
                </button>
            </div>
        </div>
    `
};

// Bal Oldali Navigáció (Belső rendszer)
const SideNavigation = {
    name: 'SideNavigation',
    props: {
        moduleInfo: {
            type: Object,
            required: true
        },
        userInfo: {
            type: Object,
            required: true
        },
        menuItems: {
            type: Array,
            required: true
        },
        actions: {
            type: Array,
            default: () => []
        },
        activeTab: String
    },
    template: `
        <div class="col-md-2 bg-light border-end p-0">
            <div class="d-flex flex-column h-100">
                <!-- Modul fejléc -->
                <div class="p-3 border-bottom text-white" :class="'bg-' + moduleInfo.colorClass">
                    <h6 class="mb-1">
                        <i :class="'bi ' + moduleInfo.icon"></i> {{ moduleInfo.name }}
                    </h6>
                    <span class="badge bg-light text-dark">{{ moduleInfo.code }}</span>
                </div>

                <!-- Ügyintéző info -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person-circle fs-4 me-2"></i>
                        <div>
                            <small class="text-muted d-block">Ügyintéző</small>
                            <strong style="font-size: 0.85em;">{{ userInfo.name }}</strong>
                        </div>
                    </div>
                    <small class="text-muted">
                        <i class="bi bi-building"></i> {{ userInfo.department }}<br>
                        <span class="badge bg-secondary mt-1">{{ userInfo.role }}</span>
                    </small>
                </div>

                <!-- Navigációs menü -->
                <div class="flex-grow-1 overflow-auto p-2">
                    <small class="text-muted px-2">WORKFLOW LÉPÉSEK</small>
                    <div class="nav flex-column mt-2">
                        <a
                            v-for="item in menuItems"
                            :key="item.id"
                            class="nav-link"
                            :class="{'active': activeTab === item.id}"
                            @click="$emit('tab-change', item.id)"
                        >
                            <span class="badge me-1" :class="'bg-' + item.badgeVariant">{{ item.code }}</span>
                            {{ item.label }}
                        </a>
                    </div>

                    <hr v-if="actions.length > 0">

                    <small v-if="actions.length > 0" class="text-muted px-2">MŰVELETEK</small>
                    <div v-if="actions.length > 0" class="nav flex-column mt-2">
                        <a
                            v-for="action in actions"
                            :key="action.id"
                            class="nav-link"
                            @click="$emit('tab-change', action.id)"
                        >
                            <i :class="'bi ' + action.icon"></i>
                            {{ action.label }}
                        </a>
                    </div>
                </div>

                <!-- Vissza gomb -->
                <div class="p-3 border-top">
                    <a href="../../index.html" class="btn btn-outline-secondary btn-sm w-100">
                        <i class="bi bi-arrow-left"></i> Főoldal
                    </a>
                </div>
            </div>
        </div>
    `
};

// Melléklet Feltöltő Lista
const AttachmentList = {
    name: 'AttachmentList',
    props: {
        attachments: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="list-group mb-4">
            <div
                v-for="(attachment, index) in attachments"
                :key="index"
                class="list-group-item"
            >
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="bi bi-file-earmark-pdf fs-4 me-2"
                           :class="attachment.required ? 'text-danger' : 'text-secondary'"></i>
                        <strong>{{ attachment.name }}</strong>
                        <span class="badge ms-2"
                              :class="attachment.required ? 'bg-danger' : 'bg-secondary'">
                            {{ attachment.required ? 'Kötelező' : 'Opcionális' }}
                        </span>
                    </div>
                    <button
                        class="btn btn-sm"
                        :class="attachment.required ? 'btn-outline-primary' : 'btn-outline-secondary'"
                        @click="$emit('upload', attachment)"
                    >
                        <i class="bi bi-upload"></i> Feltöltés
                    </button>
                </div>
            </div>
        </div>
    `
};

// Alert Komponens
const AlertBox = {
    name: 'AlertBox',
    props: {
        variant: {
            type: String,
            default: 'info'
        },
        icon: String,
        title: String,
        message: String
    },
    template: `
        <div :class="'alert alert-' + variant">
            <i v-if="icon" :class="'bi ' + icon"></i>
            <strong v-if="title">{{ title }}</strong>
            <p v-if="message" :class="title ? 'mb-0 mt-2' : 'mb-0'">{{ message }}</p>
            <slot></slot>
        </div>
    `
};

// Funkció Badge Komponens
const FunctionBadge = {
    name: 'FunctionBadge',
    props: {
        code: {
            type: String,
            required: true
        },
        variant: {
            type: String,
            default: 'secondary'
        }
    },
    template: `
        <span :class="'badge bg-' + variant + ' ms-1 font-monospace'" style="font-size: 0.75em;">
            {{ code }}
        </span>
    `
};

// Statisztika Panel
const StatisticsPanel = {
    name: 'StatisticsPanel',
    props: {
        statistics: {
            type: Object,
            required: true
        }
    },
    computed: {
        progressPercentage() {
            if (!this.statistics.totalDays) return 0;
            return Math.round((this.statistics.elapsedDays / this.statistics.totalDays) * 100);
        },
        progressVariant() {
            if (this.progressPercentage < 50) return 'success';
            if (this.progressPercentage < 80) return 'warning';
            return 'danger';
        }
    },
    template: `
        <div class="p-3">
            <h6 class="mb-3">
                <i class="bi bi-graph-up"></i> Ügy statisztika
            </h6>
            <div class="small">
                <p class="mb-2">
                    <i class="bi bi-calendar-check"></i>
                    Beérkezés: <strong>{{ statistics.startDate }}</strong>
                </p>
                <p class="mb-2">
                    <i class="bi bi-hourglass-split"></i>
                    Eltelt idő: <strong>{{ statistics.elapsedDays }} nap</strong>
                </p>
                <p class="mb-2">
                    <i class="bi bi-alarm"></i>
                    Hátralévő: <strong>{{ statistics.remainingDays }} nap</strong>
                </p>
                <div class="progress" style="height: 8px;">
                    <div
                        class="progress-bar"
                        :class="'bg-' + progressVariant"
                        role="progressbar"
                        :style="{ width: progressPercentage + '%' }"
                    ></div>
                </div>
                <small class="text-muted">{{ statistics.procedureType }}: {{ statistics.totalDays }} nap</small>
            </div>
        </div>
    `
};

// Munkalista Komponens (Dashboard)
const CaseList = {
    name: 'CaseList',
    props: {
        cases: {
            type: Array,
            required: true
        },
        userRole: {
            type: String,
            default: 'external' // external vagy internal
        },
        moduleType: {
            type: String,
            required: true // vasut vagy hajozas
        }
    },
    data() {
        return {
            searchQuery: '',
            statusFilter: 'all',
            sortBy: 'date',
            sortOrder: 'desc'
        };
    },
    computed: {
        filteredCases() {
            let filtered = [...this.cases];

            // Szöveges keresés
            if (this.searchQuery) {
                filtered = filtered.filter(c =>
                    c.ugyazonosito.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    c.ugyfel.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    c.megnevezes.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            // Státusz szűrés
            if (this.statusFilter !== 'all') {
                filtered = filtered.filter(c => c.statusz === this.statusFilter);
            }

            // Rendezés
            filtered.sort((a, b) => {
                let aVal, bVal;

                if (this.sortBy === 'date') {
                    aVal = new Date(a.benyujtasDatum);
                    bVal = new Date(b.benyujtasDatum);
                } else if (this.sortBy === 'deadline') {
                    aVal = new Date(a.hatarido);
                    bVal = new Date(b.hatarido);
                } else if (this.sortBy === 'id') {
                    aVal = a.ugyazonosito;
                    bVal = b.ugyazonosito;
                } else if (this.sortBy === 'status') {
                    aVal = a.statusz;
                    bVal = b.statusz;
                }

                if (this.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });

            return filtered;
        },

        statusOptions() {
            const statuses = [...new Set(this.cases.map(c => c.statusz))];
            return statuses;
        }
    },
    template: `
        <div class="case-list-container">
            <!-- Keresés és szűrők -->
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Keresés (ügyazonosító, ügyfél, megnevezés)..."
                                    v-model="searchQuery"
                                >
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="statusFilter">
                                <option value="all">Összes állapot</option>
                                <option v-for="status in statusOptions" :key="status" :value="status">
                                    {{ status }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="sortBy">
                                <option value="date">Benyújtás dátuma</option>
                                <option value="deadline">Határidő</option>
                                <option value="id">Ügyazonosító</option>
                                <option value="status">Állapot</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" v-model="sortOrder">
                                <option value="desc">Csökkenő</option>
                                <option value="asc">Növekvő</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Találatok száma -->
            <div class="mb-3">
                <span class="badge bg-secondary">{{ filteredCases.length }} ügy</span>
            </div>

            <!-- Ügy lista -->
            <div class="list-group">
                <a
                    v-for="caseItem in filteredCases"
                    :key="caseItem.ugyazonosito"
                    href="#"
                    class="list-group-item list-group-item-action"
                    @click.prevent="$emit('case-select', caseItem)"
                >
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">
                                <i :class="'bi bi-' + (moduleType === 'vasut' ? 'train-front' : 'water')"></i>
                                {{ caseItem.ugyazonosito }}
                                <span class="badge ms-2" :class="'badge-' + caseItem.statuszClass">
                                    {{ caseItem.statusz }}
                                </span>
                            </h6>
                            <p class="mb-1 text-muted small">{{ caseItem.megnevezes }}</p>
                            <div class="d-flex gap-3 small text-muted">
                                <span><i class="bi bi-person"></i> {{ caseItem.ugyfel }}</span>
                                <span><i class="bi bi-calendar"></i> {{ caseItem.benyujtasDatum }}</span>
                                <span><i class="bi bi-alarm"></i> Határidő: {{ caseItem.hatarido }}</span>
                                <span v-if="userRole === 'internal' && caseItem.ugyintezo">
                                    <i class="bi bi-person-badge"></i> {{ caseItem.ugyintezo }}
                                </span>
                            </div>
                        </div>
                        <div>
                            <i class="bi bi-chevron-right"></i>
                        </div>
                    </div>
                </a>
            </div>

            <!-- Üres állapot -->
            <div v-if="filteredCases.length === 0" class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <p class="text-muted mt-3">Nincs megjeleníthető ügy</p>
            </div>
        </div>
    `
};

// Új Ügy Indítás Komponens (Külső rendszer)
const NewCaseButton = {
    name: 'NewCaseButton',
    props: {
        moduleType: {
            type: String,
            required: true
        },
        userRole: {
            type: String,
            default: 'external'
        }
    },
    template: `
        <button
            class="btn btn-primary btn-lg w-100 mb-3"
            @click="$emit('new-case')"
        >
            <i class="bi bi-plus-circle"></i>
            Új {{ moduleType === 'vasut' ? 'vasúti' : 'hajózási' }} kérelem indítása
        </button>
    `
};

// Ügy Érkeztetése Komponens (Belső rendszer - EKEIDR)
const ReceiveCaseButton = {
    name: 'ReceiveCaseButton',
    props: {
        moduleType: {
            type: String,
            required: true
        }
    },
    template: `
        <button
            class="btn btn-success btn-lg w-100 mb-3"
            @click="$emit('receive-case')"
        >
            <i class="bi bi-inbox-fill"></i>
            Új ügy érkeztetése (EKEIDR)
            <span class="badge bg-light text-dark ms-2">F-0078</span>
        </button>
    `
};

// Dashboard Statisztika Kártyák
const DashboardStats = {
    name: 'DashboardStats',
    props: {
        stats: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="card border-primary">
                    <div class="card-body text-center">
                        <h3 class="mb-0">{{ stats.total }}</h3>
                        <small class="text-muted">Összes ügy</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-warning">
                    <div class="card-body text-center">
                        <h3 class="mb-0">{{ stats.pending }}</h3>
                        <small class="text-muted">Folyamatban</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-danger">
                    <div class="card-body text-center">
                        <h3 class="mb-0">{{ stats.urgent }}</h3>
                        <small class="text-muted">Sürgős</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-success">
                    <div class="card-body text-center">
                        <h3 class="mb-0">{{ stats.completed }}</h3>
                        <small class="text-muted">Lezárt</small>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Globális komponensek regisztrálása
if (typeof window !== 'undefined' && window.Vue) {
    // Ezeket a komponenseket minden Vue app használhatja
    window.VahapComponents = {
        ProgressWizard,
        ChecklistItem,
        CaseHeader,
        Timeline,
        TimelineItem,
        DocumentList,
        DecisionPanel,
        SideNavigation,
        AttachmentList,
        AlertBox,
        FunctionBadge,
        StatisticsPanel,
        CaseList,
        NewCaseButton,
        ReceiveCaseButton,
        DashboardStats
    };
}
