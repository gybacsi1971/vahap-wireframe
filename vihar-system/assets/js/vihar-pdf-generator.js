/**
 * VAHAP - PDF Generátor Modul
 * Hivatalos magyar kormányzati arculattal ellátott dokumentumok generálása
 *
 * Funkcionalitás:
 * - Hivatalos fejléc ÉKM logóval
 * - Hivatalos lábléc (oldalszám, dátum)
 * - Dokumentum sablonok (határozat, végzés, igazolás, tájékoztatás, hirdetmény)
 * - Aláírás helyiség és pecsét
 * - Kimenő iktatószám
 * - Hivatalos formázás
 *
 * MEGJEGYZÉS: Ez egy MOCK implementáció demo célokra.
 * Éles környezetben backend PDF generálás szükséges (pl. Python reportlab, PHP TCPDF, Java iText)
 *
 * Használat:
 * const pdfGen = new ViharPDFGenerator();
 * pdfGen.generateHatározat(dokumentumAdat);
 */

class ViharPDFGenerator {
    constructor() {
        this.arculat = {
            // Magyar államapparátus arculat
            primaryColor: '#004b87',      // Sötétkék
            secondaryColor: '#6c757d',    // Szürke
            headerBg: '#f8f9fa',          // Világosszürke
            textColor: '#212529',         // Szinte fekete

            // Betűtípusok (hivatalos)
            fontFamily: 'Times New Roman, serif',
            fontSizeNormal: '12pt',
            fontSizeSmall: '10pt',
            fontSizeLarge: '14pt',

            // Margók (hivatalos dokumentum szabvány)
            marginTop: '25mm',
            marginBottom: '25mm',
            marginLeft: '30mm',
            marginRight: '20mm',

            // Logók elérési útjai (mock)
            logoEKM: '/assets/images/ekm_logo.png',
            logoMagyarAllam: '/assets/images/magyar_allam_logo.png'
        };

        this.dokumentumTipusok = {
            'határozat': {
                cim: 'HATÁROZAT',
                azonosito_prefix: 'H',
                kod: 'F-0092'
            },
            'vegzes': {
                cim: 'VÉGZÉS',
                azonosito_prefix: 'V',
                kod: 'F-0091'
            },
            'igazolas': {
                cim: 'IGAZOLÁS',
                azonosito_prefix: 'I',
                kod: 'F-0093'
            },
            'tajekoztatas': {
                cim: 'TÁJÉKOZTATÁS',
                azonosito_prefix: 'T',
                kod: 'F-0094'
            },
            'hirdetmeny': {
                cim: 'HIRDETMÉNY',
                azonosito_prefix: 'HR',
                kod: 'F-0095'
            }
        };
    }

    /**
     * Határozat generálás
     * F-0092 - Határozat tervezet
     */
    generateHatározat(adat) {
        console.log('[PDF Generator] Határozat generálás...', adat);

        const dokumentum = this._createBasePDFStructure('határozat', adat);

        // Tartalom specifikus a határozathoz
        dokumentum.tartalom = `
            ${this._createHatarido(adat.hatarido)}

            RENDELKEZŐ RÉSZ:

            ${adat.rendelezo_resz || 'A kérelem elbírálásra került.'}

            INDOKOLÁS:

            ${adat.indokolas || 'A hatóság az alábbi indokok alapján hozta meg a döntését...'}

            JOGORVOSLAT:

            ${this._createJogorvoslat(adat)}
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Végzés generálás
     * F-0091 - Végzés tervezet
     */
    generateVegzes(adat) {
        console.log('[PDF Generator] Végzés generálás...', adat);

        const dokumentum = this._createBasePDFStructure('vegzes', adat);

        dokumentum.tartalom = `
            ${this._createHatarido(adat.hatarido)}

            RENDELKEZÉS:

            ${adat.rendelkezes || 'A hatóság az eljárás során megállapította...'}

            ${adat.indokolas ? 'INDOKOLÁS:\n\n' + adat.indokolas : ''}

            JOGORVOSLAT:

            Ezen végzés ellen önálló fellebbezésnek nincs helye, az ügy érdemében hozott határozat ellen
            benyújtott fellebbezésben lehet megtámadni.
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Igazolás generálás
     * F-0093 - Igazolás tervezet
     */
    generateIgazolas(adat) {
        console.log('[PDF Generator] Igazolás generálás...', adat);

        const dokumentum = this._createBasePDFStructure('igazolas', adat);

        dokumentum.tartalom = `
            Igazoljuk, hogy ${adat.ugyfel_nev || 'N/A'} részére

            ${adat.igazolas_targy || 'a kért igazolást kiadjuk.'}

            Az igazolás érvényességi ideje: ${adat.ervenyes_eddig || 'korlátlan'}

            ${adat.megjegyzes || ''}
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Tájékoztatás generálás
     * F-0094 - Tájékoztatás tervezet
     */
    generateTajekoztatas(adat) {
        console.log('[PDF Generator] Tájékoztatás generálás...', adat);

        const dokumentum = this._createBasePDFStructure('tajekoztatas', adat);

        dokumentum.tartalom = `
            Tisztelt ${adat.ugyfel_nev || 'Címzett'}!

            Tájékoztatjuk, hogy ${adat.targy || 'az Ön ügyében az alábbi információkat közöljük:'}

            ${adat.tajekoztatas_szoveg || ''}

            Amennyiben kérdése merülne fel, kérjük, keresse ügyintézőjét az alábbi elérhetőségeken:
            ${adat.ugyintezo_nev || 'N/A'}
            ${adat.ugyintezo_email || 'N/A'}
            ${adat.ugyintezo_telefon || 'N/A'}
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Hirdetmény generálás
     * F-0095 - Hirdetmény tervezet
     */
    generateHirdetmeny(adat) {
        console.log('[PDF Generator] Hirdetmény generálás...', adat);

        const dokumentum = this._createBasePDFStructure('hirdetmeny', adat);

        dokumentum.tartalom = `
            HIRDETMÉNY

            ${adat.hirdetmeny_cim || 'Hivatalos közlemény'}

            ${adat.hirdetmeny_szoveg || ''}

            Közzététel helye: ${adat.kozzetetetel_hely || 'Hivatali hirdetőtábla'}
            Közzététel időpontja: ${adat.kozzetetetel_datum || new Date().toLocaleDateString('hu-HU')}
            Kifüggesztés időtartama: ${adat.kifuggeszt_napok || '15'} nap
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Hiánypótlási felszólítás generálás
     * F-0100 - Hiánypótlási felszólítás
     */
    generateHianypotlasiVegzes(adat) {
        console.log('[PDF Generator] Hiánypótlási felszólítás generálás...', adat);

        const dokumentum = this._createBasePDFStructure('vegzes', adat);
        dokumentum.targy = 'Hiánypótlási felszólítás';

        dokumentum.tartalom = `
            RENDELKEZÉS:

            A benyújtott kérelem formai és tartalmi vizsgálata során az alábbi hiányosságokat állapítottam meg:

            ${this._createHianypotlasiLista(adat.hianypotlasok)}

            Felhívom a figyelmét, hogy a fenti hiányosságokat a jelen végzés kézhezvételétől számított
            ${adat.hianypotlas_hatarido || '15'} napon belül pótolja.

            FIGYELMEZTETÉS:

            Amennyiben a hiányosságokat a megadott határidőn belül nem pótolja, a hatóság a kérelmet
            érdemi vizsgálat nélkül elutasíthatja.

            INDOKOLÁS:

            ${adat.indokolas || 'A kérelem vizsgálata során megállapítást nyert, hogy a benyújtott ' +
              'dokumentáció nem felel meg a jogszabályi előírásoknak.'}

            JOGORVOSLAT:

            Ezen végzés ellen önálló fellebbezésnek nincs helye.
        `;

        return this._generatePDFOutput(dokumentum);
    }

    /**
     * Alap PDF struktúra létrehozása
     */
    _createBasePDFStructure(tipus, adat) {
        const tipusInfo = this.dokumentumTipusok[tipus];

        return {
            tipus: tipus,
            tipus_info: tipusInfo,

            // Fejléc adatok
            fejlec: {
                szervezet: 'Építési és Közlekedési Minisztérium',
                osztaly: adat.osztaly || 'Vasúti Hatósági Főosztály',
                cim: '1011 Budapest, Fő utca 44-50.',
                telefon: '+36 1 795 1000',
                email: 'vhf@ekm.gov.hu',
                honlap: 'www.ekm.gov.hu'
            },

            // Dokumentum azonosítók
            iktatoszam: adat.iktatoszam || this._generateIktatoszam(tipus),
            ugyiratszam: adat.ugyiratszam || adat.ugyazonosito || 'N/A',
            ugyintezo: adat.ugyintezo || 'N/A',

            // Címzett
            cimzett: {
                nev: adat.ugyfel_nev || adat.cimzett_nev || 'N/A',
                cim: adat.ugyfel_cim || adat.cimzett_cim || 'N/A'
            },

            // Tárgy
            targy: adat.targy || tipusInfo.cim,

            // Tartalom (típusonként változó)
            tartalom: '',

            // Aláírás
            alairas: {
                alairo_nev: adat.alairo_nev || 'Dr. Nagy Andrea',
                alairo_beosztas: adat.alairo_beosztas || 'osztályvezető',
                datum: adat.kiadasDatum || new Date().toLocaleDateString('hu-HU')
            },

            // Metaadatok
            generalasDatum: new Date().toISOString(),
            funkciokod: tipusInfo.kod,
            verzio: '1.0'
        };
    }

    /**
     * Iktatószám generálás (mock)
     */
    _generateIktatoszam(tipus) {
        const ev = new Date().getFullYear();
        const prefix = this.dokumentumTipusok[tipus].azonosito_prefix;
        const random = Math.floor(Math.random() * 9000) + 1000;

        return `EKM/${prefix}/${random}/${ev}`;
    }

    /**
     * Határidő blokk létrehozása
     */
    _createHatarido(hatarido) {
        if (!hatarido) return '';

        return `
HATÁRIDŐ:

A határozat végrehajtására ${hatarido} napot állapítok meg.
`;
    }

    /**
     * Jogorvoslati blokk létrehozása
     */
    _createJogorvoslat(adat) {
        return `
Ezen határozat ellen a kézhezvételtől számított 15 napon belül fellebbezést lehet benyújtani
az Építési és Közlekedési Minisztérium címére (1011 Budapest, Fő utca 44-50.).

A fellebbezést írásban, e-mailben vagy elektronikus űrlapon lehet benyújtani.
A fellebbezés nem halasztja a határozat végrehajthatóságát.

Fellebbezési illeték: ${adat.fellebbezesi_illetek || '0'} Ft
`;
    }

    /**
     * Hiánypótlási lista formázása
     */
    _createHianypotlasiLista(hianypotlasok) {
        if (!hianypotlasok || hianypotlasok.length === 0) {
            return '- A dokumentáció nem teljes';
        }

        return hianypotlasok.map((h, idx) => `${idx + 1}. ${h}`).join('\n');
    }

    /**
     * PDF kimenet generálása (MOCK)
     */
    _generatePDFOutput(dokumentum) {
        // MOCK: Éles környezetben itt történne a valódi PDF generálás
        // Backend library-vel (pl. jsPDF böngészőben, vagy backend PDF library)

        const pdfHTML = this._createHTMLPreview(dokumentum);

        return {
            success: true,
            dokumentum: dokumentum,
            html: pdfHTML,
            mock_info: 'MOCK PDF - Éles környezetben valódi PDF generálás történne',
            download_url: null, // Backend-en keresztül
            preview_html: pdfHTML
        };
    }

    /**
     * HTML előnézet létrehozása (printeléshez)
     */
    _createHTMLPreview(dok) {
        return `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>${dok.tipus_info.cim} - ${dok.iktatoszam}</title>
    <style>
        @page {
            size: A4;
            margin: ${this.arculat.marginTop} ${this.arculat.marginRight} ${this.arculat.marginBottom} ${this.arculat.marginLeft};
        }

        body {
            font-family: ${this.arculat.fontFamily};
            font-size: ${this.arculat.fontSizeNormal};
            color: ${this.arculat.textColor};
            line-height: 1.6;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
        }

        .fejlec {
            text-align: center;
            border-bottom: 2px solid ${this.arculat.primaryColor};
            padding-bottom: 10mm;
            margin-bottom: 15mm;
        }

        .fejlec-logo {
            width: 60mm;
            height: auto;
            margin-bottom: 5mm;
        }

        .fejlec-szervezet {
            font-size: ${this.arculat.fontSizeLarge};
            font-weight: bold;
            color: ${this.arculat.primaryColor};
            margin-bottom: 3mm;
        }

        .fejlec-info {
            font-size: ${this.arculat.fontSizeSmall};
            color: ${this.arculat.secondaryColor};
        }

        .dokumentum-adatok {
            margin-bottom: 10mm;
            font-size: ${this.arculat.fontSizeSmall};
        }

        .dokumentum-adatok table {
            width: 100%;
            border-collapse: collapse;
        }

        .dokumentum-adatok td {
            padding: 2mm 0;
            vertical-align: top;
        }

        .dokumentum-adatok td:first-child {
            width: 30%;
            font-weight: bold;
        }

        .cimzett {
            margin-bottom: 10mm;
            font-size: ${this.arculat.fontSizeNormal};
        }

        .targy {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10mm;
        }

        .dokumentum-cim {
            text-align: center;
            font-size: ${this.arculat.fontSizeLarge};
            font-weight: bold;
            margin: 15mm 0;
            text-transform: uppercase;
            color: ${this.arculat.primaryColor};
        }

        .tartalom {
            text-align: justify;
            margin-bottom: 15mm;
            white-space: pre-line;
        }

        .alairas {
            margin-top: 20mm;
            text-align: right;
        }

        .alairas-datum {
            margin-bottom: 15mm;
        }

        .alairas-nev {
            font-weight: bold;
            margin-top: 10mm;
        }

        .alairas-beosztas {
            font-size: ${this.arculat.fontSizeSmall};
        }

        .lablejc {
            position: fixed;
            bottom: 10mm;
            left: ${this.arculat.marginLeft};
            right: ${this.arculat.marginRight};
            border-top: 1px solid ${this.arculat.secondaryColor};
            padding-top: 3mm;
            font-size: ${this.arculat.fontSizeSmall};
            color: ${this.arculat.secondaryColor};
            text-align: center;
        }

        @media print {
            body {
                padding: 0;
            }

            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Fejléc -->
    <div class="fejlec">
        <img src="${this.arculat.logoEKM}" alt="ÉKM Logó" class="fejlec-logo" onerror="this.style.display='none'">
        <div class="fejlec-szervezet">${dok.fejlec.szervezet}</div>
        <div class="fejlec-osztaly">${dok.fejlec.osztaly}</div>
        <div class="fejlec-info">
            ${dok.fejlec.cim}<br>
            Tel: ${dok.fejlec.telefon} | Email: ${dok.fejlec.email}<br>
            ${dok.fejlec.honlap}
        </div>
    </div>

    <!-- Dokumentum adatok -->
    <div class="dokumentum-adatok">
        <table>
            <tr>
                <td>Iktatószám:</td>
                <td>${dok.iktatoszam}</td>
            </tr>
            <tr>
                <td>Ügyiratszám:</td>
                <td>${dok.ugyiratszam}</td>
            </tr>
            <tr>
                <td>Ügyintéző:</td>
                <td>${dok.ugyintezo}</td>
            </tr>
            <tr>
                <td>Funkciókód:</td>
                <td>${dok.funkciokod}</td>
            </tr>
        </table>
    </div>

    <!-- Címzett -->
    <div class="cimzett">
        <strong>Címzett:</strong><br>
        ${dok.cimzett.nev}<br>
        ${dok.cimzett.cim}
    </div>

    <!-- Tárgy -->
    <div class="targy">
        Tárgy: ${dok.targy}
    </div>

    <!-- Dokumentum cím -->
    <div class="dokumentum-cim">
        ${dok.tipus_info.cim}
    </div>

    <!-- Tartalom -->
    <div class="tartalom">
        ${dok.tartalom}
    </div>

    <!-- Aláírás -->
    <div class="alairas">
        <div class="alairas-datum">
            ${dok.alairas.datum}
        </div>
        <div class="alairas-nev">
            ${dok.alairas.alairo_nev}
        </div>
        <div class="alairas-beosztas">
            ${dok.alairas.alairo_beosztas}
        </div>
        <div class="pecset" style="margin-top: 10mm; font-size: 10pt; color: #999;">
            [Hivatalos pecsét helye]
        </div>
    </div>

    <!-- Lábléc -->
    <div class="lablejc">
        ${dok.iktatoszam} | Oldal 1/1 | Generálva: ${new Date().toLocaleString('hu-HU')}
    </div>

    <!-- Nyomtatás gomb (csak képernyőn) -->
    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()"
                style="padding: 10px 30px; background-color: ${this.arculat.primaryColor};
                       color: white; border: none; cursor: pointer; font-size: 14pt;">
            <span style="margin-right: 5px;">🖨️</span> Nyomtatás / PDF mentés
        </button>
    </div>
</body>
</html>
        `;
    }

    /**
     * PDF letöltés (MOCK)
     */
    downloadPDF(dokumentum, fajlnev) {
        console.log('[PDF Generator] PDF letöltés mock:', fajlnev);

        // MOCK: Valós implementációban blob létrehozás és letöltés
        const htmlContent = this._createHTMLPreview(dokumentum);

        // Új ablakban megnyitás nyomtatáshoz
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        return {
            success: true,
            message: 'PDF előnézet megnyitva új ablakban. Használja a böngésző nyomtatás funkciót PDF mentéshez.',
            mock: true
        };
    }

    /**
     * Előnézet megjelenítése
     */
    showPreview(dokumentum) {
        const htmlContent = this._createHTMLPreview(dokumentum);

        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();

        return {
            success: true,
            message: 'Előnézet megnyitva'
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViharPDFGenerator;
}
