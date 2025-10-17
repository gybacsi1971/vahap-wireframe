/**
 * VAHAP Workflow Komponens - Expediálás
 * Jóváhagyott dokumentum postázása
 */

const WfExpedialas = {
    name: 'wf-expedialas',

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
        <div class="component-card expedialas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-send text-primary"></i>
                    Expediálás
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Expediálás komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};