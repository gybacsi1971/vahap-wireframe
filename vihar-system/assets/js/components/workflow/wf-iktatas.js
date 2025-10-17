/**
 * VAHAP Workflow Komponens - Iktatás
 * EKEIDR iktatási interfész (F-0078, F-0079)
 */

const WfIktatas = {
    name: 'wf-iktatas',

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

    template: `
        <div class="component-card iktatas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-inbox text-primary"></i>
                    Iktatás
                    <span class="badge bg-secondary ms-2">F-0078</span>
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Iktatás komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};