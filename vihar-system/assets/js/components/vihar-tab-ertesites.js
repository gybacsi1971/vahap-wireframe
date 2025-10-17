/**
 * VAHAP - F-0089 Ügyfél értesítés küldő Tab
 * Döntés-előkészítés: ügyfél értesítés
 * Használat: <vahap-tab-ertesites :active="activeTab === 'ertesites'" :ugy="ugy"></vahap-tab-ertesites>
 */

const VahapTabErtesites = {
    name: 'vahap-tab-ertesites',
    emits: ['notification-sent'],
    props: {
        active: {
            type: Boolean,
            default: false
        },
        ugy: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            ertesites: {
                tipus: 'email', // email, levél, mindkettő
                targy: '',
                uzenet: '',
                sablonId: null
            },
            sending: false,
            sent: false,
            sablonok: [
                {
                    id: 1,
                    nev: 'Hiánypótlási felszólítás',
                    tipus: 'hianypotlas',
                    targy: 'Hiánypótlási felszólítás - ${ugyazonosito}',
                    uzenet: `Tisztelt ${this.ugy.ugyfel?.nev || 'Ügyfél'}!

Tájékoztatjuk, hogy a(z) \${ugyazonosito} számú ügyében benyújtott kérelme hiányos.

Kérjük, hogy az alábbi hiányosságokat \${hatarido}-ig pótolja:

\${hianylista}

Amennyiben a fenti határidőig a hiányosságokat nem pótolja, kérelmét érdemi vizsgálat nélkül elutasítjuk.

Tisztelettel:
Építési és Közlekedési Minisztérium
Vasúti Hatósági Főosztály`
                },
                {
                    id: 2,
                    nev: 'Tájékoztatás az eljárás állásáról',
                    tipus: 'tajekoztatas',
                    targy: 'Tájékoztatás - ${ugyazonosito}',
                    uzenet: `Tisztelt ${this.ugy.ugyfel?.nev || 'Ügyfél'}!

Tájékoztatjuk, hogy a(z) \${ugyazonosito} számú ügyében az eljárás folyamatban van.

Jelenlegi állapot: \${allapot}
Várható ügyintézési idő: \${varhato_ido}

Az eljárás eredményéről külön értesítést fog kapni.

Tisztelettel:
Építési és Közlekedési Minisztérium
Vasúti Hatósági Főosztály`
                },
                {
                    id: 3,
                    nev: 'Határozat kézbesítése',
                    tipus: 'hatarozat',
                    targy: 'Határozat - ${ugyazonosito}',
                    uzenet: `Tisztelt ${this.ugy.ugyfel?.nev || 'Ügyfél'}!

Tájékoztatjuk, hogy a(z) \${ugyazonosito} számú ügyében eljárásunk befejeződött.

A határozat csatoltan megtalálható.

A határozat ellen 15 napon belül fellebbezéssel élhet.

Tisztelettel:
Építési és Közlekedési Minisztérium
Vasúti Hatósági Főosztály`
                },
                {
                    id: 4,
                    nev: 'Egyedi értesítés',
                    tipus: 'egyedi',
                    targy: '',
                    uzenet: ''
                }
            ]
        };
    },
    computed: {
        karakterszam() {
            return this.ertesites.uzenet.length;
        },
        validForm() {
            return this.ertesites.targy.length >= 5 &&
                   this.ertesites.uzenet.length >= 20 &&
                   this.ertesites.tipus;
        },
        ugyfelEmail() {
            return this.ugy.ugyfel?.email || 'szabo.gabor@example.hu';
        },
        ugyfelCim() {
            return this.ugy.ugyfel?.lakcim ?
                   `${this.ugy.ugyfel.lakcim.iranyitoszam} ${this.ugy.ugyfel.lakcim.telepules}, ${this.ugy.ugyfel.lakcim.kozterulet} ${this.ugy.ugyfel.lakcim.hazszam}` :
                   '1144 Budapest, Füredi utca 30.';
        }
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <span class="badge badge-function">F-0089</span>
                    Döntés-előkészítés: Ügyfél értesítés
                </h5>
                <p class="mb-0 small text-muted">
                    Email vagy postai levél küldése az ügyfél részére
                </p>
            </div>

            <!-- Sikeres küldés -->
            <div v-if="sent" class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Értesítés sikeresen elküldve!</strong>
                <br>
                <small>Küldés módja: {{ ertesites.tipus === 'email' ? 'Email' : ertesites.tipus === 'levél' ? 'Postai levél' : 'Email és postai levél' }}</small>
                <br>
                <small>Címzett: {{ ugy.ugyfel?.nev || 'Szabó Gábor' }}</small>
                <button type="button" class="btn-close" @click="sent = false"></button>
            </div>

            <!-- Ügyfél adatok -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-person-circle"></i> Címzett adatai
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Név:</strong> {{ ugy.ugyfel?.nev || 'Szabó Gábor' }}</p>
                            <p class="mb-1"><strong>Email:</strong> {{ ugyfelEmail }}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>Lakcím:</strong> {{ ugyfelCim }}</p>
                            <p class="mb-1"><strong>Ügyazonosító:</strong> {{ ugy.ugyazonosito || 'VAHAP-V-2024-000923' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Értesítési sablon választó -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-file-earmark-text"></i> Értesítési sablon
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        <div class="col-md-3" v-for="sablon in sablonok" :key="sablon.id">
                            <button class="btn btn-outline-primary w-100"
                                    @click="selectSablon(sablon)"
                                    :class="{ active: ertesites.sablonId === sablon.id }">
                                <i class="bi" :class="{
                                    'bi-exclamation-triangle': sablon.tipus === 'hianypotlas',
                                    'bi-info-circle': sablon.tipus === 'tajekoztatas',
                                    'bi-file-earmark-check': sablon.tipus === 'hatarozat',
                                    'bi-pencil-square': sablon.tipus === 'egyedi'
                                }"></i>
                                <br>
                                <small>{{ sablon.nev }}</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Értesítés típusa -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-send"></i> Értesítés módja
                </div>
                <div class="card-body">
                    <div class="btn-group w-100" role="group">
                        <input type="radio" class="btn-check" id="tipus-email"
                               v-model="ertesites.tipus" value="email" autocomplete="off">
                        <label class="btn btn-outline-primary" for="tipus-email">
                            <i class="bi bi-envelope"></i> Email
                        </label>

                        <input type="radio" class="btn-check" id="tipus-level"
                               v-model="ertesites.tipus" value="levél" autocomplete="off">
                        <label class="btn btn-outline-primary" for="tipus-level">
                            <i class="bi bi-mailbox"></i> Postai levél
                        </label>

                        <input type="radio" class="btn-check" id="tipus-mindketto"
                               v-model="ertesites.tipus" value="mindkettő" autocomplete="off">
                        <label class="btn btn-outline-primary" for="tipus-mindketto">
                            <i class="bi bi-send-check"></i> Mindkettő
                        </label>
                    </div>
                </div>
            </div>

            <!-- Értesítés szerkesztő -->
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <i class="bi bi-pencil"></i> Értesítés tartalma
                </div>
                <div class="card-body">
                    <!-- Tárgy -->
                    <div class="mb-3">
                        <label class="form-label">
                            Tárgy <span class="text-danger">*</span>
                        </label>
                        <input type="text"
                               class="form-control"
                               v-model="ertesites.targy"
                               placeholder="Értesítés tárgya (min. 5 karakter)"
                               :class="{ 'is-invalid': ertesites.targy.length > 0 && ertesites.targy.length < 5 }">
                        <div class="invalid-feedback">
                            A tárgy legalább 5 karakter hosszú legyen
                        </div>
                    </div>

                    <!-- Üzenet -->
                    <div class="mb-3">
                        <label class="form-label">
                            Üzenet <span class="text-danger">*</span>
                            <span class="badge bg-secondary ms-2">{{ karakterszam }} karakter</span>
                        </label>
                        <textarea class="form-control"
                                  v-model="ertesites.uzenet"
                                  rows="12"
                                  placeholder="Értesítés szövege (min. 20 karakter)"
                                  :class="{ 'is-invalid': ertesites.uzenet.length > 0 && ertesites.uzenet.length < 20 }"></textarea>
                        <div class="invalid-feedback">
                            Az üzenet legalább 20 karakter hosszú legyen
                        </div>
                    </div>

                    <!-- Előnézet -->
                    <div v-if="ertesites.uzenet.length > 0" class="alert alert-info">
                        <strong><i class="bi bi-eye"></i> Előnézet:</strong>
                        <hr>
                        <p class="mb-1"><strong>Tárgy:</strong> {{ ertesites.targy }}</p>
                        <hr>
                        <pre style="white-space: pre-wrap; font-size: 0.875rem;">{{ ertesites.uzenet }}</pre>
                    </div>
                </div>
            </div>

            <!-- Műveleti gombok -->
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-secondary" @click="resetForm">
                            <i class="bi bi-x-circle"></i> Űrlap törlése
                        </button>
                        <button class="btn btn-success"
                                @click="sendNotification"
                                :disabled="!validForm || sending">
                            <span v-if="sending">
                                <span class="spinner-border spinner-border-sm me-2"></span>
                                Küldés...
                            </span>
                            <span v-else>
                                <i class="bi bi-send-fill"></i> Értesítés küldése
                            </span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    `,
    methods: {
        selectSablon(sablon) {
            this.ertesites.sablonId = sablon.id;

            if (sablon.tipus === 'egyedi') {
                this.ertesites.targy = '';
                this.ertesites.uzenet = '';
            } else {
                // Sablon paraméterek behelyettesítése
                this.ertesites.targy = this.replacePlaceholders(sablon.targy);
                this.ertesites.uzenet = this.replacePlaceholders(sablon.uzenet);
            }
        },
        replacePlaceholders(text) {
            return text
                .replace(/\$\{ugyazonosito\}/g, this.ugy.ugyazonosito || 'VAHAP-V-2024-000923')
                .replace(/\$\{hatarido\}/g, '2024.11.15')
                .replace(/\$\{hianylista\}/g, '- Orvosi alkalmasság igazolása\n- Szakmai végzettség másolata')
                .replace(/\$\{allapot\}/g, 'Tartalmi vizsgálat alatt')
                .replace(/\$\{varhato_ido\}/g, '2-3 hét');
        },
        sendNotification() {
            // F-0089 - Ügyfél értesítés küldése
            this.sending = true;

            setTimeout(() => {
                this.sending = false;
                this.sent = true;

                console.log('F-0089 - Ügyfél értesítés elküldve:', {
                    tipus: this.ertesites.tipus,
                    targy: this.ertesites.targy,
                    cimzett: this.ugy.ugyfel?.nev || 'Szabó Gábor',
                    email: this.ugyfelEmail
                });

                this.$emit('notification-sent', {
                    tipus: this.ertesites.tipus,
                    targy: this.ertesites.targy,
                    datum: new Date().toISOString()
                });

                // 3 másodperc után elrejti a sikeres üzenetet
                setTimeout(() => {
                    this.sent = false;
                    this.resetForm();
                }, 3000);
            }, 2000);
        },
        resetForm() {
            this.ertesites = {
                tipus: 'email',
                targy: '',
                uzenet: '',
                sablonId: null
            };
        }
    }
};
