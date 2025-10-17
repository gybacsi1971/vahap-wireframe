# VAHAP - Vasúti és Hajózási Integrált Hatósági Rendszer

## 📋 Projekt Áttekintés

A **VAHAP** egy magyar kormányzati elektronikus ügykezelő rendszer drótvázmodellje, amely vasúti és hajózási hatósági folyamatokat támogat. A rendszer Bootstrap 5 és Vue.js 3 technológiákkal készült, teljesen magyar nyelvű felhasználói felülettel.

### Ügytípusok

- **V-044**: Vasúti járművezetők előzetes alkalmassági vizsgálata
- **H-052**: Országos közforgalmú kikötő létesítésének engedélyezése

## 🏗️ Projekt Struktúra

```
vihar-system/
├── index.html                 # Főoldal
├── assets/
│   ├── css/
│   │   └── vihar-common.css  # Közös stílusok
│   ├── js/                   # JavaScript fájlok
│   └── images/               # Képek
├── vasut/
│   ├── kulso/               # Ügyfél felület
│   │   └── index.html
│   └── belso/               # Ügyintéző felület
│       └── index.html
└── hajozas/
    ├── kulso/               # Ügyfél felület
    │   └── index.html
    └── belso/               # Ügyintéző felület
        └── index.html
```

## 🚀 Használat

### Böngészőben való megnyitás

1. Nyissa meg az `index.html` fájlt böngészőben
2. Válasszon modult (Vasúti vagy Hajózási)
3. Válassza ki a belépési pontot:
   - **Ügyfél belépés**: Külső rendszer (kérelem benyújtása)
   - **Ügyintéző belépés**: Belső rendszer (kérelem feldolgozása)

### Helyi szerver indítása (opcionális)

```bash
# Python 3
python -m http.server 8000

# Vagy Python 2
python -m SimpleHTTPServer 8000

# Böngészőben nyissa meg:
http://localhost:8000
```

## 📊 Funkciók Modulonként

### Vasúti Modul (V-044)

#### Külső rendszer (Ügyfél):
- **UCE-1761**: Kérelem adatrögzítés megkezdése
- **UCE-1773**: Kérelem adatainak kitöltése (F-0069)
- **UCE-1772**: Mellékletek csatolása (F-0084)
- **UCE-1776**: Kérelem véglegesítése (F-0085, F-0086)
- **UCE-1771**: Kérelem benyújtása (F-0087)
- **F-0070**: Díjkalkulátor
- **F-0082**: Díjbekérő előállítása

#### Belső rendszer (Ügyintéző):
- **UCE-1793**: Hatáskör és illetékesség vizsgálata (F-0064)
- **UCE-1799**: Formai megfelelőség vizsgálata (F-0065)
- **UCE-1794**: Tartalmi megfelelőség vizsgálata (F-0066)
- **F-0090**: VNY024 Vasútegészségügyi adatok
- **UCE-1826**: Döntési javaslat elkészítése (F-0074)
- **UCE-1824**: Döntési javaslat véleményeztetése (F-0096)
- **UCE-1828**: Ügy lezárása (F-0097)
- **F-0091**: Végzés tervezet
- **F-0092**: Határozat tervezet
- **F-0093**: Igazolás tervezet
- **F-0100**: Hiánypótlási felszólítás
- **F-0102**: Tényállás tisztázása (Rugalmas workflow)

### Hajózási Modul (H-052)

#### Külső rendszer (Ügyfél):
- **UCE-1955**: Kérelem adatrögzítés megkezdése
- **UCE-1967**: Kérelem adatainak kitöltése (F-0069)
- **UCE-1966**: Mellékletek csatolása (F-0084)
- **UCE-1970**: Kérelem véglegesítése (F-0085, F-0086)
- **UCE-1965**: Kérelem benyújtása (F-0087)
- Hajózás-specifikus mezők: kikötő típus, víziút kategória, kapacitás

#### Belső rendszer (Ügyintéző):
- **UCE-1987**: Hatáskör vizsgálat (F-0064)
- **UCE-1993**: Formai ellenőrzés (F-0065)
- **UCE-1988**: Tartalmi vizsgálat (F-0066)
- **UCE-2045**: Szakhatósági állásfoglalás
- **UCE-2020**: Döntési javaslat (F-0074)
- **UCE-2018**: Véleményeztetés (F-0096)
- **UCE-2023**: HNY501 Nyilvántartás frissítése (F-0106)
- **UCE-2022**: Ügy lezárása (F-0097)
- **UCE-2051**: Helyszíni szemle
- **F-0102**: Tényállás tisztázása

## 🎨 Dizájn Rendszer

### Színpaletta

```css
/* Kormányzati színek */
--vihar-primary: #004b87;    /* Sötétkék */
--vihar-secondary: #6c757d;  /* Szürke */
--vihar-success: #28a745;    /* Zöld */
--vihar-warning: #ffc107;    /* Sárga */
--vihar-danger: #dc3545;     /* Piros */

/* Modul specifikus */
--vasut-color: #8B4513;      /* Barna */
--hajozas-color: #006994;    /* Tengerkék */
```

### Layout Struktúrák

#### Külső rendszer (Ügyfél):
- Egyszerű folyamatkövető (wizard)
- Lépésenkénti űrlapok
- Melléklet feltöltés
- PDF generálás és véglegesítés

#### Belső rendszer (Ügyintéző):
- **3 oszlopos kötelező layout**:
  1. Bal oszlop (2 col): Navigáció, workflow lépések
  2. Középső oszlop (7 col): Munkaterület
  3. Jobb oszlop (3 col): Döntési pontok, előzmények, dokumentumok

## 🔧 Technológiai Stack

- **Frontend Framework**: Vue.js 3 (CDN)
- **CSS Framework**: Bootstrap 5.3
- **Icons**: Bootstrap Icons
- **Mock adatok**: Beépített tesztadatok
- **Nincs backend**: Tisztán frontend drótvázmodell

## 📝 Mock Adatok

### Vasúti modul - Ügyfél adat
```javascript
{
  nev: "Minta János",
  szuletesiDatum: "1985-03-15",
  lakcim: {
    iranyitoszam: "1011",
    telepules: "Budapest",
    kozterulet: "Fő utca",
    hazszam: "1"
  },
  email: "minta.janos@example.hu",
  telefonszam: "+36301234567"
}
```

### Hajózási modul - Kérelmező adat
```javascript
{
  cegnev: "Duna Kikötő Kft.",
  cegjegyzekszam: "01-09-123456",
  kepviselo: "Kovács István",
  kikotoTipus: "orszagos_kozforgalmu",
  viziutKategoria: "vi",
  kapacitas: 500000
}
```

## 🔗 Interfészek

### EKEIDR Kapcsolat
- **F-0078**: VAHAP érkeztetés
- **F-0079**: Bejövő iktatás
- **F-0080**: Kimenő és belső iktatás
- **F-0081**: Iktatási adatok lekérése

### Nyilvántartások
- **VNY024**: Vasútegészségügyi adatok (Vasúti modul)
- **HNY501**: Hajózási Létesítmények (Hajózási modul)
- **HNY547**: Regiszteri Adatbázis (Hajózási modul)

### FORRÁS SQL
- **F-0098**: Díjfizetés ellenőrzés

## ⏱️ Határidők

| Eljárástípus | Határidő |
|--------------|----------|
| Sommás eljárás | 8 nap |
| Teljes eljárás | 60 nap |
| Hiánypótlás | 15 nap (alap) |
| Szakhatósági állásfoglalás | 30 nap |
| Vezetői döntés | 5 nap |

## 👥 Szerepkörök

### Külső szerepkörök
- **UGYFEL**: Ügyfél, Képviselő
- **TARSHATOSAG**: Társhatóság (csak hajózási)
- **KULSO_KOZREMUKODO**: Külső közreműködő

### Belső szerepkörök
- **VHF_UGYINTEZO**: Vasúti Hatósági Főosztály ügyintéző
- **VHF_DONTESHOZO**: VHF döntéshozó
- **HHF_UGYINTEZO**: Hajózási Hatósági Főosztály ügyintéző
- **HHF_DONTESHOZO**: HHF döntéshozó
- **BELSO_KOZREMUKODO**: Belső közreműködő

## 📚 Specifikációk

A rendszer a következő specifikációk alapján készült:
- `VAHAP Vasúti Modul Logikai Specifikáció.md`
- `VAHAP Hajózási Modul Logikai Specifikáció.md`

## ⚠️ Fontos megjegyzések

### Ez egy DRÓTVÁZMODELL
- **Nincs valós backend**: Minden funkció mockolt
- **Nincs valós adatbázis**: Tesztadatok használata
- **Nincs autentikáció**: Nyílt hozzáférés
- **Nincs fájlfeltöltés**: Csak UI elemek
- **Nincs PDF generálás**: Mock funkció

### Fejlesztési célok
- Teljes működő felület bemutatása
- Workflow lépések szemléltetése
- Funkciókódok (F-xxxx) megjelenítése
- Use case kódok (UCE-xxxx) nyomon követése
- Felhasználói élmény (UX) tesztelése

## 🌐 Böngésző támogatás

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Támogatás

Ez egy prototípus rendszer. Valós használatra nem alkalmas.

**Fejlesztési információk:**
- Fejlesztés dátuma: 2024
- Verzió: 1.0 (Drótvázmodell)
- Építési és Közlekedési Minisztérium

## 📄 Licensz

Kormányzati projekt - Minden jog fenntartva

---

**VAHAP - Vasúti és Hajózási Integrált Hatósági Rendszer**
*Modernizáljuk a közlekedési hatósági ügyintézést*
