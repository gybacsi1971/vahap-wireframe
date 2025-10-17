/**
 * VAHAP Workflow Komponens - Rugalmas Workflow
 * Tényállás tisztázás dinamikus workflow (F-0102)
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

    template: `
        <div class="component-card rugalmas-workflow-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-diagram-3 text-primary"></i>
                    Rugalmas Workflow - Tényállás tisztázás
                    <span class="badge bg-secondary ms-2">F-0102</span>
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Rugalmas workflow komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};