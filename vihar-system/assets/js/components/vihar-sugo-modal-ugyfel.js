/**
 * VAHAP - Ügyfél (Külső rendszer) Súgó Modal
 * Részletes használati útmutató ügyfél számára lépésről lépésre
 * Használat: <vahap-sugo-modal-ugyfel :show="showSugo" @close="showSugo = false"></vahap-sugo-modal-ugyfel>
 */

const VahapSugoModalUgyfel = {
    name: 'vahap-sugo-modal-ugyfel',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeSzekció: 'bevezetes',
            szekciok: [
                {
                    id: 'bevezetes',
                    ikon: 'bi-info-circle',
                    cim: 'Bevezetés',
                    alcim: 'Üdvözöljük a VAHAP rendszerben!'
                },
                {
                    id: 'regisztracio',
                    ikon: 'bi-person-plus',
                    cim: 'Regisztráció',
                    alcim: 'Hogyan regisztrálok?'
                },
                {
                    id: 'kerelem-benyujtas',
                    ikon: 'bi-file-earmark-plus',
                    cim: 'Kérelem benyújtása',
                    alcim: 'Lépésről lépésre'
                },
                {
                    id: 'ugyek-kovetese',
                    ikon: 'bi-kanban',
                    cim: 'Ügyeim követése',
                    alcim: 'Státuszok és értesítések'
                },
                {
                    id: 'hianypotlas',
                    ikon: 'bi-exclamation-triangle',
                    cim: 'Hiánypótlás',
                    alcim: 'Mit tegyek, ha hiánypótlást kérek?'
                },
                {
                    id: 'dijfizetes',
                    ikon: 'bi-credit-card',
                    cim: 'Díjfizetés',
                    alcim: 'Hogyan fizessem ki a díjat?'
                },
                {
                    id: 'dokumentumok',
                    ikon: 'bi-file-earmark-arrow-down',
                    cim: 'Dokumentumok',
                    alcim: 'Letöltés és feltöltés'
                },
                {
                    id: 'gyik',
                    ikon: 'bi-question-circle',
                    cim: 'Gyakori kérdések',
                    alcim: 'GYIK és hibaelhárítás'
                }
            ]
        };
    },
    template: `
        <!-- Modal háttér -->
        <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content" style="height: 90vh;">

                    <!-- Modal fejléc -->
                    <div class="modal-header bg-gradient text-white" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%);">
                        <h5 class="modal-title">
                            <i class="bi bi-question-circle"></i>
                            VAHAP - Használati Útmutató Ügyfelek Számára
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
                    </div>

                    <!-- Modal test -->
                    <div class="modal-body p-0">
                        <div class="row g-0 h-100">

                            <!-- Bal oldali navigáció -->
                            <div class="col-md-3 bg-light border-end">
                                <div class="p-3">
                                    <h6 class="text-muted mb-3">Tartalomjegyzék</h6>
                                    <div class="list-group list-group-flush">
                                        <a v-for="szekció in szekciok"
                                           :key="szekció.id"
                                           href="#"
                                           @click.prevent="activeSzekció = szekció.id"
                                           class="list-group-item list-group-item-action"
                                           :class="{ active: activeSzekció === szekció.id }">
                                            <div class="d-flex align-items-center">
                                                <i :class="szekció.ikon" class="bi me-2"></i>
                                                <div>
                                                    <div class="fw-bold">{{ szekció.cim }}</div>
                                                    <small class="text-muted">{{ szekció.alcim }}</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Jobb oldali tartalom -->
                            <div class="col-md-9 overflow-auto" style="max-height: calc(90vh - 120px);">
                                <div class="p-4">

                                    <!-- 1. Bevezetés -->
                                    <div v-show="activeSzekció === 'bevezetes'">
                                        <h4><i class="bi bi-info-circle text-primary"></i> Üdvözöljük a VAHAP rendszerben!</h4>
                                        <hr>

                                        <div class="alert alert-success">
                                            <i class="bi bi-check-circle"></i>
                                            <strong>Mi a VAHAP?</strong>
                                            <p class="mb-0 mt-2">
                                                A VAHAP (Vasúti és Hajózási Integrált Hatósági Rendszer) egy elektronikus
                                                ügyintézési felület, ahol vasúti és hajózási hatósági kérelmeket nyújthat be
                                                egyszerűen, gyorsan és biztonságosan - a saját otthonából!
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Mit tud a rendszer?</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100 border-success">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-clock text-success"></i> 0-24 elérhetőség</h6>
                                                        <p class="small mb-0">
                                                            Bármikor benyújthatja kérelmét, akár éjszaka vagy hétvégén is.
                                                            Nincs sorban állás!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100 border-info">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-shield-check text-info"></i> Biztonságos</h6>
                                                        <p class="small mb-0">
                                                            Adatai titkosítva vannak, személyes dokumentumai
                                                            biztonságosan tárolódnak.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100 border-warning">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-bell text-warning"></i> Értesítések</h6>
                                                        <p class="small mb-0">
                                                            E-mailben értesítjük az ügy státuszának változásáról.
                                                            Mindig naprakész lehet!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100 border-primary">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-text text-primary"></i> Dokumentumok</h6>
                                                        <p class="small mb-0">
                                                            Kérelem letöltése, határozatok és igazolások elérése egy helyen.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Milyen kérelmeket nyújthatok be?</h5>
                                        <ul>
                                            <li><strong>Vasúti járművezető alkalmassági vizsgálat (V-044)</strong> - Új vizsgálat vagy megújítás</li>
                                            <li><strong>Hajózási engedélyek (H-052)</strong> - Kikötői engedélyek, víziút használat</li>
                                            <li>...és még sok más hatósági eljárás</li>
                                        </ul>

                                        <div class="alert alert-info mt-3">
                                            <i class="bi bi-lightbulb"></i>
                                            <strong>Első használat?</strong>
                                            <p class="mb-0 mt-2">
                                                Ezt a súgót bármikor megnyithatja a fejlécben található
                                                <span class="badge bg-primary">Súgó</span> gombbal. Ne feledje elmenteni a jelszavát!
                                            </p>
                                        </div>
                                    </div>

                                    <!-- 2. Regisztráció -->
                                    <div v-show="activeSzekció === 'regisztracio'">
                                        <h4><i class="bi bi-person-plus text-primary"></i> Regisztráció</h4>
                                        <hr>

                                        <div class="alert alert-warning">
                                            <i class="bi bi-exclamation-triangle"></i>
                                            <strong>Fontos:</strong>
                                            <p class="mb-0 mt-2">
                                                A VAHAP rendszer használatához először regisztrálnia kell. A regisztráció
                                                ingyenes és egyszerű!
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Regisztrációs lépések</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ol>
                                                    <li class="mb-3">
                                                        <strong>Kattintson a "Regisztráció" gombra</strong>
                                                        <p class="small text-muted mb-0">A főoldalon vagy a belépési képernyőn találja</p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Töltse ki személyes adatait</strong>
                                                        <ul class="small text-muted">
                                                            <li>Teljes név (ahogy a személyi igazolványon szerepel)</li>
                                                            <li>Születési dátum</li>
                                                            <li>Anyja neve</li>
                                                            <li>E-mail cím (ide küldjük az értesítéseket!)</li>
                                                            <li>Telefonszám</li>
                                                        </ul>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Adjon meg felhasználónevet és jelszót</strong>
                                                        <div class="alert alert-info mt-2 mb-0">
                                                            <small>
                                                                <i class="bi bi-shield-lock"></i>
                                                                <strong>Biztonságos jelszó:</strong><br>
                                                                - Legalább 8 karakter<br>
                                                                - Tartalmaz nagybetűt, kisbetűt és számot<br>
                                                                - Példa: <code>Vahap2024!</code>
                                                            </small>
                                                        </div>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Fogadja el az Általános Szerződési Feltételeket</strong>
                                                        <p class="small text-muted mb-0">Olvassa el az adatvédelmi tájékoztatót</p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Kattintson a "Regisztráció" gombra</strong>
                                                        <p class="small text-muted mb-0">A rendszer ellenőrzi az adatokat</p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Erősítse meg e-mail címét</strong>
                                                        <p class="small text-muted mb-0">
                                                            Kapni fog egy e-mailt egy megerősítő linkkel. Kattintson rá 24 órán belül!
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <strong>Jelentkezzen be</strong>
                                                        <p class="small text-muted mb-0">Most már használhatja a rendszert!</p>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>

                                        <div class="alert alert-danger">
                                            <i class="bi bi-exclamation-octagon"></i>
                                            <strong>Gyakori hibák:</strong>
                                            <ul class="mb-0 mt-2">
                                                <li><strong>Nem jött meg az e-mail?</strong> Nézze meg a spam mappát is!</li>
                                                <li><strong>Elfelejtette a jelszót?</strong> Használja a "Jelszó visszaállítása" funkciót</li>
                                                <li><strong>Már létező e-mail cím?</strong> Lehet, hogy már regisztrált korábban</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- 3. Kérelem benyújtása -->
                                    <div v-show="activeSzekció === 'kerelem-benyujtas'">
                                        <h4><i class="bi bi-file-earmark-plus text-primary"></i> Kérelem benyújtása</h4>
                                        <hr>

                                        <div class="alert alert-success">
                                            <i class="bi bi-info-circle"></i>
                                            <strong>Kérelem kitöltése lépésről lépésre</strong>
                                            <p class="mb-0 mt-2">
                                                A rendszer végigvezeti Önt az űrlap kitöltésén. Bármikor mentheti
                                                és később folytathatja!
                                            </p>
                                        </div>

                                        <h5 class="mt-4">1. lépés: Kérelem indítása</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ol>
                                                    <li>Jelentkezzen be a rendszerbe</li>
                                                    <li>Az "Ügyeim" oldalon kattintson az <span class="badge bg-primary">Új kérelem</span> gombra</li>
                                                    <li>Válassza ki a kérelem típusát:
                                                        <ul class="mt-2">
                                                            <li><strong>V-044:</strong> Vasúti járművezető alkalmassági vizsgálat</li>
                                                            <li><strong>H-052:</strong> Hajózási engedélyek</li>
                                                            <li>...stb.</li>
                                                        </ul>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">2. lépés: Személyes adatok</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <p><strong>Mit kell megadnom?</strong></p>
                                                <ul>
                                                    <li><strong>Teljes név:</strong> Ahogy a személyi igazolványon szerepel</li>
                                                    <li><strong>Születési hely és dátum:</strong> Pontos adatok</li>
                                                    <li><strong>Anyja neve:</strong> Születéskori teljes név</li>
                                                    <li><strong>Lakcím:</strong> Bejelentett lakcím (irányítószám, település, utca, házszám)</li>
                                                    <li><strong>Levelezési cím:</strong> Ha eltér a lakcímtől (opcionális)</li>
                                                    <li><strong>Elérhetőségek:</strong> E-mail és telefonszám (kötelező!)</li>
                                                </ul>

                                                <div class="alert alert-warning mt-3">
                                                    <small>
                                                        <i class="bi bi-exclamation-triangle"></i>
                                                        <strong>Fontos:</strong> Az adatoknak meg kell egyezniük a hivatalos
                                                        okmányokon szereplő adatokkal!
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">3. lépés: Kérelem adatok kitöltése</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <p><strong>Vasúti járművezető vizsgálat (V-044) példa:</strong></p>
                                                <ul>
                                                    <li><strong>Kért végzettség:</strong> Vasúti járművezető / Tolatómozdonyvezető</li>
                                                    <li><strong>Képzés típusa:</strong> Alapképzés / Továbbképzés / Megújítás</li>
                                                    <li><strong>Orvosi alkalmasság:</strong> Van érvényes orvosi igazolás?</li>
                                                    <li><strong>Orvosi igazolás érvényessége:</strong> Dátum (pl. 2026-01-15)</li>
                                                    <li><strong>Korábbi vizsgálatok:</strong> Volt már korábban vizsgálata?</li>
                                                    <li><strong>Megjegyzés:</strong> További információk (opcionális)</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">4. lépés: Mellékletek feltöltése</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Milyen dokumentumokat kell feltöltenem?</h6>
                                                <ul>
                                                    <li><i class="bi bi-file-earmark-pdf text-danger"></i> <strong>Személyi igazolvány másolata</strong> (mindkét oldal)</li>
                                                    <li><i class="bi bi-file-earmark-pdf text-danger"></i> <strong>Orvosi igazolás</strong> (vasútegészségügyi vizsgálat eredménye)</li>
                                                    <li><i class="bi bi-file-earmark-pdf text-danger"></i> <strong>Végzettséget igazoló dokumentum</strong> (ha van)</li>
                                                    <li><i class="bi bi-file-earmark-pdf text-danger"></i> <strong>Korábbi vizsgálati eredmények</strong> (ha van)</li>
                                                </ul>

                                                <div class="alert alert-info mt-3">
                                                    <small>
                                                        <i class="bi bi-lightbulb"></i>
                                                        <strong>Tippek a feltöltéshez:</strong><br>
                                                        - Elfogadott formátumok: PDF, JPG, PNG<br>
                                                        - Maximum fájlméret: 10 MB / dokumentum<br>
                                                        - Jó minőségű, olvasható szkennelés szükséges<br>
                                                        - Mobiltelefonnal is fotózhat!
                                                    </small>
                                                </div>

                                                <h6 class="mt-3">Hogyan töltsek fel dokumentumot?</h6>
                                                <ol>
                                                    <li>Kattintson a "Fájl választása" gombra</li>
                                                    <li>Válassza ki a dokumentumot a számítógépéről</li>
                                                    <li>Vagy húzza rá a fájlt a feltöltési területre</li>
                                                    <li>Várja meg, amíg feltöltődik (zöld pipa jelenik meg)</li>
                                                    <li>Ismételje meg minden kötelező dokumentummal</li>
                                                </ol>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">5. lépés: Díjkalkuláció</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <p>A rendszer automatikusan kiszámolja a fizetendő díjat:</p>

                                                <div class="card bg-light mb-3">
                                                    <div class="card-body">
                                                        <h6>Példa díjkalkuláció (V-044):</h6>
                                                        <table class="table table-sm mb-0">
                                                            <tr>
                                                                <td>Előzetes alkalmassági vizsgálat alapdíja:</td>
                                                                <td class="text-end"><strong>12 000 Ft</strong></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Pótdíj (kiemelt ügyintézés):</td>
                                                                <td class="text-end">+ 3 000 Ft</td>
                                                            </tr>
                                                            <tr class="table-success">
                                                                <td>Kedvezmény (munkahelyi képzés keretében):</td>
                                                                <td class="text-end">- 4 500 Ft (30%)</td>
                                                            </tr>
                                                            <tr class="fw-bold border-top">
                                                                <td>Fizetendő összesen:</td>
                                                                <td class="text-end">10 500 Ft</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>

                                                <p class="mb-0">
                                                    <i class="bi bi-credit-card"></i>
                                                    A díjfizetésről részletes információk a "Díjfizetés" szekcióban!
                                                </p>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">6. lépés: Ellenőrzés és benyújtás</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ol>
                                                    <li><strong>Ellenőrizze az összes adatot!</strong>
                                                        <p class="small text-muted">Minden mezőt figyelmesen nézzen át</p>
                                                    </li>
                                                    <li><strong>Nyilatkozat elfogadása</strong>
                                                        <p class="small text-muted">
                                                            Kipipálás: "Kijelentem, hogy a megadott adatok a valóságnak megfelelnek"
                                                        </p>
                                                    </li>
                                                    <li><strong>Kattintson a "Kérelem benyújtása" gombra</strong>
                                                        <p class="small text-muted">Ez után a kérelem már nem módosítható!</p>
                                                    </li>
                                                    <li><strong>Kapni fog egy visszaigazolást</strong>
                                                        <p class="small text-muted">
                                                            Ügyazonosító: pl. VAHAP-V-2024-001234<br>
                                                            E-mailben is megkapja a visszaigazolást
                                                        </p>
                                                    </li>
                                                </ol>

                                                <div class="alert alert-success">
                                                    <i class="bi bi-check-circle"></i>
                                                    <strong>Gratulálunk!</strong> Sikeresen benyújtotta kérelmét!<br>
                                                    Most már csak várnia kell a hatóság döntésére.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 4. Ügyeim követése -->
                                    <div v-show="activeSzekció === 'ugyek-kovetese'">
                                        <h4><i class="bi bi-kanban text-primary"></i> Ügyeim követése</h4>
                                        <hr>

                                        <h5>Az "Ügyeim" oldal</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <p>A belépés után az "Ügyeim" oldalon látja az összes benyújtott kérelmét.</p>

                                                <h6 class="mt-3">Mit látok az oldalon?</h6>
                                                <ul>
                                                    <li><strong>Új kérelem gomb:</strong> Új kérelem indítása</li>
                                                    <li><strong>Intézkedés szükséges:</strong> Hány ügy vár az Ön reakciójára (pl. hiánypótlás)</li>
                                                    <li><strong>Lezárt ügyek:</strong> Hány ügy záródott le (archívum)</li>
                                                    <li><strong>Szűrők:</strong> Ügyek szűrése státusz szerint</li>
                                                    <li><strong>Keresés:</strong> Keresés ügyazonosító vagy név szerint</li>
                                                    <li><strong>Ügy lista:</strong> Összes ügy táblázatban</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Ügy státuszok magyarázata</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-warning h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-warning">Folyamatban</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> A hatóság vizsgálja a kérelmét.<br>
                                                            <strong>Mit tegyek?</strong> Várjon türelemmel, e-mailben értesítjük a változásról.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-danger h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-danger">Hiánypótlás</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> Hiányzik valami a kérelemből.<br>
                                                            <strong>Mit tegyek?</strong> Nézze meg a részleteket, pótoljon mindent a határidőig!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-info h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-info">Tényállás tisztázás</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> További vizsgálatok szükségesek (pl. helyszíni szemle).<br>
                                                            <strong>Mit tegyek?</strong> Várjon, a hatóság felveszi Önnel a kapcsolatot.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-primary h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-primary">Döntés előkészítése</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> Minden vizsgálat befejeződött, hamarosan dönt a hatóság.<br>
                                                            <strong>Mit tegyek?</strong> Várjon türelemmel.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-success h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-success">Engedélyezve</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> Kérelmét jóváhagyták!<br>
                                                            <strong>Mit tegyek?</strong> Töltse le a határozatot és az igazolást.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-secondary h-100">
                                                    <div class="card-body">
                                                        <h6>
                                                            <span class="badge bg-secondary">Elutasítva</span>
                                                        </h6>
                                                        <p class="small mb-0">
                                                            <strong>Mit jelent?</strong> Kérelmét elutasították.<br>
                                                            <strong>Mit tegyek?</strong> Olvassa el az indoklást, fellebbezhet 15 napon belül.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Értesítések</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6><i class="bi bi-bell"></i> Mikor kapok értesítést?</h6>
                                                <ul>
                                                    <li>✅ Kérelem sikeresen benyújtva</li>
                                                    <li>⚠️ Hiánypótlás szükséges</li>
                                                    <li>ℹ️ Tényállás tisztázás megkezdődött</li>
                                                    <li>📄 Döntés megszületett</li>
                                                    <li>💰 Díjfizetési felszólítás</li>
                                                    <li>📅 Határidő közeledik</li>
                                                </ul>

                                                <div class="alert alert-warning">
                                                    <small>
                                                        <i class="bi bi-exclamation-triangle"></i>
                                                        <strong>Fontos:</strong> Ellenőrizze rendszeresen az e-mailjeit (spam mappa is)!
                                                        Az értesítések a regisztrációkor megadott e-mail címre érkeznek.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 5. Hiánypótlás -->
                                    <div v-show="activeSzekció === 'hianypotlas'">
                                        <h4><i class="bi bi-exclamation-triangle text-warning"></i> Hiánypótlás</h4>
                                        <hr>

                                        <div class="alert alert-warning">
                                            <i class="bi bi-info-circle"></i>
                                            <strong>Mi az a hiánypótlás?</strong>
                                            <p class="mb-0 mt-2">
                                                Ha kérelmében hiányzik valami (pl. egy dokumentum vagy adat), a hatóság
                                                hiánypótlásra szólítja fel. A hiányokat a megadott határidőn belül pótolnia kell!
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Hogyan tudom, hogy hiánypótlásra szólítottak fel?</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ul>
                                                    <li>📧 <strong>E-mail értesítést kap</strong> - Néma meg a spam mappát is!</li>
                                                    <li>🔴 <strong>Az "Ügyeim" oldalon</strong> piros badge jelenik meg: <span class="badge bg-danger">Hiánypótlás</span></li>
                                                    <li>⚠️ <strong>"Intézkedés szükséges"</strong> számláló növekszik</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Hiánypótlás lépései</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ol>
                                                    <li class="mb-3">
                                                        <strong>Lépjen be a rendszerbe</strong>
                                                        <p class="small text-muted mb-0">Menjen az "Ügyeim" oldalra</p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Kattintson a hiánypótlásra váró ügyre</strong>
                                                        <p class="small text-muted mb-0">Piros badge jelzi</p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Olvassa el a hiánypótlási felszólítást</strong>
                                                        <p class="small text-muted mb-0">
                                                            Pontosan megmondja, mit kell pótolnia. Példa:<br>
                                                            <em>"Kérjük, töltse fel orvosi alkalmasságról szóló igazolását.
                                                            A korábban feltöltött dokumentum nem olvasható."</em>
                                                        </p>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Nézze meg a határidőt!</strong>
                                                        <div class="alert alert-danger mt-2 mb-0">
                                                            <small>
                                                                <i class="bi bi-calendar-x"></i>
                                                                <strong>Fontos:</strong> Ha nem pótol a határidőig,
                                                                kérelmét elutasíthatják!<br>
                                                                Tipikus határidő: 8-15 nap
                                                            </small>
                                                        </div>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Pótoljon mindent</strong>
                                                        <ul class="small mt-2">
                                                            <li>Hiányzó dokumentum: Töltse fel</li>
                                                            <li>Helytelen adat: Javítsa ki</li>
                                                            <li>Egyéb hiány: Kövesse az utasításokat</li>
                                                        </ul>
                                                    </li>
                                                    <li class="mb-3">
                                                        <strong>Kattintson a "Hiánypótlás benyújtása" gombra</strong>
                                                        <p class="small text-muted mb-0">Visszaigazolást kap e-mailben</p>
                                                    </li>
                                                    <li>
                                                        <strong>Várjon a hatóság válaszára</strong>
                                                        <p class="small text-muted mb-0">
                                                            A hatóság ellenőrzi, hogy megfelelően pótolt-e.
                                                            Ha igen, az ügy folytatódik. Ha nem, újabb hiánypótlást kérhetnek.
                                                        </p>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Gyakori hiánypótlási okok</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <ul>
                                                    <li>📄 <strong>Dokumentum hiányzik</strong> - Nem töltötte fel valamelyik kötelező mellékletet</li>
                                                    <li>🔍 <strong>Dokumentum nem olvasható</strong> - Rossz minőségű szkennelés</li>
                                                    <li>📅 <strong>Dokumentum lejárt</strong> - Pl. orvosi igazolás már nem érvényes</li>
                                                    <li>✍️ <strong>Aláírás hiányzik</strong> - Elfelejtette aláírni a nyilatkozatot</li>
                                                    <li>❌ <strong>Hiányos adatok</strong> - Nem töltött ki minden kötelező mezőt</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 6. Díjfizetés -->
                                    <div v-show="activeSzekció === 'dijfizetes'">
                                        <h4><i class="bi bi-credit-card text-primary"></i> Díjfizetés</h4>
                                        <hr>

                                        <h5>Mennyi a díj?</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <p>A díj függ a kérelem típusától. A rendszer automatikusan kiszámolja.</p>

                                                <h6 class="mt-3">Példa díjtételek:</h6>
                                                <table class="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Ügytípus</th>
                                                            <th class="text-end">Alapdíj</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>V-044 Vasúti járművezető vizsgálat</td>
                                                            <td class="text-end">12 000 Ft</td>
                                                        </tr>
                                                        <tr>
                                                            <td>H-052 Hajózási engedély</td>
                                                            <td class="text-end">25 000 Ft</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Pótdíj (kiemelt ügyintézés)</td>
                                                            <td class="text-end">+ 3 000 Ft</td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div class="alert alert-info">
                                                    <small>
                                                        <i class="bi bi-percent"></i>
                                                        <strong>Kedvezmények:</strong><br>
                                                        - Munkahelyi képzés keretében: 30%<br>
                                                        - Nyugdíjasoknak: 20%<br>
                                                        - Nagycsaládos igazolvánnyal: 15%
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Hogyan fizessek?</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>1. Online bankkártyás fizetés (ajánlott)</h6>
                                                <ul>
                                                    <li>✅ Gyors és biztonságos</li>
                                                    <li>✅ Azonnal feldolgozódik</li>
                                                    <li>✅ Visa, Mastercard elfogadva</li>
                                                    <li>✅ Visszaigazolást kap e-mailben</li>
                                                </ul>
                                                <p class="small text-muted">
                                                    <strong>Lépések:</strong> Kérelem kitöltése után → "Díj kifizetése" gomb →
                                                    Bankkártya adatok megadása → Fizetés jóváhagyása
                                                </p>

                                                <h6 class="mt-3">2. Banki átutalás</h6>
                                                <ul>
                                                    <li>⏱️ Lassabb (1-2 munkanap)</li>
                                                    <li>📋 Közleményben feltétlenül írja be az ügyazonosítót!</li>
                                                </ul>
                                                <div class="card bg-light mt-2">
                                                    <div class="card-body">
                                                        <small>
                                                            <strong>Bankszámlaszám:</strong> 10032000-01234567-12345678<br>
                                                            <strong>Kedvezményezett:</strong> Építési és Közlekedési Minisztérium<br>
                                                            <strong>Közlemény:</strong> VAHAP-V-2024-001234 (az Ön ügyazonosítója!)
                                                        </small>
                                                    </div>
                                                </div>

                                                <h6 class="mt-3">3. Postai csekk</h6>
                                                <ul>
                                                    <li>⏱️ Leglassabb (3-5 munkanap)</li>
                                                    <li>📬 Postán fizethető be</li>
                                                </ul>
                                                <p class="small text-muted">
                                                    Kérjen díjbekérőt a rendszerből, azt vigye el a postára.
                                                </p>
                                            </div>
                                        </div>

                                        <div class="alert alert-danger">
                                            <i class="bi bi-exclamation-octagon"></i>
                                            <strong>Fontos:</strong>
                                            <ul class="mb-0 mt-2">
                                                <li>A díjat benyújtáskor vagy a hatósági felszólítás szerint kell megfizetni</li>
                                                <li>Ha nem fizet időben, kérelmét elutasíthatják</li>
                                                <li>Díjbekérő letölthető a rendszerből (PDF)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- 7. Dokumentumok -->
                                    <div v-show="activeSzekció === 'dokumentumok'">
                                        <h4><i class="bi bi-file-earmark-arrow-down text-primary"></i> Dokumentumok</h4>
                                        <hr>

                                        <h5>Milyen dokumentumokat tölthetek le?</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-text text-primary"></i> Benyújtott kérelem</h6>
                                                        <p class="small mb-0">
                                                            A kérelem PDF változata, amelyet benyújtott. Saját nyilvántartáshoz.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-check text-success"></i> Határozat</h6>
                                                        <p class="small mb-0">
                                                            A hatóság döntése, ha engedélyezték vagy elutasították a kérelmét.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-medical text-info"></i> Igazolás</h6>
                                                        <p class="small mb-0">
                                                            Alkalmassági igazolás, ha engedélyezték. Ezt használhatja a munkahelyén.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-pdf text-danger"></i> Díjbekérő</h6>
                                                        <p class="small mb-0">
                                                            A fizetendő díjról szóló dokumentum, átutaláshoz vagy postai befizetéshez.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Hogyan töltsek le dokumentumot?</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ol>
                                                    <li>Lépjen be a rendszerbe</li>
                                                    <li>Menjen az "Ügyeim" oldalra</li>
                                                    <li>Kattintson a kívánt ügyre</li>
                                                    <li>Görgessen le a "Dokumentumok" részhez</li>
                                                    <li>Kattintson a <button class="btn btn-sm btn-outline-primary"><i class="bi bi-download"></i> Letöltés</button> gombra</li>
                                                    <li>A dokumentum letöltődik PDF formátumban</li>
                                                </ol>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Hogyan töltsek fel dokumentumot?</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <p><strong>Mikor kell feltölteni?</strong></p>
                                                <ul>
                                                    <li>Kérelem benyújtásakor (kötelező mellékletek)</li>
                                                    <li>Hiánypótlás esetén (pótlás mellékletek)</li>
                                                    <li>Tényállás tisztázás során (kért dokumentumok)</li>
                                                </ul>

                                                <p class="mt-3"><strong>Feltöltés lépései:</strong></p>
                                                <ol>
                                                    <li>Kattintson a "Fájl választása" vagy "Dokumentum feltöltése" gombra</li>
                                                    <li>Válassza ki a fájlt a számítógépéről/telefonjáról</li>
                                                    <li>Vagy húzza rá a fájlt a feltöltési területre (drag & drop)</li>
                                                    <li>Várja meg, amíg feltöltődik (progress bar)</li>
                                                    <li>Zöld pipa jelenik meg, ha sikeres</li>
                                                </ol>

                                                <div class="alert alert-info mt-3">
                                                    <small>
                                                        <i class="bi bi-info-circle"></i>
                                                        <strong>Technikai információk:</strong><br>
                                                        - Elfogadott formátumok: PDF, JPG, PNG<br>
                                                        - Maximum fájlméret: 10 MB<br>
                                                        - Jó minőségű, olvasható legyen!<br>
                                                        - Színes vagy fekete-fehér egyaránt jó
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 8. Gyakori kérdések -->
                                    <div v-show="activeSzekció === 'gyik'">
                                        <h4><i class="bi bi-question-circle text-primary"></i> Gyakori kérdések (GYIK)</h4>
                                        <hr>

                                        <div class="accordion" id="gyikAccordion">

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#gyik1">
                                                        <i class="bi bi-1-circle me-2"></i> Mennyibe kerül a kérelem benyújtása?
                                                    </button>
                                                </h2>
                                                <div id="gyik1" class="accordion-collapse collapse show" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        A díj függ a kérelem típusától. Pl. vasúti járművezető vizsgálat: 12 000 Ft.
                                                        Kedvezmények érhetők el (munkahelyi képzés, nyugdíjas, nagycsaládos).
                                                        A rendszer automatikusan kiszámolja az Ön esetében fizetendő díjat.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik2">
                                                        <i class="bi bi-2-circle me-2"></i> Mennyi ideig tart az ügyintézés?
                                                    </button>
                                                </h2>
                                                <div id="gyik2" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        Egyszerű ügyekben 8 munkanap (sommás eljárás), bonyolultabb esetekben
                                                        60 munkanap. A rendszer mutatja a várható ügyintézési időt.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik3">
                                                        <i class="bi bi-3-circle me-2"></i> Módosíthatom a kérelmet benyújtás után?
                                                    </button>
                                                </h2>
                                                <div id="gyik3" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        Sajnos nem. Benyújtás után a kérelem nem módosítható. Ezért fontos,
                                                        hogy benyújtás előtt alaposan ellenőrizze az összes adatot!
                                                        Csak hiánypótlás esetén van lehetőség pótlásra.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik4">
                                                        <i class="bi bi-4-circle me-2"></i> Mi van, ha elfelejtem a jelszavam?
                                                    </button>
                                                </h2>
                                                <div id="gyik4" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        A bejelentkezési oldalon kattintson a "Elfelejtett jelszó?" linkre.
                                                        Add meg az e-mail címét, és kap egy jelszó-visszaállítási linket.
                                                        Kattintson a linkre és állítson be új jelszót.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik5">
                                                        <i class="bi bi-5-circle me-2"></i> Nem jött meg az e-mail értesítés
                                                    </button>
                                                </h2>
                                                <div id="gyik5" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        <strong>1. lépés:</strong> Ellenőrizze a spam/levélszemét mappát!<br>
                                                        <strong>2. lépés:</strong> Adja hozzá a <code>vahap@ekm.gov.hu</code>
                                                        címet a megbízható feladókhoz.<br>
                                                        <strong>3. lépés:</strong> Várjon 10-15 percet, néha késik.<br>
                                                        <strong>4. lépés:</strong> Ha továbbra sem jön, lépjen be a rendszerbe
                                                        és nézze meg az "Ügyeim" oldalon.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik6">
                                                        <i class="bi bi-6-circle me-2"></i> Kérhetek sürgősségi eljárást?
                                                    </button>
                                                </h2>
                                                <div id="gyik6" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        Igen, kiemelt ügyintézést kérhet pótdíj ellenében (+ 3 000 Ft).
                                                        Ebben az esetben a hatóság előrébb sorolja az ügyét.
                                                        Kérelemkitöltéskor jelölheti be ezt az opciót.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik7">
                                                        <i class="bi bi-7-circle me-2"></i> Hogyan fellebbezhetek?
                                                    </button>
                                                </h2>
                                                <div id="gyik7" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        Ha elutasították kérelmét és nem ért egyet a döntéssel,
                                                        15 napon belül fellebbezhet. A határozatban megtalálja a
                                                        fellebbezés pontos módját és címét. A fellebbezést írásban
                                                        kell benyújtani (postai úton vagy személyesen).
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gyik8">
                                                        <i class="bi bi-8-circle me-2"></i> Telefonon is elérhető a support?
                                                    </button>
                                                </h2>
                                                <div id="gyik8" class="accordion-collapse collapse" data-bs-parent="#gyikAccordion">
                                                    <div class="accordion-body">
                                                        Igen! VAHAP Helpdesk:<br>
                                                        📞 <strong>+36 1 123 4567</strong> (munkanapokon 8-16 óráig)<br>
                                                        📧 <strong>vahap.support@ekm.gov.hu</strong><br>
                                                        Türelemmel válaszolunk minden kérdésére!
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <h5 class="mt-4">Hibaelhárítás</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>❌ Nem tölt be az oldal</h6>
                                                <ul class="small">
                                                    <li>Ellenőrizze az internetkapcsolatot</li>
                                                    <li>Frissítse az oldalt (F5 vagy Ctrl+R)</li>
                                                    <li>Próbálja meg másik böngészőben (Chrome, Firefox, Edge)</li>
                                                </ul>

                                                <h6 class="mt-3">❌ Nem tudok bejelentkezni</h6>
                                                <ul class="small">
                                                    <li>Ellenőrizze a felhasználónevet és jelszót (kis/nagybetű számít!)</li>
                                                    <li>Használja a "Jelszó visszaállítása" funkciót</li>
                                                    <li>Lehet, hogy még nem erősítette meg az e-mail címét</li>
                                                </ul>

                                                <h6 class="mt-3">❌ Nem sikerül feltölteni a dokumentumot</h6>
                                                <ul class="small mb-0">
                                                    <li>Fájlméret max 10 MB</li>
                                                    <li>Csak PDF, JPG, PNG formátum</li>
                                                    <li>Ellenőrizze az internetkapcsolat sebességét</li>
                                                    <li>Próbálja újra később</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Modal lábléc -->
                    <div class="modal-footer">
                        <div class="me-auto text-muted small">
                            <i class="bi bi-telephone"></i> Helpdesk: +36 1 123 4567 |
                            <i class="bi bi-envelope"></i> vahap.support@ekm.gov.hu
                        </div>
                        <button type="button" class="btn btn-secondary" @click="$emit('close')">
                            <i class="bi bi-x-circle"></i> Bezárás
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `
};
