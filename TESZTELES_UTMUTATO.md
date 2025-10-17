# VAHAP Rendszer - Tesztelési Útmutató

## 📋 Áttekintés

A VAHAP (Vasúti és Hajózási Integrált Hatósági Rendszer) vasúti belső (ügyintézői) moduljának teljes funkcionalitású drótvázas verziója elkészült. A rendszer három komplett példa üggyel demonstrálható különböző workflow állapotokban.

## 🎯 Elkészült Komponensek

### Fő Workflow Komponensek ✅

1. **Kérelem Tab** (F-0107) - Kérelem adatlap megtekintése
2. **Hatáskör Vizsgálat** (F-0064, UCE-1793) - Paraméterezett ellenőrzési lista
3. **Formai Ellenőrzés** (F-0065, UCE-1799) - Formai megfelelőség vizsgálata
4. **Tartalmi Ellenőrzés** (F-0066, UCE-1794) - Tartalmi megfelelőség vizsgálata
5. **VNY024 Nyilvántartás** (F-0090) - Vasútegészségügyi adatok ellenőrzése
6. **Sommás Eljárás Döntés** (F-0088, UCE-1800) - 8 vs 60 nap döntés, munkanap kalkuláció
7. **Döntési Javaslat** (F-0074, UCE-1826) - Részletes döntési javaslat készítése
8. **Véleményezés** (F-0096, UCE-1824) - Döntési javaslat véleményeztetése
9. **Vezetői Döntés** (F-0099, UCE-1828) - Osztályvezető jóváhagyása
10. **Dokumentumok Generálása** (F-0091-095) - Végzés, Határozat, Igazolás, Tájékoztatás, Hirdetmény
11. **Lezárás** (F-0097, UCE-1828) - Ügy lezárása, összegzés, feladatlista

### Kiegészítő Komponensek ✅

- **Hiánypótlás** (F-0100, UCE-2000) - Többkörös hiánypótlási felszólítás
- **Tényállás tisztázás** (F-0102, UCE-1803) - Rugalmas workflow cselekmények
- **Értesítés** (F-0089) - Ügyfél értesítések

### Panel Komponensek ✅

- **Döntési Panel** - Gyors műveletek (sommás, hiánypótlás, elutasítás)
- **Előzmények Panel** - Eljárási előzmények timeline
- **Dokumentumok Panel** - Kapcsolódó dokumentumok listája
- **Ügyfél Panel** - Ügyfél adatok és statisztika

## 🗂️ Példa Ügyek

### 1. VAHAP-V-2024-001234 (Kovács János)
**Állapot**: Sommás döntésig elkészített
**URL**: `ugy-munkalap-v2.html?ugy=VAHAP-V-2024-001234`

**Befejezett lépések**:
- ✅ Kérelem beérkezése
- ✅ Hatáskör vizsgálat (biztosított)
- ✅ Formai ellenőrzés (megfelel)
- ✅ Tartalmi ellenőrzés (megfelel)
- ✅ VNY024 ellenőrzés
- ✅ Sommás eljárás (8 munkanap)
- ⏳ Döntési javaslat (folyamatban)

**Tesztelési pontok**:
- Kérelem adatok megjelenítése
- Ellenőrzési listák működése
- Workflow státuszok
- Döntési előzmények
- Dokumentumok listája

### 2. VAHAP-V-2024-001235 (Tóth Eszter)
**Állapot**: Döntési javaslat elkészítve, vezetői döntés folyamatban
**URL**: `ugy-munkalap-v2.html?ugy=VAHAP-V-2024-001235`

**Befejezett lépések**:
- ✅ Minden vizsgálat befejezve
- ✅ Döntési javaslat elkészítve
- ⏳ Vezetői döntés (folyamatban)

**Tesztelési pontok**:
- Döntési javaslat megjelenítése
- Véleményezés funkció
- Vezetői döntés felület
- Feltételek kezelése
- Értesítendő felek

### 3. VAHAP-V-2024-001100 (Nagy Gábor) ⭐ **TELJES WORKFLOW**
**Állapot**: Lezárt ügy
**URL**: `ugy-munkalap-v2.html?ugy=VAHAP-V-2024-001100`

**Befejezett lépések**:
- ✅ Teljes workflow elejétől végéig
- ✅ Vezetői jóváhagyás
- ✅ Dokumentumok kiadva
- ✅ Értesítések kiküldve
- ✅ Nyilvántartások frissítve
- ✅ Ügy lezárva

**Tesztelési pontok**:
- Teljes workflow áttekintése
- Lezárási folyamat
- Workflow statisztikák
- Átfutási idő kalkuláció (11 munkanap)
- Lezárási feladatok checklist

## 🧪 Tesztelési Forgatókönyvek

### Alapvető Navigáció

1. **Oldal betöltése**
   ```
   vasut/belso/ugy-munkalap-v2.html?ugy=VAHAP-V-2024-001234
   ```
   - Ellenőrizd: Bal oldali workflow navigáció megjelenik
   - Ellenőrizd: Középső munka terület betölt
   - Ellenőrizd: Jobb oldali panelek megjelennek

2. **Tab váltás**
   - Kattints a bal oldali menü különböző lépéseire
   - Ellenőrizd: Minden tab betölt hiba nélkül
   - Ellenőrizd: Aktív tab kijelölése működik

3. **Kollapsz funkció**
   - Kattints a bal oldali < / > gombra
   - Kattints a jobb oldali < / > gombra
   - Ellenőrizd: Oszlopok összezáródnak és kinyílnak
   - Ellenőrizd: Középső oszlop szélessége dinamikusan változik

### Ellenőrzési Listák Tesztelése

**Hatáskör Tab**:
1. Navigálj a "Hatáskör vizsgálat" tab-ra
2. Pipáld ki a kritériumokat
3. Adj meg megjegyzést
4. Mentsd el
5. Ellenőrizd: Státusz badge változik
6. Ellenőrizd: Progress bar frissül
7. Ellenőrizd: "Következő lépés" ajánlása működik

**Formai és Tartalmi** - hasonló tesztek

### Sommás Eljárás Döntés

1. Navigálj a "Sommás eljárás" tab-ra
2. Ellenőrizd: Előfeltételek ellenőrzése működik (előző lépések)
3. Válassz "Sommás (8 munkanap)" opciót
4. Ellenőrizd: Határidő kalkuláció (munkanapok)
5. Adj meg indoklást
6. Mentsd el
7. Ellenőrizd: Határidő információ frissül

### Döntési Javaslat Készítés

1. Navigálj a "Döntési javaslat" tab-ra
2. Ellenőrizd: Korábbi vizsgálatok összefoglalója
3. Válassz döntési típust
4. Adj meg indoklást (min. 100 karakter)
5. Add meg jogszabályi hivatkozásokat
6. Adj hozzá feltételeket
7. Válassz értesítendő feleket
8. Válassz dokumentum sablont
9. Mentsd el
10. Ellenőrizd: Validációk működnek

### Véleményezés

1. Navigálj a "Véleményezés" tab-ra
2. Ellenőrizd: Döntési javaslat összefoglaló megjelenik
3. Adj hozzá új véleményezőt
4. Rögzíts véleményt (álláspont + indoklás)
5. Ellenőrizd: Progress bar frissül
6. Zárj be véleményezést
7. Ellenőrizd: "Összes vélemény beérkezett" validáció

### Vezetői Döntés

1. Navigálj a "Vezetői döntés" tab-ra
2. Ellenőrizd: Döntési javaslat összefoglaló
3. Válassz döntési típust:
   - Jóváhagyás
   - Elutasítás
   - Módosítással jóváhagyás
4. Ellenőrizd: Indoklás kötelező elutasításnál/módosításnál
5. Mentsd el
6. Ellenőrizd: Automatikus továbbítás következő lépéshez

### Dokumentumok Generálása és Szerkesztése

1. Navigálj a "Dokumentumok" tab-ra
2. Kattints "Generálás" gombra (Végzés, Határozat, Igazolás, stb.)
3. Ellenőrizd: Loading spinner megjelenik
4. Ellenőrizd: Dokumentum előnézet megjelenik
5. **ÚJ:** Kattints a "Szerkesztés" gombra
6. **ÚJ:** Módosítsd a dokumentum tartalmát a textarea-ban
7. **ÚJ:** Kattints "Változtatások mentése" gombra
8. **ÚJ:** Ellenőrizd: Módosított tartalom megjelenik az előnézetben
9. **ÚJ:** Kattints "Véglegesítés" gombra
10. Ellenőrizd: Letöltés gomb működik

### Lezárás

1. Navigálj a "Lezárás" tab-ra (VAHAP-V-2024-001100 ügynél)
2. Ellenőrizd: Ügy összefoglaló adatok
3. Ellenőrizd: Workflow statisztika táblázat
4. Ellenőrizd: Átfutási idő kalkuláció
5. Ellenőrizd: Lezárási feladatok checklist
6. Adj meg összegző megjegyzést
7. Válassz lezárási típust
8. Zárj le ügyet

## 🐛 Ismert Hibák és Megoldásuk

### 1. "Cannot read properties of undefined (reading 'nev')" és (reading 'length')

**Ok**: Az `ugy` prop üres objektum vagy undefined, amikor a komponens betölt, valamint a mellekletek tömb is undefined lehet.

**Megoldás**: ✅ Javítva - A `vihar-tab-kerelem.js` computed property most már védett inicializációval rendelkezik, minden nested property biztonságosan inicializálva van.

### 2. "this.$set is not a function"

**Ok**: Vue 2 kompatibilitási probléma.

**Megoldás**: ✅ Javítva - `this.$set` eltávolítva, közvetlen property assignment használata.

### 3. Nem létező ügy betöltése

**Ok**: URL paraméterben nem létező ügyazonosító.

**Megoldás**: ✅ Javítva - Alapértelmezett ügy betöltése `VAHAP-V-2024-001234`-re.

## 📊 Teljesítmény és Konzol

### Várt Konzol Üzenetek

```
[VAHAP] Konfiguráció betöltve
[VAHAP] Munkalap betöltése, ügyazonosító: VAHAP-V-2024-001234
[VAHAP] Ügy adatok betöltve: VAHAP-V-2024-001234
[VAHAP] Munkalap alkalmazás betöltve
[F-0064] Kritériumok betöltése...
[F-0065] Formai ellenőrzés tab betöltve
...
```

### Figyelmeztetések (normális)

```
You are running a development build of Vue.
Make sure to use the production build (*.prod.js) when deploying for production.
```

## 🔧 Fejlesztői Megjegyzések

### Mock Adatok Struktúra

Minden ügy tartalmazza:
- `ugyazonosito`: Egyedi ügy azonosító
- `ugyfel`: Ügyfél adatok (név, születési dátum, anyja neve, lakcím, telefon, email)
- `kerelem`: Kérelem adatok
- `dokumentumok`: Dokumentumok listája
- `workflow_steps`: Workflow lépések státuszai
- `dontesi_elozmenyek`: Döntési előzmények
- `eljaras_elozmenyek`: Eljárási előzmények timeline
- `[tab]_data`: Mentett tab adatok (hatáskor_data, formai_data, stb.)

### Munkanap Kalkuláció Logika

A sommás eljárás és lezárás komponensekben használt munkanap kalkuláció:

```javascript
function calculateBusinessDays(napok) {
    const today = new Date();
    let businessDaysAdded = 0;
    let currentDate = new Date(today);

    while (businessDaysAdded < napok) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        // 0 = vasárnap, 6 = szombat
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            businessDaysAdded++;
        }
    }

    return currentDate.toISOString().split('T')[0];
}
```

## ✅ Tesztelési Checklist

### Alapvető Működés
- [ ] Oldal betöltődik hiba nélkül
- [ ] Mind a 3 példa ügy betölthető
- [ ] Navigáció működik tab-ok között
- [ ] Kollapsz funkció működik mindkét oldalon

### Workflow Lépések
- [ ] Kérelem tab adatok megjelenítése
- [ ] Hatáskör vizsgálat mentése
- [ ] Formai ellenőrzés mentése
- [ ] Tartalmi ellenőrzés mentése
- [ ] VNY024 ellenőrzés működése
- [ ] Sommás döntés munkanap kalkuláció
- [ ] Döntési javaslat teljes kitöltése
- [ ] Véleményezés véleményező hozzáadása
- [ ] Vezetői döntés típusok
- [ ] Dokumentumok generálása (mind az 5 típus)
- [ ] Lezárás workflow összegzése

### Validációk
- [ ] Kötelező mezők ellenőrzése
- [ ] Minimum karakter szám (indoklások)
- [ ] Előfeltételek ellenőrzése (előző lépések)
- [ ] Határidő validáció (min/max)

### Felhasználói Élmény
- [ ] Progress bar-ok frissülnek
- [ ] Státusz badge-ek változnak
- [ ] Loading spinner-ek megjelennek
- [ ] Alert üzenetek informatívak
- [ ] Következő lépés ajánlások működnek

## 🆕 Legújabb Fejlesztések

### V2 Döntési Panel (vihar-panel-dontesek-v2.js)

**Elkészült**: 2024-10-07

A jobb oldali döntési panel teljesen átdolgozott, intelligens verziója, amely workflow állapot-érzékeny és kontextus-specifikus.

**Új funkciók**:
- ✅ **Workflow állapot követés** - Mutatja az aktuális lépés státuszát
- ✅ **Előfeltétel ellenőrzés** - Letiltja a gombokat, ha korábbi lépések nincsenek befejezve
- ✅ **Kontextus-specifikus statisztikák** - Tab-onként más-más statisztika (teljesülési arány, döntések, stb.)
- ✅ **Következő lépés ajánlás** - Automatikus javaslat, hova kell továbblépni
- ✅ **Dinamikus gomb állapotok** - Gomb disable, ha nem teljesülnek előfeltételek
- ✅ **Részletes leírások** - Minden workflow lépéshez kontextus-érzékeny leírás
- ✅ **Hiányzó előfeltételek listája** - Alert üzenetben megmutatja, mi hiányzik

**Tesztelési pontok**:
1. Lépj a "Hatáskör" tab-ra → Látod a teljesülési arányt
2. Próbálj átugorni a "Döntési javaslat" tab-ra anélkül, hogy befejezted volna a korábbi lépéseket → Gombok letiltva
3. Nézd meg a "Következő ajánlott lépés" badge-et → Mindig a soron következő befejezetlen lépést mutatja
4. Kattints egy döntési gombra → Navigáció a következő lépéshez
5. Ellenőrizd az "Előfeltételek hiányoznak" alert megjelenését

### Dokumentumok Szerkeszthetősége (2024-10-07)

**Elkészült**: Dokumentum generálás utáni szerkesztés funkció

A dokumentum tervezetek (F-0091 - F-0095) generálása után a tartalom szabadon szerkeszthető, mielőtt véglegesítésre kerül.

**Új funkciók**:
- ✅ **Szerkesztés mód** - Generálás után a dokumentum szerkeszthető textarea-ban
- ✅ **Változtatások mentése** - Módosítások visszaírása az előnézetbe
- ✅ **Szerkesztés megszakítása** - Változtatások elvetése
- ✅ **Véglegesítés** - Dokumentum lezárása, hozzáadása az ügy dokumentumaihoz
- ✅ **Információs panel** - Jelzi, hogy a dokumentum még szerkeszthető
- ✅ **Státusz badge** - Mutatja, hogy előnézet vagy szerkesztés módban vagyunk

**Tesztelési pontok**:
1. Generálj egy határozat tervezetet
2. Kattints a "Szerkesztés" gombra → Textarea jelenik meg
3. Írj át egy szakaszt (pl. az indoklást)
4. Kattints "Változtatások mentése" → Módosítások megjelennek az előnézetben
5. Kattints újra "Szerkesztés" → A mentett változtatások benne vannak
6. Kattints "Véglegesítés" → Megerősítő dialógus
7. Ellenőrizd: Dokumentum hozzáadódik az ügy dokumentumaihoz

### Interaktív Súgó Rendszer (2024-10-07)

**Elkészült**: Átfogó, kontextus-érzékeny súgó modal

Teljes körű használati útmutató az ügyintézői felülethez, 8 fő szekcióra bontva, példákkal és lépésről lépésre magyarázattal.

**Új funkciók**:
- ✅ **8 súgó szekció** - Bevezetés, Felület felépítése, Workflow, Ellenőrzések, Döntéshozatal, Dokumentumok, Speciális funkciók, Tippek
- ✅ **Bal oldali tartalomjegyzék** - Gyors navigáció a szekciók között
- ✅ **Részletes lépésenkénti útmutatók** - Minden workflow lépéshez konkrét példa
- ✅ **Példa szövegek** - Mit írjunk az indoklásokba, hogyan töltjük ki az űrlapokat
- ✅ **Színkódolt workflow timeline** - Vizuális segítség a folyamat megértéséhez
- ✅ **Gyakori hibák elkerülése** - HIBÁS / HELYES példák
- ✅ **Hasznos tippek és trükkök** - Gyorsabb munka, teljesítmény optimalizálás
- ✅ **Súgó gomb a fejlécben** - Mindig elérhető

**Súgó szekciók tartalma**:
1. **Bevezetés** - Mi a VAHAP? Mire használjuk? Példa ügytípusok
2. **Felület felépítése** - 3 oszlop magyarázat, kollapsz funkció használata
3. **Workflow lépések** - Teljes folyamat 11 lépésben, példákkal mindenhol
4. **Ellenőrzések** - Hatáskör, formai, tartalmi ellenőrzés lépésről lépésre
5. **Döntéshozatal** - Sommás eljárás, döntési javaslat készítése, példa indoklás
6. **Dokumentumok** - Végzés, határozat, igazolás generálása és szerkesztése
7. **Speciális funkciók** - Hiánypótlás, tényállás tisztázás, értesítés
8. **Hasznos tippek** - Gyors navigáció, státuszok, gyakori hibák, támogatás

**Tesztelési pontok**:
1. Kattints a fejlécben a "Súgó" gombra → Modal megnyílik
2. Navigálj a bal oldali tartalomjegyzékben → Szekciók váltása
3. Olvasd el a "Workflow lépések" szekciót → Timeline megjelenik színkódokkal
4. Nézd meg a "Dokumentumok" szekciót → 8 lépéses útmutató példákkal
5. Lapozz a "Hasznos tippek" szekcióhoz → Gyakori hibák és megoldások
6. Kattints "Bezárás" → Modal eltűnik

### Ügyfél Súgó Rendszer (2024-10-07)

**Elkészült**: Átfogó, ügyfél-barát súgó modal a külső (ügyfél) rendszerhez

Teljes körű használati útmutató ügyfelek számára, 8 fő szekcióra bontva, közérthető nyelvezettével és részletes példákkal.

**Új funkciók**:
- ✅ **8 súgó szekció** - Bevezetés, Regisztráció, Kérelem benyújtása, Ügykövetés, Hiánypótlás, Díjfizetés, Dokumentumok, GYIK
- ✅ **Bal oldali tartalomjegyzék** - Gyors navigáció
- ✅ **Lépésről lépésre útmutatók** - Minden folyamathoz konkrét lépések
- ✅ **Példa szövegek és képletek** - Pl. díjkalkuláció példa
- ✅ **Státusz magyarázatok** - Mit jelent a "Hiánypótlás", "Folyamatban", stb.
- ✅ **GYIK accordion** - 8 gyakori kérdés válaszokkal
- ✅ **Hibaelhárítási tippek** - Gyakori problémák megoldása
- ✅ **Helpdesk elérhetőségek** - Telefon, e-mail a lábléchez

**Súgó szekciók tartalma**:
1. **Bevezetés** - Mi a VAHAP? 4 fő funkció, milyen kérelmek
2. **Regisztráció** - 7 lépéses regisztrációs útmutató, gyakori hibák
3. **Kérelem benyújtása** - 6 fő lépés részletesen:
   - Kérelem indítása
   - Személyes adatok kitöltése (mi kötelező?)
   - Kérelem adatok (példa V-044-re)
   - Mellékletek feltöltése (milyen formátum, méret, hogyan?)
   - Díjkalkuláció (példa táblázat)
   - Ellenőrzés és benyújtás
4. **Ügyeim követése** - Munkalista magyarázat, 6 státusz típus kártyákban, értesítések
5. **Hiánypótlás** - Mi az? Hogyan tudom? 7 lépés, gyakori hiánypótlási okok
6. **Díjfizetés** - Mennyibe kerül? 3 fizetési mód (bankkártya, átutalás, csekk)
7. **Dokumentumok** - 4 dokumentum típus, le/feltöltés lépései
8. **GYIK** - 8 gyakori kérdés accordion-ban + hibaelhárítás

**Tesztelési pontok (külső rendszer)**:
1. Menj a `vasut/kulso/munkalista.html` oldalra
2. Kattints a fejlécben a "Súgó" gombra → Modal megnyílik
3. Navigálj a "Kérelem benyújtása" szekcióhoz → 6 lépéses útmutató példákkal
4. Nyisd ki a "GYIK" szekciót → Accordion lista 8 kérdéssel
5. Ellenőrizd a lábléchez → Helpdesk elérhetőségek
6. Kattints "Bezárás" → Modal eltűnik

## 🚀 Következő Lépések

1. **További ügyek hozzáadása** különböző workflow állapotokban
2. **Elutasított ügy** példa (hiánypótlás után is nem megfelelő)
3. **Több körös hiánypótlás** példa
4. **Tényállás tisztázás** teljes példa adatokkal
5. **API integráció** előkészítése (végpontok definiálása)
6. **Produkciós build** létrehozása (Vue prod verzió, minifikáció)
7. **Hajózási modul** hasonló fejlesztése

## 📞 Támogatás

Hibák vagy kérdések esetén ellenőrizd:
1. Konzol hibákat (F12)
2. Network tab-ot (szkriptek betöltődnek?)
3. Vue DevTools-t (komponens állapotok)
4. Mock adatok struktúráját (`vihar-mock-data.js`)

---

**Verzió**: 1.0.0
**Utolsó frissítés**: 2024-10-07
**Fejlesztő**: Claude Code
