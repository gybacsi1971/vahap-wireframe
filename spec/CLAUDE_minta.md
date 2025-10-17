# CLAUDE.md

Ez a fájl útmutatást ad a Claude Code-nak (claude.ai/code) a kódtárral végzett munka során.

## Projekt áttekintés

A **VAHAP** (Vasúti és Hajózási Rendszer) egy magyar kormányzati elektronikus ügykezelő rendszer vasúti és hajózási hatósági folyamatokhoz. A rendszer külső (ügyféloldali) és belső (ügyintézői) modulokból áll, Bootstrap 5-tel és Vue.js 3-mal építve. A két rendszer indítása egy közös weboldalról történik, ahol publikus információk vannak elhelyezve és innen lehet elérni a vasúti és hajózási rendszer külső és belső moduljait.

## Nyelv és kommunikáció

**FONTOS**: Ez egy magyar kormányzati projekt. Minden kommunikáció, megjegyzés és felhasználói felület szövege magyar nyelvű legyen. A felhasználóval történő interakciók is magyarul történjenek.

## 🎯 KRITIKUS FEJLESZTÉSI FOLYAMAT

### MIELŐTT BÁRMELY MODUL FEJLESZTÉSÉBE KEZDESZ:

1. **MINDIG először elemezd a specifikációkat**: Olvasd el és jegyezd meg a `VAHAP Hajózási Modul Logikai Specifikáció.md` és `VIHAR Vasúti Modul Logikai Specifikáció.md` tartalmát.
2. **Értsd meg a modulkapcsolatokat**: Térképezd fel, hogyan kapcsolódik a modul a többiekhez.
3. **Azonosítsd az alrendszert**: Belső (ügyintézői) vagy Külső (ügyféloldali).
4. **Kövesd az egységes struktúrát**: Használd az alábbi kialakított mintákat.

## 🏗️ Egységes alkalmazásstruktúra

### Külső rendszer – ügyféloldal


**Jellemzők:**

* Letisztult, minimalista felület
* Többlépéses folyamatoknál varázsló
* Egyértelmű előrehaladás-jelzők
* Súgó buborékok és útmutatás
* Reszponzív (mobilbarát) megjelenés
* Barátságos, támogató hangnem az üzenetekben

**Standard elrendezés:**



### Belső rendszer – ügyintézői oldal



**Jellemzők:**

* Információgazdag nézetek
* Bal oldali oldalsáv navigáció
* Több panel és fül (tab)
* Gyorsműveleti eszköztárak
* Tömeges műveletek
* Hivatalos, tárgyilagos hangnem

**Standard elrendezés:**


## 📐 Kötelező layout-struktúra – Belső rendszer

### A háromoszlopos elrendezés logikája

A belső rendszer minden modulja **kötelezően** az alábbi háromoszlopos elrendezést követi:

#### 1. **Bal oszlop – navigációs menü (2 oszlop széles)**

* **Funkció**: Gyors navigáció az ügy különböző műveletei között
* **Tartalom**:


* **Megjelenés**: 

#### 2. **Középső terület – munkafelület (6–8 oszlop széles)**

* **Funkció**: Az érdemi munka végrehajtásának helye
* **Szerkezet**:

  * **Ügyfejléc**: Egységes információs panel (ügyazonosító, ügyfél, ügytípus, határidő)
  * **Fülek (tabok)**: Munkafolyamat szakaszokra bontása (ha szükséges)
  * **Munkaterület**: Űrlapok, ellenőrző listák, szövegmezők
* **Cél**: Hatékony adatbevitel és feldolgozás

#### 3. **Jobb oszlop – döntési és információs panelek (2–4 oszlop széles)**

* **Funkció**: Kontextuális információk és műveletek
* **Kötelező sorrend (felülről lefelé)**:

  1. **Döntési/Műveleti panel** (**MINDIG ELSŐ**)

  2. **Eljárás-előzmények** (**MINDIG MÁSODIK**)

  3. **Kapcsolódó dokumentumok** (**MINDIG HARMADIK**)

  4. **Egyéb információk** (**OPCIONÁLIS**)


### Miért fontos ez az elrendezés?

1. **Konzisztencia**: A felhasználók minden modulban ugyanott találják a funkciókat.
2. **Hatékonyság**: A döntési opciók mindig kéznél vannak (jobb felső terület).
3. **Áttekinthetőség**: Az előzmények és dokumentumok fix helye gyors tájékozódást tesz lehetővé.
4. **Ergonómia**: A legfontosabb műveletek a képernyő jobb oldalán, könnyen elérhetők.

### Implementációs szabály

**KÖTELEZŐ**: Minden új vagy módosított belső modul fejlesztésénél ezt a struktúrát kell követni. A jobb oldali panelek sorrendje **NEM** változtatható!

## 🎨 Egységes dizájnrendszer

### Színváltozók (MINDEN modulban kötelező)


### Standard komponensek

**Státusz jelvények:**

**Gombok (műveleti hierarchia):**


**Űrlapvezérlők:**


## 📊 Standard mintaadatok

### Felhasználói adatok (külső)

### Felhasználói adatok (belső)

### Ügyadatok


## 🔄 Modul-integrációs pontok

A specifikációk elemzése alapján a modulok az alábbi rendszereken keresztül kapcsolódnak:

## 🏷️ Funkcióazonosítók kötelező feltüntetése

**KRITIKUS SZABÁLY**: Minden modulban és funkcióban kötelező feltüntetni a funkció- és használatieset-azonosítókat!

### Vizuális megjelenítés

A funkcióazonosítókat jelvényekkel kell megjeleníteni a megfelelő helyeken:

```html
<!-- Funkciókódok (F-xxxx) – szürke jelvény -->
<span class="badge bg-secondary ms-2">F-0064</span>

<!-- Használatieset-kódok (UCE-xxxx) – kék jelvény -->
<span class="badge bg-info ms-1">UCE-1987</span>

<!-- Döntési panelekben – sötét jelvény -->
<span class="badge bg-dark ms-2">F-0088</span>

<!-- Döntési opciókban – világos jelvény -->
<span class="badge bg-light text-dark ms-1">UCE-1994</span>
```

### Hol kell feltüntetni?

1. **Szekciófejlécekben**: minden fő funkcióblokk címében
2. **Fülfejlécekben**: munkafolyamat-lépéseknél
3. **Döntési opciókban**: választható műveleteknél
4. **Gombokon**: fontos akciógomboknál
5. **JavaScript metódusokban**: kommentként a metódus elején

### Példa implementáció

```html
<h6 class="mb-3">
    <i class="bi bi-shield-check"></i> Hatáskör és illetékesség vizsgálata
    <span class="badge bg-secondary ms-2">F-0064</span>
    <span class="badge bg-info ms-1">UCE-1987</span>
</h6>
```

```javascript
// UCE-1987 - Hatáskör és illetékesség vizsgálata
checkJurisdiction() {
    // F-0064 - Hatáskör és illetékesség vizsgálat
    ...
}
```

### Fontosabb funkciókódok

* **F-0064**: Hatáskör és illetékesség vizsgálat
* **F-0065**: Formai megfelelőség vizsgálata
* **F-0066**: Tartalmi megfelelőség vizsgálat
* **F-0088**: Döntés-előkészítés
* **F-0093**: Kiadmányozás
* **F-0100**: Hiánypótlás kezelése
* **F-0102**: Rugalmas workflow (tényállás tisztázás)

### Használatieset-kódok (UCE)

* **UCE-1987**: Hatáskör vizsgálat
* **UCE-1988**: Tartalmi vizsgálat
* **UCE-1990**: Elutasító végzés
* **UCE-1991**: Áttételi végzés
* **UCE-1993**: Formai megfelelőség
* **UCE-1994**: Sommás eljárás
* **UCE-1999**: Tényállás tisztázás
* **UCE-2000**: Hiánypótlás
* **UCE-2001**: Döntés-előkészítés
* **UCE-2065**: Hiánypótlási folyamat
* **UCE-2071**: Döntési pont

## 📋 Fejlesztési ellenőrzőlista új modulokhoz

* [ ] Kapcsolódó specifikáció rész elemzése
* [ ] Modul típusának azonosítása (belső/külső)
* [ ] Megfelelő fájlnévadási konvenció használata
* [ ] Helyes layout-struktúra alkalmazása
* [ ] Standard CSS-változók beállítása
* [ ] Konzisztens komponensek használata
* [ ] Magyar feliratok és üzenetek beillesztése
* [ ] Mintaadatok hozzáadása
* [ ] Vue.js reaktivitás implementálása
* [ ] Reszponzív megjelenés tesztelése
* [ ] Modulkapcsolatok ellenőrzése
* [ ] **FUNKCIÓKÓDOK (F-xxxx) ÉS HASZNÁLATI ESET KÓDOK (UCE-xxxx) FELVÉTELE**

## 🚫 Amit NEM szabad

* Ne készíts angol nyelvű felületeket vagy kommenteket.
* Ne keverd a belső és külső UI mintákat.
* Ne használj egyedi színeket a meghatározott palettán kívül.
* Ne írj backend kódot.
* Ne valósíts meg valódi hitelesítést/fizetést.
* Ne térj el a kialakított elrendezésektől.

## 📝 Magyar terminológia (mindig ezt használd)

**Navigáció:**

* Főoldal – Home
* Új kérelem – New request
* Ügyeim – My cases
* Nyilvántartások – Registries
* Kilépés – Logout

**Műveletek:**

* Mentés – Save
* Küldés – Send
* Törlés – Delete
* Szerkesztés – Edit
* Megtekintés – View
* Keresés – Search
* Szűrés – Filter
* Exportálás – Export

**Státuszok:**

* Új – New
* Folyamatban – In progress
* Várakozik – Waiting
* Kész – Complete
* Elfogadva – Accepted
* Elutasítva – Rejected
* Lejárt – Expired

**Üzenetek:**

* Sikeres művelet – Successful operation
* Hiba történt – An error occurred
* Kötelező mező – Required field
* Nincs találat – No results

## Dokumentáció

* `VIHAR Vasúti Modul Logikai Specifikáció.md` `VAHAP Hajózási Modul Logikai Specifikáció.md` és  – **KÖTELEZŐ** elolvasni bármilyen fejlesztés előtt
* `VIHAR_Rendszer_Ismerteto.md` – Rendszerleírás végfelhasználók számára