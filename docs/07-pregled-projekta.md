# 7. Pregled prevzetega projekta – UNIKAT

Dokument povzema stanje projekta UNIKAT ob prevzemu. Pregledani so bili dokumentacija v mapi `docs/` (zasnova, funkcionalnosti, podatkovni model, arhitektura, uporabniške zgodbe, wireframi in ADR-ji), koda frontenda in backenda ter delovanje aplikacije ob lokalnem zagonu.

## Implementirane funkcionalnosti za MVP

Od sedmih MVP funkcionalnosti iz `02-funkcionalnosti-in-obseg.md` je v celoti implementirana samo prva:

| MVP funkcionalnost | Stanje |
|---|---|
| Uporabniški računi in vloge | Implementirano (backend + frontend) |
| Koledar razpoložljivih terminov | Ni implementirano |
| Zahteva za rezervacijo termina | Samo podatkovni model (`Reservation`) |
| Potrjevanje ali zavračanje rezervacij | Ni implementirano |
| Naročilo šopka ali aranžmaja | Samo podatkovni model (`FlowerOrder`) |
| Upravljanje naročil šopkov | Samo podatkovni model (polja `decisionReason`, `decidedAt`) |
| Dnevni e-poštni povzetek | Ni implementirano |

**Uspešno implementirano:**

- API končne točke `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` in `GET /api/auth/me`.
- Strežniška validacija registracije (obvezna polja, oblika e-pošte, geslo vsaj 8 znakov, unikaten e-poštni naslov).
- Zgoščevanje gesel z bcrypt, seje shranjene v PostgreSQL (tabela `user_sessions`), regeneracija seje ob prijavi.
- Middleware `requireAuth` za zaščito API poti (trenutno uporabljen samo na testni poti `/api/protected`).
- Health endpoint `GET /api/health`.
- Frontend: domača stran, obrazca za prijavo in registracijo, nadzorna plošča prijavljenega uporabnika ter navigacija na strani Naroči termin, Galerija in Skupnost.

**Ni implementirano oziroma je samo nakazano:**

- Strani Naroči termin, Galerija in Skupnost so statične in prikazujejo oznako »Kmalu na voljo«.
- Za rezervacije in naročila šopkov obstajajo tabele v bazi, ni pa API končnih točk, poslovnih pravil ne obrazcev.
- Ni modela za razpoložljivost in delovni čas, koledarja, skrbniškega pogleda za lastnico, e-poštnih funkcij in komentarjev.

## Ustreznost implementacije uporabniškim zgodbam

Pregledanih je bilo prvih pet uporabniških zgodb iz `05-uporabniske-zgodbe.md`, ki pokrivajo jedro MVP.

### US-01 – Uporabniški računi in vloge: zadošča

| Pogoj sprejema | Izpolnjen | Opomba |
|---|---|---|
| 1. Obvezna polja in veljaven e-poštni naslov | Da | Preverjanje na frontendu (`required`, `type="email"`) in na backendu (regex, prazni nizi). |
| 2. Unikaten e-poštni naslov | Da | Backend vrne `409` s sporočilom; e-pošta se normalizira v male črke. |
| 3. Vloga `CUSTOMER` ob registraciji | Da | Vloga je nastavljena na strežniku in je uporabnik ne more izbrati. |
| 4. Prijava, odjava in zaščitene strani | Da | Odjava uniči sejo in pobriše piškotek; strani za prijavljene se brez seje ne prikažejo. |
| 5. Geslo ni shranjeno ali prikazano v čisti obliki | Da | bcrypt (12 krogov); `passwordHash` se ne vrača v odgovorih. |

Zgodba je v celoti izpolnjena. Razlikovanje med vlogami (`OWNER`, `ADMIN`) obstaja v podatkovnem modelu, preverjanja vlog na API-ju pa še ni, ker še ni funkcionalnosti, ki bi ga potrebovale.

### US-02 – Koledar razpoložljivih terminov: ne zadošča

Koledar ni implementiran. V podatkovnem modelu ni entitete za razpoložljivost ali nedostopna obdobja, zato nobenega od pogojev sprejema (prikaz in razlikovanje terminov, izbira samo prostih terminov, upoštevanje nedostopnih obdobij) ni mogoče izpolniti.

### US-03 – Oddaja zahteve za rezervacijo: delno pripravljeno, ne zadošča

Model `Reservation` vsebuje vrsto storitve (`CONSULTATION`, `MAKEUP`), datum, neobvezno opombo in status s privzeto vrednostjo `PENDING`, kar ustreza pogojema 1 in 3 na ravni podatkov. Ni pa API končne točke za oddajo, preverjanja, ali je termin prost, potrditve oddaje ne obrazca. Stran Naroči termin prikazuje samo kartice s storitvami.

### US-04 – Potrjevanje ali zavračanje rezervacij: ne zadošča

Statusa `APPROVED` in `REJECTED` obstajata v enumu, vendar ni skrbniškega pogleda, API-ja za odločitev, preverjanja prekrivanja terminov ne preverjanja vloge lastnice. Model `Reservation` za razliko od `FlowerOrder` nima polj za razlog zavrnitve in čas odločitve, ki ju zahteva pogoj 5.

### US-05 – Naročilo šopka ali aranžmaja: delno pripravljeno, ne zadošča

Model `FlowerOrder` pokriva vse podatke iz pogoja 1 (vrsta, velikost, količina, način izvedbe, želeni datum, opomba) in privzeti status `PENDING`. Ni pa obrazca, API končne točke ne strežniške validacije datuma (od danes do enega meseca vnaprej) in količine (pozitivno celo število), ki ju zahtevata pogoja 2 in 3.

### Povzetek

Implementirane funkcionalnosti trenutno zadoščajo samo zgodbi US-01. Projekt ima dobro pripravljeno dokumentacijo, podatkovni model in osnovo za avtentikacijo, jedro MVP (rezervacije in naročila) pa še ni izvedeno.

## Opažanja pri lokalnem zagonu in pregledu kode

- **Manjkajoča okoljska spremenljivka v navodilih:** README omenja samo `DATABASE_URL`, backend pa se brez `SESSION_SECRET` ne zažene. Primer datoteke `.env.example` v repozitoriju ni.
- **Zagon baze ni opisan:** README omenja Docker, ne vsebuje pa ukaza ali datoteke `docker-compose.yml` za zagon PostgreSQL.

