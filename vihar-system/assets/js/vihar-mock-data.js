/**
 * VAHAP - Mock Adatok Központi Tárhelye
 *
 * Újrafelhasználható tesztadatok modulonként és funkciónként
 */

const VahapMockData = {
    /**
     * Vasúti Modul Mock Adatok
     */
    vasut: {
        // F-0069 - Kérelem adatlap űrlap mezői (példaadatok)
        kerelomAdatlapPelda: {
            // Személyes adatok
            vezeteknev: "Kovács",
            keresztnev: "János",
            szuletesiNev: "Kovács János",
            szuletesiHely: "Budapest",
            szuletesiDatum: "1985-03-15",
            anyaNeve: "Nagy Mária",
            allampolgarsag: "magyar",

            // Elérhetőség
            lakcim: {
                iranyitoszam: "1052",
                telepules: "Budapest",
                kozterulet: "Váci utca",
                hazszam: "12",
                emelet: "2",
                ajto: "5"
            },
            ertesitesiCim: null,
            telefonszam: "+36301234567",
            email: "kovacs.janos@example.hu",

            // Vasúti specifikus adatok
            vizsgalatTipusa: "elozetes",
            jelenlegi_minosites: "",
            korabbi_vizsgalat_datuma: "",
            munkaltato: "MÁV-START Zrt.",
            jarmuvezetoi_kategoriak: ["A", "B"],

            // Egészségügyi
            kezelo_orvos_neve: "Dr. Szabó Péter",
            veszelyhelyzet_kapcsolattarto: "Nagy Anna",
            veszelyhelyzet_telefon: "+36309876543"
        },
        // Munkalista - Külső rendszer (Ügyfél ügyek)
        ugyek_kulso: [
            {
                ugyazonosito: "VAHAP-V-2024-001234",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "folyamatban",
                statuszClass: "pending",
                benyujtasDatum: "2024-10-15",
                hatarido: "2024-11-15",
                ugyfel: "Kovács János",
                ugyfelMuvelet: null, // Nincs teendő
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-000987",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "hiánypótlás",
                statuszClass: "warning",
                benyujtasDatum: "2024-10-01",
                hatarido: "2024-10-25",
                ugyfel: "Kovács János",
                ugyfelMuvelet: "hianypotlas", // F-0101 - Hiánypótlás szükséges
                hianypotlasHatarido: "2024-11-05",
                dokumentumok: [
                    { nev: "Hiánypótlási felszólítás", tipus: "pdf", letoltheto: true },
                    { nev: "Eredeti kérelem", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-000654",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "jóváhagyva",
                statuszClass: "approved",
                benyujtasDatum: "2024-09-15",
                hatarido: "2024-10-15",
                dontesDatum: "2024-10-10",
                ugyfel: "Kovács János",
                ugyfelMuvelet: null,
                dokumentumok: [
                    { nev: "Határozat", tipus: "pdf", letoltheto: true },
                    { nev: "Alkalmassági igazolás", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-000321",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "tényállás tisztázás",
                statuszClass: "info",
                benyujtasDatum: "2024-09-20",
                hatarido: "2024-10-30",
                ugyfel: "Kovács János",
                ugyfelMuvelet: "tenyallas_tisztazas", // F-0104 - Tényállás tisztázás
                tenyallasHatarido: "2024-10-28",
                dokumentumok: [
                    { nev: "Tényállás tisztázás felhívás", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-000198",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "elutasítva",
                statuszClass: "rejected",
                benyujtasDatum: "2024-08-10",
                hatarido: "2024-09-10",
                dontesDatum: "2024-09-08",
                ugyfel: "Kovács János",
                ugyfelMuvelet: null,
                dokumentumok: [
                    { nev: "Elutasító határozat", tipus: "pdf", letoltheto: true },
                    { nev: "Indoklás", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            }
        ],

        // Munkalista - Belső rendszer (Ügyintézői ügyek)
        ugyek_belso: [
            {
                ugyazonosito: "VAHAP-V-2024-001234",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",

                // Státusz és workflow
                statusz: "formai_ellenorzes",
                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-10-15" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-10-16" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "folyamatban", datum_kezdes: "2024-10-17" },
                    tartalmi_vizsgalat: { uce: "UCE-1794", allapot: "varakozik" }
                },

                // Határidők
                benyujtas_datum: "2024-10-15",
                hatarido_tipus: "teljes_eljaras",
                hatarido: "2024-12-14", // 60 nap
                hatralevo_napok: 58,

                // Ügyfél adatok
                ugyfel: {
                    nev: "Kovács János",
                    szuletesi_datum: "1985-03-15",
                    lakcim: "1052 Budapest, Váci utca 12.",
                    telefon: "+36301234567",
                    email: "kovacs.janos@example.hu"
                },

                // Ügyintéző
                ugyintezo: {
                    nev: "Dr. Szabó Péter",
                    azonosito: "EKM001",
                    szerepkor: "VHF_UGYINTEZO"
                },

                // Ellenőrzések állapota
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel", megjegyzes: "Hatáskör biztosított", F_kod: "F-0064" },
                    formai: { eredmeny: null, hianyossagok: [], F_kod: "F-0065" },
                    tartalmi: { eredmeny: null, hianyossagok: [], F_kod: "F-0066" }
                },

                // VNY024 adatok
                vny024_adatok: {
                    van_adat: true,
                    utolso_vizsgalat: "2023-05-10",
                    alkalmassag: "alkalmas",
                    ervenyesseg: "2025-05-10"
                },

                // Dokumentumok
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-10-15" },
                    { nev: "Személyi igazolvány", tipus: "pdf", datum: "2024-10-15" },
                    { nev: "Lakcímkártya", tipus: "pdf", datum: "2024-10-15" }
                ]
            },

            {
                ugyazonosito: "VAHAP-V-2024-000987",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "hianypotlas_varasa",
                statuszClass: "warning",

                // ⭐ TÖBBKÖRÖS HIÁNYPÓTLÁS PÉLDA
                hianypotlas_korok: [
                    {
                        kor: 1,
                        UCE_kod: "UCE-1871",
                        F_kod: "F-0100",
                        kikuldve: "2024-10-04",
                        hatarido: "2024-10-19",
                        hianyossagok: [
                            "Vasútegészségügyi igazolás hiányzik",
                            "Korábbi munkahelyek listája hiányos"
                        ],
                        benyujtva: "2024-10-18",
                        UCE_benyujtas: "UCE-1878",
                        F_benyujtas: "F-0101",
                        ellenorzes_eredmeny: "reszben_teljesitett", // UCE-1880
                        ellenorzes_datum: "2024-10-19",
                        megjegyzes: "VEÜ igazolás megérkezett, de munkahelyek listája továbbra is hiányos"
                    },
                    {
                        kor: 2,
                        UCE_kod: "UCE-1871",
                        F_kod: "F-0100",
                        kikuldve: "2024-10-20",
                        hatarido: "2024-11-03",
                        hianyossagok: [
                            "Korábbi munkahelyek listája továbbra is hiányos - pontosítás szükséges",
                            "Munkaviszony igazolások csatolása szükséges"
                        ],
                        benyujtva: null, // még várakozik
                        ellenorzes_eredmeny: null,
                        aktiv: true
                    }
                ],
                hianypotlas_aktualis_kor: 2, // UCE-1882: Jelenleg a 2. kör folyamatban

                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-10-01" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-10-02" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "kész", dontes: "hianypotlas_szukseges", datum: "2024-10-03" },
                    hianypotlas_1_kor: { uce: "UCE-1871", allapot: "teljesitett_reszben", datum: "2024-10-04", hatarido: "2024-10-19" },
                    hianypotlas_2_kor: { uce: "UCE-1871", allapot: "kikuldve", datum: "2024-10-20", hatarido: "2024-11-03" }
                },
                benyujtas_datum: "2024-10-01",
                hatarido: "2024-11-30",
                hatralevo_napok: 45,
                ugyfel: {
                    nev: "Nagy István",
                    szuletesi_datum: "1990-06-20",
                    lakcim: "1111 Budapest, Bartók Béla út 45.",
                    telefon: "+36209876543",
                    email: "nagy.istvan@example.hu"
                },
                ugyintezo: {
                    nev: "Dr. Szabó Péter",
                    azonosito: "EKM001"
                },
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel" },
                    formai: { eredmeny: "hianypotlas", hianyossagok: [
                        { tipus: "dokumentum", megnevezes: "Vasútegészségügyi igazolás hiányzik" },
                        { tipus: "adat", megnevezes: "Korábbi munkahelyek listája hiányos" }
                    ]},
                    tartalmi: { eredmeny: null }
                },
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-10-01" },
                    { nev: "Hiánypótlási felszólítás", tipus: "pdf", datum: "2024-10-04" }
                ]
            },

            {
                ugyazonosito: "VAHAP-V-2024-001199",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "döntésre vár",
                statuszClass: "info",
                benyujtasDatum: "2024-10-12",
                benyujtas_datum: "2024-10-12",
                hatarido: "2024-11-12",
                hatralevo_napok: 30,
                eljarasTipus: "teljes",
                hatarido_tipus: "teljes_eljaras",
                ugyfel: {
                    nev: "Teszt Károly",
                    szuletesi_datum: "1988-05-20",
                    lakcim: "1133 Budapest, Váci út 100.",
                    telefon: "+36308888888",
                    email: "teszt.karoly@example.hu"
                },
                ugyintezo: {
                    nev: "Dr. Szabó Péter",
                    azonosito: "EKM001",
                    szerepkor: "VHF_UGYINTEZO"
                },
                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-10-12" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-10-13" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "kész", dontes: "megfelel", datum: "2024-10-14" },
                    tartalmi_vizsgalat: { uce: "UCE-1794", allapot: "kész", dontes: "megfelel", datum: "2024-10-15" },
                    dontesi_javaslat: { uce: "UCE-1826", allapot: "folyamatban", datum_kezdes: "2024-10-16" }
                },
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel", F_kod: "F-0064" },
                    formai: { eredmeny: "megfelel", F_kod: "F-0065" },
                    tartalmi: { eredmeny: "megfelel", F_kod: "F-0066" }
                },
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-10-12" },
                    { nev: "Személyi igazolvány", tipus: "pdf", datum: "2024-10-12" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-001145",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "hiánypótlásra vár",
                statuszClass: "warning",
                benyujtasDatum: "2024-10-08",
                benyujtas_datum: "2024-10-08",
                hatarido: "2024-10-28",
                hatralevo_napok: -7,
                eljarasTipus: "teljes",
                hatarido_tipus: "teljes_eljaras",
                ugyfel: {
                    nev: "Példa Anna",
                    szuletesi_datum: "1992-07-10",
                    lakcim: "1088 Budapest, Rákóczi út 50.",
                    telefon: "+36207777777",
                    email: "pelda.anna@example.hu"
                },
                ugyintezo: {
                    nev: "Dr. Szabó Péter",
                    azonosito: "EKM001",
                    szerepkor: "VHF_UGYINTEZO"
                },
                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-10-08" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-10-09" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "kész", dontes: "hianypotlas", datum: "2024-10-10" },
                    hianypotlas_felszolitas: { uce: "UCE-2000", allapot: "kikuldve", datum: "2024-10-11", hatarido: "2024-10-26" }
                },
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel", F_kod: "F-0064" },
                    formai: {
                        eredmeny: "hianypotlas",
                        F_kod: "F-0065",
                        hianyossagok: [
                            { tipus: "dokumentum", megnevezes: "Vasútegészségügyi igazolás hiányzik" }
                        ]
                    }
                },
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-10-08" },
                    { nev: "Hiánypótlási felszólítás", tipus: "pdf", datum: "2024-10-11" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-001087",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "lezárt",
                statuszClass: "approved",
                benyujtasDatum: "2024-10-01",
                benyujtas_datum: "2024-10-01",
                hatarido: "2024-11-01",
                hatralevo_napok: 18,
                lezarasDatum: "2024-10-20",
                eljarasTipus: "sommas",
                hatarido_tipus: "sommas",
                ugyfel: {
                    nev: "Kovács Béla",
                    szuletesi_datum: "1980-12-15",
                    lakcim: "1117 Budapest, Bartók Béla út 20.",
                    telefon: "+36309999999",
                    email: "kovacs.bela@example.hu"
                },
                ugyintezo: {
                    nev: "Nagy Andrea",
                    azonosito: "EKM002",
                    szerepkor: "VHF_UGYINTEZO"
                },
                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-10-01" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-10-02" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "kész", dontes: "megfelel", datum: "2024-10-03" },
                    tartalmi_vizsgalat: { uce: "UCE-1794", allapot: "kész", dontes: "megfelel", datum: "2024-10-04" },
                    sommas_eljaras: { uce: "UCE-1800", allapot: "kész", dontes: "sommas", datum: "2024-10-05" },
                    dontesi_javaslat: { uce: "UCE-1826", allapot: "kész", datum: "2024-10-15" },
                    vezetoi_dontes: { uce: "UCE-1826", allapot: "kész", dontes: "engedélyezés", datum: "2024-10-18" },
                    ugy_lezaras: { uce: "UCE-1828", allapot: "kész", datum: "2024-10-20" }
                },
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel", F_kod: "F-0064" },
                    formai: { eredmeny: "megfelel", F_kod: "F-0065" },
                    tartalmi: { eredmeny: "megfelel", F_kod: "F-0066" }
                },
                vny024_adatok: {
                    van_adat: true,
                    utolso_vizsgalat: "2023-08-15",
                    alkalmassag: "alkalmas",
                    ervenyesseg: "2025-08-15"
                },
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-10-01" },
                    { nev: "Engedélyező határozat", tipus: "pdf", datum: "2024-10-20" },
                    { nev: "Alkalmassági igazolás", tipus: "pdf", datum: "2024-10-20" }
                ]
            },
            {
                ugyazonosito: "VAHAP-V-2024-000923",
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                statusz: "lezárt",
                statuszClass: "rejected",
                benyujtasDatum: "2024-09-25",
                benyujtas_datum: "2024-09-25",
                hatarido: "2024-10-25",
                hatralevo_napok: 11,
                lezarasDatum: "2024-10-10",
                eljarasTipus: "teljes",
                hatarido_tipus: "teljes_eljaras",
                ugyfel: {
                    nev: "Szabó Gábor",
                    szuletesi_datum: "1995-03-08",
                    lakcim: "1144 Budapest, Füredi utca 30.",
                    telefon: "+36201111111",
                    email: "szabo.gabor@example.hu"
                },
                ugyintezo: {
                    nev: "Dr. Szabó Péter",
                    azonosito: "EKM001",
                    szerepkor: "VHF_UGYINTEZO"
                },
                workflow_lepesek: {
                    erkeztetes: { uce: "UCE-1778", allapot: "kész", datum: "2024-09-25" },
                    hatáskor_vizsgalat: { uce: "UCE-1793", allapot: "kész", dontes: "hatáskor_van", datum: "2024-09-26" },
                    formai_vizsgalat: { uce: "UCE-1799", allapot: "kész", dontes: "megfelel", datum: "2024-09-27" },
                    tartalmi_vizsgalat: { uce: "UCE-1794", allapot: "kész", dontes: "nem_megfelel", datum: "2024-09-30" },
                    dontesi_javaslat: { uce: "UCE-1826", allapot: "kész", dontes: "elutasitas", datum: "2024-10-05" },
                    vezetoi_dontes: { uce: "UCE-1826", allapot: "kész", dontes: "elutasítás", datum: "2024-10-08" },
                    ugy_lezaras: { uce: "UCE-1828", allapot: "kész", datum: "2024-10-10" }
                },
                ellenorzesek: {
                    hatáskor: { eredmeny: "megfelel", F_kod: "F-0064" },
                    formai: { eredmeny: "megfelel", F_kod: "F-0065" },
                    tartalmi: {
                        eredmeny: "nem_megfelel",
                        F_kod: "F-0066",
                        hianyossagok: [
                            { tipus: "feltétel", megnevezes: "Egészségügyi alkalmasság hiányzik" },
                            { tipus: "feltétel", megnevezes: "Büntetett előélet igazolása negatív" }
                        ]
                    }
                },
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", datum: "2024-09-25" },
                    { nev: "Elutasító határozat", tipus: "pdf", datum: "2024-10-10" }
                ]
            }
        ],

        // Ellenőrzési listák paraméterek (DS-0106, DS-0107, DS-0108)
        ellenorzesi_listak: {
            hatáskor_illetekesseg: {
                F_kod: "F-0064",
                UCE_kod: "UCE-1793",
                kriteriumok: [
                    { id: 1, megnevezes: "Kérelmező személyazonosító adatai egyértelműek", kotelezo: true },
                    { id: 2, megnevezes: "Ügytípus (V-044) hatáskör biztosított", kotelezo: true },
                    { id: 3, megnevezes: "Illetékesség területi szempontból megállapítható", kotelezo: true },
                    { id: 4, megnevezes: "Nincs párhuzamos eljárás", kotelezo: false }
                ]
            },
            formai_megfeleloseg: {
                F_kod: "F-0065",
                UCE_kod: "UCE-1799",
                kriteriumok: [
                    { id: 1, megnevezes: "Kérelem szabályszerűen kitöltve", kotelezo: true },
                    { id: 2, megnevezes: "Kötelező mellékletek csatolva", kotelezo: true },
                    { id: 3, megnevezes: "Személyazonosító okmány másolat", kotelezo: true },
                    { id: 4, megnevezes: "Lakcímkártya másolat", kotelezo: true },
                    { id: 5, megnevezes: "Vasútegészségügyi alkalmasság igazolása", kotelezo: true },
                    { id: 6, megnevezes: "Eljárási díj megfizetve", kotelezo: true }
                ]
            },
            tartalmi_megfeleloseg: {
                F_kod: "F-0066",
                UCE_kod: "UCE-1794",
                kriteriumok: [
                    { id: 1, megnevezes: "Kérelmező életkora megfelelő (min. 18 év)", kotelezo: true },
                    { id: 2, megnevezes: "Egészségügyi alkalmasság érvényes", kotelezo: true },
                    { id: 3, megnevezes: "VNY024 nyilvántartás adatok ellenőrizve", kotelezo: true, F_kod: "F-0090" },
                    { id: 4, megnevezes: "Szakmai előképzettség igazolt", kotelezo: true },
                    { id: 5, megnevezes: "Nincs kizáró ok (pl. büntetett előélet)", kotelezo: true }
                ]
            }
        },

        // Döntési sablonok
        dontesi_sablonok: {
            hatáskor_vizsgalat: {
                F_kod: "F-0088",
                opciok: [
                    { kod: "hatáskor_van", label: "Hatáskör biztosított", kovetkezo_lepes: "UCE-1799" },
                    { kod: "hatáskor_nincs", label: "Hatáskör hiányzik - áttétel", kovetkezo_lepes: "attetes" }
                ]
            },
            formai_vizsgalat: {
                F_kod: "F-0088",
                opciok: [
                    { kod: "megfelel", label: "Formai szempontból megfelelő", kovetkezo_lepes: "UCE-1794" },
                    { kod: "hianypotlas", label: "Hiánypótlás szükséges", kovetkezo_lepes: "F-0100" }
                ]
            },
            tartalmi_vizsgalat: {
                F_kod: "F-0088",
                opciok: [
                    { kod: "megfelel", label: "Tartalmilag megfelelő", kovetkezo_lepes: "UCE-1800" },
                    { kod: "hianypotlas", label: "Hiánypótlás szükséges", kovetkezo_lepes: "F-0100" },
                    { kod: "tenyallas_tisztazas", label: "Tényállás tisztázás szükséges", kovetkezo_lepes: "F-0102" }
                ]
            },
            sommas_eljaras: {
                F_kod: "F-0088",
                UCE_kod: "UCE-1800",
                opciok: [
                    { kod: "sommas", label: "Sommás eljárás alkalmazható", hatarido: "8_nap", kovetkezo_lepes: "UCE-1826" },
                    { kod: "teljes", label: "Teljes eljárás szükséges", hatarido: "60_nap", kovetkezo_lepes: "UCE-1826" }
                ]
            }
        },

        // F-0089 - Ügyfél értesítés sablonok
        ugyfel_ertesites_sablonok: {
            sommas_eljaras: {
                F_kod: "F-0089",
                sablon_id: "DC-0044",
                cim: "Értesítés sommás eljárás megindításáról",
                szoveg: "Tájékoztatjuk, hogy kérelme alapján sommás eljárás indult. A döntés várható határideje: {hatarido}.",
                hatarido: "8_nap"
            },
            teljes_eljaras: {
                F_kod: "F-0089",
                sablon_id: "DC-0045",
                cim: "Értesítés teljes körű eljárás megindításáról",
                szoveg: "Tájékoztatjuk, hogy kérelme alapján teljes körű hatósági eljárás indult. A döntés várható határideje: {hatarido}.",
                hatarido: "60_nap"
            },
            dontes_kozlese: {
                F_kod: "F-0089",
                cim: "Döntés közlése",
                szoveg: "Tájékoztatjuk, hogy ügyében {dontes_datum} napján döntés született. A határozatot mellékletben csatoljuk."
            }
        },

        // F-0096 - Döntési javaslat véleményezés workflow
        velemenyezes_workflow: {
            F_kod: "F-0096",
            UCE_kod: "UCE-1824",
            lepesek: [
                { sorszam: 1, szerepkor: "VHF_UGYINTEZO", tevekenyseg: "Döntési javaslat előkészítése" },
                { sorszam: 2, szerepkor: "VHF_CSOPORTVEZETO", tevekenyseg: "Véleményezés és javaslattétel" },
                { sorszam: 3, szerepkor: "VHF_DONTESHOZO", tevekenyseg: "Végleges döntéshozatal" }
            ],
            velemenyezes_opciok: [
                { kod: "elfogadom", label: "Elfogadom a javaslatot", kovetkezo: "donteshozatal" },
                { kod: "modositassal", label: "Módosítással elfogadom", kovetkezo: "modositas" },
                { kod: "elutasitom", label: "Elutasítom, új javaslat szükséges", kovetkezo: "uj_javaslat" }
            ]
        },

        // F-0098 - FORRÁS SQL interfész mock
        forras_sql_mock: {
            F_kod: "F-0098",
            interfesz: "FORRÁS Pénzügyi Rendszer",
            lekerdezheto_adatok: [
                { ugyazonosito: "VAHAP-V-2024-001234", dijfizetes_statusz: "befizetve", dijfizetes_datum: "2024-10-15", osszeg: 12000 },
                { ugyazonosito: "VAHAP-V-2024-000987", dijfizetes_statusz: "hiányzik", dijfizetes_datum: null, osszeg: 0 },
                { ugyazonosito: "VAHAP-V-2024-001199", dijfizetes_statusz: "befizetve", dijfizetes_datum: "2024-10-12", osszeg: 12000 }
            ]
        },

        // F-0099 - Vezetői döntés típusok
        vezetoi_dontes_tipusok: {
            F_kod: "F-0099",
            opciok: [
                {
                    kod: "engedélyezés",
                    label: "Kérelem engedélyezése",
                    dokumentum: "F-0092",
                    kovetkezo: "UCE-1828"
                },
                {
                    kod: "felteteles_engedélyezés",
                    label: "Feltételes engedélyezés",
                    dokumentum: "F-0092",
                    kovetkezo: "UCE-1828"
                },
                {
                    kod: "elutasitas",
                    label: "Kérelem elutasítása",
                    dokumentum: "F-0091",
                    kovetkezo: "UCE-1828"
                },
                {
                    kod: "igazolas",
                    label: "Igazolás kiállítása",
                    dokumentum: "F-0093",
                    kovetkezo: "UCE-1828"
                }
            ]
        },

        // F-0097 - Ügy lezárás típusok
        ugy_lezaras_tipusok: {
            F_kod: "F-0097",
            UCE_kod: "UCE-1828",
            opciok: [
                { kod: "engedélyezve", label: "Engedélyezve - pozitív lezárás" },
                { kod: "elutasitva", label: "Elutasítva - negatív lezárás" },
                { kod: "visszavonva", label: "Ügyfél visszavonta" },
                { kod: "atteve", label: "Áttéve más hatósághoz" }
            ],
            kotelezo_tevekenysegek: [
                "Végleges dokumentum kiadmányozása",
                "Ügyfél értesítése",
                "Nyilvántartás frissítése (F-0090)",
                "EKEIDR iktatás lezárása"
            ]
        },

        // Dashboard statisztikák - Külső
        stats_kulso: {
            total: 3,
            pending: 1,
            urgent: 1,
            completed: 1
        },

        // Dashboard statisztikák - Belső
        stats_belso: {
            total: 24,
            pending: 8,
            urgent: 3,
            completed: 13
        },

        // Külső rendszer - Ügyfél adatok
        ugyfel: {
            nev: "Minta János",
            szuletesiNev: "Minta János",
            szuletesiHely: "Budapest",
            szuletesiDatum: "1985-03-15",
            anyaNeve: "Nagy Mária",
            lakcim: {
                iranyitoszam: "1011",
                telepules: "Budapest",
                kozterulet: "Fő utca",
                hazszam: "1"
            },
            ertesitesiCim: null,
            telefonszam: "+36301234567",
            email: "minta.janos@example.hu",
            kepesitesTipus: "mogozdonyvezeto",
            vizsgalatTipus: "elozetes"
        },

        // Belső rendszer - Ügy adatok
        ugy: {
            ugyazonosito: "VAHAP-V-2024-001234",
            ugytipus: "V-044",
            megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
            statusz: "folyamatban",
            statuszClass: "pending",
            benyujtasDatum: "2024-10-15",
            hatarido: "2024-11-15",
            ugyfel: "Minta János",
            ugyfelLabel: "Ügyfél",
            ugyintezo: "Dr. Szabó Péter"
        },

        // VNY024 Vasútegészségügyi adatok
        veuAdatok: [
            {
                vizsgalatTipus: "Előzetes alkalmassági",
                alkalmasság: "Alkalmas",
                ervenyesseg: "2025-03-15",
                korlatozasok: "Nincs"
            },
            {
                vizsgalatTipus: "Pszichológiai vizsgálat",
                alkalmasság: "Alkalmas",
                ervenyesseg: "2025-03-15",
                korlatozasok: "Nincs"
            }
        ],

        // Ellenőrzési lista - Hatáskör
        hataskortEllenorzes: {
            vasutHatosag: true,
            illetekesseg: true,
            ugyfelJogosultsag: true
        },

        // Workflow lépések
        workflowSteps: [
            { code: 'UCE-1761', label: 'Adatrögzítés' },
            { code: 'UCE-1773', label: 'Adatok kitöltése' },
            { code: 'UCE-1772', label: 'Mellékletek' },
            { code: 'UCE-1776', label: 'Véglegesítés' },
            { code: 'UCE-1771', label: 'Benyújtás' }
        ],

        // Timeline események
        timeline: [
            {
                date: '2024.10.15 14:32',
                title: 'Kérelem benyújtva',
                description: 'Ügyfél: Minta János'
            },
            {
                date: '2024.10.15 15:05',
                title: 'Érkeztetés',
                description: 'EKEIDR iktatószám: 12345/2024'
            },
            {
                date: '2024.10.16 09:15',
                title: 'Hatáskör vizsgálat',
                description: 'Dr. Szabó Péter - Pozitív'
            },
            {
                date: '2024.10.16 10:30',
                title: 'Formai ellenőrzés',
                description: 'Megfelelő'
            }
        ],

        // Dokumentumok
        dokumentumok: [
            { name: 'Kérelem adatlap.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Személyi igazolvány.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'VEÜ igazolás.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Díjbekérő.pdf', icon: 'bi-file-earmark-pdf' }
        ],

        // Mellékletek lista
        mellékletek: [
            { name: 'Személyazonosító okmány másolata', required: true },
            { name: 'Lakcímkártya másolata', required: true },
            { name: 'Vasútegészségügyi alkalmasság igazolása', required: true },
            { name: 'Egyéb dokumentum', required: false }
        ],

        // Döntési pontok
        dontesiPontok: [
            { code: 'UCE-1994', label: 'Sommás eljárás', variant: 'success' },
            { code: 'UCE-1800', label: 'Teljes eljárás', variant: 'primary' },
            { code: 'UCE-1800', label: 'Hiánypótlás', variant: 'warning' },
            { code: 'UCE-1800', label: 'Tényállás tisztázás', variant: 'info' },
            { code: '', label: 'Elutasítás', variant: 'danger' }
        ],

        // Statisztika
        statistics: {
            startDate: '2024.10.15',
            elapsedDays: 3,
            remainingDays: 5,
            totalDays: 8,
            procedureType: 'Sommás eljárás'
        }
    },

    /**
     * Hajózási Modul Mock Adatok
     */
    hajozas: {
        // Munkalista - Külső rendszer (Kérelmező ügyek)
        ugyek_kulso: [
            {
                ugyazonosito: "VAHAP-H-2024-005678",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                statusz: "folyamatban",
                statuszClass: "pending",
                benyujtasDatum: "2024-10-01",
                hatarido: "2024-12-01",
                ugyfel: "Duna Kikötő Kft."
            },
            {
                ugyazonosito: "VAHAP-H-2024-004521",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                statusz: "szakhatósági állásfoglalás",
                statuszClass: "info",
                benyujtasDatum: "2024-09-15",
                hatarido: "2024-11-15",
                ugyfel: "Duna Kikötő Kft."
            }
        ],

        // Munkalista - Belső rendszer (Ügyintézői ügyek)
        ugyek_belso: [
            {
                ugyazonosito: "VAHAP-H-2024-005678",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                statusz: "vizsgálat",
                statuszClass: "pending",
                benyujtasDatum: "2024-10-01",
                hatarido: "2024-12-01",
                ugyfel: "Duna Kikötő Kft.",
                ugyintezo: "Nagy Andrea"
            },
            {
                ugyazonosito: "VAHAP-H-2024-005423",
                ugytipus: "H-052",
                megnevezes: "Határkikötő létesítése",
                statusz: "szakhatósági állásfoglalás",
                statuszClass: "info",
                benyujtasDatum: "2024-09-28",
                hatarido: "2024-11-28",
                ugyfel: "Tisza Port Zrt.",
                ugyintezo: "Nagy Andrea"
            },
            {
                ugyazonosito: "VAHAP-H-2024-004998",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                statusz: "hiánypótlás",
                statuszClass: "warning",
                benyujtasDatum: "2024-09-20",
                hatarido: "2024-11-20",
                ugyfel: "Balaton Marina Kft.",
                ugyintezo: "Tóth Gábor"
            },
            {
                ugyazonosito: "VAHAP-H-2024-004521",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                statusz: "jóváhagyva",
                statuszClass: "approved",
                benyujtasDatum: "2024-09-01",
                hatarido: "2024-11-01",
                ugyfel: "Duna Logisztika Kft.",
                ugyintezo: "Nagy Andrea"
            }
        ],

        // Dashboard statisztikák - Külső
        stats_kulso: {
            total: 2,
            pending: 1,
            urgent: 0,
            completed: 1
        },

        // Dashboard statisztikák - Belső
        stats_belso: {
            total: 18,
            pending: 6,
            urgent: 2,
            completed: 10
        },

        // Külső rendszer - Kérelmező adatok
        kerelmező: {
            cegnev: "Duna Kikötő Kft.",
            cegjegyzekszam: "01-09-123456",
            adoszam: "12345678-2-41",
            kepviselo: "Kovács István",
            email: "info@dunakikoto.hu",
            telefonszam: "+36301234567",
            szekhely: {
                iranyitoszam: "1095",
                telepules: "Budapest",
                kozterulet: "Lechner Ödön fasor",
                hazszam: "4"
            },
            kikotoTipus: "orszagos_kozforgalmu",
            viziutKategoria: "vi",
            letesitmenyHelye: "Budapest, Duna 1640 fkm",
            kapacitas: 500000,
            allohelyekSzama: 12,
            tervezo: {
                nev: "Tervező Iroda Kft.",
                jogosultsag: "TJ-2023-0456"
            }
        },

        // Belső rendszer - Ügy adatok
        ugy: {
            ugyazonosito: "VAHAP-H-2024-005678",
            ugytipus: "H-052",
            megnevezes: "Országos közforgalmú kikötő létesítése",
            statusz: "vizsgálat",
            statuszClass: "pending",
            benyujtasDatum: "2024-10-01",
            hatarido: "2024-12-01",
            ugyfel: "Duna Kikötő Kft.",
            ugyfelLabel: "Kérelmező",
            ugyintezo: "Nagy Andrea"
        },

        // HNY501 Hajózási létesítmények
        letesitmenyAdatok: {
            letesitmenyAzonosito: "HNY-2024-0123",
            letesitmenyNeve: "Duna Kikötő Budapest",
            tipus: "Országos közforgalmú kikötő",
            viziutOsztaly: "VI. osztály",
            koordinatak: {
                lat: "47.123456",
                lon: "19.123456"
            },
            kapacitas: 500000,
            uzemelteto: "Duna Kikötő Kft."
        },

        // Szakhatósági állásfoglalások
        szakhatosagok: [
            {
                nev: "Vízügyi hatóság",
                megkeresesDatum: "2024.10.18",
                hatarido: "2024.11.17",
                allaspont: "pozitiv",
                allaspontLabel: "Pozitív"
            },
            {
                nev: "Környezetvédelmi",
                megkeresesDatum: "2024.10.18",
                hatarido: "2024.11.17",
                allaspont: "folyamatban",
                allaspontLabel: "Folyamatban"
            },
            {
                nev: "Építésügyi",
                megkeresesDatum: "2024.10.18",
                hatarido: "2024.11.17",
                allaspont: "folyamatban",
                allaspontLabel: "Folyamatban"
            }
        ],

        // Workflow lépések
        workflowSteps: [
            { code: 'UCE-1955', label: 'Adatrögzítés' },
            { code: 'UCE-1967', label: 'Adatok kitöltése' },
            { code: 'UCE-1966', label: 'Mellékletek' },
            { code: 'UCE-1970', label: 'Véglegesítés' },
            { code: 'UCE-1965', label: 'Benyújtás' }
        ],

        // Timeline események
        timeline: [
            {
                date: '2024.10.01 10:15',
                title: 'Kérelem benyújtva',
                description: 'Duna Kikötő Kft.'
            },
            {
                date: '2024.10.01 11:30',
                title: 'Érkeztetés',
                description: 'EKEIDR iktatószám: 67890/2024'
            },
            {
                date: '2024.10.02 09:00',
                title: 'Hatáskör vizsgálat',
                description: 'Nagy Andrea - Pozitív'
            },
            {
                date: '2024.10.18 14:20',
                title: 'Szakhatósági megkeresések',
                description: '3 hatóság megkeresve'
            }
        ],

        // Dokumentumok
        dokumentumok: [
            { name: 'Kérelem adatlap.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Műszaki terv.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Építési engedély.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Vízjogi engedély.pdf', icon: 'bi-file-earmark-pdf' },
            { name: 'Tulajdoni lap.pdf', icon: 'bi-file-earmark-pdf' }
        ],

        // Mellékletek lista
        mellékletek: [
            { name: 'Műszaki tervdokumentáció', required: true },
            { name: 'Jogerős építési engedély', required: true },
            { name: 'Jogerős vízjogi engedély', required: true },
            { name: 'Tulajdonjogi okirat', required: true },
            { name: 'Tervezői jogosultság igazolása', required: true },
            { name: 'Üzemeltetési nyilatkozat', required: true },
            { name: 'Közművek helyzete', required: false }
        ],

        // Döntési pontok
        dontesiPontok: [
            { code: 'UCE-1994', label: 'Sommás eljárás', variant: 'success' },
            { code: 'UCE-1994', label: 'Teljes eljárás', variant: 'primary' },
            { code: 'UCE-2071', label: 'Hiánypótlás', variant: 'warning' },
            { code: 'F-0102', label: 'Tényállás tisztázás', variant: 'info' },
            { code: 'UCE-2051', label: 'Helyszíni szemle', variant: 'secondary' },
            { code: '', label: 'Elutasítás', variant: 'danger' }
        ],

        // Statisztika
        statistics: {
            startDate: '2024.10.01',
            elapsedDays: 32,
            remainingDays: 28,
            totalDays: 60,
            procedureType: 'Teljes eljárás'
        }
    },

    /**
     * Hajózási Modul Mock Adatok
     */
    hajozas: {
        // F-0069 - Kérelem adatlap űrlap mezői (példaadatok)
        kerelomAdatlapPelda: {
            // Kérelmező adatok
            vezeteknev: "Tóth",
            keresztnev: "Mária",
            szuletesiNev: "Tóth Mária",
            szuletesiHely: "Szeged",
            szuletesiDatum: "1978-06-20",
            anyaNeve: "Kiss Erzsébet",
            allampolgarsag: "magyar",

            // Elérhetőség
            lakcim: {
                iranyitoszam: "6720",
                telepules: "Szeged",
                kozterulet: "Tisza Lajos körút",
                hazszam: "45",
                emelet: "",
                ajto: ""
            },
            ertesitesiCim: null,
            telefonszam: "+36307654321",
            email: "toth.maria@example.hu",

            // Hajózási specifikus adatok
            kikoto_tipusa: "orszagos_kozforgalmu",
            tervezett_kapacitas: "5000",
            vizi_ut_kategoria: "IV",
            hajozasi_letesitmeny_jellege: "kikoto",
            telepules_kikoto: "Budapest",
            tulajdonjog: "allami",
            ingatlan_helyrajzi_szam: "12345/6",

            // Műszaki adatok
            tervezo_nev: "Építész Stúdió Kft.",
            tervezo_jogosultsag_szam: "TJ-12345",
            muszaki_terv_datuma: "2024-08-15",
            uzemelteto: "Kikötő Üzemeltető Kft.",

            // Engedélyek
            epitesi_engedely_szam: "É-2024-1234",
            epitesi_engedely_datum: "2024-07-01",
            vizjogi_engedely_szam: "V-2024-5678",
            vizjogi_engedely_datum: "2024-06-15"
        },

        // Munkalista - Külső rendszer (Ügyfél ügyek)
        ugyek_kulso: [
            {
                ugyazonosito: "VAHAP-H-2024-002345",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítésének engedélyezése",
                statusz: "folyamatban",
                statuszClass: "pending",
                benyujtasDatum: "2024-10-20",
                hatarido: "2024-12-20",
                ugyfel: "Tóth Mária",
                ugyfelMuvelet: null,
                dokumentumok: [
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-H-2024-001987",
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítésének engedélyezése",
                statusz: "hiánypótlás",
                statuszClass: "warning",
                benyujtasDatum: "2024-09-25",
                hatarido: "2024-11-25",
                ugyfel: "Tóth Mária",
                ugyfelMuvelet: "hianypotlas",
                hianypotlasHatarido: "2024-11-10",
                dokumentumok: [
                    { nev: "Hiánypótlási felszólítás", tipus: "pdf", letoltheto: true },
                    { nev: "Eredeti kérelem", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-H-2024-001654",
                ugytipus: "H-052",
                megnevezes: "Komp-átkelőhely létesítésének engedélyezése",
                statusz: "jóváhagyva",
                statuszClass: "approved",
                benyujtasDatum: "2024-08-10",
                hatarido: "2024-10-10",
                dontesDatum: "2024-10-05",
                ugyfel: "Tóth Mária",
                ugyfelMuvelet: null,
                dokumentumok: [
                    { nev: "Létesítési engedély", tipus: "pdf", letoltheto: true },
                    { nev: "Határozat", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-H-2024-001321",
                ugytipus: "H-052",
                megnevezes: "Határkikötő létesítésének engedélyezése",
                statusz: "tényállás tisztázás",
                statuszClass: "info",
                benyujtasDatum: "2024-09-15",
                hatarido: "2024-11-15",
                ugyfel: "Tóth Mária",
                ugyfelMuvelet: "tenyallas_tisztazas",
                tenyallasHatarido: "2024-10-28",
                dokumentumok: [
                    { nev: "Tényállás tisztázási kérés", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            },
            {
                ugyazonosito: "VAHAP-H-2024-000876",
                ugytipus: "H-052",
                megnevezes: "Hajózási létesítmény engedélyezése",
                statusz: "elutasítva",
                statuszClass: "rejected",
                benyujtasDatum: "2024-07-20",
                hatarido: "2024-09-20",
                dontesDatum: "2024-09-18",
                ugyfel: "Tóth Mária",
                ugyfelMuvelet: null,
                dokumentumok: [
                    { nev: "Elutasító végzés", tipus: "pdf", letoltheto: true },
                    { nev: "Kérelem adatlap", tipus: "pdf", letoltheto: true, funkció: "F-0107" }
                ]
            }
        ],

        // F-0070 - Díjkalkulátor díjtáblák
        dijtabla: {
            alapdij: 50000,
            tipusonkenti_dijak: {
                orszagos_kozforgalmu_kikoto: 150000,
                hatarkikoto: 200000,
                komp_atkelohely: 100000,
                rev_atkelohely: 80000,
                egyeb_hajozasi_letesitmeny: 120000
            },
            potdijak: {
                gyorsitott_eljaras: 100000,
                helyszini_szemle: 50000,
                szakhatosagi_allasfoaglalas: 30000
            }
        },

        // F-0084 - Mellékletek (Hajózás specifikus)
        mellekletek_pelda: [
            {
                megnevezes: "Műszaki tervdokumentáció",
                tipusKod: "muszaki_terv",
                kotelezo: true,
                megjegyzes: "Tervező jogosultsággal rendelkező szakember által készített terv",
                pelda_fajlnev: "muszaki_tervdokumentacio.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Jogerős építési engedély",
                tipusKod: "epitesi_engedely",
                kotelezo: true,
                megjegyzes: "Az illetékes építésügyi hatóság által kiadott jogerős engedély",
                pelda_fajlnev: "epitesi_engedely.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Jogerős vízjogi engedély",
                tipusKod: "vizjogi_engedely",
                kotelezo: true,
                megjegyzes: "Az illetékes vízügyi hatóság által kiadott jogerős engedély",
                pelda_fajlnev: "vizjogi_engedely.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Tulajdonjogi okirat",
                tipusKod: "tulajdonjogi_okirat",
                kotelezo: true,
                megjegyzes: "Földhivatali tulajdoni lap másolat vagy használati jogot igazoló okirat",
                pelda_fajlnev: "tulajdoni_lap.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Tervező jogosultság igazolása",
                tipusKod: "tervezo_jogosultsag",
                kotelezo: true,
                megjegyzes: "A tervező kamarai nyilvántartásba vételét igazoló dokumentum",
                pelda_fajlnev: "tervezo_jogosultsag.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Üzemeltetési nyilatkozat",
                tipusKod: "uzemeltetesi_nyilatkozat",
                kotelezo: true,
                megjegyzes: "Az üzemeltető nyilatkozata a létesítmény üzemeltetésének vállalásáról",
                pelda_fajlnev: "uzemeltetesi_nyilatkozat.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Közművek helyzete",
                tipusKod: "kozmu_helyzet",
                kotelezo: false,
                megjegyzes: "Közművezetékek helyzetét ábrázoló térkép",
                pelda_fajlnev: "kozmu_helyzet.pdf",
                funkció: "F-0084"
            },
            {
                megnevezes: "Környezetvédelmi engedély",
                tipusKod: "kornyezetvedelem",
                kotelezo: false,
                megjegyzes: "Amennyiben a létesítmény környezeti hatásvizsgálat-köteles",
                pelda_fajlnev: "kornyezetvedelem.pdf",
                funkció: "F-0084"
            }
        ],

        // Kikötő típusok
        kikotoTipusok: [
            { value: "orszagos_kozforgalmu_kikoto", label: "Országos közforgalmú kikötő" },
            { value: "hatarkikoto", label: "Határkikötő" },
            { value: "komp_atkelohely", label: "Komp-átkelőhely" },
            { value: "rev_atkelohely", label: "Rév-átkelőhely" },
            { value: "egyeb_hajozasi_letesitmeny", label: "Egyéb hajózási létesítmény" }
        ],

        // Víziút kategóriák
        viziutKategoriak: [
            { value: "I", label: "I. osztály - nemzetközi jelentőségű víziút" },
            { value: "II", label: "II. osztály - országos jelentőségű víziút" },
            { value: "III", label: "III. osztály - regionális jelentőségű víziút" },
            { value: "IV", label: "IV. osztály - helyi jelentőségű víziút" }
        ],

        // Tulajdonjog típusok
        tulajdonjogTipusok: [
            { value: "allami", label: "Állami tulajdon" },
            { value: "onkormanyzati", label: "Önkormányzati tulajdon" },
            { value: "magantulajdon", label: "Magántulajdon" },
            { value: "vegyes", label: "Vegyes tulajdon" }
        ],

        // UCE workflow lépések
        workflowSteps: {
            external: [
                { step: 1, code: 'UCE-1955', name: 'Kérelem adatrögzítés megkezdése', icon: 'bi-play-circle' },
                { step: 2, code: 'UCE-1967', name: 'Kérelem adatainak kitöltése', icon: 'bi-pencil-square', function: 'F-0069' },
                { step: 3, code: 'UCE-1966', name: 'Mellékletek csatolása', icon: 'bi-paperclip', function: 'F-0084' },
                { step: 4, code: 'UCE-1970', name: 'Kérelem véglegesítése', icon: 'bi-check-square', function: 'F-0085' },
                { step: 5, code: 'UCE-1965', name: 'Kérelem benyújtása', icon: 'bi-send', function: 'F-0087' }
            ]
        },

        // Workflow állapotok
        workflowStatuses: {
            startDate: '2024-10-20',
            currentStep: 'UCE-1967',
            completedSteps: ['UCE-1955'],
            totalDays: 60,
            procedureType: 'Teljes eljárás'
        }
    },

    /**
     * Közös adatok
     */
    common: {
        // Ügyintézők
        ugyintezok: {
            vasut: {
                name: "Dr. Szabó Péter",
                department: "VHF",
                role: "VHF_UGYINTEZO",
                azonosito: "EKM001"
            },
            hajozas: {
                name: "Nagy Andrea",
                department: "HHF",
                role: "HHF_UGYINTEZO",
                azonosito: "EKM002"
            }
        },

        // Modul információk
        modulInfo: {
            vasut: {
                name: "Vasúti Modul",
                code: "V-044",
                icon: "bi-train-front",
                colorClass: "vasut",
                color: "#8B4513"
            },
            hajozas: {
                name: "Hajózási Modul",
                code: "H-052",
                icon: "bi-water",
                colorClass: "hajozas",
                color: "#006994"
            }
        },

        // Navigációs menü sablon (belső rendszer)
        navMenuTemplate: {
            vasut: [
                { id: 'hataskort', code: 'UCE-1793', label: 'Hatáskör vizsgálat', badgeVariant: 'info' },
                { id: 'formai', code: 'UCE-1799', label: 'Formai ellenőrzés', badgeVariant: 'info' },
                { id: 'tartalmi', code: 'UCE-1794', label: 'Tartalmi vizsgálat', badgeVariant: 'info' },
                { id: 'veu', code: 'F-0090', label: 'VEÜ adatok', badgeVariant: 'warning' },
                { id: 'dontes', code: 'UCE-1826', label: 'Döntési javaslat', badgeVariant: 'info' },
                { id: 'velemenyezes', code: 'UCE-1824', label: 'Véleményeztetés', badgeVariant: 'info' },
                { id: 'lezaras', code: 'UCE-1828', label: 'Ügy lezárása', badgeVariant: 'info' }
            ],
            hajozas: [
                { id: 'hataskort', code: 'UCE-1987', label: 'Hatáskör vizsgálat', badgeVariant: 'info' },
                { id: 'formai', code: 'UCE-1993', label: 'Formai ellenőrzés', badgeVariant: 'info' },
                { id: 'tartalmi', code: 'UCE-1988', label: 'Tartalmi vizsgálat', badgeVariant: 'info' },
                { id: 'szakhatosag', code: 'UCE-2045', label: 'Szakhatósági', badgeVariant: 'warning' },
                { id: 'dontes', code: 'UCE-2020', label: 'Döntési javaslat', badgeVariant: 'info' },
                { id: 'velemenyezes', code: 'UCE-2018', label: 'Véleményeztetés', badgeVariant: 'info' },
                { id: 'nyilvantartas', code: 'UCE-2023', label: 'Nyilvántartás', badgeVariant: 'warning' },
                { id: 'lezaras', code: 'UCE-2022', label: 'Ügy lezárása', badgeVariant: 'info' }
            ]
        },

        // Műveletek menü
        actionsMenu: [
            { id: 'hianypotlas', icon: 'bi-exclamation-triangle', label: 'Hiánypótlás' },
            { id: 'tenyallas', icon: 'bi-search', label: 'Tényállás tisztázás' }
        ],

        // Hajózás-specifikus műveletek
        hajozasActionsMenu: [
            { id: 'hianypotlas', icon: 'bi-exclamination-triangle', label: 'Hiánypótlás' },
            { id: 'tenyallas', icon: 'bi-search', label: 'Tényállás tisztázás' },
            { id: 'szemle', icon: 'bi-eye', label: 'Helyszíni szemle' }
        ]
    },

    /**
     * Helper funkciók
     */
    helpers: {
        // Modul adatok lekérése
        getModuleData(moduleType) {
            return this[moduleType] || null;
        },

        // Ügyintéző adatok lekérése
        getUserInfo(moduleType) {
            return this.common.ugyintezok[moduleType] || null;
        },

        // Modul info lekérése
        getModuleInfo(moduleType) {
            return this.common.modulInfo[moduleType] || null;
        },

        // Navigációs menü lekérése
        getNavMenu(moduleType) {
            return this.common.navMenuTemplate[moduleType] || [];
        },

        // Műveletek menü lekérése
        getActionsMenu(moduleType) {
            if (moduleType === 'hajozas') {
                return this.common.hajozasActionsMenu;
            }
            return this.common.actionsMenu;
        }
    },

    // ========================================
    // PARAMÉTEREZŐ ALRENDSZER MOCK ADATOK
    // ========================================
    parameterezo: {
        // Ellenőrzési listák - Hatáskör és illetékesség (F-0064)
        ellenorzesi_lista_hatáskor: {
            F_kod: "F-0064",
            UCE_kod: "UCE-1793, UCE-1987",
            lista_nev: "Hatáskör és illetékesség vizsgálat",
            kriteriumok: [
                {
                    id: 1,
                    megnevezes: "Az ügytípus a megfelelő hatóság hatáskörébe tartozik",
                    leiras: "V-044: Vasúti Hatósági Főosztály, H-052: Hajózási Hatósági Főosztály",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 10,
                    ugytipus_specifikus: "",
                    aktiv: true
                },
                {
                    id: 2,
                    megnevezes: "Az ügyfél jogosult a kérelem benyújtására",
                    leiras: "Vasút: vasúti társaság vagy munkáltató; Hajózás: kikötő üzemeltető vagy tulajdonos",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 10,
                    ugytipus_specifikus: "",
                    aktiv: true
                },
                {
                    id: 3,
                    megnevezes: "Az eljárás területi illetékessége biztosított",
                    leiras: "Központi hatóság - országos illetékesség mindkét modul esetén",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 9,
                    ugytipus_specifikus: "",
                    aktiv: true
                },
                {
                    id: 4,
                    megnevezes: "Az ügytípus (V-044) vasúti járművezető alkalmassági vizsgálat",
                    leiras: "Csak vasúti ügyek esetén alkalmazandó kritérium",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 8,
                    ugytipus_specifikus: "V-044",
                    aktiv: true
                },
                {
                    id: 5,
                    megnevezes: "Kikötő típusa országos közforgalmú vagy határkikötő",
                    leiras: "Csak hajózási ügyek esetén alkalmazandó kritérium",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 8,
                    ugytipus_specifikus: "H-052",
                    aktiv: true
                },
                {
                    id: 6,
                    megnevezes: "Díjfizetési kötelezettség teljesítve",
                    leiras: "Igazgatási szolgáltatási díj befizetésének ellenőrzése",
                    kotelezo: false,
                    tipus: "igen_nem",
                    suly: 5,
                    ugytipus_specifikus: "",
                    aktiv: true
                }
            ]
        },

        // Ellenőrzési listák - Formai megfelelőség (F-0065)
        ellenorzesi_lista_formai: {
            F_kod: "F-0065",
            UCE_kod: "UCE-1799",
            lista_nev: "Formai megfelelőség vizsgálata",
            kriteriumok: [
                {
                    id: 1,
                    sorszam: 1,
                    megnevezes: "Kérelem űrlap szabályszerűen kitöltve",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 10,
                    aktiv: true
                },
                {
                    id: 2,
                    sorszam: 2,
                    megnevezes: "Kötelező mellékletek csatolva",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 10,
                    aktiv: true
                },
                {
                    id: 3,
                    sorszam: 3,
                    megnevezes: "Személyazonosító okmány másolat",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 8,
                    aktiv: true
                },
                {
                    id: 4,
                    sorszam: 4,
                    megnevezes: "Lakcímkártya másolat",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 8,
                    aktiv: true
                },
                {
                    id: 5,
                    sorszam: 5,
                    megnevezes: "Vasútegészségügyi alkalmasság igazolása",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 10,
                    ugytipus_specifikus: "V-044",
                    aktiv: true
                },
                {
                    id: 6,
                    sorszam: 6,
                    megnevezes: "Eljárási díj megfizetve",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 10,
                    aktiv: true
                }
            ]
        },

        // Ellenőrzési listák - Tartalmi megfelelőség (F-0066)
        ellenorzesi_lista_tartalmi: {
            F_kod: "F-0066",
            UCE_kod: "UCE-1794",
            lista_nev: "Tartalmi megfelelőség vizsgálata",
            kriteriumok: [
                {
                    id: 1,
                    sorszam: 1,
                    megnevezes: "Kérelmező életkora megfelelő (min. 18 év)",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 10,
                    aktiv: true
                },
                {
                    id: 2,
                    sorszam: 2,
                    megnevezes: "Egészségügyi alkalmasság érvényes",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 10,
                    aktiv: true
                },
                {
                    id: 3,
                    sorszam: 3,
                    megnevezes: "VNY024 nyilvántartás adatok ellenőrizve (F-0090)",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 9,
                    ugytipus_specifikus: "V-044",
                    aktiv: true
                },
                {
                    id: 4,
                    sorszam: 4,
                    megnevezes: "Szakmai előképzettség igazolt",
                    kotelezo: true,
                    tipus: "igen_nem",
                    suly: 8,
                    aktiv: true
                },
                {
                    id: 5,
                    sorszam: 5,
                    megnevezes: "Nincs kizáró ok (pl. büntetett előélet)",
                    kotelezo: true,
                    tipus: "megfelel_nem_megfelel",
                    suly: 10,
                    aktiv: true
                },
                {
                    id: 6,
                    sorszam: 6,
                    megnevezes: "Képzési követelmények teljesítve",
                    kotelezo: false,
                    tipus: "szoveges",
                    suly: 5,
                    aktiv: true
                }
            ]
        },

        // Határidők ügytípusonként
        hataridok: {
            'V-044': {
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                sommas_eljaras: {
                    nap: 8,
                    tipus: "munkanap",
                    megjegyzes: "UCE-1800 - Sommás eljárás alkalmazható?"
                },
                teljes_eljaras: {
                    nap: 60,
                    tipus: "munkanap",
                    megjegyzes: "Általános ügyintézési határidő"
                },
                hianypotlas: {
                    min_nap: 8,
                    max_nap: 30,
                    default_nap: 15,
                    tipus: "munkanap",
                    max_korok: 3,
                    megjegyzes: "UCE-1871 - Hiánypótlási felszólítás"
                },
                tenyallas_tisztazas: {
                    default_nap: 15,
                    max_nap: 30,
                    tipus: "munkanap",
                    megjegyzes: "UCE-1855 - Tényállás tisztázás cselekmények"
                },
                jogorvoslat: {
                    nap: 15,
                    tipus: "naptári_nap",
                    megjegyzes: "Fellebbezési határidő"
                },
                utolso_modositas: "2024-10-01",
                aktiv: true
            },
            'H-052': {
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                sommas_eljaras: {
                    nap: 8,
                    tipus: "munkanap"
                },
                teljes_eljaras: {
                    nap: 60,
                    tipus: "munkanap"
                },
                hianypotlas: {
                    min_nap: 8,
                    max_nap: 30,
                    default_nap: 15,
                    tipus: "munkanap",
                    max_korok: 3
                },
                tenyallas_tisztazas: {
                    default_nap: 20,
                    max_nap: 45,
                    tipus: "munkanap",
                    megjegyzes: "Helyszíni szemle miatt hosszabb határidő"
                },
                jogorvoslat: {
                    nap: 15,
                    tipus: "naptári_nap"
                },
                utolso_modositas: "2024-09-20",
                aktiv: true
            }
        },

        // Dokumentum sablonok
        dokumentum_sablonok: {
            vegzes: [
                {
                    id: 1,
                    kod: "VEG-001",
                    nev: "Végzés - Hiánypótlási felszólítás",
                    leiras: "Hiánypótlásra felszólító végzés sablon",
                    tartalom: "<h3>VÉGZÉS</h3><p><strong>Tárgy:</strong> Hiánypótlási felszólítás</p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@<br><strong>Ügyfél:</strong> @UGYFEL_NEV@</p><p>@SZERVEZET@ észlelte, hogy a @DATUM@ napján benyújtott kérelem hiányos.</p><h4>Hiányosságok:</h4><p>@INDOKLAS@</p><p>Felhívjuk, hogy a hiányosságokat @HATARIDO@ napjáig pótolja.</p><p>Kelt: @DATUM@</p><p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>",
                    verzio: "2.1",
                    aktiv: true,
                    letrehozva: "2024-01-15",
                    modositva: "2024-10-01"
                },
                {
                    id: 2,
                    kod: "VEG-002",
                    nev: "Végzés - Eljárás felfüggesztése",
                    leiras: "Eljárás felfüggesztését elrendelő végzés",
                    tartalom: "<h3>VÉGZÉS</h3><p><strong>Tárgy:</strong> Eljárás felfüggesztése</p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><p>@SZERVEZET@ az eljárást felfüggeszti.</p><h4>Indokolás:</h4><p>@INDOKLAS@</p><p>Kelt: @DATUM@</p>",
                    verzio: "1.0",
                    aktiv: true,
                    letrehozva: "2024-02-10",
                    modositva: "2024-09-15"
                }
            ],
            hatarozat: [
                {
                    id: 1,
                    kod: "HAT-001",
                    nev: "Határozat - Engedélyező",
                    leiras: "Engedélyező határozat sablon",
                    tartalom: "<h3>HATÁROZAT</h3><p><strong>Határozat száma:</strong> @HATAROZAT_SZAM@</p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><h4>RENDELKEZŐ RÉSZ</h4><p>@SZERVEZET@ a kérelmet ENGEDÉLYEZI.</p><h4>INDOKOLÁS</h4><p>@INDOKLAS@</p><p>A határozat ellen 15 napon belül fellebbezéssel lehet élni.</p><p>Kelt: @DATUM@</p><p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>",
                    verzio: "1.8",
                    aktiv: true,
                    letrehozva: "2024-01-10",
                    modositva: "2024-09-20"
                },
                {
                    id: 2,
                    kod: "HAT-002",
                    nev: "Határozat - Elutasító",
                    leiras: "Elutasító határozat sablon",
                    tartalom: "<h3>HATÁROZAT</h3><p><strong>Határozat száma:</strong> @HATAROZAT_SZAM@</p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><h4>RENDELKEZŐ RÉSZ</h4><p>@SZERVEZET@ a kérelmet ELUTASÍTJA.</p><h4>INDOKOLÁS</h4><p>@INDOKLAS@</p><p>A határozat ellen 15 napon belül fellebbezéssel lehet élni.</p><p>Kelt: @DATUM@</p>",
                    verzio: "1.5",
                    aktiv: true,
                    letrehozva: "2024-01-10",
                    modositva: "2024-09-20"
                }
            ],
            igazolas: [
                {
                    id: 1,
                    kod: "IGA-001",
                    nev: "Igazolás - Vasútegészségügyi alkalmassági",
                    leiras: "Vasútegészségügyi alkalmassági igazolás",
                    tartalom: "<h3>IGAZOLÁS</h3><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><p>Igazoljuk, hogy <strong>@UGYFEL_NEV@</strong> vasútegészségügyi előzetes alkalmassági vizsgálaton megfelelt.</p><p>Kiállítva: @DATUM@<br>Érvényes: @HATARIDO@</p><p>@SZERVEZET@</p>",
                    verzio: "1.2",
                    aktiv: true,
                    letrehozva: "2024-03-01",
                    modositva: "2024-09-10"
                }
            ],
            tajekoztatas: [
                {
                    id: 1,
                    kod: "TAJ-001",
                    nev: "Tájékoztatás - Általános",
                    leiras: "Általános tájékoztató levél sablon",
                    tartalom: "<h3>TÁJÉKOZTATÁS</h3><p><strong>Címzett:</strong> @UGYFEL_NEV@</p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><p>Tisztelt @UGYFEL_NEV@!</p><p>Tájékoztatjuk, hogy @INDOKLAS@</p><p>Kelt: @DATUM@</p><p>@UGYINTEZO_NEV@<br>@UGYINTEZO_BEOSZTAS@</p>",
                    verzio: "1.0",
                    aktiv: true,
                    letrehozva: "2024-04-15",
                    modositva: "2024-09-05"
                }
            ],
            hirdetmeny: [
                {
                    id: 1,
                    kod: "HIR-001",
                    nev: "Hirdetmény - Közlemény",
                    leiras: "Hirdetményi úton történő értesítés",
                    tartalom: "<h3>HIRDETMÉNY</h3><p><strong>@SZERVEZET@</strong></p><p><strong>Ügyazonosító:</strong> @UGYAZONOSITO@</p><p>Hirdetményi úton értesítjük az érintetteket, hogy @INDOKLAS@</p><p>A hirdetmény kifüggesztve: @DATUM@</p>",
                    verzio: "1.0",
                    aktiv: true,
                    letrehozva: "2024-05-20",
                    modositva: "2024-08-30"
                }
            ]
        },

        // Workflow sablonok - Teljes kidolgozás alfolyamat támogatással
        workflow_sablonok: [
            {
                id: 1,
                kod: "WF-V044-001",
                nev: "Normál eljárás - Vasúti járművezetők",
                ugytipus: "V-044",
                tipus: "alapertelmezett",
                leiras: "Alapértelmezett teljes eljárási folyamat vasúti járművezetők előzetes alkalmassági vizsgálatához",
                aktiv: true,
                alapertelmezett: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-1778",
                        nev: "Érkeztetés",
                        sorrend: 1,
                        tipus: "automatikus",
                        funkciokod: "F-0078",
                        kotelezo: true,
                        leiras: "Kérelem automatikus érkeztetése az EKEIDR rendszerben"
                    },
                    {
                        id: 2,
                        uce: "UCE-1793",
                        nev: "Hatáskör és illetékesség vizsgálata",
                        sorrend: 2,
                        tipus: "feldolgozas",
                        funkciokod: "F-0064",
                        kotelezo: true,
                        leiras: "Ellenőrzési lista alapján hatáskör vizsgálat",
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "hataskor_eredmeny",
                            utvonalak: [
                                {
                                    ertek: "biztositott",
                                    nev: "Hatáskör biztosított",
                                    kovetkezo_uce: "UCE-1799"
                                },
                                {
                                    ertek: "nem_biztositott",
                                    nev: "Hatáskör nem biztosított",
                                    kovetkezo_uce: "LEZARAS"
                                }
                            ]
                        }
                    },
                    {
                        id: 3,
                        uce: "UCE-1799",
                        nev: "Formai megfelelőség vizsgálata",
                        sorrend: 3,
                        tipus: "feldolgozas",
                        funkciokod: "F-0065",
                        kotelezo: true,
                        leiras: "Formailag kötelező mellékletek és adatok ellenőrzése",
                        alfolyamat_beepites: {
                            enabled: true,
                            opcio: [
                                {
                                    feltetel: "formai_hiba_van",
                                    alfolyamat_kod: "SUB-001",
                                    visszateres_uce: "UCE-1794"
                                }
                            ]
                        },
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "formai_vizsgalat",
                            utvonalak: [
                                {
                                    ertek: "megfelelt",
                                    nev: "Formailag megfelelt",
                                    kovetkezo_uce: "UCE-1794"
                                },
                                {
                                    ertek: "hianypotlas",
                                    nev: "Hiánypótlás szükséges",
                                    alfolyamat: "SUB-001"
                                }
                            ]
                        }
                    },
                    {
                        id: 4,
                        uce: "UCE-1794",
                        nev: "Tartalmi megfelelőség vizsgálata",
                        sorrend: 4,
                        tipus: "feldolgozas",
                        funkciokod: "F-0066",
                        kotelezo: true,
                        leiras: "Kérelem tartalmának szakmai vizsgálata",
                        alfolyamat_beepites: {
                            enabled: true,
                            opcio: [
                                {
                                    feltetel: "tartalmi_hiba",
                                    alfolyamat_kod: "SUB-001",
                                    visszateres_uce: "UCE-1800"
                                },
                                {
                                    feltetel: "tenyallas_tisztazas_kell",
                                    alfolyamat_kod: "SUB-002",
                                    visszateres_uce: "UCE-1800"
                                }
                            ]
                        },
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "tartalmi_vizsgalat",
                            utvonalak: [
                                {
                                    ertek: "megfelelt",
                                    nev: "Tartalmában megfelelt",
                                    kovetkezo_uce: "UCE-1800"
                                },
                                {
                                    ertek: "hianypotlas",
                                    nev: "Hiánypótlás",
                                    alfolyamat: "SUB-001"
                                },
                                {
                                    ertek: "tenyallas",
                                    nev: "Tényállás tisztázás",
                                    alfolyamat: "SUB-002"
                                }
                            ]
                        }
                    },
                    {
                        id: 5,
                        uce: "UCE-1800",
                        nev: "Sommás eljárás alkalmazhatósága",
                        sorrend: 5,
                        tipus: "dontes",
                        funkciokod: "F-0088",
                        kotelezo: true,
                        leiras: "Döntés a sommás vagy teljes eljárás alkalmazásáról",
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "eljaras_tipus",
                            utvonalak: [
                                {
                                    ertek: "sommas",
                                    nev: "Sommás eljárás (8 munkanap)",
                                    kovetkezo_uce: "UCE-1826",
                                    hatarido_nap: 8
                                },
                                {
                                    ertek: "teljes",
                                    nev: "Teljes eljárás (60 munkanap)",
                                    kovetkezo_uce: "UCE-1826",
                                    hatarido_nap: 60
                                }
                            ]
                        }
                    },
                    {
                        id: 6,
                        uce: "UCE-1826",
                        nev: "Döntési javaslat elkészítése",
                        sorrend: 6,
                        tipus: "feldolgozas",
                        funkciokod: "F-0074",
                        kotelezo: true,
                        leiras: "Érdemi döntési javaslat összeállítása"
                    },
                    {
                        id: 7,
                        uce: "UCE-1824",
                        nev: "Döntési javaslat véleményezése",
                        sorrend: 7,
                        tipus: "feldolgozas",
                        funkciokod: "F-0096",
                        kotelezo: false,
                        leiras: "Javaslat belső véleményeztetése"
                    },
                    {
                        id: 8,
                        uce: "UCE-1815",
                        nev: "Vezetői döntés",
                        sorrend: 8,
                        tipus: "dontes",
                        funkciokod: "F-0099",
                        kotelezo: true,
                        leiras: "Döntéshozó vezetői jóváhagyás",
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "vezetoi_dontes",
                            utvonalak: [
                                {
                                    ertek: "jovahagyva",
                                    nev: "Jóváhagyva",
                                    kovetkezo_uce: "UCE-1828"
                                },
                                {
                                    ertek: "visszakuldve",
                                    nev: "Visszaküldve módosításra",
                                    kovetkezo_uce: "UCE-1826"
                                }
                            ]
                        }
                    },
                    {
                        id: 9,
                        uce: "UCE-1828",
                        nev: "Ügy lezárása",
                        sorrend: 9,
                        tipus: "lezaras",
                        funkciokod: "F-0097",
                        kotelezo: true,
                        leiras: "Határozat kiadmányozása és ügy lezárása",
                        utolso_lepes: true
                    }
                ],
                utolso_modositas: "2024-10-06",
                modositotta: "Dr. Szabó Péter"
            },
            {
                id: 2,
                kod: "WF-V044-002",
                nev: "Sommás eljárás - Vasúti járművezetők",
                ugytipus: "V-044",
                tipus: "sommas",
                leiras: "Gyorsított sommás eljárás egyszerű esetekhez (8 munkanap)",
                aktiv: true,
                alapertelmezett: false,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-1778",
                        nev: "Érkeztetés",
                        sorrend: 1,
                        tipus: "automatikus",
                        funkciokod: "F-0078",
                        kotelezo: true
                    },
                    {
                        id: 2,
                        uce: "UCE-1793",
                        nev: "Hatáskör vizsgálat",
                        sorrend: 2,
                        tipus: "feldolgozas",
                        funkciokod: "F-0064",
                        kotelezo: true
                    },
                    {
                        id: 3,
                        uce: "UCE-1799",
                        nev: "Gyorsított ellenőrzés",
                        sorrend: 3,
                        tipus: "feldolgozas",
                        funkciokod: "F-0065, F-0066",
                        kotelezo: true,
                        leiras: "Kombinált formai és tartalmi vizsgálat"
                    },
                    {
                        id: 4,
                        uce: "UCE-1826",
                        nev: "Döntés elkészítése",
                        sorrend: 4,
                        tipus: "feldolgozas",
                        funkciokod: "F-0074",
                        kotelezo: true
                    },
                    {
                        id: 5,
                        uce: "UCE-1828",
                        nev: "Lezárás",
                        sorrend: 5,
                        tipus: "lezaras",
                        funkciokod: "F-0097",
                        kotelezo: true,
                        utolso_lepes: true
                    }
                ],
                utolso_modositas: "2024-09-10",
                modositotta: "Dr. Nagy Andrea"
            },
            {
                id: 3,
                kod: "WF-H052-001",
                nev: "Normál eljárás - Hajózási létesítmények",
                ugytipus: "H-052",
                tipus: "alapertelmezett",
                leiras: "Alapértelmezett eljárás hajózási létesítmények engedélyezéséhez",
                aktiv: true,
                alapertelmezett: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-1983",
                        nev: "Hatáskör vizsgálat",
                        sorrend: 1,
                        tipus: "feldolgozas",
                        funkciokod: "F-0064",
                        kotelezo: true
                    },
                    {
                        id: 2,
                        uce: "UCE-1987",
                        nev: "Formai ellenőrzés",
                        sorrend: 2,
                        tipus: "feldolgozas",
                        funkciokod: "F-0065",
                        kotelezo: true,
                        alfolyamat_beepites: {
                            enabled: true,
                            opcio: [
                                {
                                    feltetel: "formai_hiba",
                                    alfolyamat_kod: "SUB-001",
                                    visszateres_uce: "UCE-1988"
                                }
                            ]
                        },
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "formai_eredmeny",
                            utvonalak: [
                                {
                                    ertek: "megfelelt",
                                    kovetkezo_uce: "UCE-1988"
                                },
                                {
                                    ertek: "hianyos",
                                    alfolyamat: "SUB-001"
                                }
                            ]
                        }
                    },
                    {
                        id: 3,
                        uce: "UCE-1988",
                        nev: "Tartalmi vizsgálat",
                        sorrend: 3,
                        tipus: "feldolgozas",
                        funkciokod: "F-0066",
                        kotelezo: true,
                        alfolyamat_beepites: {
                            enabled: true,
                            opcio: [
                                {
                                    feltetel: "helyszini_szemle_szukseges",
                                    alfolyamat_kod: "SUB-004",
                                    visszateres_uce: "UCE-2020"
                                },
                                {
                                    feltetel: "szakhatos_szukseges",
                                    alfolyamat_kod: "SUB-003",
                                    visszateres_uce: "UCE-2020"
                                }
                            ]
                        },
                        elagazas: {
                            tipus: "dontes",
                            feltetel: "tartalmi_eredmeny",
                            utvonalak: [
                                {
                                    ertek: "megfelelt",
                                    kovetkezo_uce: "UCE-2020"
                                },
                                {
                                    ertek: "helyszini_szemle",
                                    alfolyamat: "SUB-004"
                                },
                                {
                                    ertek: "szakhatos",
                                    alfolyamat: "SUB-003"
                                }
                            ]
                        }
                    },
                    {
                        id: 4,
                        uce: "UCE-2020",
                        nev: "Döntési javaslat",
                        sorrend: 4,
                        tipus: "feldolgozas",
                        funkciokod: "F-0074",
                        kotelezo: true
                    },
                    {
                        id: 5,
                        uce: "UCE-2018",
                        nev: "Javaslat véleményezése",
                        sorrend: 5,
                        tipus: "feldolgozas",
                        funkciokod: "F-0096",
                        kotelezo: true
                    },
                    {
                        id: 6,
                        uce: "UCE-2022",
                        nev: "Ügy lezárása",
                        sorrend: 6,
                        tipus: "lezaras",
                        funkciokod: "F-0097",
                        kotelezo: true,
                        utolso_lepes: true
                    },
                    {
                        id: 7,
                        uce: "UCE-2023",
                        nev: "Nyilvántartás frissítése",
                        sorrend: 7,
                        tipus: "automatikus",
                        funkciokod: "F-0106",
                        kotelezo: true,
                        leiras: "HNY501 nyilvántartás automatikus frissítése"
                    }
                ],
                utolso_modositas: "2024-10-05",
                modositotta: "Dr. Kiss László"
            }
        ],

        // Díjtételek (F-0070 Díjkalkulátor, F-0082 Díjbekérő)
        dijtetelek: {
            V_044: {
                ugytipus: "V-044",
                megnevezes: "Vasúti járművezetők előzetes alkalmassági vizsgálata",
                dijak: [
                    {
                        id: 1,
                        megnevezes: "Előzetes alkalmassági vizsgálat alapdíja",
                        osszeg: 12000,
                        tipus: "alapdij",
                        kotelezo: true,
                        aktiv: true,
                        megjegyzes: "Mozdonyvezetői, vontató- és motorkocsivezetői alapvizsgálat díja"
                    },
                    {
                        id: 2,
                        megnevezes: "Gyorsított eljárás pótdíja",
                        osszeg: 25000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Sommás eljárás esetén alkalmazandó, 8 napos határidő"
                    },
                    {
                        id: 3,
                        megnevezes: "Ismételt vizsgálat díja",
                        osszeg: 8000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Ismételt benyújtás esetén (korábban elutasított kérelem)"
                    },
                    {
                        id: 4,
                        megnevezes: "Plusz kategória vizsgálati díja",
                        osszeg: 6000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Második vagy további járműkategória egyidejű vizsgálata"
                    }
                ],
                kedvezmenyek: [
                    {
                        id: 1,
                        megnevezes: "Munkahelyi átképzés keretében történő vizsgálat",
                        szazalek: 30,
                        aktiv: true
                    },
                    {
                        id: 2,
                        megnevezes: "MÁV-START Zrt. dolgozó",
                        szazalek: 20,
                        aktiv: true
                    }
                ],
                utolso_modositas: "2024-01-01",
                ervenyesseg_kezdete: "2024-01-01",
                jogszabaly: "123/2023. (XII. 15.) Korm. rendelet"
            },
            H_052: {
                ugytipus: "H-052",
                megnevezes: "Országos közforgalmú kikötő létesítése",
                dijak: [
                    {
                        id: 1,
                        megnevezes: "Kikötő létesítési engedély alapdíja",
                        osszeg: 150000,
                        tipus: "alapdij",
                        kotelezo: true,
                        aktiv: true,
                        megjegyzes: "Országos közforgalmú kikötő létesítésének alapdíja"
                    },
                    {
                        id: 2,
                        megnevezes: "Határkikötő létesítési pótdíja",
                        osszeg: 80000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Határátkelőhellyel rendelkező kikötő esetén"
                    },
                    {
                        id: 3,
                        megnevezes: "Helyszíni szemle díja",
                        osszeg: 45000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Ha helyszíni szemle szükséges az engedélyezéshez"
                    },
                    {
                        id: 4,
                        megnevezes: "Szakhatósági megkeresés adminisztrációs díja (db)",
                        osszeg: 15000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Szakhatóságonként számítva (vízügy, környezetvédelem, építésügy)"
                    },
                    {
                        id: 5,
                        megnevezes: "Gyorsított eljárás pótdíja",
                        osszeg: 100000,
                        tipus: "potdij",
                        kotelezo: false,
                        aktiv: true,
                        megjegyzes: "Sommás eljárás esetén alkalmazandó, 8 napos határidő"
                    }
                ],
                kedvezmenyek: [
                    {
                        id: 1,
                        megnevezes: "Állami tulajdonú kikötő",
                        szazalek: 40,
                        aktiv: true
                    },
                    {
                        id: 2,
                        megnevezes: "Önkormányzati tulajdonú kikötő",
                        szazalek: 30,
                        aktiv: true
                    }
                ],
                utolso_modositas: "2024-01-01",
                ervenyesseg_kezdete: "2024-01-01",
                jogszabaly: "45/2024. (II. 20.) Korm. rendelet"
            }
        },

        // Alfolyamatok (Subprocesses)
        alfolyamatok: [
            {
                id: 1,
                kod: "SUB-001",
                nev: "Hiánypótlási felszólítás",
                funkciokod: "F-0100, F-0101",
                leiras: "Ügyféltől hiányzó dokumentumok vagy adatok bekérése",
                ugytipusok: ["V-044", "H-052"],
                ismetelheto: true,
                max_ismetles: 2,
                aktiv: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-HP-001",
                        nev: "Hiányok azonosítása",
                        sorrend: 1,
                        tipus: "feldolgozas",
                        funkciokod: null,
                        kotelezo: true,
                        leiras: "Ügyintéző azonosítja a hiányzó dokumentumokat/adatokat"
                    },
                    {
                        id: 2,
                        uce: "UCE-HP-002",
                        nev: "Hiánypótlási felszólítás készítése",
                        sorrend: 2,
                        tipus: "dokumentum_generalas",
                        funkciokod: "F-0100",
                        kotelezo: true,
                        dokumentum_sablon: "vegzes_hianypotlas",
                        leiras: "Végzés készítése a hiánypótlási felszólításról"
                    },
                    {
                        id: 3,
                        uce: "UCE-HP-003",
                        nev: "Határidő meghatározása",
                        sorrend: 3,
                        tipus: "hatarido_beallitas",
                        kotelezo: true,
                        hataridok: ["hianypotlas_hatarido"],
                        leiras: "Hiánypótlásra megadott határidő beállítása"
                    },
                    {
                        id: 4,
                        uce: "UCE-HP-004",
                        nev: "Ügyfél értesítése",
                        sorrend: 4,
                        tipus: "ertesites",
                        funkciokod: "F-0089",
                        kotelezo: true,
                        leiras: "Ügyfél értesítése a hiánypótlási felszólításról"
                    },
                    {
                        id: 5,
                        uce: "UCE-HP-005",
                        nev: "Várakozás ügyfél válaszra",
                        sorrend: 5,
                        tipus: "varakozas",
                        kotelezo: true,
                        max_varakozas_nap: 15,
                        leiras: "Ügy felfüggesztve, várakozás az ügyfél válaszára"
                    },
                    {
                        id: 6,
                        uce: "UCE-HP-006",
                        nev: "Hiánypótlás beérkezése",
                        sorrend: 6,
                        tipus: "befogadas",
                        funkciokod: "F-0101",
                        kotelezo: true,
                        leiras: "Ügyfél hiánypótlása beérkezett, regisztrálása"
                    },
                    {
                        id: 7,
                        uce: "UCE-HP-007",
                        nev: "Hiánypótlás értékelése",
                        sorrend: 7,
                        tipus: "dontes",
                        kotelezo: true,
                        elagazas: {
                            feltetel: "hianypotlas_teljes",
                            utvonalak: [
                                {
                                    ertek: "teljes",
                                    nev: "Hiánypótlás teljes - visszatérés fő folyamatba",
                                    vissza_fo_folyamat: true
                                },
                                {
                                    ertek: "reszleges",
                                    nev: "Hiánypótlás részleges - újabb felszólítás",
                                    ismetles: true
                                },
                                {
                                    ertek: "lejart",
                                    nev: "Határidő lejárt - elutasítás",
                                    kovetkezo_uce: "UCE-1990"
                                }
                            ]
                        },
                        leiras: "Beérkezett hiánypótlás teljesség-vizsgálata"
                    }
                ],
                beepitesi_pontok: [
                    {
                        uce: "UCE-1993",
                        nev: "Formai ellenőrzés után",
                        ugytipus: "V-044",
                        feltetel: "formai_hiba_van"
                    },
                    {
                        uce: "UCE-1994",
                        nev: "Tartalmi ellenőrzés után",
                        ugytipus: "V-044",
                        feltetel: "tartalmi_hiba_van"
                    },
                    {
                        uce: "UCE-1987",
                        nev: "Formai ellenőrzés után",
                        ugytipus: "H-052",
                        feltetel: "formai_hiba_van"
                    }
                ],
                utolso_modositas: "2024-10-01",
                modositotta: "Dr. Szabó Péter"
            },
            {
                id: 2,
                kod: "SUB-002",
                nev: "Tényállás tisztázása",
                funkciokod: "F-0102, F-0104",
                leiras: "További információk, tisztázó kérdések feltevése az ügyfélnek",
                ugytipusok: ["V-044", "H-052"],
                ismetelheto: true,
                max_ismetles: 3,
                aktiv: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-TT-001",
                        nev: "Tisztázandó kérdések meghatározása",
                        sorrend: 1,
                        tipus: "feldolgozas",
                        funkciokod: "F-0102",
                        kotelezo: true,
                        leiras: "Ügyintéző megfogalmazza a tisztázandó kérdéseket"
                    },
                    {
                        id: 2,
                        uce: "UCE-TT-002",
                        nev: "Tényállás tisztázás dokumentum készítése",
                        sorrend: 2,
                        tipus: "dokumentum_generalas",
                        funkciokod: "F-0102",
                        kotelezo: true,
                        dokumentum_sablon: "vegzes_tenyallas",
                        leiras: "Végzés a tényállás tisztázásáról"
                    },
                    {
                        id: 3,
                        uce: "UCE-TT-003",
                        nev: "Határidő meghatározása",
                        sorrend: 3,
                        tipus: "hatarido_beallitas",
                        kotelezo: true,
                        hataridok: ["tenyallas_tisztazas_hatarido"],
                        leiras: "Válaszadási határidő beállítása"
                    },
                    {
                        id: 4,
                        uce: "UCE-TT-004",
                        nev: "Ügyfél értesítése",
                        sorrend: 4,
                        tipus: "ertesites",
                        funkciokod: "F-0089",
                        kotelezo: true,
                        leiras: "Kérdések továbbítása az ügyfélnek"
                    },
                    {
                        id: 5,
                        uce: "UCE-TT-005",
                        nev: "Várakozás válaszra",
                        sorrend: 5,
                        tipus: "varakozas",
                        kotelezo: true,
                        max_varakozas_nap: 15,
                        leiras: "Ügy felfüggesztve a válaszra várva"
                    },
                    {
                        id: 6,
                        uce: "UCE-TT-006",
                        nev: "Válasz beérkezése",
                        sorrend: 6,
                        tipus: "befogadas",
                        funkciokod: "F-0104",
                        kotelezo: true,
                        leiras: "Ügyfél válaszainak rögzítése"
                    },
                    {
                        id: 7,
                        uce: "UCE-TT-007",
                        nev: "Válaszok értékelése",
                        sorrend: 7,
                        tipus: "dontes",
                        kotelezo: true,
                        elagazas: {
                            feltetel: "valaszok_elegendoek",
                            utvonalak: [
                                {
                                    ertek: "elegendo",
                                    nev: "Tényállás tisztázott - folytatás",
                                    vissza_fo_folyamat: true
                                },
                                {
                                    ertek: "nem_elegendo",
                                    nev: "További kérdések szükségesek",
                                    ismetles: true
                                },
                                {
                                    ertek: "nem_valaszolt",
                                    nev: "Nem érkezett válasz - elutasítás",
                                    kovetkezo_uce: "UCE-1990"
                                }
                            ]
                        },
                        leiras: "Válaszok megfelelőségének vizsgálata"
                    }
                ],
                beepitesi_pontok: [
                    {
                        uce: "UCE-1994",
                        nev: "Tartalmi ellenőrzés után",
                        ugytipus: "V-044",
                        feltetel: "tisztazas_szukseges"
                    },
                    {
                        uce: "UCE-1826",
                        nev: "Döntési javaslat előtt",
                        ugytipus: "V-044",
                        feltetel: "kiegeszito_info_kell"
                    }
                ],
                utolso_modositas: "2024-09-15",
                modositotta: "Dr. Nagy Andrea"
            },
            {
                id: 3,
                kod: "SUB-003",
                nev: "Szakhatósági megkeresés",
                funkciokod: "F-0103",
                leiras: "Szakhatóság állásfoglalásának beszerzése",
                ugytipusok: ["H-052"],
                ismetelheto: false,
                max_ismetles: 1,
                aktiv: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-SZH-001",
                        nev: "Szakhatóság meghatározása",
                        sorrend: 1,
                        tipus: "feldolgozas",
                        kotelezo: true,
                        leiras: "Illetékes szakhatóság azonosítása"
                    },
                    {
                        id: 2,
                        uce: "UCE-SZH-002",
                        nev: "Megkeresés készítése",
                        sorrend: 2,
                        tipus: "dokumentum_generalas",
                        funkciokod: "F-0103",
                        kotelezo: true,
                        dokumentum_sablon: "megkereso_level",
                        leiras: "Megkereső levél összeállítása"
                    },
                    {
                        id: 3,
                        uce: "UCE-SZH-003",
                        nev: "Megkeresés elküldése",
                        sorrend: 3,
                        tipus: "kuldes",
                        kotelezo: true,
                        leiras: "Megkeresés továbbítása a szakhatósághoz"
                    },
                    {
                        id: 4,
                        uce: "UCE-SZH-004",
                        nev: "Várakozás szakhatósági álláspontra",
                        sorrend: 4,
                        tipus: "varakozas",
                        kotelezo: true,
                        max_varakozas_nap: 30,
                        leiras: "Ügy felfüggesztve szakhatósági állásfoglalásra várva"
                    },
                    {
                        id: 5,
                        uce: "UCE-SZH-005",
                        nev: "Szakhatósági állásfoglalás beérkezése",
                        sorrend: 5,
                        tipus: "befogadas",
                        kotelezo: true,
                        leiras: "Szakhatósági álláspont rögzítése az ügyhöz"
                    },
                    {
                        id: 6,
                        uce: "UCE-SZH-006",
                        nev: "Álláspont értékelése",
                        sorrend: 6,
                        tipus: "dontes",
                        kotelezo: true,
                        elagazas: {
                            feltetel: "szakhatos_allaspont",
                            utvonalak: [
                                {
                                    ertek: "pozitiv",
                                    nev: "Pozitív álláspont - folytatás",
                                    vissza_fo_folyamat: true
                                },
                                {
                                    ertek: "felteteles",
                                    nev: "Feltételes álláspont - feltételek rögzítése",
                                    vissza_fo_folyamat: true
                                },
                                {
                                    ertek: "negativ",
                                    nev: "Negatív álláspont - elutasítás",
                                    kovetkezo_uce: "UCE-1990"
                                }
                            ]
                        },
                        leiras: "Szakhatósági állásfoglalás feldolgozása"
                    }
                ],
                beepitesi_pontok: [
                    {
                        uce: "UCE-1988",
                        nev: "Tartalmi vizsgálat után (H-052)",
                        ugytipus: "H-052",
                        feltetel: "szakhatos_kell"
                    },
                    {
                        uce: "UCE-2020",
                        nev: "Döntési javaslat előtt (H-052)",
                        ugytipus: "H-052",
                        feltetel: "szakhatos_szukseges"
                    }
                ],
                utolso_modositas: "2024-08-20",
                modositotta: "Dr. Kiss László"
            },
            {
                id: 4,
                kod: "SUB-004",
                nev: "Helyszíni szemle",
                funkciokod: "F-0105",
                leiras: "Helyszíni vizsgálat lefolytatása",
                ugytipusok: ["H-052"],
                ismetelheto: true,
                max_ismetles: 2,
                aktiv: true,
                lepesek: [
                    {
                        id: 1,
                        uce: "UCE-HSZ-001",
                        nev: "Szemle időpontjának egyeztetése",
                        sorrend: 1,
                        tipus: "koordinacio",
                        kotelezo: true,
                        leiras: "Időpont egyeztetése az ügyféllel"
                    },
                    {
                        id: 2,
                        uce: "UCE-HSZ-002",
                        nev: "Értesítés kiküldése",
                        sorrend: 2,
                        tipus: "ertesites",
                        funkciokod: "F-0089",
                        kotelezo: true,
                        leiras: "Ügyfél értesítése a szemle időpontjáról"
                    },
                    {
                        id: 3,
                        uce: "UCE-HSZ-003",
                        nev: "Helyszíni szemle lefolytatása",
                        sorrend: 3,
                        tipus: "terep_munka",
                        funkciokod: "F-0105",
                        kotelezo: true,
                        leiras: "Helyszíni vizsgálat végrehajtása"
                    },
                    {
                        id: 4,
                        uce: "UCE-HSZ-004",
                        nev: "Jegyzőkönyv készítése",
                        sorrend: 4,
                        tipus: "dokumentum_generalas",
                        kotelezo: true,
                        dokumentum_sablon: "jegyzokonyv_szemle",
                        leiras: "Helyszíni szemle jegyzőkönyvének elkészítése"
                    },
                    {
                        id: 5,
                        uce: "UCE-HSZ-005",
                        nev: "Szemle eredményének értékelése",
                        sorrend: 5,
                        tipus: "dontes",
                        kotelezo: true,
                        elagazas: {
                            feltetel: "szemle_eredmeny",
                            utvonalak: [
                                {
                                    ertek: "megfelelo",
                                    nev: "Helyszín megfelel - folytatás",
                                    vissza_fo_folyamat: true
                                },
                                {
                                    ertek: "javitando",
                                    nev: "Javítások szükségesek - hiánypótlás",
                                    kovetkezo_alfolyamat: "SUB-001"
                                },
                                {
                                    ertek: "alkalmatlan",
                                    nev: "Helyszín alkalmatlan - elutasítás",
                                    kovetkezo_uce: "UCE-1990"
                                }
                            ]
                        },
                        leiras: "Helyszíni állapot értékelése"
                    }
                ],
                beepitesi_pontok: [
                    {
                        uce: "UCE-1988",
                        nev: "Tartalmi vizsgálat után (H-052)",
                        ugytipus: "H-052",
                        feltetel: "helyszini_szemle_szukseges"
                    }
                ],
                utolso_modositas: "2024-09-30",
                modositotta: "Dr. Tóth Balázs"
            }
        ],

        // Felhasználók
        felhasznalok: [
            {
                id: 1,
                azonosito: "EKM001",
                nev: "Dr. Szabó Péter",
                email: "szabo.peter@ekm.gov.hu",
                szerepkor: "VHF_UGYINTEZO",
                szervezet: "Építési és Közlekedési Minisztérium",
                osztaly: "Vasúti Hatósági Főosztály",
                aktiv: true,
                letrehozva: "2023-01-15",
                utolso_belepes: "2024-10-04 08:30"
            },
            {
                id: 2,
                azonosito: "EKM002",
                nev: "Dr. Nagy Andrea",
                email: "nagy.andrea@ekm.gov.hu",
                szerepkor: "VHF_DONTESHOZO",
                szervezet: "Építési és Közlekedési Minisztérium",
                osztaly: "Vasúti Hatósági Főosztály",
                beosztás: "Főosztályvezető-helyettes",
                aktiv: true,
                letrehozva: "2023-01-15",
                utolso_belepes: "2024-10-04 09:15"
            },
            {
                id: 3,
                azonosito: "ADMIN001",
                nev: "Rendszergazda",
                email: "admin@vahap.gov.hu",
                szerepkor: "VHF_ADMIN",
                szervezet: "Építési és Közlekedési Minisztérium",
                osztaly: "IT Főosztály",
                aktiv: true,
                letrehozva: "2023-01-10",
                utolso_belepes: "2024-10-04 07:45"
            }
        ],

        // Szerepkörök és jogosultságok
        szerepkorok: [
            {
                kod: "VHF_ADMIN",
                nev: "Rendszergazda",
                leiras: "Teljes hozzáférés az összes modulhoz és funkcióhoz",
                jogosultsagok: [
                    "parameterezo.*",
                    "felhasznalok.*",
                    "szerepkorok.*",
                    "rendszer_beallitasok.*",
                    "audit_log.read"
                ],
                szin: "danger"
            },
            {
                kod: "VHF_DONTESHOZO",
                nev: "Döntéshozó",
                leiras: "Vezetői döntések, véleményezés, workflow jóváhagyás",
                jogosultsagok: [
                    "ugykezeles.read",
                    "ugykezeles.donteshozatal",
                    "ugykezeles.velemenyezes",
                    "parameterezo.hataridok.read",
                    "parameterezo.workflow_sablonok.read"
                ],
                szin: "primary"
            },
            {
                kod: "VHF_UGYINTEZO",
                nev: "Ügyintéző",
                leiras: "Ügyek kezelése, ellenőrzések, döntés-előkészítés",
                jogosultsagok: [
                    "ugykezeles.*",
                    "parameterezo.ellenorzesi_listak.read",
                    "parameterezo.dokumentum_sablonok.read"
                ],
                szin: "info"
            },
            {
                kod: "UGYFEL",
                nev: "Ügyfél",
                leiras: "Kérelem benyújtása, ügykövetés",
                jogosultsagok: [
                    "kerelem.create",
                    "kerelem.read_own",
                    "hianypotlas.submit",
                    "dokumentumok.read_own"
                ],
                szin: "secondary"
            }
        ],

        // Statisztikák a dashboard-hoz
        statisztikak: {
            modulok_szama: 8,
            aktiv_sablonok: 24,
            felhasznalok_szama: 45,
            utolso_modositas: "2024-10-04 10:30"
        }
    },

    /**
     * VÉLEMÉNYEZÉSI RENDSZER MOCK ADATOK
     * A többszörös véleményezési workflow támogatására
     */
    velemenyezes: {
        // Lehetséges véleményezők
        velemenyezok: [
            {
                id: 'vezeto_1',
                nev: 'Dr. Nagy Andrea',
                beosztas: 'Osztályvezető',
                szervezet: 'Vasúti Hatósági Főosztály',
                email: 'nagy.andrea@ekm.gov.hu',
                telefon: '+36 1 795 1001',
                szerepkor: 'vezeto',
                szakmai_terulet: ['V-044', 'V-045', 'V-046', 'H-052'],
                aktiv: true
            },
            {
                id: 'szakerto_1',
                nev: 'Dr. Kiss Gábor',
                beosztas: 'Jogtanácsos',
                szervezet: 'Jogi Főosztály',
                email: 'kiss.gabor@ekm.gov.hu',
                telefon: '+36 1 795 1002',
                szerepkor: 'szakerto',
                szakmai_terulet: ['jogi', 'adminisztratív'],
                aktiv: true
            },
            {
                id: 'szakerto_2',
                nev: 'Dr. Tóth Katalin',
                beosztas: 'Orvos szakértő',
                szervezet: 'Vasútegészségügyi Osztály',
                email: 'toth.katalin@ekm.gov.hu',
                telefon: '+36 1 795 1003',
                szerepkor: 'szakerto',
                szakmai_terulet: ['vasútegészségügy', 'V-044'],
                aktiv: true
            },
            {
                id: 'ugyintezo_2',
                nev: 'Horváth János',
                beosztas: 'Ügyintéző',
                szervezet: 'Vasúti Hatósági Főosztály',
                email: 'horvath.janos@ekm.gov.hu',
                telefon: '+36 1 795 1004',
                szerepkor: 'ugyintezo',
                szakmai_terulet: ['V-046', 'V-047'],
                aktiv: true
            },
            {
                id: 'kulso_1',
                nev: 'Szabó Péter',
                beosztas: 'Külső szakértő',
                szervezet: 'KÖTI Közlekedéstudományi Intézet',
                email: 'szabo.peter@koti.hu',
                telefon: '+36 1 888 9999',
                szerepkor: 'kulso_szakerto',
                szakmai_terulet: ['közlekedésbiztonság', 'műszaki'],
                aktiv: true
            }
        ],

        // Véleményezésre küldött dokumentumok példái
        dokumentumok: [
            {
                id: 'DOK-2024-001',
                ugyazonosito: 'VAHAP-V-2024-001234',
                tipus: 'határozat',
                tipus_cim: 'Határozat tervezet - Alkalmassági vizsgálat engedélyezése',
                eloterjeszto: 'Dr. Szabó Péter',
                eloterjeszto_id: 'UI001',
                kuldve: '2024-10-25T10:30:00',
                hatarido: '2024-10-28T23:59:59',
                prioritas: 'suergo',
                statusz: 'velemenyezes_alatt', // 'szerkesztés_alatt', 'velemenyezes_alatt', 'velemenyezett', 'vegeleges'
                kisero_uzenet: 'Kérem sürgős véleményezését, mivel a kérelmező határideje közeleg. A dokumentum jogi szempontból ellenőrzésre került.',
                tartalom: `HATÁROZAT

Ügyazonosító: VAHAP-V-2024-001234

RENDELKEZŐ RÉSZ:

A benyújtott kérelem alapján engedélyezem Minta János (szül.: 1985.03.15.) részére a vasúti járművezető előzetes alkalmassági vizsgálatát.

Az engedély hatálya: 2024.11.01 - 2029.10.31 (5 év)

INDOKOLÁS:

A kérelmező megfelelt a 123/2023. (XII. 15.) Korm. rendelet szerinti előírásoknak...

JOGORVOSLAT:

Ezen határozat ellen 15 napon belül fellebbezés nyújtható be...`,

                // Véleményezők és vélemények
                velemenyezesek: [
                    {
                        id: 'VEL-001',
                        velemenyezo_id: 'vezeto_1',
                        statusz: 'valaszolt', // 'kiküldve', 'elolvasva', 'valaszolt'
                        kiküldve: '2024-10-25T10:30:00',
                        elolvasva: '2024-10-26T08:15:00',
                        valaszolt: '2024-10-26T09:30:00',
                        velemeny: {
                            allapot: 'elfogad', // 'elfogad', 'elutasit', 'megjegyzes'
                            szoveg: 'A határozat jogszerű, az indokolás megfelelő. Jóváhagyom.',
                            modositasok: [],
                            prioritas: 'normal'
                        },
                        ertekeles: {
                            figyelembe_veszi: true,
                            indoklas: 'Releváns és hasznos vezetői vélemény',
                            ertekelte: 'Dr. Szabó Péter',
                            datum: '2024-10-26T14:00:00'
                        }
                    },
                    {
                        id: 'VEL-002',
                        velemenyezo_id: 'szakerto_1',
                        statusz: 'valaszolt',
                        kiküldve: '2024-10-25T10:30:00',
                        elolvasva: '2024-10-26T10:00:00',
                        valaszolt: '2024-10-26T14:20:00',
                        velemeny: {
                            allapot: 'megjegyzes',
                            szoveg: 'Az indokolás részben jó, de az orvosi alkalmassági hivatkozást pontosítani kellene. Javaslom a 123/2023. (XII. 15.) Korm. rendelet konkrét §-ának megadását.',
                            modositasok: [
                                'Indokolás bővítése konkrét jogszabályi §-sal',
                                'Orvosi hivatkozás pontosítása'
                            ],
                            prioritas: 'magas'
                        },
                        ertekeles: {
                            figyelembe_veszi: true,
                            indoklas: 'Fontos jogi megjegyzés, be kell építeni a dokumentumba',
                            ertekelte: 'Dr. Szabó Péter',
                            datum: '2024-10-26T15:00:00'
                        }
                    },
                    {
                        id: 'VEL-003',
                        velemenyezo_id: 'ugyintezo_2',
                        statusz: 'kiküldve',
                        kiküldve: '2024-10-25T10:30:00',
                        elolvasva: null,
                        valaszolt: null,
                        velemeny: null,
                        ertekeles: null
                    }
                ],

                // Verziókezelés
                verziok: [
                    {
                        verzio: '1.0',
                        datum: '2024-10-25T09:00:00',
                        szerzo: 'Dr. Szabó Péter',
                        valtozasok: 'Eredeti verzió létrehozva'
                    }
                ]
            },
            {
                id: 'DOK-2024-002',
                ugyazonosito: 'VAHAP-V-2024-001235',
                tipus: 'vegzes',
                tipus_cim: 'Végzés tervezet - Hiánypótlási felszólítás',
                eloterjeszto: 'Nagy Andrea',
                eloterjeszto_id: 'UI002',
                kuldve: '2024-10-24T14:20:00',
                hatarido: '2024-10-27T23:59:59',
                prioritas: 'normal',
                statusz: 'velemenyezes_alatt',
                kisero_uzenet: 'A hiánypótlási lista véglegesítésre került, kérem véleményét.',
                tartalom: `VÉGZÉS - Hiánypótlási felszólítás

Ügyazonosító: VAHAP-V-2024-001235

RENDELKEZÉS:

Felhívom Teszt Erika kérelmezőt, hogy az alábbi hiányosságokat 15 napon belül pótolja:

1. Orvosi alkalmassági igazolás hiányzik
2. Képzési igazolás nem megfelelő formátumú
3. Személyi igazolvány másolat nem olvasható`,

                velemenyezesek: [
                    {
                        id: 'VEL-004',
                        velemenyezo_id: 'vezeto_1',
                        statusz: 'valaszolt',
                        kiküldve: '2024-10-24T14:20:00',
                        elolvasva: '2024-10-25T08:00:00',
                        valaszolt: '2024-10-25T10:00:00',
                        velemeny: {
                            allapot: 'elfogad',
                            szoveg: 'Egyetértek a hiánypótlási felszólítással. A felsorolt hiányosságok indokoltak.',
                            modositasok: []
                        },
                        ertekeles: null
                    }
                ],

                verziok: [
                    {
                        verzio: '1.0',
                        datum: '2024-10-24T13:00:00',
                        szerzo: 'Nagy Andrea',
                        valtozasok: 'Hiánypótlási végzés elkészítve'
                    }
                ]
            }
        ],

        // Véleményezési workflow állapotok
        velemenyezesi_allapotok: [
            { kod: 'kiküldve', label: 'Kiküldve', szin: 'info', ikon: 'bi-send' },
            { kod: 'elolvasva', label: 'Elolvasva', szin: 'warning', ikon: 'bi-envelope-open' },
            { kod: 'valaszolt', label: 'Véleményezve', szin: 'success', ikon: 'bi-check-circle' },
            { kod: 'lejart', label: 'Lejárt határidő', szin: 'danger', ikon: 'bi-clock' }
        ],

        // Vélemény típusok
        velemeny_tipusok: [
            { kod: 'elfogad', label: 'Elfogadom', szin: 'success', ikon: 'bi-check-circle' },
            { kod: 'elutasit', label: 'Elutasítom, módosítást kérek', szin: 'danger', ikon: 'bi-x-circle' },
            { kod: 'megjegyzes', label: 'Megjegyzéssel visszaküldöm', szin: 'warning', ikon: 'bi-chat-left-dots' }
        ],

        // Értékelési eredmények
        ertekeles_eredmenyek: [
            { kod: 'figyelembe_vesz', label: 'Figyelembe veszem', szin: 'success' },
            { kod: 'nem_vesz_figyelembe', label: 'Nem veszem figyelembe', szin: 'secondary' },
            { kod: 'reszben_figyelembe_vesz', label: 'Részben figyelembe veszem', szin: 'warning' }
        ],

        // Rugalmas workflow - véleményeztetési feladatok
        velemenyeztetes_feladatok: {
            // Belső felhasználói törzs (véleményezők)
            belsoFelhasznalok: [
                { id: 'UI001', nev: 'Dr. Szabó Péter', beosztas: 'Vezető ügyintéző', osztaly: 'Vasúti Hatósági Főosztály' },
                { id: 'UI002', nev: 'Nagy Andrea', beosztas: 'Ügyintéző', osztaly: 'Vasúti Hatósági Főosztály' },
                { id: 'UI003', nev: 'Kiss Péter', beosztas: 'Jogi szakreferens', osztaly: 'Jogi Osztály' },
                { id: 'UI004', nev: 'Tóth Gábor', beosztas: 'Műszaki szakértő', osztaly: 'Műszaki Osztály' },
                { id: 'VEZ001', nev: 'Dr. Kovács Anna', beosztas: 'Főosztályvezető', osztaly: 'Vasúti Hatósági Főosztály' },
                { id: 'VEZ002', nev: 'Dr. Horváth István', beosztas: 'Osztályvezető', osztaly: 'Jogi Osztály' }
            ],

            // Feladat típusok
            feladatTipusok: [
                { id: 'szakmai', nev: 'Szakmai véleményezés', icon: 'bi-clipboard-check' },
                { id: 'jogi', nev: 'Jogi véleményezés', icon: 'bi-scale' },
                { id: 'muszaki', nev: 'Műszaki véleményezés', icon: 'bi-gear' },
                { id: 'vezetoi', nev: 'Vezetői jóváhagyás', icon: 'bi-person-check' },
                { id: 'egyeb', nev: 'Egyéb', icon: 'bi-chat-dots' }
            ],

            // Aktív feladatok
            aktivFeladatok: [
                {
                    id: 'VEL-2025-001',
                    ugyazonosito: 'VAHAP-V-2024-001234',
                    feladatTipus: 'szakmai',
                    feladatNev: 'Dokumentum(ok) véleményezése - Alkalmassági vizsgálat',
                    leiras: 'Kérem véleményezzék a döntési javaslatot és a határozat tervezetet. A kérelmező minden feltételnek megfelelt, javasolt a pozitív döntés.',
                    hatarido: '2025-10-25',
                    kiadas_datum: '2025-10-17',
                    kiiro: { id: 'UI001', nev: 'Dr. Szabó Péter' },
                    cimzettek: [
                        {
                            id: 'UI002',
                            nev: 'Nagy Andrea',
                            statusz: 'kesz',
                            velemeny_datum: '2025-10-20',
                            velemeny: {
                                tipus: 'elfogadas',
                                szoveg: 'Egyetértek a döntési javaslattal. A határozat tervezet megfelelő, javaslom elfogadásra.',
                                modositas_szukseges: false
                            }
                        },
                        {
                            id: 'UI003',
                            nev: 'Kiss Péter',
                            statusz: 'folyamatban',
                            velemeny_datum: null,
                            velemeny: null
                        },
                        {
                            id: 'VEZ001',
                            nev: 'Dr. Kovács Anna',
                            statusz: 'varakozas',
                            velemeny_datum: null,
                            velemeny: null
                        }
                    ],
                    csatolmanyok: [
                        { nev: 'Döntési javaslat.pdf', meret: '245 KB', datum: '2025-10-17' },
                        { nev: 'Határozat tervezet.docx', meret: '128 KB', datum: '2025-10-17' }
                    ],
                    statusz: 'folyamatban',
                    early_warning_napok: [3, 2, 1],
                    sablon: false,
                    napok_hatra: 8
                },
                {
                    id: 'VEL-2025-002',
                    ugyazonosito: 'VAHAP-V-2024-001235',
                    feladatTipus: 'jogi',
                    feladatNev: 'Hiánypótlási végzés jogi véleményezése',
                    leiras: 'Kérem ellenőrizzék a hiánypótlási végzés jogi megalapozottságát.',
                    hatarido: '2025-10-22',
                    kiadas_datum: '2025-10-18',
                    kiiro: { id: 'UI002', nev: 'Nagy Andrea' },
                    cimzettek: [
                        {
                            id: 'UI003',
                            nev: 'Kiss Péter',
                            statusz: 'kesz',
                            velemeny_datum: '2025-10-19',
                            velemeny: {
                                tipus: 'modositas',
                                szoveg: 'A végzésben szerepeltetni kell az Ákr. 47. § hivatkozását is. Egyébként a dokumentum megfelelő.',
                                modositas_szukseges: true,
                                modositasi_javaslat: 'Kiegészítés: "Az Ákr. 47. § (1) bekezdése alapján..."'
                            }
                        }
                    ],
                    csatolmanyok: [
                        { nev: 'Hiánypótlási végzés tervezet.pdf', meret: '189 KB', datum: '2025-10-18' }
                    ],
                    statusz: 'modositas_szukseges',
                    early_warning_napok: [3, 2, 1],
                    sablon: false,
                    napok_hatra: 5
                },
                {
                    id: 'VEL-2025-003',
                    ugyazonosito: 'VAHAP-V-2024-001236',
                    feladatTipus: 'vezetoi',
                    feladatNev: 'Határozat kiadmányozás előtti jóváhagyás',
                    leiras: 'Kérem jóváhagyását a véglegesített határozathoz.',
                    hatarido: '2025-10-19',
                    kiadas_datum: '2025-10-17',
                    kiiro: { id: 'UI001', nev: 'Dr. Szabó Péter' },
                    cimzettek: [
                        {
                            id: 'VEZ001',
                            nev: 'Dr. Kovács Anna',
                            statusz: 'folyamatban',
                            velemeny_datum: null,
                            velemeny: null
                        }
                    ],
                    csatolmanyok: [
                        { nev: 'Végleges határozat.pdf', meret: '312 KB', datum: '2025-10-17' }
                    ],
                    statusz: 'surgos',
                    early_warning_napok: [3, 2, 1],
                    sablon: false,
                    napok_hatra: 2
                }
            ],

            // Lezárt feladatok
            lezartFeladatok: [
                {
                    id: 'VEL-2024-099',
                    ugyazonosito: 'VAHAP-V-2024-001200',
                    feladatTipus: 'szakmai',
                    feladatNev: 'Sommás eljárás alkalmazhatóságának véleményezése',
                    hatarido: '2025-10-10',
                    lezaras_datum: '2025-10-09',
                    kiiro: { id: 'UI001', nev: 'Dr. Szabó Péter' },
                    statusz: 'lezart_kesz',
                    osszegzes: 'Minden véleményező elfogadta. Sommás eljárás alkalmazható.'
                }
            ],

            // Feladat sablonok (ügytípushoz kötött)
            sablonok: [
                {
                    id: 'SABLON-001',
                    ugytipus: 'V-044',
                    feladatTipus: 'szakmai',
                    sablon_nev: 'Döntési javaslat véleményezés - Alkalmassági vizsgálat',
                    leiras: 'Döntési javaslat és határozat tervezet szakmai véleményezése vasúti járművezető alkalmassági ügyekben.',
                    alapertelmezett_cimzettek: ['UI002', 'UI003', 'VEZ001'],
                    alapertelmezett_hatarido_nap: 7,
                    early_warning_napok: [3, 2, 1]
                },
                {
                    id: 'SABLON-002',
                    ugytipus: 'V-044',
                    feladatTipus: 'jogi',
                    sablon_nev: 'Végzés jogi ellenőrzés',
                    leiras: 'Végzések jogi megalapozottságának ellenőrzése.',
                    alapertelmezett_cimzettek: ['UI003', 'VEZ002'],
                    alapertelmezett_hatarido_nap: 5,
                    early_warning_napok: [2, 1]
                }
            ]
        }
    }
};

// Globális elérhetővé tétel (mindkét változattal a kompatibilitás miatt)
if (typeof window !== 'undefined') {
    window.VahapMockData = VahapMockData;
    window.VIHARMockData = VahapMockData; // Alias a komponensek számára
}
