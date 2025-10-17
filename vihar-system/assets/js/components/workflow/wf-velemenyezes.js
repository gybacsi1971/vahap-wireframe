/**
 * VAHAP Workflow Komponens - Véleményezés
 * Döntési javaslat véleményeztetése (F-0096, UCE-1824)
 */

const WfVelemenyezes = {
    name: 'wf-velemenyezes',

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
        <div class="component-card velemenyezes-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-chat-dots text-primary"></i>
                    Véleményezés
                    <span class="badge bg-secondary ms-2">F-0096</span>
                    <span class="badge bg-info ms-1">UCE-1824</span>
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Véleményezés komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};