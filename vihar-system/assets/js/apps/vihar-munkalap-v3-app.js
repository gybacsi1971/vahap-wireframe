/**
 * VAHAP Vasúti Ügyintézői Munkalap v3 - Főalkalmazás
 * 2 oszlopos layout egységes workflow komponensekkel
 */

const VahapMunkalapV3App = {
    data() {
        return {
            // Sidebar állapotok
            sidebarCollapsed: false,
            workflowCollapsed: false,

            // Teszt mód (minden lépés elérhető)
            testMode: false,

            // Tab állapot
            activeTab: 'workflow', // 'workflow' vagy 'documents'

            // Ügyintéző adatok
            ugyintezo: {
                nev: 'Dr. Szabó Péter',
                beosztas: 'vezető ügyintéző',
                szervezet: 'Vasúti Hatósági Főosztály'
            },

            // Ügy adatok
            ugy: {
                ugyszam: '2025/ÜGY/0142',
                ugyazonosito: 'VAHAP-V-2024-001234',
                ugytipus: 'V-044',
                eljarasTipusa: 'Kikötői engedélyezési eljárás',
                targy: 'Kikötő létesítési engedély',
                megnevezes: 'Vasúti járművezetők előzetes alkalmassági vizsgálata',
                kerelmező: 'Minta Kft.',
                beerkezesDatum: '2025.09.15',
                hatarido: '2025.11.15',
                ugyintezo: 'Nagy Péter',
                prioritas: 'Normál', // Normál, Sürgős, Azonnali
                allapot: 'Eljárási feltételek vizsgálata',
                benyujtasDatum: '2024-10-15',
                ugyfel: {
                    nev: 'Minta János',
                    szuletesiNev: 'Minta János',
                    szuletesiHely: 'Budapest',
                    szuletesiDatum: '1985-03-15',
                    anyaNeve: 'Nagy Mária',
                    lakcim: {
                        iranyitoszam: '1011',
                        telepules: 'Budapest',
                        kozterulet: 'Fő utca',
                        hazszam: '1'
                    },
                    telefonszam: '+36301234567',
                    email: 'minta.janos@example.hu'
                }
            },

            // Workflow lépések
            workflowSteps: [
                {
                    id: 'hataskor',
                    name: 'Hatáskör és illetékesség',
                    code: 'UCE-1793',
                    icon: 'bi-shield-check',
                    component: 'wf-hataskor-wizard',
                    data: { checklistType: 'hataskor' },
                    completed: true
                },
                {
                    id: 'formai',
                    name: 'Formai ellenőrzés',
                    code: 'UCE-1799',
                    icon: 'bi-clipboard-check',
                    component: 'wf-formai-wizard',
                    data: { checklistType: 'formai' },
                    completed: true
                },
                                {
                    id: 'hianypotlas',
                    name: 'Hiánypótlás',
                    code: 'UCE-2071',
                    icon: 'bi-exclamation-triangle',
                    component: 'wf-hianypotlas',
                    indented: true,
                    completed: false
                },
                {
                    id: 'tartalmi',
                    name: 'Tartalmi ellenőrzés',
                    code: 'UCE-1794',
                    icon: 'bi-search',
                    component: 'wf-tartalmi-wizard',
                    data: { checklistType: 'tartalmi' },
                    completed: true
                },
                {
                    id: 'tenyallas',
                    name: 'Tényállás tisztázása',
                    code: 'F-0102',
                    icon: 'bi-diagram-3',
                    component: 'wf-rugalmas-workflow',
                    completed: false
                },
                {
                    id: 'dontes',
                    name: 'Döntés előkészítés',
                    code: 'F-0088',
                    icon: 'bi-file-earmark-text',
                    component: 'wf-dontesi-adatlap',
                    completed: false
                },
                {
                    id: 'velemenyeztetes-formai',
                    name: 'Véleményeztetés',
                    code: 'UCE-1824',
                    icon: 'bi-chat-dots',
                    component: 'wf-velemenyezes',
                    indented: true,
                    completed: false
                },
                {
                    id: 'kiadmanyozas',
                    name: 'Kiadmányozás',
                    code: 'UCE-1815',
                    icon: 'bi-pen',
                    component: 'wf-kiadmanyozas',
                    completed: false
                }
            ],

            // Aktív lépés
            currentStep: 'formai',

            // Akta fa struktúra
            aktaTree: [
                {
                    id: 'ugy',
                    label: 'Ügy: VAHAP-V-2024-001234',
                    icon: 'bi-folder-fill',
                    expanded: true,
                    count: 12,
                    children: [
                        {
                            id: 'kerelem',
                            label: 'Kérelem',
                            icon: 'bi-file-earmark-text',
                            count: 3
                        },
                        {
                            id: 'mellekletek',
                            label: 'Mellékletek',
                            icon: 'bi-paperclip',
                            count: 5
                        },
                        {
                            id: 'hatarozatok',
                            label: 'Határozatok',
                            icon: 'bi-file-earmark-check',
                            count: 2
                        },
                        {
                            id: 'jegyzokonyvek',
                            label: 'Jegyzőkönyvek',
                            icon: 'bi-journal-text',
                            count: 2
                        }
                    ]
                }
            ],
            selectedNode: 'ugy',

            // Döntési pontok
            availableDecisions: [],

            // Dokumentumok (workflow lépésenként kategorizálva)
            dokumentumok: [
                // Hatáskör vizsgálat
                {
                    id: 'doc1',
                    nev: 'Kérelem - Alkalmassági vizsgálat',
                    tipus: 'Kérelem',
                    datum: '2024-10-15',
                    meret: '2.3 MB',
                    workflowStep: 'hataskor'
                },
                {
                    id: 'doc2',
                    nev: 'Orvosi igazolás',
                    tipus: 'Melléklet',
                    datum: '2024-10-15',
                    meret: '456 KB',
                    workflowStep: 'hataskor'
                },
                {
                    id: 'doc3',
                    nev: 'Munkáltatói igazolás',
                    tipus: 'Melléklet',
                    datum: '2024-10-15',
                    meret: '234 KB',
                    workflowStep: 'hataskor'
                },
                {
                    id: 'doc4',
                    nev: 'Személyi igazolvány másolat',
                    tipus: 'Melléklet',
                    datum: '2024-10-15',
                    meret: '128 KB',
                    workflowStep: 'hataskor'
                },
                {
                    id: 'doc5',
                    nev: 'Hatáskör vizsgálati jegyzőkönyv',
                    tipus: 'Jegyzőkönyv',
                    datum: '2024-10-16',
                    meret: '89 KB',
                    workflowStep: 'hataskor'
                },
                {
                    id: 'doc6',
                    nev: 'Illetékességi igazolás',
                    tipus: 'Igazolás',
                    datum: '2024-10-16',
                    meret: '45 KB',
                    workflowStep: 'hataskor'
                },
                // Formai ellenőrzés
                {
                    id: 'doc7',
                    nev: 'Formai ellenőrzési lap',
                    tipus: 'Jegyzőkönyv',
                    datum: '2024-10-17',
                    meret: '124 KB',
                    workflowStep: 'formai'
                },
                // Tartalmi vizsgálat
                {
                    id: 'doc8',
                    nev: 'Tartalmi vizsgálat eredménye',
                    tipus: 'Jegyzőkönyv',
                    datum: '2024-10-18',
                    meret: '256 KB',
                    workflowStep: 'tartalmi'
                },
                {
                    id: 'doc9',
                    nev: 'Szakértői vélemény',
                    tipus: 'Melléklet',
                    datum: '2024-10-18',
                    meret: '512 KB',
                    workflowStep: 'tartalmi'
                }
            ],

            // Modal állapotok
            showIktatas: false,
            showNyilvantartas: false,
            showVelemenyezes: false,
            showKiadmanyozas: false,
            showExpedialas: false,

            // Workflow előzmények (history)
            workflowHistory: [
                {
                    title: 'Kérelem beérkezése',
                    description: 'A kérelem elektronikus úton beérkezett a rendszerbe. Az automatikus érkeztetés megtörtént, ügyazonosító kiosztásra került.',
                    timestamp: '2025.09.15 09:23',
                    user: 'Rendszer',
                    icon: 'bi-inbox-fill',
                    status: 'completed',
                    result: null,
                    duration: null
                },
                {
                    title: 'Hatáskör és illetékesség vizsgálat',
                    description: 'A hatáskör és illetékesség vizsgálata során megállapítást nyert, hogy a hatóság rendelkezik a hatáskörrel és illetékességgel az ügy elbírálására.',
                    timestamp: '2025.09.16 11:42',
                    user: 'Dr. Szabó Péter',
                    icon: 'bi-shield-check',
                    status: 'completed',
                    result: 'Hatáskör fennáll',
                    duration: '1 óra 27 perc'
                },
                {
                    title: 'Formai megfelelőség vizsgálata',
                    description: 'A kérelem formai ellenőrzése folyamatban van. Kérelem formanyomtatvány, mellékletek és díjfizetés ellenőrzése.',
                    timestamp: '2025.09.17 14:30',
                    user: 'Dr. Szabó Péter',
                    icon: 'bi-clipboard-check',
                    status: 'inprogress',
                    result: null,
                    duration: null
                }
            ]
        };
    },

    computed: {
        // Aktív komponens
        activeComponent() {
            const step = this.workflowSteps.find(s => s.id === this.currentStep);
            return step ? step.component : null;
        },

        // Aktuális lépés adatai
        currentStepData() {
            const step = this.workflowSteps.find(s => s.id === this.currentStep);
            return step ? step.data || {} : {};
        },

        // Aktuális lépés neve
        currentStepName() {
            const step = this.workflowSteps.find(s => s.id === this.currentStep);
            return step ? step.name : 'Ismeretlen lépés';
        },

        // Befejezhetőség
        canComplete() {
            const step = this.workflowSteps.find(s => s.id === this.currentStep);
            return step && !step.completed;
        },

        // Összes dokumentum száma
        totalDocuments() {
            return this.dokumentumok.length;
        },

        // Dokumentumok workflow lépésenként csoportosítva
        documentsByWorkflow() {
            const grouped = {};

            // Csoportosítás workflow lépésenként
            this.dokumentumok.forEach(doc => {
                if (!grouped[doc.workflowStep]) {
                    grouped[doc.workflowStep] = [];
                }
                grouped[doc.workflowStep].push(doc);
            });

            // Átalakítás tömbbé a workflow lépések sorrendjében
            return this.workflowSteps
                .filter(step => grouped[step.id] && grouped[step.id].length > 0)
                .map(step => ({
                    stepId: step.id,
                    stepName: step.name,
                    code: step.code,
                    icon: step.icon,
                    documents: grouped[step.id]
                }));
        }
    },

    methods: {
        // Workflow lépés választása
        selectWorkflowStep(step) {
            // Teszt módban minden lépés elérhető
            if (this.testMode || step.completed || this.isStepAvailable(step)) {
                this.currentStep = step.id;
                this.activeTab = 'workflow'; // Automatikusan workflow tab-ra vált
                this.updateAvailableDecisions(step);

                if (this.testMode) {
                    console.log('[TESZT MÓD] Lépés kiválasztva:', step.name, '(' + step.code + ')');
                }
            } else {
                alert('Ez a lépés még nem érhető el!');
            }
        },

        // Teszt mód váltás eseménykezelő
        onTestModeChange() {
            if (this.testMode) {
                console.log('🐛 [TESZT MÓD BEKAPCSOLVA] Minden workflow lépés elérhető');
                console.log('ℹ️ A workflow korlátozások kikapcsolva. Bármely lépés szabadon kiválasztható.');
            } else {
                console.log('✅ [TESZT MÓD KIKAPCSOLVA] Workflow korlátozások aktívak');
                console.log('ℹ️ Csak az elérhető lépések választhatók ki.');
            }
        },

        // Lépés elérhetőség ellenőrzése
        isStepAvailable(step) {
            const stepIndex = this.workflowSteps.findIndex(s => s.id === step.id);

            // Az első ÖT lépés mindig elérhető (hataskor, formai, velemenyeztetes-formai, tartalmi, hianypotlas)
            if (stepIndex <= 4) return true;

            // A többi lépésnél ellenőrizzük az előzőek teljesítését
            if (stepIndex === 0) return true;

            // Előző lépések befejezve?
            for (let i = 0; i < stepIndex; i++) {
                if (!this.workflowSteps[i].completed) {
                    return false;
                }
            }
            return true;
        },

        // Aktuális lépés befejezése
        completeCurrentStep(result) {
            const step = this.workflowSteps.find(s => s.id === this.currentStep);
            if (step) {
                step.completed = true;
                console.log(`Lépés befejezve: ${step.name}`, result);

                // Következő lépésre ugrás
                const nextStep = this.getNextStep();
                if (nextStep) {
                    this.currentStep = nextStep.id;
                    this.$nextTick(() => {
                        alert(`${step.name} sikeresen befejezve!\nKövetkező lépés: ${nextStep.name}`);
                    });
                } else {
                    alert('Minden workflow lépés befejezve!');
                }
            }
        },

        // Következő lépés lekérése
        getNextStep() {
            const currentIndex = this.workflowSteps.findIndex(s => s.id === this.currentStep);
            for (let i = currentIndex + 1; i < this.workflowSteps.length; i++) {
                if (!this.workflowSteps[i].completed) {
                    return this.workflowSteps[i];
                }
            }
            return null;
        },

        // Komponens akció kezelése
        handleComponentAction(action) {
            console.log('Komponens akció:', action);

            if (action.type === 'cancel') {
                // Visszalépés
                const prevStep = this.getPreviousStep();
                if (prevStep) {
                    this.currentStep = prevStep.id;
                }
            }
        },

        // Előző lépés lekérése
        getPreviousStep() {
            const currentIndex = this.workflowSteps.findIndex(s => s.id === this.currentStep);
            if (currentIndex > 0) {
                return this.workflowSteps[currentIndex - 1];
            }
            return null;
        },

        // Döntési pontok frissítése
        updateAvailableDecisions(step) {
            this.availableDecisions = [];

            if (step.id === 'formai' || step.id === 'tartalmi') {
                this.availableDecisions = [
                    {
                        id: 'sommas',
                        label: 'Sommás eljárás',
                        code: 'UCE-1800',
                        icon: 'bi-check-circle',
                        btnClass: 'btn-success',
                        enabled: true
                    },
                    {
                        id: 'hianypotlas',
                        label: 'Hiánypótlás',
                        code: 'UCE-2071',
                        icon: 'bi-exclamation-triangle',
                        btnClass: 'btn-warning',
                        enabled: true
                    },
                    {
                        id: 'elutasitas',
                        label: 'Elutasítás',
                        code: 'UCE-1990',
                        icon: 'bi-x-circle',
                        btnClass: 'btn-danger',
                        enabled: true
                    }
                ];
            } else if (step.id === 'dontes') {
                this.availableDecisions = [
                    {
                        id: 'engedelyez',
                        label: 'Engedélyezés',
                        code: '',
                        icon: 'bi-check-circle',
                        btnClass: 'btn-success',
                        enabled: true
                    },
                    {
                        id: 'reszben',
                        label: 'Részben engedélyez',
                        code: '',
                        icon: 'bi-slash-circle',
                        btnClass: 'btn-warning',
                        enabled: true
                    },
                    {
                        id: 'elutasit',
                        label: 'Elutasít',
                        code: '',
                        icon: 'bi-x-circle',
                        btnClass: 'btn-danger',
                        enabled: true
                    }
                ];
            }
        },

        // Döntés végrehajtása
        executeDecision(decision) {
            console.log('Döntés végrehajtása:', decision);

            // Döntés alapján workflow elágazás
            if (decision.id === 'hianypotlas') {
                // Hiánypótlás workflow
                this.currentStep = 'dokumentum';
                const docStep = this.workflowSteps.find(s => s.id === 'dokumentum');
                if (docStep) {
                    docStep.data = {
                        preselectedType: 'vegzes',
                        preselectedTemplate: 'v1'
                    };
                }
            } else if (decision.id === 'sommas') {
                // Sommás eljárás - ugrás döntés előkészítésre
                this.currentStep = 'dontes';
            } else if (decision.id === 'engedelyez') {
                // Engedélyező határozat
                this.currentStep = 'dokumentum';
                const docStep = this.workflowSteps.find(s => s.id === 'dokumentum');
                if (docStep) {
                    docStep.data = {
                        preselectedType: 'hatrozat',
                        preselectedTemplate: 'h1'
                    };
                }
            }

            alert(`Döntés: ${decision.label}\nWorkflow folytatódik...`);
        },

        // Akta node választása
        selectAktaNode(node) {
            this.selectedNode = node.id;
            if (node.children) {
                node.expanded = !node.expanded;
            }
            console.log('Akta node kiválasztva:', node);
        },

        // Dokumentum megnyitása
        openDocument(doc) {
            console.log('Dokumentum megnyitása:', doc);
            alert(`Dokumentum: ${doc.nev}\nTípus: ${doc.tipus}\nMéret: ${doc.meret}`);
        },

        // Dokumentum ikon
        getDocumentIcon(tipus) {
            const icons = {
                'Kérelem': 'bi-file-earmark-text',
                'Melléklet': 'bi-paperclip',
                'Határozat': 'bi-file-earmark-check',
                'Végzés': 'bi-file-earmark-x',
                'Jegyzőkönyv': 'bi-journal-text',
                'Igazolás': 'bi-patch-check'
            };
            return icons[tipus] || 'bi-file-earmark';
        },

        // Dokumentum letöltése
        downloadDocument(doc) {
            console.log('Dokumentum letöltése:', doc);
            alert(`Dokumentum letöltése:\n${doc.nev}\nMéret: ${doc.meret}`);
        },

        // Dokumentum előnézete
        previewDocument(doc) {
            console.log('Dokumentum előnézet:', doc);
            alert(`Dokumentum előnézet:\n${doc.nev}\nTípus: ${doc.tipus}`);
        },

        // Mentés
        saveProgress() {
            const saveData = {
                ugyId: this.ugy.ugyazonosito,
                currentStep: this.currentStep,
                workflowSteps: this.workflowSteps,
                savedAt: new Date().toISOString()
            };
            console.log('Mentés:', saveData);
            alert('Munkafolyamat állapota sikeresen mentve!');
        },

        // Feladat befejezése
        completeTask() {
            if (this.canComplete) {
                this.completeCurrentStep({
                    manual: true,
                    completedBy: this.ugyintezo.nev
                });
            }
        },

        // Modal műveletek (placeholder)
        showIktatas() {
            alert('Iktatás modul megnyitása...\n(Implementáció: wf-iktatas komponens)');
        },

        showNyilvantartas() {
            alert('Nyilvántartás modul megnyitása...\n(Implementáció: wf-nyilvantartas komponens)');
        },

        showVelemenyezes() {
            alert('Véleményezés modul megnyitása...\n(Implementáció: wf-velemenyezes komponens)');
        },

        showKiadmanyozas() {
            alert('Kiadmányozás modul megnyitása...\n(Implementáció: wf-kiadmanyozas komponens)');
        },

        showExpedialas() {
            alert('Expediálás modul megnyitása...\n(Implementáció: wf-expedialas komponens)');
        }
    },

    mounted() {
        // Kezdő döntési pontok beállítása
        this.updateAvailableDecisions(this.workflowSteps.find(s => s.id === this.currentStep));

        console.log('VAHAP Munkalap v3 inicializálva');
        console.log('Ügy:', this.ugy);
        console.log('Workflow lépések:', this.workflowSteps);
    },

    // Komponensek regisztrálása
    components: {
        // Wizard komponensek (ÚJ)
        'wf-szignalas-wizard': typeof WfSzignalasWizard !== 'undefined' ? WfSzignalasWizard : { template: '<div class="alert alert-info">Szignálás wizard betöltése...</div>' },
        'wf-hataskor-wizard': typeof WfHataskorWizard !== 'undefined' ? WfHataskorWizard : { template: '<div class="alert alert-info">Hatáskör wizard betöltése...</div>' },
        'wf-formai-wizard': typeof WfFormaiWizard !== 'undefined' ? WfFormaiWizard : { template: '<div class="alert alert-info">Formai wizard betöltése...</div>' },
        'wf-tartalmi-wizard': typeof WfTartalmiWizard !== 'undefined' ? WfTartalmiWizard : { template: '<div class="alert alert-info">Tartalmi wizard betöltése...</div>' },
        'wf-hianypotlas': typeof WfHianypotlasWizard !== 'undefined' ? WfHianypotlasWizard : { template: '<div class="alert alert-info">Hiánypótlás wizard betöltése...</div>' },

        // Eredeti komponensek
        'wf-szignalas': typeof WfSzignalas !== 'undefined' ? WfSzignalas : { template: '<div class="alert alert-info">Szignálás komponens betöltése...</div>' },
        'wf-checklist': typeof WfChecklist !== 'undefined' ? WfChecklist : { template: '<div class="alert alert-info">Checklist komponens betöltése...</div>' },
        'wf-dokumentum-gyartas': typeof WfDokumentumGyartas !== 'undefined' ? WfDokumentumGyartas : { template: '<div class="alert alert-info">Dokumentum gyártás komponens betöltése...</div>' },
        'wf-dontes': typeof WfDontes !== 'undefined' ? WfDontes : { template: '<div class="alert alert-info">Döntés komponens betöltése...</div>' },
        'wf-dontesi-adatlap': typeof WfDontesiAdatlap !== 'undefined' ? WfDontesiAdatlap : { template: '<div class="alert alert-info">Döntési adatlap betöltése...</div>' },
        'wf-velemenyezes': typeof WfVelemenyezes !== 'undefined' ? WfVelemenyezes : { template: '<div class="alert alert-info">Véleményezés komponens betöltése...</div>' },
        'wf-kiadmanyozas': typeof WfKiadmanyozas !== 'undefined' ? WfKiadmanyozas : { template: '<div class="alert alert-info">Kiadmányozás komponens betöltése...</div>' },
        'wf-expedialas': typeof WfExpedialas !== 'undefined' ? WfExpedialas : { template: '<div class="alert alert-info">Expediálás komponens betöltése...</div>' },
        'wf-rugalmas-workflow': typeof WfRugalmasWorkflow !== 'undefined' ? WfRugalmasWorkflow : { template: '<div class="alert alert-info">Rugalmas workflow komponens betöltése...</div>' },
        'wf-lezaras': { template: '<div class="alert alert-info">Lezárás komponens betöltése...</div>' }
    }
};

// Vue alkalmazás létrehozása és mount
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Vue !== 'undefined') {
        const { createApp } = Vue;

        // App létrehozása
        const app = createApp(VahapMunkalapV3App);

        // Mount a DOM-ra
        app.mount('#app');
        console.log('VAHAP Munkalap v3 Vue alkalmazás elindítva');
    } else {
        console.error('Vue.js nem töltődött be!');
    }
});