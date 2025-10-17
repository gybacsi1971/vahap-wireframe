/**
 * VAHAP Workflow Komponens - Véleményeztetés
 * F-0096 - Döntési javaslat véleményeztetése
 * UCE-1824 - Véleményeztetés workflow lépés
 *
 * FONTOS: Ez NEM egy önálló CRUD modul!
 * Ez egy beágyazott workflow lépés, amely megjeleníti az aktív véleményeztetési folyamatot.
 */

const WfVelemenyezes = {
    name: 'wf-velemenyezes',

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
            // Aktív véleményeztetés adatai (mock adatból)
            velemenyeztetes: null,

            // Saját vélemény beküldés
            sajatVelemeny: {
                tipus: '', // 'elfogadas' vagy 'modositas'
                szoveg: '',
                modositasi_javaslat: ''
            },
            showVelemenyForm: false,

            // Bejelentkezett felhasználó ID (mock)
            currentUserId: 'UI003' // Kiss Péter (jogi szakreferens)
        };
    },

    computed: {
        // Saját vélemény már beküldve?
        sajatVelemenyBekuldte() {
            if (!this.velemenyeztetes) return false;
            const cimzett = this.velemenyeztetes.cimzettek.find(c => c.id === this.currentUserId);
            return cimzett && cimzett.velemeny !== null;
        },

        // Én vagyok a kiíró?
        enVagyokAKiiro() {
            if (!this.velemenyeztetes) return false;
            return this.velemenyeztetes.kiiro.id === this.currentUserId;
        },

        // Én vagyok címzett?
        enVagyokCimzett() {
            if (!this.velemenyeztetes) return false;
            return this.velemenyeztetes.cimzettek.some(c => c.id === this.currentUserId);
        },

        // Vélemények összesítése
        velemenyekOsszesites() {
            if (!this.velemenyeztetes) return null;

            const osszes = this.velemenyeztetes.cimzettek.length;
            const kesz = this.velemenyeztetes.cimzettek.filter(c => c.velemeny).length;
            const elfogad = this.velemenyeztetes.cimzettek.filter(
                c => c.velemeny && c.velemeny.tipus === 'elfogadas'
            ).length;
            const modositas = this.velemenyeztetes.cimzettek.filter(
                c => c.velemeny && c.velemeny.modositas_szukseges
            ).length;
            const hianyzik = osszes - kesz;

            return { osszes, kesz, elfogad, modositas, hianyzik };
        },

        // Státusz színezés
        statuszSzin() {
            if (!this.velemenyeztetes) return 'secondary';
            const napok = this.velemenyeztetes.napok_hatra;
            if (napok <= 1) return 'danger';
            if (napok <= 3) return 'warning';
            return 'success';
        },

        // Összes vélemény beérkezett?
        osszesVelemenyBeerkezett() {
            return this.velemenyekOsszesites && this.velemenyekOsszesites.hianyzik === 0;
        }
    },

    methods: {
        // Mock adatok betöltése
        loadMockData() {
            // Betöltjük az aktív véleményeztetést a mock adatokból
            if (window.VahapMockData && window.VahapMockData.velemenyezes &&
                window.VahapMockData.velemenyezes.velemenyeztetes_feladatok) {

                const mockData = window.VahapMockData.velemenyezes.velemenyeztetes_feladatok;

                // Vesszük az első aktív feladatot (mock)
                if (mockData.aktivFeladatok && mockData.aktivFeladatok.length > 0) {
                    this.velemenyeztetes = JSON.parse(JSON.stringify(mockData.aktivFeladatok[0]));

                    console.log('[Véleményezés] Aktív véleményeztetés betöltve:', this.velemenyeztetes);
                } else {
                    console.warn('[Véleményezés] Nincs aktív véleményeztetés');
                }
            } else {
                console.error('[Véleményezés] Mock adatok nem találhatók!');
            }
        },

        // Vélemény beküldés megkezdése
        startVelemenyezes() {
            this.showVelemenyForm = true;
            this.sajatVelemeny = {
                tipus: '',
                szoveg: '',
                modositasi_javaslat: ''
            };
        },

        // Vélemény mentése
        mentVelemeny() {
            if (!this.sajatVelemeny.tipus || !this.sajatVelemeny.szoveg.trim()) {
                alert('Kérem válasszon vélemény típust és írjon szöveget!');
                return;
            }

            // Megkeressük a saját címzett objektumunkat
            const cimzett = this.velemenyeztetes.cimzettek.find(c => c.id === this.currentUserId);
            if (cimzett) {
                cimzett.statusz = 'kesz';
                cimzett.velemeny_datum = new Date().toISOString().split('T')[0];
                cimzett.velemeny = {
                    tipus: this.sajatVelemeny.tipus,
                    szoveg: this.sajatVelemeny.szoveg,
                    modositas_szukseges: this.sajatVelemeny.tipus === 'modositas',
                    modositasi_javaslat: this.sajatVelemeny.tipus === 'modositas' ?
                        this.sajatVelemeny.modositasi_javaslat : null
                };

                console.log('[Véleményezés] Vélemény mentve:', cimzett);

                this.showVelemenyForm = false;
                alert('Vélemény sikeresen beküldve!');
            }
        },

        // Véleményeztetés lezárása (kiíró)
        lezarasVelemenyeztetes() {
            const ossz = this.velemenyekOsszesites;

            if (ossz.hianyzik > 0) {
                const valasz = confirm(
                    `Még ${ossz.hianyzik} vélemény hiányzik.\nBiztosan lezárja a véleményeztetést?`
                );
                if (!valasz) return;
            }

            // Döntés a vélemények alapján
            let dontes = '';
            if (ossz.modositas > 0) {
                dontes = 'modositas_szukseges';
            } else if (ossz.elfogad === ossz.osszes) {
                dontes = 'jovahagyasra_kuldheto';
            } else {
                dontes = 'reszben_elfogadva';
            }

            console.log('[Véleményezés] Lezárás:', {
                dontes: dontes,
                osszesites: ossz
            });

            this.$emit('complete', {
                type: 'velemenyezes_lezaras',
                dontes: dontes,
                velemeny_osszesites: ossz
            });

            alert(`Véleményeztetés lezárva!\n\nDöntés: ${dontes}\nElfogadó: ${ossz.elfogad}\nMódosítást kérő: ${ossz.modositas}`);
        },

        // Emlékeztető küldés (mock)
        emlekeztetoKuldes() {
            const hianyzik = this.velemenyeztetes.cimzettek.filter(c => !c.velemeny);
            if (hianyzik.length === 0) {
                alert('Minden címzett már véleményezett.');
                return;
            }

            console.log('[Véleményezés] Emlékeztető küldés:', hianyzik.map(c => c.nev));
            alert(`Emlékeztető elküldve ${hianyzik.length} címzettnek:\n${hianyzik.map(c => c.nev).join(', ')}`);
        },

        // Címzett státusz badge
        getCimzettStatuszBadge(statusz) {
            const badges = {
                'kesz': { class: 'bg-success', text: 'Véleményezte', icon: 'bi-check-circle-fill' },
                'folyamatban': { class: 'bg-info', text: 'Folyamatban', icon: 'bi-hourglass-split' },
                'varakozas': { class: 'bg-secondary', text: 'Várakozik', icon: 'bi-clock' }
            };
            return badges[statusz] || badges['varakozas'];
        },

        // Feladat típus ikon (mock adatból)
        getFeladatTipusIcon(tipus) {
            const ikonok = {
                'szakmai': 'bi-clipboard-check',
                'jogi': 'bi-scale',
                'muszaki': 'bi-gear',
                'vezetoi': 'bi-person-check',
                'egyeb': 'bi-chat-dots'
            };
            return ikonok[tipus] || 'bi-chat-dots';
        }
    },

    mounted() {
        this.loadMockData();
    },

    template: `
        <div class="component-card velemenyezes-component">
            <div class="component-card-header">
                <h5 class="component-card-title">
                    <i class="bi bi-chat-dots text-primary"></i>
                    Véleményeztetés
                    <span class="badge bg-secondary ms-2">F-0096</span>
                    <span class="badge bg-info ms-1">UCE-1824</span>
                </h5>
            </div>

            <div class="component-card-body">
                <!-- Nincs aktív véleményeztetés -->
                <div v-if="!velemenyeztetes" class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Jelenleg nincs aktív véleményeztetési folyamat ehhez a lépéshez.
                </div>

                <!-- Aktív véleményeztetés -->
                <div v-else>
                    <!-- Véleményeztetés információk -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">
                                    <i :class="getFeladatTipusIcon(velemenyeztetes.feladatTipus)"></i>
                                    {{ velemenyeztetes.feladatNev }}
                                </h6>
                                <span :class="'badge bg-' + statuszSzin">
                                    <i class="bi bi-clock"></i> {{ velemenyeztetes.napok_hatra }} nap hátra
                                </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="card-text">{{ velemenyeztetes.leiras }}</p>

                            <div class="row g-3 mb-3">
                                <div class="col-md-4">
                                    <small class="text-muted d-block">Kiíró</small>
                                    <strong>{{ velemenyeztetes.kiiro.nev }}</strong>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted d-block">Határidő</small>
                                    <strong>{{ velemenyeztetes.hatarido }}</strong>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted d-block">Ügyazonosító</small>
                                    <strong>{{ velemenyeztetes.ugyazonosito }}</strong>
                                </div>
                            </div>

                            <!-- Csatolt dokumentumok -->
                            <div v-if="velemenyeztetes.csatolmanyok && velemenyeztetes.csatolmanyok.length > 0">
                                <h6 class="mb-2">
                                    <i class="bi bi-paperclip"></i> Csatolt dokumentumok
                                </h6>
                                <ul class="list-group mb-3">
                                    <li v-for="(doc, idx) in velemenyeztetes.csatolmanyok" :key="idx"
                                        class="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <i class="bi bi-file-pdf text-danger"></i> {{ doc.nev }}
                                        </span>
                                        <span class="badge bg-secondary">{{ doc.meret }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Összesítő kártyák -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h3 class="mb-0">{{ velemenyekOsszesites.osszes }}</h3>
                                    <small class="text-muted">Összes véleményező</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h3 class="text-success mb-0">{{ velemenyekOsszesites.elfogad }}</h3>
                                    <small class="text-muted">Elfogadó</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h3 class="text-warning mb-0">{{ velemenyekOsszesites.modositas }}</h3>
                                    <small class="text-muted">Módosítást kér</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h3 class="text-secondary mb-0">{{ velemenyekOsszesites.hianyzik }}</h3>
                                    <small class="text-muted">Hiányzik</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Saját vélemény beküldése (ha címzett vagyok) -->
                    <div v-if="enVagyokCimzett && !sajatVelemenyBekuldte" class="alert alert-warning mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="bi bi-exclamation-triangle-fill"></i>
                                <strong>A véleménye szükséges!</strong>
                                <p class="mb-0">Kérem véleményezze a dokumentumot.</p>
                            </div>
                            <button class="btn btn-primary" @click="startVelemenyezes">
                                <i class="bi bi-pencil"></i> Véleményezés
                            </button>
                        </div>
                    </div>

                    <!-- Vélemény beküldés form -->
                    <div v-if="showVelemenyForm" class="card mb-4 border-primary">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0">
                                <i class="bi bi-pencil-square"></i> Vélemény beküldése
                            </h6>
                        </div>
                        <div class="card-body">
                            <!-- Vélemény típus választás -->
                            <div class="mb-3">
                                <label class="form-label fw-bold">Vélemény típusa <span class="text-danger">*</span></label>
                                <div class="d-grid gap-2">
                                    <button type="button"
                                            class="btn text-start"
                                            :class="sajatVelemeny.tipus === 'elfogadas' ? 'btn-success' : 'btn-outline-success'"
                                            @click="sajatVelemeny.tipus = 'elfogadas'">
                                        <i class="bi bi-check-circle-fill"></i>
                                        <strong>Elfogadom</strong>
                                        <small class="d-block">A dokumentum megfelelő, nincs módosítási javaslat</small>
                                    </button>
                                    <button type="button"
                                            class="btn text-start"
                                            :class="sajatVelemeny.tipus === 'modositas' ? 'btn-warning' : 'btn-outline-warning'"
                                            @click="sajatVelemeny.tipus = 'modositas'">
                                        <i class="bi bi-pencil-fill"></i>
                                        <strong>Módosítást kérek</strong>
                                        <small class="d-block">Módosítási javaslattal küldöm vissza</small>
                                    </button>
                                </div>
                            </div>

                            <!-- Vélemény szöveg -->
                            <div class="mb-3">
                                <label class="form-label fw-bold">Vélemény szövege <span class="text-danger">*</span></label>
                                <textarea class="form-control" rows="4" v-model="sajatVelemeny.szoveg"
                                          placeholder="Írja le részletesen a véleményét..."></textarea>
                            </div>

                            <!-- Módosítási javaslat (ha módosítást kér) -->
                            <div v-if="sajatVelemeny.tipus === 'modositas'" class="mb-3">
                                <label class="form-label fw-bold">Konkrét módosítási javaslat</label>
                                <textarea class="form-control" rows="3" v-model="sajatVelemeny.modositasi_javaslat"
                                          placeholder="Írja le konkrétan, mit kell módosítani..."></textarea>
                            </div>

                            <!-- Műveletek -->
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-secondary" @click="showVelemenyForm = false">
                                    <i class="bi bi-x-circle"></i> Mégse
                                </button>
                                <button class="btn btn-primary" @click="mentVelemeny"
                                        :disabled="!sajatVelemeny.tipus || !sajatVelemeny.szoveg.trim()">
                                    <i class="bi bi-send"></i> Vélemény beküldése
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Véleményezők állapota táblázat -->
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-people"></i> Véleményezők állapota
                            </h6>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 30%">Véleményező</th>
                                            <th style="width: 15%">Állapot</th>
                                            <th style="width: 15%">Dátum</th>
                                            <th style="width: 40%">Vélemény</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="cimzett in velemenyeztetes.cimzettek" :key="cimzett.id">
                                            <td>
                                                <strong>{{ cimzett.nev }}</strong>
                                                <span v-if="cimzett.id === currentUserId" class="badge bg-info ms-2">Ön</span>
                                            </td>
                                            <td>
                                                <span :class="'badge ' + getCimzettStatuszBadge(cimzett.statusz).class">
                                                    <i :class="getCimzettStatuszBadge(cimzett.statusz).icon"></i>
                                                    {{ getCimzettStatuszBadge(cimzett.statusz).text }}
                                                </span>
                                            </td>
                                            <td>
                                                <span v-if="cimzett.velemeny_datum">{{ cimzett.velemeny_datum }}</span>
                                                <span v-else class="text-muted">-</span>
                                            </td>
                                            <td>
                                                <div v-if="cimzett.velemeny">
                                                    <span v-if="cimzett.velemeny.tipus === 'elfogadas'" class="badge bg-success mb-1">
                                                        <i class="bi bi-check-circle"></i> Elfogadás
                                                    </span>
                                                    <span v-else-if="cimzett.velemeny.modositas_szukseges" class="badge bg-warning mb-1">
                                                        <i class="bi bi-pencil"></i> Módosítás szükséges
                                                    </span>
                                                    <p class="mb-0 small">{{ cimzett.velemeny.szoveg }}</p>
                                                    <div v-if="cimzett.velemeny.modositasi_javaslat" class="alert alert-warning py-1 px-2 mb-0 mt-1 small">
                                                        <strong>Módosítási javaslat:</strong> {{ cimzett.velemeny.modositasi_javaslat }}
                                                    </div>
                                                </div>
                                                <span v-else class="text-muted">Vélemény még nem érkezett be</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Műveletek (kiíró számára) -->
                    <div v-if="enVagyokAKiiro" class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-secondary" @click="emlekeztetoKuldes">
                            <i class="bi bi-bell"></i> Emlékeztető küldése
                        </button>

                        <div class="d-flex gap-2">
                            <button v-if="osszesVelemenyBeerkezett && velemenyekOsszesites.modositas === 0"
                                    class="btn btn-success"
                                    @click="lezarasVelemenyeztetes">
                                <i class="bi bi-check-circle"></i> Jóváhagyásra küldhető
                            </button>
                            <button v-else-if="velemenyekOsszesites.modositas > 0"
                                    class="btn btn-warning"
                                    @click="lezarasVelemenyeztetes">
                                <i class="bi bi-pencil"></i> Módosítás szükséges
                            </button>
                            <button v-else
                                    class="btn btn-primary"
                                    @click="lezarasVelemenyeztetes">
                                <i class="bi bi-check2-square"></i> Véleményeztetés lezárása
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Workflow navigáció -->
                <div class="border-top mt-4 pt-3">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-secondary" @click="$emit('action', {type: 'cancel'})">
                            <i class="bi bi-arrow-left"></i> Vissza
                        </button>
                        <button class="btn btn-success" @click="$emit('complete', {type: 'velemenyezes_befejez'})">
                            <i class="bi bi-check2-circle"></i> Tovább a következő lépésre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};
