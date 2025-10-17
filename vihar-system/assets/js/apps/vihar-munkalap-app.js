/**
 * VAHAP - Ügy Munkalap Főalkalmazás (TELJES VERZIÓ)
 * 3 oszlopos layout orchestrator
 * Vue 3 alkalmazás teljes demo adatokkal
 */

const VahapMunkalapApp = {
    data() {
        return {
            // UI állapotok
            leftCollapsed: false,
            rightCollapsed: false,
            activeTab: 'kerelem',
            showSugo: false,

            // Teljes példa ügy adatai - DEMO
            ugy: {
                // Alapadatok
                ugyazonosito: 'VAHAP-V-2024-001234',
                ugytipus: 'V-044',
                megnevezes: 'Vasúti járművezetők előzetes alkalmassági vizsgálata',
                statusz: 'folyamatban',
                benyujtasDatum: '2024-10-15',
                hatarido: '2024-11-25',
                eljaras_tipusa: 'Sommás (8 nap)',

                // Ügyfél adatok
                ugyfel: {
                    id: 'UF-2024-5678',
                    nev: 'Kovács János',
                    szuletesi_datum: '1985-03-15',
                    anya_neve: 'Nagy Mária',
                    lakcim: '1052 Budapest, Váci utca 12. 2/5',
                    telefon: '+36301234567',
                    email: 'kovacs.janos@example.hu'
                },

                // Ügyfél statisztika
                ugyfel_statisztika: {
                    korabbi_ugyek: 3,
                    jovahagyott: 3,
                    elutasitott: 0
                },

                // Kérelem adatok
                kerelem: {
                    benyujtas_datum: '2024-10-15 14:30',
                    benyujto_modja: 'Online (VAHAP rendszer)',
                    kerelemtipus: 'V-044 - Vasúti járművezető előzetes alkalmassági vizsgálat',
                    kerelem_adatok: {
                        vegzettseg: 'Vasúti járművezető',
                        kepzes_tipus: 'Alapképzés',
                        orvosi_alkalmas: true,
                        orvosi_ervenyesseg: '2026-01-15',
                        elozmenyek: 'Nincs korábbi vizsgálat',
                        megjegyzes: 'Első alkalom kérvényezem a vizsgálatot. A MÁV-START Zrt. javára kérem az engedély kiadását.'
                    }
                },

                // Dokumentumok
                dokumentumok: [
                    { id: 1, nev: 'Kérelem_adatlap.pdf', tipus: 'kerelem', datum: '2024-10-15', meret: '245 KB', funkcio: 'F-0107' },
                    { id: 2, nev: 'Szemelyi_igazolvany.pdf', tipus: 'melleklet', datum: '2024-10-15', meret: '1.2 MB' },
                    { id: 3, nev: 'Lakcimkartya.pdf', tipus: 'melleklet', datum: '2024-10-15', meret: '850 KB' },
                    { id: 4, nev: 'Orvosi_igazolas.pdf', tipus: 'melleklet', datum: '2024-10-15', meret: '420 KB' },
                    { id: 5, nev: 'Dijbekero.pdf', tipus: 'hatosagi', datum: '2024-10-16', meret: '180 KB', funkcio: 'F-0082' }
                ],

                // Workflow lépések állapota
                workflow_steps: {
                    kerelem: { status: 'completed', datum: '2024-10-15', ugyintezo: 'Dr. Szabó Péter' },
                    hatáskor: { status: 'completed', datum: '2024-10-16', ugyintezo: 'Dr. Szabó Péter', dontes: 'hatáskor_van' },
                    formai: { status: 'completed', datum: '2024-10-17', ugyintezo: 'Dr. Szabó Péter', dontes: 'megfelel' },
                    tartalmi: { status: 'completed', datum: '2024-10-18', ugyintezo: 'Dr. Szabó Péter', dontes: 'megfelel' },
                    vny024: { status: 'completed', datum: '2024-10-19', ugyintezo: 'Dr. Szabó Péter' },
                    sommas: { status: 'completed', datum: '2024-10-20', ugyintezo: 'Dr. Szabó Péter', dontes: 'sommas_8nap', hataridoDatum: '2024-11-05' },
                    'dontesi-javaslat': { status: 'in-progress', datum: '2024-10-21', ugyintezo: 'Dr. Szabó Péter' },
                    dokumentumok: { status: 'pending' },
                    velemenyezes: { status: 'pending' },
                    'vezetoi-dontes': { status: 'pending' },
                    lezaras: { status: 'pending' }
                },

                // Döntési előzmények
                dontesi_elozmenyek: [
                    { tab: 'hatáskor', decision: 'hatáskor_van', timestamp: '2024-10-16T10:30:00', funkcio: 'F-0064', uce: 'UCE-1793', ugyintezo: 'Dr. Szabó Péter' },
                    { tab: 'formai', decision: 'megfelel', timestamp: '2024-10-17T11:15:00', funkcio: 'F-0065', uce: 'UCE-1799', ugyintezo: 'Dr. Szabó Péter' },
                    { tab: 'tartalmi', decision: 'megfelel', timestamp: '2024-10-18T14:20:00', funkcio: 'F-0066', uce: 'UCE-1794', ugyintezo: 'Dr. Szabó Péter' },
                    { tab: 'sommas', decision: 'sommas_8nap', timestamp: '2024-10-20T09:45:00', funkcio: 'F-0088', uce: 'UCE-1800', hatarido_nap: 8, ugyintezo: 'Dr. Szabó Péter' }
                ],

                // Eljárás előzmények
                eljaras_elozmenyek: [
                    { datum: '2024-10-15 14:30', tipus: 'kerelem_beerkezett', leiras: 'Kérelem online benyújtása', szereplo: 'Kovács János (ügyfél)' },
                    { datum: '2024-10-15 15:00', tipus: 'ugy_erkeztetes', leiras: 'Ügy érkeztetése a rendszerben', szereplo: 'Rendszer (automatikus)', funkcio: 'F-0078' },
                    { datum: '2024-10-16 08:00', tipus: 'kiosztva', leiras: 'Ügy kiosztása ügyintézőnek', szereplo: 'Nagy Andrea (vezető)' },
                    { datum: '2024-10-16 10:30', tipus: 'hataskor_vizsgalat', leiras: 'Hatáskör vizsgálat befejezve - Hatáskör biztosított', szereplo: 'Dr. Szabó Péter (ügyintéző)', funkcio: 'F-0064' },
                    { datum: '2024-10-17 11:15', tipus: 'formai_ellenorzes', leiras: 'Formai ellenőrzés befejezve - Megfelel', szereplo: 'Dr. Szabó Péter (ügyintéző)', funkcio: 'F-0065' },
                    { datum: '2024-10-18 14:20', tipus: 'tartalmi_ellenorzes', leiras: 'Tartalmi ellenőrzés befejezve - Megfelel', szereplo: 'Dr. Szabó Péter (ügyintéző)', funkcio: 'F-0066' },
                    { datum: '2024-10-19 09:00', tipus: 'vny024_ellenorzes', leiras: 'VNY024 nyilvántartás adatok ellenőrizve', szereplo: 'Dr. Szabó Péter (ügyintéző)', funkcio: 'F-0090' },
                    { datum: '2024-10-20 09:45', tipus: 'sommas_dontes', leiras: 'Sommás eljárás alkalmazása döntés - 8 munkanap', szereplo: 'Dr. Szabó Péter (ügyintéző)', funkcio: 'F-0088' },
                    { datum: '2024-10-21 10:00', tipus: 'dontesi_javaslat_indul', leiras: 'Döntési javaslat elkészítésének megkezdése', szereplo: 'Dr. Szabó Péter (ügyintéző)' }
                ],

                // Mentett tab adatok
                hatáskor_data: {
                    checks: { 1: true, 2: true },
                    megjegyzesek: { 1: 'Hatáskör a 123/2023. (XII. 15.) Korm. rendelet alapján biztosított', 2: 'Területi illetékesség Budapest területére vonatkozóan rendben' },
                    altalanosMegjegyzes: 'Minden kritérium teljesült, az ügy tovább folytatható.',
                    dontes: 'hatáskor_van',
                    dontesDatum: '2024-10-16',
                    ellenorzoNeve: 'Dr. Szabó Péter'
                },
                formai_data: {
                    checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                    megjegyzesek: {},
                    altalanosMegjegyzes: 'Minden kötelező melléklet csatolva, formailag megfelelő.',
                    dontes: 'megfelel',
                    dontesDatum: '2024-10-17',
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    hianyossagok: []
                },
                tartalmi_data: {
                    checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                    megjegyzesek: { 1: 'Kérelmező 39 éves, megfelel', 3: 'VNY024 adatok ellenőrizve, rendben' },
                    altalanosMegjegyzes: 'Tartalmilag minden követelménynek megfelel, javasolt a sommás eljárás.',
                    dontes: 'megfelel',
                    dontesDatum: '2024-10-18',
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    tartalmi_hibak: []
                },
                sommas_data: {
                    selectedOption: 'sommas_8nap',
                    indoklas: 'A kérelem minden szempontból megfelel. Hatáskör, formai és tartalmi ellenőrzés során nem merült fel probléma. Tényállás tisztázására nincs szükség. Sommás eljárás alkalmazása indokolt.',
                    hataridoNap: 8,
                    hataridoDatum: '2024-11-05',
                    dontesDatum: '2024-10-20',
                    dontesIdopontja: '2024-10-20T09:45:00',
                    ellenorzoNeve: 'Dr. Szabó Péter',
                    elofeltetelekTeljesultek: true
                },

                // Döntési javaslat mentett adatai (példa - még nincs kitöltve)
                dontesi_javaslat_data: null,

                // Vezetői döntés mentett adatai (példa - még nincs kitöltve)
                vezetoi_dontes_data: null,

                // Lezárás adatok (példa - még nincs kitöltve)
                lezaras_data: null
            }
        };
    },
    computed: {
        middleColumnClasses() {
            return {
                'col-md-7': !this.leftCollapsed && !this.rightCollapsed,
                'col-md-9': this.leftCollapsed && !this.rightCollapsed
            };
        },
        middleColumnStyle() {
            if ((this.leftCollapsed && this.rightCollapsed) || (!this.leftCollapsed && this.rightCollapsed)) {
                return { flex: '1 1 auto' };
            }
            return {};
        }
    },

    created() {
        // URL paraméter lekérdezése
        const urlParams = new URLSearchParams(window.location.search);
        const ugyId = urlParams.get('ugy');

        console.log('[VAHAP] Munkalap betöltése, ügyazonosító:', ugyId);

        // Mock adatok betöltése (később API hívás lesz)
        this.loadUgyData(ugyId);
    },

    mounted() {
        console.log('[VAHAP] Munkalap alkalmazás betöltve');
        console.log('[VAHAP] Ügy:', this.ugy.ugyazonosito);
    },

    methods: {
        loadUgyData(ugyId) {
            // Mock adatok - később API hívás
            const mockUgyek = {
                // Ügy #1: Alap demo ügy (sommas döntésig elkészített)
                'VAHAP-V-2024-001234': this.ugy, // Használjuk a data()-ban definiált teljes példát

                // Ügy #2: Döntési javaslat szakaszban lévő ügy
                'VAHAP-V-2024-001235': {
                    ugyazonosito: 'VAHAP-V-2024-001235',
                    ugytipus: 'V-044',
                    megnevezes: 'Vasúti járművezetők előzetes alkalmassági vizsgálata',
                    statusz: 'folyamatban',
                    benyujtasDatum: '2024-10-10',
                    hatarido: '2024-10-30',
                    eljaras_tipusa: 'Sommás (8 nap)',

                    ugyfel: {
                        id: 'UF-2024-5679',
                        nev: 'Tóth Eszter',
                        szuletesi_datum: '1990-07-22',
                        anya_neve: 'Varga Anna',
                        lakcim: '1138 Budapest, Váci út 150.',
                        telefon: '+36302345678',
                        email: 'toth.eszter@example.hu'
                    },

                    ugyfel_statisztika: {
                        korabbi_ugyek: 1,
                        jovahagyott: 1,
                        elutasitott: 0
                    },

                    dokumentumok: [
                        { id: 1, nev: 'Kérelem_adatlap.pdf', tipus: 'kerelem', datum: '2024-10-10', meret: '230 KB', funkcio: 'F-0107' },
                        { id: 2, nev: 'Szemelyi_igazolvany.pdf', tipus: 'melleklet', datum: '2024-10-10', meret: '1.1 MB' },
                        { id: 3, nev: 'Orvosi_igazolas.pdf', tipus: 'melleklet', datum: '2024-10-10', meret: '380 KB' },
                        { id: 4, nev: 'Dijbekero.pdf', tipus: 'hatosagi', datum: '2024-10-11', meret: '175 KB', funkcio: 'F-0082' }
                    ],

                    workflow_steps: {
                        kerelem: { status: 'completed', datum: '2024-10-10', ugyintezo: 'Dr. Szabó Péter' },
                        hatáskor: { status: 'completed', datum: '2024-10-11', ugyintezo: 'Dr. Szabó Péter', dontes: 'hatáskor_van' },
                        formai: { status: 'completed', datum: '2024-10-12', ugyintezo: 'Dr. Szabó Péter', dontes: 'megfelel' },
                        tartalmi: { status: 'completed', datum: '2024-10-13', ugyintezo: 'Dr. Szabó Péter', dontes: 'megfelel' },
                        vny024: { status: 'completed', datum: '2024-10-14', ugyintezo: 'Dr. Szabó Péter' },
                        sommas: { status: 'completed', datum: '2024-10-15', ugyintezo: 'Dr. Szabó Péter', dontes: 'sommas_8nap', hataridoDatum: '2024-10-30' },
                        'dontesi-javaslat': { status: 'completed', datum: '2024-10-16', ugyintezo: 'Dr. Szabó Péter', dontesiTipus: 'alkalmasság_igazolas' },
                        'vezetoi-dontes': { status: 'in-progress', datum: '2024-10-17', vezeto: 'Dr. Nagy Andrea' },
                        dokumentumok: { status: 'pending' },
                        velemenyezes: { status: 'pending' },
                        lezaras: { status: 'pending' }
                    },

                    dontesi_elozmenyek: [
                        { tab: 'hatáskor', decision: 'hatáskor_van', timestamp: '2024-10-11T10:30:00', funkcio: 'F-0064', uce: 'UCE-1793', ugyintezo: 'Dr. Szabó Péter' },
                        { tab: 'formai', decision: 'megfelel', timestamp: '2024-10-12T11:15:00', funkcio: 'F-0065', uce: 'UCE-1799', ugyintezo: 'Dr. Szabó Péter' },
                        { tab: 'tartalmi', decision: 'megfelel', timestamp: '2024-10-13T14:20:00', funkcio: 'F-0066', uce: 'UCE-1794', ugyintezo: 'Dr. Szabó Péter' },
                        { tab: 'sommas', decision: 'sommas_8nap', timestamp: '2024-10-15T09:45:00', funkcio: 'F-0088', uce: 'UCE-1800', hatarido_nap: 8, ugyintezo: 'Dr. Szabó Péter' },
                        { tab: 'dontesi-javaslat', decision: 'alkalmasság_igazolas', timestamp: '2024-10-16T10:30:00', funkcio: 'F-0074', uce: 'UCE-1826', ugyintezo: 'Dr. Szabó Péter' }
                    ],

                    hatáskor_data: {
                        checks: { 1: true, 2: true },
                        megjegyzesek: { 1: 'Hatáskör rendben', 2: 'Illetékesség rendben' },
                        altalanosMegjegyzes: 'Minden kritérium teljesült.',
                        dontes: 'hatáskor_van',
                        dontesDatum: '2024-10-11',
                        ellenorzoNeve: 'Dr. Szabó Péter'
                    },

                    formai_data: {
                        checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                        megjegyzesek: {},
                        altalanosMegjegyzes: 'Formailag megfelelő.',
                        dontes: 'megfelel',
                        dontesDatum: '2024-10-12',
                        ellenorzoNeve: 'Dr. Szabó Péter',
                        hianyossagok: []
                    },

                    tartalmi_data: {
                        checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                        megjegyzesek: {},
                        altalanosMegjegyzes: 'Tartalmilag megfelel.',
                        dontes: 'megfelel',
                        dontesDatum: '2024-10-13',
                        ellenorzoNeve: 'Dr. Szabó Péter',
                        tartalmi_hibak: []
                    },

                    sommas_data: {
                        selectedOption: 'sommas_8nap',
                        indoklas: 'Minden ellenőrzés sikeres, sommás eljárás alkalmazható.',
                        hataridoNap: 8,
                        hataridoDatum: '2024-10-30',
                        dontesDatum: '2024-10-15',
                        dontesIdopontja: '2024-10-15T09:45:00',
                        ellenorzoNeve: 'Dr. Szabó Péter',
                        elofeltetelekTeljesultek: true
                    },

                    dontesi_javaslat_data: {
                        dontesiTipus: 'alkalmasság_igazolas',
                        jovahagyas: true,
                        indoklas: 'A kérelmező minden jogszabályi és szakmai követelménynek megfelel. Az orvosi alkalmasság igazolt, a szükséges végzettség és gyakorlat rendelkezésre áll. A VNY024 nyilvántartás ellenőrzése során nem merült fel kizáró ok. Javaslom az alkalmassági igazolás kiadását.',
                        jogszabaly: '- 2005. évi CLXXXIII. törvény a vasúti közlekedésről 43. § (1) bekezdés\n- 123/2023. (XII. 15.) Korm. rendelet 15. § (2) bekezdés\n- 5/2006. (II. 7.) GKM rendelet a vasúti járművezetők képzéséről',
                        feltetelek: [
                            'Éves vasútegészségügyi vizsgálat elvégzése',
                            'Képzés sikeres elvégzése utáni jelentési kötelezettség'
                        ],
                        ertesitendo_felek: ['ugyfel', 'mav', 'forrás'],
                        dokumentumSablon: {
                            tipus: 'alkalmasság_igazolas',
                            sablon_id: 'IGZ-001'
                        },
                        ellenorzoNeve: 'Dr. Szabó Péter',
                        dontesDatum: '2024-10-16',
                        dontesIdopontja: '2024-10-16T10:30:00'
                    },

                    vezetoi_dontes_data: null // Még nincs kitöltve
                },

                // Ügy #3: Teljes lezárt ügy (teljes workflow bemutatásához)
                'VAHAP-V-2024-001100': {
                    ugyazonosito: 'VAHAP-V-2024-001100',
                    ugytipus: 'V-044',
                    megnevezes: 'Vasúti járművezetők előzetes alkalmassági vizsgálata',
                    statusz: 'lezárt',
                    benyujtasDatum: '2024-09-20',
                    hatarido: '2024-10-10',
                    eljaras_tipusa: 'Sommás (8 nap)',
                    lezarasDatum: '2024-10-05',

                    ugyfel: {
                        id: 'UF-2024-4321',
                        nev: 'Nagy Gábor',
                        szuletesi_datum: '1988-11-08',
                        anya_neve: 'Kovács Ilona',
                        lakcim: '1094 Budapest, Ferenc körút 45. 3/12',
                        telefon: '+36203456789',
                        email: 'nagy.gabor@example.hu'
                    },

                    ugyfel_statisztika: {
                        korabbi_ugyek: 5,
                        jovahagyott: 5,
                        elutasitott: 0
                    },

                    dokumentumok: [
                        { id: 1, nev: 'Kérelem_adatlap.pdf', tipus: 'kerelem', datum: '2024-09-20', meret: '240 KB', funkcio: 'F-0107' },
                        { id: 2, nev: 'Szemelyi_igazolvany.pdf', tipus: 'melleklet', datum: '2024-09-20', meret: '1.3 MB' },
                        { id: 3, nev: 'Lakcimkartya.pdf', tipus: 'melleklet', datum: '2024-09-20', meret: '890 KB' },
                        { id: 4, nev: 'Orvosi_igazolas.pdf', tipus: 'melleklet', datum: '2024-09-20', meret: '410 KB' },
                        { id: 5, nev: 'Dijbekero.pdf', tipus: 'hatosagi', datum: '2024-09-21', meret: '185 KB', funkcio: 'F-0082' },
                        { id: 6, nev: 'Alkalmasság_igazolás.pdf', tipus: 'hatosagi', datum: '2024-10-05', meret: '520 KB', funkcio: 'F-0093' },
                        { id: 7, nev: 'Értesítés_ügyfél.pdf', tipus: 'hatosagi', datum: '2024-10-05', meret: '280 KB', funkcio: 'F-0089' }
                    ],

                    workflow_steps: {
                        kerelem: { status: 'completed', datum: '2024-09-20', ugyintezo: 'Dr. Horváth Judit' },
                        hatáskor: { status: 'completed', datum: '2024-09-23', ugyintezo: 'Dr. Horváth Judit', dontes: 'hatáskor_van' },
                        formai: { status: 'completed', datum: '2024-09-24', ugyintezo: 'Dr. Horváth Judit', dontes: 'megfelel' },
                        tartalmi: { status: 'completed', datum: '2024-09-25', ugyintezo: 'Dr. Horváth Judit', dontes: 'megfelel' },
                        vny024: { status: 'completed', datum: '2024-09-26', ugyintezo: 'Dr. Horváth Judit' },
                        sommas: { status: 'completed', datum: '2024-09-27', ugyintezo: 'Dr. Horváth Judit', dontes: 'sommas_8nap', hataridoDatum: '2024-10-10' },
                        'dontesi-javaslat': { status: 'completed', datum: '2024-09-30', ugyintezo: 'Dr. Horváth Judit', dontesiTipus: 'alkalmasság_igazolas' },
                        'vezetoi-dontes': { status: 'completed', datum: '2024-10-02', vezeto: 'Dr. Nagy Andrea', dontes: 'jovahagyas' },
                        dokumentumok: { status: 'completed', datum: '2024-10-03', ugyintezo: 'Dr. Horváth Judit' },
                        lezaras: { status: 'completed', datum: '2024-10-05', ugyintezo: 'Dr. Horváth Judit', lezaras_tipus: 'sikeres_lezaras' }
                    },

                    dontesi_elozmenyek: [
                        { tab: 'hatáskor', decision: 'hatáskor_van', timestamp: '2024-09-23T10:30:00', funkcio: 'F-0064', uce: 'UCE-1793', ugyintezo: 'Dr. Horváth Judit' },
                        { tab: 'formai', decision: 'megfelel', timestamp: '2024-09-24T11:15:00', funkcio: 'F-0065', uce: 'UCE-1799', ugyintezo: 'Dr. Horváth Judit' },
                        { tab: 'tartalmi', decision: 'megfelel', timestamp: '2024-09-25T14:20:00', funkcio: 'F-0066', uce: 'UCE-1794', ugyintezo: 'Dr. Horváth Judit' },
                        { tab: 'sommas', decision: 'sommas_8nap', timestamp: '2024-09-27T09:45:00', funkcio: 'F-0088', uce: 'UCE-1800', hatarido_nap: 8, ugyintezo: 'Dr. Horváth Judit' },
                        { tab: 'dontesi-javaslat', decision: 'alkalmasság_igazolas', timestamp: '2024-09-30T10:30:00', funkcio: 'F-0074', uce: 'UCE-1826', ugyintezo: 'Dr. Horváth Judit' },
                        { tab: 'vezetoi-dontes', decision: 'jovahagyas', timestamp: '2024-10-02T14:15:00', funkcio: 'F-0099', uce: 'UCE-1828', vezeto: 'Dr. Nagy Andrea' },
                        { tab: 'lezaras', decision: 'sikeres_lezaras', timestamp: '2024-10-05T09:00:00', funkcio: 'F-0097', uce: 'UCE-1828', ugyintezo: 'Dr. Horváth Judit' }
                    ],

                    eljaras_elozmenyek: [
                        { datum: '2024-09-20 09:15', tipus: 'kerelem_beerkezett', leiras: 'Kérelem online benyújtása', szereplo: 'Nagy Gábor (ügyfél)' },
                        { datum: '2024-09-20 09:30', tipus: 'ugy_erkeztetes', leiras: 'Ügy érkeztetése a rendszerben', szereplo: 'Rendszer (automatikus)', funkcio: 'F-0078' },
                        { datum: '2024-09-20 10:00', tipus: 'kiosztva', leiras: 'Ügy kiosztása ügyintézőnek', szereplo: 'Dr. Nagy Andrea (vezető)' },
                        { datum: '2024-09-23 10:30', tipus: 'hataskor_vizsgalat', leiras: 'Hatáskör vizsgálat befejezve - Hatáskör biztosított', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0064' },
                        { datum: '2024-09-24 11:15', tipus: 'formai_ellenorzes', leiras: 'Formai ellenőrzés befejezve - Megfelel', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0065' },
                        { datum: '2024-09-25 14:20', tipus: 'tartalmi_ellenorzes', leiras: 'Tartalmi ellenőrzés befejezve - Megfelel', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0066' },
                        { datum: '2024-09-26 09:00', tipus: 'vny024_ellenorzes', leiras: 'VNY024 nyilvántartás adatok ellenőrizve', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0090' },
                        { datum: '2024-09-27 09:45', tipus: 'sommas_dontes', leiras: 'Sommás eljárás alkalmazása döntés - 8 munkanap', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0088' },
                        { datum: '2024-09-30 10:30', tipus: 'dontesi_javaslat_kesz', leiras: 'Döntési javaslat elkészítve - Alkalmassági igazolás kiadása', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0074' },
                        { datum: '2024-09-30 15:00', tipus: 'vezetoi_dontes_benyujtva', leiras: 'Döntési javaslat vezetőhöz benyújtva jóváhagyásra', szereplo: 'Dr. Horváth Judit (ügyintéző)' },
                        { datum: '2024-10-02 14:15', tipus: 'vezetoi_dontes', leiras: 'Vezetői döntés: Jóváhagyva', szereplo: 'Dr. Nagy Andrea (osztályvezető)', funkcio: 'F-0099' },
                        { datum: '2024-10-03 10:00', tipus: 'dokumentum_kiadva', leiras: 'Alkalmassági igazolás dokumentum elkészítve', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0093' },
                        { datum: '2024-10-03 10:30', tipus: 'ertesites_kuldve', leiras: 'Értesítés kiküldve az ügyfél részére', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0089' },
                        { datum: '2024-10-03 11:00', tipus: 'vny024_frissitve', leiras: 'VNY024 nyilvántartás frissítve', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0090' },
                        { datum: '2024-10-03 11:15', tipus: 'forras_frissitve', leiras: 'FORRÁS rendszer frissítve', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0098' },
                        { datum: '2024-10-05 09:00', tipus: 'ugy_lezarva', leiras: 'Ügy sikeresen lezárva', szereplo: 'Dr. Horváth Judit (ügyintéző)', funkcio: 'F-0097' }
                    ],

                    hatáskor_data: {
                        checks: { 1: true, 2: true },
                        megjegyzesek: { 1: 'Hatáskör biztosított a 123/2023. Korm. rendelet alapján', 2: 'Területi illetékesség Budapest területére rendben' },
                        altalanosMegjegyzes: 'Minden kritérium teljesült, az ügy folytatható.',
                        dontes: 'hatáskor_van',
                        dontesDatum: '2024-09-23',
                        ellenorzoNeve: 'Dr. Horváth Judit'
                    },

                    formai_data: {
                        checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                        megjegyzesek: {},
                        altalanosMegjegyzes: 'Formailag minden melléklet rendben, megfelelő.',
                        dontes: 'megfelel',
                        dontesDatum: '2024-09-24',
                        ellenorzoNeve: 'Dr. Horváth Judit',
                        hianyossagok: []
                    },

                    tartalmi_data: {
                        checks: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
                        megjegyzesek: { 1: 'Kérelmező 36 éves, megfelel', 3: 'VNY024 adatok ellenőrizve, rendben' },
                        altalanosMegjegyzes: 'Tartalmilag minden követelménynek megfelel, sommás eljárás javasolt.',
                        dontes: 'megfelel',
                        dontesDatum: '2024-09-25',
                        ellenorzoNeve: 'Dr. Horváth Judit',
                        tartalmi_hibak: []
                    },

                    sommas_data: {
                        selectedOption: 'sommas_8nap',
                        indoklas: 'A kérelem minden szempontból megfelel. Hatáskör, formai és tartalmi ellenőrzés során nem merült fel probléma. Tényállás tisztázására nincs szükség. Sommás eljárás alkalmazása indokolt, 8 munkanapban elbírálható.',
                        hataridoNap: 8,
                        hataridoDatum: '2024-10-10',
                        dontesDatum: '2024-09-27',
                        dontesIdopontja: '2024-09-27T09:45:00',
                        ellenorzoNeve: 'Dr. Horváth Judit',
                        elofeltetelekTeljesultek: true
                    },

                    dontesi_javaslat_data: {
                        dontesiTipus: 'alkalmasság_igazolas',
                        jovahagyas: true,
                        indoklas: 'A kérelmező Nagy Gábor (szül.: 1988.11.08.) előzetes alkalmassági vizsgálat iránti kérelme alapján elvégzett hatásköri, formai és tartalmi vizsgálatok során megállapítottam, hogy a kérelmező megfelel a vasúti járművezetők alkalmassági követelményeinek. Az orvosi alkalmasság igazolt, 2026. január 15-ig érvényes. A VNY024 nyilvántartás ellenőrzése során kizáró ok nem merült fel. A kérelmező korábbi 5 alkalommal is sikeresen teljesítette az alkalmassági követelményeket. Javaslom az alkalmassági igazolás kiadását, feltételekkel (éves orvosi kontroll, jelentési kötelezettség).',
                        jogszabaly: '- 2005. évi CLXXXIII. törvény a vasúti közlekedésről 43. § (1) bekezdés\n- 123/2023. (XII. 15.) Korm. rendelet a vasúti járművezetők alkalmassági követelményeiről 8. §\n- 5/2006. (II. 7.) GKM rendelet a vasúti járművezetők képzéséről 12. § (3) bekezdés',
                        feltetelek: [
                            'Éves vasútegészségügyi vizsgálat elvégzése és eredményének 30 napon belüli bejelentése',
                            'Képzés sikeres elvégzése utáni jelentési kötelezettség teljesítése',
                            'Egészségi állapotban bekövetkező változás azonnali bejelentése'
                        ],
                        ertesitendo_felek: ['ugyfel', 'mav', 'nkh', 'forrás'],
                        dokumentumSablon: {
                            tipus: 'alkalmasság_igazolas',
                            sablon_id: 'IGZ-001',
                            sablon_nev: 'Alkalmassági igazolás sablon (V-044)'
                        },
                        ellenorzoNeve: 'Dr. Horváth Judit',
                        dontesDatum: '2024-09-30',
                        dontesIdopontja: '2024-09-30T10:30:00'
                    },

                    vezetoi_dontes_data: {
                        dontesiTipus: 'jovahagyas',
                        indoklas: 'A döntési javaslat minden szempontból megalapozott, jogszabályokkal alátámasztott. A kérelmező múltbeli teljesítménye kifogástalan. Jóváhagyom az alkalmassági igazolás kiadását.',
                        modositasok: [],
                        dontesDatum: '2024-10-02',
                        dontesIdopontja: '2024-10-02T14:15:00',
                        vezetoAdatok: {
                            nev: 'Dr. Nagy Andrea',
                            beosztas: 'Vasúti Hatósági Főosztály vezetője'
                        }
                    },

                    lezaras_data: {
                        lezarasTipus: 'sikeres_lezaras',
                        osszegzo_megjegyzes: 'Az ügy sikeresen lezárásra került. Minden szükséges lépés megtörtént: dokumentumok kiadva, értesítések kiküldve, nyilvántartások frissítve. Az alkalmassági igazolás kiadásra került Nagy Gábor részére.',
                        lezarasFeladatok: {
                            dokumentumok_kiadva: { checked: true, datum: '2024-10-03', megjegyzes: 'Alkalmassági igazolás kiállítva és kiadva' },
                            ertesitesek_kikuldve: { checked: true, datum: '2024-10-03', megjegyzes: 'Értesítés kiküldve ügyfél, MÁV, NKH, FORRÁS részére' },
                            vny024_frissitve: { checked: true, datum: '2024-10-03', megjegyzes: 'VNY024 nyilvántartás frissítve az alkalmassági adatokkal' },
                            forras_frissitve: { checked: true, datum: '2024-10-03', megjegyzes: 'FORRÁS rendszer frissítve' },
                            ekeidr_lezaras: { checked: true, datum: '2024-10-05', megjegyzes: 'EKEIDR rendszerben lezárva' },
                            archivalas: { checked: true, datum: '2024-10-05', megjegyzes: 'Iratok archiválásra előkészítve' }
                        },
                        lezarasDatum: '2024-10-05',
                        lezarasIdopontja: '2024-10-05T09:00:00',
                        lezaro_ugyintezo: 'Dr. Horváth Judit',
                        atfutasi_ido_munkanapok: 11 // 2024-09-20 - 2024-10-05 között 11 munkanap
                    }
                }
            };

            // Ügy betöltése
            if (ugyId && mockUgyek[ugyId]) {
                this.ugy = mockUgyek[ugyId];
                console.log('[VAHAP] Ügy adatok betöltve:', this.ugy.ugyazonosito);
            } else {
                // Default ügy ha nincs URL paraméter vagy nem található
                this.ugy = mockUgyek['VAHAP-V-2024-001234'];
                console.warn('[VAHAP] Nincs érvényes ügyazonosító, alapértelmezett ügy betöltve:', ugyId || 'N/A');
            }
        },

        selectTab(tabName) {
            this.activeTab = tabName;
            console.log('[VAHAP] Tab selected:', tabName);
        },

        handleDecision(decision) {
            console.log('[VAHAP] Döntés:', decision);
            alert(`Döntés rögzítve: ${decision.tab} - ${decision.decision}`);
        },

        handleDownload(dok) {
            console.log('[VAHAP] Dokumentum letöltés:', dok);
        },

        handleUpload() {
            console.log('[VAHAP] Dokumentum feltöltés');
        }
    }
};
