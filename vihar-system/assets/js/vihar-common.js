/**
 * VAHAP - Közös Funkciók és Szolgáltatások
 *
 * Újrafelhasználható utility funkciók, validátorok, formázók
 */

const VahapCommon = {
    /**
     * Validátorok
     */
    validators: {
        // Email validáció
        email(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Magyar telefonszám validáció
        phone(phone) {
            const re = /^(\+36|06)[0-9]{9}$/;
            return re.test(phone.replace(/\s/g, ''));
        },

        // Irányítószám validáció
        postalCode(code) {
            const re = /^[0-9]{4}$/;
            return re.test(code);
        },

        // Cégjegyzékszám validáció
        companyRegistration(number) {
            const re = /^[0-9]{2}-[0-9]{2}-[0-9]{6}$/;
            return re.test(number);
        },

        // Adószám validáció
        taxNumber(number) {
            const re = /^[0-9]{8}-[0-9]-[0-9]{2}$/;
            return re.test(number);
        },

        // Üres mező ellenőrzés
        required(value) {
            return value !== null && value !== undefined && value !== '';
        }
    },

    /**
     * Formázók
     */
    formatters: {
        // Dátum formázás
        date(dateString, format = 'YYYY.MM.DD') {
            if (!dateString) return '';
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day);
        },

        // Telefonszám formázás
        phone(phone) {
            if (!phone) return '';
            const cleaned = phone.replace(/\s/g, '');
            if (cleaned.startsWith('+36')) {
                return cleaned.replace(/(\+36)([0-9]{2})([0-9]{3})([0-9]{4})/, '$1 $2 $3 $4');
            }
            return cleaned.replace(/([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{4})/, '$1 $2 $3 $4');
        },

        // Pénznem formázás
        currency(amount, currency = 'Ft') {
            if (amount === null || amount === undefined) return '';
            return new Intl.NumberFormat('hu-HU').format(amount) + ' ' + currency;
        },

        // Ügyazonosító formázás
        caseId(prefix, year, number) {
            return `VAHAP-${prefix}-${year}-${String(number).padStart(6, '0')}`;
        }
    },

    /**
     * Határidő számítások
     */
    deadlines: {
        // Határidő hozzáadása (munkanapokban)
        addBusinessDays(startDate, days) {
            const date = new Date(startDate);
            let addedDays = 0;

            while (addedDays < days) {
                date.setDate(date.getDate() + 1);
                // Hétvége kihagyása
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                    addedDays++;
                }
            }

            return date;
        },

        // Hátralévő napok számítása
        remainingDays(deadline) {
            const today = new Date();
            const deadlineDate = new Date(deadline);
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },

        // Eltelt napok számítása
        elapsedDays(startDate) {
            const today = new Date();
            const start = new Date(startDate);
            const diffTime = today - start;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },

        // Határidő státusz
        getDeadlineStatus(deadline) {
            const remaining = this.remainingDays(deadline);
            if (remaining < 0) return 'expired';
            if (remaining <= 3) return 'urgent';
            if (remaining <= 7) return 'warning';
            return 'ok';
        }
    },

    /**
     * Státusz kezelők
     */
    status: {
        // Státusz badge osztály
        getBadgeClass(status) {
            const statusMap = {
                'beerkezett': 'new',
                'folyamatban': 'pending',
                'hianypotlas': 'warning',
                'dontes': 'info',
                'jovahagyva': 'approved',
                'elutasitva': 'rejected',
                'lezart': 'approved',
                'lejart': 'expired'
            };
            return 'badge-' + (statusMap[status.toLowerCase()] || 'secondary');
        },

        // Magyar státusz nevek
        getStatusLabel(status) {
            const labels = {
                'new': 'Beérkezett',
                'pending': 'Folyamatban',
                'warning': 'Hiánypótlásra vár',
                'info': 'Döntésre vár',
                'approved': 'Jóváhagyva',
                'rejected': 'Elutasítva',
                'expired': 'Lejárt'
            };
            return labels[status] || status;
        }
    },

    /**
     * Űrlap kezelők
     */
    forms: {
        // Űrlap adatok validálása
        validate(formData, rules) {
            const errors = {};

            for (const [field, fieldRules] of Object.entries(rules)) {
                for (const rule of fieldRules) {
                    if (rule === 'required' && !VahapCommon.validators.required(formData[field])) {
                        errors[field] = 'Ez a mező kötelező';
                        break;
                    }
                    if (rule === 'email' && formData[field] && !VahapCommon.validators.email(formData[field])) {
                        errors[field] = 'Érvénytelen email cím';
                        break;
                    }
                    if (rule === 'phone' && formData[field] && !VahapCommon.validators.phone(formData[field])) {
                        errors[field] = 'Érvénytelen telefonszám';
                        break;
                    }
                }
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        },

        // Űrlap adatok tisztítása
        sanitize(formData) {
            const sanitized = {};
            for (const [key, value] of Object.entries(formData)) {
                if (typeof value === 'string') {
                    sanitized[key] = value.trim();
                } else {
                    sanitized[key] = value;
                }
            }
            return sanitized;
        }
    },

    /**
     * PDF generálás mock
     */
    pdf: {
        // PDF előnézet (mock)
        preview(documentType, data) {
            console.log(`PDF előnézet generálása: ${documentType}`, data);
            alert(`PDF előnézet: ${documentType}\n\nEz egy mock funkció - valós rendszerben PDF generálódna.`);
        },

        // PDF letöltés (mock)
        download(documentType, data, filename) {
            console.log(`PDF letöltés: ${filename}`, data);
            alert(`PDF letöltés: ${filename}\n\nEz egy mock funkció - valós rendszerben PDF letöltődne.`);
        }
    },

    /**
     * Értesítések (console-only - nincs UI alert)
     */
    notifications: {
        // Általános értesítés
        show(message, type = 'info') {
            const types = {
                'success': { icon: '✅', color: 'green' },
                'error': { icon: '❌', color: 'red' },
                'warning': { icon: '⚠️', color: 'orange' },
                'info': { icon: 'ℹ️', color: 'blue' }
            };
            const config = types[type] || types.info;
            console.log(`%c${config.icon} ${message}`, `color: ${config.color}; font-weight: bold;`);
        },

        // Sikeres művelet
        success(message, title = 'Sikeres művelet') {
            console.log('[VAHAP SUCCESS]', title, message);
        },

        // Hiba
        error(message, title = 'Hiba történt') {
            console.error('[VAHAP ERROR]', title, message);
        },

        // Figyelmeztetés
        warning(message, title = 'Figyelmeztetés') {
            console.warn('[VAHAP WARNING]', title, message);
        },

        // Információ
        info(message, title = 'Információ') {
            console.info('[VAHAP INFO]', title, message);
        }
    },

    /**
     * Local Storage kezelés
     */
    storage: {
        // Adat mentése
        save(key, data) {
            try {
                localStorage.setItem(`vahap_${key}`, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('LocalStorage hiba:', e);
                return false;
            }
        },

        // Adat betöltése
        load(key, defaultValue = null) {
            try {
                const data = localStorage.getItem(`vahap_${key}`);
                return data ? JSON.parse(data) : defaultValue;
            } catch (e) {
                console.error('LocalStorage hiba:', e);
                return defaultValue;
            }
        },

        // Adat törlése
        remove(key) {
            try {
                localStorage.removeItem(`vahap_${key}`);
                return true;
            } catch (e) {
                console.error('LocalStorage hiba:', e);
                return false;
            }
        },

        // Összes VAHAP adat törlése
        clear() {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('vahap_')) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            } catch (e) {
                console.error('LocalStorage hiba:', e);
                return false;
            }
        }
    },

    /**
     * API mock hívások
     */
    api: {
        // Kérelem benyújtása (mock)
        async submitApplication(moduleType, data) {
            console.log('[API] Kérelem benyújtása:', moduleType, data);

            // Mock késleltetés
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock válasz
            const caseId = VahapCommon.formatters.caseId(
                moduleType === 'vasut' ? 'V' : 'H',
                new Date().getFullYear(),
                Math.floor(Math.random() * 1000000)
            );

            return {
                success: true,
                data: {
                    ugyazonosito: caseId,
                    statusz: 'beerkezett',
                    benyujtasDatum: new Date().toISOString()
                }
            };
        },

        // Ügy lekérdezése (mock)
        async getCase(caseId) {
            console.log('[API] Ügy lekérdezése:', caseId);
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                data: VahapCommon.storage.load(`case_${caseId}`)
            };
        },

        // Döntés mentése (mock)
        async saveDecision(caseId, decision) {
            console.log('[API] Döntés mentése:', caseId, decision);
            await new Promise(resolve => setTimeout(resolve, 800));

            return {
                success: true,
                message: 'Döntés sikeresen mentve'
            };
        }
    },

    /**
     * Workflow segédfunkciók
     */
    workflow: {
        // Következő lépés meghatározása
        getNextStep(currentStep, condition = null) {
            // Egyszerű lineáris workflow
            if (!condition) {
                return currentStep + 1;
            }

            // Feltételes elágazás
            // Ezt a logikát modul-specifikusan lehet bővíteni
            return currentStep + 1;
        },

        // Lépés címkéjének lekérése
        getStepLabel(stepCode) {
            // Központi step mapping
            const steps = {
                'UCE-1761': 'Adatrögzítés megkezdése',
                'UCE-1773': 'Adatok kitöltése',
                'UCE-1772': 'Mellékletek',
                'UCE-1776': 'Véglegesítés',
                'UCE-1771': 'Benyújtás',
                // ... további lépések
            };
            return steps[stepCode] || stepCode;
        }
    },

    /**
     * Nyomtatás
     */
    print: {
        // Oldal nyomtatása
        page() {
            window.print();
        },

        // Elem nyomtatása
        element(elementId) {
            const content = document.getElementById(elementId);
            if (!content) return;

            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Nyomtatás</title>');
            printWindow.document.write('<link rel="stylesheet" href="assets/css/vihar-common.css">');
            printWindow.document.write('</head><body>');
            printWindow.document.write(content.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
};

// Globális elérhetővé tétel
if (typeof window !== 'undefined') {
    window.VahapCommon = VahapCommon;
}
