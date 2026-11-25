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

---

## 8. Dodatna navodila za zagon

Lokalno bazo prvič ustvariš z Dockerjem:

```bash
docker run --name unikat-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=unikat -p 5432:5432 -d postgres:16
```

Ob vsakem naslednjem zagonu je dovolj `docker start unikat-db`.

Datoteka `backend/.env` mora vsebovati:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unikat"
SESSION_SECRET="dolg-nakljucen-niz"
```

Če spremenljivka `VITE_API_URL` ni nastavljena, frontend uporablja `http://localhost:3000`.

| Ukaz | Backend | Frontend |
|---|---|---|
| `npm run dev` | razvojni strežnik (tsx watch) | razvojni strežnik (Vite) |
| `npm run lint` | ESLint | ESLint |
| `npm run build` | `prisma generate` in esbuild v `dist/server.js` | TypeScript in Vite build v `dist/` |
| `npm start` | zagon zgrajenega `dist/server.js` | – |
| `npm test` | Vitest | Vitest |
| `npm run test:coverage` | testi s poročilom o pokritosti | testi s poročilom o pokritosti |

## 9. CI/CD

[![CI/CD](https://github.com/vaskolinko/UNIKAT/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/vaskolinko/UNIKAT/actions/workflows/ci-cd.yml)

**Nameščena aplikacija:**

- Frontend: https://unikat-five.vercel.app
- Backend API: https://unikat-backend.onrender.com/api/health

> Backend teče na brezplačnem paketu Render, ki po 15 minutah neaktivnosti zaspi. Prvi zahtevek lahko zato traja do ene minute.

Cevovod je definiran v `.github/workflows/ci-cd.yml`. Sproži se ob vsakem pull requestu v vejo `main` in ob vsakem pushu na `main`. Veja `main` je zaščitena: pull requesta ni mogoče združiti, dokler joba `lint`, `build` in `test` nista uspešna.

| Faza | Opis |
|---|---|
| **lint** | Z ESLint preveri slog in kakovost kode za frontend in backend. Če linter najde napako, job pade. |
| **build** | Zgradi frontend (Vite) in backend (esbuild, Prisma client). Npm odvisnosti se predpomnijo z `actions/setup-node` (`cache: npm`). Rezultata gradnje se shranita kot artefakta `frontend-build` in `backend-build`. |
| **test** | Z Vitest zažene teste za backend in frontend. Poročilo o pokritosti kode se shrani kot artefakt `coverage-report`. Če kateri koli test pade, pade tudi cevovod. |
| **deploy** | Izvede se samo ob pushu na `main` in samo, če so `lint`, `build` in `test` uspešni. Uporablja okolje `production`. Prenese artefakte iz joba build, aplikacije ne gradi ponovno. Frontend namesti na Vercel, backend pa na Render, ki uporablja bazo PostgreSQL na Neonu. |

Tokeni in gesla so shranjeni kot GitHub Secrets v okolju `production` oziroma kot okoljske spremenljivke na Renderju. V kodi niso zapisani.
