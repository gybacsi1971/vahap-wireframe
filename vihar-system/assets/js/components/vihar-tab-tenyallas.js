/**
 * VAHAP - F-0102 Tényállás tisztázása: Rugalmas workflow Tab
 * Rugalmas eljárási cselekmények kezelése
 * Használat: <vahap-tab-tenyallas :active="activeTab === 'tenyallas'" :ugy="ugy"></vahap-tab-tenyallas>
 */

const VahapTabTenyallas = {
    name: 'vahap-tab-tenyallas',
    props: {
        active: {
            type: Boolean,
            default: false
        },
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            eljarasiCselekmenyTipusok: [
                { id: 'megkerese', nev: 'Megkeresés', ikon: 'bi-envelope-paper', leiras: 'Más hatóság vagy szerv megkeresése' },
                { id: 'szakhatosag', nev: 'Szakhatósági állásfoglalás', ikon: 'bi-building', leiras: 'Szakhatósági vélemény kérése' },
                { id: 'ugyfel_nyilatkozat', nev: 'Ügyfél nyilatkozattétel', ikon: 'bi-person-check', leiras: 'Ügyfél nyilatkozatának bekérése' },
                { id: 'tanu', nev: 'Tanú meghallgatás', ikon: 'bi-mic', leiras: 'Tanúvallomás rögzítése' },
                { id: 'szemle', nev: 'Helyszíni szemle', ikon: 'bi-geo-alt', leiras: 'Helyszíni szemle lefolytatása' },
                { id: 'irat_bemutat', nev: 'Irat bemutatás', ikon: 'bi-file-earmark-text', leiras: 'Iratbeszerzés harmadik féltől' },
                { id: 'szakertoi', nev: 'Szakértői vélemény', ikon: 'bi-mortarboard', leiras: 'Szakértő kirendelése és véleményeztetése' },
                { id: 'targyalas', nev: 'Tárgyalás', ikon: 'bi-people', leiras: 'Tárgyalás összehívása' },
                { id: 'egyedi', nev: 'Egyedi eljárási cselekmény', ikon: 'bi-plus-circle', leiras: 'Egyéb eljárási cselekmény' }
            ],
            cselekmenyLista: [],
            ujCselekmenySablon: {
                tipus: null,
                leiras: '',
                hatarido: null,
                statusz: 'tervezet',
                megjegyzes: '',
                eredmeny: ''
            },
            ujCselek: {
                tipus: null,
                leiras: '',
                hatarido: null,
                statusz: 'tervezet',
                megjegyzes: '',
                eredmeny: ''
            },
            showNewForm: false
        };
    },
    computed: {
        osszesCselekmenySzam() {
            return this.cselekmenyLista.length;
        },
        befejezettSzam() {
            return this.cselekmenyLista.filter(c => c.statusz === 'befejezve').length;
        },
        folyamatbanSzam() {
            return this.cselekmenyLista.filter(c => c.statusz === 'folyamatban').length;
        },
        completionPercent() {
            if (this.osszesCselekmenySzam === 0) return 0;
            return Math.round((this.befejezettSzam / this.osszesCselekmenySzam) * 100);
        }
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <span class="badge badge-uce">UC-0306</span>
                    Tényállás tisztázása - Rugalmas workflow
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0102</span>
                    Eljárási cselekmények rugalmas hozzáadása és kezelése
                </p>
            </div>

            <!-- Státusz összegző -->
            <div class="card mb-3 border-info">
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-4">
                            <h4 class="mb-0">{{ osszesCselekmenySzam }}</h4>
                            <small class="text-muted">Összes</small>
                        </div>
                        <div class="col-4">
                            <h4 class="mb-0 text-warning">{{ folyamatbanSzam }}</h4>
                            <small class="text-muted">Folyamatban</small>
                        </div>
                        <div class="col-4">
                            <h4 class="mb-0 text-success">{{ befejezettSzam }}</h4>
                            <small class="text-muted">Befejezett</small>
                        </div>
                    </div>
                    <div class="progress mt-3" style="height: 8px;">
                        <div class="progress-bar bg-success"
                             :style="{ width: completionPercent + '%' }"></div>
                    </div>
                    <small class="text-muted">{{ completionPercent }}% teljesítve</small>
                </div>
            </div>

            <!-- Új cselekmény hozzáadása gomb -->
            <div class="d-grid mb-3">
                <button class="btn btn-primary" @click="showNewForm = !showNewForm">
                    <i class="bi" :class="showNewForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
                    {{ showNewForm ? 'Mégsem' : 'Új eljárási cselekmény hozzáadása' }}
                </button>
            </div>

            <!-- Új cselekmény űrlap -->
            <div v-if="showNewForm" class="card mb-3 border-primary">
                <div class="card-header bg-primary text-white">
                    <strong><i class="bi bi-plus-circle"></i> Új eljárási cselekmény</strong>
                </div>
                <div class="card-body">
                    <!-- Cselekmény típus választás -->
                    <div class="mb-3">
                        <label class="form-label">
                            Cselekmény típusa <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" v-model="ujCselek.tipus">
                            <option :value="null">-- Válasszon --</option>
                            <option v-for="tip in eljarasiCselekmenyTipusok"
                                    :key="tip.id"
                                    :value="tip.id">
                                {{ tip.nev }}
                            </option>
                        </select>
                        <small v-if="ujCselek.tipus" class="text-muted">
                            <i class="bi" :class="getTipusIkon(ujCselek.tipus)"></i>
                            {{ getTipusLeiras(ujCselek.tipus) }}
                        </small>
                    </div>

                    <!-- Leírás -->
                    <div class="mb-3">
                        <label class="form-label">
                            Részletes leírás <span class="text-danger">*</span>
                        </label>
                        <textarea class="form-control"
                                  rows="3"
                                  v-model="ujCselek.leiras"
                                  placeholder="Az eljárási cselekmény részletes leírása..."></textarea>
                    </div>

                    <!-- Határidő -->
                    <div class="mb-3">
                        <label class="form-label">
                            Határidő <span class="text-danger">*</span>
                        </label>
                        <input type="date"
                               class="form-control"
                               v-model="ujCselek.hatarido"
                               :min="new Date().toISOString().split('T')[0]">
                    </div>

                    <!-- Megjegyzés -->
                    <div class="mb-3">
                        <label class="form-label">Megjegyzés</label>
                        <textarea class="form-control"
                                  rows="2"
                                  v-model="ujCselek.megjegyzes"
                                  placeholder="Opcionális megjegyzés..."></textarea>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-success flex-grow-1"
                                @click="addCselek"
                                :disabled="!isUjCselekValid">
                            <i class="bi bi-check-lg"></i> Hozzáad
                        </button>
                        <button class="btn btn-outline-secondary"
                                @click="cancelNewCselek">
                            Mégsem
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cselekmények listája -->
            <div v-if="cselekmenyLista.length > 0">
                <h6 class="mb-3"><i class="bi bi-list-ul"></i> Eljárási cselekmények</h6>

                <div v-for="(cselek, index) in cselekmenyLista"
                     :key="index"
                     class="card mb-3"
                     :class="{
                         'border-success': cselek.statusz === 'befejezve',
                         'border-warning': cselek.statusz === 'folyamatban',
                         'border-secondary': cselek.statusz === 'tervezet'
                     }">
                    <div class="card-header"
                         :class="{
                             'bg-success text-white': cselek.statusz === 'befejezve',
                             'bg-warning': cselek.statusz === 'folyamatban',
                             'bg-light': cselek.statusz === 'tervezet'
                         }">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>
                                <i class="bi" :class="getTipusIkon(cselek.tipus)"></i>
                                {{ getTipusNev(cselek.tipus) }}
                            </strong>
                            <span class="badge"
                                  :class="{
                                      'bg-light text-dark': cselek.statusz === 'tervezet',
                                      'bg-white text-dark': cselek.statusz === 'folyamatban',
                                      'bg-white text-success': cselek.statusz === 'befejezve'
                                  }">
                                {{ getStatuszText(cselek.statusz) }}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><strong>Leírás:</strong> {{ cselek.leiras }}</p>
                        <p class="mb-2 small text-muted">
                            <i class="bi bi-calendar"></i> <strong>Határidő:</strong> {{ cselek.hatarido }}
                        </p>
                        <p v-if="cselek.megjegyzes" class="mb-2 small">
                            <i class="bi bi-chat-left-text"></i> {{ cselek.megjegyzes }}
                        </p>

                        <!-- Eredmény (csak ha folyamatban vagy befejezve) -->
                        <div v-if="cselek.statusz !== 'tervezet'" class="mt-2">
                            <label class="form-label small"><strong>Eredmény / Végzett tevékenység:</strong></label>
                            <textarea class="form-control form-control-sm"
                                      rows="2"
                                      v-model="cselek.eredmeny"
                                      :readonly="cselek.statusz === 'befejezve'"
                                      placeholder="Eredmény leírása..."></textarea>
                        </div>

                        <!-- Műveletek -->
                        <div class="d-flex gap-2 mt-3">
                            <button v-if="cselek.statusz === 'tervezet'"
                                    class="btn btn-sm btn-warning"
                                    @click="startCselek(index)">
                                <i class="bi bi-play"></i> Indítás
                            </button>
                            <button v-if="cselek.statusz === 'folyamatban'"
                                    class="btn btn-sm btn-success"
                                    @click="completeCselek(index)">
                                <i class="bi bi-check-lg"></i> Befejezés
                            </button>
                            <button v-if="cselek.statusz !== 'befejezve'"
                                    class="btn btn-sm btn-outline-danger"
                                    @click="deleteCselek(index)">
                                <i class="bi bi-trash"></i> Törlés
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Üres állapot -->
            <div v-else class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                Még nincs hozzáadva eljárási cselekmény. Használja a fenti gombot új cselekmény hozzáadásához.
            </div>
        </div>
    `,
    computed: {
        isUjCselekValid() {
            return this.ujCselek.tipus &&
                   this.ujCselek.leiras.trim().length > 5 &&
                   this.ujCselek.hatarido;
        }
    },
    methods: {
        getTipusNev(tipusId) {
            const tipus = this.eljarasiCselekmenyTipusok.find(t => t.id === tipusId);
            return tipus ? tipus.nev : 'Ismeretlen';
        },
        getTipusIkon(tipusId) {
            const tipus = this.eljarasiCselekmenyTipusok.find(t => t.id === tipusId);
            return tipus ? tipus.ikon : 'bi-question-circle';
        },
        getTipusLeiras(tipusId) {
            const tipus = this.eljarasiCselekmenyTipusok.find(t => t.id === tipusId);
            return tipus ? tipus.leiras : '';
        },
        getStatuszText(statusz) {
            const szovegek = {
                'tervezet': 'Tervezet',
                'folyamatban': 'Folyamatban',
                'befejezve': 'Befejezve'
            };
            return szovegek[statusz] || statusz;
        },
        addCselek() {
            console.log('[F-0102] Új eljárási cselekmény hozzáadása:', this.ujCselek);

            this.cselekmenyLista.push({
                ...this.ujCselek,
                hozzaadas_datum: new Date().toISOString().split('T')[0]
            });

            this.cancelNewCselek();
        },
        cancelNewCselek() {
            this.ujCselek = {
                tipus: null,
                leiras: '',
                hatarido: null,
                statusz: 'tervezet',
                megjegyzes: '',
                eredmeny: ''
            };
            this.showNewForm = false;
        },
        startCselek(index) {
            this.cselekmenyLista[index].statusz = 'folyamatban';
            this.cselekmenyLista[index].inditas_datum = new Date().toISOString().split('T')[0];
            console.log('[F-0102] Cselekmény elindítva:', this.cselekmenyLista[index]);
        },
        completeCselek(index) {
            if (!this.cselekmenyLista[index].eredmeny || this.cselekmenyLista[index].eredmeny.trim().length < 5) {
                alert('Kérem, adja meg az eredményt a befejezés előtt (minimum 5 karakter)!');
                return;
            }

            this.cselekmenyLista[index].statusz = 'befejezve';
            this.cselekmenyLista[index].befejezes_datum = new Date().toISOString().split('T')[0];
            console.log('[F-0102] Cselekmény befejezve:', this.cselekmenyLista[index]);
        },
        deleteCselek(index) {
            if (confirm('Biztosan törli ezt az eljárási cselekményt?')) {
                this.cselekmenyLista.splice(index, 1);
                console.log('[F-0102] Cselekmény törölve');
            }
        }
    },
    mounted() {
        console.log('[VAHAP] F-0102 - Tényállás tisztázása rugalmas workflow betöltve');
        console.log('[VAHAP] Ügy:', this.ugy.ugyazonosito);
    }
};
