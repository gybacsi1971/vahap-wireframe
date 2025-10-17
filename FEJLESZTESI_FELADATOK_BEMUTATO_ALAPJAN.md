# VAHAP Fejlesztési Feladatok - Bemutatási Visszajelzések Alapján

## 📋 Általános Követelmények

### Arculati elemek

- **Logózás**: Magyar kormányzati arculat szerint ÉKM logók beillesztése minden dokumentumba és felületre
- **PDF generálás**: Hivatalos arculati elemekkel (logo, fejléc, lábléc) ellátott dokumentumok legyenek generálhatók
- **Aláírás**: Dokumentumok aláírási funkcionalitása

### UX/UI fejlesztések

- **Lista ÉS csempe nézet az EXT oldalon**: Ügylista megjelenítés támogassa mindkét nézetet
- **Véleményezés funkció**(lásd később részletesen): Véleményezési folyamatoknál megjegyzés hozzáadási lehetőség
- **Képernyőkép dokumentáció**: Arculati jegyzőkönyv elfogadási kritérium dokumentum készítése képernyőképekkel

## 🎭 Szerepkör Specifikus Fejlesztések

A DEMO-hoz legyen lehetőség az egyes szerepkörök szerinti választásra és minden szerepkörben a neki kijogosított funkciók legyenek elérhetők.

### 1. ÜGYFÉL SZEREPKÖR

#### 1.1 Kérelem Benyújtás

Fájl: `/vasut/kulso/index.html`, `/hajozas/kulso/index.html`

**Fejlesztendő funkciók:**

- **PDF generálás**: Kérelem véglegesítése után arculati elemekkel

#### 1.2 Hiánypótlás Benyújtás

Fájl: `/vasut/kulso/hianypotlas.html`, `/hajozas/kulso/hianypotlas.html` (új)

**Fejlesztendő funkciók:**

- Hiánypótlási kérések fogadása és benyújtása

#### 1.3 Feladatok Áttekintése

Fájl: `/vasut/kulso/ugyek.html`, `/hajozas/kulso/ugyek.html` (új)

**Fejlesztendő funkciók:**

- **Lista nézet**: Táblázatos megjelenítés
- **Csempe nézet**: Kártyás megjelenítés
- **Nézet váltó**: Toggle gomb a két nézet között

### 2. VEZETŐ SZEREPKÖR

#### 2.1 Ügyek Szűrése

Fájl: `/vasut/belso/vezeto-dashboard.html`, `/hajozas/belso/vezeto-dashboard.html` (új)

**Fejlesztendő funkciók:**

- **Lista ÉS csempe nézet**: Mindkét megjelenítési mód támogatása
- **"Új" ügyek szűrése**: Speciális szűrő csak új ügyekre

#### 2.2 Ügyek Szignálása Ügyintézőre

**Fejlesztendő funkciók:**

- **Ügyintéző kiválasztás**: Dropdown vagy modal ablakos kiválasztás
- **Feladatkiosztás**: Ügyintézőkre történő ügy hozzárendelés

#### 2.3 Döntéshozatal - Dokumentum Elfogadás/Elutasítás

**Fejlesztendő funkciók:**

- **Hiánypótlás dokumentum jóváhagyás**: Elfogadás/elutasítás gomb
- **Határozat dokumentum jóváhagyás**: Elfogadás/elutasítás gomb
- **Véleményezési felület**: Megjegyzés funkciókkal ellátott véleményezés

### 3. ÜGYINTÉZŐ SZEREPKÖR

#### 3.1 Megkapott Ügyek Szűrése

Fájl: `/vasut/belso/index.html`, `/hajozas/belso/index.html` (továbbfejlesztés)

**Fejlesztendő funkciók:**

- **Hozzám rendelt ügyek szűrő**: Rám osztott ügyek megjelenítése

#### 3.2 Formai-Tartalmi Vizsgálat Eljárási Szakasz

**Fejlesztendő funkciók:**

- **Ellenőrzési lista pipálása**: Interaktív checkbox lista minden kritériummal
- **Döntéshozatal - hiánypótlás szükséges**: Hiánypótlási folyamat indítása

#### 3.3 Hiánypótlási Tartalom Összeállítása

**Fejlesztendő funkciók:**

- **Hiánypótlási felszólítás szerkesztése**: Szerkeszthető sablon
- **Expediálási adatok megadása**: Címzett, kézbesítési mód, példányszám
- **Kimenő iktatószám kérése**: EKEIDR integráció mock
- **Dokumentum generálása PDF**: Hivatalos arculattal ellátott PDF
- **Vezetői döntés dokumentum**: Elfogad/elutasít funkció

#### 3.4 Biankó Dokumentum Generálás

**Fejlesztendő funkciók:**

- **Kérelem alapadatokkal feltöltött dokumentum**: Előre kitöltött sablonok

#### 3.5 Döntéshozatal Eljárási Szakasz

**Fejlesztendő funkciók:**

- **Nyilvántartás-olvasás**: VNY024, HNY501 mock integráció
- **Díjfizetés ellenőrzése**: FORRÁS SQL mock
- **Szakmai nyilvántartás olvasása**: Releváns adatok megjelenítése
- **Határozat/végzés tervezet elkészítése**: Dokumentum tervezetek

#### 3.6 Rugalmas Workflow (To-do) Működés

**Fejlesztendő funkciók:**

- **Feladatok kiosztása**: Más ügyintézőknek feladat továbbadása
- **Feladatok elvégzése**: Státusz kezelés és nyomon követés

#### 3.7 Dokumentum Tervezet Egyeztetés és Verziókezelés

**Fejlesztendő funkciók:**

- **Határozat-tervezet verziókezelés**: Módosítások nyomon követése
- **Dokumentum expediálási adatok**: Hány példány, kinek küld, csatorna
- **Kimenő iktatószám kérése**: EKEIDR interfész
- **Határozat dokumentum generálása PDF**: Arculati elemekkel
- **Tervezet előterjesztés vezetői jóváhagyásra**: Véleményezési folyamat
- **Vezetői döntés dokumentum**: Elfogad/elutasít visszacsatolás

#### 3.8 Nyilvántartás Adatfrissítés

**Fejlesztendő funkciók:**

- **Döntés adatai átvezetése**: Végleges döntés nyilvántartásba írása

## 🔍 VÉLEMÉNYEZÉSI FUNKCIÓ RÉSZLETES KIDOLGOZÁSA

### Véleményezési Workflow - Többszörös Véleményezés

#### 3.8.1 Ügyintéző oldal - Tervezet Előterjesztés (Módosított)

Fájl: `/vasut/belso/velemenyezes-eloterjesztes.html`, `/hajozas/belso/velemenyezes-eloterjesztes.html` (új)

**Funkciók:**

- **Tervezet kiválasztás**: Dropdown lista az elkészített tervezetekből
- **Véleményezők kiválasztása**: Checkbox lista vagy multi-select dropdown
  - Vezető
  - Más ügyintézők
  - Szakértők
  - Külső szervezetek képviselői
- **Véleményezésre küldés**: "Véleményezésre küld mindenkinek" gomb
- **Üzenet hozzáadás**: Opcionális kísérő üzenet a véleményezőknek
- **Státusz követés**: "Véleményezésre küldve X személynek" állapot jelzése

#### 3.8.2 Véleményező oldal - Véleményezési Felület

Fájl: `/vasut/belso/vezeto-velemenyezes.html`, `/hajozas/belso/vezeto-velemenyezes.html` (új)

**Funkciók:**

- **Véleményezésre váró dokumentumok lista**: Beérkezett tervezetek megjelenítése
- **Dokumentum megnyitás**: Tervezet tartalmának megtekintése
- **Megjegyzés hozzáadás**: Szövegdoboz a véleményhez
- **Véleményezés befejezése gombok**:
  - **"Elfogadom"** - zöld gomb
  - **"Elutasítom, módosítást kérek"** - piros gomb
  - **"Megjegyzéssel visszaküldöm"** - sárga gomb

#### 3.8.3 Ügyintéző oldal - Vélemények Értékelése (Új)

Fájl: `/vasut/belso/velemeny-ertekeles.html`, `/hajozas/belso/velemeny-ertekeles.html` (új)

**Funkciók:**

- **Beérkezett vélemények lista**: Minden véleményező válaszának megjelenítése
- **Vélemény részletek megtekintése**: Teljes szöveg és státusz
- **Vélemény elfogadása/elutasítása**: Checkbox minden véleménynél
  - "Figyelembe veszem" checkbox
  - "Nem veszem figyelembe" checkbox
  - "Indoklás" szövegmező (miért nem veszi figyelembe)
- **Összesített döntés**: "Vélemények értékelése befejezve" gomb
- **Továbblépés**: "Folytatás következő lépéssel" gomb

#### 3.8.4 Megjegyzés és Vélemény Kezelő Komponens (Bővített)

Fájl: `/assets/js/components/vihar-velemenyezes.js` (új)

**Funkciók:**

- **Véleményező kiválasztás komponens**: Multi-select interface
- **Vélemény állapot követés**: Kinek küldve, ki válaszolt már
- **Vélemény értékelő interface**: Elfogadás/elutasítás kezelés
- **Automatikus értesítések**: Mock értesítések véleményezőknek
- **Státusz aggregáció**: Összes vélemény állapotának összesítése

### Véleményezési Állapotok (Bővített)

#### Dokumentum státuszok

- **"Szerkesztés alatt"**: Ügyintéző dolgozik rajta
- **"Véleményezésre küldve"**: X személynek küldve véleményezésre
- **"Véleményezés folyamatban"**: Részben beérkeztek a vélemények (X/Y)
- **"Vélemények beérkeztek"**: Minden vélemény beérkezett
- **"Vélemények értékelés alatt"**: Ügyintéző értékeli a véleményeket
- **"Vélemények értékelve"**: Ügyintéző eldöntötte, melyeket fogadja el
- **"Végleges"**: Végső állapot, kiadható

#### Vélemény státuszok

- **"Kiküldve"**: Véleményezőhöz elküldve
- **"Elolvasva"**: Véleményező megnyitotta
- **"Válaszolt"**: Véleményező elküldte a véleményét
- **"Elfogadva"**: Ügyintéző figyelembe veszi
- **"Elutasítva"**: Ügyintéző nem veszi figyelembe

## 📋 Megvalósítandó Fájlok Listája

### Új HTML oldalak

1. `/vasut/kulso/hianypotlas.html` - Ügyfél hiánypótlás
2. `/vasut/kulso/ugyek.html` - Ügyfél feladatok áttekintése
3. `/vasut/belso/vezeto-dashboard.html` - Vezető dashboard
4. `/vasut/belso/vezeto-velemenyezes.html` - Véleményező felület (vezető + mások)
5. `/vasut/belso/velemenyezes-eloterjesztes.html` - Ügyintéző véleményezés előterjesztés
6. `/vasut/belso/velemeny-ertekeles.html` - Ügyintéző vélemények értékelése
7. `/hajozas/kulso/hianypotlas.html` - Hajózás ügyfél hiánypótlás
8. `/hajozas/kulso/ugyek.html` - Hajózás ügyfél feladatok
9. `/hajozas/belso/vezeto-dashboard.html` - Hajózás vezető dashboard
10. `/hajozas/belso/vezeto-velemenyezes.html` - Hajózás véleményező felület
11. `/hajozas/belso/velemenyezes-eloterjesztes.html` - Hajózás ügyintéző véleményezés
12. `/hajozas/belso/velemeny-ertekeles.html` - Hajózás ügyintéző vélemények értékelése

### Új JavaScript komponensek

1. `/assets/js/components/vihar-lista-csempe.js` - Lista/csempe nézet
2. `/assets/js/components/vihar-velemenyezes.js` - Véleményezési funkció
3. `/assets/js/components/vihar-feladat-kioszt.js` - Feladatkiosztás
4. `/assets/js/components/vihar-ellenorzo-lista.js` - Interaktív ellenőrzőlista
5. `/assets/js/vihar-pdf-generator.js` - PDF generálás arculattal

### Továbbfejlesztendő meglévő fájlok

1. `/vasut/belso/index.html` - Ügyintézői felület bővítése
2. `/hajozas/belso/index.html` - Ügyintézői felület bővítése
3. `/assets/js/vihar-mock-data.js` - Mock adatok bővítése
4. `/assets/css/vihar-common.css` - Arculati elemek és új komponensek

### Arculati fájlok

1. `/assets/images/magyar_allam_logo.png` - Magyar állam logo
2. `/assets/images/ekm_logo.png` - EKM logo
3. `/assets/css/vihar-arculat.css` - Kormányzati arculati CSS

## 🎯 Implementációs Prioritások

### 1. Magas prioritás (Bemutató kritikus)

- Lista/csempe nézet komponens minden felületre
- Véleményezési funkció megjegyzésekkel
- Vezetői feladatkiosztás (ügy szignálás)
- PDF arculati elemek
- Aláírás funkció

### 2. Közepes prioritás

- Hiánypótlási folyamat teljes kidolgozása
- Rugalmas workflow rendszer
- Dokumentum tervezet kezelés
- Nyilvántartás frissítések

### 3. Alacsony prioritás

- Komplex szűrési lehetőségek
- Automatikus értesítések
- Teljes verziókezelés

## 📄 Dokumentációs Követelmények

### Arculati jegyzőkönyv

- Képernyőképek minden szerepkör főbb funkcióiról
- Elfogadási kritériumok dokumentálása
- UX/UI jóváhagyási folyamat

### Szerepkör specifikus dokumentáció

- **Vezető képernyőképek**: Dashboard, feladatkiosztás, döntéshozatal, véleményezés
- **Ügyintéző képernyőképek**: Ügy vizsgálat, dokumentum készítés, workflow, véleményezés előterjesztés
- **Ügyfél képernyőképek**: Kérelem benyújtás, hiánypótlás, státusz követés
