/**
 * VAHAP Workflow Komponens - Hiánypótlás Varázsló
 * F-0100 - Hiánypótlási felszólítás összeállítása
 * F-0072 - Hiánypótlás
 * F-0088 - Döntés-előkészítés döntés
 * F-0101 - Hiánypótlás benyújtása
 * UCE-1870 - Hiánypótlás szükséges
 * UCE-1871 - Hiánypótlási felszólítás tartalmának összeállítása
 * UCE-1879 - Dokumentum elkészítése, kiadmányozása
 * UCE-1881 - Jóváhagyott hiánypótlási felszólítás?
 * UCE-1880 - Hiánypótlás ellenőrzése, értékelése
 * UCE-1867 - Hiánypótlás lezárható?
 */

const WfHianypotlasWizard = {
    name: 'wf-hianypotlas-wizard',

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

    data() {
        return {
            // Wizard lépés
            currentStep: 1,
            totalSteps: 6,

            // Lépés 1: Hiányosságok (mock adatok - formai/tartalmi ellenőrzésből)
            hianyossagok: [
                {
                    id: 'f1',
                    tipus: 'formai',
                    kategoria: 'Mellékletek',
                    title: 'Személyi igazolvány másolat hiányzik',
                    leiras: 'A kérelem mellékleteként nem került csatolásra a személyi igazolvány másolata.',
                    selected: true,
                    kotelezo: true
                },
                {
                    id: 'f2',
                    tipus: 'formai',
                    kategoria: 'Mellékletek',
                    title: 'Aláírás hiányzik',
                    leiras: 'A kérelem aláírás nélkül került benyújtásra.',
                    selected: true,
                    kotelezo: true
                },
                {
                    id: 't1',
                    tipus: 'tartalmi',
                    kategoria: 'Egészségügyi',
                    title: 'Orvosi igazolás érvényessége lejárt',
                    leiras: 'A benyújtott orvosi igazolás kiállítási dátuma 35 napos, a maximum megengedett 30 napot meghaladja.',
                    selected: true,
                    kotelezo: true
                },
                {
                    id: 't2',
                    tipus: 'tartalmi',
                    kategoria: 'Szakmai',
                    title: 'Munkáltatói igazolás pontatlan',
                    leiras: 'A munkáltatói igazoláson nem szerepel a munkakör pontos megnevezése.',
                    selected: false,
                    kotelezo: false
                }
            ],

            // Lépés 2: Felszólítás adatok (F-0100)
            felszolitas: {
                bevezeto: 'A vasúti járművezetők előzetes alkalmassági vizsgálata tárgyában benyújtott kérelmének vizsgálata során megállapítást nyert, hogy az alábbi hiányosságok pótlása szükséges az ügy érdemi elbírálásához.',
                hataridoNapok: 15,
                jogszabalyiHivatkozas: 'A közigazgatási hatósági eljárás és szolgáltatás általános szabályairól szóló 2004. évi CXL. törvény (Ket.) 62. § alapján',
                kovetkezmeny: 'Felhívjuk figyelmét, hogy amennyiben a hiánypótlást a megadott határidőn belül nem teljesíti, úgy a kérelme elutasításra kerül.',
                vegzesFormat: 'standard' // 'standard' vagy 'rovidített'
            },

            // Lépés 3: Jóváhagyás (UCE-1881)
            jovahagyva: null, // null | true | false
            donteshozo: {
                nev: 'Dr. Nagy Andrea',
                beosztas: 'Főosztályvezető',
                szervezet: 'Vasúti Hatósági Főosztály'
            },
            jovahagyasMegjegyzes: '',
            jovahagyasDatum: null,

            // Lépés 4: Ügyfél hiánypótlás (Mock szimuláció)
            mockHatarido: '2025.10.22',
            mockHataridoNapok: 5, // hány nap van még hátra
            mockKuldesiDatum: '2025.10.07',
            ugyfelFeltoltotte: false,
            feltoltottDokumentumok: [],
            mockDokumentumok: [
                { id: 'd1', nev: 'Személyi igazolvány másolat', tipus: 'PDF', meret: '234 KB', datum: '2025.10.20' },
                { id: 'd2', nev: 'Aláírt kérelem', tipus: 'PDF', meret: '456 KB', datum: '2025.10.20' },
                { id: 'd3', nev: 'Új orvosi igazolás', tipus: 'PDF', meret: '128 KB', datum: '2025.10.20' },
                { id: 'd4', nev: 'Javított munkáltatói igazolás', tipus: 'PDF', meret: '89 KB', datum: '2025.10.20' }
            ],
            erkeztetesSikeres: false,

            // Lépés 5: Hiánypótlás ellenőrzése (F-0072, F-0088)
            ellenorzesEredmeny: null, // null | 'elfogadva' | 'ujabb_hianypotlas' | 'elutasitas'
            ellenorzesLista: [
                { id: 'e1', title: 'Személyi igazolvány másolat megfelelő', checked: false, result: null, megjegyzes: '' },
                { id: 'e2', title: 'Aláírás érvényes', checked: false, result: null, megjegyzes: '' },
                { id: 'e3', title: 'Új orvosi igazolás érvényes', checked: false, result: null, megjegyzes: '' },
                { id: 'e4', title: 'Munkáltatói igazolás javítva', checked: false, result: null, megjegyzes: '' }
            ],
            ellenorzesIndoklas: '',

            // Összegzés
            reviewedBy: 'Dr. Szabó Péter',
            reviewDate: new Date().toISOString().split('T')[0],

            // Események timeline
            esemenyek: []
        };
    },

    computed: {
        // Progress százalék
        progressPercent() {
            return Math.round((this.currentStep / this.totalSteps) * 100);
        },

        // Lépés címe
        stepTitle() {
            const titles = {
                1: 'Hiányosságok áttekintése',
                2: 'Felszólítás összeállítása',
                3: 'Jóváhagyás / Kiadmányozás',
                4: 'Ügyfél hiánypótlása (Mock)',
                5: 'Hiánypótlás ellenőrzése',
                6: 'Összegzés és lezárás'
            };
            return titles[this.currentStep] || '';
        },

        // Kiválasztott hiányosságok
        kivalasztottHianyossagok() {
            return this.hianyossagok.filter(h => h.selected);
        },

        // Lépés validáció
        canProceed() {
            if (this.currentStep === 1) {
                return this.kivalasztottHianyossagok.length > 0;
            }
            if (this.currentStep === 2) {
                return this.felszolitas.bevezeto.length >= 30 &&
                       this.felszolitas.hataridoNapok > 0;
            }
            if (this.currentStep === 3) {
                return this.jovahagyva !== null;
            }
            if (this.currentStep === 4) {
                return this.ugyfelFeltoltotte && this.erkeztetesSikeres;
            }
            if (this.currentStep === 5) {
                return this.ellenorzesEredmeny !== null &&
                       this.ellenorzesIndoklas.length >= 30;
            }
            return true;
        },

        // Hiányosságok statisztika
        hianyStatisztika() {
            return {
                osszes: this.hianyossagok.length,
                kivalasztott: this.kivalasztottHianyossagok.length,
                formai: this.hianyossagok.filter(h => h.tipus === 'formai').length,
                tartalmi: this.hianyossagok.filter(h => h.tipus === 'tartalmi').length
            };
        },

        // Határidő dátum számítás
        hataridoDatum() {
            const ma = new Date();
            ma.setDate(ma.getDate() + this.felszolitas.hataridoNapok);
            return ma.toISOString().split('T')[0];
        },

        // Határidő státusz (mock)
        hataridoStatusz() {
            if (this.mockHataridoNapok > 5) return 'success';
            if (this.mockHataridoNapok > 2) return 'warning';
            return 'danger';
        },

        // Ellenőrzés statisztika
        ellenorzesStatisztika() {
            const osszes = this.ellenorzesLista.length;
            const ellenorzott = this.ellenorzesLista.filter(e => e.checked).length;
            const megfelelt = this.ellenorzesLista.filter(e => e.result === 'pass').length;
            const nemFeleltMeg = this.ellenorzesLista.filter(e => e.result === 'fail').length;

            return { osszes, ellenorzott, megfelelt, nemFeleltMeg };
        },

        // Összes ellenőrzés megfelelt?
        mindenMegfelelt() {
            return this.ellenorzesLista.every(e => e.result === 'pass');
        }
    },

    methods: {
        // Következő lépés
        nextStep() {
            if (!this.canProceed) {
                alert('Kérem töltse ki az összes kötelező mezőt!');
                return;
            }

            // Speciális ellenőrzések
            if (this.currentStep === 3 && this.jovahagyva === false) {
                alert('A felszólítás visszautasításra került. Kérem módosítsa a tartalmat!');
                return;
            }

            if (this.currentStep < this.totalSteps) {
                this.currentStep++;

                // Automatikus művelet lépésváltáskor
                if (this.currentStep === 4) {
                    this.addEsemeny('Hiánypótlási felszólítás kiadmányozva', 'success');
                }

                this.$nextTick(() => {
                    const content = document.querySelector('.wizard-content');
                    if (content) content.scrollTop = 0;
                });
            }
        },

        // Előző lépés
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.$nextTick(() => {
                    const content = document.querySelector('.wizard-content');
                    if (content) content.scrollTop = 0;
                });
            }
        },

        // Lépés ugrás
        goToStep(step) {
            if (step <= this.currentStep) {
                this.currentStep = step;
            } else if (step === this.currentStep + 1 && this.canProceed) {
                this.currentStep = step;
            }
            this.$nextTick(() => {
                const content = document.querySelector('.wizard-content');
                if (content) content.scrollTop = 0;
            });
        },

        // Hiányosság kiválasztás toggle
        toggleHianyossag(item) {
            item.selected = !item.selected;
        },

        // Automatikus felszólítás generálás
        generateFelszolitas() {
            const hianyok = this.kivalasztottHianyossagok.map(h => `- ${h.title}`).join('\n');

            this.felszolitas.bevezeto = `A vasúti járművezetők előzetes alkalmassági vizsgálata tárgyában benyújtott kérelmének vizsgálata során az alábbi hiányosságok kerültek megállapításra:\n\n${hianyok}\n\nFelhívjuk, hogy a fenti hiányosságokat ${this.felszolitas.hataridoNapok} napon belül pótolja.`;

            alert('Felszólítás szövege automatikusan generálva!');
        },

        // Jóváhagyás
        approve() {
            this.jovahagyva = true;
            this.jovahagyasDatum = new Date().toISOString().split('T')[0];
            this.addEsemeny(`Felszólítás jóváhagyva - ${this.donteshozo.nev}`, 'success');
            alert(`Felszólítás jóváhagyva!\nDöntéshozó: ${this.donteshozo.nev}`);
        },

        // Elutasítás
        reject() {
            if (!this.jovahagyasMegjegyzes || this.jovahagyasMegjegyzes.length < 10) {
                alert('Kérem adja meg az elutasítás indokát! (Minimum 10 karakter)');
                return;
            }
            this.jovahagyva = false;
            this.jovahagyasDatum = new Date().toISOString().split('T')[0];
            this.addEsemeny(`Felszólítás elutasítva - ${this.donteshozo.nev}`, 'danger');
            alert('Felszólítás elutasítva! Kérem módosítsa a tartalmat.');
        },

        // Mock: Ügyfél feltölti a hiánypótlást
        mockUgyfelFeltolt() {
            if (this.ugyfelFeltoltotte) {
                alert('A hiánypótlás már feltöltésre került!');
                return;
            }

            // Mock dokumentumok hozzáadása
            this.feltoltottDokumentumok = [...this.mockDokumentumok];
            this.ugyfelFeltoltotte = true;

            this.addEsemeny('Ügyfél feltöltötte a hiánypótlást (MOCK)', 'info');

            // Automatikus érkeztetés szimulálása 1 másodperc múlva
            setTimeout(() => {
                this.mockErkeztetes();
            }, 1000);
        },

        // Mock: Érkeztetés
        mockErkeztetes() {
            this.erkeztetesSikeres = true;
            this.addEsemeny('Hiánypótlás érkeztetése sikeres (MOCK)', 'success');
            alert('Hiánypótlás sikeresen érkeztetésre került!\nÜgyazonosító: VAHAP-V-2024-001234/HP1');
        },

        // Ellenőrzés elem checkbox
        checkEllenorzes(item) {
            item.checked = !item.checked;
            if (!item.checked) {
                item.result = null;
            }
        },

        // Ellenőrzés eredmény beállítása
        setEllenorzesResult(item, result) {
            item.result = result;
            if (!item.checked) {
                item.checked = true;
            }
        },

        // Döntés: Hiánypótlás elfogadása
        elfogadHianypotlas() {
            this.ellenorzesEredmeny = 'elfogadva';
            this.ellenorzesIndoklas = 'A hiánypótlás keretében benyújtott dokumentumok megfelelőek, az összes megállapított hiányosság pótlásra került. A kérelem érdemi elbírálása folytatható.';
        },

        // Döntés: Újabb hiánypótlás
        ujabbHianypotlas() {
            this.ellenorzesEredmeny = 'ujabb_hianypotlas';
            const hianyok = this.ellenorzesLista
                .filter(e => e.result === 'fail')
                .map(e => e.title)
                .join(', ');
            this.ellenorzesIndoklas = `A hiánypótlás nem teljes körű. A következő elemek továbbra is hiányosak: ${hianyok}. Újabb hiánypótlási felszólítás szükséges.`;
        },

        // Döntés: Elutasítás
        elutasitKerelem() {
            this.ellenorzesEredmeny = 'elutasitas';
            this.ellenorzesIndoklas = 'A kérelmező a megadott határidőn belül nem pótolta a hiányosságokat, vagy a hiánypótlás nem megfelelő. A kérelem elutasításra kerül.';
        },

        // Esemény hozzáadása
        addEsemeny(title, status = 'info') {
            this.esemenyek.push({
                title,
                timestamp: new Date().toLocaleString('hu-HU'),
                status,
                user: this.reviewedBy
            });
        },

        // Befejezés
        complete() {
            const result = {
                type: 'hianypotlas',
                kod: 'F-0100, F-0072, F-0088',
                uce: 'UCE-1870, UCE-1871, UCE-1880, UCE-1867',
                hianyossagok: this.kivalasztottHianyossagok,
                felszolitas: this.felszolitas,
                jovahagyva: this.jovahagyva,
                jovahagyasDatum: this.jovahagyasDatum,
                donteshozo: this.donteshozo,
                ellenorzesEredmeny: this.ellenorzesEredmeny,
                ellenorzesIndoklas: this.ellenorzesIndoklas,
                ellenorzesStatisztika: this.ellenorzesStatisztika,
                feltoltottDokumentumok: this.feltoltottDokumentumok,
                esemenyek: this.esemenyek,
                reviewedBy: this.reviewedBy,
                reviewDate: this.reviewDate,
                completedAt: new Date().toISOString()
            };

            console.log('Hiánypótlás workflow befejezve:', result);
            this.$emit('complete', result);
        }
    },

    mounted() {
        // Kezdő események
        this.addEsemeny('Hiánypótlás workflow elindítva', 'info');
    },

    template: `
        <div class="wizard-container">
            <!-- Wizard fejléc -->
            <div class="wizard-header">
                <!-- Step indicators -->
                <div class="wizard-steps">
                    <div v-for="n in totalSteps" :key="n"
                         class="wizard-step-indicator"
                         :class="{
                             'active': n === currentStep,
                             'completed': n < currentStep,
                             'disabled': n > currentStep && !canProceed
                         }"
                         @click="goToStep(n)"
                         :style="{ cursor: n <= currentStep || (n === currentStep + 1 && canProceed) ? 'pointer' : 'not-allowed' }">
                        <div class="wizard-step-circle">
                            <i v-if="n < currentStep" class="bi bi-check"></i>
                            <span v-else>{{ n }}</span>
                        </div>
                        <div class="wizard-step-label">
                            {{ n === 1 ? 'Hiányosságok' :
                               n === 2 ? 'Felszólítás' :
                               n === 3 ? 'Jóváhagyás' :
                               n === 4 ? 'Ügyfél (Mock)' :
                               n === 5 ? 'Ellenőrzés' :
                               'Összegzés' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard tartalom -->
            <div class="wizard-content">
                <!-- Lépés 1: Hiányosságok áttekintése -->
                <div v-if="currentStep === 1" class="wizard-step-content">
                    <div class="alert alert-warning mb-4">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>UCE-1870:</strong> A formai/tartalmi ellenőrzés során hiányosságok kerültek megállapításra.
                        Válassza ki, hogy mely hiányosságokat szeretné a felszólításba foglalni.
                    </div>

                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-primary mb-0">{{ hianyStatisztika.osszes }}</h3>
                                    <small class="text-muted">Összes hiányosság</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-success mb-0">{{ hianyStatisztika.kivalasztott }}</h3>
                                    <small class="text-muted">Kiválasztva</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-info mb-0">{{ hianyStatisztika.formai }}</h3>
                                    <small class="text-muted">Formai</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-warning mb-0">{{ hianyStatisztika.tartalmi }}</h3>
                                    <small class="text-muted">Tartalmi</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-for="hiany in hianyossagok" :key="hiany.id" class="checklist-item-wizard mb-3">
                        <div class="d-flex align-items-start">
                            <input type="checkbox"
                                   class="form-check-input me-3 mt-1"
                                   :checked="hiany.selected"
                                   @change="toggleHianyossag(hiany)"
                                   style="width: 24px; height: 24px;">

                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="mb-0">
                                        {{ hiany.title }}
                                        <span class="badge ms-2" :class="{
                                            'bg-info': hiany.tipus === 'formai',
                                            'bg-warning': hiany.tipus === 'tartalmi'
                                        }">
                                            {{ hiany.tipus }}
                                        </span>
                                        <span v-if="hiany.kotelezo" class="badge bg-danger ms-1">Kötelező</span>
                                    </h6>
                                </div>
                                <p class="text-muted mb-1"><strong>Kategória:</strong> {{ hiany.kategoria }}</p>
                                <p class="text-muted small mb-0">{{ hiany.leiras }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lépés 2: Felszólítás összeállítása (F-0100) -->
                <div v-if="currentStep === 2" class="wizard-step-content">
                    <div class="alert alert-info mb-4">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>F-0100:</strong> Hiánypótlási felszólítás összeállítása.
                        A kiválasztott hiányosságok alapján készítse el a végzést.
                    </div>

                    <div class="mb-4">
                        <h6>Kiválasztott hiányosságok ({{ kivalasztottHianyossagok.length }}):</h6>
                        <ul class="list-group">
                            <li v-for="hiany in kivalasztottHianyossagok" :key="hiany.id" class="list-group-item">
                                <i class="bi bi-check-circle text-success me-2"></i>
                                {{ hiany.title }}
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            <i class="bi bi-file-text"></i> Felszólítás bevezető szövege
                        </label>
                        <textarea class="form-control" rows="6" v-model="felszolitas.bevezeto"
                                  placeholder="Adja meg a felszólítás bevezetőjét..."></textarea>
                        <div class="d-flex justify-content-between mt-2">
                            <button class="btn btn-sm btn-outline-primary" @click="generateFelszolitas">
                                <i class="bi bi-magic"></i> Automatikus generálás
                            </button>
                            <small :class="felszolitas.bevezeto.length >= 30 ? 'text-success' : 'text-danger'">
                                {{ felszolitas.bevezeto.length }}/30 karakter
                            </small>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">
                                <i class="bi bi-calendar-event"></i> Határidő (napokban)
                            </label>
                            <input type="number" class="form-control" v-model.number="felszolitas.hataridoNapok" min="5" max="30">
                            <small class="text-muted">Számított dátum: {{ hataridoDatum }}</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Végzés formátuma</label>
                            <select class="form-select" v-model="felszolitas.vegzesFormat">
                                <option value="standard">Standard végzés</option>
                                <option value="rovidített">Rövidített végzés</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Jogszabályi hivatkozás</label>
                        <input type="text" class="form-control" v-model="felszolitas.jogszabalyiHivatkozas">
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Következmények</label>
                        <textarea class="form-control" rows="3" v-model="felszolitas.kovetkezmeny"></textarea>
                    </div>
                </div>

                <!-- Lépés 3: Jóváhagyás / Kiadmányozás (UCE-1881) -->
                <div v-if="currentStep === 3" class="wizard-step-content">
                    <div class="alert alert-primary mb-4">
                        <i class="bi bi-shield-check me-2"></i>
                        <strong>UCE-1879, UCE-1881:</strong> Dokumentum kiadmányozása és döntéshozói jóváhagyás.
                    </div>

                    <!-- Végzés előnézete -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-file-earmark-text"></i> Hiánypótlási felszólítás - Előnézet
                            </h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <strong>Ügyazonosító:</strong> {{ ugy.ugyazonosito }}
                            </div>
                            <div class="mb-3">
                                <strong>Tárgy:</strong> Hiánypótlási felszólítás - {{ ugy.megnevezes }}
                            </div>
                            <div class="mb-3">
                                <strong>Bevezető:</strong>
                                <p class="text-muted" style="white-space: pre-wrap;">{{ felszolitas.bevezeto }}</p>
                            </div>
                            <div class="mb-3">
                                <strong>Határidő:</strong> {{ felszolitas.hataridoNapok }} nap ({{ hataridoDatum }})
                            </div>
                            <div class="mb-3">
                                <strong>Kiválasztott hiányosságok:</strong>
                                <ul>
                                    <li v-for="hiany in kivalasztottHianyossagok" :key="hiany.id">
                                        {{ hiany.title }}
                                    </li>
                                </ul>
                            </div>
                            <div class="mb-3">
                                <strong>Jogszabály:</strong> {{ felszolitas.jogszabalyiHivatkozas }}
                            </div>
                            <div>
                                <strong>Következmények:</strong>
                                <p class="text-muted">{{ felszolitas.kovetkezmeny }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Döntéshozó adatok -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6><i class="bi bi-person-badge"></i> Döntéshozó</h6>
                            <p class="mb-1"><strong>{{ donteshozo.nev }}</strong></p>
                            <p class="mb-0 text-muted small">{{ donteshozo.beosztas }} - {{ donteshozo.szervezet }}</p>
                        </div>
                    </div>

                    <!-- Döntési gombok -->
                    <div v-if="jovahagyva === null" class="row mb-4">
                        <div class="col-md-6">
                            <div class="wizard-card" @click="approve">
                                <div class="text-center">
                                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Jóváhagyom</h6>
                                    <p class="text-muted small">Felszólítás kiküldésre kerül</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="wizard-card" @click="jovahagyasMegjegyzes.length >= 10 ? reject() : alert('Kérem adja meg az elutasítás indokát!')">
                                <div class="text-center">
                                    <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Visszaküldöm javításra</h6>
                                    <p class="text-muted small">Módosítás szükséges</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Megjegyzés mező -->
                    <div class="mb-3">
                        <label class="form-label fw-bold">Döntéshozói megjegyzés</label>
                        <textarea class="form-control" rows="3" v-model="jovahagyasMegjegyzes"
                                  placeholder="Megjegyzés, indoklás..."></textarea>
                    </div>

                    <!-- Döntés eredménye -->
                    <div v-if="jovahagyva !== null" class="alert" :class="{
                        'alert-success': jovahagyva,
                        'alert-danger': !jovahagyva
                    }">
                        <h6 class="alert-heading">
                            <i class="bi" :class="jovahagyva ? 'bi-check-circle' : 'bi-x-circle'"></i>
                            {{ jovahagyva ? 'Felszólítás jóváhagyva' : 'Felszólítás visszautasítva' }}
                        </h6>
                        <p class="mb-1"><strong>Döntéshozó:</strong> {{ donteshozo.nev }}</p>
                        <p class="mb-1"><strong>Dátum:</strong> {{ jovahagyasDatum }}</p>
                        <p v-if="jovahagyasMegjegyzes" class="mb-0">
                            <strong>Megjegyzés:</strong> {{ jovahagyasMegjegyzes }}
                        </p>
                    </div>
                </div>

                <!-- Lépés 4: Ügyfél hiánypótlása (Mock) -->
                <div v-if="currentStep === 4" class="wizard-step-content">
                    <div class="alert alert-info mb-4">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Mock szimuláció:</strong> Ügyfél általi hiánypótlás és érkeztetés.
                        Ez a lépés a valóságban az ügyfél oldalon történne.
                    </div>

                    <!-- Határidő info -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h6><i class="bi bi-calendar-event"></i> Hiánypótlási határidő</h6>
                                    <p class="mb-1"><strong>Kiküldés:</strong> {{ mockKuldesiDatum }}</p>
                                    <p class="mb-1"><strong>Határidő:</strong> {{ mockHatarido }}</p>
                                    <p class="mb-0"><strong>Hátralévő idő:</strong>
                                        <span class="badge" :class="{
                                            'bg-success': hataridoStatusz === 'success',
                                            'bg-warning': hataridoStatusz === 'warning',
                                            'bg-danger': hataridoStatusz === 'danger'
                                        }">{{ mockHataridoNapok }} nap</span>
                                    </p>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="display-4" :class="'text-' + hataridoStatusz">
                                        {{ mockHataridoNapok }}
                                    </div>
                                    <small class="text-muted">nap van hátra</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mock feltöltés gomb -->
                    <div v-if="!ugyfelFeltoltotte" class="text-center mb-4">
                        <button class="btn btn-lg btn-primary" @click="mockUgyfelFeltolt">
                            <i class="bi bi-cloud-upload"></i> Mock: Ügyfél feltölti a hiánypótlást
                        </button>
                        <p class="text-muted mt-2 small">Kattintson a gombra az ügyfél hiánypótlásának szimulálásához</p>
                    </div>

                    <!-- Feltöltött dokumentumok -->
                    <div v-if="ugyfelFeltoltotte" class="mb-4">
                        <h6><i class="bi bi-file-earmark-check"></i> Feltöltött dokumentumok</h6>
                        <div class="list-group">
                            <div v-for="doc in feltoltottDokumentumok" :key="doc.id" class="list-group-item">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-file-pdf text-danger me-3" style="font-size: 2rem;"></i>
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1">{{ doc.nev }}</h6>
                                        <small class="text-muted">{{ doc.tipus }} - {{ doc.meret }} - {{ doc.datum }}</small>
                                    </div>
                                    <span class="badge bg-success">Feltöltve</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Érkeztetés státusz -->
                    <div v-if="erkeztetesSikeres" class="alert alert-success">
                        <h6 class="alert-heading">
                            <i class="bi bi-check-circle"></i> Érkeztetés sikeres (F-0101)
                        </h6>
                        <p class="mb-0">
                            Ügyazonosító: <strong>{{ ugy.ugyazonosito }}/HP1</strong><br>
                            Érkeztetés dátuma: <strong>{{ new Date().toLocaleString('hu-HU') }}</strong>
                        </p>
                    </div>
                </div>

                <!-- Lépés 5: Hiánypótlás ellenőrzése (F-0072, F-0088) -->
                <div v-if="currentStep === 5" class="wizard-step-content">
                    <div class="alert alert-warning mb-4">
                        <i class="bi bi-search me-2"></i>
                        <strong>F-0072, F-0088:</strong> Hiánypótlás ellenőrzése és döntés-előkészítés.
                    </div>

                    <!-- Statisztika -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-primary mb-0">{{ ellenorzesStatisztika.osszes }}</h3>
                                    <small class="text-muted">Összes elem</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-info mb-0">{{ ellenorzesStatisztika.ellenorzott }}</h3>
                                    <small class="text-muted">Ellenőrzött</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-success mb-0">{{ ellenorzesStatisztika.megfelelt }}</h3>
                                    <small class="text-muted">Megfelelt</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="text-danger mb-0">{{ ellenorzesStatisztika.nemFeleltMeg }}</h3>
                                    <small class="text-muted">Nem felelt meg</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ellenőrzési lista -->
                    <div v-for="item in ellenorzesLista" :key="item.id" class="checklist-item-wizard mb-3">
                        <div class="d-flex align-items-start">
                            <input type="checkbox"
                                   class="form-check-input me-3 mt-1"
                                   :checked="item.checked"
                                   @change="checkEllenorzes(item)"
                                   style="width: 24px; height: 24px;">

                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="mb-0">
                                        {{ item.title }}
                                        <span v-if="item.result" class="badge ms-2"
                                              :class="{
                                                  'bg-success': item.result === 'pass',
                                                  'bg-danger': item.result === 'fail'
                                              }">
                                            {{ item.result === 'pass' ? 'Megfelelt' : 'Nem felelt meg' }}
                                        </span>
                                    </h6>
                                </div>

                                <div v-if="item.checked" class="mt-3">
                                    <div class="btn-group mb-3" role="group">
                                        <button type="button"
                                                class="btn"
                                                :class="item.result === 'pass' ? 'btn-success' : 'btn-outline-success'"
                                                @click="setEllenorzesResult(item, 'pass')">
                                            <i class="bi bi-check-circle"></i> Megfelelt
                                        </button>
                                        <button type="button"
                                                class="btn"
                                                :class="item.result === 'fail' ? 'btn-danger' : 'btn-outline-danger'"
                                                @click="setEllenorzesResult(item, 'fail')">
                                            <i class="bi bi-x-circle"></i> Nem felelt meg
                                        </button>
                                    </div>

                                    <div class="mt-2">
                                        <label class="form-label small fw-bold">Megjegyzés</label>
                                        <textarea class="form-control form-control-sm"
                                                  rows="2"
                                                  v-model="item.megjegyzes"
                                                  placeholder="Megjegyzés..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Döntési gombok (UCE-1867) -->
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': ellenorzesEredmeny === 'elfogadva', 'disabled': !mindenMegfelelt }"
                                 @click="mindenMegfelelt && elfogadHianypotlas()">
                                <div class="text-center">
                                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Hiánypótlás elfogadva</h6>
                                    <p class="text-muted small">Folyamat lezárható</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': ellenorzesEredmeny === 'ujabb_hianypotlas' }"
                                 @click="ujabbHianypotlas()">
                                <div class="text-center">
                                    <i class="bi bi-arrow-repeat text-warning" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Újabb hiánypótlás</h6>
                                    <p class="text-muted small">Hiányosságok fennállnak</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="wizard-card"
                                 :class="{ 'selected': ellenorzesEredmeny === 'elutasitas' }"
                                 @click="elutasitKerelem()">
                                <div class="text-center">
                                    <i class="bi bi-x-circle text-danger" style="font-size: 3rem;"></i>
                                    <h6 class="mt-3">Elutasítás</h6>
                                    <p class="text-muted small">Hiánypótlás sikertelen</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Indoklás -->
                    <div v-if="ellenorzesEredmeny" class="mt-4">
                        <label class="form-label fw-bold">
                            <i class="bi bi-journal-text"></i> Döntés indoklása
                        </label>
                        <textarea class="form-control"
                                  rows="6"
                                  v-model="ellenorzesIndoklas"
                                  placeholder="Írja le részletesen a döntés indokait..."></textarea>
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted">Minimum 30 karakter szükséges</small>
                            <small :class="ellenorzesIndoklas.length >= 30 ? 'text-success' : 'text-danger'">
                                {{ ellenorzesIndoklas.length }}/30 karakter
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Lépés 6: Összegzés -->
                <div v-if="currentStep === 6" class="wizard-step-content">
                    <p class="text-muted mb-4">
                        Ellenőrizze a hiánypótlási folyamat eredményét mielőtt véglegesíti.
                    </p>

                    <div class="wizard-summary">
                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-clipboard-check me-2"></i> Hiánypótlás eredménye</h6>
                            <div class="wizard-summary-value">
                                <span class="badge"
                                      :class="{
                                          'bg-success': ellenorzesEredmeny === 'elfogadva',
                                          'bg-warning': ellenorzesEredmeny === 'ujabb_hianypotlas',
                                          'bg-danger': ellenorzesEredmeny === 'elutasitas'
                                      }"
                                      style="font-size: 1rem; padding: 0.5rem 1rem;">
                                    {{ ellenorzesEredmeny === 'elfogadva' ? 'HIÁNYPÓTLÁS ELFOGADVA' :
                                       ellenorzesEredmeny === 'ujabb_hianypotlas' ? 'ÚJABB HIÁNYPÓTLÁS SZÜKSÉGES' :
                                       'KÉRELEM ELUTASÍTVA' }}
                                </span>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-list-check me-2"></i> Megállapított hiányosságok</h6>
                            <div class="list-group">
                                <div v-for="hiany in kivalasztottHianyossagok" :key="hiany.id" class="list-group-item">
                                    <div class="fw-bold">{{ hiany.title }}</div>
                                    <small class="text-muted">{{ hiany.kategoria }} - {{ hiany.tipus }}</small>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-file-earmark-text me-2"></i> Felszólítás adatok</h6>
                            <p class="mb-1"><strong>Határidő:</strong> {{ felszolitas.hataridoNapok }} nap ({{ hataridoDatum }})</p>
                            <p class="mb-1"><strong>Jóváhagyva:</strong>
                                <span class="badge" :class="jovahagyva ? 'bg-success' : 'bg-danger'">
                                    {{ jovahagyva ? 'Igen' : 'Nem' }}
                                </span>
                            </p>
                            <p class="mb-0"><strong>Döntéshozó:</strong> {{ donteshozo.nev }}</p>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-cloud-upload me-2"></i> Feltöltött dokumentumok</h6>
                            <p class="mb-0">{{ feltoltottDokumentumok.length }} dokumentum</p>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-bar-chart me-2"></i> Ellenőrzés statisztika</h6>
                            <div class="row">
                                <div class="col-6">
                                    <small class="text-muted">Ellenőrzött elemek:</small>
                                    <div class="fw-bold">{{ ellenorzesStatisztika.ellenorzott }} / {{ ellenorzesStatisztika.osszes }}</div>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Megfelelt / Nem felelt meg:</small>
                                    <div class="fw-bold">
                                        <span class="text-success">{{ ellenorzesStatisztika.megfelelt }}</span> /
                                        <span class="text-danger">{{ ellenorzesStatisztika.nemFeleltMeg }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-journal-text me-2"></i> Döntés indoklása</h6>
                            <div class="wizard-summary-value text-muted" style="white-space: pre-wrap;">
                                {{ ellenorzesIndoklas }}
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-clock-history me-2"></i> Események ({{ esemenyek.length }})</h6>
                            <div class="list-group">
                                <div v-for="(esemeny, index) in esemenyek" :key="index" class="list-group-item">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <i class="bi bi-circle-fill me-2" :class="{
                                                'text-success': esemeny.status === 'success',
                                                'text-info': esemeny.status === 'info',
                                                'text-danger': esemeny.status === 'danger'
                                            }"></i>
                                            {{ esemeny.title }}
                                        </div>
                                        <small class="text-muted">{{ esemeny.timestamp }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-summary-section">
                            <h6><i class="bi bi-person-badge me-2"></i> Ügyintéző</h6>
                            <div class="wizard-summary-value">
                                {{ reviewedBy }}
                                <small class="text-muted ms-2">{{ reviewDate }}</small>
                            </div>
                        </div>

                        <div class="alert alert-warning mt-4">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Figyelem!</strong> A hiánypótlási folyamat befejezése után a döntés visszavonhatatlan.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wizard footer -->
            <div class="wizard-footer">
                <div class="d-flex justify-content-between">
                    <button class="btn btn-secondary"
                            @click="prevStep"
                            :disabled="currentStep === 1">
                        <i class="bi bi-arrow-left"></i> Előző
                    </button>

                    <button v-if="currentStep < totalSteps"
                            class="btn btn-primary"
                            @click="nextStep"
                            :disabled="!canProceed">
                        Következő <i class="bi bi-arrow-right"></i>
                    </button>

                    <button v-if="currentStep === totalSteps"
                            class="btn btn-success btn-lg"
                            @click="complete">
                        <i class="bi bi-check-circle"></i> Hiánypótlás befejezése
                    </button>
                </div>
            </div>
        </div>
    `
};
