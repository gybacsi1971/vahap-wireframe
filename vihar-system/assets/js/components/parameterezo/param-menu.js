/**
 * VAHAP Paraméterező - Navigációs Menü Komponens
 * Használat: <param-menu :active-module="activeModule" :modules="modules" @navigate="handleNavigate"></param-menu>
 */

const ParamMenu = {
    name: 'param-menu',
    emits: ['navigate'],
    props: {
        activeModule: {
            type: String,
            default: ''
        },
        modules: {
            type: Array,
            default: () => []
        },
        collapsed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultModules: [
                {
                    id: 'ellenorzesi-listak',
                    icon: 'bi-list-check',
                    label: 'Ellenőrzési Listák',
                    url: 'ellenorzesi-listak.html',
                    funkcio: ['F-0064', 'F-0065', 'F-0066'],
                    aktiv: true,
                    badge: null
                },
                {
                    id: 'hataridok',
                    icon: 'bi-calendar-event',
                    label: 'Határidők',
                    url: 'hataridok.html',
                    funkcio: [],
                    aktiv: true,
                    badge: null
                },
                {
                    id: 'dokumentum-sablonok',
                    icon: 'bi-file-earmark-text',
                    label: 'Dokumentum Sablonok',
                    url: 'dokumentum-sablonok.html',
                    funkcio: ['F-0091', 'F-0092', 'F-0093', 'F-0094', 'F-0095'],
                    aktiv: true,
                    badge: { text: '24', variant: 'success' }
                },
                {
                    id: 'workflow-sablonok',
                    icon: 'bi-diagram-3',
                    label: 'Workflow Sablonok',
                    url: 'workflow-sablonok.html',
                    funkcio: [],
                    aktiv: true,
                    badge: { text: '3', variant: 'info' }
                },
                {
                    id: 'nyilvantartasok',
                    icon: 'bi-database',
                    label: 'Nyilvántartások',
                    url: 'nyilvantartasok.html',
                    funkcio: ['F-0090', 'F-0106'],
                    aktiv: true,
                    badge: null
                },
                {
                    id: 'felhasznalok',
                    icon: 'bi-people',
                    label: 'Felhasználók',
                    url: 'felhasznalok.html',
                    funkcio: [],
                    aktiv: true,
                    badge: { text: '45', variant: 'secondary' }
                },
                {
                    id: 'szerepkorok',
                    icon: 'bi-shield-check',
                    label: 'Szerepkörök',
                    url: 'szerepkorok.html',
                    funkcio: [],
                    aktiv: true,
                    badge: { text: '4', variant: 'primary' }
                },
                {
                    id: 'audit-log',
                    icon: 'bi-clock-history',
                    label: 'Audit Log',
                    url: 'audit-log.html',
                    funkcio: [],
                    aktiv: true,
                    badge: null
                }
            ]
        };
    },
    computed: {
        menuItems() {
            return this.modules.length > 0 ? this.modules : this.defaultModules;
        }
    },
    template: `
        <div class="param-menu" :class="{ 'collapsed': collapsed }">
            <div class="param-menu-header p-3 border-bottom">
                <h6 class="mb-0 text-muted">
                    <i class="bi bi-gear-fill"></i>
                    <span v-if="!collapsed" class="ms-2">PARAMÉTEREK</span>
                </h6>
            </div>

            <div class="param-menu-items">
                <div v-for="module in menuItems"
                     :key="module.id"
                     class="param-menu-item"
                     :class="{
                         'active': activeModule === module.id,
                         'disabled': !module.aktiv
                     }"
                     @click="navigateTo(module)">

                    <div class="menu-item-icon">
                        <i :class="module.icon"></i>
                    </div>

                    <div v-if="!collapsed" class="menu-item-content flex-grow-1">
                        <div class="menu-item-label">
                            {{ module.label }}
                            <span v-if="module.badge"
                                  class="badge ms-2"
                                  :class="'bg-' + (module.badge.variant || 'secondary')">
                                {{ module.badge.text }}
                            </span>
                        </div>

                        <div v-if="module.funkcio && module.funkcio.length > 0"
                             class="menu-item-funkcio">
                            <span v-for="f in module.funkcio.slice(0, 3)"
                                  :key="f"
                                  class="badge badge-function me-1">
                                {{ f }}
                            </span>
                            <span v-if="module.funkcio.length > 3"
                                  class="text-muted small">
                                +{{ module.funkcio.length - 3 }}
                            </span>
                        </div>
                    </div>

                    <div v-if="!collapsed && activeModule === module.id" class="menu-item-active-indicator">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </div>
            </div>

            <div class="param-menu-footer p-3 border-top mt-auto">
                <div v-if="!collapsed" class="small text-muted">
                    <i class="bi bi-info-circle"></i>
                    <div class="mt-1">
                        {{ menuItems.filter(m => m.aktiv).length }} aktív modul
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        navigateTo(module) {
            if (!module.aktiv) {
                console.log('Modul nem aktív:', module.label);
                return;
            }

            if (module.url) {
                window.location.href = module.url;
            } else {
                this.$emit('navigate', module);
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamMenu = ParamMenu;
}
