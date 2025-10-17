# 🚀 VAHAP v3 - Gyors Indítás

## 1️⃣ Webszerver indítása

Nyiss egy terminált és futtasd:

```bash
cd "/Users/galamboslaszlo/Library/Mobile Documents/com~apple~CloudDocs/_claude project/VAHAP/vihar-system"

python3 -m http.server 8000
```

## 2️⃣ Alkalmazás megnyitása böngészőben

### Teszt oldal (egyszerű Vue teszt):
```
http://localhost:8000/vasut/belso/test-v3.html
```

### Teljes alkalmazás (workflow komponensekkel):
```
http://localhost:8000/vasut/belso/ugy-munkalap-v3.html
```

## 3️⃣ Ellenőrzés

A böngészőben nyisd meg a Console-t (**F12**), és nézd meg a debug üzeneteket:

```
=== VAHAP v3 Debug Info ===
Vue betöltve: true
VahapMunkalapV3App létezik: true
WfChecklist létezik: true
...
=========================
VAHAP Munkalap v3 Vue alkalmazás elindítva
VAHAP Munkalap v3 inicializálva
```

Ha minden `true`, akkor minden komponens betöltődött! ✅

## ❌ Probléma?

### "Vue betöltve: false"
- Nincs internetkapcsolat (Vue CDN-ről töltődik)
- Próbáld újratölteni az oldalt (Ctrl+F5)

### CORS hibák a Console-ban
- NE közvetlenül nyisd meg a fájlt (file://)!
- Mindig használj webszervert (lásd 1. lépés)

### Üres oldal / {{ }} szövegek
- A Vue nem inicializálódott
- Ellenőrizd a Console hibaüzeneteket
- Töröld a böngésző cache-t (Ctrl+Shift+Del)

## 📚 További info

Részletes dokumentáció: [README-v3.md](vasut/belso/README-v3.md)

---

**Kész!** Most már használhatod a VAHAP v3 ügyintézői felületet! 🎉
