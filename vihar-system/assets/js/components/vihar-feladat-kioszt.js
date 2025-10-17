/**
 * VAHAP - Feladatkiosztó Komponens
 * Vezetők számára ügyintézőkre történő feladatkiosztás kezelése
 *
 * Funkcionalitás:
 * - Ügyintéző kiválasztása dropdown vagy modal ablakból
 * - Ügyintéző terhelésének megjelenítése
 * - Prioritás beállítása
 * - Határidő megadása
 * - Megjegyzés hozzáadása
 * - Értesítés küldése
 *
 * Használat:
 * <vihar-feladat-kioszt
 *   :ugy="ugyObjektum"
 *   :mode="'modal'"
 *   @feladat-kiosztva="handleKiosztas">
 * </vihar-feladat-kioszt>
 */

const ViharFeladatKioszt = {
    name: 'vihar-feladat-kioszt',

    props: {
        ugy: {
            type: Object,
            required: false,
            default: () => null
        },
        mode: {
            type: String,
            default: 'modal', // 'modal', 'inline', 'dropdown'
            validator: (value) => ['modal', 'inline', 'dropdown'].includes(value)
        },
        showButton: {
            type: Boolean,
            default: true
        },
        ugyintezok: {
            type: Array,
            default: () => []
        }
    },

    emits: ['feladat-kiosztva', 'modal-closed'],

    data() {
        return {
            showModal: false,
            selectedUgyintezo: null,
            prioritas: 'normal',
            hatarido: '',
            megjegyzes: '',
            ertesites: true,

            // Mock ügyintézők adatai (ha props nem adja meg)
            defaultUgyintezok: [
                {
                    id: 'UI001',
                    nev: 'Dr. Szabó Péter',
                    beosztas: 'Vezető ügyintéző',
                    szervezet: 'Vasúti Hatósági Főosztály',
                    email: 'szabo.peter@ekm.gov.hu',
                    telefon: '+36 1 123 4567',
                    szakmai_terulet: ['V-044', 'V-045', 'V-046'],
                    aktiv_ugyek: 12,
                    max_kapacitas: 20,
                    atlag_lezarasi_ido: 15 // napokban
                },
                {
                    id: 'UI002',
                    nev: 'Nagy Andrea',
                    beosztas: 'Ügyintéző',
                    szervezet: 'Vasúti Hatósági Főosztály',
                    email: 'nagy.andrea@ekm.gov.hu',
                    telefon: '+36 1 123 4568',
                    szakmai_terulet: ['V-044', 'V-047'],
                    aktiv_ugyek: 8,
                    max_kapacitas: 15,
                    atlag_lezarasi_ido: 12
                },
                {
                    id: 'UI003',
                    nev: 'Kiss Gábor',
                    beosztas: 'Ügyintéző',
                    szervezet: 'Vasúti Hatósági Főosztály',
                    email: 'kiss.gabor@ekm.gov.hu',
                    telefon: '+36 1 123 4569',
                    szakmai_terulet: ['V-044', 'V-048', 'V-049'],
                    aktiv_ugyek: 15,
                    max_kapacitas: 18,
                    atlag_lezarasi_ido: 18
                },
                {
                    id: 'UI004',
                    nev: 'Dr. Tóth Katalin',
                    beosztas: 'Szakügyintéző',
                    szervezet: 'Vasúti Hatósági Főosztály',
                    email: 'toth.katalin@ekm.gov.hu',
                    telefon: '+36 1 123 4570',
                    szakmai_terulet: ['V-044', 'V-045'],
                    aktiv_ugyek: 5,
                    max_kapacitas: 12,
                    atlag_lezarasi_ido: 10
                },
                {
                    id: 'UI005',
                    nev: 'Horváth János',
                    beosztas: 'Ügyintéző',
                    szervezet: 'Vasúti Hatósági Főosztály',
                    email: 'horvath.janos@ekm.gov.hu',
                    telefon: '+36 1 123 4571',
                    szakmai_terulet: ['V-046', 'V-047', 'V-048'],
                    aktiv_ugyek: 18,
                    max_kapacitas: 20,
                    atlag_lezarasi_ido: 20
                }
            ],

            prioritasOpciok: [
                { value: 'alacsony', label: 'Alacsony', badge: 'secondary', ikon: 'bi-arrow-down-circle' },
                { value: 'normal', label: 'Normál', badge: 'primary', ikon: 'bi-dash-circle' },
                { value: 'magas', label: 'Magas', badge: 'warning', ikon: 'bi-arrow-up-circle' },
                { value: 'suergo', label: 'Sürgős', badge: 'danger', ikon: 'bi-exclamation-circle' }
            ]
        };
    },

    computed: {
        osszes_ugyintezo() {
            return this.ugyintezok.length > 0 ? this.ugyintezok : this.defaultUgyintezok;
        },

        // Ügyintézők rendezve terhelés szerint (legkevésbé leterhelt először)
        rendezett_ugyintezok() {
            return [...this.osszes_ugyintezo]
                .filter(ui => this.ugy ? ui.szakmai_terulet.includes(this.ugy.ugytipus) : true)
                .sort((a, b) => {
                    const aKapacitas = (a.aktiv_ugyek / a.max_kapacitas) * 100;
                    const bKapacitas = (b.aktiv_ugyek / b.max_kapacitas) * 100;
                    return aKapacitas - bKapacitas;
                });
        },

        // Javasolt ügyintéző (legkevésbé leterhelt, megfelelő szakterület)
        javasolt_ugyintezo() {
            if (this.rendezett_ugyintezok.length === 0) return null;
            return this.rendezett_ugyintezok[0];
        },

        // Kiválasztott ügyintéző terhelése
        selected_terheltseg() {
            if (!this.selectedUgyintezo) return null;
            const ui = this.osszes_ugyintezo.find(u => u.id === this.selectedUgyintezo);
            if (!ui) return null;

            const szazalek = (ui.aktiv_ugyek / ui.max_kapacitas) * 100;
            let statusz = 'success';
            if (szazalek > 90) statusz = 'danger';
            else if (szazalek > 70) statusz = 'warning';
            else if (szazalek > 50) statusz = 'info';

            return {
                aktiv: ui.aktiv_ugyek,
                max: ui.max_kapacitas,
                szazalek: Math.round(szazalek),
                statusz: statusz
            };
        },

        // Prioritás badge osztály
        prioritasBadge() {
            const opcio = this.prioritasOpciok.find(p => p.value === this.prioritas);
            return opcio ? opcio.badge : 'secondary';
        },

        // Prioritás ikon
        prioritasIkon() {
            const opcio = this.prioritasOpciok.find(p => p.value === this.prioritas);
            return opcio ? opcio.ikon : 'bi-dash-circle';
        },

        // Validáció
        isValid() {
            return this.selectedUgyintezo !== null && this.hatarido !== '';
        },

        // Minimális határidő (ma + 1 nap)
        minHatarido() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        }
    },

    methods: {
        // Modal megnyitása
        openModal() {
            this.showModal = true;
            this.resetForm();

            // Ha van javasolt ügyintéző, kiválasztjuk
            if (this.javasolt_ugyintezo) {
                this.selectedUgyintezo = this.javasolt_ugyintezo.id;
            }

            // Alapértelmezett határidő: 15 munkanap (mock)
            const alapHatarido = new Date();
            alapHatarido.setDate(alapHatarido.getDate() + 15);
            this.hatarido = alapHatarido.toISOString().split('T')[0];
        },

        // Modal bezárása
        closeModal() {
            this.showModal = false;
            this.$emit('modal-closed');
        },

        // Űrlap visszaállítása
        resetForm() {
            this.selectedUgyintezo = null;
            this.prioritas = 'normal';
            this.hatarido = '';
            this.megjegyzes = '';
            this.ertesites = true;
        },

        // Ügyintéző kiválasztása
        selectUgyintezo(ugyintezoId) {
            this.selectedUgyintezo = ugyintezoId;
        },

        // Feladat kiosztása
        kiosztFeladat() {
            if (!this.isValid) {
                alert('⚠️ Kérem válasszon ügyintézőt és adjon meg határidőt!');
                return;
            }

            const ugyintezo = this.osszes_ugyintezo.find(u => u.id === this.selectedUgyintezo);

            const kiosztas = {
                ugy: this.ugy,
                ugyintezo: ugyintezo,
                prioritas: this.prioritas,
                hatarido: this.hatarido,
                megjegyzes: this.megjegyzes,
                ertesites: this.ertesites,
                kiosztva: new Date().toISOString(),
                kiosztotta: 'Dr. Nagy Andrea' // Mock vezető
            };

            // Mock: Feladat kiosztva
            console.log('[VAHAP] Feladat kiosztva:', kiosztas);

            // Értesítés
            if (this.ertesites) {
                console.log(`[VAHAP] Email értesítés küldve: ${ugyintezo.email}`);
            }

            // Emit event
            this.$emit('feladat-kiosztva', kiosztas);

            // Sikeres visszajelzés
            alert(`✓ Feladat sikeresen kiosztva: ${ugyintezo.nev}\nHatáridő: ${this.hatarido}`);

            // Modal bezárása
            this.closeModal();
        },

        // Terhelés színe
        terheltségSzín(ugyintezo) {
            const szazalek = (ugyintezo.aktiv_ugyek / ugyintezo.max_kapacitas) * 100;
            if (szazalek > 90) return 'danger';
            if (szazalek > 70) return 'warning';
            if (szazalek > 50) return 'info';
            return 'success';
        },

        // Terhelés százalék
        terheltségSzázalék(ugyintezo) {
            return Math.round((ugyintezo.aktiv_ugyek / ugyintezo.max_kapacitas) * 100);
        },

        // Formázás
        formatDate(dateStr) {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleDateString('hu-HU');
        }
    },

    template: `
        <div class="vihar-feladat-kioszt">
            <!-- Gomb megnyitásra (ha showButton === true) -->
            <button v-if="showButton && mode === 'modal'"
                    class="btn btn-primary"
                    @click="openModal">
                <i class="bi bi-person-plus"></i> Ügyintéző kijelölése
            </button>

            <!-- Modal ablak -->
            <div v-if="showModal && mode === 'modal'"
                 class="modal d-block"
                 tabindex="-1"
                 style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <!-- Modal fejléc -->
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-person-badge"></i> Feladat kiosztása ügyintézőre
                                <span v-if="ugy" class="badge bg-light text-dark ms-2">
                                    {{ ugy.ugyazonosito }}
                                </span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                        </div>

                        <!-- Modal test -->
                        <div class="modal-body">
                            <div class="row">
                                <!-- Bal oldal: Ügyintéző választás -->
                                <div class="col-md-7">
                                    <h6 class="mb-3">
                                        <i class="bi bi-people"></i> Elérhető ügyintézők
                                        <span class="badge bg-secondary ms-2">{{ rendezett_ugyintezok.length }}</span>
                                    </h6>

                                    <!-- Javasolt ügyintéző kiemelése -->
                                    <div v-if="javasolt_ugyintezo" class="alert alert-info mb-3">
                                        <i class="bi bi-lightbulb"></i> <strong>Javasolt:</strong>
                                        {{ javasolt_ugyintezo.nev }}
                                        (Legalacsonyabb terhelés: {{ terheltségSzázalék(javasolt_ugyintezo) }}%)
                                    </div>

                                    <!-- Ügyintézők lista -->
                                    <div class="list-group">
                                        <a v-for="ugyintezo in rendezett_ugyintezok"
                                           :key="ugyintezo.id"
                                           href="#"
                                           class="list-group-item list-group-item-action"
                                           :class="{ 'active': selectedUgyintezo === ugyintezo.id }"
                                           @click.prevent="selectUgyintezo(ugyintezo.id)">

                                            <div class="d-flex justify-content-between align-items-start">
                                                <div class="flex-grow-1">
                                                    <div class="d-flex align-items-center mb-1">
                                                        <i class="bi bi-person-circle me-2 fs-5"></i>
                                                        <strong>{{ ugyintezo.nev }}</strong>
                                                        <span v-if="ugyintezo.id === javasolt_ugyintezo?.id"
                                                              class="badge bg-success ms-2">
                                                            Javasolt
                                                        </span>
                                                    </div>
                                                    <div class="small text-muted mb-2">
                                                        <i class="bi bi-briefcase"></i> {{ ugyintezo.beosztas }}
                                                        <span class="ms-2">|</span>
                                                        <i class="bi bi-envelope ms-2"></i> {{ ugyintezo.email }}
                                                    </div>
                                                    <div class="small mb-2">
                                                        <i class="bi bi-tags"></i> Szakterület:
                                                        <span v-for="(terulet, idx) in ugyintezo.szakmai_terulet"
                                                              :key="idx"
                                                              class="badge bg-secondary me-1">
                                                            {{ terulet }}
                                                        </span>
                                                    </div>
                                                    <div class="mb-1">
                                                        <small class="text-muted">Terhelés:</small>
                                                        <div class="progress" style="height: 20px;">
                                                            <div class="progress-bar"
                                                                 :class="'bg-' + terheltségSzín(ugyintezo)"
                                                                 :style="{ width: terheltségSzázalék(ugyintezo) + '%' }">
                                                                {{ ugyintezo.aktiv_ugyek }} / {{ ugyintezo.max_kapacitas }}
                                                                ({{ terheltségSzázalék(ugyintezo) }}%)
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="small text-muted">
                                                        <i class="bi bi-clock-history"></i>
                                                        Átlagos lezárási idő: {{ ugyintezo.atlag_lezarasi_ido }} nap
                                                    </div>
                                                </div>
                                                <div v-if="selectedUgyintezo === ugyintezo.id">
                                                    <i class="bi bi-check-circle-fill text-success fs-4"></i>
                                                </div>
                                            </div>
                                        </a>

                                        <!-- Nincs elérhető ügyintéző -->
                                        <div v-if="rendezett_ugyintezok.length === 0"
                                             class="alert alert-warning">
                                            <i class="bi bi-exclamation-triangle"></i>
                                            Nincs elérhető ügyintéző a kiválasztott szakterületen.
                                        </div>
                                    </div>
                                </div>

                                <!-- Jobb oldal: Kiosztás részletei -->
                                <div class="col-md-5">
                                    <h6 class="mb-3">
                                        <i class="bi bi-gear"></i> Kiosztás részletei
                                    </h6>

                                    <!-- Kiválasztott ügyintéző összefoglaló -->
                                    <div v-if="selectedUgyintezo" class="card mb-3 border-primary">
                                        <div class="card-body">
                                            <h6 class="card-title">
                                                <i class="bi bi-person-check"></i> Kiválasztva
                                            </h6>
                                            <p class="mb-1">
                                                <strong>{{ osszes_ugyintezo.find(u => u.id === selectedUgyintezo)?.nev }}</strong>
                                            </p>
                                            <div v-if="selected_terheltseg" class="mt-2">
                                                <small class="text-muted">Jelenlegi terhelés:</small>
                                                <div class="progress" style="height: 25px;">
                                                    <div class="progress-bar"
                                                         :class="'bg-' + selected_terheltseg.statusz"
                                                         :style="{ width: selected_terheltseg.szazalek + '%' }">
                                                        {{ selected_terheltseg.aktiv }} / {{ selected_terheltseg.max }}
                                                        ({{ selected_terheltseg.szazalek }}%)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Prioritás -->
                                    <div class="mb-3">
                                        <label class="form-label">
                                            <i class="bi bi-flag"></i> Prioritás *
                                        </label>
                                        <select v-model="prioritas" class="form-select">
                                            <option v-for="opcio in prioritasOpciok"
                                                    :key="opcio.value"
                                                    :value="opcio.value">
                                                {{ opcio.label }}
                                            </option>
                                        </select>
                                        <div class="mt-2">
                                            <span class="badge" :class="'bg-' + prioritasBadge">
                                                <i :class="prioritasIkon"></i>
                                                {{ prioritasOpciok.find(p => p.value === prioritas)?.label }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Határidő -->
                                    <div class="mb-3">
                                        <label class="form-label">
                                            <i class="bi bi-calendar-event"></i> Határidő *
                                        </label>
                                        <input type="date"
                                               v-model="hatarido"
                                               class="form-control"
                                               :min="minHatarido"
                                               required>
                                        <small class="text-muted">
                                            Legkorábbi: {{ formatDate(minHatarido) }}
                                        </small>
                                    </div>

                                    <!-- Megjegyzés -->
                                    <div class="mb-3">
                                        <label class="form-label">
                                            <i class="bi bi-chat-left-text"></i> Megjegyzés ügyintézőnek
                                        </label>
                                        <textarea v-model="megjegyzes"
                                                  class="form-control"
                                                  rows="4"
                                                  placeholder="Opcionális üzenet vagy instrukció az ügyintézőnek..."></textarea>
                                        <small class="text-muted">
                                            {{ megjegyzes.length }} / 500 karakter
                                        </small>
                                    </div>

                                    <!-- Értesítés -->
                                    <div class="form-check mb-3">
                                        <input type="checkbox"
                                               v-model="ertesites"
                                               class="form-check-input"
                                               id="ertesitesCheck">
                                        <label class="form-check-label" for="ertesitesCheck">
                                            <i class="bi bi-bell"></i> Email értesítés küldése az ügyintézőnek
                                        </label>
                                    </div>

                                    <!-- Validációs üzenet -->
                                    <div v-if="!isValid" class="alert alert-warning">
                                        <i class="bi bi-exclamation-triangle"></i>
                                        Kérem válasszon ügyintézőt és adjon meg határidőt!
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Modal lábléc -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">
                                <i class="bi bi-x-circle"></i> Mégsem
                            </button>
                            <button type="button"
                                    class="btn btn-primary"
                                    :disabled="!isValid"
                                    @click="kiosztFeladat">
                                <i class="bi bi-check-circle"></i> Feladat kiosztása
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inline mód (beágyazott használatra) -->
            <div v-if="mode === 'inline'" class="vihar-feladat-kioszt-inline">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <i class="bi bi-person-plus"></i> Ügyintéző kijelölése
                    </div>
                    <div class="card-body">
                        <!-- Rövidített inline űrlap -->
                        <div class="mb-3">
                            <label class="form-label">Ügyintéző *</label>
                            <select v-model="selectedUgyintezo" class="form-select">
                                <option :value="null">-- Válasszon ügyintézőt --</option>
                                <option v-for="ui in rendezett_ugyintezok"
                                        :key="ui.id"
                                        :value="ui.id">
                                    {{ ui.nev }} ({{ terheltségSzázalék(ui) }}% terheltség)
                                </option>
                            </select>
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-primary"
                                    :disabled="!selectedUgyintezo"
                                    @click="kiosztFeladat">
                                <i class="bi bi-check"></i> Kiosztás
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    mounted() {
        console.log('[VAHAP] Feladatkiosztó komponens betöltve');
        console.log('[VAHAP] Elérhető ügyintézők:', this.osszes_ugyintezo.length);
    }
};
