# VAHAP VASÚTI MODUL - HASZNÁLATI ESETEK ÉS WORKFLOW LÉPÉSEK

## A vasúti járművezetők előzetes alkalmassági vizsgálata

**Dokumentum verziója:** 1.0  
**Elkészítés dátuma:** 2025-10-04  
**Forrás dokumentum:** V044_20251003_1208.pdf

---

## TARTALOMJEGYZÉK

1. [Bevezetés](#1-bevezetes)
2. [Munkafolyamat áttekintése](#2-munkafolyamat-attekintese)
3. [Részfolyamatok részletesen](#3-reszfolyamatok-reszletesen)
4. [Funkciókatalógus](#4-funkciokatalogus)
5. [Dokumentumok](#5-dokumentumok)
6. [Szerepkörök](#6-szerepkorok)

---

## 1. BEVEZETÉS

### 1.1 Az ügytípus rövid leírása

A mozdonyvezetői munkakörre irányuló előzetes egészségi alkalmassági vizsgálati eljárás során a vasúti közlekedési hatóság a tanúsító szervezet által kibocsátott tanúsítványt vizsgálva és a tényállás tisztázását követően meghozza a döntését.

**Az eljárás megindításához jogosultak köre:**
- Vasúti társaság
- Munkáltató

**Illetékes hatóság:**
- Építési és Közlekedési Minisztérium - ÉKM / Vasúti Hatósági Főosztály (VHF)

### 1.2 Alapfogalmak

#### Használati eset (Use Case)
Egy ügytípushoz sorolható ügy végrehajtását leíró eljárás/folyamat leírónézete. Egy ügytípus használati esete több egymással összefüggésben álló részfolyamatból áll.

#### Használati eset lépés (UCE)
Egy ügytípushoz sorolható ügy végrehajtását leíró folyamaton belül meghatározott tevékenység. A táblázatokban UCE rövidítéssel jelöljük.

#### Részfolyamat kategóriák
- **Fő szakmai folyamat:** kérelem benyújtása, formai és tartalmi vizsgálata, döntéshozatal
- **Szakmai alfolyamat:** hiánypótlás, tényállás tisztázás
- **Iratkezelés alfolyamat:** érkeztetés, iktatás

---

## 2. MUNKAFOLYAMAT ÁTTEKINTÉSE

### 2.1 Részfolyamatok és kapcsolataik

A vasúti járművezetők előzetes alkalmassági vizsgálata munkafolyamat a következő részfolyamatokból áll:

```
┌─────────────────────────────────────────────────────────────────┐
│                   MUNKAFOLYAMAT ÁTTEKINTÉS                      │
└─────────────────────────────────────────────────────────────────┘

1. KÉRELEM BENYÚJTÁSA VIHAR RENDSZEREN KERESZTÜL
   ├─ Ügyfél regisztráció
   ├─ Kérelem kitöltése
   ├─ Mellékletek csatolása
   ├─ Kérelem véglegesítése és benyújtása
   └─ Érkeztetés
        │
        ↓
2. KÉRELEM FORMAI ÉS TARTALMI VIZSGÁLATA
   ├─ Hatáskör és illetékesség vizsgálata
   ├─ Formai megfelelőség vizsgálata
   ├─ Tartalmi megfelelőség vizsgálata
   └─ Döntés: sommás eljárás / teljes eljárás
        │
        ├─→ [Ha szükséges] HIÁNYPÓTLÁS
        │
        ├─→ [Ha szükséges] TÉNYÁLLÁS TISZTÁZÁSA
        │
        ↓
3. DÖNTÉSHOZATAL
   ├─ Döntési javaslat elkészítése
   ├─ Határozat/végzés/igazolás tervezet
   ├─ Döntési javaslat véleményeztetése
   ├─ Vezetői jóváhagyás
   ├─ Dokumentum kiadmányozása és iktatása
   └─ Ügy lezárása

TÁMOGATÓ FOLYAMATOK:
• Érkeztetés VIHAR rendszeren keresztül
• Bejövő iktatás
• Kimenő/belső dokumentum elkészítése, kiadmányozása, iktatása, expediálása
```

---

## 3. RÉSZFOLYAMATOK RÉSZLETESEN

### 3.1 RÉSZFOLYAMAT: Kérelem benyújtása VIHAR rendszeren keresztül

**Részfolyamat kategória:** Fő szakmai folyamat  
**Alrendszer:** External (EXT) - Külső  
**Fő szerepkör:** Ügyfél, Képviselő

#### 3.1.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1774** | Ügyfél regisztrációja | Kezdés | Ügyfél, Képviselő | F-0084 | Ügyfél regisztráció |
| **UCE-1773** | Kérelem adatainak kitöltése | Tevékenység | Ügyfél, Képviselő | F-0107 | Kérelem adatlap |
| **UCE-1766** | Érvényesség ellenőrzése | Választó elágazás | - | - | - |
| **UCE-1763** | Kérelem adatainak mentése | Tevékenység | Ügyfél, Képviselő | F-0083 | Kérelem adatok mentése |
| **UCE-1762** | Eljárási díj fizetése szükséges? | Választó elágazás | - | - | - |
| **UCE-1764** | Eljárási díj fizetésének jelölése | Tevékenység | Ügyfél, Képviselő | - | - |
| **UCE-1772** | Mellékletek, igazolások csatolása | Tevékenység | Ügyfél, Képviselő | - | - |
| **UCE-1767** | Ágak egyesítése | Ágak egyesítése (join) | - | - | - |
| **UCE-1761** | Kérelem benyújtható? | Választó elágazás | - | - | - |
| **UCE-1776** | Kérelem véglegesítése, PDF kérelem és VIHAR azonosító generálása | Tevékenység | Ügyfél, Képviselő | F-0085, F-0086 | Kérelem véglegesítése, PDF kérelem generálás |
| **UCE-1771** | Kérelem benyújtása | Tevékenység | Ügyfél, Képviselő | F-0087 | Kérelem benyújtása |
| **UCE-1770** | SM-0027 Vasút - Érkeztetés VIHAR rendszeren keresztül: UC-0302 | Használati eset - indítás | Rendszer | - | - |
| **UCE-1768** | Érkeztetés sikeres? | Választó elágazás | - | - | - |
| **UCE-1769** | EKEIDR manuális iktatás végrehajtása: előzményezés, szignálás, iktatás | Tevékenység | VHF Ügyintéző | - | - |
| **UCE-1777** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |
| **UCE-1760** | EKEIDR iktatási adatok lekérése | Tevékenység | VHF Ügyintéző | F-0081 | Bejövő EKEIDR iktatási adatok lekérése (interfész) |
| **UCE-1775** | SM-0027 Vasút - Kérelem formai és tartalmi vizsgálata: UC-0303 | Használati eset - indítás | VHF Ügyintéző | - | - |

#### 3.1.2 Döntési pontok

**Döntési pont 1: Érvényesség ellenőrzése (UCE-1766)**
- "érvényes" ág → Kérelem adatainak mentése (UCE-1763)
- "érvénytelen adatok" ág → Kérelem adatainak kitöltése (UCE-1773)

**Döntési pont 2: Eljárási díj fizetése szükséges? (UCE-1762)**
- "igen" ág → Eljárási díj fizetésének jelölése (UCE-1764)
- "nem" ág → Ágak egyesítése (UCE-1767)

**Döntési pont 3: Kérelem benyújtható? (UCE-1761)**
- "kérelem benyújtható" ág → Kérelem véglegesítése (UCE-1776)
- "nincs benyújtható kérelem" ág → Kérelem adatainak kitöltése (UCE-1773)

**Döntési pont 4: Érkeztetés sikeres? (UCE-1768)**
- "igen, sikeres érkeztetés" ág → EKEIDR manuális iktatás (UCE-1769)
- "nem, ismételt benyújtás szükséges" ág → Kérelem benyújtása (UCE-1771)

#### 3.1.3 Kapcsolódó dokumentumok

**Bemenet:**
- Kérelem adatlap vasútegészségügyi vizsgálathoz

**Kimenet (Export):**
- Kérelem adatlap vasútegészségügyi vizsgálathoz (PDF)

---

### 3.2 RÉSZFOLYAMAT: Érkeztetés VIHAR rendszeren keresztül

**Részfolyamat kategória:** Iratkezelés alfolyamat  
**Alrendszer:** Internal (INT) - Belső  
**Fő szerepkör:** Rendszer (automatikus)

#### 3.2.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1784** | Érkeztetés szükséges | Kezdés | Rendszer | - | - |
| **UCE-1778** | EKEIDR érkeztetéshez szükséges adatok átadása | Tevékenység | Rendszer | F-0078 | VIHAR érkeztetés (interfész) |
| **UCE-1779** | EKEIDR érkeztetés sikeres? | Választó elágazás | - | - | - |
| **UCE-1782** | Érkeztető szám fogadása | Tevékenység | Rendszer | F-0078 | VIHAR érkeztetés (interfész) |
| **UCE-1783** | Sikertelen érkeztetés visszajelzés feldolgozása | Tevékenység | Rendszer | F-0078 | VIHAR érkeztetés (interfész) |
| **UCE-1781** | Újraküldés lehetséges (limiter)? | Választó elágazás | - | - | - |
| **UCE-1780** | Visszatérés az indító folyamatba | Használati eset - visszatérés | - | - | - |

#### 3.2.2 Döntési pontok

**Döntési pont 1: EKEIDR érkeztetés sikeres? (UCE-1779)**
- "igen, érkeztetett küldemény" ág → Érkeztető szám fogadása (UCE-1782)
- "nem" ág → Sikertelen érkeztetés visszajelzés feldolgozása (UCE-1783)

**Döntési pont 2: Újraküldés lehetséges? (UCE-1781)**
- "igen" ág → EKEIDR érkeztetéshez szükséges adatok átadása (UCE-1778) - újrapróbálás
- "nem, sikertelen érkeztetés" ág → Visszatérés az indító folyamatba (UCE-1780)

---

### 3.3 RÉSZFOLYAMAT: Kérelem formai és tartalmi vizsgálata

**Részfolyamat kategória:** Fő szakmai folyamat  
**Alrendszer:** Internal (INT) - Belső  
**Fő szerepkör:** VHF Ügyintéző

#### 3.3.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1790** | Iktatott kérelem, vizsgálat szükséges | Kezdés | - | - | - |
| **UCE-1793** | Hatáskör és illetékesség vizsgálata | Tevékenység | VHF Ügyintéző | F-0064, F-0088 | Hatáskör és illetékesség vizsgálat, Döntés-előkészítés döntés |
| **UCE-1789** | Hatáskör és illetékesség biztosított? | Választó elágazás | - | - | - |
| **UCE-1792** | Annak vizsgálata, hogy van-e hatáskörrel és illetékességgel rendelkező hatóság | Tevékenység | VHF Ügyintéző | F-0064, F-0088 | Hatáskör és illetékesség vizsgálat, Döntés-előkészítés döntés |
| **UCE-1791** | Van más, hatáskörrel és illetékességgel rendelkező hatóság? | Választó elágazás | - | - | - |
| **UCE-1796** | SM-0027 Vasút - Döntéshozatal: UC-0304 (elutasító végzés) | Használati eset - indítás | VHF Ügyintéző | - | - |
| **UCE-1797** | SM-0027 Vasút - Döntéshozatal: UC-0304 (áttételi végzés) | Használati eset - indítás | VHF Ügyintéző | - | - |
| **UCE-1798** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |
| **UCE-1799** | Formai megfelelőség vizsgálata | Tevékenység | VHF Ügyintéző | F-0065, F-0088 | Formai megfelelőség vizsgálata, Döntés-előkészítés döntés |
| **UCE-1794** | Tartalmi megfelelőség vizsgálata | Tevékenység | VHF Ügyintéző | F-0090, F-0066, F-0088 | VNY024 Vasútegészségügyi adatok, Tartalmi megfelelőség vizsgálat, Döntés-előkészítés döntés |
| **UCE-1795** | Ágak egyesítése | Ágak egyesítése (join) | - | - | - |
| **UCE-1800** | Sommás eljárás alkalmazható? | Választó elágazás | - | - | - |
| **UCE-1788** | Ügyfél értesítés összeállítása a sommás eljárás indításáról | Tevékenység | VHF Ügyintéző | F-0089 | Döntés-előkészítés: ügyfél értesítés |
| **UCE-1802** | SM-0027 Vasút - Kimenő, vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása: UC-0305 | Használati eset - indítás | VHF Ügyintéző, VHF Döntéshozó | - | - |
| **UCE-1787** | Jóváhagyott értesítő dokumentum? | Választó elágazás | - | - | - |
| **UCE-1801** | SM-0027 Vasút - Döntéshozatal: UC-0304 | Használati eset - indítás | VHF Ügyintéző | - | - |
| **UCE-1803** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |
| **UCE-1805** | SM-0027 Vasút - Tényállás tisztázása: UC-0306 | Használati eset - indítás | VHF Ügyintéző | - | - |
| **UCE-1806** | SM-0027 Vasút - Hiánypótlás VIHAR rendszeren keresztül: UC-0307 | Használati eset - indítás | VHF Ügyintéző | - | - |
| **UCE-1785** | Ügyfél értesítés összeállítása az ügyindításról | Tevékenység | VHF Ügyintéző | F-0089 | Döntés-előkészítés: ügyfél értesítés |
| **UCE-1804** | SM-0027 Vasút - Kimenő, vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása: UC-0305 | Használati eset - indítás | VHF Ügyintéző, VHF Döntéshozó | - | - |
| **UCE-1786** | Jóváhagyott értesítő dokumentum? | Választó elágazás | - | - | - |
| **UCE-1807** | Ágak egyesítése | Ágak egyesítése (join) | - | - | - |

#### 3.3.2 Döntési pontok

**Döntési pont 1: Hatáskör és illetékesség biztosított? (UCE-1789)**
- "igen" ág → Párhuzamos elágazás: formai és tartalmi vizsgálat (UCE-1798)
- "nem" ág → Annak vizsgálata, hogy van-e más hatóság (UCE-1792)

**Döntési pont 2: Van más, hatáskörrel rendelkező hatóság? (UCE-1791)**
- "igen, áttételi végzés és ügyfélértesítő levél összeállítása szükséges" ág → Döntéshozatal (UCE-1797)
- "nem, elutasító végzés összeállítása szükséges" ág → Döntéshozatal (UCE-1796)

**Döntési pont 3: Sommás eljárás alkalmazható? (UCE-1800)**
- "igen, ügyfél értesítése szükséges sommás eljárás indításáról" ág → Ügyfél értesítés (UCE-1788)
- "nem" ág → Párhuzamos elágazás (UCE-1803) - tényállás tisztázása, hiánypótlás, ügyfél értesítés

**Döntési pont 4: Jóváhagyott értesítő dokumentum? (UCE-1787 és UCE-1786)**
- "igen" ág → Folytatás
- "nem" ág → Ügyfél értesítés összeállítása újra

#### 3.3.3 Kapcsolódó dokumentumok

**Kimenet:**
- Formai ellenőrzési lista
- Végzés: Áttételi végzés
- Ügyfélértesítő: Áttétel más hatósághoz
- Ügyfél értesítés sommás eljárás indításáról
- Ügyfél értesítés teljes eljárásra vonatkozó ügyindításról

---

### 3.4 RÉSZFOLYAMAT: Hiánypótlás VIHAR rendszeren keresztül

**Részfolyamat kategória:** Szakmai alfolyamat  
**Alrendszer:** External (EXT) és Internal (INT)  
**Fő szerepkörök:** VHF Ügyintéző, Ügyfél/Képviselő

#### 3.4.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1870** | Hiánypótlás szükséges | Kezdés | - | - | - |
| **UCE-1871** | Hiánypótlási felszólítás tartalmának összeállítása | Tevékenység | VHF Ügyintéző | F-0100, F-0072 | Hiánypótlási felszólítás összeállítása, Hiánypótlás |
| **UCE-1879** | SM-0027 Vasút - Kimenő, vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása: UC-0305 | Használati eset - indítás | VHF Ügyintéző, VHF Döntéshozó | - | - |
| **UCE-1881** | Jóváhagyott hiánypótlási felszólítás? | Választó elágazás | - | - | - |
| **UCE-1876** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |
| **UCE-1872** | Hiánypótlási határidő letelt? | Választó elágazás | - | - | - |
| **UCE-1869** | Hiánypótlás kitöltése, csatolások | Tevékenység | Ügyfél, Képviselő | F-0071 | Hiánypótlás kitöltése |
| **UCE-1873** | Ágak egyesítése | Ágak egyesítése (join) | - | - | - |
| **UCE-1878** | Hiánypótlás benyújtása | Tevékenység | Ügyfél, Képviselő | F-0101 | Hiánypótlás benyújtása |
| **UCE-1877** | SM-0027 Vasút - Érkeztetés VIHAR rendszeren keresztül: UC-0302 | Használati eset - indítás | Rendszer | - | - |
| **UCE-1875** | Érkeztetés sikeres? | Választó elágazás | - | - | - |
| **UCE-1874** | SM-0027 Vasút - VIHAR rendszeren keresztül érkező dokumentumok bejövő iktatása: UC-0308 | Használati eset - indítás | Rendszer, VHF Ügyintéző | - | - |
| **UCE-1880** | Hiánypótlás ellenőrzése, értékelése | Tevékenység | VHF Ügyintéző | F-0072, F-0088 | Hiánypótlás, Döntés-előkészítés döntés |
| **UCE-1882** | Hiánypótlás lezárható? | Választó elágazás | - | - | - |
| **UCE-1883** | Visszatérés az indító folyamatba | Használati eset - visszatérés | - | - | - |

#### 3.4.2 Döntési pontok

**Döntési pont 1: Jóváhagyott hiánypótlási felszólítás? (UCE-1881)**
- "igen" ág → Párhuzamos elágazás (UCE-1876)
- "nem" ág → Hiánypótlási felszólítás tartalmának összeállítása (UCE-1871) - újra

**Döntési pont 2: Hiánypótlási határidő letelt? (UCE-1872)**
- "nem" ág → Ágak egyesítése (UCE-1873)
- "igen" ág → Hiánypótlás ellenőrzése (UCE-1880)

**Döntési pont 3: Érkeztetés sikeres? (UCE-1875)**
- "igen, sikeres érkeztetés" ág → Bejövő iktatás (UCE-1874)
- "nem, ismételt benyújtás szükséges" ág → Hiánypótlás benyújtása (UCE-1878) - újra

**Döntési pont 4: Hiánypótlás lezárható? (UCE-1882)**
- "igen" ág → Visszatérés az indító folyamatba (UCE-1883)
- "nem" ág → Hiánypótlási felszólítás tartalmának összeállítása (UCE-1871) - újabb kör

#### 3.4.3 Kapcsolódó dokumentumok

**Bemenet:**
- Végzés: Hiánypótlási felszólítás

**Kimenet (Export):**
- Végzés: Hiánypótlási felszólítás

---

### 3.5 RÉSZFOLYAMAT: Tényállás tisztázása

**Részfolyamat kategória:** Szakmai alfolyamat  
**Alrendszer:** Internal (INT) és External (EXT)  
**Fő szerepkörök:** VHF Ügyintéző, Külső közreműködők

#### 3.5.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1854** | Tényállás tisztázás szükséges | Kezdés | - | - | - |
| **UCE-1855** | Tényállás tisztázásához szükséges cselekmények meghatározása | Tevékenység | VHF Ügyintéző | F-0102 | Tényállás tisztázása: Rugalmas workflow |
| **UCE-1852** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |

**Tényállás tisztázó cselekmények (párhuzamosan végrehajtható):**

| UCE Kód | Cselekmény | Végrehajtó | Funkció |
|---------|------------|------------|---------|
| **UCE-1860** | Megkeresés eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző | F-0102 |
| **UCE-1851** | Szakhatósági állásfoglalás kérés eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Társhatóság | F-0102 |
| **UCE-1858** | Ügyfél nyilatkozattétel eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Ügyfél/Képviselő | F-0102 |
| **UCE-1853** | Tanú meghallgatás eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Külső Közreműködő | F-0102 |
| **UCE-1857** | Szemle lefolytatás eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző | F-0102 |
| **UCE-1861** | Irat bemutatás eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Ügyfél/Képviselő | F-0102 |
| **UCE-1859** | Szakértői vélemény bekérés eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Külső Közreműködő | F-0102 |
| **UCE-1862** | Tárgyalás összehívás eljárásrendi cselekményeinek végrehajtása | VHF Ügyintéző, Külső Közreműködő | F-0102 |
| **UCE-1856** | Egyedi eljárási cselekmény végrehajtása | VHF Ügyintéző, Külső Közreműködő | F-0102 |

**További lépések:**

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód |
|---------|-------------------|--------------|---------------------|-------------|
| **UCE-1842** | Tényállás tisztázásához szükséges dokumentum(ok) összeállítása | Tevékenység | VHF Ügyintéző | F-0102 |
| **UCE-1841** | SM-0027 Vasút - Kimenő, vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása: UC-0305 | Használati eset - indítás | VHF Ügyintéző, VHF Döntéshozó | - |
| **UCE-1843** | Jóváhagyott dokumentum(ok)? | Választó elágazás | - | - |
| **UCE-1865** | SM-0027 Vasút - EKEIDR: manuális érkeztetés, előzményezés, szignálás, iktatás (nem VIHAR rendszeren keresztül érkező dokumentumok) | Tevékenység | VHF Ügyintéző | - |
| **UCE-1849** | Tényállás tisztázásához szükséges dokumentumok csatolása | Tevékenység | Ügyfél, Képviselő | F-0103 |
| **UCE-1845** | Tényállás tisztázásához szükséges dokumentumok benyújtása | Tevékenység | Ügyfél, Képviselő | F-0104 |
| **UCE-1850** | SM-0027 Vasút - Érkeztetés VIHAR rendszeren keresztül: UC-0302 | Használati eset - indítás | Rendszer | - |
| **UCE-1848** | Érkeztetés sikeres? | Választó elágazás | - | - |
| **UCE-1847** | SM-0027 Vasút - VIHAR rendszeren keresztül érkező dokumentumok bejövő iktatása: UC-0308 | Használati eset - indítás | Rendszer, VHF Ügyintéző | - |
| **UCE-1844** | EKEIDR iktatási adatok lekérése | Tevékenység | VHF Ügyintéző | F-0081 |
| **UCE-1866** | Ágak egyesítése | Ágak egyesítése (join) | - | - |
| **UCE-1846** | Tényállás tisztázás összegzése, további eljárási cselekmény szükségességének vizsgálata | Tevékenység | VHF Ügyintéző | F-0102, F-0088 |
| **UCE-1863** | Szükség van további tényállás tisztázó eljárási cselekményre? | Választó elágazás | - | - |
| **UCE-1864** | Visszatérés az indító folyamatba | Használati eset - visszatérés | - | - |

#### 3.5.2 Döntési pontok

**Döntési pont 1: Jóváhagyott dokumentum(ok)? (UCE-1843)**
- "igen" ág → Folytatás
- "nem" ág → Tényállás tisztázásához szükséges dokumentum(ok) összeállítása (UCE-1842) - újra

**Döntési pont 2: Érkeztetés sikeres? (UCE-1848)**
- "igen, sikeres érkeztetés" ág → Bejövő iktatás (UCE-1847)
- "nem, ismételt benyújtás szükséges" ág → Benyújtás újra (UCE-1845)

**Döntési pont 3: Szükség van további tényállás tisztázó eljárási cselekményre? (UCE-1863)**
- "igen" ág → Tényállás tisztázásához szükséges cselekmények meghatározása (UCE-1855) - újabb kör
- "nem" ág → Visszatérés az indító folyamatba (UCE-1864)

#### 3.5.3 Kapcsolódó dokumentumok

**Kimenet:**
- Végzés: Felhívás nyilatkozattételre (tényállás tisztázása)
- Jegyzőkönyv (tényállás tisztázása)
- Nyilatkozat (tényállás tisztázása)
- Szakhatósági állásfoglaláskérés (tényállás tisztázása)
- Felhívás tanú meghallgatásra (tényállás tisztázása)
- Tárgyalási értesítés, idézés (tényállás tisztázása)
- Felhívás iratbemutatásra (tényállás tisztázása)

---

### 3.6 RÉSZFOLYAMAT: Döntéshozatal

**Részfolyamat kategória:** Fő szakmai folyamat  
**Alrendszer:** Internal (INT) - Belső  
**Fő szerepkörök:** VHF Ügyintéző, VHF Döntéshozó

#### 3.6.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1808** | Döntési javaslat szükséges | Kezdés | - | - | - |
| **UCE-1826** | Döntési javaslat elkészítése: javaslat tárgy, indokolás, további feladatok | Tevékenység | VHF Ügyintéző | F-0074 | Érdemi döntés: döntési javaslat |
| **UCE-1827** | Párhuzamos elágazás | Párhuzamos elágazás (fork) | - | - | - |

**Döntési dokumentum tervezetek (párhuzamosan készülhetnek):**

| UCE Kód | Tervezet típusa | Végrehajtó | Funkció kód |
|---------|-----------------|------------|-------------|
| **UCE-1809** | Végzés tervezet elkészítése | VHF Ügyintéző | F-0091 |
| **UCE-1810** | Határozat tervezet elkészítése | VHF Ügyintéző | F-0092 |
| **UCE-1811** | Igazolás tervezet elkészítése | VHF Ügyintéző | F-0093 |
| **UCE-1812** | Tájékoztatás tervezet elkészítése | VHF Ügyintéző | F-0094 |
| **UCE-1813** | Okmány adatok összeállítása, okmány előállításának előkészítése | VHF Ügyintéző | - |
| **UCE-1814** | Hirdetmény tervezet elkészítése | VHF Ügyintéző | F-0095 |
| **UCE-1819** | Ellenőrzött eljárási díjfizetés összevezetése | VHF Ügyintéző | F-0098 |

**További lépések:**

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód |
|---------|-------------------|--------------|---------------------|-------------|
| **UCE-1825** | Ágak egyesítése | Ágak egyesítése (join) | - | - |
| **UCE-1824** | Döntési javaslat és tervezetek véleményeztetése | Tevékenység | VHF Ügyintéző | F-0096 |
| **UCE-1818** | Szükséges módosítás? | Választó elágazás | - | - |
| **UCE-1816** | SM-0027 Vasút - Kimenő, vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása: UC-0305 | Használati eset - indítás | VHF Ügyintéző, VHF Döntéshozó | - |
| **UCE-1815** | Jóváhagyott döntési javaslat? | Választó elágazás | - | - |
| **UCE-1822** | Nyilvántartás frissítése szükséges? | Választó elágazás | - | - |
| **UCE-1829** | Releváns nyilvántartás frissítése | Tevékenység | VHF Ügyintéző | - |
| **UCE-1828** | Ügy lezárása | Tevékenység (Vége: Igen) | VHF Ügyintéző | F-0097 |
| **UCE-1820** | Jóváhagyás elutasításának indoklása | Tevékenység | VHF Döntéshozó | F-0099 |
| **UCE-1821** | Tényállás tisztázása vagy döntési javaslat módosítása? | Választó elágazás | - | - |
| **UCE-1817** | SM-0027 Vasút - Tényállás tisztázása: UC-0306 | Használati eset - indítás | VHF Ügyintéző | - |

#### 3.6.2 Döntési pontok

**Döntési pont 1: Szükséges módosítás? (UCE-1818)**
- "igen, módosítás szükséges" ág → Döntési javaslat elkészítése (UCE-1826) - újra
- "nem, döntési javaslat jóváhagyásra küldhető" ág → Dokumentum elkészítése (UCE-1816)

**Döntési pont 2: Jóváhagyott döntési javaslat? (UCE-1815)**
- "igen, jóváhagyás megtörtént" ág → Nyilvántartás frissítése szükséges? (UCE-1822)
- "nem, nincs jóváhagyás" ág → Jóváhagyás elutasításának indoklása (UCE-1820)

**Döntési pont 3: Nyilvántartás frissítése szükséges? (UCE-1822)**
- "igen" ág → Releváns nyilvántartás frissítése (UCE-1829)
- "nem" ág → Ügy lezárása (UCE-1828)

**Döntési pont 4: Tényállás tisztázása vagy döntési javaslat módosítása? (UCE-1821)**
- "döntési javaslat módosítása szükséges" ág → Döntési javaslat elkészítése (UCE-1826)
- "tényállás tisztázása szükséges" ág → Tényállás tisztázása (UCE-1817)

#### 3.6.3 Kapcsolódó dokumentumok

**Kimenet (Export):**
- Határozat: Eljárást lezáró döntés
- Határozat: Felfüggesztő határozat
- Végzés: Kérelem elutasítása
- Érdemi döntés: Hirdetmény
- Érdemi döntés: Igazolás
- Érdemi döntés: Tájékoztatás

---

### 3.7 RÉSZFOLYAMAT: VIHAR rendszeren keresztül érkező dokumentumok bejövő iktatása

**Részfolyamat kategória:** Iratkezelés alfolyamat  
**Alrendszer:** Internal (INT) - Belső  
**Fő szerepkörök:** Rendszer, VHF Ügyintéző

#### 3.7.1 Használati eset lépések (UCE kódok)

| UCE Kód | Lépés megnevezése | Lépés típusa | Végrehajtó szerepkör | Funkció kód | Funkció megnevezés |
|---------|-------------------|--------------|---------------------|-------------|-------------------|
| **UCE-1752** | VIHAR előzménnyel rendelkező bejövő iktatás szükséges | Kezdés | - | - | - |
| **UCE-1758** | EKEIDR bejövő alszámos iktatáshoz szükséges adatok átadása: irat adatok, előzmény adatok, szignálási adatok | Tevékenység | Rendszer | F-0079 | VIHAR bejövő iktatás (interfész) |
| **UCE-1753** | EKEIDR bejövő alszámos iktatás végrehajtása sikeres? | Választó elágazás | - | - | - |
| **UCE-1751** | Bejövő alszámos iktatószám fogadása | Tevékenység | Rendszer | F-0079 | VIHAR bejövő iktatás (interfész) |
| **UCE-1754** | Sikertelen bejövő alszámos iktatás visszajelzés feldolgozása | Tevékenység | Rendszer | F-0079 | VIHAR bejövő iktatás (interfész) |
| **UCE-1755** | Újraküldés lehetséges (limiter)? | Választó elágazás | - | - | - |
| **UCE-1756** | EKEIDR manuális iktatás végrehajtása: előzményezés, szignálás, iktatás | Tevékenység | VHF Ügyintéző | - | - |
| **UCE-1759** | EKEIDR iktatási adatok lekérése | Tevékenység | VHF Ügyintéző | F-0079 | VIHAR bejövő iktatás (interfész) |
| **UCE-1757** | Visszatérés az indító folyamatba | Használati eset - visszatérés | - | - | - |

#### 3.7.2 Döntési pontok

**Döntési pont 1: EKEIDR bejövő alszámos iktatás végrehajtása sikeres? (UCE-1753)**
- "igen" ág → Bejövő alszámos iktatószám fogadása (UCE-1751)
- "nem" ág → Sikertelen visszajelzés feldolgozása (UCE-1754)

**Döntési pont 2: Újraküldés lehetséges (limiter)? (UCE-1755)**
- "igen" ág → EKEIDR bejövő alszámos iktatáshoz szükséges adatok átadása (UCE-1758) - újrapróbálás
- "nem, manuális iktatás szükséges" ág → EKEIDR manuális iktatás végrehajtása (UCE-1756)

---

### 3.8 RÉSZFOLYAMAT: Kimenő vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása

**Részfolyamat kategória:** Iratkezelés alfolyamat  
**Alrendszer:** Internal (INT) - Belső  
**Fő szerepkörök:** VHF Ügyintéző, VHF Döntéshozó

#### 3.8.1 Használati eset lépések (UCE kódok - példa)

Ez a részfolyamat többször is meghívásra kerül különböző dokumentumok elkészítéséhez. A pontos UCE kódok függnek a hívó folyamattól.

**Általános lépések:**
1. Dokumentum összeállítása paraméterezett sablon alapján
2. Dokumentum véglegesítése
3. Jóváhagyási folyamat (ha szükséges)
4. EKEIDR kimenő/belső iktatáshoz szükséges adatok átadása
5. EKEIDR iktatás végrehajtása
6. Iktatási adatok lekérése
7. Dokumentum expediálása
8. Visszatérés az indító folyamatba

---

## 4. FUNKCIÓKATALÓGUS

### 4.1 Külső (External) funkciók - Ügyfél felület

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0083** | Kérelem adatok mentése | Kitöltés közben lévő kérelem adatok mentése | Kérelem benyújtása VIHAR rendszeren keresztül |
| **F-0084** | Ügyfél regisztráció | Regisztráció / bejelentkezés | Kérelem benyújtása VIHAR rendszeren keresztül |
| **F-0085** | Kérelem véglegesítése | Kitöltött kérelem véglegesítése | Kérelem benyújtása VIHAR rendszeren keresztül |
| **F-0086** | PDF kérelem generálás | Kérelem PDF dokumentum generálása | Kérelem benyújtása VIHAR rendszeren keresztül |
| **F-0087** | Kérelem benyújtása | Végleges kérelem (adatlap, mellékletek) benyújtása | Kérelem benyújtása VIHAR rendszeren keresztül |
| **F-0071** | Hiánypótlás kitöltése | Hiánypótlási felszólításra adott válasz és dokumentumok feltöltése | Hiánypótlás VIHAR rendszeren keresztül |
| **F-0101** | Hiánypótlás benyújtása | Hiánypótlás (adatok, mellékletek) benyújtása | Hiánypótlás VIHAR rendszeren keresztül |
| **F-0103** | Tényállás tisztázási adatok, dokumentumok | Tényállás tisztázásához szükséges dokumentumok csatolása és adatok megadása | Tényállás tisztázása |
| **F-0104** | Tényállás tisztázás benyújtása | Tényállás tisztázásához szükséges dokumentumok benyújtása | Tényállás tisztázása |
| **F-0107** | Kérelem adatlap | Az ügytípushoz tartozó kérelem adatlap megjelenítése és szerkesztése | Kérelem benyújtása VIHAR rendszeren keresztül |

### 4.2 Belső (Internal) funkciók - Ügyintézői felület

#### 4.2.1 Formai és tartalmi vizsgálat funkciók

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0064** | Hatáskör és illetékesség vizsgálat | Hatáskör és illetékesség vizsgálat végrehajtása ügytípusonként ellenőrzési lista segítségével | Kérelem formai és tartalmi vizsgálata |
| **F-0065** | Formai megfelelőség vizsgálata | Formai megfelelőség vizsgálat végrehajtása ügytípusonként ellenőrzési lista segítségével | Kérelem formai és tartalmi vizsgálata |
| **F-0066** | Tartalmi megfelelőség vizsgálat | Tartalmi megfelelőség vizsgálat végrehajtása ügytípusonként ellenőrzési lista segítségével | Kérelem formai és tartalmi vizsgálata |
| **F-0090** | VNY024 Vasútegészségügyi adatok | VNY024 Vasútegészségügyi nyilvántartásból adatok lekérdezése, kezelése | Kérelem formai és tartalmi vizsgálata |

#### 4.2.2 Döntés-előkészítés funkciók

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0088** | Döntés-előkészítés döntés | A döntés-előkészítési munka során történt döntések adatainak rögzítése | Kérelem formai és tartalmi vizsgálata, Hiánypótlás, Tényállás tisztázása |
| **F-0089** | Döntés-előkészítés: ügyfél értesítés | Ügyfél értesítés összeállítása paraméterezett sablon dokumentum felhasználásával | Kérelem formai és tartalmi vizsgálata |

#### 4.2.3 Hiánypótlás funkciók

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0072** | Hiánypótlás | Hiánypótlási felszólítás tartalmának összeállítása és benyújtott hiánypótlás ellenőrzése | Hiánypótlás VIHAR rendszeren keresztül |
| **F-0100** | Hiánypótlási felszólítás összeállítása | Hiánypótlási felszólítás adatainak beemelése az ügytípusonként paraméterezhető sablon dokumentumba | Hiánypótlás VIHAR rendszeren keresztül |

#### 4.2.4 Tényállás tisztázás funkciók

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0102** | Tényállás tisztázása: Rugalmas workflow | Tényállás tisztázásához szükséges cselekmények meghatározása és végrehajtása rugalmas workflow alapján | Tényállás tisztázása |

#### 4.2.5 Döntéshozatal funkciók

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0074** | Érdemi döntés: döntési javaslat | Döntési javaslat adatainak rögzítése | Döntéshozatal |
| **F-0091** | Végzés tervezet elkészítése | Végzés tervezet összeállítása paraméterezett sablon dokumentum felhasználásával | Döntéshozatal |
| **F-0092** | Határozat tervezet elkészítése | Határozat tervezet összeállítása paraméterezett sablon dokumentum felhasználásával | Döntéshozatal |
| **F-0093** | Igazolás tervezet elkészítése | Igazolás tervezet összeállítása paraméterezett sablon dokumentum felhasználásával | Döntéshozatal |
| **F-0094** | Tájékoztatás tervezet elkészítése | Tájékoztatás tervezet összeállítása paraméterezett sablon dokumentum felhasználásával | Döntéshozatal |
| **F-0095** | Hirdetmény tervezet elkészítése | Hirdetmény tervezet összeállítása paraméterezett sablon dokumentum felhasználásával | Döntéshozatal |
| **F-0096** | Érdemi döntés: döntési javaslat és tervezetek véleményeztetése | Döntési javaslat és dokumentum tervezetek véleményeztetésének kezelése | Döntéshozatal |
| **F-0097** | Ügy lezárása | Annak jelölése, rögzítése, hogy az ügy lezárásra kerül | Döntéshozatal |
| **F-0098** | FORRÁS SQL interfész | FORRÁS SQL adatok lekérdezése alapján az eljárási díjfizetés adatok ellenőrzése | Döntéshozatal |
| **F-0099** | Érdemi döntés: vezetői döntés | Vezetői döntés kezelése: jóváhagyás vagy elutasítás indoklása | Döntéshozatal |

#### 4.2.6 Iratkezelési funkciók (interfészek)

| Funkció kód | Funkció név | Funkció leírás | Támogatott részfolyamat |
|-------------|-------------|----------------|------------------------|
| **F-0078** | VIHAR érkeztetés (interfész) | EKEIDR érkeztetés interfész kezelése | Érkeztetés VIHAR rendszeren keresztül |
| **F-0079** | VIHAR bejövő iktatás (interfész) | EKEIDR bejövő iktatás interfész kezelése | VIHAR rendszeren keresztül érkező dokumentumok bejövő iktatása |
| **F-0081** | Bejövő EKEIDR iktatási adatok lekérése (interfész) | EKEIDR iktatási adatok lekérdezése interfészen keresztül | Kérelem benyújtása, Tényállás tisztázása |

---

## 5. DOKUMENTUMOK

### 5.1 Kérelem dokumentumok

| Dokumentum kód | Dokumentum név | Használat irány | Csatorna | Export formátum |
|---------------|----------------|-----------------|----------|----------------|
| **DC-XXXX** | Kérelem adatlap vasútegészségügyi vizsgálathoz | Bemenet/Kimenet | Rendszer EXTERNAL felület | PDF |

### 5.2 Hatósági végzések

| Dokumentum név | Használat irány | Export formátum |
|---------------|-----------------|----------------|
| Végzés: Áttételi végzés | Kimenet - Export | PDF |
| Végzés: Hiánypótlási felszólítás | Kimenet - Export | PDF |
| Végzés: Felhívás nyilatkozattételre (tényállás tisztázása) | Kimenet - Export | PDF |
| Végzés: Kérelem elutasítása | Kimenet - Export | PDF |

### 5.3 Határozatok

| Dokumentum név | Használat irány | Export formátum |
|---------------|-----------------|----------------|
| Határozat: Eljárást lezáró döntés | Kimenet - Export | PDF |
| Határozat: Felfüggesztő határozat | Kimenet - Export | PDF |

### 5.4 Értesítések

| Dokumentum név | Használat irány | Export formátum |
|---------------|-----------------|----------------|
| Ügyfélértesítő: Áttétel más hatósághoz | Kimenet - Export | PDF |
| Ügyfél értesítés sommás eljárás indításáról | Kimenet - Export | PDF |
| Ügyfél értesítés teljes eljárásra vonatkozó ügyindításról | Kimenet - Export | PDF |

### 5.5 Tényállás tisztázási dokumentumok

| Dokumentum név | Használat irány | Export formátum |
|---------------|-----------------|----------------|
| Szakhatósági állásfoglaláskérés (tényállás tisztázása) | Kimenet - Export | PDF |
| Felhívás tanú meghallgatásra (tényállás tisztázása) | Kimenet - Export | PDF |
| Tárgyalási értesítés, idézés (tényállás tisztázása) | Kimenet - Export | PDF |
| Felhívás iratbemutatásra (tényállás tisztázása) | Kimenet - Export | PDF |
| Jegyzőkönyv (tényállás tisztázása) | Kimenet - Export | PDF |
| Nyilatkozat (tényállás tisztázása) | Kimenet | PDF |

### 5.6 Érdemi döntések

| Dokumentum név | Használat irány | Export formátum |
|---------------|-----------------|----------------|
| Érdemi döntés: Hirdetmény | Kimenet - Export | PDF |
| Érdemi döntés: Igazolás | Kimenet - Export | PDF |
| Érdemi döntés: Tájékoztatás | Kimenet - Export | PDF |

### 5.7 Belső dokumentumok

| Dokumentum név | Használat cél |
|---------------|---------------|
| Formai ellenőrzési lista | Szervezeten belüli használat |

---

## 6. SZEREPKÖRÖK

### 6.1 Külső szerepkörök (External alrendszer)

#### 6.1.1 Ügyfél, Képviselő

**Szervezet:** Külső - természetes vagy jogi személy

**Főbb feladatok:**
- Kérelem benyújtása VIHAR rendszeren keresztül
- Kérelem adatainak kitöltése
- Mellékletek csatolása
- Hiánypótlás teljesítése
- Tényállás tisztázásához szükséges dokumentumok benyújtása
- Nyilatkozattétel

**Használt funkciók:**
- F-0083 (Kérelem adatok mentése)
- F-0084 (Ügyfél regisztráció)
- F-0085 (Kérelem véglegesítése)
- F-0087 (Kérelem benyújtása)
- F-0071 (Hiánypótlás kitöltése)
- F-0101 (Hiánypótlás benyújtása)
- F-0103 (Tényállás tisztázási adatok, dokumentumok)
- F-0104 (Tényállás tisztázás benyújtása)
- F-0107 (Kérelem adatlap)

#### 6.1.2 Társhatóság

**Szervezet:** Külső - másik hatóság

**Főbb feladatok:**
- Szakhatósági állásfoglalás adása

**Szerepkör típus:** Közreműködés

#### 6.1.3 Külső Közreműködő

**Szervezet:** Külső

**Főbb feladatok:**
- Tanúskodás
- Szakértői vélemény adása
- Tárgyaláson való részvétel

**Szerepkör típus:** Közreműködés

### 6.2 Belső szerepkörök (Internal alrendszer)

#### 6.2.1 VHF Ügyintéző

**Szervezet:** Építési és Közlekedési Minisztérium - ÉKM / Vasúti Hatósági Főosztály (VHF)

**Főbb feladatok:**
- Kérelem formai és tartalmi vizsgálata
- Hatáskör és illetékesség vizsgálata
- Hiánypótlási felszólítás összeállítása
- Tényállás tisztázás vezetése
- Döntési javaslat elkészítése
- Dokumentum tervezetek elkészítése
- Nyilvántartás frissítése
- Ügy lezárása
- Manuális iktatási feladatok

**Használt funkciók:**
- F-0064 (Hatáskör és illetékesség vizsgálat)
- F-0065 (Formai megfelelőség vizsgálata)
- F-0066 (Tartalmi megfelelőség vizsgálat)
- F-0072 (Hiánypótlás)
- F-0074 (Érdemi döntés: döntési javaslat)
- F-0081 (Bejövő EKEIDR iktatási adatok lekérése)
- F-0088 (Döntés-előkészítés döntés)
- F-0089 (Döntés-előkészítés: ügyfél értesítés)
- F-0090 (VNY024 Vasútegészségügyi adatok)
- F-0091 (Végzés tervezet elkészítése)
- F-0092 (Határozat tervezet elkészítése)
- F-0093 (Igazolás tervezet elkészítése)
- F-0094 (Tájékoztatás tervezet elkészítése)
- F-0095 (Hirdetmény tervezet elkészítése)
- F-0096 (Érdemi döntés: döntési javaslat és tervezetek véleményeztetése)
- F-0097 (Ügy lezárása)
- F-0098 (FORRÁS SQL interfész)
- F-0100 (Hiánypótlási felszólítás összeállítása)
- F-0102 (Tényállás tisztázása: Rugalmas workflow)

**Szerepkör típus:** Végrehajtás

#### 6.2.2 VHF Döntéshozó

**Szervezet:** Építési és Közlekedési Minisztérium - ÉKM / Vasúti Hatósági Főosztály (VHF)

**Főbb feladatok:**
- Dokumentumok jóváhagyása
- Döntési javaslat jóváhagyása vagy elutasítása
- Vezetői döntés meghozatala

**Használt funkciók:**
- F-0099 (Érdemi döntés: vezetői döntés)

**Szerepkör típus:** Döntés

#### 6.2.3 Rendszer

**Szervezet:** Belső - VIHAR Rendszer

**Főbb feladatok:**
- Automatikus érkeztetés
- Automatikus iktatás (EKEIDR interfész)
- Adatok átadása EKEIDR felé
- Iktatási adatok fogadása

**Használt funkciók:**
- F-0078 (VIHAR érkeztetés - interfész)
- F-0079 (VIHAR bejövő iktatás - interfész)
- F-0081 (Bejövő EKEIDR iktatási adatok lekérése - interfész)

**Megjegyzés:** A Rendszer szerepkörként való feltüntetése transzparensen megmutatja, hogy a Rendszer milyen esetben hajt végre saját műveletet. Ez segít tisztán jelezni, hogy mi az a feladat, amit a felhasználónak kell elindítania, és mi az, amit a Rendszer önállóan végez.

---

## 7. ADATKÖRÖK

### 7.1 Kérelem adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0080** | Kérelem adatok | Kérelem benyújtás, vizsgálatok, döntéshozatal |
| **DS-0097** | Kérelem mellékletek | Kérelem benyújtás, formai és tartalmi vizsgálat |
| **DS-0092** | Ügyfél (kérelmező) adatok | Ügyfél értesítések |

### 7.2 Döntési adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0085** | Kérelem döntési adatai | Döntés-előkészítés, döntéshozatal |
| **DS-0104** | Hatáskör és illetékesség vizsgálat: ellenőrzési lista | Hatáskör vizsgálat |
| **DS-0106** | Hatáskör és illetékesség vizsgálat: ellenőrzési lista paraméterek | Hatáskör vizsgálat |
| **DS-0081** | Formai megfelelőségi vizsgálat: ellenőrzési lista | Formai vizsgálat |
| **DS-0107** | Formai megfelelőségi vizsgálat: ellenőrzési lista paraméterek | Formai vizsgálat |
| **DS-0091** | Tartalmi megfelelőség vizsgálat: ellenőrzési lista | Tartalmi vizsgálat |
| **DS-0108** | Tartalmi megfelelőség vizsgálat: ellenőrzési lista paraméterek | Tartalmi vizsgálat |

### 7.3 Hiánypótlás adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0093** | Hiánypótlási felszólítás adatok | Hiánypótlási felszólítás összeállítása, értesítés |
| **DS-0103** | Kérelem hiánypótlás adatok | Hiánypótlás benyújtása, ellenőrzése |

### 7.4 Tényállás tisztázás adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0113** | Tényállás tisztázása rugalmas WF adatok | Tényállás tisztázási cselekmények végrehajtása |
| **DS-0115** | Kérelem tényállás tisztázás adatok | Tényállás tisztázási dokumentumok kezelése |

### 7.5 Iratkezelési adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0090** | VIHAR érkeztetési adatok | Érkeztetés |
| **DS-0102** | EKEIDR érkeztetési adatok | Érkeztetés EKEIDR interfész |
| **DS-0086** | EKEIDR bejövő iktatási adatok | Bejövő iktatás |
| **DS-0089** | Adatok EKEIDR bejövő alszámos iktatáshoz | Bejövő alszámos iktatás |
| **DS-0114** | VIHAR adatok bejövő EKEIDR iktatási adatok lekéréséhez | Iktatási adatok lekérése |
| **DS-0087** | Adatok EKEIDR kimenő/belső iktatáshoz, expediáláshoz | Kimenő/belső dokumentumok iktatása |
| **DS-0094** | EKEIDR kimenő/belső iktatási adatok | Kimenő/belső iktatás |

### 7.6 Nyilvántartás adatok

| Adatkör kód | Adatkör megnevezés | Használat |
|-------------|-------------------|-----------|
| **DS-0096** | VNY024 Vasútegészségügyi adatok | Tartalmi megfelelőség vizsgálat |
| **DS-0119** | VEÜ adatbázis | Vasútegészségügyi Engedéllyel kapcsolatos adatok |
| **DS-0111** | FORRÁS SQL lekérdezés adatok | Eljárási díjfizetés ellenőrzése |
| **DS-0112** | FORRÁS SQL válasz adatok | Eljárási díjfizetés ellenőrzése |

---

## 8. KÜLSŐ RENDSZEREK ÉS INTERFÉSZEK

### 8.1 EKEIDR rendszer

**Rendszer típus:** Külső Rendszer interfésszel

**Funkciók:**
- Érkeztetés
- Bejövő iktatás (alszámos iktatás előzménnyel)
- Kimenő/belső iktatás
- Expediálás

**Interfész funkciók:**
- F-0078 (VIHAR érkeztetés)
- F-0079 (VIHAR bejövő iktatás)
- F-0081 (Bejövő EKEIDR iktatási adatok lekérése)

**Megjegyzések:**
- A VIHAR rendszer automatikusan kommunikál az EKEIDR rendszerrel
- Sikertelen iktatás esetén újraküldési mechanizmus (limiter)
- Sikertelen automatikus iktatás esetén manuális iktatás szükséges

### 8.2 VNY024 Vasútegészségügyi nyilvántartás

**Rendszer típus:** Rendszer-Nyilvántartás Belső Rendszerben funkcióval

**Funkció:**
- F-0090 (VNY024 Vasútegészségügyi adatok)

**Használat:**
- Tartalmi megfelelőség vizsgálat során
- Vasúti járművezető előzetes egészségi alkalmassági adatok ellenőrzése

### 8.3 FORRÁS SQL

**Rendszer típus:** Külső Rendszer interfésszel

**Funkció:**
- F-0098 (FORRÁS SQL interfész)

**Használat:**
- Eljárási díjfizetés ellenőrzése
- Díjfizetési adatok lekérdezése

---

## 9. ÖSSZEFOGLALÓ TÁBLÁZATOK

### 9.1 Részfolyamatok összefoglalása

| Részfolyamat neve | Kategória | UCE kódok száma | Fő szerepkör |
|-------------------|-----------|-----------------|-------------|
| Kérelem benyújtása VIHAR rendszeren keresztül | Fő szakmai folyamat | 17 | Ügyfél, Képviselő |
| Érkeztetés VIHAR rendszeren keresztül | Iratkezelés alfolyamat | 7 | Rendszer |
| Kérelem formai és tartalmi vizsgálata | Fő szakmai folyamat | 21 | VHF Ügyintéző |
| Hiánypótlás VIHAR rendszeren keresztül | Szakmai alfolyamat | 13 | VHF Ügyintéző, Ügyfél |
| Tényállás tisztázása | Szakmai alfolyamat | 26+ | VHF Ügyintéző |
| Döntéshozatal | Fő szakmai folyamat | 19 | VHF Ügyintéző, VHF Döntéshozó |
| VIHAR rendszeren keresztül érkező dokumentumok bejövő iktatása | Iratkezelés alfolyamat | 9 | Rendszer, VHF Ügyintéző |
| Kimenő vagy belső dokumentum(ok) elkészítése, kiadmányozása, iktatása, expediálása | Iratkezelés alfolyamat | Változó | VHF Ügyintéző, VHF Döntéshozó |

### 9.2 Funkciók típus szerint

| Funkció típus | Darabszám | Példák |
|---------------|-----------|--------|
| Külső (External) funkciók | 10 | F-0083, F-0084, F-0085, F-0087, F-0071, F-0101 |
| Belső vizsgálati funkciók | 4 | F-0064, F-0065, F-0066, F-0090 |
| Döntés-előkészítés funkciók | 2 | F-0088, F-0089 |
| Hiánypótlás funkciók | 2 | F-0072, F-0100 |
| Tényállás tisztázás funkciók | 1 | F-0102 |
| Döntéshozatal funkciók | 9 | F-0074, F-0091-F-0099 |
| Iratkezelési interfész funkciók | 3 | F-0078, F-0079, F-0081 |
| Egyéb | 1 | F-0107 |

### 9.3 Dokumentumok típus szerint

| Dokumentum típus | Darabszám |
|------------------|-----------|
| Kérelem dokumentumok | 1 |
| Végzések | 4 |
| Határozatok | 2 |
| Értesítések | 3 |
| Tényállás tisztázási dokumentumok | 6 |
| Érdemi döntések | 3 |
| Belső dokumentumok | 1 |

---

## 10. WORKFLOW DIAGRAMOK SZÖVEGES LEÍRÁSA

### 10.1 Kérelem benyújtása workflow

```
START (UCE-1774: Ügyfél regisztrációja)
  ↓
UCE-1773: Kérelem adatainak kitöltése
  ↓
UCE-1766: Érvényesség ellenőrzése?
  ├─ ÉRVÉNYES → UCE-1763: Kérelem adatainak mentése
  └─ ÉRVÉNYTELEN → Vissza UCE-1773-hoz
       ↓
UCE-1762: Eljárási díj fizetése szükséges?
  ├─ IGEN → UCE-1764: Eljárási díj fizetésének jelölése
  └─ NEM → UCE-1767: Ágak egyesítése
       ↓
UCE-1777: Párhuzamos elágazás
  ├─ Ág 1: UCE-1772: Mellékletek csatolása
  └─ Ág 2: (folytatás)
       ↓
UCE-1767: Ágak egyesítése
  ↓
UCE-1761: Kérelem benyújtható?
  ├─ IGEN → UCE-1776: Kérelem véglegesítése
  └─ NEM → Vissza UCE-1773-hoz
       ↓
UCE-1771: Kérelem benyújtása
  ↓
UCE-1770: Érkeztetés (alfolyamat hívás)
  ↓
UCE-1768: Érkeztetés sikeres?
  ├─ IGEN → UCE-1769: EKEIDR manuális iktatás
  └─ NEM → Vissza UCE-1771-hez
       ↓
UCE-1777: Párhuzamos elágazás
  ├─ Ág 1: UCE-1762: Eljárási díj ellenőrzés
  └─ Ág 2: (folytatás)
       ↓
UCE-1760: EKEIDR iktatási adatok lekérése
  ↓
UCE-1775: Kérelem formai és tartalmi vizsgálata (alfolyamat hívás)
  ↓
END
```

### 10.2 Formai és tartalmi vizsgálat workflow

```
START (UCE-1790: Iktatott kérelem, vizsgálat szükséges)
  ↓
UCE-1793: Hatáskör és illetékesség vizsgálata
  ↓
UCE-1789: Hatáskör és illetékesség biztosított?
  ├─ IGEN → UCE-1798: Párhuzamos elágazás
  │           ├─ Ág 1: UCE-1799: Formai megfelelőség vizsgálata
  │           └─ Ág 2: UCE-1794: Tartalmi megfelelőség vizsgálata
  │                ↓
  │         UCE-1795: Ágak egyesítése
  │                ↓
  │         UCE-1800: Sommás eljárás alkalmazható?
  │           ├─ IGEN → UCE-1788: Ügyfél értesítés sommás eljárásról
  │           │           ↓
  │           │         UCE-1802: Dokumentum elkészítése (alfolyamat)
  │           │           ↓
  │           │         UCE-1787: Jóváhagyott értesítő?
  │           │           ├─ IGEN → UCE-1801: Döntéshozatal
  │           │           └─ NEM → Vissza UCE-1788-hoz
  │           └─ NEM → UCE-1803: Párhuzamos elágazás
  │                       ├─ Ág 1: UCE-1805: Tényállás tisztázása
  │                       ├─ Ág 2: UCE-1806: Hiánypótlás
  │                       └─ Ág 3: UCE-1785: Ügyfél értesítés ügyindításról
  │                                ↓
  │                         UCE-1804: Dokumentum elkészítése (alfolyamat)
  │                                ↓
  │                         UCE-1786: Jóváhagyott értesítő?
  │                           ├─ IGEN → UCE-1807: Ágak egyesítése
  │                           └─ NEM → Vissza UCE-1785-höz
  │                                ↓
  │                         UCE-1801: Döntéshozatal (alfolyamat)
  └─ NEM → UCE-1792: Van más hatóság?
              ├─ IGEN → UCE-1797: Döntéshozatal (áttételi végzés)
              └─ NEM → UCE-1796: Döntéshozatal (elutasító végzés)
                         ↓
                      END
```

### 10.3 Döntéshozatal workflow

```
START (UCE-1808: Döntési javaslat szükséges)
  ↓
UCE-1826: Döntési javaslat elkészítése
  ↓
UCE-1827: Párhuzamos elágazás
  ├─ Ág 1: UCE-1809: Végzés tervezet
  ├─ Ág 2: UCE-1810: Határozat tervezet
  ├─ Ág 3: UCE-1811: Igazolás tervezet
  ├─ Ág 4: UCE-1812: Tájékoztatás tervezet
  ├─ Ág 5: UCE-1813: Okmány adatok összeállítása
  ├─ Ág 6: UCE-1814: Hirdetmény tervezet
  └─ Ág 7: UCE-1819: Eljárási díjfizetés ellenőrzése
       ↓
UCE-1825: Ágak egyesítése
  ↓
UCE-1824: Döntési javaslat véleményeztetése
  ↓
UCE-1818: Szükséges módosítás?
  ├─ IGEN → Vissza UCE-1826-hoz
  └─ NEM → UCE-1816: Dokumentum elkészítése (alfolyamat)
                ↓
             UCE-1815: Jóváhagyott döntési javaslat?
               ├─ IGEN → UCE-1822: Nyilvántartás frissítése szükséges?
               │           ├─ IGEN → UCE-1829: Nyilvántartás frissítése
               │           └─ NEM → UCE-1828: Ügy lezárása (END)
               └─ NEM → UCE-1820: Jóváhagyás elutasításának indoklása
                          ↓
                        UCE-1821: Tényállás tisztázása vagy módosítás?
                          ├─ TÉNYÁLLÁS TISZTÁZÁS → UCE-1817: Tényállás tisztázása (alfolyamat)
                          └─ MÓDOSÍTÁS → Vissza UCE-1826-hoz
```

---

## DOKUMENTUM VÉGE

**Teljes UCE kódok száma a vasúti modulban:** ~120+  
**Funkciók száma:** 32  
**Részfolyamatok száma:** 8  
**Dokumentumtípusok száma:** 20+

**Megjegyzés:** Ez a dokumentum átfogó áttekintést nyújt a VIHAR vasúti modul használati eseteiről és workflow lépéseiről. A konkrét implementációhoz további technikai specifikációk és adatmodell dokumentációk szükségesek