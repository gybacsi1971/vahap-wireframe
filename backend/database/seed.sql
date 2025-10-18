-- ============================================================================
-- VAHAP 2.0 - Seed Adatok (Mock adatok migrálása)
-- ============================================================================
-- Verzió: 1.0
-- Dátum: 2025-10-18
-- Leírás: Tesztadatok feltöltése az adatbázisba
-- ============================================================================

-- ====================
-- ÜGYTÍPUSOK
-- ====================

INSERT INTO ugytipus (kod, megnevezes, modul, jogszabaly, aktiv) VALUES
('V-044', 'Vasúti járművezetők előzetes alkalmassági vizsgálata', 'vasut', '123/2023. (XII. 15.) Korm. rendelet', 1),
('H-052', 'Országos közforgalmú kikötő létesítése', 'hajozas', '456/2023. (XII. 20.) Korm. rendelet', 1);

-- ====================
-- ELLENŐRZÉSI LISTÁK (F-0064, F-0065, F-0066)
-- ====================

-- F-0064 - Hatáskör és illetékesség
INSERT INTO ellenorzesi_lista (lista_kod, megnevezes, leiras, aktiv) VALUES
('F-0064', 'Hatáskör és illetékesség vizsgálat', 'UCE-1793, UCE-1987 használati esetekhez', 1);

INSERT INTO ellenorzesi_kriterium (lista_id, megnevezes, leiras, sorrend, kotelezo, aktiv) VALUES
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Az ügytípus a megfelelő hatóság hatáskörébe tartozik',
 'V-044: Vasúti Hatósági Főosztály, H-052: Hajózási Hatósági Főosztály',
 1, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Az ügyfél jogosult a kérelem benyújtására',
 'Vasút: vasúti társaság vagy munkáltató; Hajózás: kikötő üzemeltető vagy tulajdonos',
 2, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Az eljárás területi illetékessége biztosított',
 'Központi hatóság - országos illetékesség mindkét modul esetén',
 3, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Az ügytípus (V-044) vasúti járművezető alkalmassági vizsgálat',
 'Csak vasúti ügyek esetén alkalmazandó kritérium',
 4, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Kikötő típusa országos közforgalmú vagy határkikötő',
 'Csak hajózási ügyek esetén alkalmazandó kritérium',
 5, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0064'),
 'Díjfizetési kötelezettség teljesítve',
 'Igazgatási szolgáltatási díj befizetésének ellenőrzése',
 6, 0, 1);

-- F-0065 - Formai megfelelőség
INSERT INTO ellenorzesi_lista (lista_kod, megnevezes, leiras, aktiv) VALUES
('F-0065', 'Formai megfelelőség vizsgálata', 'UCE-1799 használati esethez', 1);

INSERT INTO ellenorzesi_kriterium (lista_id, megnevezes, leiras, sorrend, kotelezo, aktiv) VALUES
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Kérelem űrlap szabályszerűen kitöltve',
 'Minden kötelező mező kitöltésre került',
 1, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Kötelező mellékletek csatolva',
 'Összes szükséges dokumentum csatolásra került',
 2, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Személyazonosító okmány másolat',
 'Érvényes személyi igazolvány vagy útlevél másolata',
 3, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Lakcímkártya másolat',
 'Hatályos lakcímkártya másolata',
 4, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Vasútegészségügyi alkalmasság igazolása',
 'Vasúti ügyek (V-044) esetén kötelező',
 5, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0065'),
 'Eljárási díj megfizetve',
 'Díjbekérő alapján fizetési igazolás',
 6, 1, 1);

-- F-0066 - Tartalmi megfelelőség
INSERT INTO ellenorzesi_lista (lista_kod, megnevezes, leiras, aktiv) VALUES
('F-0066', 'Tartalmi megfelelőség vizsgálata', 'UCE-1794 használati esethez', 1);

INSERT INTO ellenorzesi_kriterium (lista_id, megnevezes, leiras, sorrend, kotelezo, aktiv) VALUES
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'Kérelmező életkora megfelelő (min. 18 év)',
 'Nagykorúság vizsgálata',
 1, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'Egészségügyi alkalmasság érvényes',
 'Orvosi igazolás dátuma és érvényességi ideje',
 2, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'VNY024 nyilvántartás adatok ellenőrizve (F-0090)',
 'Vasútegészségügyi nyilvántartás lekérdezése',
 3, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'Szakmai előképzettség igazolt',
 'Tanúsítvány vagy képesítési igazolás ellenőrzése',
 4, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'Nincs kizáró ok (pl. büntetett előélet)',
 'Hatósági nyilvántartások ellenőrzése',
 5, 1, 1),
((SELECT id FROM ellenorzesi_lista WHERE lista_kod = 'F-0066'),
 'Képzési követelmények teljesítve',
 'Képzési bizonyítvány meglétének ellenőrzése',
 6, 0, 1);

-- ====================
-- HATÁRIDŐK
-- ====================

INSERT INTO hataridok (megnevezes, kod, napok, tipus, leiras, aktiv) VALUES
('Formai ellenőrzés határideje', 'HAT-001', 8, 'munkanap', 'Sommás eljárás keretében', 1),
('Teljes eljárás határideje', 'HAT-002', 60, 'munkanap', 'Általános ügyintézési határidő', 1),
('Hiánypótlás minimum határideje', 'HAT-003', 8, 'munkanap', 'Minimum hiánypótlási határidő', 1),
('Hiánypótlás maximum határideje', 'HAT-004', 30, 'munkanap', 'Maximum hiánypótlási határidő', 1),
('Hiánypótlás alapértelmezett határideje', 'HAT-005', 15, 'munkanap', 'Általános hiánypótlási határidő', 1),
('Tényállás tisztázás alapértelmezett határideje', 'HAT-006', 15, 'munkanap', 'Általános tényállás tisztázás határidő', 1),
('Tényállás tisztázás maximum határideje', 'HAT-007', 30, 'munkanap', 'Maximum tényállás tisztázás határidő', 1),
('Fellebbezési határidő', 'HAT-008', 15, 'naptari', 'Jogorvoslati határidő', 1),
('Hajózási tényállás tisztázás alapértelmezett', 'HAT-009', 20, 'munkanap', 'Hajózási ügyek - helyszíni szemle miatt hosszabb', 1),
('Hajózási tényállás tisztázás maximum', 'HAT-010', 45, 'munkanap', 'Hajózási ügyek maximum határidő', 1);

-- ====================
-- DÍJTÉTELEK (F-0070) - Vasúti Modul
-- ====================

INSERT INTO dijtetelek (ugytipus_kod, megnevezes, osszeg, tipus, kotelezo, leiras, aktiv) VALUES
('V-044', 'Előzetes alkalmassági vizsgálat alapdíja', 12000, 'alapdij', 1,
 'Vasúti járművezető alkalmassági vizsgálat alapdíja', 1),
('V-044', 'Sürgősségi pótdíj', 8000, 'potdij', 0,
 'Sürgős ügyintézés esetén felszámítható', 1),
('V-044', 'Ismételt vizsgálat pótdíja', 6000, 'potdij', 0,
 'Hiánypótlás után újbóli vizsgálat díja', 1),
('V-044', 'Különleges kategória pótdíj', 4000, 'potdij', 0,
 'Speciális járműkategória esetén', 1),
('V-044', 'Dokumentáció másolat díja', 2000, 'potdij', 0,
 'Kérelmező általi dokumentum másolat', 1);

-- Vasúti Kedvezmények
INSERT INTO kedvezmenyek (ugytipus_kod, megnevezes, szazalek, leiras, aktiv) VALUES
('V-044', 'Munkahelyi átképzés keretében', 30,
 'Munkáltató által szervezett képzés esetén', 1),
('V-044', 'Fiatal pályakezdő kedvezmény', 20,
 'Első vizsgálat 25 év alatt', 1),
('V-044', 'Többszörös kategória kedvezmény', 15,
 'Egyszerre több kategória vizsgálata esetén', 1),
('V-044', 'Megváltozott munkaképességű kedvezmény', 50,
 'MMK igazolással rendelkező kérelmező', 1);

-- ====================
-- DÍJTÉTELEK (F-0070) - Hajózási Modul
-- ====================

INSERT INTO dijtetelek (ugytipus_kod, megnevezes, osszeg, tipus, kotelezo, leiras, aktiv) VALUES
('H-052', 'Kikötő létesítési engedély alapdíja', 250000, 'alapdij', 1,
 'Országos közforgalmú kikötő létesítésének alapdíja', 1),
('H-052', 'Műszaki terv felülvizsgálati díj', 80000, 'potdij', 1,
 'Kötelező műszaki terv ellenőrzés díja', 1),
('H-052', 'Helyszíni szemle díja', 120000, 'potdij', 0,
 'Szakhatósági helyszíni szemle költsége', 1),
('H-052', 'Környezetvédelmi vizsgálat díja', 150000, 'potdij', 0,
 'Környezeti hatásvizsgálat díja', 1),
('H-052', 'Sürgősségi pótdíj', 100000, 'potdij', 0,
 'Sürgős ügyintézés esetén felszámítható', 1);

-- Hajózási Kedvezmények
INSERT INTO kedvezmenyek (ugytipus_kod, megnevezes, szazalek, leiras, aktiv) VALUES
('H-052', 'Közhasznú kikötő kedvezmény', 25,
 'Közhasznú kikötőként történő üzemeltetés esetén', 1),
('H-052', 'Vállalkozás fejlesztési program', 20,
 'Uniós vagy állami fejlesztési program keretében', 1),
('H-052', 'Kisvállalkozói kedvezmény', 30,
 'KATA vagy kisvállalkozói igazolással', 1);

-- ====================
-- DOKUMENTUM SABLONOK (F-0091 - F-0095)
-- ====================

-- Végzés sablonok
INSERT INTO dokumentum_sablonok (kod, megnevezes, tipus, modul, sablon_fajl, leiras, aktiv) VALUES
('VEG-001', 'Végzés - Hiánypótlási felszólítás', 'vegzes', 'kozos',
 'templates/vegzes_hianypotlas.docx',
 'Hiánypótlásra felszólító végzés sablon', 1),
('VEG-002', 'Végzés - Eljárás felfüggesztése', 'vegzes', 'kozos',
 'templates/vegzes_felfuggesztes.docx',
 'Eljárás felfüggesztését elrendelő végzés', 1),
('VEG-003', 'Végzés - Tárgyalás összehívása', 'vegzes', 'kozos',
 'templates/vegzes_targyalas.docx',
 'Tárgyalás összehívása végzés', 1);

-- Határozat sablonok
INSERT INTO dokumentum_sablonok (kod, megnevezes, tipus, modul, sablon_fajl, leiras, aktiv) VALUES
('HAT-001', 'Határozat - Engedélyező', 'hatrozat', 'kozos',
 'templates/hatarozat_engedelyezo.docx',
 'Engedélyező határozat sablon', 1),
('HAT-002', 'Határozat - Elutasító', 'hatrozat', 'kozos',
 'templates/hatarozat_elutasito.docx',
 'Elutasító határozat sablon', 1),
('HAT-003', 'Határozat - Vasúti alkalmassági (V-044)', 'hatrozat', 'vasut',
 'templates/hatarozat_vasut_alkalmassag.docx',
 'Vasúti járművezető alkalmassági határozat', 1),
('HAT-004', 'Határozat - Kikötő engedély (H-052)', 'hatrozat', 'hajozas',
 'templates/hatarozat_kikoto_engedely.docx',
 'Kikötő létesítési engedély határozat', 1);

-- Igazolás sablonok
INSERT INTO dokumentum_sablonok (kod, megnevezes, tipus, modul, sablon_fajl, leiras, aktiv) VALUES
('IGA-001', 'Igazolás - Kérelem átvétele', 'igazolas', 'kozos',
 'templates/igazolas_atvetel.docx',
 'Kérelem átvételéről szóló igazolás', 1),
('IGA-002', 'Igazolás - Eljárás befejezése', 'igazolas', 'kozos',
 'templates/igazolas_befejezes.docx',
 'Eljárás befejezéséről szóló igazolás', 1);

-- Tájékoztatás sablonok
INSERT INTO dokumentum_sablonok (kod, megnevezes, tipus, modul, sablon_fajl, leiras, aktiv) VALUES
('TAJ-001', 'Tájékoztatás - Hiánypótlás beérkezett', 'tajekoztatas', 'kozos',
 'templates/tajekoztatas_hianypotlas_beerkezett.docx',
 'Hiánypótlás beérkezéséről tájékoztatás', 1),
('TAJ-002', 'Tájékoztatás - Eljárás státusza', 'tajekoztatas', 'kozos',
 'templates/tajekoztatas_statusz.docx',
 'Ügy aktuális státuszáról tájékoztatás', 1);

-- Hirdetmény sablonok
INSERT INTO dokumentum_sablonok (kod, megnevezes, tipus, modul, sablon_fajl, leiras, aktiv) VALUES
('HIR-001', 'Hirdetmény - Határozat közzététele', 'hirdetmeny', 'kozos',
 'templates/hirdetmeny_hatarozat.docx',
 'Határozat nyilvános közzététele', 1);

-- ====================
-- WORKFLOW SABLONOK
-- ====================

INSERT INTO workflow_sablonok (kod, megnevezes, ugytipus_kod, lepesek_szama, leiras, aktiv) VALUES
('WF-V044-001', 'Vasúti járművezető alkalmassági vizsgálat', 'V-044', 12,
 'Teljes workflow a vasúti járművezető alkalmassági vizsgálathoz', 1),
('WF-H052-001', 'Kikötő létesítési engedélyezési eljárás', 'H-052', 15,
 'Teljes workflow a kikötő létesítési engedélyezési eljáráshoz', 1);

-- Vasúti workflow lépések (WF-V044-001)
INSERT INTO workflow_lepesek (workflow_id, uce_kod, megnevezes, sorrend, kotelezo, hataridő_napok, felelős_szerepkor, leiras) VALUES
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1987', 'Hatáskör és illetékesség vizsgálata', 1, 1, 2, 'VHF_UGYINTEZO', 'F-0064 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1799', 'Formai megfelelőség vizsgálata', 2, 1, 3, 'VHF_UGYINTEZO', 'F-0065 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1800', 'Sommás eljárás alkalmazhatóságának döntése', 3, 1, 1, 'VHF_VEZETO', 'Döntési pont'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1794', 'Tartalmi megfelelőség vizsgálata', 4, 1, 5, 'VHF_UGYINTEZO', 'F-0066 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1826', 'Döntési javaslat elkészítése', 5, 1, 10, 'VHF_UGYINTEZO', 'F-0074 Döntési javaslat'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1824', 'Döntési javaslat véleményeztetése', 6, 0, 5, 'VHF_VELEMENYEZO', 'F-0096 Véleményezés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1809', 'Vezetői döntéshozatal', 7, 1, 5, 'VHF_VEZETO', 'F-0099 Vezetői döntés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1810', 'Határozat tervezet készítése', 8, 1, 5, 'VHF_UGYINTEZO', 'F-0092 Határozat'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1815', 'Kiadmányozás', 9, 1, 2, 'VHF_KIADMANYOZO', 'F-0099 Kiadmányozás'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1828', 'Ügyfél értesítése', 10, 1, 3, 'VHF_UGYINTEZO', 'F-0089 Értesítés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1830', 'Nyilvántartás frissítése', 11, 1, 2, 'VHF_UGYINTEZO', 'F-0090 VNY024'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'UCE-1828', 'Ügy lezárása', 12, 1, 1, 'VHF_UGYINTEZO', 'F-0097 Lezárás');

-- Hajózási workflow lépések (WF-H052-001)
INSERT INTO workflow_lepesek (workflow_id, uce_kod, megnevezes, sorrend, kotelezo, hataridő_napok, felelős_szerepkor, leiras) VALUES
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-1987', 'Hatáskör és illetékesség vizsgálata', 1, 1, 2, 'HHF_UGYINTEZO', 'F-0064 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-1993', 'Formai megfelelőség vizsgálata', 2, 1, 3, 'HHF_UGYINTEZO', 'F-0065 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-1994', 'Sommás eljárás alkalmazhatóságának döntése', 3, 1, 1, 'HHF_VEZETO', 'Döntési pont'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-1988', 'Tartalmi megfelelőség vizsgálata', 4, 1, 5, 'HHF_UGYINTEZO', 'F-0066 Ellenőrzési lista'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2051', 'Helyszíni szemle lefolytatása', 5, 1, 10, 'HHF_SZAKERTO', 'F-0102 Tényállás tisztázás'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2045', 'Szakhatósági állásfoglalás kérése', 6, 1, 15, 'HHF_UGYINTEZO', 'F-0102 Tényállás tisztázás'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2020', 'Döntési javaslat elkészítése', 7, 1, 10, 'HHF_UGYINTEZO', 'F-0074 Döntési javaslat'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2018', 'Döntési javaslat véleményeztetése', 8, 0, 5, 'HHF_VELEMENYEZO', 'F-0096 Véleményezés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2003', 'Vezetői döntéshozatal', 9, 1, 5, 'HHF_VEZETO', 'F-0099 Vezetői döntés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2004', 'Határozat tervezet készítése', 10, 1, 5, 'HHF_UGYINTEZO', 'F-0092 Határozat'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2015', 'Kiadmányozás', 11, 1, 2, 'HHF_KIADMANYOZO', 'F-0099 Kiadmányozás'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2022', 'Ügyfél értesítése', 12, 1, 3, 'HHF_UGYINTEZO', 'F-0089 Értesítés'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2023', 'Nyilvántartás frissítése', 13, 1, 2, 'HHF_UGYINTEZO', 'F-0106 HNY501'),
((SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'UCE-2022', 'Ügy lezárása', 14, 1, 1, 'HHF_UGYINTEZO', 'F-0097 Lezárás');

-- ====================
-- SZEREPKÖRÖK ÉS JOGOSULTSÁGOK
-- ====================

INSERT INTO szerepkorok (kod, nev, leiras, aktiv) VALUES
('VHF_ADMIN', 'Rendszergazda', 'Teljes hozzáférés az összes funkcióhoz', 1),
('VHF_VEZETO', 'Vasúti Vezető Ügyintéző', 'Döntéshozatali jogosultság vasúti ügyekben', 1),
('VHF_UGYINTEZO', 'Vasúti Ügyintéző', 'Általános ügyintézői jogosultságok', 1),
('VHF_VELEMENYEZO', 'Vasúti Véleményező', 'Döntési javaslatok véleményezése', 1),
('VHF_KIADMANYOZO', 'Vasúti Kiadmányozó', 'Dokumentumok aláírása, kiadmányozása', 1),
('HHF_VEZETO', 'Hajózási Vezető Ügyintéző', 'Döntéshozatali jogosultság hajózási ügyekben', 1),
('HHF_UGYINTEZO', 'Hajózási Ügyintéző', 'Általános ügyintézői jogosultságok', 1),
('HHF_VELEMENYEZO', 'Hajózási Véleményező', 'Döntési javaslatok véleményezése', 1),
('HHF_KIADMANYOZO', 'Hajózási Kiadmányozó', 'Dokumentumok aláírása, kiadmányozása', 1),
('HHF_SZAKERTO', 'Hajózási Szakértő', 'Helyszíni szemle, szakértői vélemény', 1);

-- Jogosultságok - Rendszergazda
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('VHF_ADMIN', '*', 'Minden funkció elérhető');

-- Jogosultságok - Vasúti Vezető
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('VHF_VEZETO', 'kerelem_vizsgalat', 'Kérelmek vizsgálata'),
('VHF_VEZETO', 'formai_ellenorzes', 'Formai megfelelőség ellenőrzése'),
('VHF_VEZETO', 'tartalmi_ellenorzes', 'Tartalmi megfelelőség ellenőrzése'),
('VHF_VEZETO', 'donteshozatal', 'Vezetői döntéshozatal'),
('VHF_VEZETO', 'velemenyezes', 'Döntési javaslatok véleményezése'),
('VHF_VEZETO', 'hianypotlas', 'Hiánypótlás kezdeményezése');

-- Jogosultságok - Vasúti Ügyintéző
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('VHF_UGYINTEZO', 'kerelem_vizsgalat', 'Kérelmek vizsgálata'),
('VHF_UGYINTEZO', 'formai_ellenorzes', 'Formai megfelelőség ellenőrzése'),
('VHF_UGYINTEZO', 'tartalmi_ellenorzes', 'Tartalmi megfelelőség ellenőrzése'),
('VHF_UGYINTEZO', 'hianypotlas', 'Hiánypótlás kezdeményezése'),
('VHF_UGYINTEZO', 'tenyallas_tisztazas', 'Tényállás tisztázás');

-- Jogosultságok - Vasúti Véleményező
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('VHF_VELEMENYEZO', 'velemenyezes', 'Döntési javaslatok véleményezése');

-- Jogosultságok - Vasúti Kiadmányozó
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('VHF_KIADMANYOZO', 'kiadmanyozas', 'Dokumentumok kiadmányozása');

-- Jogosultságok - Hajózási Vezető
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('HHF_VEZETO', 'kerelem_vizsgalat', 'Kérelmek vizsgálata'),
('HHF_VEZETO', 'formai_ellenorzes', 'Formai megfelelőség ellenőrzése'),
('HHF_VEZETO', 'tartalmi_ellenorzes', 'Tartalmi megfelelőség ellenőrzése'),
('HHF_VEZETO', 'donteshozatal', 'Vezetői döntéshozatal'),
('HHF_VEZETO', 'velemenyezes', 'Döntési javaslatok véleményezése'),
('HHF_VEZETO', 'hianypotlas', 'Hiánypótlás kezdeményezése');

-- Jogosultságok - Hajózási Ügyintéző
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('HHF_UGYINTEZO', 'kerelem_vizsgalat', 'Kérelmek vizsgálata'),
('HHF_UGYINTEZO', 'formai_ellenorzes', 'Formai megfelelőség ellenőrzése'),
('HHF_UGYINTEZO', 'tartalmi_ellenorzes', 'Tartalmi megfelelőség ellenőrzése'),
('HHF_UGYINTEZO', 'hianypotlas', 'Hiánypótlás kezdeményezése'),
('HHF_UGYINTEZO', 'tenyallas_tisztazas', 'Tényállás tisztázás');

-- Jogosultságok - Hajózási Véleményező
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('HHF_VELEMENYEZO', 'velemenyezes', 'Döntési javaslatok véleményezése');

-- Jogosultságok - Hajózási Kiadmányozó
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('HHF_KIADMANYOZO', 'kiadmanyozas', 'Dokumentumok kiadmányozása');

-- Jogosultságok - Hajózási Szakértő
INSERT INTO jogosultsagok (szerepkor_kod, jogosultsag, leiras) VALUES
('HHF_SZAKERTO', 'helyszini_szemle', 'Helyszíni szemle végzése'),
('HHF_SZAKERTO', 'szakertoi_velemeny', 'Szakértői vélemény készítése');

-- ====================
-- FELHASZNÁLÓK (Tesztfelhasználók)
-- ====================

INSERT INTO felhasznalok (azonosito, nev, email, telefonszam, beosztas, szervezet, szervezeti_egyseg, szerepkor_kod, aktiv) VALUES
('EKM001', 'Dr. Szabó Péter', 'szabo.peter@ekm.gov.hu', '+36301111111', 'Vezető ügyintéző',
 'Építési és Közlekedési Minisztérium', 'Vasúti Hatósági Főosztály', 'VHF_VEZETO', 1),
('EKM002', 'Nagy Andrea', 'nagy.andrea@ekm.gov.hu', '+36301111112', 'Ügyintéző',
 'Építési és Közlekedési Minisztérium', 'Vasúti Hatósági Főosztály', 'VHF_UGYINTEZO', 1),
('EKM003', 'Kovács László', 'kovacs.laszlo@ekm.gov.hu', '+36301111113', 'Ügyintéző',
 'Építési és Közlekedési Minisztérium', 'Vasúti Hatósági Főosztály', 'VHF_UGYINTEZO', 1),
('EKM004', 'Dr. Horváth Éva', 'horvath.eva@ekm.gov.hu', '+36301111114', 'Vezető ügyintéző',
 'Építési és Közlekedési Minisztérium', 'Hajózási Hatósági Főosztály', 'HHF_VEZETO', 1),
('EKM005', 'Tóth Gábor', 'toth.gabor@ekm.gov.hu', '+36301111115', 'Ügyintéző',
 'Építési és Közlekedési Minisztérium', 'Hajózási Hatósági Főosztály', 'HHF_UGYINTEZO', 1),
('EKM006', 'Kiss Mária', 'kiss.maria@ekm.gov.hu', '+36301111116', 'Szakértő',
 'Építési és Közlekedési Minisztérium', 'Hajózási Hatósági Főosztály', 'HHF_SZAKERTO', 1),
('ADMIN', 'Rendszergazda', 'admin@vahap.gov.hu', '+36301111100', 'Rendszergazda',
 'Építési és Közlekedési Minisztérium', 'IT Osztály', 'VHF_ADMIN', 1);

-- ====================
-- TESZTADATOK - ÜGYFELEK
-- ====================

INSERT INTO ugyfelek (nev, szuletesi_nev, szuletesi_hely, szuletesi_datum, anya_neve,
                      lakcim_iranyitoszam, lakcim_telepules, lakcim_kozterulet, lakcim_hazszam,
                      telefonszam, email) VALUES
('Kovács János', 'Kovács János', 'Budapest', '1985-03-15', 'Nagy Mária',
 '1052', 'Budapest', 'Váci utca', '12/2/5',
 '+36301234567', 'kovacs.janos@example.hu'),
('Szabó Anna', 'Szabó Anna', 'Szeged', '1990-07-22', 'Kiss Erzsébet',
 '6720', 'Szeged', 'Kossuth Lajos sugárút', '45',
 '+36309876543', 'szabo.anna@example.hu'),
('Danube Port Kft.', NULL, NULL, NULL, NULL,
 '1117', 'Budapest', 'Dombóvári út', '27',
 '+36301112233', 'info@danubeport.hu');

-- ====================
-- TESZTADATOK - ÜGYEK
-- ====================

INSERT INTO ugyek (ugyazonosito, ugytipus_kod, ugyfel_id, statusz, benyujtas_datum, hatarido,
                   ugyintezo_id, workflow_sablon_id, megjegyzesek) VALUES
('VAHAP-V-2024-001234', 'V-044',
 (SELECT id FROM ugyfelek WHERE nev = 'Kovács János'),
 'folyamatban', '2024-10-15', '2024-11-15',
 (SELECT id FROM felhasznalok WHERE azonosito = 'EKM002'),
 (SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'Előzetes alkalmassági vizsgálat - Első kérelem'),

('VAHAP-V-2024-000987', 'V-044',
 (SELECT id FROM ugyfelek WHERE nev = 'Kovács János'),
 'hianypotlas', '2024-10-01', '2024-11-05',
 (SELECT id FROM felhasznalok WHERE azonosito = 'EKM003'),
 (SELECT id FROM workflow_sablonok WHERE kod = 'WF-V044-001'),
 'Hiánypótlás szükséges - Hiányzik az egészségügyi igazolás'),

('VAHAP-H-2024-005678', 'H-052',
 (SELECT id FROM ugyfelek WHERE nev = 'Danube Port Kft.'),
 'folyamatban', '2024-10-01', '2024-12-01',
 (SELECT id FROM felhasznalok WHERE azonosito = 'EKM005'),
 (SELECT id FROM workflow_sablonok WHERE kod = 'WF-H052-001'),
 'Kikötő létesítés - Országos közforgalmú kikötő');

-- ====================
-- TESZTADATOK - ÜGY ELŐZMÉNYEK
-- ====================

INSERT INTO ugy_elozmeny (ugy_id, esemeny_tipus, leiras, regi_ertek, uj_ertek, felhasznalo_id) VALUES
((SELECT id FROM ugyek WHERE ugyazonosito = 'VAHAP-V-2024-001234'),
 'statusz_valtas', 'Ügy státusza megváltozott', 'beerkezett', 'folyamatban',
 (SELECT id FROM felhasznalok WHERE azonosito = 'EKM002')),

((SELECT id FROM ugyek WHERE ugyazonosito = 'VAHAP-V-2024-000987'),
 'statusz_valtas', 'Hiánypótlás szükségessége megállapítva', 'folyamatban', 'hianypotlas',
 (SELECT id FROM felhasznalok WHERE azonosito = 'EKM003'));

-- ====================
-- TESZTADATOK - NYILVÁNTARTÁSOK
-- ====================

-- VNY024 - Vasútegészségügyi Nyilvántartás
INSERT INTO vny024_nyilvantartas (ugy_id, nev, szuletesi_datum, vizsgalat_tipusa,
                                   vizsgalat_eredmeny, ervenyesseg_kezdete, ervenyesseg_vege, megjegyzesek) VALUES
(NULL, 'Kovács János', '1985-03-15', 'Előzetes alkalmassági vizsgálat',
 'Alkalmas', '2024-01-10', '2025-01-10', 'Korábbi vizsgálat eredménye');

-- HNY501 - Hajózási Létesítmények Nyilvántartása
INSERT INTO hny501_nyilvantartas (ugy_id, letesitmeny_neve, letesitmeny_tipus, helyszin,
                                   uzemelteto, engedelyszam, ervenyesseg_kezdete, ervenyesseg_vege, megjegyzesek) VALUES
(NULL, 'Csepel Szabadkikötő', 'Országos közforgalmú kikötő', 'Budapest, XXI. kerület',
 'Budapest Port Zrt.', 'KIK-2020-0045', '2020-05-15', '2030-05-15', 'Működő kikötő');

-- ====================
-- VAKUUM ÉS OPTIMIZE
-- ====================

VACUUM;
ANALYZE;
