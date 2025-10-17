# VAHAP Hajózási Modul Logikai Specifikáció

## 1. Rendszer Áttekintés

**Rendszer neve:** VIHAR Hajózási Modul  
**Ügytípus kód:** H-052  
**Ügytípus megnevezés:** Országos közforgalmú, vagy határkikötő létesítésének engedélyezése  
**Modul célja:** Kikötő, komp- és révátkelőhely, továbbá más hajózási létesítmény létesítésének elektronikus ügyintézése

## 2. Eljárástípusok és Workflow-k

### 2.1 Főfolyamatok

#### 2.1.1 Kérelem benyújtása VIHAR rendszeren keresztül

**Folyamat azonosító:** UC-HAJ-0301

**Workflow lépések:**
```yaml
kerelem_benyujtas:
  lepesek:
    - lépés_id: UCE-1955
      megnevezés: "Kérelem adatrögzítés megkezdése"
      típus: Kezdés
      
    - lépés_id: UCE-1967
      megnevezés: "Kérelem adatainak kitöltése"
      funkció: F-0069
      szereplő: Ügyfél/Képviselő
      specifikus_adatok:
        - műszaki_tervdokumentáció
        - építési_engedélyek
        - vízjogi_engedélyek
        - tulajdonjogi_igazolás
      
    - lépés_id: UCE-1956
      megnevezés: "Eljárási díj fizetése szükséges?"
      típus: Döntési_pont
      ágak:
        - díjfizetés_szükséges
        - díjfizetés_nem_szükséges
        
    - lépés_id: UCE-1957
      megnevezés: "Díjfizetés meghatározása"
      funkció: F-0082, F-0070
      feltétel: díjfizetés_szükséges
      
    - lépés_id: UCE-1966
      megnevezés: "Mellékletek csatolása"
      funkció: F-0084
      hajózás_specifikus_mellékletek:
        - tervező_jogosultság
        - üzemeltetési_nyilatkozat
        - közművek_helyzete
      
    - lépés_id: UCE-1970
      megnevezés: "Kérelem véglegesítése"
      funkciók: 
        - F-0085 # Kérelem véglegesítése
        - F-0086 # PDF generálás
        
    - lépés_id: UCE-1965
      megnevezés: "Kérelem benyújtása"
      funkció: F-0087
      kimenet: Kérelem adatlap hajózási létesítményhez
```

#### 2.1.2 Kérelem formai és tartalmi vizsgálata

**Folyamat azonosító:** UC-HAJ-0303

**Workflow lépések:**
```yaml
formai_tartalmi_vizsgalat:
  lepesek:
    - lépés_id: UCE-1987
      megnevezés: "Hatáskör és illetékesség vizsgálata"
      funkciók: 
        - F-0064 # Hatáskör vizsgálat
        - F-0088 # Döntés-előkészítés
      döntési_pontok:
        - hatáskör_van
        - hatáskör_nincs
      hatóság: "Hajózási Hatóság"
        
    - lépés_id: UCE-1993
      megnevezés: "Formai megfelelőség vizsgálata"
      funkciók:
        - F-0065 # Formai vizsgálat
        - F-0088 # Döntés-előkészítés
      párhuzamos: true
      hajózás_specifikus_követelmények:
        - jogerős_építési_engedély
        - jogerős_vízjogi_engedély
        - tulajdonjog_igazolása
      
    - lépés_id: UCE-1988
      megnevezés: "Tartalmi megfelelőség vizsgálata"
      funkciók:
        - F-0066 # Tartalmi vizsgálat
        - F-0088 # Döntés-előkészítés
      párhuzamos: true
      hajózás_specifikus_vizsgálat:
        - műszaki_terv_megfelelőség
        - biztonsági_követelmények
        - környezetvédelmi_előírások
      
    - lépés_id: UCE-1994
      megnevezés: "Sommás eljárás alkalmazható?"
      típus: Döntési_pont
      opciók:
        - sommás_eljárás
        - teljes_eljárás
        - hiánypótlás_szükséges
        - tényállás_tisztázás_szükséges
```

#### 2.1.3 Döntéshozatal

**Folyamat azonosító:** UC-HAJ-0304

**Workflow lépések:**
```yaml
donteshozatal:
  lepesek:
    - lépés_id: UCE-2020
      megnevezés: "Döntési javaslat elkészítése"
      funkció: F-0074
      adatok:
        - jogi_forma: [Végzés, Határozat]
        - dokumentum_típusok: [Igazolás, Tájékoztatás, Hirdetmény]
        - specifikus: létesítési_engedély
        
    - lépés_id: UCE-2003
      megnevezés: "Végzés tervezet"
      funkció: F-0091
      altípusok:
        - kérelem_elutasítása
        - áttételi_végzés
      
    - lépés_id: UCE-2004
      megnevezés: "Határozat tervezet"
      funkció: F-0092
      altípusok:
        - engedélyezés
        - elutasítás
        - felfüggesztő_határozat
      
    - lépés_id: UCE-2005
      megnevezés: "Igazolás tervezet"
      funkció: F-0093
      
    - lépés_id: UCE-2018
      megnevezés: "Döntési javaslat véleményeztetése"
      funkció: F-0096
      típus: Rugalmas_workflow
      szereplők:
        - belső_közreműködő_hajó
        - szakértők
      
    - lépés_id: UCE-2023
      megnevezés: "Releváns nyilvántartás frissítése"
      funkció: F-0106
      nyilvántartás: HNY501 Hajózási Létesítmények
      
    - lépés_id: UCE-2022
      megnevezés: "Ügy lezárása"
      funkció: F-0097
```

### 2.2 Szakmai Alfolyamatok

#### 2.2.1 Hiánypótlás

**Folyamat azonosító:** UC-HAJ-0307

```yaml
hianypotlas:
  lepesek:
    - lépés_id: UCE-2071
      megnevezés: "Hiánypótlási felszólítás összeállítása"
      funkció: F-0100
      hajózás_specifikus:
        - műszaki_dokumentáció_pótlása
        - engedélyek_pótlása
        - nyilatkozatok_pótlása
      
    - lépés_id: UCE-2063
      megnevezés: "Hiánypótlás benyújtása"
      funkció: F-0101
      szereplő: Ügyfél
      
    - lépés_id: UCE-2068
      megnevezés: "Hiánypótlás teljesítés vizsgálata"
      döntés:
        - teljesített
        - részben_teljesített  
        - nem_teljesített
```

#### 2.2.2 Tényállás tisztázása

**Folyamat azonosító:** UC-HAJ-0306

```yaml
tenyallas_tisztazas:
  rugalmas_workflow: true
  funkció: F-0102
  hajózási_eljárási_cselekmények:
    - lépés_id: UCE-2054
      megnevezés: "Megkeresés"
      címzett: Társhatóság
      
    - lépés_id: UCE-2045
      megnevezés: "Szakhatósági állásfoglalás"
      hatóságok:
        - vízügyi_hatóság
        - környezetvédelmi_hatóság
        - építésügyi_hatóság
        
    - lépés_id: UCE-2052
      megnevezés: "Ügyfél nyilatkozattétel"
      
    - lépés_id: UCE-2047
      megnevezés: "Tanú meghallgatás"
      
    - lépés_id: UCE-2051
      megnevezés: "Szemle lefolytatás"
      típus: helyszíni_szemle
      
    - lépés_id: UCE-2055
      megnevezés: "Irat bemutatás"
      
    - lépés_id: UCE-2053
      megnevezés: "Szakértői vélemény"
      szakértői_területek:
        - hajózási_műszaki
        - víziközlekedés_biztonsági
        
    - lépés_id: UCE-2056
      megnevezés: "Tárgyalás összehívás"
      
    - lépés_id: UCE-2050
      megnevezés: "Egyedi eljárási cselekmény"
```

### 2.3 Iratkezelési Alfolyamatok

#### 2.3.1 Érkeztetés

**Folyamat azonosító:** UC-HAJ-0302

```yaml
erkeztetes:
  interfész: EKEIDR
  funkció: F-0078
  adatok:
    bemenet: DS-0090 # VIHAR érkeztetési adatok
    kimenet: DS-0102 # EKEIDR érkeztetési adatok
```

#### 2.3.2 Kimenő/belső dokumentumok iktatása

**Folyamat azonosító:** UC-HAJ-0305

```yaml
kimeno_iktatas:
  lépések:
    - lépés_id: UCE-2026
      megnevezés: "Expediálási adatok megadása"
      funkció: F-0080
      
    - lépés_id: UCE-2025
      megnevezés: "Iktatószám fogadása"
      
    - lépés_id: UCE-2027
      megnevezés: "PDF dokumentum továbbítása"
      
    - lépés_id: UCE-2028
      megnevezés: "Vezetői döntés"
```

## 3. Funkciókatalógus

### 3.1 Külső Funkciók (External)

```yaml
kulso_funkciok:
  - funkció_id: F-0069
    megnevezés: "Kérelem kitöltése"
    kategória: Adatrögzítés
    hajózás_specifikus_mezők:
      - kikötő_típusa
      - tervezett_kapacitás
      - vízi_út_kategória
      - hajózási_létesítmény_jellege
    
  - funkció_id: F-0070
    megnevezés: "Díjkalkulátor"
    kategória: Díjkezelés
    hajózási_díjtételek:
      - kikötő_létesítés
      - komp_átkelőhely
      - hajózási_létesítmény
    
  - funkció_id: F-0082
    megnevezés: "Díjbekérő előállítása"
    kategória: Díjkezelés
    
  - funkció_id: F-0083
    megnevezés: "Online díjfizetés interfész"
    kategória: Díjkezelés
    
  - funkció_id: F-0084
    megnevezés: "Kérelem mellékletek"
    kategória: Dokumentumkezelés
    hajózás_kötelező_mellékletek:
      - műszaki_tervdokumentáció
      - jogerős_építési_engedély
      - jogerős_vízjogi_engedély
      - tulajdonjogi_okirat
      - tervező_jogosultság
      - üzemeltetési_nyilatkozat
    
  - funkció_id: F-0085
    megnevezés: "Kérelem véglegesítése"
    kategória: Kérelemkezelés
    
  - funkció_id: F-0086
    megnevezés: "PDF kérelem generálás"
    kategória: Dokumentumgenerálás
    
  - funkció_id: F-0087
    megnevezés: "Kérelem benyújtása"
    kategória: Kérelemkezelés
    
  - funkció_id: F-0101
    megnevezés: "Hiánypótlás benyújtása"
    kategória: Hiánypótlás
    
  - funkció_id: F-0104
    megnevezés: "Tényállás tisztázás benyújtása"
    kategória: Tényállás
    
  - funkció_id: F-0107
    megnevezés: "Kérelem adatlap"
    kategória: Adatlap
```

### 3.2 Belső Funkciók (Internal)

```yaml
belso_funkciok:
  - funkció_id: F-0064
    megnevezés: "Hatáskör és illetékesség vizsgálat"
    kategória: Ellenőrzés
    hajózási_hatáskör:
      - országos_közforgalmú_kikötő
      - határkikötő
      - hajózási_létesítmény
    paraméterezhetőség: 
      - ellenőrzési_lista_paraméterek (DS-0106)
      
  - funkció_id: F-0065
    megnevezés: "Formai megfelelőség vizsgálata"
    kategória: Ellenőrzés
    paraméterezhetőség:
      - ellenőrzési_lista_paraméterek (DS-0107)
      
  - funkció_id: F-0066
    megnevezés: "Tartalmi megfelelőség vizsgálat"
    kategória: Ellenőrzés
    hajózás_specifikus_vizsgálat:
      - víziút_osztály_megfelelőség
      - kikötői_infrastruktúra
      - biztonsági_előírások
    paraméterezhetőség:
      - ellenőrzési_lista_paraméterek (DS-0108)
      
  - funkció_id: F-0074
    megnevezés: "Érdemi döntés: döntési javaslat"
    kategória: Döntéshozatal
    
  - funkció_id: F-0088
    megnevezés: "Döntés-előkészítés döntés"
    kategória: Döntéshozatal
    döntési_típusok:
      - hatáskör_illetékesség
      - formai_megfelelőség
      - tartalmi_megfelelőség
      - sommás_eljárás
      - hiánypótlás_szükséges
      - tényállás_tisztázás_szükséges
      
  - funkció_id: F-0089
    megnevezés: "Döntés-előkészítés: ügyfél értesítés"
    kategória: Értesítés
    sablon: Paraméterezett
    
  - funkció_id: F-0091
    megnevezés: "Végzés tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    hajózási_végzés_típusok:
      - kérelem_elutasítása
      - áttételi_végzés
    
  - funkció_id: F-0092
    megnevezés: "Határozat tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    hajózási_határozat_típusok:
      - létesítési_engedély
      - elutasító_határozat
      - felfüggesztő_határozat
    
  - funkció_id: F-0093
    megnevezés: "Igazolás tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
  - funkció_id: F-0094
    megnevezés: "Tájékoztatás tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
  - funkció_id: F-0095
    megnevezés: "Hirdetmény tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
  - funkció_id: F-0096
    megnevezés: "Döntési javaslat véleményezés: Rugalmas workflow"
    kategória: Workflow
    rugalmas: true
    
  - funkció_id: F-0097
    megnevezés: "Ügy lezárása"
    kategória: Ügykezelés
    
  - funkció_id: F-0098
    megnevezés: "FORRÁS SQL interfész"
    kategória: Interfész
    cél: Díjfizetés_ellenőrzés
    
  - funkció_id: F-0099
    megnevezés: "Érdemi döntés: vezetői döntés"
    kategória: Döntéshozatal
    
  - funkció_id: F-0100
    megnevezés: "Hiánypótlási felszólítás összeállítása"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
  - funkció_id: F-0102
    megnevezés: "Tényállás tisztázása: Rugalmas workflow"
    kategória: Workflow
    rugalmas: true
    
  - funkció_id: F-0106
    megnevezés: "HNY501 Hajózási Létesítmények"
    kategória: Nyilvántartás
    specifikus: Hajózás_modul
    műveletek:
      - rögzítés
      - szerkesztés
      - megtekintés
      - törlés
      - listázás
```

### 3.3 Interfész Funkciók

```yaml
interfesz_funkciok:
  - funkció_id: F-0078
    megnevezés: "VIHAR érkeztetés"
    interfész: EKEIDR
    irány: Bidirectional
    
  - funkció_id: F-0079
    megnevezés: "VIHAR bejövő iktatás"
    interfész: EKEIDR
    irány: Bidirectional
    
  - funkció_id: F-0080
    megnevezés: "VIHAR kimenő és belső iktatás"
    interfész: EKEIDR
    irány: Bidirectional
    
  - funkció_id: F-0081
    megnevezés: "Bejövő EKEIDR iktatási adatok lekérése"
    interfész: EKEIDR
    irány: Pull
```

## 4. Adatstruktúrák

### 4.1 Alapadatok

```yaml
alapadatok:
  DS-0080:
    megnevezés: "Kérelem adatok"
    mezők:
      - kérelem_azonosító
      - kérelmező_adatok
      - kérelem_típus
      - benyújtás_dátum
      - létesítmény_típusa
      - kikötő_jellege
      
  DS-0085:
    megnevezés: "Kérelem döntési adatai"
    mezők:
      - döntés_típus
      - döntés_indoklás
      - jogi_forma
      - döntés_dátum
      - döntéshozó
      - létesítési_engedély_száma
      
  DS-0092:
    megnevezés: "Ügyfél (kérelmező) adatok"
    mezők:
      - név
      - székhely/lakcím
      - értesítési_cím
      - képviselő_adatok
      - tervező_adatok
      
  DS-0097:
    megnevezés: "Kérelem mellékletek"
    mezők:
      - melléklet_típus
      - fájlnév
      - feltöltés_dátum
      - méret
      - műszaki_dokumentáció
```

### 4.2 Ellenőrzési Listák

```yaml
ellenorzesi_listak:
  DS-0104:
    megnevezés: "Hatáskör és illetékesség vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
    hajózás_specifikus:
      - víziút_kategória
      - kikötő_típusa
      - illetékes_hajózási_hatóság
    
  DS-0081:
    megnevezés: "Formai megfelelőségi vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
    hajózás_követelmények:
      - építési_engedély_megléte
      - vízjogi_engedély_megléte
      - tulajdonjogi_igazolás
      - tervező_jogosultság
    
  DS-0091:
    megnevezés: "Tartalmi megfelelőség vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
    hajózás_követelmények:
      - műszaki_terv_megfelelőség
      - biztonsági_előírások
      - környezetvédelmi_szempontok
```

### 4.3 Hajózás-specifikus Adatok

```yaml
hajozas_specifikus:
  DS-0120:
    megnevezés: "HNY501 Hajózási Létesítmények"
    forrás: Hajózási Létesítmények nyilvántartás
    mezők:
      - létesítmény_azonosító
      - létesítmény_neve
      - típus
      - földrajzi_koordináták
      - víziút_osztály
      - kapacitás
      - üzemeltető
      
  DS-0121:
    megnevezés: "HNY547 Regiszteri Adatbázis"
    forrás: "Műszaki-Tulajdonjogi Adatok Úszóművekre"
    mezők:
      - úszómű_azonosító
      - műszaki_adatok
      - tulajdonjogi_adatok
```

## 5. Szerepkörök és Jogosultságok

### 5.1 Külső Szerepkörök

```yaml
kulso_szerepkorok:
  UGYFEL:
    megnevezés: "Ügyfél, Képviselő"
    jogosultságok:
      - kérelem_benyújtás
      - státusz_lekérdezés
      - hiánypótlás_teljesítés
      - dokumentum_feltöltés
      - nyilatkozattétel
    interfész: External
    
  TARSHATOSAG:
    megnevezés: "Társhatóság"
    típusok:
      - vízügyi_hatóság
      - környezetvédelmi_hatóság
      - építésügyi_hatóság
    jogosultságok:
      - szakhatósági_állásfoglalás
      - megkeresés_megválaszolás
    
  KULSO_KOZREMUKODO:
    megnevezés: "Külső Közreműködő"
    típusok:
      - szakértő
      - tanú
    jogosultságok:
      - szakvélemény_adás
      - nyilatkozattétel
```

### 5.2 Belső Szerepkörök

```yaml
belso_szerepkorok:
  HHF_UGYINTEZO:
    megnevezés: "HHF Ügyintéző"
    szervezet: "Építési és Közlekedési Minisztérium"
    szervezeti_egység: "Hajózási Hatósági Főosztály"
    jogosultságok:
      - kérelem_vizsgálat
      - formai_ellenőrzés
      - tartalmi_ellenőrzés
      - döntés_előkészítés
      - dokumentum_generálás
      - nyilvántartás_frissítés
      - szakhatósági_megkeresés
      - helyszíni_szemle
    interfész: Internal
    
  HHF_DONTESHOZO:
    megnevezés: "HHF Döntéshozó"
    szervezet: "Építési és Közlekedési Minisztérium"
    szervezeti_egység: "Hajózási Hatósági Főosztály"
    jogosultságok:
      - döntéshozatal
      - kiadmányozás
      - jóváhagyás
      - elutasítás
      - tényállás_tisztázás_elrendelése
    interfész: Internal
    
  BELSO_KOZREMUKODO_HAJO:
    megnevezés: "Belső Közreműködő (Hajó)"
    jogosultságok:
      - véleményezés
      - szakmai_konzultáció
```

## 6. Dokumentum Sablonok

```yaml
dokumentum_sablonok:
  kimenő_dokumentumok:
    - típus: "Hiánypótlási felszólítás"
      paraméterezhetőség: igen
      hajózás_specifikus_elemek:
        - műszaki_dokumentáció_hiány
        - engedélyek_hiánya
        
    - típus: "Ügyfél értesítés sommás eljárásról"
      paraméterezhetőség: igen
      
    - típus: "Ügyfél értesítés teljes eljárásról"
      paraméterezhetőség: igen
      
    - típus: "Végzés"
      altípusok:
        - "Kérelem elutasítása"
        - "Áttételi végzés"
      paraméterezhetőség: igen
      
    - típus: "Határozat"
      altípusok:
        - "Létesítési engedély"
        - "Elutasító határozat"
        - "Felfüggesztő határozat"
      paraméterezhetőség: igen
      hajózás_specifikus:
        - létesítési_engedély_feltételei
        - kivitelezési_határidő
        
    - típus: "Szakhatósági állásfoglalás kérés"
      címzettek:
        - vízügyi_hatóság
        - környezetvédelmi_hatóság
        
    - típus: "Tájékoztató levél helyszíni szemléről"
      paraméterezhetőség: igen
      
    - típus: "Jegyzőkönyv"
      altípusok:
        - helyszíni_szemle
        - tárgyalás
        - tanú_meghallgatás
      
  bejövő_dokumentumok:
    - típus: "Kérelem adatlap hajózási létesítményhez"
      kötelező_mellékletek:
        - műszaki_tervdokumentáció
        - építési_engedély
        - vízjogi_engedély
        - tulajdonjogi_okirat
        
    - típus: "Hiánypótlás"
      
    - típus: "Díjfizetési igazolás"
      
    - típus: "Szakhatósági állásfoglalás"
      
    - típus: "Szakértői vélemény"
```

## 7. Paraméterezhetőségi Pontok

```yaml
parameterezheto_elemek:
  ellenorzesi_listak:
    - hatáskör_illetékesség_kritériumok
      - kikötő_típusa
      - víziút_kategória
      - földrajzi_illetékesség
    - formai_követelmények_listája
      - kötelező_mellékletek
      - jogosultság_igazolások
    - tartalmi_követelmények_listája
      - műszaki_megfelelőség
      - biztonsági_előírások
      - környezetvédelmi_szempontok
    
  hataridok:
    - sommás_eljárás: 8_nap
    - teljes_eljárás: 60_nap
    - hiánypótlás: 15_nap_alap
    - szakhatósági_állásfoglalás: 30_nap
    - helyszíni_szemle: rugalmas
    - tényállás_tisztázás: rugalmas
    - létesítési_engedély_érvényessége: 2_év
    
  dijak:
    - eljárási_díj_mértéke
      - országos_közforgalmú_kikötő
      - határkikötő
      - egyéb_hajózási_létesítmény
    - díjfizetési_módok
    - kedvezmények
    
  dokumentum_sablonok:
    - fejléc_lábléc
    - aláírási_jogkörök
    - címzettek_köre
    - hajózási_specifikus_tartalmak
    
  dontes_tipusok:
    - jogi_formák
    - döntési_opciók
    - jogorvoslati_lehetőségek
    - létesítési_feltételek
```

## 8. Integrációs Pontok

```yaml
integraciok:
  EKEIDR:
    típus: "Külső rendszer"
    funkciók:
      - érkeztetés
      - iktatás
      - expedíció
    protokoll: "SOAP/REST API"
    
  HNY501_nyilvantartas:
    típus: "Belső nyilvántartás"
    cél: "Hajózási Létesítmények"
    műveletek:
      - lekérdezés
      - frissítés
      - új_létesítmény_rögzítése
      
  HNY547_regiszter:
    típus: "Belső nyilvántartás"
    cél: "Úszóművek műszaki-tulajdonjogi adatai"
    műveletek:
      - lekérdezés
      - összevetés
      
  FORRAS_SQL:
    típus: "Pénzügyi rendszer"
    cél: "Díjfizetés ellenőrzés"
    protokoll: "SQL interfész"
    
  SZAKHATOSAGOK:
    típus: "Külső hatóságok"
    kapcsolatok:
      - vízügyi_hatóság
      - környezetvédelmi_hatóság
      - építésügyi_hatóság
    protokoll: "Hivatali_kapu"
```

## 9. Hajózás-specifikus Követelmények

```yaml
hajozas_specifikus:
  muszaki_követelmenyek:
    - víziút_osztálynak_megfelelő_paraméterek
    - kikötői_infrastruktúra_előírások
    - hajóforgalmi_kapacitás
    - rakodási_lehetőségek
    
  biztonsagi_követelmenyek:
    - hajózásbiztonsági_előírások
    - veszélyes_áru_kezelés
    - mentési_eszközök
    - tűzvédelem
    
  kornyezetvedelmi_szempontok:
    - vízvédelmi_előírások
    - zajvédelem
    - hulladékkezelés
    - természetvédelmi_szempontok
    
  uzemeltetesi_feltetelek:
    - üzemeltetői_jogosultság
    - fenntartási_terv
    - közműellátás
    - megközelíthetőség
```

## 10. Monitoring és Határidők

```yaml
monitoring:
  hataridok_figyelese:
    - sommás_eljárás_figyelés: 8_nap
    - teljes_eljárás_figyelés: 60_nap
    - hiánypótlás_teljesítés: 15_nap
    - szakhatósági_állásfoglalás: 30_nap
    - vezetői_döntés: 5_nap
    - létesítési_engedély_lejárat: 2_év
    
  riasztasok:
    - határidő_előtt_5_nap
    - határidő_előtt_3_nap
    - határidő_előtt_1_nap
    - határidő_lejárat
    - engedély_lejárat_előtt_60_nap
    
  eszkalacios_szabalyok:
    - első_szint: ügyintéző
    - második_szint: csoportvezető
    - harmadik_szint: főosztályvezető
```

## 11. Közös és Eltérő Elemek a Vasúti Modullal

```yaml
kozos_elemek:
  funkciók:
    - F-0064 # Hatáskör vizsgálat
    - F-0065 # Formai vizsgálat
    - F-0066 # Tartalmi vizsgálat
    - F-0074 # Döntési javaslat
    - F-0088 # Döntés-előkészítés
    - F-0091_to_F-0095 # Dokumentum tervezetek
    - F-0096 # Rugalmas workflow
    - F-0097 # Ügy lezárása
    - F-0098 # FORRÁS SQL
    - F-0100 # Hiánypótlási felszólítás
    - F-0101 # Hiánypótlás benyújtása
    - F-0102 # Tényállás tisztázása
    
  workflow_struktura:
    - főfolyamatok_szerkezete
    - döntési_pontok
    - párhuzamos_végrehajtás
    - rugalmas_workflow
    
  interfeszek:
    - EKEIDR
    - FORRÁS_SQL
    
eltero_elemek:
  vasut_specifikus:
    - F-0090 # VNY024 Vasútegészségügyi adatok
    - DS-0096 # Vasútegészségügyi adatok
    - DS-0119 # VEÜ adatbázis
    - alkalmassági_vizsgálat_fókusz
    
  hajozas_specifikus:
    - F-0106 # HNY501 Hajózási Létesítmények
    - DS-0120 # Hajózási Létesítmények
    - DS-0121 # Regiszteri Adatbázis
    - létesítmény_engedélyezés_fókusz
    - szakhatósági_egyeztetések
    - műszaki_tervdokumentáció
    - környezetvédelmi_szempontok
```

## 12. Implementációs Megfontolások

```yaml
implementacio:
  modularis_felepites:
    - közös_funkciók_használata
    - paraméterezett_workflow_motor
    - rugalmas_sablon_kezelés
    - közös_interfész_kezelés
    
  bovithetoseg:
    - új_létesítmény_típusok_hozzáadása
    - új_szakhatósági_kapcsolatok
    - workflow_lépések_testreszabása
    - új_dokumentum_típusok
    
  hajozas_specifikus_bovites:
    - nemzetközi_víziút_kezelés
    - különleges_létesítmények
    - komplex_műszaki_követelmények
    
  verziokezeles:
    - workflow_verziók_kezelése
    - sablon_verziók_nyilvántartása
    - konfigurációs_változások_naplózása
    - engedélyek_verziókezelése
```
