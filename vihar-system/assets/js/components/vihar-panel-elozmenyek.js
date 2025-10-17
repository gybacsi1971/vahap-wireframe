/**
 * VAHAP - Eljárás Előzmények Panel (Jobb oldal)
 * Timeline megjelenítés kronológiai sorrendben
 * Használat: <vahap-panel-elozmenyek :ugy="ugy"></vahap-panel-elozmenyek>
 */

const VahapPanelElozmenyek = {
    name: 'vahap-panel-elozmenyek',
    props: {
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            elozmenyek: []
        };
    },
    mounted() {
        this.generateElozmenyek();
    },
    template: `
        <div class="border-bottom p-3">
            <h6 class="mb-3">
                <i class="bi bi-clock-history text-primary"></i> Eljárás előzmények
            </h6>
            <div class="timeline">
                <div v-for="(item, index) in elozmenyek"
                     :key="index"
                     class="timeline-item"
                     :class="item.statusz">
                    <div class="timeline-date">{{ item.datum }}</div>
                    <div class="timeline-content">
                        <strong>{{ item.cim }}</strong><br>
                        <span v-if="item.uce" class="badge badge-uce">{{ item.uce }}</span>
                        <span v-if="item.f_kod" class="badge badge-function ms-1">{{ item.f_kod }}</span>
                        <div class="small mt-1"
                             :class="{
                                 'text-success': item.statusz === 'completed',
                                 'text-warning': item.statusz === 'in-progress' || item.statusz === 'warning',
                                 'text-muted': !item.statusz
                             }">
                            <i v-if="item.statusz === 'completed'" class="bi bi-check-circle"></i>
                            <i v-else-if="item.statusz === 'in-progress'" class="bi bi-hourglass-split"></i>
                            <i v-else-if="item.statusz === 'warning'" class="bi bi-exclamation-triangle"></i>
                            {{ item.leiras }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        generateElozmenyek() {
            // Alapértelmezett előzmények
            const base = [
                {
                    datum: '2024.10.17',
                    cim: 'Formai ellenőrzés megkezdve',
                    uce: 'UCE-1799',
                    leiras: 'Dr. Szabó Péter',
                    statusz: 'in-progress'
                },
                {
                    datum: '2024.10.16',
                    cim: 'Hatáskör vizsgálat',
                    uce: 'UCE-1793',
                    leiras: 'Hatáskör biztosított',
                    statusz: 'completed'
                },
                {
                    datum: '2024.10.15',
                    cim: 'Érkeztetés',
                    uce: 'UCE-1778',
                    leiras: 'EKEIDR iktatószám: 12345/2024',
                    statusz: 'completed'
                },
                {
                    datum: '2024.10.15',
                    cim: 'Kérelem benyújtva',
                    uce: null,
                    leiras: `Ügyfél: ${this.ugy.ugyfel?.nev || 'N/A'}`,
                    statusz: 'completed'
                }
            ];

            // ⭐ Hiánypótlási körök hozzáadása
            if (this.ugy.hianypotlas_korok && this.ugy.hianypotlas_korok.length > 0) {
                const hpElozmenyek = [];

                this.ugy.hianypotlas_korok.forEach(kor => {
                    // Felszólítás kiküldése
                    hpElozmenyek.push({
                        datum: kor.kikuldve,
                        cim: `${kor.kor}. hiánypótlási felszólítás kiküldve`,
                        uce: kor.UCE_kod,
                        f_kod: kor.F_kod,
                        leiras: `Határidő: ${kor.hatarido}`,
                        statusz: 'completed',
                        tipus: 'hianypotlas_felszolitas'
                    });

                    // Benyújtás (ha megtörtént)
                    if (kor.benyujtva) {
                        hpElozmenyek.push({
                            datum: kor.benyujtva,
                            cim: `${kor.kor}. hiánypótlás benyújtva`,
                            uce: kor.UCE_benyujtas,
                            f_kod: kor.F_benyujtas,
                            leiras: `Ügyfél: ${this.ugy.ugyfel?.nev || 'N/A'}`,
                            statusz: 'completed',
                            tipus: 'hianypotlas_benyujtas'
                        });
                    }

                    // Ellenőrzés (ha megtörtént)
                    if (kor.ellenorzes_eredmeny) {
                        hpElozmenyek.push({
                            datum: kor.ellenorzes_datum,
                            cim: `${kor.kor}. hiánypótlás ellenőrzése`,
                            uce: 'UCE-1880',
                            f_kod: 'F-0072',
                            leiras: kor.ellenorzes_eredmeny === 'reszben_teljesitett' ?
                                    'Részben teljesített - újabb kör szükséges (UCE-1882)' :
                                    'Teljesítve',
                            statusz: kor.ellenorzes_eredmeny === 'reszben_teljesitett' ? 'warning' : 'completed',
                            tipus: 'hianypotlas_ellenorzes'
                        });
                    }
                });

                // Egyesítjük az előzményekkel
                this.elozmenyek = [...hpElozmenyek, ...base].sort((a, b) => {
                    return new Date(b.datum.replace(/\./g, '-')) - new Date(a.datum.replace(/\./g, '-'));
                });
            } else {
                this.elozmenyek = base;
            }
        },
        addElozmen(esemeny) {
            // Új előzmény hozzáadása
            this.elozmenyek.unshift({
                datum: new Date().toLocaleDateString('hu-HU'),
                cim: esemeny.cim,
                uce: esemeny.uce || null,
                leiras: esemeny.leiras,
                statusz: esemeny.statusz || 'completed'
            });
        }
    }
};
