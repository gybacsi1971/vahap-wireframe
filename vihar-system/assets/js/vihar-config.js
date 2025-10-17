/**
 * VAHAP - Központi Konfiguráció
 *
 * Rendszer szintű konstansok, konfigurációk és beállítások
 */

const VahapConfig = {
    /**
     * Rendszer verzió
     */
    version: '1.0.0',
    environment: 'development', // development, staging, production

    /**
     * Alapvető beállítások
     */
    settings: {
        appName: 'VAHAP',
        appFullName: 'Vasúti és Hajózási Átfogó Platform',
        organization: 'Építési és Közlekedési Minisztérium',
        locale: 'hu-HU',
        currency: 'Ft',
        dateFormat: 'YYYY.MM.DD',
        timeFormat: 'HH:mm'
    },

    /**
     * API végpontok (mock környezetben)
     */
    api: {
        baseUrl: '/api/v1',
        timeout: 30000,
        endpoints: {
            // Kérelem műveletek
            submitApplication: '/application/submit',
            getApplication: '/application/:id',
            updateApplication: '/application/:id',

            // Döntések
            saveDecision: '/decision/save',
            getDecisions: '/decision/:caseId',

            // Dokumentumok
            uploadDocument: '/document/upload',
            getDocument: '/document/:id',

            // Nyilvántartások
            vny024: '/registry/vny024',
            hny501: '/registry/hny501',

            // EKEIDR interfész
            ekeidr: {
                register: '/ekeidr/register',
                file: '/ekeidr/file',
                send: '/ekeidr/send'
            }
        }
    },

    /**
     * Modul konfigurációk
     */
    modules: {
        vasut: {
            code: 'V-044',
            name: 'Vasúti Modul',
            fullName: 'Vasúti járművezetők előzetes alkalmassági vizsgálata',
            department: 'Vasúti Hatósági Főosztály',
            departmentCode: 'VHF',
            color: '#8B4513',
            icon: 'bi-train-front',

            // Határidők (napokban)
            deadlines: {
                sommas: 8,
                teljes: 60,
                hianypotlas: 15,
                vezetoiDontes: 5,
                tenyallasTisztazas: 30
            },

            // Díjak
            fees: {
                eljarasi: 15000,
                alapdij: 10000,
                potdij: 5000
            }
        },

        hajozas: {
            code: 'H-052',
            name: 'Hajózási Modul',
            fullName: 'Országos közforgalmú kikötő létesítésének engedélyezése',
            department: 'Hajózási Hatósági Főosztály',
            departmentCode: 'HHF',
            color: '#006994',
            icon: 'bi-water',

            // Határidők (napokban)
            deadlines: {
                sommas: 8,
                teljes: 60,
                hianypotlas: 15,
                szakhatosagi: 30,
                vezetoiDontes: 5,
                tenyallasTisztazas: 30,
                letesitesiEngedelyErvenyesseg: 730 // 2 év
            },

            // Díjak
            fees: {
                orszagosKozforgalmu: 250000,
                hatarkikoto: 200000,
                egyebLetesitmeny: 150000
            }
        }
    },

    /**
     * Funkciókódok mapping
     */
    functions: {
        // Közös funkciók
        common: {
            'F-0064': 'Hatáskör és illetékesség vizsgálat',
            'F-0065': 'Formai megfelelőség vizsgálata',
            'F-0066': 'Tartalmi megfelelőség vizsgálat',
            'F-0069': 'Kérelem kitöltése',
            'F-0070': 'Díjkalkulátor',
            'F-0074': 'Érdemi döntés: döntési javaslat',
            'F-0078': 'VAHAP érkeztetés',
            'F-0079': 'VAHAP bejövő iktatás',
            'F-0080': 'VAHAP kimenő és belső iktatás',
            'F-0081': 'Bejövő EKEIDR iktatási adatok lekérése',
            'F-0082': 'Díjbekérő előállítása',
            'F-0083': 'Online díjfizetés interfész',
            'F-0084': 'Kérelem mellékletek',
            'F-0085': 'Kérelem véglegesítése',
            'F-0086': 'PDF kérelem generálás',
            'F-0087': 'Kérelem benyújtása',
            'F-0088': 'Döntés-előkészítés döntés',
            'F-0089': 'Döntés-előkészítés: ügyfél értesítés',
            'F-0091': 'Végzés tervezet elkészítése',
            'F-0092': 'Határozat tervezet elkészítése',
            'F-0093': 'Igazolás tervezet elkészítése',
            'F-0094': 'Tájékoztatás tervezet elkészítése',
            'F-0095': 'Hirdetmény tervezet elkészítése',
            'F-0096': 'Döntési javaslat véleményezés',
            'F-0097': 'Ügy lezárása',
            'F-0098': 'FORRÁS SQL interfész',
            'F-0099': 'Érdemi döntés: vezetői döntés',
            'F-0100': 'Hiánypótlási felszólítás összeállítása',
            'F-0101': 'Hiánypótlás benyújtása',
            'F-0102': 'Tényállás tisztázása: Rugalmas workflow',
            'F-0104': 'Tényállás tisztázás benyújtása',
            'F-0107': 'Kérelem adatlap'
        },

        // Vasút specifikus
        vasut: {
            'F-0090': 'VNY024 Vasútegészségügyi adatok'
        },

        // Hajózás specifikus
        hajozas: {
            'F-0106': 'HNY501 Hajózási Létesítmények'
        }
    },

    /**
     * Use Case kódok mapping
     */
    useCases: {
        // Vasúti modul
        vasut: {
            'UC-0301': 'Kérelem benyújtása VAHAP rendszeren keresztül',
            'UC-0302': 'Érkeztetés',
            'UC-0303': 'Kérelem formai és tartalmi vizsgálata',
            'UC-0304': 'Döntéshozatal',
            'UC-0306': 'Tényállás tisztázása',
            'UC-0307': 'Hiánypótlás',

            'UCE-1761': 'Kérelem adatrögzítés megkezdése',
            'UCE-1762': 'Eljárási díj fizetése szükséges?',
            'UCE-1763': 'Díjfizetés meghatározása',
            'UCE-1771': 'Kérelem benyújtása',
            'UCE-1772': 'Mellékletek csatolása',
            'UCE-1773': 'Kérelem adatainak kitöltése',
            'UCE-1776': 'Kérelem véglegesítése',
            'UCE-1793': 'Hatáskör és illetékesség vizsgálata',
            'UCE-1794': 'Tartalmi megfelelőség vizsgálata',
            'UCE-1799': 'Formai megfelelőség vizsgálata',
            'UCE-1800': 'Sommás eljárás alkalmazható?',
            'UCE-1809': 'Végzés tervezet',
            'UCE-1810': 'Határozat tervezet',
            'UCE-1811': 'Igazolás tervezet',
            'UCE-1824': 'Döntési javaslat véleményeztetése',
            'UCE-1826': 'Döntési javaslat elkészítése',
            'UCE-1828': 'Ügy lezárása'
        },

        // Hajózási modul
        hajozas: {
            'UC-HAJ-0301': 'Kérelem benyújtása VAHAP rendszeren keresztül',
            'UC-HAJ-0302': 'Érkeztetés',
            'UC-HAJ-0303': 'Kérelem formai és tartalmi vizsgálata',
            'UC-HAJ-0304': 'Döntéshozatal',
            'UC-HAJ-0305': 'Kimenő/belső dokumentumok iktatása',
            'UC-HAJ-0306': 'Tényállás tisztázása',
            'UC-HAJ-0307': 'Hiánypótlás',

            'UCE-1955': 'Kérelem adatrögzítés megkezdése',
            'UCE-1956': 'Eljárási díj fizetése szükséges?',
            'UCE-1957': 'Díjfizetés meghatározása',
            'UCE-1965': 'Kérelem benyújtása',
            'UCE-1966': 'Mellékletek csatolása',
            'UCE-1967': 'Kérelem adatainak kitöltése',
            'UCE-1970': 'Kérelem véglegesítése',
            'UCE-1987': 'Hatáskör és illetékesség vizsgálata',
            'UCE-1988': 'Tartalmi megfelelőség vizsgálata',
            'UCE-1993': 'Formai megfelelőség vizsgálata',
            'UCE-1994': 'Sommás eljárás alkalmazható?',
            'UCE-2003': 'Végzés tervezet',
            'UCE-2004': 'Határozat tervezet',
            'UCE-2005': 'Igazolás tervezet',
            'UCE-2018': 'Döntési javaslat véleményeztetése',
            'UCE-2020': 'Döntési javaslat elkészítése',
            'UCE-2022': 'Ügy lezárása',
            'UCE-2023': 'Nyilvántartás frissítése',
            'UCE-2045': 'Szakhatósági állásfoglalás',
            'UCE-2047': 'Tanú meghallgatás',
            'UCE-2050': 'Egyedi eljárási cselekmény',
            'UCE-2051': 'Szemle lefolytatás',
            'UCE-2052': 'Ügyfél nyilatkozattétel',
            'UCE-2053': 'Szakértői vélemény',
            'UCE-2054': 'Megkeresés',
            'UCE-2055': 'Irat bemutatás',
            'UCE-2056': 'Tárgyalás összehívás',
            'UCE-2063': 'Hiánypótlás benyújtása',
            'UCE-2068': 'Hiánypótlás teljesítés vizsgálata',
            'UCE-2071': 'Hiánypótlási felszólítás összeállítása'
        }
    },

    /**
     * Státuszok
     */
    statuses: {
        new: 'Beérkezett',
        registered: 'Érkeztetett',
        pending: 'Folyamatban',
        supplement: 'Hiánypótlásra vár',
        investigation: 'Tényállás tisztázás alatt',
        decision: 'Döntésre vár',
        issued: 'Kiadmányozva',
        closed: 'Lezárt',
        suspended: 'Felfüggesztett',
        withdrawn: 'Visszavont',
        rejected: 'Elutasítva',
        approved: 'Jóváhagyva'
    },

    /**
     * Szerepkörök
     */
    roles: {
        external: {
            UGYFEL: 'Ügyfél, Képviselő',
            TARSHATOSAG: 'Társhatóság',
            KULSO_KOZREMUKODO: 'Külső Közreműködő'
        },
        internal: {
            VHF_UGYINTEZO: 'VHF Ügyintéző',
            VHF_DONTESHOZO: 'VHF Döntéshozó',
            HHF_UGYINTEZO: 'HHF Ügyintéző',
            HHF_DONTESHOZO: 'HHF Döntéshozó',
            BELSO_KOZREMUKODO: 'Belső Közreműködő'
        }
    },

    /**
     * Dokumentum típusok
     */
    documentTypes: {
        incoming: {
            'DC-0039': 'Kérelem adatlap vasútegészségügyi vizsgálathoz',
            'DC-0041': 'Hiánypótlás',
            'DC-0038': 'Díjfizetési igazolás'
        },
        outgoing: {
            'DC-0040': 'Hiánypótlási felszólítás',
            'DC-0044': 'Ügyfél értesítés sommás eljárásról',
            'DC-0045': 'Ügyfél értesítés teljes eljárásról',
            'DC-0046': 'Érdemi döntés: Igazolás',
            vegzes: 'Végzés',
            határozat: 'Határozat',
            igazolas: 'Igazolás',
            tajekoztatas: 'Tájékoztatás',
            hirdetmeny: 'Hirdetmény'
        }
    },

    /**
     * Validációs szabályok
     */
    validation: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Érvénytelen email cím formátum'
        },
        phone: {
            pattern: /^(\+36|06)[0-9]{9}$/,
            message: 'Érvénytelen telefonszám formátum (+36301234567)'
        },
        postalCode: {
            pattern: /^[0-9]{4}$/,
            message: 'Érvénytelen irányítószám (4 számjegy)'
        },
        companyReg: {
            pattern: /^[0-9]{2}-[0-9]{2}-[0-9]{6}$/,
            message: 'Érvénytelen cégjegyzékszám (01-09-123456)'
        },
        taxNumber: {
            pattern: /^[0-9]{8}-[0-9]-[0-9]{2}$/,
            message: 'Érvénytelen adószám (12345678-1-23)'
        }
    },

    /**
     * UI beállítások
     */
    ui: {
        // Táblázat alapértelmezett beállítások
        table: {
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100]
        },

        // Toast értesítések
        toast: {
            duration: 3000,
            position: 'top-right'
        },

        // Loading
        loading: {
            delay: 200,
            message: 'Betöltés...'
        },

        // Modális ablakok
        modal: {
            backdrop: true,
            keyboard: true
        }
    },

    /**
     * Feature flags (funkciókapcsolók)
     */
    features: {
        enablePdfGeneration: false,
        enableFileUpload: false,
        enableRealTimeNotifications: false,
        enableOfflineMode: false,
        enableAdvancedSearch: true,
        enableBulkOperations: false,
        enableAuditLog: true
    },

    /**
     * Debug beállítások
     */
    debug: {
        enabled: true,
        logLevel: 'info', // error, warn, info, debug
        showFunctionCodes: true,
        showUseCaseCodes: true,
        mockApiDelay: 1000
    },

    /**
     * Helper funkciók
     */
    helpers: {
        // Modul konfiguráció lekérése
        getModuleConfig(moduleType) {
            return this.modules[moduleType] || null;
        },

        // Funkció név lekérése kód alapján
        getFunctionName(code, moduleType = null) {
            if (moduleType && this.functions[moduleType] && this.functions[moduleType][code]) {
                return this.functions[moduleType][code];
            }
            return this.functions.common[code] || code;
        },

        // Use case név lekérése
        getUseCaseName(code, moduleType) {
            if (this.useCases[moduleType]) {
                return this.useCases[moduleType][code] || code;
            }
            return code;
        },

        // Státusz név lekérése
        getStatusName(statusCode) {
            return this.statuses[statusCode] || statusCode;
        },

        // Szerepkör név lekérése
        getRoleName(roleCode) {
            return this.roles.internal[roleCode] || this.roles.external[roleCode] || roleCode;
        },

        // API endpoint lekérése
        getApiEndpoint(name, params = {}) {
            let endpoint = this.api.endpoints[name];
            if (!endpoint) return null;

            // Paraméterek behelyettesítése
            Object.keys(params).forEach(key => {
                endpoint = endpoint.replace(`:${key}`, params[key]);
            });

            return this.api.baseUrl + endpoint;
        }
    }
};

// Globális elérhetővé tétel
if (typeof window !== 'undefined') {
    window.VahapConfig = VahapConfig;

    // Debug mode logolás
    if (VahapConfig.debug.enabled) {
        console.log('[VAHAP] Konfiguráció betöltve', VahapConfig);
    }
}
