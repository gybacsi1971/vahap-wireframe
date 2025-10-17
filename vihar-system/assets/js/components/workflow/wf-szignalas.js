/**
 * VAHAP Workflow Komponens - Szignálás
 * Ügy szignálása ügyintézőnek vagy szervezeti egységnek
 */

const WfSzignalas = {
    name: 'wf-szignalas',

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
            selectedTarget: null,
            selectedUgyintezo: null,
            megjegyzes: '',
            sulyossag: 'normal',
            hatarido: '',

            // Lehetséges célok (szervezeti egységek)
            szervezetiEgysegek: [
                {
                    id: 'vhf',
                    nev: 'Vasúti Hatósági Főosztály',
                    vezeto: 'Dr. Nagy Péter',
                    letszam: 15,
                    aktiv_ugyek: 42
                },
                {
                    id: 'vef',
                    nev: 'Vasúti Engedélyezési Főosztály',
                    vezeto: 'Kiss Andrea',
                    letszam: 12,
                    aktiv_ugyek: 38
                },
                {
                    id: 'vmf',
                    nev: 'Vasúti Műszaki Főosztály',
                    vezeto: 'Szabó János',
                    letszam: 8,
                    aktiv_ugyek: 25
                }
            ],

            // Ügyintézők listája
            ugyintezok: [
                {
                    id: 'u001',
                    nev: 'Dr. Kovács Péter',
                    beosztas: 'vezető ügyintéző',
                    szervezet: 'vhf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 8,
                    szakterulet: ['vasútegészségügy', 'alkalmassági vizsgálat']
                },
                {
                    id: 'u002',
                    nev: 'Nagy Andrea',
                    beosztas: 'ügyintéző',
                    szervezet: 'vhf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 12,
                    szakterulet: ['formai ellenőrzés', 'hiánypótlás']
                },
                {
                    id: 'u003',
                    nev: 'Tóth László',
                    beosztas: 'kiemelt ügyintéző',
                    szervezet: 'vef',
                    elerhetoseg: 'elfoglalt',
                    aktiv_ugyek: 15,
                    szakterulet: ['engedélyezés', 'műszaki vizsgálat']
                },
                {
                    id: 'u004',
                    nev: 'Molnár Éva',
                    beosztas: 'ügyintéző',
                    szervezet: 'vmf',
                    elerhetoseg: 'elérhető',
                    aktiv_ugyek: 6,
                    szakterulet: ['műszaki dokumentáció', 'terv felülvizsgálat']
                }
            ],

            // Szignálási típusok
            szignalásTipusok: [
                { value: 'normal', label: 'Normál', icon: 'bi-envelope', color: 'primary' },
                { value: 'surgos', label: 'Sürgős', icon: 'bi-exclamation-triangle', color: 'warning' },
                { value: 'azonnali', label: 'Azonnali', icon: 'bi-lightning', color: 'danger' }
            ]
        };
    },

    computed: {
        // Szűrt ügyintézők a kiválasztott szervezet alapján
        filteredUgyintezok() {
            if (!this.selectedTarget) return [];
            return this.ugyintezok.filter(u => u.szervezet === this.selectedTarget);
        },

        // Ajánlott ügyintézők (legkevesebb aktív üggyel)
        ajanlottUgyintezok() {
            return this.filteredUgyintezok
                .filter(u => u.elerhetoseg === 'elérhető')
                .sort((a, b) => a.aktiv_ugyek - b.aktiv_ugyek)
                .slice(0, 3);
        },

        // Validáció
        canComplete() {
            return this.selectedTarget &&
                   this.selectedUgyintezo &&
                   this.hatarido &&
                   this.megjegyzes.length >= 10;
        }
    },

    methods: {
        // Szervezeti egység kiválasztása
        selectSzervezet(egyseg) {
            this.selectedTarget = egyseg.id;
            this.selectedUgyintezo = null; // Reset ügyintéző választás

            // Automatikus ügyintéző ajánlás
            if (this.ajanlottUgyintezok.length > 0) {
                this.selectedUgyintezo = this.ajanlottUgyintezok[0].id;
            }
        },

        // Ügyintéző kiválasztása
        selectUgyintezo(ugyintezo) {
            this.selectedUgyintezo = ugyintezo.id;
        },

        // Automatikus szignálás
        autoAssign() {
            // Keresés szakterület alapján
            const ugytipus = this.ugy.ugytipus;
            let bestMatch = null;
            let minUgyek = 999;

            this.ugyintezok.forEach(u => {
                if (u.elerhetoseg === 'elérhető' && u.aktiv_ugyek < minUgyek) {
                    // Szakterület egyezés ellenőrzése
                    if (ugytipus === 'V-044' && u.szakterulet.includes('alkalmassági vizsgálat')) {
                        bestMatch = u;
                        minUgyek = u.aktiv_ugyek;
                    }
                }
            });

            if (bestMatch) {
                this.selectedTarget = bestMatch.szervezet;
                this.selectedUgyintezo = bestMatch.id;
                this.$nextTick(() => {
                    alert(`Automatikusan szignálva: ${bestMatch.nev}`);
                });
            }
        },

        // Határidő számítás
        calculateDeadline() {
            const today = new Date();
            let days = 8; // Alapértelmezett

            if (this.sulyossag === 'surgos') days = 3;
            if (this.sulyossag === 'azonnali') days = 1;

            // Munkanapok számítása
            let deadline = new Date(today);
            let addedDays = 0;

            while (addedDays < days) {
                deadline.setDate(deadline.getDate() + 1);
                // Hétvége kihagyása
                if (deadline.getDay() !== 0 && deadline.getDay() !== 6) {
                    addedDays++;
                }
            }

            this.hatarido = deadline.toISOString().split('T')[0];
        },

        // Szignálás végrehajtása
        executeSzignalas() {
            if (!this.canComplete) {
                alert('Kérem töltse ki az összes kötelező mezőt!');
                return;
            }

            const szignalas = {
                ugyId: this.ugy.ugyazonosito,
                celSzervezet: this.selectedTarget,
                ugyintezoId: this.selectedUgyintezo,
                sulyossag: this.sulyossag,
                hatarido: this.hatarido,
                megjegyzes: this.megjegyzes,
                szignalásDatum: new Date().toISOString(),
                szignaló: 'Dr. Szabó Péter' // Aktuális user
            };

            console.log('Szignálás végrehajtva:', szignalas);

            // Emit complete event
            this.$emit('complete', {
                type: 'szignalas',
                data: szignalas
            });

            // Success feedback
            alert(`Ügy sikeresen szignálva!\nCél: ${this.getUgyintezoNev(this.selectedUgyintezo)}\nHatáridő: ${this.hatarido}`);
        },

        // Helper: ügyintéző név lekérése
        getUgyintezoNev(id) {
            const u = this.ugyintezok.find(x => x.id === id);
            return u ? u.nev : '';
        },

        // Helper: szervezet név lekérése
        getSzervezetNev(id) {
            const sz = this.szervezetiEgysegek.find(x => x.id === id);
            return sz ? sz.nev : '';
        }
    },

    mounted() {
        // Alapértelmezett határidő beállítása
        this.calculateDeadline();
    },

    template: `
        <div class="component-card szignalas-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-person-check text-primary"></i>
                    Ügy szignálása
                    <span class="badge bg-secondary ms-2">UCE-1761</span>
                </h5>
                <button class="btn btn-sm btn-outline-primary" @click="autoAssign">
                    <i class="bi bi-magic"></i> Automatikus szignálás
                </button>
            </div>

            <div class="component-card-body">
                <!-- Sürgősség választó -->
                <div class="mb-4">
                    <label class="form-label fw-bold">Sürgősség</label>
                    <div class="btn-group w-100" role="group">
                        <button v-for="tipus in szignalásTipusok" :key="tipus.value"
                                type="button"
                                class="btn"
                                :class="[
                                    sulyossag === tipus.value ?
                                    'btn-' + tipus.color :
                                    'btn-outline-' + tipus.color
                                ]"
                                @click="sulyossag = tipus.value; calculateDeadline()">
                            <i :class="tipus.icon"></i> {{ tipus.label }}
                        </button>
                    </div>
                </div>

                <!-- Szervezeti egység választó -->
                <div class="mb-4">
                    <label class="form-label fw-bold">
                        <i class="bi bi-building"></i> Célszervezet kiválasztása
                    </label>
                    <div class="szignalas-target-list">
                        <div v-for="egyseg in szervezetiEgysegek" :key="egyseg.id"
                             class="szignalas-target-item"
                             :class="{ selected: selectedTarget === egyseg.id }"
                             @click="selectSzervezet(egyseg)">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="fw-bold">{{ egyseg.nev }}</div>
                                    <small class="text-muted">
                                        Vezető: {{ egyseg.vezeto }} |
                                        Létszám: {{ egyseg.letszam }} fő |
                                        Aktív ügyek: {{ egyseg.aktiv_ugyek }}
                                    </small>
                                </div>
                                <i v-if="selectedTarget === egyseg.id"
                                   class="bi bi-check-circle-fill text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ügyintéző választó -->
                <div v-if="selectedTarget" class="mb-4">
                    <label class="form-label fw-bold">
                        <i class="bi bi-person"></i> Ügyintéző kiválasztása
                    </label>

                    <!-- Ajánlott ügyintézők -->
                    <div v-if="ajanlottUgyintezok.length > 0" class="alert alert-info">
                        <i class="bi bi-lightbulb me-2"></i>
                        <strong>Ajánlott ügyintézők</strong> (legkevesebb aktív üggyel)
                    </div>

                    <div class="row">
                        <div v-for="ugyintezo in filteredUgyintezok" :key="ugyintezo.id"
                             class="col-md-6 mb-2">
                            <div class="card"
                                 :class="{
                                     'border-primary': selectedUgyintezo === ugyintezo.id,
                                     'bg-light': ugyintezo.elerhetoseg === 'elfoglalt'
                                 }"
                                 @click="selectUgyintezo(ugyintezo)"
                                 style="cursor: pointer;">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">{{ ugyintezo.nev }}</h6>
                                            <small class="text-muted">{{ ugyintezo.beosztas }}</small>
                                            <div class="mt-2">
                                                <span class="badge"
                                                      :class="{
                                                          'bg-success': ugyintezo.elerhetoseg === 'elérhető',
                                                          'bg-warning': ugyintezo.elerhetoseg === 'elfoglalt'
                                                      }">
                                                    {{ ugyintezo.elerhetoseg }}
                                                </span>
                                                <span class="badge bg-secondary ms-1">
                                                    {{ ugyintezo.aktiv_ugyek }} ügy
                                                </span>
                                            </div>
                                            <div class="mt-1">
                                                <small class="text-muted">
                                                    Szakterület: {{ ugyintezo.szakterulet.join(', ') }}
                                                </small>
                                            </div>
                                        </div>
                                        <i v-if="selectedUgyintezo === ugyintezo.id"
                                           class="bi bi-check-circle-fill text-primary"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Határidő -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">
                            <i class="bi bi-calendar-event"></i> Határidő
                        </label>
                        <input type="date"
                               class="form-control"
                               v-model="hatarido"
                               :min="new Date().toISOString().split('T')[0]">
                        <small class="text-muted">
                            Automatikusan számított munkanapok alapján
                        </small>
                    </div>
                </div>

                <!-- Megjegyzés -->
                <div class="mb-4">
                    <label class="form-label fw-bold">
                        <i class="bi bi-chat-text"></i> Megjegyzés az ügyintézőnek
                    </label>
                    <textarea class="form-control"
                              rows="4"
                              v-model="megjegyzes"
                              placeholder="Írjon legalább 10 karaktert..."></textarea>
                    <div class="d-flex justify-content-between mt-1">
                        <small class="text-muted">
                            Adjon meg minden fontos információt az ügy feldolgozásához
                        </small>
                        <small :class="megjegyzes.length >= 10 ? 'text-success' : 'text-danger'">
                            {{ megjegyzes.length }}/10 karakter
                        </small>
                    </div>
                </div>

                <!-- Összefoglaló -->
                <div v-if="selectedUgyintezo" class="alert alert-light border">
                    <h6 class="alert-heading">Szignálás összefoglalója</h6>
                    <ul class="mb-0">
                        <li>Ügy: <strong>{{ ugy.ugyazonosito }}</strong></li>
                        <li>Célszervezet: <strong>{{ getSzervezetNev(selectedTarget) }}</strong></li>
                        <li>Ügyintéző: <strong>{{ getUgyintezoNev(selectedUgyintezo) }}</strong></li>
                        <li>Sürgősség: <strong>{{ szignalásTipusok.find(t => t.value === sulyossag)?.label }}</strong></li>
                        <li>Határidő: <strong>{{ hatarido }}</strong></li>
                    </ul>
                </div>

                <!-- Műveleti gombok -->
                <div class="d-flex justify-content-between">
                    <button class="btn btn-secondary" @click="$emit('action', {type: 'cancel'})">
                        <i class="bi bi-x-circle"></i> Mégse
                    </button>
                    <button class="btn btn-primary"
                            @click="executeSzignalas"
                            :disabled="!canComplete">
                        <i class="bi bi-send"></i> Szignálás végrehajtása
                    </button>
                </div>
            </div>
        </div>
    `
};