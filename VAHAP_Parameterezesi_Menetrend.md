# VAHAP Rendszer Paraméterezési Menetrend és Folyamat

## 📋 Executive Summary

A VAHAP (Vasúti és Hajózási Átfogó Hatósági Platform) rendszer éles használatba vételéhez **200 különböző eljárás típus** paraméterezése szükséges. Ez a dokumentum részletezi a szükséges információkat, jóváhagyási folyamatokat, és a paraméterezés optimális menetrendjét.

---

## 1. 📊 PARAMÉTEREZENDŐ ELJÁRÁSTÍPUSOK MEGOSZLÁSA

### 1.1 Vasúti Modul (V-044 alapú)
| Kategória | Eljárástípusok száma | Példák |
|-----------|---------------------|--------|
| Járművezetői alkalmassági vizsgálatok | 25 | Előzetes, időszakos, soron kívüli vizsgálatok |
| Járművezetői képesítések | 30 | Új engedély, kategória bővítés, nemzetközi engedélyek |
| Oktatói és vizsgáztatói engedélyek | 15 | Oktató engedély, vizsgáztatói engedély |
| Vasútegészségügyi vizsgálatok | 20 | Általános, speciális, felülvizsgálatok |
| Infrastruktúra engedélyezések | 10 | Pálya, állomás, biztonsági berendezések |
| **Összesen** | **100** | |

### 1.2 Hajózási Modul (H-052 alapú)
| Kategória | Eljárástípusok száma | Példák |
|-----------|---------------------|--------|
| Kikötő létesítési engedélyek | 20 | Országos, regionális, helyi kikötők |
| Víziút létesítmény engedélyek | 25 | Zsilipek, hidak, védművek |
| Hajózási létesítmény üzemeltetés | 20 | Működési engedélyek, módosítások |
| Vízrajzi engedélyek | 15 | Mederrendezés, vízkivétel, vízmércék |
| Környezetvédelmi engedélyek | 10 | Vízszennyezés, zajvédelem |
| Szakhatósági eljárások | 10 | Víziút hatósági állásfoglalások |
| **Összesen** | **100** | |

### 1.3 Teljes rendszer
- **Összes eljárástípus:** 200
- **Átlagos paraméterezési idő eljárásonként:** 2-4 óra
- **Becsült teljes időigény:** 400-800 munkaóra (50-100 munkanap)

---

## 2. 🗂️ SZÜKSÉGES INFORMÁCIÓK ELJÁRÁSTÍPUSONKÉNT

### 2.1 Alapadatok (KÖTELEZŐ)
```
✓ Eljárás azonosító kódja (pl. V-044-001)
✓ Eljárás hivatalos megnevezése
✓ Ügytípus besorolás (V-044 / H-052)
✓ Jogszabályi háttér (rendeletek, kormányrendeletek)
✓ Illetékes hatóság megnevezése
✓ Hatásköri szabályok
✓ Illetékességi szabályok (területi/tárgyi)
```

### 2.2 Workflow Paraméterek (KÖTELEZŐ)
```
✓ Workflow sablon kiválasztása (alapértelmezett/sommás)
✓ Workflow lépések listája UCE kódokkal
✓ Döntési pontok és elágazások
✓ Alfolyamatok beépítési pontjai
✓ Automatikus lépések meghatározása
✓ Párhuzamos végrehajtású szakaszok
✓ Hiánypótlási pontok megjelölése
✓ Tényállás tisztázási pontok
```

### 2.3 Határidők (KÖTELEZŐ)
```
✓ Sommás eljárás határideje (nap)
✓ Teljes eljárás határideje (nap)
✓ Hiánypótlási határidő (nap)
✓ Maximális hiánypótlási körök száma
✓ Tényállás tisztázás max. időtartama (nap)
✓ Szakhatósági megkeresés határideje (nap)
✓ Jogorvoslati határidő (nap)
✓ Fellebbezési határidő (nap)
✓ Értesítési határidő (nap)
✓ Naptípus megadása (munkanap/naptári nap)
```

### 2.4 Díjtételek (KÖTELEZŐ)
```
✓ Alapdíjak meghatározása
✓ Pótdíjak típusai és összegei
✓ Kedvezmények feltételei és mértéke
✓ Díjmentességi kategóriák
✓ Díjkalkulációs szabályok
✓ Fizetési módok
✓ Fizetési határidők
```

### 2.5 Ellenőrzési Listák (KÖTELEZŐ)
```
✓ Hatásköri ellenőrzési kritériumok
✓ Formai megfelelőség kritériumai
✓ Tartalmi megfelelőség kritériumai
✓ Kritériumonkénti súlyozás
✓ Kötelező/opcionális jelölés
✓ Hiánypótolható/kizáró jelölés
```

### 2.6 Dokumentum Sablonok (KÖTELEZŐ)
```
✓ Kérelem sablon
✓ Hiánypótlási felszólítás sablon
✓ Végzés sablon
✓ Határozat sablon
✓ Igazolás sablon
✓ Tájékoztatás sablon
✓ Értesítés sablonok
✓ Díjbekérő sablon
```

### 2.7 Nyilvántartási Paraméterek (KÖTELEZŐ)
```
✓ Kapcsolódó nyilvántartás azonosítója
✓ Nyilvántartási kötelezettség típusa
✓ Frissítési szabályok
✓ Adatmezők leképezése
✓ Szinkronizációs szabályok
```

### 2.8 Szerepkörök és Jogosultságok (KÖTELEZŐ)
```
✓ Eljárásban résztvevő szerepkörök
✓ Szerepkörönkénti jogosultságok
✓ Négyszermes elv alkalmazása
✓ Helyettesítési szabályok
✓ Eszkalációs szabályok
```

### 2.9 Interfész Kapcsolatok (OPCIONÁLIS)
```
○ EKEIDR iktatási szabályok
○ FORRÁS SQL interfész adatai
○ Külső rendszerek (VNY024, HNY501)
○ Szakhatósági rendszerek kapcsolatai
```

---

## 3. 🔄 PARAMÉTEREZÉSI FOLYAMAT

### 3.1 Folyamatábra

```
┌─────────────────────────────────────────────────────────────────┐
│  1. ELŐKÉSZÍTÉSI FÁZIS (1-2 hét)                               │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Jogszabályi háttér elemzése                                 │
│  ├─ Meglévő eljárásrend dokumentáció összegyűjtése              │
│  ├─ Hatásköri és illetékességi szabályok tisztázása             │
│  ├─ Felelősök kijelölése ügycsoportonként                       │
│  └─ Paraméterezési sablonok kitöltése (Excel)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. SZAKMAI VALIDÁCIÓ (1 hét)                                   │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Osztályvezető jóváhagyás (ügycsoport szint)                │
│  ├─ Főosztályvezető jóváhagyás                                  │
│  ├─ Jogi osztály véleményezése                                  │
│  └─ Szakértői egyeztetés (külső, ha szükséges)                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. RENDSZERBE VITELI FÁZIS (2-3 hét)                          │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Alapadatok rögzítése                                        │
│  ├─ Workflow sablon kialakítása/kiválasztása                    │
│  ├─ Határidők beállítása                                        │
│  ├─ Díjtételek rögzítése                                        │
│  ├─ Ellenőrzési listák összeállítása                            │
│  ├─ Dokumentum sablonok feltöltése                              │
│  └─ Nyilvántartások összekapcsolása                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. MINŐSÉGELLENŐRZÉS (1 hét)                                   │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Adatintegritás ellenőrzés                                   │
│  ├─ Workflow szimulációs teszt                                  │
│  ├─ Határidő kalkuláció ellenőrzés                              │
│  ├─ Dokumentum generálás teszt                                  │
│  └─ Szerepkör-jogosultság ellenőrzés                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. TESZT ELJÁRÁS FUTTATÁSA (1 hét)                            │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Teszt kérelem benyújtása                                    │
│  ├─ Teljes workflow végigjárása                                 │
│  ├─ Hiánypótlás tesztelése                                      │
│  ├─ Döntéshozatal tesztelése                                    │
│  ├─ Dokumentum generálás ellenőrzés                             │
│  └─ Nyilvántartás frissítés ellenőrzés                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. JÓVÁHAGYÁS ÉS AKTIVÁLÁS (2-3 nap)                          │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Minőségbiztosítási jelentés készítése                       │
│  ├─ Vezetői jóváhagyás (főosztályvezető)                        │
│  ├─ Rendszergazda aktiválás                                     │
│  └─ Eljárás típus publikálása (éles környezet)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Fázisok részletes leírása

#### FÁZIS 1: Előkészítés (1-2 hét)
**Felelős:** Ügycsoportvezető + kijelölt szakreferens

**Feladatok:**
1. Jogszabályi háttér összegyűjtése és elemzése
2. Meglévő eljárási szabályzatok áttekintése
3. Paraméterezési sablon kitöltése (Excel munkalap)
4. Workflow lépések vázlatos kidolgozása
5. Dokumentum sablonok előkészítése (Word formátumban)

**Outputok:**
- Kitöltött paraméterezési Excel munkalap
- Workflow vázlat (folyamatábra)
- Dokumentum sablon tervezetek
- Jogszabályi hivatkozások listája

---

#### FÁZIS 2: Szakmai validáció (1 hét)
**Felelős:** Osztályvezető → Főosztályvezető → Jogi osztály

**Jóváhagyási lépések:**

| Sorszám | Jóváhagyó | Ellenőrzési szempontok | Határidő |
|---------|-----------|------------------------|----------|
| 1 | Ügycsoportvezető | Szakmai helyesség, teljesség | 1 munkanap |
| 2 | Osztályvezető | Osztályszintű konzisztencia | 2 munkanap |
| 3 | Jogi osztály | Jogszabályi megfelelés | 2 munkanap |
| 4 | Főosztályvezető | Végleges szakmai jóváhagyás | 1 munkanap |

**Ellenőrzési checklist:**
- ☐ Jogszabályi hivatkozások helyesek
- ☐ Hatásköri szabályok egyértelműek
- ☐ Határidők megfelelnek a jogszabályoknak
- ☐ Díjtételek összhangban a rendeletekkel
- ☐ Workflow logikailag helyes
- ☐ Dokumentum sablonok megfelelőek
- ☐ Nincs átfedés más eljárásokkal

**Outputok:**
- Jóváhagyott paraméterezési dokumentáció
- Esetleges módosítási javaslatok listája
- Aláírt jóváhagyási lap

---

#### FÁZIS 3: Rendszerbe viteli fázis (2-3 hét)
**Felelős:** Rendszerüzemeltető + Paraméterező szakreferens

**Paraméterezési sorrend (KÖTELEZŐ):**

1. **Alapadatok rögzítése** (30 perc)
   - Eljárás kódja, neve
   - Ügytípus, jogszabályi háttér
   - Hatásköri szabályok

2. **Szerepkörök definiálása** (20 perc)
   - Résztvevő szerepkörök
   - Jogosultságok beállítása

3. **Határidők beállítása** (30 perc)
   - Összes határidő típus
   - Naptípus megadása
   - Kalkulátor tesztelése

4. **Díjtételek rögzítése** (45 perc)
   - Alapdíjak, pótdíjak
   - Kedvezmények
   - Díjkalkulátor teszt

5. **Ellenőrzési listák összeállítása** (60 perc)
   - Hatásköri kritériumok
   - Formai kritériumok
   - Tartalmi kritériumok

6. **Workflow kialakítása** (90-120 perc)
   - Lépések definiálása
   - Döntési pontok
   - Elágazások
   - Alfolyamatok beépítése

7. **Dokumentum sablonok feltöltése** (60 perc)
   - Word sablonok konverziója
   - Változók leképezése
   - Generálási teszt

8. **Nyilvántartások összekapcsolása** (30 perc)
   - Nyilvántartás kiválasztása
   - Mezők leképezése
   - Frissítési szabályok

**Becsült időigény eljárásonként:** 6-8 óra

---

#### FÁZIS 4: Minőségellenőrzés (1 hét)
**Felelős:** Minőségbiztosítási csoport

**Automatikus ellenőrzések:**
- ☐ Minden kötelező mező kitöltött
- ☐ Workflow konzisztens (nincs kimenő él nélküli lépés)
- ☐ Határidők a megengedett tartományban
- ☐ Díjtételek pozitív számok
- ☐ Dokumentum sablonok minden változót tartalmaznak
- ☐ Nyilvántartási kapcsolat érvényes

**Manuális ellenőrzések:**
- ☐ Workflow logikai helyessége
- ☐ Döntési pontok helyes működése
- ☐ Alfolyamatok megfelelő beépítése
- ☐ Dokumentum generálás helyessége
- ☐ Szerepkör-jogosultság összhang

---

#### FÁZIS 5: Teszt eljárás futtatása (1 hét)
**Felelős:** Tesztelő csoport + Szakmai képviselő

**Teszt forgatókönyvek:**

1. **Sikeres eljárás (happy path)**
   - Hibátlan kérelem benyújtása
   - Sommás eljárásban intézés
   - Engedélyező határozat kiadása

2. **Hiánypótlással folytatódó eljárás**
   - Hiányos kérelem benyújtása
   - Hiánypótlási felszólítás
   - Hiánypótlás teljesítése
   - Eljárás befejezése

3. **Elutasító határozat**
   - Nem hatáskörbe tartozó kérelem
   - Elutasító végzés kiadása

4. **Tényállás tisztázással bővített eljárás**
   - Szakhatósági megkeresés
   - Helyszíni szemle
   - Szakértői vélemény
   - Végső döntés

**Dokumentált teszt eredmények:**
- Teszt eset azonosítója
- Elvárt eredmény
- Tényleges eredmény
- Eltérés oka (ha van)
- Javítási javaslat

---

#### FÁZIS 6: Jóváhagyás és aktiválás (2-3 nap)
**Felelős:** Főosztályvezető + Rendszergazda

**Aktiválási checklist:**
- ☐ Összes teszt sikeres
- ☐ Minőségellenőrzési jelentés jóváhagyott
- ☐ Főosztályvezetői jóváhagyás megvan
- ☐ Felhasználók értesítése megtörtént
- ☐ Képzési anyagok elérhetőek
- ☐ Éles környezet felkészítése kész

**Aktiválás lépései:**
1. Teszt környezetből export
2. Éles környezetbe import
3. Kapcsolódó rendszerek értesítése
4. Monitoring beállítása
5. Eljárás státusz: AKTÍV

---

## 4. 📅 RÉSZLETES MENETREND 200 ELJÁRÁS PARAMÉTEREZÉSÉRE

### 4.1 Stratégia: Párhuzamos munkacsoportok

**Munkacsoportok felosztása:**

| Munkacsoport | Felelősség | Létszám | Eljárások száma |
|--------------|------------|---------|-----------------|
| **MC-1: Vasút Járművezetők** | V-044 járművezetői eljárások | 3 fő | 50 |
| **MC-2: Vasút Infrastruktúra** | V-044 infrastruktúra eljárások | 2 fő | 50 |
| **MC-3: Hajózás Létesítmények** | H-052 kikötő és létesítmény | 3 fő | 60 |
| **MC-4: Hajózás Vízrajz** | H-052 víziút és vízrajzi | 2 fő | 40 |
| **MQA: Minőségbiztosítás** | Keresztellenőrzés, teszt | 2 fő | - |
| **R-ADM: Rendszergazdák** | Rendszerbe viteli támogatás | 2 fő | - |

**Összes létszám:** 14 fő

### 4.2 Ütemterv (20 hetes projekt)

#### **0. HÉT: Projekt indítás**
**Feladatok:**
- Kickoff meeting
- Munkacsoportok felállítása
- Eszközök és hozzáférések biztosítása
- Képzések megtartása (VAHAP használat)
- Sablonok véglegesítése

---

#### **1-4. HÉT: Első iteráció (Prioritás 1 - 40 eljárás)**

**MC-1, MC-2, MC-3, MC-4 párhuzamosan:**

| Hét | MC-1 (10 eljárás) | MC-2 (10 eljárás) | MC-3 (10 eljárás) | MC-4 (10 eljárás) | MQA | R-ADM |
|-----|-------------------|-------------------|-------------------|-------------------|-----|-------|
| 1 | Előkészítés | Előkészítés | Előkészítés | Előkészítés | Checklist elkészítés | Rendszer konfig |
| 2 | Szakmai validáció | Szakmai validáció | Szakmai validáció | Szakmai validáció | - | Támogatás |
| 3 | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | - | Támogatás |
| 4 | - | - | - | - | Minőségellenőrzés + Teszt | Aktiválás |

**Output:** 40 aktív eljárás

---

#### **5-8. HÉT: Második iteráció (Prioritás 1 - 40 eljárás)**

| Hét | MC-1 (10 eljárás) | MC-2 (10 eljárás) | MC-3 (15 eljárás) | MC-4 (5 eljárás) | MQA | R-ADM |
|-----|-------------------|-------------------|-------------------|------------------|-----|-------|
| 5 | Előkészítés | Előkészítés | Előkészítés | Előkészítés | Visszajelzések feldolgozása | Támogatás |
| 6 | Szakmai validáció | Szakmai validáció | Szakmai validáció | Szakmai validáció | - | Támogatás |
| 7 | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | - | Támogatás |
| 8 | - | - | - | - | Minőségellenőrzés + Teszt | Aktiválás |

**Kumulatív output:** 80 aktív eljárás

---

#### **9-12. HÉT: Harmadik iteráció (Prioritás 2 - 40 eljárás)**

| Hét | MC-1 (10 eljárás) | MC-2 (10 eljárás) | MC-3 (15 eljárás) | MC-4 (5 eljárás) | MQA | R-ADM |
|-----|-------------------|-------------------|-------------------|------------------|-----|-------|
| 9 | Előkészítés | Előkészítés | Előkészítés | Előkészítés | Közbenső audit | Támogatás |
| 10 | Szakmai validáció | Szakmai validáció | Szakmai validáció | Szakmai validáció | - | Támogatás |
| 11 | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | - | Támogatás |
| 12 | - | - | - | - | Minőségellenőrzés + Teszt | Aktiválás |

**Kumulatív output:** 120 aktív eljárás

---

#### **13-16. HÉT: Negyedik iteráció (Prioritás 2 - 40 eljárás)**

| Hét | MC-1 (10 eljárás) | MC-2 (10 eljárás) | MC-3 (10 eljárás) | MC-4 (10 eljárás) | MQA | R-ADM |
|-----|-------------------|-------------------|-------------------|-------------------|-----|-------|
| 13 | Előkészítés | Előkészítés | Előkészítés | Előkészítés | - | Támogatás |
| 14 | Szakmai validáció | Szakmai validáció | Szakmai validáció | Szakmai validáció | - | Támogatás |
| 15 | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | - | Támogatás |
| 16 | - | - | - | - | Minőségellenőrzés + Teszt | Aktiválás |

**Kumulatív output:** 160 aktív eljárás

---

#### **17-19. HÉT: Ötödik iteráció (Prioritás 3 - 40 eljárás)**

| Hét | MC-1 (10 eljárás) | MC-2 (10 eljárás) | MC-3 (10 eljárás) | MC-4 (10 eljárás) | MQA | R-ADM |
|-----|-------------------|-------------------|-------------------|-------------------|-----|-------|
| 17 | Előkészítés + Szakmai validáció | Előkészítés + Szakmai validáció | Előkészítés + Szakmai validáció | Előkészítés + Szakmai validáció | - | Támogatás |
| 18 | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | Rendszerbe viteli fázis | - | Támogatás |
| 19 | - | - | - | - | Minőségellenőrzés + Teszt | Aktiválás |

**Kumulatív output:** 200 aktív eljárás ✅

---

#### **20. HÉT: Projekt lezárás**

**Feladatok:**
- Végső rendszerszintű teszt (200 eljárás)
- Dokumentáció lezárása
- Átadás-átvételi dokumentum
- Záró projekt meeting
- Lessons learned workshop
- Hypercare időszak megkezdése (4 hét)

---

### 4.3 Prioritizálási mátrix

Az eljárások paraméterezési sorrendjét az alábbi szempontok határozzák meg:

| Prioritás | Szempont | Súly |
|-----------|----------|------|
| **P1 - Kritikus** | Leggyakoribb eljárások (>100 ügy/év) | 40% |
| | Jogszabályi kötelezettség (határidős átállás) | 30% |
| | Komplex workflow (referencia más eljárásokhoz) | 20% |
| | Magas díjbevétel | 10% |
| **P2 - Fontos** | Közepes gyakoriság (20-100 ügy/év) | 40% |
| | Közepes komplexitás | 30% |
| | Kapcsolódik P1 eljárásokhoz | 30% |
| **P3 - Standard** | Ritkán előforduló (<20 ügy/év) | 50% |
| | Egyszerű workflow | 50% |

---

## 5. 📋 JÓVÁHAGYÁSI MÁTRIX

### 5.1 Döntési szintek

| Döntési szint | Hatáskör | Jóváhagyási idő |
|---------------|----------|-----------------|
| **1. Ügycsoportvezető** | Szakmai tartalom helyessége | 1 munkanap |
| **2. Osztályvezető** | Osztályszintű konzisztencia | 2 munkanap |
| **3. Jogi osztály** | Jogszabályi megfelelés | 2 munkanap |
| **4. Főosztályvezető** | Végleges szakmai jóváhagyás | 1 munkanap |
| **5. Minőségbiztosítás** | Rendszer teszt eredmények | 2 munkanap |
| **6. Rendszergazda** | Technikai aktiválás | 0.5 munkanap |

### 5.2 Jóváhagyási dokumentumok

#### Sablon 1: Szakmai Jóváhagyási Lap

```
VAHAP Szakmai Jóváhagyási Lap
Eljárás azonosító: _________________
Eljárás neve: _________________

☐ Jogszabályi hivatkozások helyesek és naprakészek
☐ Hatásköri szabályok egyértelműen meghatározottak
☐ Határidők megfelelnek a jogszabályoknak
☐ Díjtételek összhangban a hatályos rendeletekkel
☐ Workflow logikailag helyes és teljes
☐ Dokumentum sablonok megfelelőek
☐ Nincs átfedés más eljárásokkal

Jóváhagyó: _________________ Dátum: _________
Aláírás: _________________
```

#### Sablon 2: Jogi Véleményezési Lap

```
VAHAP Jogi Véleményezési Lap
Eljárás azonosító: _________________

☐ Jogszabályi háttér megfelel
☐ Hatásköri szabályok jogszerűek
☐ Eljárási határidők megfelelnek
☐ Jogorvoslati lehetőségek biztosítottak
☐ Adatkezelési megfelelőség

Véleményező: _________________ Dátum: _________
Aláírás: _________________
```

#### Sablon 3: Minőségbiztosítási Jelentés

```
VAHAP Minőségbiztosítási Jelentés
Eljárás azonosító: _________________

Automatikus ellenőrzések:
☐ Adatintegritás: OK / HIBA
☐ Workflow konzisztencia: OK / HIBA
☐ Határidő ellenőrzés: OK / HIBA
☐ Díjkalkuláció: OK / HIBA

Manuális tesztek:
☐ Sikeres eljárás teszt: SIKERES / SIKERTELEN
☐ Hiánypótlás teszt: SIKERES / SIKERTELEN
☐ Elutasítás teszt: SIKERES / SIKERTELEN

Összesített eredmény: ☐ JÓVÁHAGYOM  ☐ JAVÍTÁST IGÉNYEL

QA szakértő: _________________ Dátum: _________
```

---

## 6. 🛠️ ESZKÖZÖK ÉS TÁMOGATÓ RENDSZEREK

### 6.1 Paraméterezési Excel sablon

**Tartalom:**
- **LAP 1:** Alapadatok
- **LAP 2:** Határidők
- **LAP 3:** Díjtételek
- **LAP 4:** Workflow lépések
- **LAP 5:** Ellenőrzési kritériumok
- **LAP 6:** Dokumentum sablonok listája
- **LAP 7:** Nyilvántartási kapcsolatok
- **LAP 8:** Szerepkörök

**Validációk:**
- Kötelező mezők kiemelése
- Dropdown listák előre definiált értékekhez
- Számítási képletek (pl. díjkalkuláció)
- Formátum ellenőrzés (dátum, szám)

### 6.2 VAHAP Paraméterező modul

**Funkciók:**
- Drag & drop workflow szerkesztő
- Real-time validáció
- Verziókövetés
- Összehasonlítás funkció
- Export/Import
- Dokumentum sablon preview
- Teszt eljárás szimulátor

### 6.3 Projekt management eszköz (Jira/Monday)

**Követett metrikák:**
- Paraméterezett eljárások száma
- Jóváhagyási állapot
- Blocker problémák
- Átfutási idő eljárásonként
- Minőségi mutatók

---

## 7. 📊 KOCKÁZATOK ÉS MITIGÁCIÓ

| Kockázat | Valószínűség | Hatás | Mitigáció |
|----------|--------------|-------|-----------|
| Jogszabályi változás a paraméterezés alatt | Közepes | Nagy | Rugalmas workflow kialakítás, verziókövetés |
| Szakmai konszenzus hiánya | Közepes | Nagy | Korai bevonás, egyeztető meetingek |
| Dokumentum sablonok nem megfelelőek | Magas | Közepes | Jogi előzetes review, iteratív finomítás |
| Határidő csúszás | Közepes | Közepes | Buffer időkeretek, párhuzamos munkavégzés |
| Erőforrás hiány (betegség, távollét) | Közepes | Közepes | Cross-training, helyettesítési terv |
| Technikai problémák (rendszer) | Alacsony | Magas | Teszt környezet, backup megoldás |
| Adatintegritási hibák | Alacsony | Magas | Automatikus validáció, QA ellenőrzés |

---

## 8. 📈 SIKERKRITÉRIUMOK (KPI-K)

| KPI | Cél | Mérés módja |
|-----|-----|-------------|
| **Időbeli teljesítés** | 200 eljárás 20 hét alatt | Projekt tracking |
| **Minőség** | 95% első körös teszt siker | Teszt riportok |
| **Jóváhagyási ráta** | 90% első körös jóváhagyás | Jóváhagyási lapok |
| **Átfutási idő** | Max 6-8 óra/eljárás (rendszerbe viteli fázis) | Időkövetés |
| **Hibaarány** | <5% éles környezetben (első hónap) | Incidens menedzsment |
| **Felhasználói elégedettség** | >80% pozitív visszajelzés | Kérdőív (30 nap után) |

---

## 9. 🎯 MÉRFÖLDKÖVEK

| # | Mérföldkő | Határidő | Deliverable |
|---|-----------|----------|-------------|
| M0 | Projekt kickoff | 0. hét vége | Projekt charter, csapat felállítás |
| M1 | Első 40 eljárás aktív | 4. hét vége | 40 éles eljárás |
| M2 | 80 eljárás aktív | 8. hét vége | 80 éles eljárás |
| M3 | 120 eljárás aktív | 12. hét vége | 120 éles eljárás, közbenső audit |
| M4 | 160 eljárás aktív | 16. hét vége | 160 éles eljárás |
| M5 | 200 eljárás aktív | 19. hét vége | 200 éles eljárás ✅ |
| M6 | Projekt lezárás | 20. hét vége | Átadás-átvétel, dokumentáció |

---

## 10. 📞 KOMMUNIKÁCIÓS TERV

### 10.1 Rendszeres meetingek

| Meeting | Résztvevők | Gyakoriság | Időtartam | Cél |
|---------|-----------|-----------|-----------|-----|
| **Daily standup** | Munkacsoportok | Napi | 15 perc | Státusz, blocker |
| **Sprint review** | Munkacsoportok + QA | Heti (péntek) | 60 perc | Heti eredmények, demo |
| **Steering committee** | Vezetők | Kéthetente | 90 perc | Stratégiai döntések |
| **Technical sync** | R-ADM + MC vezetők | Heti | 45 perc | Technikai kérdések |

### 10.2 Riportolás

**Heti riport:**
- Paraméterezett eljárások száma (kumulatív)
- Jóváhagyási állapot megoszlás
- Blocker-ek listája
- Következő heti terv

**Kétheti vezetői riport:**
- KPI-k teljesítése
- Mérföldkő státusz
- Kockázatok és mitigáció
- Eszkalációt igénylő kérdések

---

## 11. 🎓 KÉPZÉSI TERV

### 11.1 Célcsoportok

| Célcsoport | Képzési tartalom | Időtartam |
|------------|------------------|-----------|
| **Paraméterező szakreferensek** | VAHAP teljes használat, workflow szerkesztés | 2 nap |
| **Osztályvezetők** | Jóváhagyási folyamat, riportolás | 0.5 nap |
| **Minőségbiztosítók** | Teszt eszközök, validációs módszertan | 1 nap |
| **Rendszergazdák** | Rendszerbe viteli és aktiválási folyamat | 1 nap |

### 11.2 Képzési ütemezés

- **-1. HÉT:** Paraméterező szakreferensek képzése
- **0. HÉT:** Osztályvezetők és MQA képzése
- **4. HÉT:** Közbenső refresh training
- **12. HÉT:** Haladó képzés (workflow optimalizálás)

---

## 12. 📁 PROJEKT DOKUMENTÁCIÓ

### 12.1 Dokumentumstruktúra

```
/VAHAP_Parameterezesi_Projekt/
├── 00_Projekt_Menedzsment/
│   ├── Projekt_Charter.docx
│   ├── Utemterv.mpp
│   ├── Kockazati_Naplo.xlsx
│   └── Heti_Riportok/
├── 01_Elokeszites/
│   ├── Jogszabaly_Elemzesek/
│   ├── Parameterezes_Sablonok/
│   └── Workflow_Vazlatok/
├── 02_Szakmai_Validacio/
│   ├── Jovahagyasi_Lapok/
│   ├── Jogi_Velemenyezesek/
│   └── Modositasi_Javaslatok/
├── 03_Rendszerbe_Viteli/
│   ├── Parameterezes_Excel/
│   ├── Dokumentum_Sablonok/
│   └── Screenshot_Bizonyitok/
├── 04_Minosegbiztositas/
│   ├── Teszt_Esetek/
│   ├── Teszt_Eredmenyek/
│   └── QA_Riportok/
├── 05_Aktivalas/
│   ├── Atadasatveteli_Dokumentumok/
│   └── Aktivalasi_Jegyzokonyv/
└── 06_Lessons_Learned/
    └── Zarojelentes.docx
```

---

## 13. ✅ ÖSSZEFOGLALÁS

### 13.1 Projekt scope

- **200 különböző eljárástípus** paraméterezése
- **4 munkacsoport** párhuzamos munkavégzéssel
- **20 hét** teljes projekt időtartam
- **14 fő** projekt létszám

### 13.2 Várható erőforrásigény

| Szerepkör | Létszám | Projekt idő | Munkaóra | Becsült költség |
|-----------|---------|-------------|----------|-----------------|
| Paraméterező szakreferens | 10 fő | 20 hét | 8000 óra | - |
| Minőségbiztosító | 2 fő | 20 hét | 1600 óra | - |
| Rendszergazda | 2 fő | 20 hét | 1600 óra | - |
| **Összesen** | **14 fő** | **20 hét** | **11 200 óra** | - |

### 13.3 Kritikus sikertényezők

1. ✅ **Vezetői elkötelezettség** - Döntéshozatali gyorsaság
2. ✅ **Erőforrás rendelkezésre állás** - Dedikált csapat
3. ✅ **Jogszabályi stabilitás** - Minimális változás a projekt alatt
4. ✅ **Technikai infrastruktúra** - Működő VAHAP rendszer
5. ✅ **Képzett munkatársak** - Megfelelő előkészítés
6. ✅ **Minőségbiztosítás** - Folyamatos ellenőrzés
7. ✅ **Kommunikáció** - Hatékony információáramlás

---

## MELLÉKLETEK

### A. melléklet: Paraméterezési Excel sablon (mintakitöltés)
### B. melléklet: Jóváhagyási lap sablonok
### C. melléklet: Teszt forgatókönyv minták
### D. melléklet: Workflow szerkesztési útmutató
### E. melléklet: RACI mátrix
### F. melléklet: Eszkalációs eljárásrend

---

**Dokumentum verzió:** 1.0
**Utolsó módosítás:** 2024-10-06
**Készítette:** VAHAP Projekt Iroda
**Jóváhagyta:** [Főosztályvezető neve]

---

*Ez a dokumentum a VAHAP rendszer éles használatba vételéhez szükséges paraméterezési projekt teljes körű leírását tartalmazza. A dokumentum alapján a projekt tervezhető, végrehajtható és nyomon követhető.*
