/**
 * VAHAP - Ügyfél Információk Panel (Jobb oldal)
 * Ügyfél alapadatainak megjelenítése
 * Használat: <vahap-panel-ugyfel :ugy="ugy"></vahap-panel-ugyfel>
 */

const VahapPanelUgyfel = {
    name: 'vahap-panel-ugyfel',
    props: {
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    computed: {
        ugyfel() {
            return this.ugy.ugyfel || {};
        }
    },
    template: `
        <div class="p-3">
            <h6 class="mb-3">
                <i class="bi bi-person-circle text-info"></i> Ügyfél információk
            </h6>
            <div class="small">
                <div class="mb-2">
                    <strong>Név:</strong><br>
                    {{ ugyfel.nev || 'N/A' }}
                </div>
                <div class="mb-2">
                    <strong>Születési dátum:</strong><br>
                    {{ ugyfel.szuletesi_datum || 'N/A' }}
                </div>
                <div class="mb-2">
                    <strong>Anyja neve:</strong><br>
                    {{ ugyfel.anya_neve || 'N/A' }}
                </div>
                <div class="mb-2">
                    <strong>Lakcím:</strong><br>
                    {{ ugyfel.lakcim || 'N/A' }}
                </div>
                <div class="mb-2">
                    <strong>Telefon:</strong><br>
                    <a v-if="ugyfel.telefon" :href="'tel:' + ugyfel.telefon">{{ ugyfel.telefon }}</a>
                    <span v-else>N/A</span>
                </div>
                <div class="mb-2">
                    <strong>E-mail:</strong><br>
                    <a v-if="ugyfel.email" :href="'mailto:' + ugyfel.email">{{ ugyfel.email }}</a>
                    <span v-else>N/A</span>
                </div>
            </div>

            <!-- Ügyfél kapcsolat gyorsgombok -->
            <div class="mt-3 d-grid gap-2">
                <button v-if="ugyfel.telefon"
                        class="btn btn-sm btn-outline-primary"
                        @click="callUgyfel">
                    <i class="bi bi-telephone"></i> Hívás
                </button>
                <button v-if="ugyfel.email"
                        class="btn btn-sm btn-outline-secondary"
                        @click="emailUgyfel">
                    <i class="bi bi-envelope"></i> E-mail
                </button>
            </div>
        </div>
    `,
    methods: {
        callUgyfel() {
            console.log('Ügyfél hívása:', this.ugyfel.telefon);
            window.location.href = `tel:${this.ugyfel.telefon}`;
        },
        emailUgyfel() {
            console.log('Ügyfél e-mail:', this.ugyfel.email);
            window.location.href = `mailto:${this.ugyfel.email}`;
        }
    }
};
