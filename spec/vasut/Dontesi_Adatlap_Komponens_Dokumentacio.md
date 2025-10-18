# Döntési Adatlap Komponens - Dokumentáció

## Áttekintés

A **Döntési Adatlap** (`wf-dontesi-adatlap`) egy komplex Vue.js workflow komponens, amely a VAHAP rendszer döntéshozatali szakaszát támogatja.

**Fájl helye:** `/vihar-system/assets/js/components/workflow/wf-dontesi-adatlap.js`

## Eljárási szakasz

**Döntéshozatal**

### Feladatok:
- Tervezet elkészítés
- Tervezet véleményeztetés
- Vezetői döntés
- Követő feladatok
- Nyilvántartás

### Funkciók:
- Döntési adatlap
- Rugalmas WF (F-0102)
- Nyilvántartás
- Expediálás

## Funkcióleírás

A komponens a Word táblázatban meghatározott 8 lépéses wizard folyamatot valósítja meg:

### 1. Döntési javaslat elkészítése

**Mezők:**
- Javaslat tárgya (kötelező)
- Indokolás (kötelező)
- További feladatok (opcionális)

**Validáció:**
- Mindkét kötelező mező kitöltése szükséges a továbbhaladáshoz

### 2. Jogi forma kiválasztása

**Opciók:**
- **Végzés** (F-0091)
  - Eljárási kérdéseket eldöntő hatósági aktus
- **Határozat** (F-0092)
  - Érdemi döntést tartalmazó hatósági aktus

**Logika:**
- A kiválasztott jogi forma automatikusan előre kiválasztja a megfelelő dokumentumot a 3. lépésben

### 3. Dokumentumok előállítása

**Elérhető dokumentumok:**

| Dokumentum | Funkciókód | Leírás | Auto-select |
|------------|------------|--------|-------------|
| Végzés tervezet | F-0091 | Eljárási kérdést eldöntő hatósági aktus | Ha jogi forma = Végzés |
| Határozat tervezet | F-0092 | Érdemi döntést tartalmazó hatósági aktus | Ha jogi forma = Határozat |
| Igazolás tervezet | F-0093 | Igazolás kiállítása | - |
| Tájékoztatás tervezet | F-0094 | Tájékoztató dokumentum | - |
| Okmány adatok | - | Okmány előállításának előkészítése | - |
| Hirdetmény tervezet | F-0095 | Hirdetmény dokumentum | - |

**Funkciók:**
- Checkbox kiválasztás
- Dokumentum generálás gomb (mock PDF generálás)
- Generált dokumentumok jelzése (zöld pipával)

**Output:**
- Dokumentum export lista
- Output: okmány gyártó interfész (Okmány adatok esetén)

### 4. Követő eljárási feladatok (Rugalmas WF - F-0102)

**Funkció:** Követő eljárás feladatok összeállítása

**Példa feladatok:**
- Okmány készítés
- Jóváhagyás
- Postázás
- Átvétel

**Feladat mezők:**
- Megnevezés (kötelező)
- Felelős személy
- Határidő (dátum)

**CRUD műveletek:**
- Feladat hozzáadása
- Feladat törlése
- Feladatok listázása

### 5. Nyilvántartás frissítése

**Ügyintézői döntés:** Nyilvántartás frissítése szükséges: igen / nem

**Logika:**
- Ha IGEN, akkor:
  - Nyilvántartás kiválasztása dropdown-ból
  - Nyilvántartás hozzáadása gomb
  - Kiválasztott nyilvántartások listája

**Elérhető nyilvántartások:**
- **VNY024** - Vasútegészségügyi Nyilvántartás (Vasút modul)
- **HNY501** - Hajózási Létesítmények Nyilvántartása (Hajózás modul)

**Output:**
- Vezetői döntést követően a nyilvántartások aktualizálása megtörténik

### 6. Eljárási díjfizetés ellenőrzése

**Ellenőrzött adatok:**
- Eljárási díj megfizetése megtörtént: igen / nem
- Megfizetés dátuma (ha igen)
- Megfizetett összeg (Ft)

**Funkciókód:** Nincs direkt F-kód, része a döntési adatlapnak

### 7. Döntési javaslat véleményeztetése (Rugalmas WF - F-0102)

**Ügyintézői döntés:** Véleményeztetés szükséges: igen / nem

**Ha IGEN:**

**Véleményező mezők:**
- Név (kötelező)
- Email cím (kötelező)
- Szervezet

**CRUD műveletek:**
- Véleményező hozzáadása
- Véleményező törlése
- Véleményezők listázása

**Funkció:**
- "Véleményeztetés elküldése" gomb
- Mock: Rugalmas workflow indítása (F-0102)

**Logika:**
- Ezzel indul a véleményeztetési folyamat
- A véleményezők javaslata alapján ügyintéző eldönti:
  - **Elfogad** → PDF továbbítása Vezetői döntésre + EKEIDR iktatószám
  - **Elutasít** → Tervezet módosítása szükséges

### 8. Összegzés

**Megjelenített adatok:**
- 1. Döntési javaslat összefoglalója
- 2. Kiválasztott jogi forma
- 3. Kiválasztott dokumentumok (F-kódokkal)
- 4. Követő feladatok száma
- 5. Nyilvántartások száma
- 6. Díjfizetés státusza
- 7. Véleményezők száma

**Akciók:**
- "Döntési adatlap benyújtása" gomb
- A benyújtás után továbbküldés következő lépésre

## Események (Events)

### `@complete`

Akkor kerül kibocsátásra, amikor a felhasználó befejezi a döntési adatlap kitöltését.

**Payload:**
```javascript
{
  type: 'dontesi_adatlap',
  adatlap: {
    ugyazonosito: 'VAHAP-V-2024-001234',
    ugyszam: '2025/ÜGY/0142',
    dontesiJavaslat: { targy, indokolas, tovabbi_feladatok },
    jogiForma: 'vegzes' | 'hatrozat',
    dokumentumok: [ { tipus, funkciokod, generalt, fajlnev } ],
    kovetoFeladatok: [ { megnevezes, felelos, hatarido, statusz } ],
    nyilvantartasFreissitese: true/false,
    nyilvantartasok: [ { kod, nev, modul } ],
    dijFizetve: true/false,
    dijMegfizetesDatum: 'YYYY-MM-DD',
    dijOsszeg: 12000,
    velemenyeztetes: {
      szukseges: true/false,
      velemenyezok: [ { nev, email, szervezet, statusz } ]
    },
    ekeidrIktatoszam: '',
    rogzitoDatum: 'ISO timestamp',
    rogzitoUgyintezo: 'Dr. Szabó Péter'
  }
}
```

### `@action`

Egyéb akciók jelzésére (pl. mégse gomb).

**Payload:**
```javascript
{
  type: 'cancel'
}
```

## Használat

### 1. Import és regisztráció

**HTML:**
```html
<script src="assets/js/components/workflow/wf-dontesi-adatlap.js"></script>
```

**Vue App:**
```javascript
components: {
  'wf-dontesi-adatlap': WfDontesiAdatlap
}
```

### 2. Komponens használata

```html
<wf-dontesi-adatlap
  :ugy="ugy"
  :step-data="{}"
  @complete="handleComplete"
  @action="handleAction">
</wf-dontesi-adatlap>
```

### 3. Event handlerek

```javascript
methods: {
  handleComplete(result) {
    console.log('Döntési adatlap befejezve:', result);
    // Továbbküldés következő workflow lépésre
  },
  handleAction(action) {
    if (action.type === 'cancel') {
      // Visszalépés előző lépésre
    }
  }
}
```

## Wizard navigáció

### Progress bar
- 8 lépés vizualizációja
- Aktuális lépés jelölése (kék)
- Befejezett lépések jelölése (zöld pipa)

### Navigációs gombok
- **Előző** gomb: Visszalépés az előző lépésre (1. lépésnél letiltva)
- **Következő** gomb: Ugrás a következő lépésre (validáció után)
- **Mégse** gomb: Kilépés a folyamatból (megerősítő ablak)
- **Döntési adatlap benyújtása** gomb: Véglegesítés (csak 8. lépésnél)

### Lépésre kattintás
- Csak befejezett lépésekre lehet visszakattintani
- Aktuális és korábbi lépések elérhetőek

## Validáció

### 1. lépés validáció
- Döntési javaslat tárgya: nem lehet üres
- Indokolás: nem lehet üres

### 2. lépés validáció
- Jogi forma kiválasztása kötelező

### 3. lépés validáció
- Legalább egy dokumentum kiválasztása szükséges

### Véglegesítési validáció
- Döntési javaslat és indokolás kötelező
- Jogi forma kötelező

## Mock működés

### Dokumentum generálás
```javascript
generaljDokumentum(dokumentumKey) {
  const fajlnev = `${dokumentumKey}_${this.ugy.ugyszam}_${Date.now()}.pdf`;
  doc.generalt = true;
  doc.fajlnev = fajlnev;
  console.log(`[${doc.funkciokod}] Dokumentum generálva: ${fajlnev}`);
  alert(`Dokumentum generálva: ${fajlnev}\n\nFunkció: ${doc.funkciokod}`);
}
```

### Véleményeztetés indítása
```javascript
kuldVelemenyeztetesre() {
  console.log('[F-0102] Véleményeztetés indítása:', this.velemenyeztetes.velemenyezok);
  alert(`Véleményeztetés elküldve ${this.velemenyeztetes.velemenyezok.length} véleményezőnek.\n\nRugalmas workflow funkció: F-0102`);
}
```

## Integrációs pontok

### EKEIDR interfész
- **Input:** EKEIDR alszámos iktatószám
- A véleményezők javaslata elfogadása után a PDF továbbítása EKEIDR-be történik

### Nyilvántartások
- **F-0090** - VNY024 Vasútegészségügyi Nyilvántartás
- **F-0106** - HNY501 Hajózási Létesítmények Nyilvántartása
- Output: Vezetői döntést követően nyilvántartások frissítése

### Rugalmas Workflow
- **F-0102** - Tényállás tisztázása: Rugalmas workflow
- Követő feladatok összeállítása
- Véleményeztetési workflow indítása

### Okmány gyártó interfész
- Output: Okmány adatok előkészítése
- Az okmány gyártó interfész számára adatok export

## Tesztelés

### Debug mód
Megnyitható a következő debug fájl:
```
/vihar-system/debug-dontesi-adatlap.html
```

**Funkciók:**
- Izolált tesztkörnyezet
- Event logging
- Console debug információk

### Browser megnyitás
1. Navigálj a projekt gyökérkönyvtárába
2. Nyisd meg a `debug-dontesi-adatlap.html` fájlt böngészőben
3. Töltsd ki a wizard lépéseket
4. Figyeld a console logokat és event listát

## Továbbfejlesztési lehetőségek

### Backend integráció
- Dokumentum generálás backend API-val
- Véleményeztetési workflow indítása valós email küldéssel
- Nyilvántartások valós frissítése
- EKEIDR interfész valós kommunikáció

### Validáció finomítása
- Email cím formátum ellenőrzés
- Határidő jövőbeli dátum validációja
- Díjösszeg minimum érték

### UI fejlesztések
- Tooltip-ek a funkciókódokhoz
- Inline help szövegek
- Dokumentum preview funkció
- Véleményező státusz színkódolása

### Workflow integrációk
- Valós EKEIDR iktatószám lekérése
- Nyilvántartási interfészek valós API hívások
- Okmány gyártó interfész valós adatküldés

## Kapcsolódó fájlok

- **Komponens:** `/vihar-system/assets/js/components/workflow/wf-dontesi-adatlap.js`
- **Workflow app:** `/vihar-system/assets/js/apps/vihar-munkalap-v3-app.js`
- **Munkalap HTML:** `/vihar-system/vasut/belso/ugy-munkalap-v3.html`
- **Debug HTML:** `/vihar-system/debug-dontesi-adatlap.html`
- **Dokumentáció:** `/spec/vasut/Dontesi_Adatlap_Komponens_Dokumentacio.md`

## Verzióinformáció

- **Létrehozva:** 2025-10-17
- **Vue verzió:** Vue 3 (Composition API-val is kompatibilis)
- **Bootstrap:** Bootstrap 5
- **Funkciókódok:** F-0088, F-0091, F-0092, F-0093, F-0094, F-0095, F-0102

## Szerző megjegyzések

Ez a komponens teljes mértékben a Word táblázatban specifikált követelményeket valósítja meg. A wizard alapú felület átlátható és könnyen használható, minden lépés logikailag elkülönül, de az adatok végig megőrződnek. A komponens teljes mértékben mock-alapú működésű, így a backend implementáció nélkül is használható és tesztelhető.

---

**Készült:** 2025-10-17
**Projekt:** VAHAP - Vasúti és Hajózási Integrált Hatósági Rendszer
**Modul:** Vasúti Modul (V-044)
