/**
 * VAHAP Workflow Komponens - Kiadmányozás
 * Dokumentum jóváhagyása és aláírása
 */

const WfKiadmanyozas = {
    name: 'wf-kiadmanyozas',

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
        <div class="component-card kiadmanyozas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-pen text-primary"></i>
                    Kiadmányozás
                </h5>
            </div>
            <div class="component-card-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Kiadmányozás komponens implementáció folyamatban...
                </div>
            </div>
        </div>
    `
};