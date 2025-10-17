/**
 * VAHAP Paraméterező - Fejléc Komponens
 * Használat: <param-header :title="title" :breadcrumbs="breadcrumbs" :show-save="true" @save="handleSave"></param-header>
 */

const ParamHeader = {
    name: 'param-header',
    emits: ['save', 'back'],
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            default: ''
        },
        breadcrumbs: {
            type: Array,
            default: () => [
                { label: 'Főoldal', url: '../index.html' },
                { label: 'Paraméterező', url: 'index.html' }
            ]
        },
        showSave: {
            type: Boolean,
            default: false
        },
        showBack: {
            type: Boolean,
            default: true
        },
        adminUser: {
            type: String,
            default: 'Rendszergazda'
        },
        adminRole: {
            type: String,
            default: 'VHF_ADMIN'
        },
        saveDisabled: {
            type: Boolean,
            default: false
        },
        modified: {
            type: Boolean,
            default: false
        }
    },
    template: `
        <nav class="navbar navbar-dark bg-vahap-primary sticky-top">
            <div class="container-fluid px-4">
                <span class="navbar-brand d-flex align-items-center">
                    <i class="bi bi-sliders"></i>
                    <span class="ms-2">VAHAP Paraméterező Modul</span>
                    <span class="badge bg-light text-dark ms-2">{{ title }}</span>
                    <span v-if="modified" class="badge bg-warning text-dark ms-2">
                        <i class="bi bi-exclamation-circle"></i> Módosítva
                    </span>
                </span>

                <div class="ms-auto d-flex align-items-center gap-3">
                    <!-- Felhasználó info -->
                    <span class="text-white small">
                        <i class="bi bi-person-badge"></i> {{ adminUser }}
                        <span class="badge bg-light text-dark ms-1">{{ adminRole }}</span>
                    </span>

                    <!-- Vissza gomb -->
                    <button v-if="showBack"
                            class="btn btn-outline-light btn-sm"
                            @click="$emit('back')">
                        <i class="bi bi-arrow-left"></i> Vissza
                    </button>

                    <!-- Mentés gomb -->
                    <button v-if="showSave"
                            class="btn btn-light btn-sm"
                            @click="handleSave"
                            :disabled="saveDisabled">
                        <i class="bi bi-save"></i> Mentés
                    </button>

                    <!-- Főoldal gomb -->
                    <a href="../index.html" class="btn btn-outline-light btn-sm">
                        <i class="bi bi-house"></i> Főoldal
                    </a>
                </div>
            </div>

            <!-- Breadcrumb navigáció -->
            <div v-if="breadcrumbs.length > 0" class="container-fluid px-4 py-2 bg-light border-top">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0 small">
                        <li v-for="(crumb, index) in breadcrumbs"
                            :key="index"
                            class="breadcrumb-item"
                            :class="{ active: index === breadcrumbs.length - 1 }">
                            <a v-if="index < breadcrumbs.length - 1 && crumb.url" :href="crumb.url">
                                {{ crumb.label }}
                            </a>
                            <span v-else>{{ crumb.label }}</span>
                        </li>
                    </ol>
                </nav>
                <div v-if="subtitle" class="text-muted small mt-1">
                    {{ subtitle }}
                </div>
            </div>
        </nav>
    `,
    methods: {
        handleSave() {
            if (!this.saveDisabled) {
                this.$emit('save');
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.ParamHeader = ParamHeader;
}
