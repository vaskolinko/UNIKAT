# UNIKAT – spletna aplikacija za poročne storitve, ličenje in cvetlična naročila

## 1. Opis projekta

UNIKAT je spletna aplikacija za podjetje, katerega lastnica organizira poroke, izvaja ličenje ter pripravlja šopke in cvetlične aranžmaje.

Namen aplikacije je združiti povpraševanja, rezervacije terminov in naročila cvetličnih izdelkov na enem mestu. Komunikacija prek različnih sporočil, družbenih omrežij in telefonskih klicev lahko povzroči izgubo podatkov, prekrivanje terminov ali spregledana naročila.

Aplikacija bo strankam omogočala oddajo zahtev za rezervacijo terminov in naročilo šopkov, lastnici pa pregledovanje, potrjevanje in zavračanje prejetih zahtev. Sistem bo upošteval razpoložljivost terminov in omejitev naročanja cvetličnih izdelkov največ en mesec vnaprej.

Ob novih naročilih ali rezervacijah bo sistem lastnici pošiljal dnevni e-poštni povzetek.

## 2. Ciljni uporabniki

- **Stranke:** ustvarijo uporabniški račun, rezervirajo termine, naročajo šopke oziroma aranžmaje ter objavljajo komentarje in fotografije.
- **Lastnica podjetja UNIKAT:** upravlja razpoložljivost terminov, pregleduje in potrjuje ali zavrača zahteve, spremlja naročila ter skrbi za vsebino.
- **Administrator:** skrbi za uporabniške račune in pravilno delovanje aplikacije. V prvi različici je lahko njegova vloga združena z vlogo lastnice, vendar so pravice logično ločene.

## 3. Glavne funkcionalnosti

- Registracija uporabnikov in prijava v aplikacijo.
- Pregled koledarja in razpoložljivih terminov.
- Oddaja zahtev za rezervacijo posvetovanja ali ličenja.
- Potrjevanje in zavračanje rezervacij.
- Naročanje šopkov in cvetličnih aranžmajev.
- Omejitev datuma naročila na obdobje od tekočega dne do največ enega meseca vnaprej.
- Dodajanje komentarjev in fotografij.
- Upravljanje razpoložljivosti terminov.
- Pregled in moderiranje komentarjev.
- Dnevno pošiljanje e-poštnega povzetka novih naročil in rezervacij.

## 4. Potek uporabe

1. Stranka ustvari uporabniški račun in se prijavi.
2. V koledarju izbere razpoložljiv termin ter odda zahtevo za posvetovanje ali ličenje.
3. Zahteva je do odločitve lastnice v stanju čakanja. Po potrditvi postane potrjena rezervacija.
4. Stranka izpolni naročilo za šopek ali aranžma, določi želeni datum prevzema oziroma dostave in po potrebi doda opombo.
5. Stranka lahko objavi komentar in priloži fotografijo, na primer fotografijo navdiha ali končnega izdelka.
6. Lastnica v skrbniškem delu pregleda prejeta naročila in rezervacije ter jih potrdi ali zavrne. Prav tako lahko upravlja razpoložljivost terminov in odstranjuje neprimerne komentarje.
7. Sistem enkrat dnevno preveri, ali so bila oddana nova naročila ali rezervacije. Če so bila, lastnici pošlje e-poštni povzetek z bistvenimi podatki.

## 5. Tehnološki sklad

Predvideni tehnološki sklad aplikacije:

- **Frontend:** React, TypeScript.
- **Backend:** Node.js, Express, TypeScript.
- **Podatkovna baza:** PostgreSQL.
- **Dostop do podatkovne baze:** Prisma ORM.
- **Avtentikacija:** sejni piškotki HttpOnly in varno shranjevanje gesel z uporabo Argon2 ali bcrypt.
- **E-pošta:** Nodemailer in SMTP.
- **Dnevna opravila:** node-cron.
- **Testiranje:** Vitest ali Jest ter Supertest.

Končna izbira in konfiguracija tehnologij bosta določeni med razvojem.

## 6. Struktura projekta

```text
UNIKAT/
├── README.md
├── .gitignore
├── frontend/
├── backend/
└── docs/
    ├── 01-zasnova-resitve.md
    ├── 02-funkcionalnosti-in-obseg.md
    ├── 03-podatkovni-model.md
    ├── 04-arhitektura-in-tehnoloski-sklad.md
    ├── 05-uporabniske-zgodbe.md
    ├── 06-wireframes.md
    ├── wireframes/
    └── adr/
        ├── adr-template.md
        ├── 0001-postgresql-kot-relacijska-podatkovna-baza.md
        ├── 0002-poslovna-pravila-in-pravice-na-backendu.md
        └── 0003-locena-frontend-in-backend-arhitektura.md
```

## 7. Namestitev in zagon projekta

### Predpogoji

Za lokalni razvoj potrebuješ:
- Node.js in npm.
- Docker Desktop.
- Git.

### Backend

1. Odpri terminal v mapi `backend`.
2. Namesti odvisnosti:

   ```bash
   npm install
   ```

3. Ustvari datoteko `.env` in nastavi povezavo do PostgreSQL podatkovne baze z uporabo spremenljivke `DATABASE_URL`.
4. Zaženi migracije:

   ```bash
   npx prisma migrate dev
   ```

5. Zaženi razvojni strežnik:

   ```bash
   npm run dev
   ```

Backend je privzeto dostopen na `http://localhost:3000`.

Zdravstveni pregled API-ja: `http://localhost:3000/api/health`.

### Frontend

1. Odpri nov terminal v mapi `frontend`.
2. Namesti odvisnosti:

   ```bash
   npm install
   ```

3. Zaženi razvojni strežnik:

   ```bash
   npm run dev
   ```

Frontend je privzeto dostopen na `http://localhost:5173`.

### Podatkovna baza

Projekt uporablja PostgreSQL. Za lokalni razvoj je predviden Docker. Povezava do podatkovne baze se nastavi v datoteki `.env` z uporabo spremenljivke `DATABASE_URL`.

### Primer lokalnega zagona

1. Zaženi Docker Desktop in ustvari kontejner s PostgreSQL podatkovno bazo (samo ob prvem zagonu):

   ```bash
   docker run --name unikat-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=unikat -p 5432:5432 -d postgres:16
   ```

   Ob vsakem naslednjem zagonu je dovolj:

   ```bash
   docker start unikat-db
   ```

2. V mapi `backend` ustvari datoteko `.env` z naslednjima spremenljivkama:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unikat"
   SESSION_SECRET="dolg-nakljucen-niz"
   ```

3. Zaženi backend in frontend po zgornjih navodilih.

Frontend za povezavo z backendom uporablja spremenljivko `VITE_API_URL`. Če ta ni nastavljena, se uporabi `http://localhost:3000`.

### Ostali ukazi

V mapah `backend` in `frontend` so na voljo še naslednji ukazi:

- `npm run lint` – preveri kodo z ESLint.
- `npm run build` – zgradi aplikacijo. Backend se zgradi v `dist/server.js`, frontend pa v mapo `dist/`.
- `npm start` – zažene zgrajen backend (samo v mapi `backend`).
- `npm test` – zažene teste z Vitest.
- `npm run test:coverage` – zažene teste in pripravi poročilo o pokritosti kode.

## 8. CI/CD

[![CI/CD](https://github.com/vaskolinko/UNIKAT/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/vaskolinko/UNIKAT/actions/workflows/ci-cd.yml)

Za projekt je vzpostavljen CI/CD cevovod z GitHub Actions. Cevovod je definiran v datoteki `.github/workflows/ci-cd.yml` in se sproži ob vsakem pull requestu v vejo `main` ter ob vsakem pushu na vejo `main`.

Spremembe se razvijajo v ločenih vejah in se v `main` združujejo prek pull requestov. Veja `main` je zaščitena, zato pull requesta ni mogoče združiti, če katera izmed preverb `lint`, `build` ali `test` ni uspešna.

### Nameščena aplikacija

- **Frontend:** https://unikat-five.vercel.app
- **Backend:** https://unikat-backend.onrender.com/api/health

Backend je nameščen na brezplačnem paketu storitve Render, ki se po daljši neaktivnosti ustavi. Prvi zahtevek lahko zato traja nekoliko dlje.

### Faze cevovoda

1. **Lint:** preveri slog in kakovost kode za frontend in backend z orodjem ESLint. Če linter najde napako, cevovod pade.
2. **Build:** zgradi frontend in backend. Odvisnosti se predpomnijo (npm cache), da je ponovna namestitev hitrejša. Rezultati gradnje se shranijo kot artefakti.
3. **Test:** zažene teste za frontend in backend. Poročilo o pokritosti kode se shrani kot artefakt. Če kateri koli test pade, pade tudi cevovod.
4. **Deploy:** izvede se samo ob pushu na `main` in samo, če so prejšnje faze uspešne. Uporabi artefakte iz faze build, frontend namesti na Vercel, backend pa na Render. Podatkovna baza PostgreSQL je nameščena na storitvi Neon.

Tokeni in gesla za namestitev so shranjeni kot GitHub Secrets v okolju `production` oziroma kot okoljske spremenljivke na storitvi Render.