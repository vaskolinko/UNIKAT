# Pregled prevzetega projekta UNIKAT

Pri prevzemu projekta sem pregledal dokumentacijo v mapi docs, kodo frontenda in backenda ter aplikacijo zagnal lokalno. V nadaljevanju je opisano, kaj je bilo narejeno za MVP in ali to zadošča uporabniškim zgodbam.

## Implementirane funkcionalnosti za MVP

V dokumentu 02-funkcionalnosti-in-obseg.md je za MVP predvidenih sedem funkcionalnosti. V celoti je implementirana samo prva, uporabniški računi in vloge. Za rezervacije in naročila šopkov je pripravljen podatkovni model, ostale funkcionalnosti pa še niso narejene.

| Funkcionalnost | Stanje |
|---|---|
| Uporabniški računi in vloge | Implementirano |
| Koledar razpoložljivih terminov | Ni implementirano |
| Zahteva za rezervacijo termina | Samo tabela v bazi |
| Potrjevanje ali zavračanje rezervacij | Ni implementirano |
| Naročilo šopka ali aranžmaja | Samo tabela v bazi |
| Upravljanje naročil šopkov | Samo polja v tabeli |
| Dnevni e-poštni povzetek | Ni implementirano |

### Kaj deluje

- Registracija, prijava, odjava in preverjanje prijavljenega uporabnika prek API poti /api/auth/register, /api/auth/login, /api/auth/logout in /api/auth/me.
- Backend preveri, da so izpolnjena vsa polja, da je e-poštni naslov veljaven in še ni uporabljen ter da ima geslo vsaj 8 znakov.
- Gesla so shranjena zgoščeno z bcrypt. Seje so shranjene v bazi PostgreSQL, ob prijavi se seja ustvari na novo.
- Middleware requireAuth ščiti poti, ki zahtevajo prijavo. Zaenkrat je uporabljen samo na testni poti /api/protected.
- Pot /api/health za preverjanje, ali API deluje.
- Na frontendu so domača stran, obrazca za prijavo in registracijo, nadzorna plošča za prijavljenega uporabnika ter povezave na strani Naroči termin, Galerija in Skupnost.

### Kaj še manjka

- Strani Naroči termin, Galerija in Skupnost so samo statične in prikazujejo napis Kmalu na voljo.
- Za rezervacije in naročila šopkov obstajajo tabele v bazi, ni pa API poti, poslovnih pravil in obrazcev.
- Ni modela za razpoložljivost in delovni čas, ni koledarja, skrbniškega dela za lastnico, pošiljanja e-pošte in komentarjev.

## Ali implementacija zadošča uporabniškim zgodbam

Pregledal sem prvih pet uporabniških zgodb iz dokumenta 05-uporabniske-zgodbe.md, ker pokrivajo glavni del MVP.

| Zgodba | Zadošča |
|---|---|
| US-01 Uporabniški računi in vloge | Da |
| US-02 Koledar razpoložljivih terminov | Ne |
| US-03 Oddaja zahteve za rezervacijo | Ne, delno pripravljeno |
| US-04 Potrjevanje ali zavračanje rezervacij | Ne |
| US-05 Naročilo šopka ali aranžmaja | Ne, delno pripravljeno |

### US-01 Uporabniški računi in vloge: zadošča

Vsi pogoji sprejema so izpolnjeni:

| Pogoj | Izpolnjen | Opomba |
|---|---|---|
| Obvezna polja in veljaven e-poštni naslov | Da | Preverja se na frontendu in na backendu. |
| Unikaten e-poštni naslov | Da | Če naslov že obstaja, backend vrne napako 409. |
| Vloga CUSTOMER ob registraciji | Da | Vlogo nastavi strežnik. |
| Prijava, odjava in zaščitene strani | Da | Ob odjavi se seja izbriše. |
| Geslo ni shranjeno v čisti obliki | Da | Uporablja se bcrypt, geslo se ne vrača v odgovorih. |

Vloge OWNER in ADMIN so zapisane v podatkovnem modelu, preverjanja vlog na API-ju pa še ni, ker še ni funkcionalnosti, ki bi ga potrebovale.

### US-02 Koledar razpoložljivih terminov: ne zadošča

Koledar ni narejen. V bazi tudi ni tabele za razpoložljive termine ali obdobja, ko lastnica ni dosegljiva, zato noben pogoj sprejema ni izpolnjen.

### US-03 Oddaja zahteve za rezervacijo: delno pripravljeno, ne zadošča

Tabela Reservation vsebuje vrsto storitve (posvet ali ličenje), datum, opombo in status, ki je privzeto PENDING. To na ravni podatkov ustreza prvemu in tretjemu pogoju. Manjkajo pa API pot za oddajo zahteve, preverjanje, ali je termin prost, potrditev oddaje in obrazec. Stran Naroči termin prikazuje samo kartice s storitvami.

### US-04 Potrjevanje ali zavračanje rezervacij: ne zadošča

Statusa APPROVED in REJECTED sta definirana, ni pa skrbniškega pogleda, API poti za odločitev, preverjanja prekrivanja terminov in preverjanja, ali je uporabnik lastnica. Tabela Reservation tudi nima polj za razlog zavrnitve in čas odločitve, ki ju zahteva peti pogoj.

### US-05 Naročilo šopka ali aranžmaja: delno pripravljeno, ne zadošča

Tabela FlowerOrder vsebuje vse podatke iz prvega pogoja (vrsta, velikost, količina, način prevzema, želeni datum in opomba) in privzeti status PENDING. Manjkajo obrazec, API pot in preverjanje na strežniku, da je datum med današnjim dnem in enim mesecem vnaprej ter da je količina pozitivno celo število.

### Povzetek

Trenutna implementacija zadošča samo zgodbi US-01. Dokumentacija, podatkovni model in prijava so dobro pripravljeni, glavni del MVP, torej rezervacije in naročila, pa še ni narejen.

## Opažanja pri lokalnem zagonu

- V README je omenjena samo spremenljivka DATABASE_URL, backend pa se brez spremenljivke SESSION_SECRET ne zažene. V repozitoriju tudi ni primera datoteke .env.example.
- V README piše, da se za bazo uporablja Docker, ni pa ukaza ali datoteke docker-compose.yml za zagon PostgreSQL. Obe pomanjkljivosti sta zdaj dopolnjeni v README.