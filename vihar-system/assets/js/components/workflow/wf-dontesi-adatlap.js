/**
 * VAHAP Workflow Komponens - Döntési Adatlap
 *
 * Eljárási szakasz: Döntéshozatal
 * Feladatok:
 *   - Tervezet elkészítés
 *   - Tervezet véleményeztetés
 *   - Vezetői döntés
 *   - Követő feladatok
 *   - Nyilvántartás
 *
 * Funkciók: Döntési adatlap, Rugalmas WF, Nyilvántartás, Expediálás
 */

const WfDontesiAdatlap = {
    name: 'wf-dontesi-adatlap',

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
            // Wizard lépések
            currentWizardStep: 1,
            wizardSteps: [
                { id: 1, label: 'Döntési javaslat', icon: 'bi-file-text', completed: false },
                { id: 2, label: 'Jogi forma', icon: 'bi-balance-scale', completed: false },
                { id: 3, label: 'Dokumentumok', icon: 'bi-file-earmark-pdf', completed: false },
                { id: 4, label: 'Követő feladatok', icon: 'bi-arrow-repeat', completed: false },
                { id: 5, label: 'Nyilvántartás', icon: 'bi-database', completed: false },
                { id: 6, label: 'Díjfizetés', icon: 'bi-cash-stack', completed: false },
                { id: 7, label: 'Véleményeztetés', icon: 'bi-chat-dots', completed: false },
                { id: 8, label: 'Összegzés', icon: 'bi-check-circle', completed: false }
            ],

            // 1. Döntési javaslat
            dontesiJavaslat: {
                targy: '',
                indokolas: '',
                tovabbi_feladatok: ''
            },

            // 2. Jogi forma választás
            jogiForma: null, // 'vegzes' vagy 'hatrozat'
            jogiFormaOptions: [
                {
                    id: 'vegzes',
                    label: 'Végzés',
                    description: 'Eljárási kérdéseket eldöntő hatósági aktus',
                    icon: 'bi-file-earmark-text',
                    funkciok: ['F-0091']
                },
                {
                    id: 'hatrozat',
                    label: 'Határozat',
                    description: 'Érdemi döntést tartalmazó hatósági aktus',
                    icon: 'bi-file-earmark-check',
                    funkciok: ['F-0092']
                }
            ],

            // 3. Dokumentumok
            dokumentumok: {
                vegzes_tervezet: { selected: false, generalt: false, funkciokod: 'F-0091', fajlnev: '' },
                hatrozat_tervezet: { selected: false, generalt: false, funkciokod: 'F-0092', fajlnev: '' },
                igazolas_tervezet: { selected: false, generalt: false, funkciokod: 'F-0093', fajlnev: '' },
                tajekoztatas_tervezet: { selected: false, generalt: false, funkciokod: 'F-0094', fajlnev: '' },
                okmany_adatok: { selected: false, generalt: false, megjegyzes: '', fajlnev: '' },
                hirdetmeny_tervezet: { selected: false, generalt: false, funkciokod: 'F-0095', fajlnev: '' }
            },

            // 4. Követő feladatok (Rugalmas WF)
            kovetoFeladatok: [
                // Példa: { id: 1, megnevezes: 'Okmány készítés', felelős: 'Kovács János', hatarido: '2025-11-15' }
            ],
            ujFeladat: {
                megnevezes: '',
                felelos: '',
                hatarido: ''
            },
            showFeladatForm: false,

            // 5. Nyilvántartás
            nyilvantartasFreissitese: false, // true ha szükséges
            nyilvantartasok: [
                // Példa: { kod: 'VNY024', nev: 'Vasútegészségügyi Nyilvántartás' }
            ],
            elerheto_nyilvantartasok: [
                { kod: 'VNY024', nev: 'Vasútegészségügyi Nyilvántartás', modul: 'Vasút' },
                { kod: 'HNY501', nev: 'Hajózási Létesítmények Nyilvántartása', modul: 'Hajózás' }
            ],
            kivalasztott_nyilvantartas: null,

            // 6. Eljárási díjfizetés ellenőrzése
            dijFizetve: false,
            dijMegfizetesDatum: '',
            dijOsszeg: 0,
            dijTetelek: [],

            // 7. Véleményeztetés
            velemenyeztetes: {
                szukseges: false,
                velemenyezok: [] // { nev: '', email: '', szervezet: '', statusz: 'varakozik' }
            },
            ujVelemenyezo: {
                nev: '',
                email: '',
                szervezet: ''
            },
            showVelemenyezoForm: false,

            // 8. Véleményezők javaslata alapján módosítás
            modositasSzukseges: null, // null, 'elfogad', 'elutasit'
            modositasIndoklas: '',

            // EKEIDR interfész adatok (input)
            ekeidrIktatoszam: '',

            // Validáció hibák
            errors: {}
        };
    },

    computed: {
        // Aktuális lépés címe
        currentStepTitle() {
            const step = this.wizardSteps.find(s => s.id === this.currentWizardStep);
            return step ? step.label : '';
        },

        // Aktuális lépés ikonja
        currentStepIcon() {
            const step = this.wizardSteps.find(s => s.id === this.currentWizardStep);
            return step ? step.icon : '';
        },

        // Tovább gomb engedélyezése
        canProceed() {
            switch(this.currentWizardStep) {
                case 1: // Döntési javaslat
                    return this.dontesiJavaslat.targy.trim() &&
                           this.dontesiJavaslat.indokolas.trim();
                case 2: // Jogi forma
                    return this.jogiForma !== null;
                case 3: // Dokumentumok
                    return Object.values(this.dokumentumok).some(d => d.selected);
                case 4: // Követő feladatok
                    return true; // Opcionális
                case 5: // Nyilvántartás
                    return true; // Opcionális
                case 6: // Díjfizetés
                    return this.dijFizetve || !this.dijFizetve; // Mindig továbbléphet
                case 7: // Véleményeztetés
                    return true; // Opcionális
                case 8: // Összegzés
                    return true;
                default:
                    return false;
            }
        },

        // Dokumentum export lista
        dokumentumExportLista() {
            return Object.entries(this.dokumentumok)
                .filter(([key, doc]) => doc.selected)
                .map(([key, doc]) => ({
                    tipus: key.replace('_tervezet', '').replace('_adatok', ''),
                    funkciokod: doc.funkciokod || '',
                    generalt: doc.generalt,
                    fajlnev: doc.fajlnev
                }));
        }
    },

    methods: {
        // Wizard navigáció
        nextStep() {
            if (!this.canProceed) {
                this.validateCurrentStep();
                return;
            }

            // Jelenlegi lépés befejezettnek jelölése
            const currentStep = this.wizardSteps.find(s => s.id === this.currentWizardStep);
            if (currentStep) {
                currentStep.completed = true;
            }

            if (this.currentWizardStep < this.wizardSteps.length) {
                this.currentWizardStep++;
            }
        },

        prevStep() {
            if (this.currentWizardStep > 1) {
                this.currentWizardStep--;
            }
        },

        goToStep(stepId) {
            // Csak befejezett lépésekre lehet visszalépni
            const targetStep = this.wizardSteps.find(s => s.id === stepId);
            if (targetStep && (targetStep.completed || stepId <= this.currentWizardStep)) {
                this.currentWizardStep = stepId;
            }
        },

        // Validáció
        validateCurrentStep() {
            this.errors = {};

            switch(this.currentWizardStep) {
                case 1:
                    if (!this.dontesiJavaslat.targy.trim()) {
                        this.errors.targy = 'A döntési javaslat tárgya kötelező';
                    }
                    if (!this.dontesiJavaslat.indokolas.trim()) {
                        this.errors.indokolas = 'Az indoklás kötelező';
                    }
                    break;
                case 2:
                    if (!this.jogiForma) {
                        this.errors.jogiForma = 'Válasszon jogi formát';
                    }
                    break;
                case 3:
                    if (!Object.values(this.dokumentumok).some(d => d.selected)) {
                        this.errors.dokumentumok = 'Válasszon legalább egy dokumentumot';
                    }
                    break;
            }

            if (Object.keys(this.errors).length > 0) {
                alert('Kérem töltse ki a kötelező mezőket!');
            }
        },

        // Jogi forma választás
        valasztJogiForma(forma) {
            this.jogiForma = forma.id;

            // Auto-select megfelelő dokumentum
            if (forma.id === 'vegzes') {
                this.dokumentumok.vegzes_tervezet.selected = true;
                this.dokumentumok.hatrozat_tervezet.selected = false;
            } else if (forma.id === 'hatrozat') {
                this.dokumentumok.hatrozat_tervezet.selected = true;
                this.dokumentumok.vegzes_tervezet.selected = false;
            }
        },

        // Dokumentum generálás (F-0091 - F-0095)
        generaljDokumentum(dokumentumKey) {
            const doc = this.dokumentumok[dokumentumKey];
            if (!doc) return;

            // Mock dokumentum generálás
            const fajlnev = `${dokumentumKey}_${this.ugy.ugyszam}_${Date.now()}.pdf`;
            doc.generalt = true;
            doc.fajlnev = fajlnev;

            console.log(`[${doc.funkciokod}] Dokumentum generálva: ${fajlnev}`);
            alert(`Dokumentum generálva:\n${fajlnev}\n\nFunkció: ${doc.funkciokod}`);
        },

        // Követő feladat hozzáadása (Rugalmas WF)
        hozzaadFeladat() {
            if (!this.ujFeladat.megnevezes.trim()) {
                alert('A feladat megnevezése kötelező!');
                return;
            }

            this.kovetoFeladatok.push({
                id: Date.now(),
                megnevezes: this.ujFeladat.megnevezes,
                felelos: this.ujFeladat.felelos,
                hatarido: this.ujFeladat.hatarido,
                statusz: 'varakozik'
            });

            // Űrlap reset
            this.ujFeladat = { megnevezes: '', felelos: '', hatarido: '' };
            this.showFeladatForm = false;
        },

        torolFeladat(feladatId) {
            const index = this.kovetoFeladatok.findIndex(f => f.id === feladatId);
            if (index > -1) {
                this.kovetoFeladatok.splice(index, 1);
            }
        },

        // Nyilvántartás hozzáadása
        hozzaadNyilvantartas() {
            if (!this.kivalasztott_nyilvantartas) {
                alert('Válasszon nyilvántartást!');
                return;
            }

            const exists = this.nyilvantartasok.find(
                n => n.kod === this.kivalasztott_nyilvantartas.kod
            );

            if (!exists) {
                this.nyilvantartasok.push({ ...this.kivalasztott_nyilvantartas });
            }

            this.kivalasztott_nyilvantartas = null;
        },

        torolNyilvantartas(kod) {
            const index = this.nyilvantartasok.findIndex(n => n.kod === kod);
            if (index > -1) {
                this.nyilvantartasok.splice(index, 1);
            }
        },

        // Véleményező hozzáadása
        hozzaadVelemenyezo() {
            if (!this.ujVelemenyezo.nev.trim() || !this.ujVelemenyezo.email.trim()) {
                alert('A név és email cím kötelező!');
                return;
            }

            this.velemenyeztetes.velemenyezok.push({
                id: Date.now(),
                nev: this.ujVelemenyezo.nev,
                email: this.ujVelemenyezo.email,
                szervezet: this.ujVelemenyezo.szervezet,
                statusz: 'varakozik', // 'varakozik', 'elfogadva', 'elutasitva'
                velemeny: ''
            });

            // Űrlap reset
            this.ujVelemenyezo = { nev: '', email: '', szervezet: '' };
            this.showVelemenyezoForm = false;
        },

        torolVelemenyezo(velemenyezoId) {
            const index = this.velemenyeztetes.velemenyezok.findIndex(v => v.id === velemenyezoId);
            if (index > -1) {
                this.velemenyeztetes.velemenyezok.splice(index, 1);
            }
        },

        // Véleményeztetés küldése
        kuldVelemenyeztetesre() {
            if (this.velemenyeztetes.velemenyezok.length === 0) {
                alert('Nincs véleményező hozzáadva!');
                return;
            }

            // Mock: Véleményeztetés indítása (Rugalmas WF)
            console.log('[F-0102] Véleményeztetés indítása:', this.velemenyeztetes.velemenyezok);
            alert(`Véleményeztetés elküldve ${this.velemenyeztetes.velemenyezok.length} véleményezőnek.\n\nRugalmas workflow funkció: F-0102`);
        },

        // Döntési adatlap benyújtása
        benyujtDontesiAdatlap() {
            // Validáció
            if (!this.dontesiJavaslat.targy.trim() || !this.dontesiJavaslat.indokolas.trim()) {
                alert('A döntési javaslat és indoklás kötelező!');
                return;
            }

            if (!this.jogiForma) {
                alert('Válasszon jogi formát!');
                return;
            }

            const adatlap = {
                ugyazonosito: this.ugy.ugyazonosito,
                ugyszam: this.ugy.ugyszam,

                // 1. Döntési javaslat
                dontesiJavaslat: this.dontesiJavaslat,

                // 2. Jogi forma
                jogiForma: this.jogiForma,

                // 3. Dokumentumok
                dokumentumok: this.dokumentumExportLista,

                // 4. Követő feladatok
                kovetoFeladatok: this.kovetoFeladatok,

                // 5. Nyilvántartás
                nyilvantartasFreissitese: this.nyilvantartasFreissitese,
                nyilvantartasok: this.nyilvantartasok,

                // 6. Díjfizetés
                dijFizetve: this.dijFizetve,
                dijMegfizetesDatum: this.dijMegfizetesDatum,
                dijOsszeg: this.dijOsszeg,

                // 7. Véleményeztetés
                velemenyeztetes: this.velemenyeztetes,

                // 8. EKEIDR interfész
                ekeidrIktatoszam: this.ekeidrIktatoszam,

                // Meta
                rogzitoDatum: new Date().toISOString(),
                rogzitoUgyintezo: 'Dr. Szabó Péter' // TODO: dinamikus
            };

            console.log('[Döntési Adatlap] Benyújtva:', adatlap);

            // Emit complete event
            this.$emit('complete', {
                type: 'dontesi_adatlap',
                adatlap: adatlap
            });

            alert('Döntési adatlap sikeresen rögzítve!\n\nA folyamat a következő lépéssel folytatódik:\n- Tervezet véleményeztetés (ha szükséges)\n- Vezetői döntés');
        },

        // Mégse
        megse() {
            if (confirm('Biztosan megszakítja a döntési adatlap kitöltését?\n\nA még nem mentett adatok elvesznek.')) {
                this.$emit('action', { type: 'cancel' });
            }
        }
    },

    template: `
        <div class="component-card dontesi-adatlap-component p-4">
            <!-- Fejléc -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="mb-1">
                        <i class="bi bi-file-earmark-text text-primary"></i>
                        Döntési Adatlap
                    </h4>
                    <p class="text-muted mb-0">
                        Eljárási szakasz: Döntéshozatal
                        <span class="badge bg-secondary ms-2">F-0088</span>
                        <span class="badge bg-info ms-1">Rugalmas WF: F-0102</span>
                    </p>
                </div>
                <div>
                    <span class="badge bg-light text-dark">Ügy: {{ ugy.ugyszam }}</span>
                </div>
            </div>

            <!-- Wizard lépések -->
            <div class="wizard-steps-horizontal mb-4">
                <div class="d-flex justify-content-between">
                    <div v-for="step in wizardSteps" :key="step.id"
                         class="wizard-step-item"
                         :class="{
                             active: currentWizardStep === step.id,
                             completed: step.completed
                         }"
                         @click="goToStep(step.id)"
                         style="cursor: pointer; flex: 1; text-align: center;">
                        <div class="wizard-step-circle"
                             :class="{
                                 'bg-primary text-white': currentWizardStep === step.id,
                                 'bg-success text-white': step.completed,
                                 'bg-light text-muted': !step.completed && currentWizardStep !== step.id
                             }"
                             style="width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center;">
                            <i :class="step.icon" v-if="!step.completed"></i>
                            <i class="bi bi-check-lg" v-else></i>
                        </div>
                        <small class="d-block" style="font-size: 0.7rem;">{{ step.label }}</small>
                    </div>
                </div>
                <div class="progress mt-2" style="height: 5px;">
                    <div class="progress-bar bg-primary" role="progressbar"
                         :style="{ width: ((currentWizardStep - 1) / (wizardSteps.length - 1) * 100) + '%' }">
                    </div>
                </div>
            </div>

            <!-- Tartalom terület -->
            <div class="wizard-content" style="min-height: 400px;">

                <!-- 1. LÉPÉS: Döntési javaslat elkészítése -->
                <div v-show="currentWizardStep === 1">
                    <h5 class="mb-3">
                        <i class="bi bi-file-text text-primary"></i>
                        Döntési javaslat elkészítése
                    </h5>

                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            Javaslat tárgya <span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control"
                               v-model="dontesiJavaslat.targy"
                               :class="{ 'is-invalid': errors.targy }"
                               placeholder="pl. Vasúti járművezető alkalmassági vizsgálat engedélyezése">
                        <div class="invalid-feedback" v-if="errors.targy">{{ errors.targy }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">
                            Indokolás <span class="text-danger">*</span>
                        </label>
                        <textarea class="form-control" rows="6"
                                  v-model="dontesiJavaslat.indokolas"
                                  :class="{ 'is-invalid': errors.indokolas }"
                                  placeholder="Részletes indoklás a döntési javaslathoz..."></textarea>
                        <div class="invalid-feedback" v-if="errors.indokolas">{{ errors.indokolas }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">További feladatok (opcionális)</label>
                        <textarea class="form-control" rows="3"
                                  v-model="dontesiJavaslat.tovabbi_feladatok"
                                  placeholder="További tennivalók vagy megjegyzések..."></textarea>
                    </div>
                </div>

                <!-- 2. LÉPÉS: Jogi forma döntés -->
                <div v-show="currentWizardStep === 2">
                    <h5 class="mb-3">
                        <i class="bi bi-balance-scale text-primary"></i>
                        Jogi forma kiválasztása
                    </h5>

                    <div class="row">
                        <div v-for="forma in jogiFormaOptions" :key="forma.id" class="col-md-6 mb-3">
                            <div class="card h-100 jogi-forma-card"
                                 :class="{ 'border-primary': jogiForma === forma.id }"
                                 @click="valasztJogiForma(forma)"
                                 style="cursor: pointer;">
                                <div class="card-body text-center">
                                    <i :class="forma.icon" style="font-size: 3rem;"
                                       :class="{ 'text-primary': jogiForma === forma.id }"></i>
                                    <h5 class="card-title mt-3">{{ forma.label }}</h5>
                                    <p class="card-text text-muted">{{ forma.description }}</p>
                                    <div class="mt-2">
                                        <span v-for="fkod in forma.funkciok" :key="fkod"
                                              class="badge bg-secondary me-1">{{ fkod }}</span>
                                    </div>
                                    <div v-if="jogiForma === forma.id" class="mt-3">
                                        <i class="bi bi-check-circle-fill text-success" style="font-size: 1.5rem;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. LÉPÉS: Dokumentumok -->
                <div v-show="currentWizardStep === 3">
                    <h5 class="mb-3">
                        <i class="bi bi-file-earmark-pdf text-primary"></i>
                        Dokumentumok előállítása
                    </h5>

                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        Válassza ki a szükséges dokumentumokat és generálja le azokat.
                    </div>

                    <div class="list-group">
                        <!-- Végzés tervezet -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.vegzes_tervezet.selected"
                                       :disabled="jogiForma === 'hatrozat'">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Végzés tervezet
                                        <span class="badge bg-secondary ms-2">F-0091</span>
                                    </h6>
                                    <small class="text-muted">Eljárási kérdést eldöntő hatósági aktus</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.vegzes_tervezet.selected && !dokumentumok.vegzes_tervezet.generalt"
                                        @click="generaljDokumentum('vegzes_tervezet')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Generálás
                                </button>
                                <span v-if="dokumentumok.vegzes_tervezet.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Generálva
                                </span>
                            </div>
                        </div>

                        <!-- Határozat tervezet -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.hatrozat_tervezet.selected"
                                       :disabled="jogiForma === 'vegzes'">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Határozat tervezet
                                        <span class="badge bg-secondary ms-2">F-0092</span>
                                    </h6>
                                    <small class="text-muted">Érdemi döntést tartalmazó hatósági aktus</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.hatrozat_tervezet.selected && !dokumentumok.hatrozat_tervezet.generalt"
                                        @click="generaljDokumentum('hatrozat_tervezet')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Generálás
                                </button>
                                <span v-if="dokumentumok.hatrozat_tervezet.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Generálva
                                </span>
                            </div>
                        </div>

                        <!-- Igazolás tervezet -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.igazolas_tervezet.selected">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Igazolás tervezet
                                        <span class="badge bg-secondary ms-2">F-0093</span>
                                    </h6>
                                    <small class="text-muted">Igazolás kiállítása</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.igazolas_tervezet.selected && !dokumentumok.igazolas_tervezet.generalt"
                                        @click="generaljDokumentum('igazolas_tervezet')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Generálás
                                </button>
                                <span v-if="dokumentumok.igazolas_tervezet.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Generálva
                                </span>
                            </div>
                        </div>

                        <!-- Tájékoztatás tervezet -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.tajekoztatas_tervezet.selected">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Tájékoztatás tervezet
                                        <span class="badge bg-secondary ms-2">F-0094</span>
                                    </h6>
                                    <small class="text-muted">Tájékoztató dokumentum</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.tajekoztatas_tervezet.selected && !dokumentumok.tajekoztatas_tervezet.generalt"
                                        @click="generaljDokumentum('tajekoztatas_tervezet')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Generálás
                                </button>
                                <span v-if="dokumentumok.tajekoztatas_tervezet.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Generálva
                                </span>
                            </div>
                        </div>

                        <!-- Okmány adatok -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.okmany_adatok.selected">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Okmány adatok összeállítása</h6>
                                    <small class="text-muted">Okmány előállításának előkészítése (Output: okmány gyártó interfész)</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.okmany_adatok.selected && !dokumentumok.okmany_adatok.generalt"
                                        @click="generaljDokumentum('okmany_adatok')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Előkészítés
                                </button>
                                <span v-if="dokumentumok.okmany_adatok.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Előkészítve
                                </span>
                            </div>
                        </div>

                        <!-- Hirdetmény tervezet -->
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3"
                                       v-model="dokumentumok.hirdetmeny_tervezet.selected">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">Hirdetmény tervezet
                                        <span class="badge bg-secondary ms-2">F-0095</span>
                                    </h6>
                                    <small class="text-muted">Hirdetmény dokumentum</small>
                                </div>
                                <button class="btn btn-sm btn-primary"
                                        v-if="dokumentumok.hirdetmeny_tervezet.selected && !dokumentumok.hirdetmeny_tervezet.generalt"
                                        @click="generaljDokumentum('hirdetmeny_tervezet')">
                                    <i class="bi bi-file-earmark-arrow-down"></i> Generálás
                                </button>
                                <span v-if="dokumentumok.hirdetmeny_tervezet.generalt" class="badge bg-success">
                                    <i class="bi bi-check-circle"></i> Generálva
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. LÉPÉS: Követő feladatok (Rugalmas WF) -->
                <div v-show="currentWizardStep === 4">
                    <h5 class="mb-3">
                        <i class="bi bi-arrow-repeat text-primary"></i>
                        Követő eljárási feladatok
                        <span class="badge bg-info ms-2">Rugalmas WF: F-0102</span>
                    </h5>

                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        Példa feladatok: Okmány készítés, Jóváhagyás, Postázás, Átvétel
                    </div>

                    <button class="btn btn-outline-primary mb-3" @click="showFeladatForm = !showFeladatForm">
                        <i class="bi bi-plus-circle"></i> Új feladat hozzáadása
                    </button>

                    <!-- Feladat hozzáadás űrlap -->
                    <div v-if="showFeladatForm" class="card mb-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 mb-2">
                                    <input type="text" class="form-control"
                                           v-model="ujFeladat.megnevezes"
                                           placeholder="Feladat megnevezése">
                                </div>
                                <div class="col-md-4 mb-2">
                                    <input type="text" class="form-control"
                                           v-model="ujFeladat.felelos"
                                           placeholder="Felelős személy">
                                </div>
                                <div class="col-md-3 mb-2">
                                    <input type="date" class="form-control"
                                           v-model="ujFeladat.hatarido">
                                </div>
                                <div class="col-md-1 mb-2">
                                    <button class="btn btn-success w-100" @click="hozzaadFeladat">
                                        <i class="bi bi-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feladatok lista -->
                    <div v-if="kovetoFeladatok.length > 0" class="list-group">
                        <div v-for="feladat in kovetoFeladatok" :key="feladat.id"
                             class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">{{ feladat.megnevezes }}</h6>
                                <small class="text-muted">
                                    Felelős: {{ feladat.felelos || 'Nincs megadva' }} |
                                    Határidő: {{ feladat.hatarido || 'Nincs megadva' }}
                                </small>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" @click="torolFeladat(feladat.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div v-else class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">Még nincsenek követő feladatok hozzáadva.</p>
                    </div>
                </div>

                <!-- 5. LÉPÉS: Nyilvántartás -->
                <div v-show="currentWizardStep === 5">
                    <h5 class="mb-3">
                        <i class="bi bi-database text-primary"></i>
                        Nyilvántartás frissítése
                    </h5>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox"
                               v-model="nyilvantartasFreissitese" id="nyilvantartasCheck">
                        <label class="form-check-label fw-bold" for="nyilvantartasCheck">
                            Nyilvántartás aktualizálás szükséges
                        </label>
                    </div>

                    <div v-if="nyilvantartasFreissitese">
                        <div class="mb-3">
                            <label class="form-label">Válasszon nyilvántartást:</label>
                            <div class="input-group">
                                <select class="form-select" v-model="kivalasztott_nyilvantartas">
                                    <option :value="null">-- Válasszon --</option>
                                    <option v-for="nyi in elerheto_nyilvantartasok" :key="nyi.kod"
                                            :value="nyi">
                                        {{ nyi.kod }} - {{ nyi.nev }} ({{ nyi.modul }})
                                    </option>
                                </select>
                                <button class="btn btn-primary" @click="hozzaadNyilvantartas">
                                    <i class="bi bi-plus-circle"></i> Hozzáad
                                </button>
                            </div>
                        </div>

                        <!-- Kiválasztott nyilvántartások -->
                        <div v-if="nyilvantartasok.length > 0" class="list-group">
                            <div v-for="nyi in nyilvantartasok" :key="nyi.kod"
                                 class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{{ nyi.kod }}</strong> - {{ nyi.nev }}
                                    <span class="badge bg-info ms-2">{{ nyi.modul }}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-danger" @click="torolNyilvantartas(nyi.kod)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="alert alert-secondary">
                        Nincs szükség nyilvántartás frissítésre ehhez az ügyh oz.
                    </div>
                </div>

                <!-- 6. LÉPÉS: Díjfizetés ellenőrzése -->
                <div v-show="currentWizardStep === 6">
                    <h5 class="mb-3">
                        <i class="bi bi-cash-stack text-primary"></i>
                        Eljárási díjfizetés ellenőrzése
                    </h5>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox"
                               v-model="dijFizetve" id="dijFizetveCheck">
                        <label class="form-check-label fw-bold" for="dijFizetveCheck">
                            Eljárási díj megfizetése megtörtént
                        </label>
                    </div>

                    <div v-if="dijFizetve">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Megfizetés dátuma:</label>
                                <input type="date" class="form-control" v-model="dijMegfizetesDatum">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Megfizetett összeg (Ft):</label>
                                <input type="number" class="form-control" v-model.number="dijOsszeg" min="0">
                            </div>
                        </div>
                    </div>

                    <div v-else class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        A díj még nem került megfizetésre. Az eljárás folytatása feltételes lehet.
                    </div>
                </div>

                <!-- 7. LÉPÉS: Véleményeztetés -->
                <div v-show="currentWizardStep === 7">
                    <h5 class="mb-3">
                        <i class="bi bi-chat-dots text-primary"></i>
                        Döntési javaslat véleményeztetése
                        <span class="badge bg-info ms-2">Rugalmas WF: F-0102</span>
                    </h5>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox"
                               v-model="velemenyeztetes.szukseges" id="velemenyeztetesCheck">
                        <label class="form-check-label fw-bold" for="velemenyeztetesCheck">
                            Véleményeztetés szükséges
                        </label>
                    </div>

                    <div v-if="velemenyeztetes.szukseges">
                        <button class="btn btn-outline-primary mb-3" @click="showVelemenyezoForm = !showVelemenyezoForm">
                            <i class="bi bi-plus-circle"></i> Véleményező hozzáadása
                        </button>

                        <!-- Véleményező hozzáadás űrlap -->
                        <div v-if="showVelemenyezoForm" class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 mb-2">
                                        <input type="text" class="form-control"
                                               v-model="ujVelemenyezo.nev"
                                               placeholder="Név">
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <input type="email" class="form-control"
                                               v-model="ujVelemenyezo.email"
                                               placeholder="Email cím">
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <input type="text" class="form-control"
                                               v-model="ujVelemenyezo.szervezet"
                                               placeholder="Szervezet">
                                    </div>
                                    <div class="col-md-1 mb-2">
                                        <button class="btn btn-success w-100" @click="hozzaadVelemenyezo">
                                            <i class="bi bi-check"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Véleményezők lista -->
                        <div v-if="velemenyeztetes.velemenyezok.length > 0" class="list-group mb-3">
                            <div v-for="vel in velemenyeztetes.velemenyezok" :key="vel.id"
                                 class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-1">{{ vel.nev }}</h6>
                                    <small class="text-muted">
                                        {{ vel.email }} | {{ vel.szervezet || 'Nincs megadva' }}
                                    </small>
                                </div>
                                <button class="btn btn-sm btn-outline-danger" @click="torolVelemenyezo(vel.id)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>

                        <button class="btn btn-primary"
                                v-if="velemenyeztetes.velemenyezok.length > 0"
                                @click="kuldVelemenyeztetesre">
                            <i class="bi bi-send"></i> Véleményeztetés elküldése
                        </button>
                    </div>

                    <div v-else class="alert alert-secondary">
                        Nincs szükség véleményeztetésre.
                    </div>
                </div>

                <!-- 8. LÉPÉS: Összegzés -->
                <div v-show="currentWizardStep === 8">
                    <h5 class="mb-4">
                        <i class="bi bi-check-circle text-success"></i>
                        Döntési adatlap összegzése
                    </h5>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">1. Döntési javaslat</h6>
                        </div>
                        <div class="card-body">
                            <p><strong>Tárgy:</strong> {{ dontesiJavaslat.targy }}</p>
                            <p><strong>Indokolás:</strong> {{ dontesiJavaslat.indokolas }}</p>
                            <p v-if="dontesiJavaslat.tovabbi_feladatok">
                                <strong>További feladatok:</strong> {{ dontesiJavaslat.tovabbi_feladatok }}
                            </p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">2. Jogi forma</h6>
                        </div>
                        <div class="card-body">
                            <span class="badge bg-primary" v-if="jogiForma">
                                {{ jogiFormaOptions.find(f => f.id === jogiForma)?.label }}
                            </span>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">3. Dokumentumok</h6>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled">
                                <li v-for="doc in dokumentumExportLista" :key="doc.tipus">
                                    <i class="bi bi-file-earmark-check text-success"></i>
                                    {{ doc.tipus }}
                                    <span class="badge bg-secondary ms-2" v-if="doc.funkciokod">{{ doc.funkciokod }}</span>
                                </li>
                            </ul>
                            <p v-if="dokumentumExportLista.length === 0" class="text-muted">Nincs kiválasztott dokumentum</p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">4. Követő feladatok</h6>
                        </div>
                        <div class="card-body">
                            <p v-if="kovetoFeladatok.length > 0">{{ kovetoFeladatok.length }} feladat</p>
                            <p v-else class="text-muted">Nincs követő feladat</p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">5. Nyilvántartás</h6>
                        </div>
                        <div class="card-body">
                            <p v-if="nyilvantartasFreissitese">
                                {{ nyilvantartasok.length }} nyilvántartás frissítése szükséges
                            </p>
                            <p v-else class="text-muted">Nincs nyilvántartás frissítés</p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">6. Díjfizetés</h6>
                        </div>
                        <div class="card-body">
                            <p>
                                <span v-if="dijFizetve" class="badge bg-success">Díj megfizetve</span>
                                <span v-else class="badge bg-warning">Díj még nem fizetve</span>
                            </p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">7. Véleményeztetés</h6>
                        </div>
                        <div class="card-body">
                            <p v-if="velemenyeztetes.szukseges">
                                {{ velemenyeztetes.velemenyezok.length }} véleményező
                            </p>
                            <p v-else class="text-muted">Nincs véleményeztetés</p>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        A döntési adatlap benyújtása után a folyamat a következő lépéssel folytatódik:
                        <ul class="mb-0 mt-2">
                            <li>Tervezet véleményeztetés (ha szükséges)</li>
                            <li>Vezetői döntés</li>
                        </ul>
                    </div>
                </div>

            </div>

            <!-- Navigációs gombok -->
            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
                <button class="btn btn-outline-secondary" @click="prevStep"
                        :disabled="currentWizardStep === 1">
                    <i class="bi bi-arrow-left"></i> Előző
                </button>

                <button class="btn btn-secondary" @click="megse">
                    <i class="bi bi-x-circle"></i> Mégse
                </button>

                <button v-if="currentWizardStep < wizardSteps.length"
                        class="btn btn-primary" @click="nextStep"
                        :disabled="!canProceed">
                    Következő <i class="bi bi-arrow-right"></i>
                </button>

                <button v-else class="btn btn-success" @click="benyujtDontesiAdatlap">
                    <i class="bi bi-check2-square"></i> Döntési adatlap benyújtása
                </button>
            </div>
        </div>
    `
};
