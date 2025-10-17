/**
 * VAHAP - Véleményezési Komponens
 * Többszörös véleményezési folyamat kezelése
 * Funkciók:
 * - Véleményezők kiválasztása
 * - Vélemények rögzítése
 * - Vélemények értékelése
 * - Státusz követés
 */

const ViharVelemenyezes = {
    name: 'vihar-velemenyezes',
    props: {
        dokumentum: {
            type: Object,
            required: false,
            default: () => ({})
        },
        mode: {
            type: String,
            default: 'eloterjesztes', // 'eloterjesztes', 'velemenyez', 'ertekeles'
            validator: (value) => ['eloterjesztes', 'velemenyez', 'ertekeles'].includes(value)
        },
        currentUser: {
            type: Object,
            default: () => ({
                nev: 'Szabó Péter',
                szerepkor: 'ugyintezo'
            })
        }
    },
    emits: ['velemenyezes-elkuldve', 'velemeny-rogzitve', 'ertekeles-befejezve'],
    data() {
        return {
            // Előterjesztés mód adatok
            selectedVelemenyezok: [],
            kiseroUzenet: '',

            // Véleményezés mód adatok
            velemeny: {
                allapot: '', // 'elfogad', 'elutasit', 'megjegyzes'
                szoveg: '',
                modositasok: []
            },

            // Értékelés mód adatok
            velemenyErtekelesek: [],

            // Lehetséges véleményezők listája
            lehetsegesVelemenyezok: [
                {
                    id: 'vezeto_1',
                    nev: 'Dr. Nagy Andrea',
                    beosztas: 'Osztályvezető',
                    szerepkor: 'vezeto',
                    tipus: 'belso'
                },
                {
                    id: 'ugyintezo_1',
                    nev: 'Kovács László',
                    beosztas: 'Vezető ügyintéző',
                    szerepkor: 'ugyintezo',
                    tipus: 'belso'
                },
                {
                    id: 'ugyintezo_2',
                    nev: 'Tóth Mária',
                    beosztas: 'Ügyintéző',
                    szerepkor: 'ugyintezo',
                    tipus: 'belso'
                },
                {
                    id: 'szakerto_1',
                    nev: 'Dr. Kiss Gábor',
                    beosztas: 'Jogtanácsos',
                    szerepkor: 'szakerto',
                    tipus: 'belso'
                },
                {
                    id: 'kulso_1',
                    nev: 'Prof. Dr. Szabó István',
                    beosztas: 'Külső szakértő',
                    szerepkor: 'szakerto',
                    tipus: 'kulso'
                }
            ]
        };
    },
    computed: {
        osszesMindVelemenyezo() {
            return this.selectedVelemenyezok.length === this.lehetsegesVelemenyezok.length;
        },
        velemenyStatusz() {
            if (!this.dokumentum.velemenyezesek) return {};

            const osszes = this.dokumentum.velemenyezesek.length;
            const valaszolt = this.dokumentum.velemenyezesek.filter(v => v.statusz === 'valaszolt').length;
            const elolvasva = this.dokumentum.velemenyezesek.filter(v => v.statusz === 'elolvasva').length;
            const kikuldve = this.dokumentum.velemenyezesek.filter(v => v.statusz === 'kikuldve').length;

            return {
                osszes,
                valaszolt,
                elolvasva,
                kikuldve,
                folyamatban: osszes - valaszolt,
                szazalek: osszes > 0 ? Math.round((valaszolt / osszes) * 100) : 0
            };
        },
        dokumentumStatusz() {
            const statuszok = {
                'szerkesztes': {
                    szin: 'secondary',
                    ikon: 'pencil',
                    szoveg: 'Szerkesztés alatt'
                },
                'velemenyezesre_kuldve': {
                    szin: 'primary',
                    ikon: 'send',
                    szoveg: 'Véleményezésre küldve'
                },
                'velemenyezes_folyamatban': {
                    szin: 'warning',
                    ikon: 'clock',
                    szoveg: 'Véleményezés folyamatban'
                },
                'velemenyezek_beerkeztek': {
                    szin: 'info',
                    ikon: 'check2-square',
                    szoveg: 'Vélemények beérkeztek'
                },
                'velemenyezes_ertekeles': {
                    szin: 'primary',
                    ikon: 'clipboard-check',
                    szoveg: 'Vélemények értékelés alatt'
                },
                'velemenyezve': {
                    szin: 'success',
                    ikon: 'check-circle',
                    szoveg: 'Vélemények értékelve'
                },
                'vegleges': {
                    szin: 'success',
                    ikon: 'shield-check',
                    szoveg: 'Végleges'
                }
            };

            return statuszok[this.dokumentum.velemenyezesStatusz] || statuszok['szerkesztes'];
        }
    },
    template: `
        <div class="vihar-velemenyezes">

            <!-- ==========================================
                 1. ELŐTERJESZTÉS MÓD - Véleményezők kiválasztása
                 ========================================== -->
            <div v-if="mode === 'eloterjesztes'">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">
                            <i class="bi bi-people"></i>
                            Véleményezésre Előterjesztés
                        </h5>
                    </div>
                    <div class="card-body">

                        <!-- Dokumentum információ -->
                        <div class="alert alert-info">
                            <strong><i class="bi bi-file-earmark-text"></i> Dokumentum:</strong>
                            {{ dokumentum.tipus || 'Határozat tervezet' }}
                            <br>
                            <small class="text-muted">
                                {{ dokumentum.ugyazonosito || 'VAHAP-V-2024-001234' }} -
                                {{ dokumentum.megnevezes || 'Vasúti járművezető alkalmassági vizsgálat' }}
                            </small>
                        </div>

                        <!-- Véleményezők kiválasztása -->
                        <h6 class="mt-3">Véleményezők kiválasztása</h6>
                        <p class="small text-muted">
                            Válassza ki, kiktől kér véleményt a dokumentum tervezethez.
                        </p>

                        <!-- Összes kiválasztása -->
                        <div class="form-check mb-3">
                            <input class="form-check-input"
                                   type="checkbox"
                                   id="mindenkiCheck"
                                   :checked="osszesMindVelemenyezo"
                                   @change="toggleMindenkitValaszt">
                            <label class="form-check-label fw-bold" for="mindenkiCheck">
                                Mindenki kiválasztása
                            </label>
                        </div>

                        <!-- Véleményezők listája -->
                        <div class="row">
                            <div v-for="velemenyezo in lehetsegesVelemenyezok"
                                 :key="velemenyezo.id"
                                 class="col-md-6 mb-2">
                                <div class="card h-100"
                                     :class="{'border-primary': selectedVelemenyezok.includes(velemenyezo.id)}">
                                    <div class="card-body p-2">
                                        <div class="form-check">
                                            <input class="form-check-input"
                                                   type="checkbox"
                                                   :id="'velemenyezo_' + velemenyezo.id"
                                                   :value="velemenyezo.id"
                                                   v-model="selectedVelemenyezok">
                                            <label class="form-check-label w-100" :for="'velemenyezo_' + velemenyezo.id">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div class="fw-bold">{{ velemenyezo.nev }}</div>
                                                        <small class="text-muted">{{ velemenyezo.beosztas }}</small>
                                                    </div>
                                                    <span class="badge"
                                                          :class="velemenyezo.tipus === 'kulso' ? 'bg-warning' : 'bg-info'">
                                                        {{ velemenyezo.tipus === 'kulso' ? 'Külső' : 'Belső' }}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Kísérő üzenet -->
                        <div class="mt-3">
                            <label class="form-label">
                                <i class="bi bi-envelope"></i>
                                Kísérő üzenet (opcionális)
                            </label>
                            <textarea class="form-control"
                                      v-model="kiseroUzenet"
                                      rows="3"
                                      placeholder="Írjon kísérő üzenetet a véleményezőknek..."></textarea>
                        </div>

                        <!-- Összesítés -->
                        <div class="alert alert-secondary mt-3">
                            <i class="bi bi-info-circle"></i>
                            <strong>Kiválasztva: {{ selectedVelemenyezok.length }} személy</strong>
                        </div>

                        <!-- Véleményezésre küldés gomb -->
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-lg"
                                    :disabled="selectedVelemenyezok.length === 0"
                                    @click="kuldesVelemenyezesre">
                                <i class="bi bi-send"></i>
                                Véleményezésre küldés ({{ selectedVelemenyezok.length }} személynek)
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ==========================================
                 2. VÉLEMÉNYEZÉS MÓD - Vélemény rögzítése
                 ========================================== -->
            <div v-if="mode === 'velemenyez'">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="bi bi-chat-left-text"></i>
                            Véleményezés
                        </h5>
                    </div>
                    <div class="card-body">

                        <!-- Dokumentum előnézet -->
                        <div class="alert alert-light border">
                            <h6><i class="bi bi-file-earmark-text"></i> Dokumentum tervezet</h6>
                            <div class="bg-white p-3 border rounded" style="max-height: 300px; overflow-y: auto;">
                                <pre style="white-space: pre-wrap; font-size: 0.875rem;">{{ dokumentum.tartalom || 'Dokumentum tartalom...' }}</pre>
                            </div>
                        </div>

                        <!-- Véleményezés státusz -->
                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                <i class="bi bi-hand-thumbs-up"></i>
                                Véleménye a dokumentumról
                            </label>
                            <div class="btn-group w-100" role="group">
                                <input type="radio"
                                       class="btn-check"
                                       name="velemenyAllapot"
                                       id="elfogad"
                                       value="elfogad"
                                       v-model="velemeny.allapot">
                                <label class="btn btn-outline-success" for="elfogad">
                                    <i class="bi bi-check-circle"></i> Elfogadom
                                </label>

                                <input type="radio"
                                       class="btn-check"
                                       name="velemenyAllapot"
                                       id="elutasit"
                                       value="elutasit"
                                       v-model="velemeny.allapot">
                                <label class="btn btn-outline-danger" for="elutasit">
                                    <i class="bi bi-x-circle"></i> Elutasítom, módosítást kérek
                                </label>

                                <input type="radio"
                                       class="btn-check"
                                       name="velemenyAllapot"
                                       id="megjegyzes"
                                       value="megjegyzes"
                                       v-model="velemeny.allapot">
                                <label class="btn btn-outline-warning" for="megjegyzes">
                                    <i class="bi bi-chat-square-text"></i> Megjegyzéssel visszaküldöm
                                </label>
                            </div>
                        </div>

                        <!-- Vélemény szövege -->
                        <div class="mb-3">
                            <label class="form-label">
                                <i class="bi bi-pencil"></i>
                                Részletes vélemény
                                <span v-if="velemeny.allapot === 'elutasit'" class="text-danger">*</span>
                            </label>
                            <textarea class="form-control"
                                      v-model="velemeny.szoveg"
                                      rows="5"
                                      :placeholder="velemenyPlaceholder"
                                      :required="velemeny.allapot === 'elutasit'"></textarea>
                            <small class="form-text text-muted">
                                {{ velemeny.szoveg.length }} karakter
                                <span v-if="velemeny.allapot === 'elutasit'"> (min. 50 karakter szükséges)</span>
                            </small>
                        </div>

                        <!-- Validáció -->
                        <div v-if="!velemenyValid" class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Kérem, töltse ki a kötelező mezőket:</strong>
                            <ul class="mb-0 mt-1">
                                <li v-if="!velemeny.allapot">Válassza ki véleménye típusát</li>
                                <li v-if="velemeny.allapot === 'elutasit' && velemeny.szoveg.length < 50">
                                    Adjon meg részletes indoklást (min. 50 karakter)
                                </li>
                            </ul>
                        </div>

                        <!-- Vélemény elküldése -->
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-lg"
                                    :disabled="!velemenyValid"
                                    @click="velemenyElkuldese">
                                <i class="bi bi-send-check"></i>
                                Vélemény elküldése
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ==========================================
                 3. ÉRTÉKELÉS MÓD - Beérkezett vélemények értékelése
                 ========================================== -->
            <div v-if="mode === 'ertekeles'">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="bi bi-clipboard-check"></i>
                            Vélemények Értékelése
                        </h5>
                    </div>
                    <div class="card-body">

                        <!-- Státusz áttekintés -->
                        <div class="alert alert-info">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <h3 class="mb-0">{{ velemenyStatusz.osszes }}</h3>
                                    <small>Összes véleményező</small>
                                </div>
                                <div class="col-md-4 text-center">
                                    <h3 class="mb-0 text-success">{{ velemenyStatusz.valaszolt }}</h3>
                                    <small>Válaszolt</small>
                                </div>
                                <div class="col-md-4 text-center">
                                    <h3 class="mb-0 text-warning">{{ velemenyStatusz.folyamatban }}</h3>
                                    <small>Folyamatban</small>
                                </div>
                            </div>
                            <div class="progress mt-2" style="height: 10px;">
                                <div class="progress-bar bg-success"
                                     :style="{width: velemenyStatusz.szazalek + '%'}">
                                </div>
                            </div>
                        </div>

                        <!-- Beérkezett vélemények -->
                        <h6 class="mt-3">Beérkezett vélemények</h6>

                        <div v-for="(velemeny, index) in dokumentum.velemenyezesek"
                             :key="index"
                             class="card mb-3"
                             :class="getVelemenyBorderClass(velemeny)">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{{ velemeny.velemenyezo }}</strong>
                                    <span class="badge bg-secondary ms-2">{{ velemeny.beosztas }}</span>
                                </div>
                                <span class="badge" :class="getVelemenyStatuszBadge(velemeny.allapot)">
                                    {{ getVelemenyStatuszSzoveg(velemeny.allapot) }}
                                </span>
                            </div>
                            <div class="card-body">
                                <!-- Vélemény tartalma -->
                                <div v-if="velemeny.statusz === 'valaszolt'">
                                    <p class="mb-2">
                                        <strong>Vélemény:</strong><br>
                                        {{ velemeny.szoveg }}
                                    </p>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar"></i>
                                        {{ velemeny.datum }}
                                    </small>

                                    <!-- Értékelés -->
                                    <div class="mt-3 border-top pt-3">
                                        <label class="form-label fw-bold">Ügyintézői értékelés:</label>
                                        <div class="row">
                                            <div class="col-md-6 mb-2">
                                                <div class="form-check">
                                                    <input class="form-check-input"
                                                           type="radio"
                                                           :name="'ertekeles_' + index"
                                                           :id="'figyelembe_' + index"
                                                           value="figyelembe"
                                                           v-model="velemeny.ertekeles">
                                                    <label class="form-check-label text-success" :for="'figyelembe_' + index">
                                                        <i class="bi bi-check-circle"></i>
                                                        Figyelembe veszem
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-2">
                                                <div class="form-check">
                                                    <input class="form-check-input"
                                                           type="radio"
                                                           :name="'ertekeles_' + index"
                                                           :id="'nem_figyelembe_' + index"
                                                           value="nem_figyelembe"
                                                           v-model="velemeny.ertekeles">
                                                    <label class="form-check-label text-danger" :for="'nem_figyelembe_' + index">
                                                        <i class="bi bi-x-circle"></i>
                                                        Nem veszem figyelembe
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Indoklás ha nem veszi figyelembe -->
                                        <div v-if="velemeny.ertekeles === 'nem_figyelembe'" class="mt-2">
                                            <label class="form-label small">Indoklás (miért nem veszi figyelembe):</label>
                                            <textarea class="form-control form-control-sm"
                                                      v-model="velemeny.ertekelesIndoklas"
                                                      rows="2"
                                                      placeholder="Adjon meg rövid indoklást..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <!-- Még nem válaszolt -->
                                <div v-else class="text-muted">
                                    <i class="bi bi-hourglass-split"></i>
                                    Vélemény még nem érkezett be
                                    <span v-if="velemeny.statusz === 'elolvasva'">(elolvasta a dokumentumot)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Értékelés befejezése -->
                        <div class="alert alert-warning" v-if="!osszeVelemenyErtékelve">
                            <i class="bi bi-exclamation-triangle"></i>
                            Kérem, értékelje az összes beérkezett véleményt!
                        </div>

                        <div class="d-grid gap-2">
                            <button class="btn btn-success btn-lg"
                                    :disabled="!osszeVelemenyErtékelve"
                                    @click="ertekelesBefejezese">
                                <i class="bi bi-check-circle-fill"></i>
                                Vélemények értékelése befejezve
                            </button>
                            <button class="btn btn-outline-primary"
                                    :disabled="!osszeVelemenyErtékelve"
                                    @click="folytatKovetkezoLepesse">
                                <i class="bi bi-arrow-right-circle"></i>
                                Folytatás következő lépéssel
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    `,
    computed: {
        velemenyPlaceholder() {
            const placeholders = {
                'elfogad': 'A dokumentum tervezet minden tekintetben megfelel, elfogadom...',
                'elutasit': 'A következő módosításokat kérem (kötelező részletes indoklás)...',
                'megjegyzes': 'A következő megjegyzéseim vannak a tervezettel kapcsolatban...'
            };
            return placeholders[this.velemeny.allapot] || 'Írja le részletes véleményét...';
        },
        velemenyValid() {
            if (!this.velemeny.allapot) return false;
            if (this.velemeny.allapot === 'elutasit' && this.velemeny.szoveg.length < 50) return false;
            return true;
        },
        osszeVelemenyErtékelve() {
            if (!this.dokumentum.velemenyezesek) return false;
            const valaszoltak = this.dokumentum.velemenyezesek.filter(v => v.statusz === 'valaszolt');
            return valaszoltak.every(v => v.ertekeles);
        }
    },
    methods: {
        toggleMindenkitValaszt(event) {
            if (event.target.checked) {
                this.selectedVelemenyezok = this.lehetsegesVelemenyezok.map(v => v.id);
            } else {
                this.selectedVelemenyezok = [];
            }
        },
        kuldesVelemenyezesre() {
            console.log('[Véleményezés] Véleményezésre küldés:', this.selectedVelemenyezok.length, 'személynek');

            const velemenyezesek = this.selectedVelemenyezok.map(id => {
                const velemenyezo = this.lehetsegesVelemenyezok.find(v => v.id === id);
                return {
                    id: id,
                    velemenyezo: velemenyezo.nev,
                    beosztas: velemenyezo.beosztas,
                    statusz: 'kikuldve',
                    kikuldve: new Date().toISOString().split('T')[0]
                };
            });

            this.$emit('velemenyezes-elkuldve', {
                velemenyezesek,
                kiseroUzenet: this.kiseroUzenet
            });

            alert(`✓ Dokumentum véleményezésre küldve ${this.selectedVelemenyezok.length} személynek!\n\nVéleményezők értesítést kapnak e-mailben.`);
        },
        velemenyElkuldese() {
            console.log('[Véleményezés] Vélemény elküldése:', this.velemeny.allapot);

            this.$emit('velemeny-rogzitve', {
                allapot: this.velemeny.allapot,
                szoveg: this.velemeny.szoveg,
                datum: new Date().toISOString().split('T')[0],
                velemenyezo: this.currentUser.nev
            });

            alert(`✓ Véleménye sikeresen elküldve!\n\nAz ügyintéző értesítést kap a véleményéről.`);

            // Reset
            this.velemeny = {
                allapot: '',
                szoveg: '',
                modositasok: []
            };
        },
        ertekelesBefejezese() {
            console.log('[Véleményezés] Értékelés befejezése');

            this.$emit('ertekeles-befejezve', {
                velemenyezesek: this.dokumentum.velemenyezesek
            });

            alert('✓ Vélemények értékelése befejezve!\n\nA dokumentum tervezet továbbléphet a következő fázisba.');
        },
        folytatKovetkezoLepesse() {
            this.ertekelesBefejezese();
            // Navigáció a következő lépéshez
        },
        getVelemenyBorderClass(velemeny) {
            if (velemeny.statusz !== 'valaszolt') return 'border-secondary';

            const borderMap = {
                'elfogad': 'border-success',
                'elutasit': 'border-danger',
                'megjegyzes': 'border-warning'
            };
            return borderMap[velemeny.allapot] || 'border-secondary';
        },
        getVelemenyStatuszBadge(allapot) {
            const badgeMap = {
                'elfogad': 'bg-success',
                'elutasit': 'bg-danger',
                'megjegyzes': 'bg-warning'
            };
            return badgeMap[allapot] || 'bg-secondary';
        },
        getVelemenyStatuszSzoveg(allapot) {
            const szovegMap = {
                'elfogad': 'Elfogadva',
                'elutasit': 'Módosítást kér',
                'megjegyzes': 'Megjegyzéssel'
            };
            return szovegMap[allapot] || 'Véleményezés alatt';
        }
    },
    mounted() {
        console.log('[VAHAP] Véleményezési komponens betöltve, mód:', this.mode);
    }
};
