/**
 * VAHAP Workflow Komponens - Döntés
 * Döntési pontok kezelése a workflow-ban
 */

const WfDontes = {
    name: 'wf-dontes',

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
            selectedDecision: null,
            decisionReason: '',
            decisionOptions: [
                {
                    id: 'engedelyez',
                    title: 'Engedélyezés',
                    description: 'A kérelem minden követelménynek megfelel, engedélyezhető.',
                    icon: 'bi-check-circle-fill',
                    color: 'success',
                    nextStep: 'hatrozat_keszites'
                },
                {
                    id: 'reszben_engedelyez',
                    title: 'Részben engedélyezés',
                    description: 'A kérelem részben teljesíthető, feltételekkel engedélyezhető.',
                    icon: 'bi-slash-circle-fill',
                    color: 'warning',
                    nextStep: 'hatrozat_keszites'
                },
                {
                    id: 'elutasit',
                    title: 'Elutasítás',
                    description: 'A kérelem nem teljesíthető, elutasításra kerül.',
                    icon: 'bi-x-circle-fill',
                    color: 'danger',
                    nextStep: 'elutasito_hatrozat'
                },
                {
                    id: 'hianypotlas',
                    title: 'Hiánypótlás',
                    description: 'További dokumentumok vagy információk szükségesek.',
                    icon: 'bi-exclamation-triangle-fill',
                    color: 'info',
                    nextStep: 'hianypotlas_felszolitas'
                }
            ]
        };
    },

    methods: {
        selectDecision(option) {
            this.selectedDecision = option;
        },

        executeDecision() {
            if (!this.selectedDecision || !this.decisionReason.trim()) {
                alert('Kérem válasszon döntést és adja meg az indoklást!');
                return;
            }

            this.$emit('complete', {
                type: 'dontes',
                decision: this.selectedDecision.id,
                reason: this.decisionReason,
                nextStep: this.selectedDecision.nextStep
            });
        }
    },

    template: `
        <div class="component-card dontes-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-signpost-split text-primary"></i>
                    Döntési pont
                    <span class="badge bg-secondary ms-2">F-0088</span>
                </h5>
            </div>

            <div class="component-card-body">
                <div class="dontes-options">
                    <div v-for="option in decisionOptions" :key="option.id"
                         class="dontes-option-card"
                         :class="{
                             selected: selectedDecision?.id === option.id,
                             [option.color]: true
                         }"
                         @click="selectDecision(option)">
                        <div class="dontes-option-icon">
                            <i :class="option.icon"></i>
                        </div>
                        <div class="dontes-option-title">{{ option.title }}</div>
                        <div class="dontes-option-description">{{ option.description }}</div>
                    </div>
                </div>

                <div v-if="selectedDecision" class="mt-4">
                    <label class="form-label fw-bold">Döntés indoklása</label>
                    <textarea class="form-control" rows="4" v-model="decisionReason"
                              placeholder="Adja meg a döntés részletes indoklását..."></textarea>
                </div>

                <div class="d-flex justify-content-between mt-4">
                    <button class="btn btn-secondary" @click="$emit('action', {type: 'cancel'})">
                        <i class="bi bi-arrow-left"></i> Vissza
                    </button>
                    <button class="btn btn-primary" @click="executeDecision"
                            :disabled="!selectedDecision || !decisionReason.trim()">
                        <i class="bi bi-check2-square"></i> Döntés végrehajtása
                    </button>
                </div>
            </div>
        </div>
    `
};