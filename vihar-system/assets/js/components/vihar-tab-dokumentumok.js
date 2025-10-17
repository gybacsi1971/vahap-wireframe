/**
 * VAHAP - F-0091/92/93/94/95 Dokumentum tervezetek Tab
 * UCE-1809/1810/1811 - Végzés, Határozat, Igazolás, Tájékoztatás, Hirdetmény tervezetek
 * Használat: <vahap-tab-dokumentumok :active="activeTab === 'dokumentumok'" :ugy="ugy"></vahap-tab-dokumentumok>
 */

const VahapTabDokumentumok = {
    name: 'vahap-tab-dokumentumok',
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
            generating: false,
            generatedDoc: null,
            isEditing: false,
            editedContent: ''
        };
    },
    template: `
        <div v-show="active" class="tab-pane fade-in">
            <!-- Tab fejléc -->
            <div class="tab-header">
                <h5 class="mb-2">
                    <span class="badge badge-uce">UCE-1809/1810/1811</span>
                    Dokumentum tervezetek
                </h5>
                <p class="mb-0 small text-muted">
                    <span class="badge badge-function">F-0091</span>
                    <span class="badge badge-function">F-0092</span>
                    <span class="badge badge-function">F-0093</span>
                    <span class="badge badge-function">F-0094</span>
                    <span class="badge badge-function">F-0095</span>
                    Végzés, Határozat, Igazolás, Tájékoztatás, Hirdetmény
                </p>
            </div>

            <!-- Dokumentum típusok -->
            <div class="row">

                <!-- F-0091 - Végzés tervezet -->
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-text text-primary" style="font-size: 3rem;"></i>
                            <h6 class="mt-3">Végzés tervezet</h6>
                            <p class="small text-muted">
                                <span class="badge badge-uce">UCE-1809</span>
                                <span class="badge badge-function">F-0091</span>
                            </p>
                            <button class="btn btn-sm btn-outline-primary"
                                    @click="generateDoc('vegzes')"
                                    :disabled="generating">
                                <i class="bi bi-file-earmark-plus"></i> Generálás
                            </button>
                        </div>
                    </div>
                </div>

                <!-- F-0092 - Határozat tervezet -->
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-check text-success" style="font-size: 3rem;"></i>
                            <h6 class="mt-3">Határozat tervezet</h6>
                            <p class="small text-muted">
                                <span class="badge badge-uce">UCE-1810</span>
                                <span class="badge badge-function">F-0092</span>
                            </p>
                            <button class="btn btn-sm btn-outline-success"
                                    @click="generateDoc('hatarozat')"
                                    :disabled="generating">
                                <i class="bi bi-file-earmark-plus"></i> Generálás
                            </button>
                        </div>
                    </div>
                </div>

                <!-- F-0093 - Igazolás tervezet -->
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-medical text-info" style="font-size: 3rem;"></i>
                            <h6 class="mt-3">Igazolás tervezet</h6>
                            <p class="small text-muted">
                                <span class="badge badge-uce">UCE-1811</span>
                                <span class="badge badge-function">F-0093</span>
                            </p>
                            <button class="btn btn-sm btn-outline-info"
                                    @click="generateDoc('igazolas')"
                                    :disabled="generating">
                                <i class="bi bi-file-earmark-plus"></i> Generálás
                            </button>
                        </div>
                    </div>
                </div>

                <!-- F-0094 - Tájékoztatás tervezet -->
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-richtext text-warning" style="font-size: 3rem;"></i>
                            <h6 class="mt-3">Tájékoztatás tervezet</h6>
                            <p class="small text-muted">
                                <span class="badge badge-function">F-0094</span>
                            </p>
                            <button class="btn btn-sm btn-outline-warning"
                                    @click="generateDoc('tajekoztatas')"
                                    :disabled="generating">
                                <i class="bi bi-file-earmark-plus"></i> Generálás
                            </button>
                        </div>
                    </div>
                </div>

                <!-- F-0095 - Hirdetmény tervezet -->
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-megaphone text-danger" style="font-size: 3rem;"></i>
                            <h6 class="mt-3">Hirdetmény tervezet</h6>
                            <p class="small text-muted">
                                <span class="badge badge-function">F-0095</span>
                            </p>
                            <button class="btn btn-sm btn-outline-danger"
                                    @click="generateDoc('hirdetmeny')"
                                    :disabled="generating">
                                <i class="bi bi-file-earmark-plus"></i> Generálás
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Generálás folyamatban -->
            <div v-if="generating" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Generálás...</span>
                </div>
                <div class="mt-3">
                    <small class="text-muted">Dokumentum tervezet generálása...</small>
                </div>
            </div>

            <!-- Generált dokumentum előnézet/szerkesztés -->
            <div v-if="generatedDoc" class="mt-4">
                <div class="card">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                        <strong>
                            <i class="bi bi-file-earmark-text"></i>
                            {{ generatedDoc.tipus }}
                            <span v-if="isEditing" class="badge bg-warning ms-2">
                                <i class="bi bi-pencil"></i> Szerkesztés alatt
                            </span>
                            <span v-else class="badge bg-secondary ms-2">
                                <i class="bi bi-eye"></i> Előnézet
                            </span>
                        </strong>
                        <div>
                            <!-- Szerkesztés módban -->
                            <template v-if="isEditing">
                                <button class="btn btn-sm btn-success me-2" @click="saveEdit">
                                    <i class="bi bi-check-circle"></i> Változtatások mentése
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit">
                                    <i class="bi bi-x-circle"></i> Mégsem
                                </button>
                            </template>
                            <!-- Előnézet módban -->
                            <template v-else>
                                <button class="btn btn-sm btn-warning me-2" @click="startEdit">
                                    <i class="bi bi-pencil"></i> Szerkesztés
                                </button>
                                <button class="btn btn-sm btn-primary me-2" @click="finalizeDoc">
                                    <i class="bi bi-check-circle-fill"></i> Véglegesítés
                                </button>
                                <button class="btn btn-sm btn-outline-primary me-2" @click="downloadDoc">
                                    <i class="bi bi-download"></i> Letöltés
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" @click="closeDoc">
                                    <i class="bi bi-x"></i> Bezár
                                </button>
                            </template>
                        </div>
                    </div>
                    <div class="card-body" style="max-height: 600px; overflow-y: auto;">
                        <!-- Információs panel -->
                        <div v-if="!isEditing" class="alert alert-info mb-3">
                            <i class="bi bi-info-circle"></i>
                            <strong>Generált dokumentum tervezet</strong>
                            <p class="mb-0 mt-1 small">
                                A dokumentum automatikusan generálódott a kérelem adatai alapján.
                                Ha módosításra van szükség, kattintson a
                                <span class="badge bg-warning text-dark">
                                    <i class="bi bi-pencil"></i> Szerkesztés
                                </span>
                                gombra. A véglegesítés előtt még szabadon szerkeszthető a tartalom.
                            </p>
                        </div>

                        <!-- Szerkesztés módban: textarea -->
                        <textarea
                            v-if="isEditing"
                            v-model="editedContent"
                            class="form-control"
                            rows="25"
                            style="font-family: 'Courier New', monospace; font-size: 0.875rem; white-space: pre-wrap;">
                        </textarea>

                        <!-- Előnézet módban: formázott szöveg -->
                        <pre v-else style="white-space: pre-wrap; font-size: 0.875rem; font-family: 'Courier New', monospace;">{{ generatedDoc.tartalom }}</pre>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="row">
                            <div class="col-md-6">
                                <small class="text-muted">
                                    <i class="bi bi-calendar"></i>
                                    Generálva: {{ generatedDoc.datum }}
                                </small>
                            </div>
                            <div class="col-md-6 text-end">
                                <small class="text-muted">
                                    <i class="bi bi-file-text"></i>
                                    Funkció: {{ generatedDoc.funkcio }}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    `,
    methods: {
        generateDoc(tipus) {
            // F-0091/92/93/94/95 - Dokumentum generálás
            this.generating = true;

            setTimeout(() => {
                const tipusMap = {
                    'vegzes': 'Végzés tervezet',
                    'hatarozat': 'Határozat tervezet',
                    'igazolas': 'Igazolás tervezet',
                    'tajekoztatas': 'Tájékoztatás tervezet',
                    'hirdetmeny': 'Hirdetmény tervezet'
                };

                const funkcioMap = {
                    'vegzes': 'F-0091',
                    'hatarozat': 'F-0092',
                    'igazolas': 'F-0093',
                    'tajekoztatas': 'F-0094',
                    'hirdetmeny': 'F-0095'
                };

                this.generatedDoc = {
                    tipus: tipusMap[tipus],
                    tartalom: this.createMockDocument(tipus),
                    datum: new Date().toISOString().split('T')[0],
                    funkcio: funkcioMap[tipus],
                    tipusKod: tipus
                };

                this.isEditing = false;
                this.generating = false;
                console.log(`${funkcioMap[tipus]} - ${tipusMap[tipus]} generálva`);
            }, 1500);
        },
        startEdit() {
            // Szerkesztés mód aktiválása
            this.isEditing = true;
            this.editedContent = this.generatedDoc.tartalom;
            console.log('[Dokumentum] Szerkesztés mód aktiválva');
        },
        saveEdit() {
            // Változtatások mentése
            this.generatedDoc.tartalom = this.editedContent;
            this.isEditing = false;
            console.log('[Dokumentum] Változtatások elmentve');
            alert('✓ Dokumentum módosítások sikeresen mentve!\n\nA frissített tartalom most már a dokumentum előnézetben látható.');
        },
        cancelEdit() {
            // Szerkesztés megszakítása
            this.isEditing = false;
            this.editedContent = '';
            console.log('[Dokumentum] Szerkesztés megszakítva');
        },
        finalizeDoc() {
            // Dokumentum véglegesítése
            if (confirm(`Biztosan véglegesíti ezt a dokumentumot?\n\n${this.generatedDoc.tipus}\n\nA véglegesítés után a dokumentum már nem szerkeszthető.`)) {
                console.log('[Dokumentum] Véglegesítve:', this.generatedDoc.tipus);
                alert(`✓ ${this.generatedDoc.tipus} véglegesítve!\n\nA dokumentum hozzáadva az ügy dokumentumaihoz.`);
                this.$emit('document-finalized', this.generatedDoc);
                this.closeDoc();
            }
        },
        downloadDoc() {
            // Mock letöltés
            console.log('[Dokumentum] Letöltés:', this.generatedDoc.tipus);
            alert(`${this.generatedDoc.tipus} letöltése megkezdődött...`);
            this.$emit('document-downloaded', this.generatedDoc);
        },
        closeDoc() {
            // Dokumentum bezárása
            this.generatedDoc = null;
            this.isEditing = false;
            this.editedContent = '';
        },
        createMockDocument(tipus) {
            const tipusCimMap = {
                'vegzes': 'VÉGZÉS',
                'hatarozat': 'HATÁROZAT',
                'igazolas': 'IGAZOLÁS',
                'tajekoztatas': 'TÁJÉKOZTATÁS',
                'hirdetmeny': 'HIRDETMÉNY'
            };

            const header = `
ÉPÍTÉSI ÉS KÖZLEKEDÉSI MINISZTÉRIUM
Vasúti Hatósági Főosztály

Ügyiratszám: ${this.ugy.ugyazonosito || 'VAHAP-V-2024-001234'}
Ügyintéző: Dr. Szabó Péter

${tipusCimMap[tipus]}
`;

            // Igazolás egyedi tartalom
            if (tipus === 'igazolas') {
                return header + `
Ügyfél: ${this.ugy.ugyfel?.nev || 'Kovács János'}
Születési dátum: ${this.ugy.ugyfel?.szuletesi_datum || '1985-03-15'}
Lakcím: ${this.ugy.ugyfel?.lakcim || '1011 Budapest, Fő utca 1.'}

IGAZOLÁS

Igazolom, hogy a fent nevezett személy vasúti járművezető alkalmassági vizsgálaton
megfelelt, a vasúti járművezetésre alkalmas.

Az alkalmasság érvényessége: 2024.10.20 - 2026.10.20

Kelt: Budapest, ${new Date().toLocaleDateString('hu-HU')}

                                    ________________________________
                                    Dr. Szabó Péter
                                    vezető ügyintéző
`;
            }

            // Tájékoztatás egyedi tartalom (F-0094)
            if (tipus === 'tajekoztatas') {
                return header + `
Címzett: ${this.ugy.ugyfel?.nev || 'Kovács János'}
Tárgy: Vasúti járművezető alkalmassági vizsgálat - Tájékoztatás

Tisztelt ${this.ugy.ugyfel?.nev || 'Kovács János'}!

Tájékoztatjuk, hogy a ${this.ugy.ugyazonosito || 'VAHAP-V-2024-001234'} számú
ügyében az eljárás jelenlegi állásáról az alábbi információkat közöljük:

1. Az eljárás folyamatban van
2. A formai és tartalmi vizsgálatok befejezésre kerültek
3. A döntéshozatal szakaszában vagyunk
4. Várható ügyintézési idő: 2-3 hét

Az eljárás eredményéről külön értesítést fog kapni.

Amennyiben kérdése merül fel, kérjük, az alábbi elérhetőségeken keressen minket:
- E-mail: ugyintezes@vahap.gov.hu
- Telefon: +36 1 123 4567

Budapest, ${new Date().toLocaleDateString('hu-HU')}

                                    ________________________________
                                    Dr. Szabó Péter
                                    vezető ügyintéző
`;
            }

            // Hirdetmény egyedi tartalom (F-0095)
            if (tipus === 'hirdetmeny') {
                return header + `

HIRDETMÉNY

Ügyiratszám: ${this.ugy.ugyazonosito || 'VAHAP-V-2024-001234'}

Az Építési és Közlekedési Minisztérium Vasúti Hatósági Főosztálya
közzéteszi az alábbi hirdetményt:

Kihirdetjük, hogy ${this.ugy.ugyfel?.nev || 'Kovács János'} részére
vasúti járművezető alkalmassági vizsgálat tárgyában eljárás indult.

Az eljárással kapcsolatban észrevételt, kifogást a hirdetmény
közzétételétől számított 15 napon belül lehet tenni az alábbi címen:

Építési és Közlekedési Minisztérium
Vasúti Hatósági Főosztály
1077 Budapest, Wesselényi utca 20-22.

A hirdetmény hatálybalépésének időpontja: ${new Date().toLocaleDateString('hu-HU')}

Budapest, ${new Date().toLocaleDateString('hu-HU')}

                                    ________________________________
                                    Dr. Szabó Péter
                                    vezető ügyintéző
`;
            }

            // Végzés és Határozat közös tartalom (F-0091, F-0092)
            return header + `
Ügyfél: ${this.ugy.ugyfel?.nev || 'Kovács János'}
Tárgy: Vasúti járművezető előzetes alkalmassági vizsgálat

Az Építési és Közlekedési Minisztérium a 2005. évi CLXXXIII. törvény
a vasúti közlekedésről alapján az alábbi ${tipus === 'vegzes' ? 'végzést' : 'határozatot'} hozta:

I. ${tipus === 'vegzes' ? 'VÉGZÉS' : 'HATÁROZAT'}

A kérelmező vasúti járművezető alkalmassági vizsgálata ${tipus === 'hatarozat' ? 'ENGEDÉLYEZVE' : 'FOLYTATÓDIK'}.

II. INDOKOLÁS

A kérelmező által benyújtott kérelem minden formai és tartalmi követelménynek
megfelel. A vizsgálatok eredménye alapján a kérelmező alkalmas a vasúti
járművezetésre.

A hatósági vizsgálatok során megállapítást nyert, hogy:
- A kérelmező rendelkezik a szükséges orvosi alkalmasságról szóló igazolással
- A vasútegészségügyi nyilvántartás szerint nincs kizáró körülmény
- A szakmai előképzettség megfelelő
- A törvényi feltételek teljesülnek

III. JOGSZABÁLYI HIVATKOZÁS

- 2005. évi CLXXXIII. törvény a vasúti közlekedésről
- 123/2005. (VII. 12.) Korm. rendelet a vasúti járművek üzemben tartásáról

IV. JOGORVOSLAT

Jelen ${tipus === 'vegzes' ? 'végzés' : 'határozat'} ellen a kézhezvételtől számított 15 napon belül
fellebbezéssel lehet élni az Építési és Közlekedési Minisztériumhoz címezve,
de ezen hatóságnál terjeszthető elő.

Kelt: Budapest, ${new Date().toLocaleDateString('hu-HU')}

                                    ________________________________
                                    Dr. Szabó Péter
                                    vezető ügyintéző
`;
        }
    }
};
