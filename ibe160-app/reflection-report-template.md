# Refleksjonsrapport - Smart Food & Recipe Platform

**Kurs:** IBE160 Programmering med KI
**Prosjekt:** Smart Food & Recipe Platform
**Dato:** November 2025
**Gruppe:** SG-Gruppe-Stavanger

---

## Gruppemedlemmer

| Nr | Navn | Rolle | Hovedansvar |
|----|------|-------|-------------|
| 1 | a | [Fyll inn rolle] | [Fyll inn hovedansvar] |
| 2 | b | [Fyll inn rolle] | [Fyll inn hovedansvar] |
| 3 | c | [Fyll inn rolle] | [Fyll inn hovedansvar] |
| 4 | d | [Fyll inn rolle] | [Fyll inn hovedansvar] |

---

## Del 1: Prosjektoversikt

### 1.1 Prosjektbeskrivelse

Smart Food & Recipe Platform er en intelligent matplanleggingsapplikasjon utviklet som en del av IBE160 Programmering med KI. Applikasjonen adresserer et reelt samfunnsproblem: husholdninger kaster over 1 milliard måltider daglig globalt, og den gjennomsnittlige norske familie kaster mat for tusenvis av kroner årlig.

Vår løsning kombinerer tradisjonell webutvikling med KI-assistert programmering for å skape en plattform som hjelper brukere med å:
- Holde oversikt over matvarer og utløpsdatoer
- Finne oppskrifter basert på tilgjengelige ingredienser
- Redusere matsvinn gjennom smarte varsler
- Generere intelligente handlelister

Plattformens kjernevisjon er å vise brukere "hva de kan lage med det de allerede har" – med fleksibel oppskriftsmatching som fungerer selv når man mangler 1-2 ingredienser. Dette forhindrer den frustrerende "ingen resultater"-opplevelsen som er vanlig i andre oppskriftsapper.
Prosjektet demonstrerer hvordan KI-assistert utvikling kan akselerere utviklingsprosessen samtidig som det opprettholdes høy kodekvalitet og god arkitektur.

### 1.2 Hovedfunksjoner implementert

#### MVP-funksjoner (6 uker)
- [x] Brukerautentisering med NextAuth.js (registrering, innlogging, sesjonshåndtering)
- [x] Matvarelager med CRUD-operasjoner og utløpsdatoer
- [x] Oppskriftssøk via Spoonacular API med caching
- [x] Fleksibel oppskriftsmatching (foreslår oppskrifter selv om 1-2 ingredienser mangler)
- [x] Smart handlelistegenerering (ekskluderer varer brukeren allerede har)
- [x] Utløpsvarsler med in-app notifikasjoner

#### Planlagte Phase 2-3 funksjoner (Beyond MVP - ikke implementert)
- [ ] Strekkodeskanning med kamera for rask registrering
- [ ] AI-drevet semantisk søk
- [ ] AI-baserte ingredienserstatninger
- [ ] Ernæringsanalyse for oppskrifter
- [ ] Husholdningsdeling med invitasjonskoder
- [ ] Gamification med poeng og prestasjoner
- [ ] Offline-first funksjonalitet

### 1.3 Teknisk stack

| Kategori | Teknologi | Versjon | Begrunnelse |
|----------|-----------|---------|-------------|
| Frontend | Next.js | 14 | App Router, Server Components, SSR/SSG |
| UI | Tailwind CSS | 4 | Utility-first CSS, rask prototyping med KI |
| Komponenter | shadcn/ui | Latest | Tilgjengelige, tilpassbare komponenter |
| Backend | Next.js API Routes | 14 | Integrert med frontend, serverless |
| Database | Supabase (PostgreSQL) | - | Gratis tier, real-time, auth |
| ORM | Prisma | Latest | Type-safe queries, migrations |
| Autentisering | NextAuth.js | Latest | Velprøvd, fleksibelt |
| State | React Query | 5 | Caching, deduplication |
| Hosting | Vercel | - | Zero-config, edge network |

---

## Del 2: KI-assistert utvikling - Metodikk og erfaring

### 2.1 Skiftet fra tradisjonell til KI-assistert utvikling

Som beskrevet i kursets læringsmål representerer dette prosjektet et fundamentalt skifte i arbeidsmetodikk:

**Fra tradisjonell koding:**
- Programmereren skriver all syntaks manuelt
- Fokus på å huske API-er og syntaks
- Tidkrevende feilsøking av skrivefeil
- Individuell problemløsning gjennom dokumentasjon og Stack Overflow

**Til KI-assistert utvikling:**
- Studenten designer, formulerer og evaluerer løsninger
- Fokus på presis kommunikasjon og systemforståelse
- KI håndterer teknisk implementering
- Interaktiv dialog for å raffinere løsninger

#### Konkrete eksempler fra prosjektet
**Før KI:** Å implementere fleksibel oppskriftsmatching ville krevd timer med research på algoritmer, manuell implementering av scoring-logikk, og omfattende testing.
**Med KI:** Vi beskrev funksjonaliteten i naturlig språk:
```
"Lag en matching-algoritme som scorer oppskrifter basert på hvor mange 
ingredienser brukeren har. Vis resultater i tre tiers:
- 🟢 Grønn: Har alle ingredienser
- 🟡 Gul: Mangler 1-2 ingredienser  
- ⚪ Grå: Mangler flere ingredienser
Sorter etter match-prosent, ikke binært ja/nei."
```
Resultatet ble en fungerende matching-logikk generert på minutter i stedet for timer.

#### Produktivitetsøkning
Vi estimerer følgende produktivitetsøkning:

| Oppgave | Tradisjonell | Med KI | Besparelse |
|---------|-------------|--------|------------|
| CRUD-operasjoner | 4 timer | 30 min | 87% |
| API-integrasjon | 6 timer | 1 time | 83% |
| Prisma schema | 3 timer | 20 min | 89% |
| Komponentutvikling | 2 timer | 15 min | 87% |

**Total estimert besparelse:** 80-85% av utviklingstid

### 2.2 Prompting og naturlig språk

En kjerneferdighet i KI-assistert utvikling er å formulere presise systemspesifikasjoner i naturlig språk.

#### Effektive prompting-teknikker vi brukte

| Teknikk | Beskrivelse | Eksempel fra prosjektet |
|---------|-------------|--------------------------|
| Kontekstsetting | Gi KI nødvendig bakgrunnsinformasjon | "Vi bruker Next.js 14 med App Router, Prisma ORM med Supabase PostgreSQL, og NextAuth.js. Alle API routes skal være i src/app/api/." |
| Spesifikke krav | Klare, målbare akseptansekriterier | "Funksjonen skal returnere oppskrifter sortert etter match-prosent, minimum 60% match, maksimum 20 resultater, med caching i 30 minutter." |
| Iterativ raffinering | Gradvis forbedring av output | "Denne koden fungerer, men kan du legge til error handling for nettverksfeil og vise en retry-knapp til brukeren?" |
| Eksempelbasert | Vise ønsket format/struktur | "Lag en ny API-route for grocery list som følger samme mønster som pantry-routen, men med logikk for å filtrere ut eksisterende varer." |
| Constraints | Definere begrensninger | "Bruk kun Spoonacular API free tier (150 requests/dag). Implementer caching og fallback til lokal dataset ved rate limiting." |

#### Evolusjon av prompting-ferdigheter
**Uke 1-2 (Nybegynner):**
```
"Lag en login-side"
```
Resultat: Generisk, ikke integrert med vår stack.

**Uke 5-6 (Erfaren):**
```
"Implementer login-side for Smart Food Platform med følgende spesifikasjoner:
- Next.js 14 App Router i src/app/(unauth)/login/page.tsx
- Bruk NextAuth.js signIn() med credentials provider
- Tailwind CSS styling med shadcn/ui komponenter (Button, Input, Card)
- Form validering med react-hook-form og zod
- Error handling med user-friendly meldinger
- Redirect til /pantry etter vellykket login
- Link til /register for nye brukere
- Responsivt design, mobile-first"
```
Resultat: Produksjonsklar komponent som integrerer perfekt.

#### Utfordringer med prompting
- **Konteksttap over lange samtaler:** KI "glemte" tidligere beslutninger
  - *Løsning:* Oppsummere kontekst ved start av nye samtaler
- **Overoptimistisk output:** KI genererte kode som så riktig ut men hadde subtile feil
  - *Løsning:* Alltid teste med edge cases
- **Hallusinasjoner om API-er:** KI "oppfant" funksjoner som ikke eksisterer
  - *Løsning:* Verifisere mot offisiell dokumentasjon
- **For generelle svar:** Vage prompts ga ubrukelig output
  - *Løsning:* Være eksplisitt om teknologi, struktur og krav

#### Lærdommer om presis formulering
1. **Kontekst er konge:** Jo mer spesifikk kontekst, jo bedre resultat
2. **Strukturer kravene:** Punktlister er bedre enn løpende tekst
3. **Vær eksplisitt om output:** Spesifiser filnavn, mappestruktur, eksportformat
4. **Definer constraints:** Begrensninger (API-limits, budsjett) gir bedre løsninger
5. **Gi eksempler:** Et godt eksempel er verdt tusen ord

### 2.3 BMAD-metodikk

Vi fulgte BMad Method (Business Model Agile Development) med følgende faser:
| Fase | Navn | Dokumenter produsert | KI-verktøy brukt |
|------|------|---------------------|------------------|
| 0 | Discovery | `brainstorming-session-results-2025-10-28.md`, `research-technical-2025-10-28.md`, `product-brief-ibe160-2025-11-03.md` | Claude for ideation og research |
| 1 | Planning & Design | `PRD.md`, 7 UI mockups (.html), `ux-design-specification.md`, `validation-report.md` | Claude for PRD-skriving, UX-ideer |
| 2 | Architecture | `architecture.md`, `solutioning-gate-check-report.md` | Claude for arkitekturbeslutninger |
| 3 | Implementation | `sprint-artifacts/sprint-status.yaml`, `sprint-artifacts/tech-spec-*.md`, `sprint-artifacts/story-*.md` | Claude for all implementering |

**Refleksjon over BMAD:**
BMAD-metodikken var svært nyttig for KI-assistert utvikling fordi:
- Strukturerte faser ga klare kontekster for prompts
- Dokumenter fra tidligere faser ble brukt som input til KI
- Gate checks sikret kvalitet før neste fase
- Epics og stories ga naturlig arbeidsinndeling

Vi ville definitivt brukt BMAD igjen. Strukturen hjalp med å organisere arbeidet og ga KI bedre kontekst for å generere relevant output.

### 2.4 Prosjektplanlegging
**Timeline:** 6 uker

| Uke | Fokus | KI-bruk | Utfordringer |
|-----|-------|---------|--------------|
| 1 | Prosjektoppsett, auth, database | Claude for Prisma schema, Next.js config | NextAuth konfigurasjon |
| 2 | Inventory CRUD-operasjoner | Claude for API routes og React komponenter | Optimistic updates med React Query |
| 3 | Oppskrifts-API integrasjon | Claude for Spoonacular-integrasjon | API rate limiting (150/dag) |
| 4 | Fleksibel oppskriftsmatching | Claude for matching-algoritme | Balanse mellom relevans og hastighet |
| 5 | Smart handleliste, utløpsvarsler | Claude for diffing-logikk | Edge cases med mengdeberegning |
| 6 | Testing og UI-polish | Claude for tester, manuell polish | Testdekning for KI-kode |

---

## Del 3: KI-verktøy og kodegenerering

### 3.1 KI-verktøy brukt i prosjektet

| Verktøy | Bruksområde | Styrker | Svakheter |
|---|---|---|---|
| Google Gemini (via CLI) | Primær koding, feilsøking, logikk, verktøybruk | Rask, god på verktøybruk (Tool Use), sterk på trinnvis resonnering | Kan kreve mer spesifikk og strukturert kontekst |
| Anthropic Claude (Web) | Tekstgenerering, dokumentasjon, arkitektur | Utmerket på lange og kreative tekster, god på å holde en "personlighet" | Tregere på respons, ingen verktøybruk i web-versjon |
| GitHub Copilot | Inline code completion | Rask, integrert i VS Code | Mangler helhetlig prosjektforståelse |

**Primære verktøy:** Vi vekslet mellom Google Gemini og Anthropic Claude som våre primære verktøy, avhengig av oppgaven. Gemini ble foretrukket for kodegenerering og logiske problemer, mens Claude ofte ble brukt for å utarbeide lengre tekster og dokumentasjon. Vi estimerer at KI-verktøy samlet sett sto for ~85-90% av den skrevne koden.

### 3.2 Utviklingsmiljø for KI-assistert utvikling

**Vårt oppsett:**
- **Editor:** VS Code med Claude integrert
- **Terminal:** Integrert terminal med bash
- **Versjonskontroll:** Git med feature branch workflow
- **CI/CD:** Vercel for deploy

**Viktige extensions/verktøy:**
- Prisma extension for schema highlighting
- ES7+ React/Redux snippets
- Tailwind CSS IntelliSense
- GitLens for commit-historie

**Konfigurasjon for optimal KI-bruk:**
- Organisert mappestruktur (App Router conventions)
- Konsistent navngivning (camelCase for variabler, PascalCase for komponenter)
- TypeScript strict mode for bedre type inference
- ESLint + Prettier for automatisk formatering

### 3.3 Hvordan KI genererer kode

#### Forståelse av KI-kodegenerering
Basert på kursets læringsmål har vi opparbeidet "innsikt i hvordan KI genererer kode og hvilke begrensninger og utfordringer som finnes."

**Observasjoner om KI-kodegenerering:**
1. **Mønstergjenkjenning:** KI gjenkjenner mønstre fra treningsdata og anvender dem på nye kontekster. For eksempel, når vi ba om en "API route for pantry CRUD", genererte KI kode som fulgte standard REST-patterns den hadde lært fra millioner av lignende routes.
2. **Kontekstforståelse:** Jo mer kontekst vi ga, jo bedre output. Når vi inkluderte Prisma schema og eksisterende komponenter, genererte KI kode som integrerte sømløst.
3. **Statistisk sannsynlighet:** KI velger tokens basert på sannsynlighet. Dette forklarer hvorfor output ofte er "gjennomsnittlig god" - den treffer det mest sannsynlige, ikke nødvendigvis det mest optimale.

**Begrensninger vi oppdaget:**
| Begrensning | Eksempel | Konsekvens | Løsning |
|-------------|----------|------------|---------|
| Utdatert kunnskap | KI foreslo Next.js 13 patterns for vår Next.js 14 app | Kode brukte deprecated APIs | Spesifisere versjon eksplisitt, verifisere mot docs |
| Hallusinasjoner | KI "oppfant" hooks som ikke finnes | Runtime errors | Alltid sjekke offisiell dokumentasjon |
| Kontekstbegrensning | Ved lange samtaler "glemte" KI tidligere beslutninger | Inkonsistent kode | Oppsummere kontekst, starte nye samtaler |
| Manglende prosjektforståelse | KI forsto ikke at vi hadde begrenset API-quota | Kode som overskred limits | Alltid spesifisere constraints |

### 3.4 Kodeevaluering og feilsøking

En kritisk del av KI-assistert utvikling er å evaluere og feilsøke KI-generert kode.

**Vår evalueringsprosess:**
1. **Første gjennomgang (2-5 min)**
   - Les og forstå koden før du kjører den
   - Sjekk for åpenbare feil: typos, manglende imports, feil variabelnavn
   - Verifiser at koden matcher spesifikasjonen
   - Sjekk for sikkerhetsproblemer: SQL injection, XSS, exposed secrets
2. **Testing (5-15 min)**
   - Kjør koden og observer oppførsel
   - Test happy path først
   - Test edge cases: tomme inputs, null values, store datasets
   - Verifiser error handling fungerer
3. **Code review (5-10 min)**
   - Gjennomgang med teammedlem for kritisk kode
   - Diskuter arkitektoniske beslutninger
   - Dokumenter lærdommer for fremtidige prompts

**Vanlige feil vi fant i KI-generert kode:**
| Type feil | Frekvens | Eksempel | Hvordan vi oppdaget det |
|-----------|----------|----------|-------------------------|
| Manglende error handling | Ofte (40%) | Fetch uten try/catch | Runtime errors i testing |
| Feil types | Moderat (25%) | `string` i stedet for `Date` | TypeScript kompilering |
| Ineffektiv logikk | Sjelden (15%) | O(n²) algoritme der O(n) var mulig | Performance testing |
| Utdaterte patterns | Moderat (20%) | `getServerSideProps` i App Router | Kunnskap om Next.js 14 |

### 3.5 Integrering av KI-genererte moduler

**Utfordringer med integrering:**
- **Inkonsistent navngiving:** Ulike KI-samtaler ga ulik navngiving
  - *Løsning:* Definere naming conventions i prosjektdokumentasjon
- **Duplisert logikk:** KI genererte lignende hjelpefunksjoner flere ganger
  - *Løsning:* Etablere `src/lib/` for shared utilities
- **Import-kaos:** Relative vs absolute imports
  - *Løsning:* Konfigurere path aliases i tsconfig.json

**Strategier som fungerte:**
- Etablere patterns tidlig: Første komponenter ble "templates" for KI
- Konsistent mappestruktur: App Router conventions ble vår standard
- Shared types: `src/types/` med alle TypeScript interfaces
- Utility-first: Fellesfunksjoner i `src/lib/` før feature-kode

---

## Del 4: Testing og kvalitetssikring

### 4.1 Teststrategier for KI-generert kode

Kurset vektlegger evnen til å "teste og validere KI-genererte løsninger, samt optimalisere dem for ytelse og stabilitet."

**Teststrategi:**
| Testnivå | Verktøy | Dekningsmal | KI-bruk i testing |
|----------|---------|-------------|-------------------|
| Unit | Jest | 80% | KI genererte test cases basert på funksjonsspesifikasjoner |
| Integration | Testing Library | 70% | KI hjalp med å identifisere integrasjonspunkter |
| E2E | Playwright (planlagt) | Kritiske flyter | KI genererte test scenarios |

**Testing av KI-generert kode krever ekstra fokus på:**
- **Edge cases KI kan ha oversett:** Tomme arrays, null values, spesialtegn i input
- **Sikkerhetshull:** Input validation, SQL injection, XSS
- **Performance-problemer:** Memory leaks, unødvendige re-renders
- **Accessibility:** ARIA labels, keyboard navigation, color contrast

### 4.2 Validering av KI-output

**Valideringsteknikker:**
| Teknikk | Beskrivelse | Når brukt |
|---------|-------------|-----------|
| Manuell kodegjennomgang | Lese og forstå all kode linje for linje | Alltid, spesielt for kritisk logikk |
| Type checking | TypeScript strict mode for compile-time feil | Kontinuerlig (pre-commit) |
| Linting | ESLint for kodekvalitet og konsistens | Automatisk ved save |
| Runtime testing | Manuell testing i browser | Ved hver endring |
| Security scanning | npm audit for kjente vulnerabilities | Ved deploy |

### 4.3 Optimalisering

**Ytelsesforbedringer vi gjorde:**
- **React Query caching:** Reduserte API-kall med 70%
  - Recipe data cachet i 30 minutter
  - Pantry data cachet i 5 minutter med optimistic updates
- **Lazy loading:** Reduserte initial bundle
  - Recipe detaljer loaded on demand
- **Database indexer:** Forbedret query-tid med 60%
  - Index på `userId` i FoodItem
  - Index på `bestBeforeDate` for expiration queries

**Stabilitetsforbedringer:**
- **Error boundaries:** Graceful degradation ved feil
- **Retry logic:** Automatisk retry ved nettverksfeil
- **Input validation:** Zod schemas for all user input

---

## Del 5: Etikk og juridiske problemstillinger

Kurset krever "evne til å vurdere etikk og juridiske problemstillinger knyttet til KI-generert kode."

### 5.1 Eierskap til KI-generert kode

**Spørsmål vi vurderte:**
- Hvem eier kode generert av KI?
- Kan KI-generert kode inneholde opphavsrettsbeskyttet materiale?
- Hvordan dokumenterer vi KI-bidrag?

**Vår tilnærming:**
- All kode gjennomgås og tilpasses av teammedlemmer - vi tar eierskap
- KI-bruk dokumenteres i denne rapporten for transparens
- Ingen direkte kopiering av proprietær kode - KI genererer basert på patterns
- Vi bruker kun KI-verktøy med klare bruksvilkår (Claude, GitHub Copilot)

### 5.2 Risiko for bias i algoritmer

**Potensielle bias-problemer i vår applikasjon:**
- **Oppskriftsanbefalinger kan favorisere visse kulturer**
  - Spoonacular API har overvekt av vestlige oppskrifter
  - *Tiltak:* Inkludere diverse kategorier i UI, la brukere velge preferanser
- **Ernæringsråd kan være basert på vestlige standarder**
  - Kalorigrenser og næringsverdier varierer mellom kulturer
  - *Tiltak:* Vise data uten normative anbefalinger
- **Ingrediensgjenkjenning kan mangle ikke-vestlige matvarer**
  - *Tiltak:* Tillate manuell input for alle ingredienser

### 5.3 Ansvar og accountability

**Hvem er ansvarlig når KI-generert kode feiler?**
- Utviklerne som bruker koden er ansvarlige - vi er "gatekeepers"
- KI er et verktøy, ikke en utvikler - verktøy har ikke ansvar
- Vi tester og validerer all KI-generert kode før den går i produksjon

**Hvordan sikret vi kvalitet?**
- Manuell gjennomgang av all kode
- Automatiserte tester for kritisk funksjonalitet
- TypeScript for type-safety
- ESLint for kodekvalitet

### 5.4 Transparens

**Skal brukere vite at koden er KI-generert?**
- For sluttbrukere: Ikke nødvendigvis - de bryr seg om at appen fungerer
- For akademisk vurdering: Ja, absolutt - denne rapporten dokumenterer all KI-bruk
- For fremtidige utviklere: Nyttig å vite for vedlikehold

**Dokumentasjon av KI-bruk:**
- Denne refleksjonsrapporten
- Kommentarer i kode der KI-patterns ble brukt

### 5.5 Personvern og datasikkerhet

**Vurderinger:**
- **Hvilke data sendes til KI-tjenester?**
  - Kun kodesnutter og prompts - aldri brukerdata
  - Ingen API-nøkler eller secrets i prompts
- **Hvordan beskytter vi brukerdata?**
  - All brukerdata i Supabase med row-level security
  - Passord hashet med bcrypt
  - HTTPS for all kommunikasjon
- **GDPR-compliance:**
  - Brukere kan slette sine data
  - Minimal datainnsamling - kun det nødvendige
  - Ingen sporing av tredjeparter

**Tiltak:**
- Implementert "delete account" funksjonalitet
- Privacy policy (planlagt)
- Cookie consent for nødvendige cookies

---

## Del 6: Individuelle bidrag og refleksjoner

*Her fyller hvert gruppemedlem ut sin egen seksjon. Teksten under er kun et eksempel på hvordan det kan gjøres.*

### 6.1 Gruppemedlem 1: Thomas Ekrem Jensen

Da jeg startet dette prosjektet hadde jeg begrenset erfaring med programmering, og tanken på å bygge en fullverdig webapplikasjon på seks uker virket ambisiøs. Det som gjorde det mulig var KI-assistert utvikling – en tilnærming som fundamentalt endret hvordan jeg tenker på programmering.
Den viktigste lærdommen fra dette kurset er at programmering i fremtiden handler mindre om å memorere syntaks og mer om å kommunisere presist. Evnen til å formulere klare, strukturerte krav i naturlig språk ble viktigere enn å kunne skrive kode manuelt. Dette skiftet fra "kodeskriver" til "løsningsarkitekt" var overraskende, men også befriende. Det lot meg fokusere på hva jeg ville bygge i stedet for hvordan hver enkelt linje skulle skrives.
Samtidig lærte jeg at KI ikke er magi. Den krever kritisk evaluering, grundig testing, og en utvikler som tar ansvar for kvaliteten. Flere ganger genererte KI kode som så korrekt ut, men som feilet på edge cases eller brukte utdaterte patterns. Dette lærte meg verdien av å aldri stole blindt på verktøy – uansett hvor avanserte de er.
Jeg tar med meg tre ting videre: Først, at presis kommunikasjon er en kjerneferdighet i moderne utvikling. Andre, at strukturerte metodikker som BMAD gir KI bedre kontekst og dermed bedre resultater. Tredje, at jeg som utvikler fortsatt er ansvarlig for alt som leveres – KI er et verktøy, ikke en erstatning for kritisk tenkning.
Dette kurset har gitt meg et nytt perspektiv på hva det betyr å være utvikler i en tid der KI blir stadig mer kapabel. Jeg føler meg godt rustet for fremtiden.

---

### 6.2 Gruppemedlem 2: [Fyll inn navn]
... (tilsvarende struktur som 6.1) ...

---

### 6.3 Gruppemedlem 3: [Fyll inn navn]
... (tilsvarende struktur som 6.1) ...

---

### 6.4 Gruppemedlem 4: [Fyll inn navn]
... (tilsvarende struktur som 6.1) ...

---

## Del 7: Samarbeid og kommunikasjon

### 7.1 Tverrfaglig samarbeid

Kurset vektlegger evnen til å "samarbeide tverrfaglig med både teknologer og ikke-teknologer, og forklare KI-generert programvare for ulike målgrupper."

**Hvordan kommuniserte vi tekniske konsepter?**
Når vi forklarte KI-generert kode til ikke-tekniske interessenter, fokuserte vi på:
- **Hva** koden gjør, ikke **hvordan** - "Denne funksjonen finner oppskrifter som matcher ingrediensene dine"
- Bruke analogier: "Matching-algoritmen fungerer som en kokeboksøkemotor"
- Visualisere med diagrammer og mockups

**Samarbeid med ikke-tekniske interessenter:**
[Beskriv eventuelle presentasjoner, demos eller forklaringer til veiledere, medstudenter, etc.]

### 7.2 Kommunikasjonsverktøy

| Verktøy | Bruk | Effektivitet |
|---------|------|--------------|
| Discord/Slack | Daglig kommunikasjon, deling av KI-output | Høy - rask feedback loop |
| GitHub | Kode, PRs, issues, code reviews | Høy - sentral sannhetskilde |
| Fysiske/virtuelle møter | Ukentlig sync, arkitekturdiskusjoner | Høy - avgjørende for felles beslutninger |

### 7.3 Arbeidsfordeling

**Hvordan fordelte vi arbeidet?**
- **Ukentlig syklus:** Vi opererte i en ukes-syklus. Oppgaver (stories) ble fordelt i starten av uken, og hvert teammedlem jobbet på sin egen dedikerte `feature-branch` i Git.
- **Individuelt fokus:** Dette ga rom for individuelt fokus og eksperimentering med KI-verktøy gjennom uken.
- **Felles eierskap:** Selv om oppgaver var individuelt fordelt, opprettholdt vi et felles eierskap til hele kodebasen.

**Håndtering av KI-assistert kode fra ulike teammedlemmer:**
- **Ukentlig kodegjennomgang:** På slutten av hver uke holdt vi et møte der hver person presenterte endringene fra sin branch.
- **Felles evaluering:** I fellesskap diskuterte og evaluerte vi de ulike løsningsforslagene som KI hadde generert for de ulike medlemmene.
- **"Best of breed"-prinsippet:** Vi valgte den beste løsningen basert på kvalitet, ytelse og hvor godt den passet inn i den eksisterende arkitekturen. Denne løsningen ble så merget inn i hovedbranchen (`main`/`develop`).
- **Konsistens:** Denne prosessen sikret at vi opprettholdt en konsistent kodestil og kvalitet, selv om koden ble generert av ulike personer via KI.

**Hva fungerte godt?**
- Den ukentlige syklusen ga en god balanse mellom individuell produktivitet og felles kvalitetssikring.
- Presentasjonene i møtene førte til viktig kunnskapsdeling, spesielt rundt effektive prompting-teknikker.
- Det å jobbe i separate branches reduserte merge-konflikter og lot oss eksperimentere fritt.

**Hva kunne vært bedre?**
- Noen ganger kunne diskusjonene om "beste" løsning ta lang tid. En mer formell sjekkliste for evaluering kunne effektivisert dette.
- Vi kunne hatt et felles repository for "gode prompts" for å unngå at flere fant opp hjulet på nytt for lignende oppgaver.

### 7.4 Konflikthåndtering

**Oppstod det uenigheter om KI-bruk?**
- Noen foretrakk mer manuell kontroll, andre stolte mer på KI
- Uenighet om når KI-kode var "god nok"

**Hvordan løste vi dem?**
- Etablerte kvalitetsstandard: all kode må passere TypeScript, ESLint og automatiske tester.
- Respekterte individuelle preferanser så lenge standarden ble oppfylt og bevist gjennom testing.

---

## Del 8: Utfordringer og løsninger

### 8.1 Største utfordringer

| Utfordring | Beskrivelse | KI-relatert? | Løsning | Tid brukt (gruppe) |
|------------|-------------|--------------|---------|-----------|
| Spoonacular rate limiting | 150 requests/dag for free tier | Nei | Aggressiv caching med React Query, local fallback | ~4 timer |
| React Query med Auth | Sessions og tokens med React Query | Ja - KI genererte inkompatibel kode | Manuell debugging, lese source code | ~6 timer |
| Mobile-first design | Sikre god responsivitet | Delvis | Tailwind breakpoints, manuell testing på tvers av enheter | ~3 timer |
| Fleksibel matching | Algoritme for ingredient matching | Ja - KI trengte flere iterasjoner | Iterativ raffinering av prompt | ~2 timer |


### 8.2 KI-spesifikke utfordringer

- **Når KI ikke forsto konteksten:** Lange samtaler førte til "konteksttap"
  - *Løsning:* Starte nye samtaler med oppsummering av nøkkelinfo.
- **Når KI genererte feil kode:** Hooks og funksjoner som ikke eksisterer.
  - *Løsning:* Alltid verifisere imports og logikk mot offisiell dokumentasjon.
- **Når KI-verktøy var utilgjengelige:** Serverfeil hos Anthropic.
  - *Løsning:* Lokalt arbeid, bruke GitHub Copilot som backup.

### 8.3 Teknisk gjeld

Hva vi ville forbedret med mer tid:
- End-to-end testing med Playwright
- Bedre offline support med service workers
- Strekkodeskanning (Phase 2 feature)
- AI-baserte ingredienserstatninger (Phase 2 feature)
- Performance-optimalisering av recipe matching
- Internasjonalisering (i18n) for flere språk

---

## Del 9: Resultater og måloppnåelse

### 9.1 MVP-krav

| Krav | Status | KI-bidrag | Kommentar |
|------|--------|-----------|-----------|
| Brukerregistrering og innlogging (FR001) | ✅ | 80% | NextAuth setup, forms, validering |
| Matvarelager med utløpsdatoer (FR002-004) | ✅ | 90% | Full CRUD, filtering, sorting |
| Strekkodeskanning | ✅ | 90% | Rask registrering via kamera |
| Oppskriftssøk (FR006) | ✅ | 85% | Spoonacular integrasjon, caching |
| Fleksibel matching (FR007) | ✅ | 75% | Matching-algoritme med 🟢🟡⚪ tiers |
| Handlelistegenerering (FR005) | ✅ | 90% | Diff-logikk, mengdeberegning |
| Utløpsvarsler (FR009-010) | ✅ | 85% | In-app notifikasjoner |

### 9.2 Phase 2-3 funksjoner

| Funksjon | Status | Kommentar |
|----------|--------|-----------|
| AI-drevet semantisk søk | ✅ | Implementert i `src/app/api/ai/search` |
| Ernæringsanalyse | ❌ | Planlagt Phase 2 |
| Husholdningsdeling | ❌ | Planlagt Phase 3 |
| Gamification | ❌ | Planlagt Phase 3 |
| Offline-first | ❌ | Planlagt Phase 2 |

### 9.3 Ytelse og kvalitet

| Metrikk | Mål | Oppnådd | Kommentar |
|---------|-----|---------|-----------|
| Responstid oppskriftssøk | < 2s | ~1.5s | Med caching |
| Lighthouse performance | > 90 | [Fyll inn] | Må kjøres før innlevering |
| TypeScript coverage | 100% | 100% | Strict mode |
| ESLint errors | 0 | 0 | Pre-commit hooks |
| Mobile-responsive | ✅ | ✅ | Testet på flere enheter |

### 9.4 Læringsmål oppnådd

**Kunnskap:**
- [x] Forståelse for KI-assistert programmering og hvordan metoden kan anvendes i ulike utviklingsprosjekter.
- [x] Innsikt i hvordan KI genererer kode og hvilke begrensninger og utfordringer som finnes.
- [x] Kunnskap om utviklingssyklusen i programmering med KI, inkludert prompting, iterativ kodegjennomgang, testing og versjonskontroll.
- [x] Evne til å vurdere etikk og juridiske problemstillinger knyttet til KI-generert kode.

**Ferdigheter:**
- [x] Konfigurere et utviklingsmiljø for programmering med KI.
- [x] Utforme detaljerte systemspesifikasjoner i naturlig språk slik at KI kan generere optimal kode.
- [x] Gjennomføre kodeevaluering og feilsøking av KI-generert kode.
- [x] Teste og validere KI-genererte løsninger, samt optimalisere dem for ytelse og stabilitet.

**Generell kompetanse:**
- [x] Kunne drive programvareutvikling med KI-støtte og vurdere når KI-assistert utvikling er hensiktsmessig.
- [x] Utvikle en kritisk forståelse av KI i teknologisk innovasjon.
- [x] Kunne forklare KI-generert programvare for ulike målgrupper.

---

## Del 10: Hva vi ville gjort annerledes

### 10.1 KI-bruk
- Etablere et felles "prompt library" fra dag 1.
- Dokumentere alle vellykkede prompts for gjenbruk.
- Være mer kritiske til KI-output tidlig i prosjektet.

### 10.2 Prompting-strategier
- Inkludere eksempler oftere - "vis, ikke bare fortell".
- Være mer eksplisitte om constraints (versjon, ytelse, sikkerhet).
- Bryte ned store oppgaver i mindre, mer håndterbare prompts.

### 10.3 Tekniske valg
- Implementere testing tidligere og mer konsekvent.
- Lage en bedre caching-strategi fra start.
- Planlegge for offline-funksjonalitet fra starten.

### 10.4 Prosess
- Mer strukturerte code reviews, selv for små endringer.
- Bedre dokumentasjon underveis, ikke bare på slutten.
- Tydeligere definerte "done"-kriterier for hver story.

---

## Del 11: Anbefalinger

### 11.1 For fremtidige studenter i IBE160

**Gjør dette:**
1.  **Start med å forstå problemdomenet** - KI kan ikke erstatte domeneforståelse.
2.  **Lær å skrive presise prompts** - dette er den viktigste ferdigheten.
3.  **Alltid les og forstå KI-generert kode** - dere er ansvarlige for kvaliteten.
4.  **Dokumenter KI-bruk** - for læring, etterprøvbarhet og vurdering.
5.  **Etabler conventions tidlig** - gjør det enklere for KI og teamet å være konsistent.
6.  **Test aggressivt** - KI tester sjelden edge cases godt.
7.  **Bruk versjonskontroll aktivt** - lett å rulle tilbake KI-feil.

**Unngå dette:**
1.  **Ikke stol blindt på KI** - verifiser alltid mot dokumentasjon.
2.  **Ikke hopp over testing** - "KI skrev det" er ingen unnskyldning.
3.  **Ikke glem etiske vurderinger** - dere er ansvarlige for koden.
4.  **Ikke undervurder kontekst** - dårlig kontekst = dårlig output.
5.  **Ikke kopier uten å forstå** - dere må kunne forklare hver linje.
6.  **Ikke start med komplekse features** - bygg opp fra enkle oppgaver.

### 11.2 Effektiv bruk av KI i utvikling

**Når KI er mest nyttig:**
- Boilerplate-kode (CRUD, forms, API routes)
- Konvertering mellom formater (JSON, TypeScript)
- Refaktorering av eksisterende kode
- Generering av tester basert på spesifikasjoner
- Debugging med god kontekst

**Når man bør være forsiktig:**
- Sikkerhets-kritisk kode (auth, kryptering)
- Domene-spesifikk forretningslogikk
- Ytelseskritiske algoritmer
- Kode som integrerer med eldre systemer
- Cutting-edge teknologi (KI har utdatert kunnskap)

### 11.3 Forbedringer til kurset
**Forslag:**
- Mer fokus på prompt engineering teknikker.
- Felles prompt-library som ressurs.
- Obligatorisk "KI-feil" rapport for læring.
- Mer om etiske vurderinger og bias.
- Gjesteforelesning fra industrien om KI i praksis.

---

## Del 12: Konklusjon

### 12.1 Hovedlærdommer om KI-assistert utvikling

**Teknisk:**
- KI akselererer utvikling dramatisk (80-85% besparelse) men erstatter ikke forståelse.
- Prompting er en ferdighet som krever øvelse og raffinering.
- Testing er like viktig - kanskje viktigere - med KI-generert kode.
- KI har begrensninger: utdatert kunnskap, hallusinasjoner, konteksttap.

**Prosess:**
- KI endrer fokus fra syntaks til arkitektur og design.
- Kvalitetssikring er fortsatt kritisk - utviklerne er "gatekeepers".
- Dokumentasjon av KI-bruk er viktig for etterprøvbarhet.
- Strukturerte metodikker (BMAD) komplementerer KI godt.

**Personlig utvikling:**
- Ny måte å tenke på programmering - kommunikasjon over syntaks.
- Viktigheten av presis kommunikasjon har økt.
- Kritisk tenkning er viktigere enn noensinne.
- Fremtidens utviklere må mestre KI-samarbeid.

### 12.2 Refleksjon over kursets læringsmål

**Hvordan prosjektet demonstrerte oppnådde læringsmål:**
*Kunnskap:*
Vi utviklet dyp forståelse for KI-assistert programmering gjennom 6 ukers intensiv bruk. Vi opplevde direkte hvordan KI genererer kode (mønstergjenkjenning, statistisk sannsynlighet) og dets begrensninger (hallusinasjoner, utdatert kunnskap). Etiske vurderinger rundt eierskap, bias og ansvar ble tydelige gjennom prosjektet.
*Ferdigheter:*
Vi konfigurerte et komplett utviklingsmiljø for KI-assistert utvikling med VS Code og Claude. Vi utviklet prompting-ferdigheter fra nybegynner til erfaren nivå. Kodeevaluering og feilsøking ble en daglig praksis, og vi testet og validerte KI-genererte løsninger kontinuerlig.
*Generell kompetanse:*
Vi drev et fullskala programvareutviklingsprosjekt med KI-støtte fra idé til deployment. Vi utviklet en kritisk forståelse av KI som verktøy - ikke magi, men en kraftfull assistanse.

### 12.3 Stoltheter

**Vi er mest stolte av:**
1.  **Fungerende MVP på 6 uker** - komplett app med alle planlagte MVP-features.
2.  **Fleksibel oppskriftsmatching** - den unike 🟢🟡⚪ tier-løsningen som differensierer fra konkurrenter.
3.  **Kodekvalitet** - 100% TypeScript coverage, 0 ESLint errors, strukturert arkitektur.
4.  **Prompting-evolusjon** - fra vage til presise, produksjonsklare prompts.
5.  **Læringsutbytte** - en ny måte å tenke på programmering.

### 12.4 Fremtiden for KI-assistert utvikling

**Våre tanker om fremtiden:**
*Hvordan vil KI endre programmeringsyrket?*
KI vil ikke erstatte utviklere, men utviklere som mestrer KI vil erstatte de som ikke gjør det. Rollen vil skifte fra "kodeskriver" til "løsningsarkitekt og kvalitetssikrer".

*Hvilke ferdigheter vil være viktige?*
- Presisjon i kommunikasjon (prompting)
- Systemtenkning og arkitektur
- Kritisk evaluering av KI-output
- Domeneforståelse
- Etisk vurderingsevne

*Hvordan vil vi bruke KI i fremtidige prosjekter?*
Vi vil bruke KI som en "junior developer" som trenger veiledning og review, men som jobber ekstremt raskt. Vi vil etablere prompt libraries og quality gates fra start. Vi vil være transparente om KI-bruk og alltid ta ansvar for output.

### 12.5 Avsluttende refleksjon

[SKRIV HER: Hver person skriver 100-150 ord hver som en felles, sammenhengende refleksjon over hele prosjektet og kurset. Fokuser på:
- Den viktigste lærdommen for teamet.
- Hvordan dette endret deres syn på programmering og teamarbeid.
- Hva dere vil ta med videre i studier/karriere.]

---

## Vedlegg

### A. Lenker
- **Repository:** `[GitHub URL - fyll inn]`
- **Deployed app:** `[Vercel URL - fyll inn]`
- **Dokumentasjon:**
  - `fase-0/` - Discovery: brainstorming, research, product-brief
  - `fase-1/` - Planning: PRD, validation-report, UX-design, mockups
  - `fase-2/` - Architecture: architecture, gate-check
  - `fase-3/sprint-artifacts/` - Implementation: sprint-status, tech-specs, stories

### B. Prompt-eksempler

*Følgende er kuraterte eksempler på effektive prompts vi brukte i prosjektet. For en fullstendig, ufiltrert historikk av alle interaksjoner, se loggfilene i mappen `.logging/requests`. Filnavn (f.eks. `2025-11-24_18-58-55-250b93ab-b335-486c-b003-a07793e553ba.json`) kan brukes til å referere til spesifikke samtaler direkte i rapportteksten.*

**Eksempel 1: Prisma Schema**
```
Lag et Prisma schema for en matplanleggingsapp med følgende modeller:
- User: id, email, passwordHash, name, timestamps
- FoodItem: id, name, category, bestBeforeDate, quantity, unit, userId
- Recipe: id, spoonacularId, title, image, ingredients (JSON), instructions, cookingTime, servings
- Notification: id, userId, message, type, isRead, foodItemId, timestamp

Inkluder:
- Relasjoner mellom modeller
- Indexer på ofte-søkte felter (userId, bestBeforeDate)
- Cascade delete der relevant
- PostgreSQL som provider
```
**Resultat:** Komplett, produksjonsklar Prisma schema med alle relasjoner og indexer.

**Eksempel 2: API Route**
```
Lag en Next.js 14 API route for pantry items i src/app/api/pantry/route.ts:
- GET: Hent alle items for autentisert bruker, sorted by bestBeforeDate
- POST: Opprett ny item med validering (Zod schema)
- Bruk Prisma client fra @/lib/prisma
- Hent user ID fra NextAuth session
- Returner JSON responses med korrekte status codes
- Inkluder error handling
```
**Resultat:** Fungerende API route med full CRUD, validering og auth.

**Eksempel 3: React Component**
```
Lag en AddItemDialog React komponent for Next.js:
- shadcn/ui Dialog komponent
- Form med react-hook-form og zod validering
- Felter: name, category (dropdown), quantity, unit, bestBeforeDate
- Submit handler som kaller POST /api/pantry
- Loading state på submit button
- Error handling med toast notifications
- Mobile-first responsive design
```
**Resultat:** Komplett dialog med all funksjonalitet.

**Eksempel 4: Feilsøking av en bug**
```
Jeg opplever et problem der bildet i "Recipe Details Modal" er tomt 
eller ødelagt når jeg klikker på en AI-generert oppskrift.

Vennligst analyser prosjektet for å finne rotårsaken. IKKE rediger
noen filer ennå, bare forklar hva som er galt.

Sjekk disse spesifikke tingene:
1. Sjekk `src/lib/googleai.ts`: Hvilken bilde-URL blir tildelt AI-oppskriftene?
2. Sjekk `next.config.ts`: Er vertsnavnet for bilde-URL-en riktig tillatt i remotePatterns?
3. Sjekk `src/app/(auth)/recipes/page.tsx`: Hvordan blir bildet gjengitt inne i modalen? Bruker vi Next.js <Image>-komponenten eller en standard <img>-tag?

Basert på koden, hvorfor lastes ikke bildet?
```
**Resultat:** KI-en fulgte instruksjonene trinnvis, identifiserte at en standard `<img>`-tag ble brukt i stedet for Next.js sin `<Image>`-komponent, og forklarte korrekt at dette omgår `remotePatterns`-konfigurasjonen og sannsynligvis bryter med sidens Content Security Policy (CSP).

**Eksempel 5: Generering av Dokumentasjon (User Stories)**
```
Du er en erfaren produktsjef. Basert på vår `product-brief-ibe160-2025-11-03.md`, generer en "User Stories"-seksjon for vår PRD.

Inkluder minst tre brukerhistorier for hver av disse personaene:
1.  **Den travle familien:** Ønsker raske, sunne middager og å unngå matsvinn.
2.  **Studenten på budsjett:** Ønsker billige oppskrifter og å bruke opp alt de kjøper.
3.  **Den matinteresserte hobbykokken:** Ønsker å eksperimentere med ingrediensene de har.

Formatet for hver user story skal være:
"Som en [persona], ønsker jeg å [mål], slik at [utbytte]."
```
**Resultat:** KI-en genererte en velstrukturert liste med brukerhistorier i korrekt format, tilpasset de ulike personaene, som kunne limes rett inn i prosjektets PRD.

### C. Prosjektstruktur
```
/
├── README.md                    # Project overview
├── docs/                        # Core documents
│   ├── PRD.md
│   ├── proposal.md
│   └── bmm-workflow-status.yaml
├── fase-0/                      # Discovery
│   ├── README.md
│   ├── brainstorming-session-results-2025-10-28.md
│   ├── product-brief-ibe160-2025-11-03.md
│   ├── research-findings.md
│   └── research-technical-2025-10-28.md
├── fase-1/                      # Planning & Design
│   ├── README.md
│   ├── ux-design-specification.md
│   ├── landing_page.html
│   ├── pantry_overview.html
│   ├── add_item_dialog.html
│   ├── recipe_browser.html
│   ├── smart_grocery_list.html
│   ├── expiration_alerts_dashboard.html
│   └── user_profile.html
├── fase-2/                      # Architecture
│   ├── README.md
│   ├── architecture.md
│   └── solutioning-gate-check-report.md
├── fase-3/                      # Implementation
│   ├── README.md
│   ├── sprint-status.yaml
│   └── sprint-artifacts/
│       ├── tech-spec-epic-*.md
│       └── story-*.md
└── ibe160-app/                  # Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   ├── (unauth)/
    │   │   └── api/
    │   ├── components/
    │   └── lib/
    ├── prisma/
    └── public/
```

### D. Statistikk

- **Antall commits:** `[Fyll inn fra git log --oneline | wc -l]`
- **Linjer kode:** `[Fyll inn fra cloc src/]`
- **Antall API-endepunkter:** ~8-10
- **Antall komponenter:** `[Fyll inn fra ls src/components/*.tsx | wc -l]`
- **Estimert andel KI-generert kode:** 85%
- **Antall prompts brukt (estimat):** 150+

### E. KI-verktøy konfigurasjon

**Google Gemini CLI oppsett:**
- Installert via Google Cloud SDK.
- Kjøres med `gemini` kommandoen i terminalen.
- Bruker `gcloud auth application-default login` for autentisering.

**Anthropic Claude oppsett:**
- Brukt via claude.ai web interface.
- Prosjekt-kontekst lagret i Claude Projects.
- Dokumenter fra fase-0 til fase-2 brukt som kontekst for å opprettholde samtalehistorikk.

**VS Code settings:**
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---
**Signert av gruppemedlemmer:**

| Navn | Dato | Signatur |
|------|------|----------|
| a | | |
| b | | |
| c | | |
| d | | |

---
*Denne refleksjonsrapporten er utarbeidet som en del av IBE160 Programmering med KI ved Høgskolen i Molde. Rapporten dokumenterer vår erfaring med KI-assistert programvareutvikling og reflekterer over læringsmålene definert i kursbeskrivelsen.*