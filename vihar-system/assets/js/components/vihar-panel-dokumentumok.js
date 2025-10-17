/**
 * VAHAP - Kapcsolódó Dokumentumok Panel (Jobb oldal)
 * F-0107 - Kérelem adatlap
 * Használat: <vahap-panel-dokumentumok :ugy="ugy" @download="handleDownload"></vahap-panel-dokumentumok>
 */

const VahapPanelDokumentumok = {
    name: 'vahap-panel-dokumentumok',
    props: {
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    computed: {
        dokumentumok() {
            return this.ugy.dokumentumok || [
                { nev: 'Kérelem adatlap', datum: '2024-09-25', tipus: 'pdf' },
                { nev: 'Személyi igazolvány másolat', datum: '2024-09-25', tipus: 'pdf' },
                { nev: 'Lakcímkártya másolat', datum: '2024-09-25', tipus: 'pdf' },
                { nev: 'Vasútegészségügyi igazolás', datum: '2024-09-20', tipus: 'pdf' }
            ];
        }
    },
    template: `
        <div class="border-bottom p-3">
            <h6 class="mb-3">
                <i class="bi bi-file-text text-danger"></i> Kapcsolódó dokumentumok
                <span class="badge bg-dark ms-2">F-0107</span>
            </h6>
            <div class="documents-list">
                <div v-for="(dok, index) in dokumentumok"
                     :key="index"
                     class="document-item"
                     @click="downloadDoc(dok)">
                    <div class="d-flex align-items-center flex-grow-1">
                        <i class="bi document-icon"
                           :class="{
                               'bi-file-pdf': dok.tipus === 'pdf',
                               'bi-file-word': dok.tipus === 'doc',
                               'bi-file-earmark': !dok.tipus
                           }"></i>
                        <div class="flex-grow-1">
                            <div class="small">{{ dok.nev }}</div>
                            <div class="text-muted" style="font-size: 0.7rem;">{{ dok.datum }}</div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-link p-0" @click.stop="downloadDoc(dok)">
                        <i class="bi bi-download"></i>
                    </button>
                </div>
            </div>

            <!-- Dokumentum feltöltés gomb -->
            <div class="mt-3">
                <button class="btn btn-sm btn-outline-primary w-100" @click="uploadDoc">
                    <i class="bi bi-upload"></i> Új dokumentum feltöltése
                </button>
            </div>
        </div>
    `,
    methods: {
        downloadDoc(dok) {
            console.log('F-0107 - Dokumentum letöltése:', dok.nev);
            this.$emit('download', dok);
            alert(`Dokumentum letöltése: ${dok.nev}`);
        },
        uploadDoc() {
            console.log('F-0107 - Dokumentum feltöltés');
            this.$emit('upload');
            alert('Dokumentum feltöltés megnyitása...');
        }
    }
};
