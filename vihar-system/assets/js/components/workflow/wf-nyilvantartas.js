/**
 * VAHAP Workflow Komponens - Nyilvántartás
 * VNY024 és más nyilvántartások kezelése (F-0090, F-0106)
 */

const WfNyilvantartas = {
    name: 'wf-nyilvantartas',

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
        <div class="component-card nyilvantartas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-database text-primary"></i>
                    Nyilvántartás
                    <span class="badge bg-secondary ms-2">F-0090</span>
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Nyilvántartás komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};