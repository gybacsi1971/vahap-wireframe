# VAHAP Vasúti Modul Logikai Specifikáció

## 1. Rendszer Áttekintés

**Rendszer neve:** VIHAR Vasúti Modul  
**Ügytípus kód:** V-044  
**Ügytípus megnevezés:** A vasúti járművezetők előzetes alkalmassági vizsgálata  
**Modul célja:** Vasúti járművezetők alkalmassági vizsgálatával kapcsolatos kérelmek elektronikus ügyintézése

## 2. Eljárástípusok és Workflow-k

### 2.1 Főfolyamatok

#### 2.1.1 Kérelem benyújtása VIHAR rendszeren keresztül

**Folyamat azonosító:** UC-0301

**Workflow lépések:**
```yaml
kerelem_benyujtas:
  lepesek:
    - lépés_id: UCE-1761
      megnevezés: "Kérelem adatrögzítés megkezdése"
      típus: Kezdés
      
    - lépés_id: UCE-1773
      megnevezés: "Kérelem adatainak kitöltése"
      funkció: F-0069
      szereplő: Ügyfél/Képviselő
      
    - lépés_id: UCE-1762
      megnevezés: "Eljárási díj fizetése szükséges?"
      típus: Döntési_pont
      ágak:
        - díjfizetés_szükséges
        - díjfizetés_nem_szükséges
        
    - lépés_id: UCE-1763
      megnevezés: "Díjfizetés meghatározása"
      funkció: F-0082, F-0070
      feltétel: díjfizetés_szükséges
      
    - lépés_id: UCE-1772
      megnevezés: "Mellékletek csatolása"
      funkció: F-0084
      
    - lépés_id: UCE-1776
      megnevezés: "Kérelem véglegesítése"
      funkciók: 
        - F-0085 # Kérelem véglegesítése
        - F-0086 # PDF generálás
        
    - lépés_id: UCE-1771
      megnevezés: "Kérelem benyújtása"
      funkció: F-0087
      kimenet: Kérelem adatlap vasútegészségügyi vizsgálathoz
```

#### 2.1.2 Kérelem formai és tartalmi vizsgálata

**Folyamat azonosító:** UC-0303

**Workflow lépések:**
```yaml
formai_tartalmi_vizsgalat:
  lepesek:
    - lépés_id: UCE-1793
      megnevezés: "Hatáskör és illetékesség vizsgálata"
      funkciók: 
        - F-0064 # Hatáskör vizsgálat
        - F-0088 # Döntés-előkészítés
      döntési_pontok:
        - hatáskör_van
        - hatáskör_nincs
        
    - lépés_id: UCE-1799
      megnevezés: "Formai megfelelőség vizsgálata"
      funkciók:
        - F-0065 # Formai vizsgálat
        - F-0088 # Döntés-előkészítés
      párhuzamos: true
      
    - lépés_id: UCE-1794
      megnevezés: "Tartalmi megfelelőség vizsgálata"
      funkciók:
        - F-0066 # Tartalmi vizsgálat
        - F-0090 # VNY024 Vasútegészségügyi adatok
        - F-0088 # Döntés-előkészítés
      párhuzamos: true
      
    - lépés_id: UCE-1800
      megnevezés: "Sommás eljárás alkalmazható?"
      típus: Döntési_pont
      opciók:
        - sommás_eljárás
        - teljes_eljárás
        - hiánypótlás_szükséges
        - tényállás_tisztázás_szükséges
```

#### 2.1.3 Döntéshozatal

**Folyamat azonosító:** UC-0304

**Workflow lépések:**
```yaml
donteshozatal:
  lepesek:
    - lépés_id: UCE-1826
      megnevezés: "Döntési javaslat elkészítése"
      funkció: F-0074
      adatok:
        - jogi_forma: [Végzés, Határozat]
        - dokumentum_típusok: [Igazolás, Tájékoztatás, Hirdetmény]
        
    - lépés_id: UCE-1809
      megnevezés: "Végzés tervezet"
      funkció: F-0091
      feltétel: jogi_forma == 'Végzés'
      
    - lépés_id: UCE-1810
      megnevezés: "Határozat tervezet"
      funkció: F-0092
      feltétel: jogi_forma == 'Határozat'
      
    - lépés_id: UCE-1811
      megnevezés: "Igazolás tervezet"
      funkció: F-0093
      
    - lépés_id: UCE-1824
      megnevezés: "Döntési javaslat véleményeztetése"
      funkció: F-0096
      típus: Rugalmas_workflow
      
    - lépés_id: UCE-1828
      megnevezés: "Ügy lezárása"
      funkció: F-0097
```

### 2.2 Szakmai Alfolyamatok

#### 2.2.1 Hiánypótlás

**Folyamat azonosító:** UC-0307

```yaml
hianypotlas:
  lepesek:
    - megnevezés: "Hiánypótlási felszólítás összeállítása"
      funkció: F-0100
      
    - megnevezés: "Hiánypótlás benyújtása"
      funkció: F-0101
      szereplő: Ügyfél
      
    - megnevezés: "Hiánypótlás teljesítés vizsgálata"
      döntés:
        - teljesített
        - részben_teljesített
        - nem_teljesített
```

#### 2.2.2 Tényállás tisztázása

**Folyamat azonosító:** UC-0306

```yaml
tenyallas_tisztazas:
  rugalmas_workflow: true
  funkció: F-0102
  eljárási_cselekmények:
    - megkeresés
    - szakhatósági_állásfoglalás
    - ügyfél_nyilatkozat
    - tanú_meghallgatás
    - szemle_lefolytatás
    - irat_bemutatás
    - szakértői_vélemény
    - tárgyalás
    - egyedi_cselekmény
```

### 2.3 Iratkezelési Alfolyamatok

#### 2.3.1 Érkeztetés

**Folyamat azonosító:** UC-0302

```yaml
erkeztetes:
  interfész: EKEIDR
  funkció: F-0078
  adatok:
    bemenet: DS-0090 # VIHAR érkeztetési adatok
    kimenet: DS-0102 # EKEIDR érkeztetési adatok
```

#### 2.3.2 Kimenő/belső dokumentumok iktatása

```yaml
kimeno_iktatas:
  interfész: EKEIDR
  funkció: F-0080
  adatok:
    bemenet: DS-0087
    kimenet: DS-0094
```

## 3. Funkciókatalógus

### 3.1 Külső Funkciók (External)

```yaml
kulso_funkciok:
  - funkció_id: F-0069
    megnevezés: "Kérelem kitöltése"
    kategória: Adatrögzítés
    paraméterek: 
      - ügytípus_paraméterek
      - kérelem_adatlap_paraméterek
    
  - funkció_id: F-0070
    megnevezés: "Díjkalkulátor"
    kategória: Díjkezelés
    
  - funkció_id: F-0082
    megnevezés: "Díjbekérő előállítása"
    kategória: Díjkezelés
    
  - funkció_id: F-0083
    megnevezés: "Online díjfizetés interfész"
    kategória: Díjkezelés
    
  - funkció_id: F-0084
    megnevezés: "Kérelem mellékletek"
    kategória: Dokumentumkezelés
    
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
    
  - funkció_id: F-0090
    megnevezés: "VNY024 Vasútegészségügyi adatok"
    kategória: Nyilvántartás
    specifikus: Vasút_modul
    
  - funkció_id: F-0091
    megnevezés: "Végzés tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
  - funkció_id: F-0092
    megnevezés: "Határozat tervezet elkészítése"
    kategória: Dokumentumgenerálás
    sablon: Paraméterezett
    
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
      - kérelem_tárgya
      
  DS-0085:
    megnevezés: "Kérelem döntési adatai"
    mezők:
      - döntés_típus
      - döntés_indoklás
      - jogi_forma
      - döntés_dátum
      - döntéshozó
      
  DS-0092:
    megnevezés: "Ügyfél (kérelmező) adatok"
    mezők:
      - név
      - születési_adatok
      - lakcím
      - értesítési_cím
      - képviselő_adatok
      
  DS-0097:
    megnevezés: "Kérelem mellékletek"
    mezők:
      - melléklet_típus
      - fájlnév
      - feltöltés_dátum
      - méret
```

### 4.2 Ellenőrzési Listák

```yaml
ellenorzesi_listak:
  DS-0104:
    megnevezés: "Hatáskör és illetékesség vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
    
  DS-0081:
    megnevezés: "Formai megfelelőségi vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
    
  DS-0091:
    megnevezés: "Tartalmi megfelelőség vizsgálat: ellenőrzési lista"
    paraméterezhetőség: ügytípusonként
```

### 4.3 Vasút-specifikus Adatok

```yaml
vasut_specifikus:
  DS-0096:
    megnevezés: "VNY024 Vasútegészségügyi adatok"
    forrás: VNY024 nyilvántartás
    mezők:
      - vizsgálat_típus
      - alkalmasság
      - érvényesség
      - korlátozások
      
  DS-0119:
    megnevezés: "VEÜ adatbázis"
    forrás: Vasútegészségügyi adatbázis
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
```

### 5.2 Belső Szerepkörök

```yaml
belso_szerepkorok:
  VHF_UGYINTEZO:
    megnevezés: "VHF Ügyintéző"
    szervezet: "Építési és Közlekedési Minisztérium"
    szervezeti_egység: "Vasúti Hatósági Főosztály"
    jogosultságok:
      - kérelem_vizsgálat
      - formai_ellenőrzés
      - tartalmi_ellenőrzés
      - döntés_előkészítés
      - dokumentum_generálás
      - nyilvántartás_frissítés
    interfész: Internal
    
  VHF_DONTESHOZO:
    megnevezés: "VHF Döntéshozó"
    szervezet: "Építési és Közlekedési Minisztérium"
    szervezeti_egység: "Vasúti Hatósági Főosztály"
    jogosultságok:
      - döntéshozatal
      - kiadmányozás
      - jóváhagyás
      - elutasítás
    interfész: Internal
```

## 6. Dokumentum Sablonok

```yaml
dokumentum_sablonok:
  kimenő_dokumentumok:
    - típus: "Hiánypótlási felszólítás"
      sablon_id: DC-0040
      paraméterezhetőség: igen
      
    - típus: "Ügyfél értesítés sommás eljárásról"
      sablon_id: DC-0044
      paraméterezhetőség: igen
      
    - típus: "Ügyfél értesítés teljes eljárásról"
      sablon_id: DC-0045
      paraméterezhetőség: igen
      
    - típus: "Végzés"
      altípusok:
        - "Elutasító végzés"
        - "Áttételi végzés"
      paraméterezhetőség: igen
      
    - típus: "Határozat"
      altípusok:
        - "Engedélyezés"
        - "Elutasítás"
      paraméterezhetőség: igen
      
    - típus: "Érdemi döntés: Igazolás"
      sablon_id: DC-0046
      paraméterezhetőség: igen
      
  bejövő_dokumentumok:
    - típus: "Kérelem adatlap vasútegészségügyi vizsgálathoz"
      sablon_id: DC-0039
      
    - típus: "Hiánypótlás"
      sablon_id: DC-0041
      
    - típus: "Díjfizetési igazolás"
      sablon_id: DC-0038
```

## 7. Paraméterezhetőségi Pontok

```yaml
parameterezheto_elemek:
  ellenorzesi_listak:
    - hatáskör_illetékesség_kritériumok
    - formai_követelmények_listája
    - tartalmi_követelmények_listája
    - kötelező_mellékletek
    
  hataridok:
    - sommás_eljárás: 8_nap
    - teljes_eljárás: 60_nap
    - hiánypótlás: 15_nap_alap
    - tényállás_tisztázás: rugalmas
    
  dijak:
    - eljárási_díj_mértéke
    - díjfizetési_módok
    - kedvezmények
    
  dokumentum_sablonok:
    - fejléc_lábléc
    - aláírási_jogkörök
    - címzettek_köre
    
  dontes_tipusok:
    - jogi_formák
    - döntési_opciók
    - jogorvoslati_lehetőségek
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
    
  VNY024_nyilvantartas:
    típus: "Belső nyilvántartás"
    cél: "Vasútegészségügyi adatok"
    műveletek:
      - lekérdezés
      - frissítés
      
  FORRAS_SQL:
    típus: "Pénzügyi rendszer"
    cél: "Díjfizetés ellenőrzés"
    protokoll: "SQL interfész"
```

## 9. Monitoring és Határidők

```yaml
monitoring:
  hataridok_figyelese:
    - sommás_eljárás_figyelés: 8_nap
    - teljes_eljárás_figyelés: 60_nap
    - hiánypótlás_teljesítés: 15_nap
    - vezetői_döntés: 5_nap
    
  riasztasok:
    - határidő_előtt_3_nap
    - határidő_előtt_1_nap
    - határidő_lejárat
    
  eszkalacios_szabalyok:
    - első_szint: ügyintéző
    - második_szint: csoportvezető
    - harmadik_szint: főosztályvezető
```

## 10. Implementációs Megfontolások

```yaml
implementacio:
  modularis_felepites:
    - közös_funkciók_használata
    - paraméterezett_workflow_motor
    - rugalmas_sablon_kezelés
    
  bovithetoseg:
    - új_eljárástípusok_hozzáadása
    - workflow_lépések_testreszabása
    - új_dokumentum_típusok
    
  verziokezeles:
    - workflow_verziók_kezelése
    - sablon_verziók_nyilvántartása
    - konfigurációs_változások_naplózása
```