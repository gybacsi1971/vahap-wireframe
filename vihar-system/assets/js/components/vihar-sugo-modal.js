/**
 * VAHAP - Ügyintézői Felület Súgó Modal
 * Részletes használati útmutató lépésről lépésre
 * Használat: <vahap-sugo-modal :show="showSugo" @close="showSugo = false"></vahap-sugo-modal>
 */

const VahapSugoModal = {
    name: 'vahap-sugo-modal',
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
                    alcim: 'Az ügyintézői felület áttekintése'
                },
                {
                    id: 'felepites',
                    ikon: 'bi-layout-three-columns',
                    cim: 'Felület felépítése',
                    alcim: 'A három oszlopos munkatér használata'
                },
                {
                    id: 'workflow',
                    ikon: 'bi-diagram-3',
                    cim: 'Workflow lépések',
                    alcim: 'Az ügyintézés folyamata lépésről lépésre'
                },
                {
                    id: 'ellenorzesek',
                    ikon: 'bi-list-check',
                    cim: 'Ellenőrzések',
                    alcim: 'Hatáskör, formai és tartalmi vizsgálatok'
                },
                {
                    id: 'donteshozatal',
                    ikon: 'bi-check-circle',
                    cim: 'Döntéshozatal',
                    alcim: 'Sommás eljárás és döntési javaslat'
                },
                {
                    id: 'dokumentumok',
                    ikon: 'bi-file-earmark-text',
                    cim: 'Dokumentumok',
                    alcim: 'Végzés, határozat, igazolás generálása'
                },
                {
                    id: 'specialis',
                    ikon: 'bi-tools',
                    cim: 'Speciális funkciók',
                    alcim: 'Hiánypótlás, tényállás tisztázás'
                },
                {
                    id: 'tippek',
                    ikon: 'bi-lightbulb',
                    cim: 'Hasznos tippek',
                    alcim: 'Gyorsbillentyűk és trükkök'
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
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-question-circle"></i>
                            VAHAP Ügyintézői Felület - Használati Útmutató
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
                                        <h4><i class="bi bi-info-circle text-primary"></i> Bevezetés</h4>
                                        <hr>

                                        <div class="alert alert-info">
                                            <i class="bi bi-lightbulb"></i>
                                            <strong>Mi ez a rendszer?</strong>
                                            <p class="mb-0 mt-2">
                                                A VAHAP (Vasúti és Hajózási Integrált Hatósági Rendszer) egy elektronikus
                                                ügyintézési platform, amely a vasúti és hajózási hatósági eljárások teljes
                                                életciklusát támogatja.
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Mire használjuk?</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-text text-primary"></i> Kérelmek kezelése</h6>
                                                        <p class="small mb-0">
                                                            Ügyfelek által benyújtott kérelmek átvétele, vizsgálata,
                                                            és elbírálása elektronikus formában.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-clipboard-check text-success"></i> Ellenőrzések</h6>
                                                        <p class="small mb-0">
                                                            Hatáskör, formai és tartalmi megfelelőség vizsgálata
                                                            paraméterezett ellenőrzési listák segítségével.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-pdf text-danger"></i> Dokumentum generálás</h6>
                                                        <p class="small mb-0">
                                                            Hatósági végzések, határozatok és igazolások automatikus
                                                            előállítása sablon alapján.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-clock-history text-info"></i> Nyomon követés</h6>
                                                        <p class="small mb-0">
                                                            Határidők figyelése, workflow követés, eljárási előzmények
                                                            teljes láthatósága.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Példa ügytípusok</h5>
                                        <ul>
                                            <li><strong>V-044:</strong> Vasúti járművezető előzetes alkalmassági vizsgálat</li>
                                            <li><strong>H-052:</strong> Országos közforgalmú kikötő létesítése</li>
                                        </ul>
                                    </div>

                                    <!-- 2. Felület felépítése -->
                                    <div v-show="activeSzekció === 'felepites'">
                                        <h4><i class="bi bi-layout-three-columns text-primary"></i> Felület felépítése</h4>
                                        <hr>

                                        <div class="alert alert-success">
                                            <i class="bi bi-info-circle"></i>
                                            <strong>Három oszlopos munkatér</strong>
                                            <p class="mb-0 mt-2">
                                                Az ügyintézői felület három fő részre tagolódik: bal oldali workflow navigáció,
                                                középső munkaterület és jobb oldali döntési panelek.
                                            </p>
                                        </div>

                                        <h5 class="mt-4">1. Bal oldali oszlop - Workflow navigáció</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6><i class="bi bi-list-ul"></i> Funkciók:</h6>
                                                <ul>
                                                    <li><strong>Workflow lépések listája</strong> - Az ügyintézés menete sorrendben</li>
                                                    <li><strong>Státusz jelek</strong> - Zöld pipa (✓) = befejezett, Narancs = folyamatban</li>
                                                    <li><strong>Funkció és UCE kódok</strong> - Minden lépésnél látható a kapcsolódó F-xxxx és UCE-xxxx kód</li>
                                                    <li><strong>Kollapsz gomb</strong> - Balra nyíl (<) ikon az oszlop bezárásához</li>
                                                </ul>
                                                <div class="alert alert-warning mt-2">
                                                    <small>
                                                        <i class="bi bi-lightbulb"></i>
                                                        <strong>Tipp:</strong> Kis képernyőn zárd be a bal oszlopot a több hely érdekében!
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">2. Középső oszlop - Munkaterület</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6><i class="bi bi-window"></i> Funkciók:</h6>
                                                <ul>
                                                    <li><strong>Ügyfejléc</strong> - Ügyazonosító, ügyfél neve, határidő, eljárás típusa</li>
                                                    <li><strong>Tab tartalom</strong> - Az aktív workflow lépés űrlapja, ellenőrzési listája</li>
                                                    <li><strong>Mentés gombok</strong> - Minden tab alján megtalálod a mentés/tovább gombokat</li>
                                                    <li><strong>Független scrollozás</strong> - A munkaterület külön görgetető</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">3. Jobb oldali oszlop - Döntési és info panelek</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6><i class="bi bi-layout-sidebar-reverse"></i> Panelek:</h6>
                                                <ol>
                                                    <li><strong>Döntési pontok</strong> - Gyors műveletek az aktuális lépéshez (sommás, hiánypótlás)</li>
                                                    <li><strong>Eljárás előzmények</strong> - Időrendi lista az eddigi eseményekről</li>
                                                    <li><strong>Kapcsolódó dokumentumok</strong> - Feltöltött és generált dokumentumok listája</li>
                                                    <li><strong>Ügyfél információk</strong> - Ügyfél adatok és statisztika</li>
                                                </ol>
                                                <div class="alert alert-info mt-2">
                                                    <small>
                                                        <i class="bi bi-lightbulb"></i>
                                                        <strong>Fontos:</strong> A döntési panel kontextus-érzékeny, mindig az aktuális
                                                        workflow lépéshez kapcsolódó műveleteket kínálja!
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Kollapsz funkció használata</h5>
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <p><strong>1. lépés:</strong> Kattints a bal vagy jobb oldali nyílra (< vagy >)</p>
                                                <p><strong>2. lépés:</strong> Az oszlop bezáródik, csak ikonok maradnak</p>
                                                <p><strong>3. lépés:</strong> A középső munkaterület automatikusan kiszélesedik</p>
                                                <p class="mb-0"><strong>4. lépés:</strong> Újra kattints a nyílra (> vagy <) a visszaállításhoz</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 3. Workflow lépések -->
                                    <div v-show="activeSzekció === 'workflow'">
                                        <h4><i class="bi bi-diagram-3 text-primary"></i> Workflow lépések</h4>
                                        <hr>

                                        <div class="alert alert-primary">
                                            <i class="bi bi-info-circle"></i>
                                            <strong>Sorrendiség és előfeltételek</strong>
                                            <p class="mb-0 mt-2">
                                                A workflow lépések szigorú sorrendben követik egymást. Egyes lépések csak akkor
                                                érhetők el, ha az előző lépések sikeresen befejezésre kerültek.
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Teljes workflow folyamat</h5>

                                        <div class="timeline">
                                            <div class="card mb-3 border-primary">
                                                <div class="card-header bg-primary text-white">
                                                    <strong>1. Kérelem megtekintése</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0107</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Az ügyfél által benyújtott kérelem teljes adatlapját tekinted meg.</p>
                                                    <p><strong>Példa:</strong> Látod az ügyfél személyes adatait, a kért végzettséget, mellékleteket.</p>
                                                    <p class="mb-0"><strong>Művelet:</strong> Nincs teendő, csak áttekintés.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-success">
                                                <div class="card-header bg-success text-white">
                                                    <strong>2. Hatáskör vizsgálat</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0064</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1793</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Ellenőrzöd, hogy a hatóságod jogosult-e elbírálni ezt a kérelmet.</p>
                                                    <p><strong>Példa:</strong> Vasúti járművezető vizsgálat → Igen, a Vasúti Hatósági Főosztály hatásköre.</p>
                                                    <p><strong>Művelet:</strong> Pipáld ki a kritériumokat, válassz döntést (Hatáskör van / nincs), mentsd.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-warning">
                                                <div class="card-header bg-warning">
                                                    <strong>3. Formai ellenőrzés</strong>
                                                    <span class="badge bg-dark ms-2">F-0065</span>
                                                    <span class="badge bg-dark ms-2">UCE-1799</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Ellenőrzöd, hogy az űrlap helyesen ki van-e töltve.</p>
                                                    <p><strong>Példa:</strong> Minden kötelező mező ki van töltve? Aláírás megvan? Mellékletek csatolva?</p>
                                                    <p><strong>Művelet:</strong> Pipáld ki az ellenőrzési pontokat, döntsd el: Megfelel / Nem felel meg / Hiánypótlás szükséges.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-info">
                                                <div class="card-header bg-info text-white">
                                                    <strong>4. Tartalmi ellenőrzés</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0066</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1794</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Tartalmilag vizsgálod a kérelmet és a mellékleteket.</p>
                                                    <p><strong>Példa:</strong> Orvosi igazolás érvényes? Képesítés megfelel a kértnek?</p>
                                                    <p><strong>Művelet:</strong> Vizsgáld a tartalmat, pipáld ki az ellenőrzési pontokat, dönts.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-secondary">
                                                <div class="card-header bg-secondary text-white">
                                                    <strong>5. VNY024 Nyilvántartás</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0090</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Vasútegészségügyi nyilvántartásban lekérdezed az ügyfelet.</p>
                                                    <p><strong>Példa:</strong> Van-e korábbi alkalmatlansági vizsgálat? Van kizáró körülmény?</p>
                                                    <p><strong>Művelet:</strong> Keresés az ügyfél adataival, eredmény rögzítése.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-primary">
                                                <div class="card-header bg-primary text-white">
                                                    <strong>6. Sommás eljárás döntés</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0088</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1800</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Eldöntöd, hogy az ügy 8 vagy 60 munkanapon belül elbírálható-e.</p>
                                                    <p><strong>Példa:</strong> Minden rendben van, nincs bonyolítás → Sommás (8 munkanap).</p>
                                                    <p><strong>Művelet:</strong> Válassz eljárástípust, add meg az indoklást, mentsd. A rendszer kalkulálja a határidőt.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-success">
                                                <div class="card-header bg-success text-white">
                                                    <strong>7. Döntési javaslat</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0074</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1826</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Részletes javaslatot készítesz a döntésre.</p>
                                                    <p><strong>Példa:</strong> "Javaslom engedélyezni a kérelmezőt, mert minden feltétel teljesül."</p>
                                                    <p><strong>Művelet:</strong> Döntéstípus, részletes indoklás (min. 100 karakter), jogszabályi hivatkozások, dokumentum sablon kiválasztása.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-warning">
                                                <div class="card-header bg-warning">
                                                    <strong>8. Véleményezés</strong>
                                                    <span class="badge bg-dark ms-2">F-0096</span>
                                                    <span class="badge bg-dark ms-2">UCE-1824</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> A döntési javaslatot kollegákkal / szakértőkkel véleményeztetni.</p>
                                                    <p><strong>Példa:</strong> Osztályvezető véleménye: "Egyetértek a javaslattal."</p>
                                                    <p><strong>Művelet:</strong> Véleményező hozzáadása, vélemény rögzítése (egyetért / nem ért egyet), lezárás.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-danger">
                                                <div class="card-header bg-danger text-white">
                                                    <strong>9. Vezetői döntés</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0099</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1828</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Az osztályvezető jóváhagyja vagy elutasítja a javaslatot.</p>
                                                    <p><strong>Példa:</strong> Vezetői döntés: "Jóváhagyom".</p>
                                                    <p><strong>Művelet:</strong> Döntéstípus (Jóváhagyás / Elutasítás / Módosítással jóváhagyás), indoklás, mentés.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-info">
                                                <div class="card-header bg-info text-white">
                                                    <strong>10. Dokumentumok generálása</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0091-095</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Hatósági dokumentumokat készítesz (végzés, határozat, igazolás).</p>
                                                    <p><strong>Példa:</strong> Határozat generálása → Szerkesztés (ha kell) → Véglegesítés.</p>
                                                    <p><strong>Művelet:</strong> Típus választása, generálás, előnézet, szerkesztés (opcionális), véglegesítés.</p>
                                                </div>
                                            </div>

                                            <div class="card mb-3 border-dark">
                                                <div class="card-header bg-dark text-white">
                                                    <strong>11. Lezárás</strong>
                                                    <span class="badge bg-light text-dark ms-2">F-0097</span>
                                                    <span class="badge bg-light text-dark ms-2">UCE-1828</span>
                                                </div>
                                                <div class="card-body">
                                                    <p><strong>Mit csinálsz itt?</strong> Az ügyet lezárod, nyilvántartásokat frissíted.</p>
                                                    <p><strong>Példa:</strong> Ügy lezárva, átfutási idő: 11 munkanap.</p>
                                                    <p><strong>Művelet:</strong> Lezárási feladatok checklist kitöltése, összegző megjegyzés, lezárás.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 4. Ellenőrzések -->
                                    <div v-show="activeSzekció === 'ellenorzesek'">
                                        <h4><i class="bi bi-list-check text-primary"></i> Ellenőrzések</h4>
                                        <hr>

                                        <h5>Hatáskör vizsgálat (F-0064)</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Lépések:</h6>
                                                <ol>
                                                    <li>Olvasd el a kérelmet a "Kérelem" tab-on</li>
                                                    <li>Navigálj a "Hatáskör vizsgálat" tab-ra</li>
                                                    <li>Pipáld ki az ellenőrzési kritériumokat:
                                                        <ul>
                                                            <li>✓ Hatáskör biztosított</li>
                                                            <li>✓ Illetékesség rendben</li>
                                                            <li>✓ Kérelmező jogosult benyújtani</li>
                                                        </ul>
                                                    </li>
                                                    <li>Válassz döntést: <span class="badge bg-success">Hatáskör van</span> vagy <span class="badge bg-danger">Hatáskör nincs</span></li>
                                                    <li>Adj meg megjegyzést (opcionális)</li>
                                                    <li>Kattints a <button class="btn btn-sm btn-success">Mentés és tovább</button> gombra</li>
                                                </ol>

                                                <div class="alert alert-success mt-3">
                                                    <strong><i class="bi bi-check-circle"></i> Példa - Hatáskör VAN:</strong>
                                                    <p class="mb-0 mt-2">
                                                        "V-044 vasúti járművezető vizsgálat → A Vasúti Hatósági Főosztály hatásköre,
                                                        Budapest területén illetékes. Kérelmező magánszemély, jogosult benyújtani."
                                                    </p>
                                                </div>

                                                <div class="alert alert-danger">
                                                    <strong><i class="bi bi-x-circle"></i> Példa - Hatáskör NINCS:</strong>
                                                    <p class="mb-0 mt-2">
                                                        "A kérelem hajózási engedélyre vonatkozik, de a Vasúti Főosztályhoz nyújtották be.
                                                        Áttétel szükséges a Hajózási Főosztályhoz."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Formai ellenőrzés (F-0065)</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Mit ellenőrzünk?</h6>
                                                <ul>
                                                    <li>Minden kötelező mező kitöltve?</li>
                                                    <li>Aláírás megtörtént?</li>
                                                    <li>Mellékletek csatolva?</li>
                                                    <li>Díj befizetve?</li>
                                                    <li>Formanyomtatvány helyes?</li>
                                                </ul>

                                                <h6 class="mt-3">Lehetséges döntések:</h6>
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="card border-success">
                                                            <div class="card-body text-center">
                                                                <i class="bi bi-check-circle text-success" style="font-size: 2rem;"></i>
                                                                <h6 class="mt-2">Megfelel</h6>
                                                                <p class="small mb-0">Minden rendben</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="card border-warning">
                                                            <div class="card-body text-center">
                                                                <i class="bi bi-exclamation-triangle text-warning" style="font-size: 2rem;"></i>
                                                                <h6 class="mt-2">Hiánypótlás</h6>
                                                                <p class="small mb-0">Pótolható hiány</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="card border-danger">
                                                            <div class="card-body text-center">
                                                                <i class="bi bi-x-circle text-danger" style="font-size: 2rem;"></i>
                                                                <h6 class="mt-2">Nem megfelelő</h6>
                                                                <p class="small mb-0">Súlyos hiba</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Tartalmi ellenőrzés (F-0066)</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Mit ellenőrzünk?</h6>
                                                <ul>
                                                    <li>Orvosi igazolás érvényes?</li>
                                                    <li>Képzettség megfelel?</li>
                                                    <li>Korábbi vizsgálatok eredménye?</li>
                                                    <li>Kizáró körülmény van?</li>
                                                    <li>Mellékletek tartalma hiteles?</li>
                                                </ul>

                                                <div class="alert alert-info">
                                                    <strong><i class="bi bi-lightbulb"></i> Tipp:</strong>
                                                    <p class="mb-0 mt-2">
                                                        A tartalmi ellenőrzésnél már szakmai tudásra van szükség! Ellenőrizd a VNY024
                                                        nyilvántartásban is az ügyfelet a döntés előtt.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 5. Döntéshozatal -->
                                    <div v-show="activeSzekció === 'donteshozatal'">
                                        <h4><i class="bi bi-check-circle text-primary"></i> Döntéshozatal</h4>
                                        <hr>

                                        <h5>Sommás eljárás döntés (F-0088)</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Mi az a sommás eljárás?</h6>
                                                <p>
                                                    Egyszerű ügyekben az eljárás 8 munkanapon belül lezárható (sommás),
                                                    bonyolultabb esetekben 60 munkanap áll rendelkezésre (általános).
                                                </p>

                                                <h6 class="mt-3">Mikor választunk sommás eljárást?</h6>
                                                <ul>
                                                    <li>✓ Minden ellenőrzés megfelelt</li>
                                                    <li>✓ Nincs bonyolító körülmény</li>
                                                    <li>✓ Nincs szükség szakértői véleményre</li>
                                                    <li>✓ Nincs szükség helyszíni szemlére</li>
                                                </ul>

                                                <h6 class="mt-3">Lépések:</h6>
                                                <ol>
                                                    <li>Navigálj a "Sommás eljárás" tab-ra</li>
                                                    <li>Ellenőrizd az előfeltételeket (automatikus)</li>
                                                    <li>Válassz eljárástípust:
                                                        <ul>
                                                            <li><span class="badge bg-success">Sommás (8 munkanap)</span></li>
                                                            <li><span class="badge bg-warning">Általános (60 munkanap)</span></li>
                                                        </ul>
                                                    </li>
                                                    <li>A rendszer automatikusan kiszámolja a határidőt (csak munkanapok!)</li>
                                                    <li>Adj meg indoklást</li>
                                                    <li>Mentsd el</li>
                                                </ol>

                                                <div class="alert alert-success">
                                                    <strong><i class="bi bi-calendar-check"></i> Példa:</strong>
                                                    <p class="mb-0 mt-2">
                                                        Ma: 2024. október 7. (hétfő)<br>
                                                        Sommás (8 munkanap) határidő: 2024. október 17. (csütörtök)<br>
                                                        <small class="text-muted">A hétvégék nem számítanak!</small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Döntési javaslat készítése (F-0074)</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Mit tartalmaz egy döntési javaslat?</h6>
                                                <ol>
                                                    <li><strong>Korábbi vizsgálatok összefoglalása</strong> - Automatikusan megjelenik</li>
                                                    <li><strong>Javasolt döntéstípus</strong> - Engedélyezés / Elutasítás / Felfüggesztés</li>
                                                    <li><strong>Részletes indoklás</strong> - Min. 100 karakter, miért ez a javaslat?</li>
                                                    <li><strong>Jogszabályi hivatkozások</strong> - Mely törvények, rendeletek alapján?</li>
                                                    <li><strong>Feltételek</strong> (opcionális) - Pl. "Érvényes 2 évig"</li>
                                                    <li><strong>Értesítendő felek</strong> - Ki kapjon értesítést?</li>
                                                    <li><strong>Dokumentum sablon</strong> - Milyen típusú dokumentumot készítünk?</li>
                                                </ol>

                                                <div class="alert alert-warning mt-3">
                                                    <strong><i class="bi bi-exclamation-triangle"></i> Figyelem:</strong>
                                                    <p class="mb-0 mt-2">
                                                        A döntési javaslat még NEM végleges döntés! Ez csak javaslat, amit a vezetőnek
                                                        kell jóváhagynia a "Vezetői döntés" lépésben.
                                                    </p>
                                                </div>

                                                <h6 class="mt-3">Példa indoklás:</h6>
                                                <div class="card bg-light">
                                                    <div class="card-body">
                                                        <p class="mb-0">
                                                            "A kérelmező vasúti járművezető előzetes alkalmassági vizsgálata minden
                                                            tekintetben megfelelt. A hatáskör biztosított, a formai és tartalmi
                                                            követelmények teljesültek. Az orvosi alkalmassági igazolás érvényes
                                                            2026-01-15-ig. A VNY024 nyilvántartásban nincs kizáró körülmény.
                                                            Javaslom a kérelem engedélyezését 2 éves érvényességgel."
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 6. Dokumentumok -->
                                    <div v-show="activeSzekció === 'dokumentumok'">
                                        <h4><i class="bi bi-file-earmark-text text-primary"></i> Dokumentumok</h4>
                                        <hr>

                                        <div class="alert alert-success">
                                            <i class="bi bi-info-circle"></i>
                                            <strong>Automatikus generálás sablonból</strong>
                                            <p class="mb-0 mt-2">
                                                A rendszer automatikusan generálja a hatósági dokumentumokat az ügy adatai alapján.
                                                Generálás után még szerkesztheted a tartalmat, mielőtt véglegesíted.
                                            </p>
                                        </div>

                                        <h5 class="mt-4">Dokumentum típusok</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-text text-primary"></i> Végzés (F-0091)</h6>
                                                        <p class="small">
                                                            <strong>Mikor használjuk?</strong> Eljárási döntéseknél (pl. hiánypótlás).
                                                        </p>
                                                        <p class="small mb-0">
                                                            <strong>Példa:</strong> "Hiánypótlásra felszólító végzés"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-check text-success"></i> Határozat (F-0092)</h6>
                                                        <p class="small">
                                                            <strong>Mikor használjuk?</strong> Érdemi döntéseknél (engedélyezés/elutasítás).
                                                        </p>
                                                        <p class="small mb-0">
                                                            <strong>Példa:</strong> "Engedélyező határozat"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-medical text-info"></i> Igazolás (F-0093)</h6>
                                                        <p class="small">
                                                            <strong>Mikor használjuk?</strong> Tényeket igazolunk (pl. alkalmassági igazolás).
                                                        </p>
                                                        <p class="small mb-0">
                                                            <strong>Példa:</strong> "Alkalmassági igazolás"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-file-earmark-richtext text-warning"></i> Tájékoztatás (F-0094)</h6>
                                                        <p class="small">
                                                            <strong>Mikor használjuk?</strong> Ügyfél tájékoztatása az eljárás állásáról.
                                                        </p>
                                                        <p class="small mb-0">
                                                            <strong>Példa:</strong> "Az ügy folyamatban van"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="card h-100">
                                                    <div class="card-body">
                                                        <h6><i class="bi bi-megaphone text-danger"></i> Hirdetmény (F-0095)</h6>
                                                        <p class="small">
                                                            <strong>Mikor használjuk?</strong> Nyilvános közzétételnél.
                                                        </p>
                                                        <p class="small mb-0">
                                                            <strong>Példa:</strong> "Eljárás megindításának hirdetménye"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Dokumentum generálás és szerkesztés lépései</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <ol class="mb-0">
                                                    <li>
                                                        <strong>Navigálj a "Dokumentumok" tab-ra</strong>
                                                        <p class="small text-muted">Látod az 5 dokumentumtípust kártyákban</p>
                                                    </li>
                                                    <li>
                                                        <strong>Válassz típust és kattints "Generálás" gombra</strong>
                                                        <p class="small text-muted">Pl. "Határozat tervezet" generálása</p>
                                                    </li>
                                                    <li>
                                                        <strong>Várd meg a generálást (1-2 mp)</strong>
                                                        <p class="small text-muted">Loading spinner jelenik meg</p>
                                                    </li>
                                                    <li>
                                                        <strong>Előnézet megjelenik</strong>
                                                        <p class="small text-muted">
                                                            Látod a generált dokumentum teljes tartalmát. Információs panel jelzi,
                                                            hogy még szerkeszthető.
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <strong>OPCIONÁLIS: Kattints "Szerkesztés" gombra</strong>
                                                        <p class="small text-muted">Ha módosítani szeretnéd a tartalmat</p>
                                                    </li>
                                                    <li>
                                                        <strong>OPCIONÁLIS: Szerkeszd a szöveget a textarea-ban</strong>
                                                        <p class="small text-muted">Például az indoklást pontosíthatod</p>
                                                    </li>
                                                    <li>
                                                        <strong>OPCIONÁLIS: Kattints "Változtatások mentése" gombra</strong>
                                                        <p class="small text-muted">Módosítások visszakerülnek az előnézetbe</p>
                                                    </li>
                                                    <li>
                                                        <strong>Kattints "Véglegesítés" gombra</strong>
                                                        <p class="small text-muted">
                                                            Megerősítő dialógus jelenik meg. A dokumentum lezáródik és hozzáadódik
                                                            az ügy dokumentumaihoz.
                                                        </p>
                                                    </li>
                                                </ol>

                                                <div class="alert alert-warning mt-3">
                                                    <strong><i class="bi bi-exclamation-triangle"></i> Fontos:</strong>
                                                    <p class="mb-0 mt-2">
                                                        Véglegesítés után a dokumentum már NEM szerkeszthető! Ellenőrizd alaposan
                                                        a tartalmat véglegesítés előtt.
                                                    </p>
                                                </div>

                                                <div class="alert alert-info mt-2">
                                                    <strong><i class="bi bi-lightbulb"></i> Tipp:</strong>
                                                    <p class="mb-0 mt-2">
                                                        Ha mégsem tetszik a generált tartalom, kattints "Bezár" gombra és generálj
                                                        újat. A korábbi verzió elveszik.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 7. Speciális funkciók -->
                                    <div v-show="activeSzekció === 'specialis'">
                                        <h4><i class="bi bi-tools text-primary"></i> Speciális funkciók</h4>
                                        <hr>

                                        <h5>Hiánypótlás (F-0100, UCE-2000)</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Mikor van rá szükség?</h6>
                                                <p>
                                                    Ha az ügyfél kérelme nem teljes (pl. hiányzik egy melléklet), de pótolható,
                                                    hiánypótlási felszólítást küldünk neki.
                                                </p>

                                                <h6 class="mt-3">Lépések:</h6>
                                                <ol>
                                                    <li>A formai vagy tartalmi ellenőrzésnél válaszd: "Hiánypótlás szükséges"</li>
                                                    <li>A jobb oldali Döntési panelen kattints <span class="badge bg-warning">Hiánypótlás</span> gombra</li>
                                                    <li>Vagy navigálj a "Hiánypótlás" tab-ra közvetlenül</li>
                                                    <li>Add meg a hiányzó elemeket (checkboxokkal):
                                                        <ul>
                                                            <li>☐ Orvosi igazolás</li>
                                                            <li>☐ Aláírás</li>
                                                            <li>☐ Díjbefizetés igazolása</li>
                                                            <li>☐ Egyéb: [szabad szöveges mező]</li>
                                                        </ul>
                                                    </li>
                                                    <li>Add meg a határidőt (napok száma, pl. 15 nap)</li>
                                                    <li>Adj meg indoklást</li>
                                                    <li>Kattints "Hiánypótlás elküldése"</li>
                                                </ol>

                                                <div class="alert alert-info">
                                                    <strong><i class="bi bi-info-circle"></i> Többkörös hiánypótlás:</strong>
                                                    <p class="mb-0 mt-2">
                                                        Ha az ügyfél pótolt, de még mindig hiányzik valami, újabb hiánypótlást küldhetsz.
                                                        A rendszer nyilvántartja a körök számát.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Tényállás tisztázás (F-0102, UCE-1803)</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Mi az a tényállás tisztázás?</h6>
                                                <p>
                                                    Ha az ügy bonyolult és további vizsgálatok szükségesek (pl. helyszíni szemle,
                                                    szakértői vélemény), tényállás tisztázási eljárást indítunk.
                                                </p>

                                                <h6 class="mt-3">Lehetséges cselekmények:</h6>
                                                <div class="row">
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Helyszíni szemle</span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Szakértői vélemény</span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Tanúmeghallgatás</span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Iratbekérés</span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Tárgyalás</span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="badge bg-primary">Egyéb vizsgálat</span>
                                                    </div>
                                                </div>

                                                <h6 class="mt-3">Lépések:</h6>
                                                <ol>
                                                    <li>Navigálj a "Tényállás tisztázás" tab-ra</li>
                                                    <li>Válassz cselekmény típust</li>
                                                    <li>Add meg a részleteket (ki, mit, mikor, hol?)</li>
                                                    <li>Mentsd el</li>
                                                    <li>A cselekmény bekerül az előzményekbe</li>
                                                    <li>Ha szükséges, adj hozzá újabb cselekményt</li>
                                                    <li>Ha minden tisztázva, kattints "Tényállás tisztázás lezárása"</li>
                                                </ol>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Értesítés (F-0089)</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Ügyfél értesítése</h6>
                                                <p>
                                                    Fontos eseményekről (döntés, hiánypótlás, stb.) az ügyfelet értesíteni kell.
                                                </p>

                                                <h6 class="mt-3">Értesítési módok:</h6>
                                                <ul>
                                                    <li><i class="bi bi-envelope"></i> E-mail</li>
                                                    <li><i class="bi bi-mailbox"></i> Postai levél</li>
                                                    <li><i class="bi bi-globe"></i> VAHAP rendszeren keresztül</li>
                                                </ul>

                                                <div class="alert alert-success">
                                                    <strong><i class="bi bi-check-circle"></i> Automatikus értesítések:</strong>
                                                    <p class="mb-0 mt-2">
                                                        A rendszer bizonyos esetekben automatikusan küld értesítést (pl. hiánypótlás elküldésekor).
                                                        Manuálisan is küldhetsz értesítést az "Értesítés" tab-on.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 8. Hasznos tippek -->
                                    <div v-show="activeSzekció === 'tippek'">
                                        <h4><i class="bi bi-lightbulb text-primary"></i> Hasznos tippek</h4>
                                        <hr>

                                        <h5>Gyors navigáció</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ul>
                                                    <li><strong>Bal oldali workflow menü:</strong> Bármikor kattints egy lépésre a gyors ugráshoz</li>
                                                    <li><strong>Következő lépés badge:</strong> A jobb oldali Döntési panelen látod a javasolt következő lépést</li>
                                                    <li><strong>Döntési gombok:</strong> A Döntési panel gombjai automatikusan átnavigálnak a következő lépéshez</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Státuszok és badge-ek</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h6>Workflow státuszok:</h6>
                                                <div class="mb-2">
                                                    <span class="badge bg-success me-2"><i class="bi bi-check"></i> Befejezve</span>
                                                    Zöld pipa = a lépés sikeresen befejezve
                                                </div>
                                                <div class="mb-2">
                                                    <span class="badge bg-warning me-2"><i class="bi bi-clock"></i> Folyamatban</span>
                                                    Narancs óra = jelenleg ezen dolgozol
                                                </div>
                                                <div class="mb-2">
                                                    <span class="badge bg-secondary me-2"><i class="bi bi-circle"></i> Függőben</span>
                                                    Szürke = még nem kezdődött el
                                                </div>

                                                <h6 class="mt-3">Funkciókódok:</h6>
                                                <div class="mb-2">
                                                    <span class="badge badge-function me-2">F-0064</span>
                                                    Funkciókód = a lépéshez kapcsolódó funkció azonosítója
                                                </div>
                                                <div class="mb-2">
                                                    <span class="badge badge-uce me-2">UCE-1793</span>
                                                    UCE kód = használati eset azonosítója
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Gyakori hibák elkerülése</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <div class="alert alert-danger mb-2">
                                                    <strong><i class="bi bi-x-circle"></i> HIBÁS:</strong> Workflow lépések átugrása
                                                    <p class="mb-0 mt-2 small">
                                                        <strong>Helyes:</strong> Kövesd a workflow lépéseket sorban! Az előfeltétel ellenőrzés
                                                        megakadályozza az átugrást.
                                                    </p>
                                                </div>
                                                <div class="alert alert-danger mb-2">
                                                    <strong><i class="bi bi-x-circle"></i> HIBÁS:</strong> Dokumentum véglegesítése ellenőrzés nélkül
                                                    <p class="mb-0 mt-2 small">
                                                        <strong>Helyes:</strong> Mindig olvasd át a generált dokumentumot véglegesítés előtt!
                                                    </p>
                                                </div>
                                                <div class="alert alert-danger mb-2">
                                                    <strong><i class="bi bi-x-circle"></i> HIBÁS:</strong> Hiányos indoklás
                                                    <p class="mb-0 mt-2 small">
                                                        <strong>Helyes:</strong> Adj részletes indoklást (min. 100 karakter) minden döntésnél!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Teljesítmény optimalizálás</h5>
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <ul>
                                                    <li><strong>Kis képernyő:</strong> Zárd be a bal és jobb oszlopot a kollapsz gombokkal</li>
                                                    <li><strong>Sok dokumentum:</strong> A Dokumentumok panel alján görgethetsz</li>
                                                    <li><strong>Lassú betöltés:</strong> Ellenőrizd az internetkapcsolatot, frissítsd az oldalt (F5)</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 class="mt-4">Támogatás és segítség</h5>
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Hol kaphatsz segítséget?</h6>
                                                <ul class="mb-0">
                                                    <li><i class="bi bi-question-circle text-primary"></i> Ezt a súgót bármikor megnyithatod a fejlécben</li>
                                                    <li><i class="bi bi-telephone text-success"></i> Helpdesk: +36 1 123 4567</li>
                                                    <li><i class="bi bi-envelope text-info"></i> E-mail: vahap.support@ekm.gov.hu</li>
                                                    <li><i class="bi bi-book text-warning"></i> Teljes dokumentáció: <code>TESZTELES_UTMUTATO.md</code></li>
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
                        <button type="button" class="btn btn-secondary" @click="$emit('close')">
                            <i class="bi bi-x-circle"></i> Bezárás
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `
};
