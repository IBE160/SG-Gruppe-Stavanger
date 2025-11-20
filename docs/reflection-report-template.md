# Refleksjonsrapport - Smart Food & Recipe Platform

**Kurs:** IBE160 Programmering med KI
**Prosjekt:** Smart Food & Recipe Platform
**Dato:** November 2025
**Gruppe:** SG-Gruppe-Stavanger

---

## Gruppemedlemmer

| Nr | Navn | Rolle | Hovedansvar |
|----|------|-------|-------------|
| 1 | a | | |
| 2 | b | | |
| 3 | c | | |
| 4 | d | | |

---

## Del 1: Prosjektoversikt

### 1.1 Prosjektbeskrivelse

Smart Food & Recipe Platform er en intelligent matplanleggingsapplikasjon utviklet som en del av IBE160 Programmering med KI. Applikasjonen adresserer et reelt samfunnsproblem: husholdninger kaster over 1 milliard måltider daglig globalt, og den gjennomsnittlige norske familie kaster mat for tusenvis av kroner årlig.

Vår løsning kombinerer tradisjonell webutvikling med KI-assistert programmering for å skape en plattform som hjelper brukere med å:
- Holde oversikt over matvarer og utløpsdatoer
- Finne oppskrifter basert på tilgjengelige ingredienser
- Redusere matsvinn gjennom smarte varsler
- Generere intelligente handlelister

Prosjektet demonstrerer hvordan KI-assistert utvikling kan akselerere utviklingsprosessen samtidig som det opprettholdes høy kodekvalitet og god arkitektur.

### 1.2 Hovedfunksjoner implementert

#### MVP-funksjoner
- [x] Brukerautentisering med Auth.js v5 (registrering, innlogging, sesjonshåndtering)
- [x] Matvarelager med CRUD-operasjoner og utløpsdatoer
- [x] Strekkodeskanning med kamera for rask registrering
- [x] Oppskriftssøk via Spoonacular API med caching
- [x] Fleksibel oppskriftsmatching (foreslår oppskrifter selv om 1-2 ingredienser mangler)
- [x] Smart handlelistegenerering (ekskluderer varer brukeren allerede har)
- [x] Utløpsvarsler med in-app notifikasjoner og e-post

#### Phase 2-3 funksjoner (Beyond MVP)
- [x] AI-drevet semantisk søk
- [x] AI-baserte ingredienserstatninger
- [x] Ernæringsanalyse for oppskrifter
- [x] Husholdningsdeling med invitasjonskoder
- [x] Brukeranmeldelser og vurderinger
- [x] Gamification med poeng, nivåer og prestasjoner

### 1.3 Teknisk stack

| Kategori | Teknologi | Versjon | Begrunnelse |
|----------|-----------|---------|-------------|
| Frontend | Next.js | 14 | App Router, Server Components, SSR/SSG |
| UI | Tailwind CSS | 4 | Utility-first CSS, rask prototyping |
| Komponenter | shadcn/ui | Latest | Tilgjengelige, tilpassbare komponenter |
| Backend | Next.js API Routes | 14 | Integrert med frontend, serverless |
| Database | Supabase (PostgreSQL) | - | Gratis tier, real-time, auth |
| ORM | Prisma | 6.19 | Type-safe queries, migrations |
| Autentisering | Auth.js | v5 beta | Moderne, fleksibelt, NextAuth etterfølger |
| State | Zustand | 5 | Enkel, liten bundle size |
| Fetching | React Query | 5 | Caching, deduplication |
| Hosting | Vercel | - | Zero-config, edge network |

---

## Del 2: KI-assistert utvikling - Metodikk og erfaring

### 2.1 Skiftet fra tradisjonell til KI-assistert utvikling

Som beskrevet i kursets læringsmål representerer dette prosjektet et fundamentalt skifte i arbeidsmetodikk:

**Fra tradisjonell koding:**
- Programmereren skriver all syntaks manuelt
- Fokus på å huske API-er og syntaks
- Tidkrevende feilsøking av skrivefeil

**Til KI-assistert utvikling:**
- Studenten designer, formulerer og evaluerer løsninger
- Fokus på presis kommunikasjon og systemforståelse
- KI håndterer teknisk implementering

#### Refleksjon over skiftet
Beskriv hvordan dette skiftet påvirket deres arbeidsmetode:
- Hvordan endret fokuset deres seg fra syntaks til arkitektur?
- Opplevde dere økt produktivitet? Kvantifiser gjerne.
- Hvilke nye ferdigheter måtte dere utvikle?

### 2.2 Prompting og naturlig språk

En kjerneferdighet i KI-assistert utvikling er å formulere presise systemspesifikasjoner i naturlig språk. Dette krever:

#### Effektive prompting-teknikker vi brukte

| Teknikk | Beskrivelse | Eksempel |
|---------|-------------|----------|
| Kontekstsetting | Gi KI nødvendig bakgrunnsinformasjon | "Vi bruker Next.js 14 med App Router og Prisma ORM..." |
| Spesifikke krav | Klare, målbare akseptansekriterier | "Funksjonen skal returnere oppskrifter sortert etter match-prosent..." |
| Iterativ raffinering | Gradvis forbedring av output | "Kan du legge til error handling for..." |
| Eksempelbasert | Vise ønsket format/struktur | "Lik denne komponenten, men med..." |

#### Utfordringer med prompting
-
-
-

#### Lærdommer om presis formulering
-
-
-

### 2.3 BMAD-metodikk

Vi fulgte BMad Method (Business Model Agile Development) med følgende faser:

| Fase | Navn | Dokumenter produsert | KI-verktøy brukt |
|------|------|---------------------|------------------|
| 0 | Discovery | Brainstorming, research, product brief | |
| 1 | Planning & Design | PRD, UX design, CI pipeline | |
| 2 | Architecture | System design, gate check | |
| 3 | Implementation | Epics, stories, sprints | |

**Refleksjon over BMAD:**
- Hvordan støttet metodikken KI-assistert utvikling?
- Var fasene nyttige for å strukturere prompts?
- Ville dere brukt BMAD igjen? Hvorfor/hvorfor ikke?

### 2.4 Prosjektplanlegging

**Timeline:** 9 uker

| Uke | Fokus | KI-bruk | Utfordringer |
|-----|-------|---------|--------------|
| 1 | Prosjektoppsett, auth, database | | |
| 2 | Inventory CRUD-operasjoner | | |
| 3 | Strekkodeskanning | | |
| 4 | Oppskrifts-API integrasjon | | |
| 5 | Fleksibel oppskriftsmatching | | |
| 6 | Smart handlelistegenerering | | |
| 7 | Utløpsvarsler og bekreftelser | | |
| 8 | Testing og UI-polish | | |
| 9 | Final testing og deployment | | |

---

## Del 3: KI-verktøy og kodegenerering

### 3.1 KI-verktøy brukt i prosjektet

| Verktøy | Versjon | Bruksområde | Styrker | Svakheter |
|---------|---------|-------------|---------|-----------|
| Claude Code | Sonnet 4.5 | Koding, dokumentasjon, arkitektur | | |
| Gemini | | | | |
| ChatGPT | | | | |
| GitHub Copilot | | | | |

### 3.2 Utviklingsmiljø for KI-assistert utvikling

Som kurset vektlegger, er konfigurering av utviklingsmiljø en viktig ferdighet.

**Vår oppsett:**
- Editor: VS Code med extensions
- Terminal: Integrert terminal med KI-verktøy
- Versjonskontroll: Git med branch-strategi
- CI/CD: GitHub Actions

**Viktige extensions/verktøy:**
-
-
-

**Konfigurasjon for optimal KI-bruk:**
-
-

### 3.3 Hvordan KI genererer kode

#### Forståelse av KI-kodegenerering
Basert på kursets læringsmål skal vi ha "innsikt i hvordan KI genererer kode og hvilke begrensninger og utfordringer som finnes."

**Observasjoner om KI-kodegenerering:**
- Mønstergjenkjenning: KI gjenkjenner mønstre fra treningsdata
- Kontekstforståelse: Viktigheten av å gi god kontekst
- Begrensninger: Hva KI ikke klarer godt

**Begrensninger vi oppdaget:**

| Begrensning | Eksempel | Konsekvens | Løsning |
|-------------|----------|------------|---------|
| Utdatert kunnskap | | | |
| Hallusinasjoner | | | |
| Kontekstbegrensning | | | |
| Manglende prosjektforståelse | | | |

### 3.4 Kodeevaluering og feilsøking

En kritisk del av KI-assistert utvikling er å evaluere og feilsøke KI-generert kode.

**Vår evalueringsprosess:**

1. **Første gjennomgang**
   - Les og forstå koden før du kjører den
   - Sjekk for åpenbare feil og sikkerhetsproblemer
   - Verifiser at koden matcher spesifikasjonen

2. **Testing**
   - Kjør koden og observer oppførsel
   - Test edge cases
   - Verifiser error handling

3. **Code review**
   - Par-programmering for kritisk kode
   - Diskuter arkitektoniske beslutninger
   - Dokumenter lærdommer

**Vanlige feil vi fant i KI-generert kode:**

| Type feil | Frekvens | Eksempel | Hvordan vi oppdaget det |
|-----------|----------|----------|------------------------|
| | | | |
| | | | |
| | | | |

### 3.5 Integrering av KI-genererte moduler

**Utfordringer med integrering:**
-
-

**Strategier som fungerte:**
-
-

---

## Del 4: Testing og kvalitetssikring

### 4.1 Teststrategier for KI-generert kode

Kurset vektlegger evnen til å "teste og validere KI-genererte løsninger, samt optimalisere dem for ytelse og stabilitet."

**Teststrategi:**

| Testnivå | Verktøy | Dekningsmal | KI-bruk i testing |
|----------|---------|-------------|-------------------|
| Unit | Jest | 80% | |
| Integration | Testing Library | 70% | |
| E2E | Playwright | Kritiske flyter | |

**Testing av KI-generert kode krever ekstra fokus på:**
- Edge cases KI kan ha oversett
- Sikkerhetshull
- Performance-problemer
- Accessibility

### 4.2 Validering av KI-output

**Valideringsteknikker:**

| Teknikk | Beskrivelse | Når brukt |
|---------|-------------|-----------|
| Manuell kodegjennomgang | Lese og forstå all kode | Alltid |
| Type checking | TypeScript for compile-time feil | Kontinuerlig |
| Linting | ESLint for kodekvalitet | Automatisk |
| Testing | Automatiserte tester | Ved endringer |
| Security scanning | npm audit, etc. | Ved deploy |

### 4.3 Optimalisering

**Ytelsesforbedringer vi gjorde:**
-
-

**Stabilitetsforbedringer:**
-
-

---

## Del 5: Etikk og juridiske problemstillinger

Kurset krever "evne til å vurdere etikk og juridiske problemstillinger knyttet til KI-generert kode."

### 5.1 Eierskap til KI-generert kode

**Spørsmål vi vurderte:**
- Hvem eier kode generert av KI?
- Kan KI-generert kode inneholde opphavsrettsbeskyttet materiale?
- Hvordan dokumenterer vi KI-bidrag?

**Vår tilnærming:**
-
-

### 5.2 Risiko for bias i algoritmer

**Potensielle bias-problemer i vår applikasjon:**
- Oppskriftsanbefalinger kan favorisere visse kulturer
- Ernæringsråd kan være basert på vestlige standarder

**Tiltak vi tok:**
-
-

### 5.3 Ansvar og accountability

**Hvem er ansvarlig når KI-generert kode feiler?**
-

**Hvordan sikret vi kvalitet?**
-

### 5.4 Transparens

**Skal brukere vite at koden er KI-generert?**
-

**Dokumentasjon av KI-bruk:**
-

### 5.5 Personvern og datasikkerhet

**Vurderinger:**
- Hvilke data sendes til KI-tjenester?
- Hvordan beskytter vi brukerdata?
- GDPR-compliance

**Tiltak:**
-
-

---

## Del 6: Individuelle bidrag og refleksjoner

### 6.1 Gruppemedlem 1: a

**Hovedansvar:**
-

**Konkrete bidrag:**
-
-
-

**KI-verktøy brukt og erfaring:**
- Hvilket verktøy brukte du mest?
- Hvordan formulerte du prompts?
- Beste eksempel på effektiv KI-bruk:

**Tekniske lærdommer:**
- Hva lærte du om KI-assistert utvikling?
- Hvilke nye teknologier mestret du?
- Hvordan endret synet ditt på programmering seg?

**Prosesslærdommer:**
- Hva lærte du om presis kommunikasjon?
- Hvordan samarbeidet du med KI vs. teammedlemmer?

**Utfordringer med KI-verktøy:**

| Utfordring | Kontekst | Løsning | Lærdom |
|------------|----------|---------|--------|
| | | | |

**Etiske refleksjoner:**
- Hvilke etiske dilemmaer møtte du?
- Hvordan håndterte du dem?

**Selvvurdering:**
- Hva er du mest fornøyd med?
- Hva ville du gjort annerledes?
- Hvordan vil du bruke KI i fremtidige prosjekter?

---

### 6.2 Gruppemedlem 2: b

**Hovedansvar:**
-

**Konkrete bidrag:**
-
-
-

**KI-verktøy brukt og erfaring:**
- Hvilket verktøy brukte du mest?
- Hvordan formulerte du prompts?
- Beste eksempel på effektiv KI-bruk:

**Tekniske lærdommer:**
- Hva lærte du om KI-assistert utvikling?
- Hvilke nye teknologier mestret du?
- Hvordan endret synet ditt på programmering seg?

**Prosesslærdommer:**
- Hva lærte du om presis kommunikasjon?
- Hvordan samarbeidet du med KI vs. teammedlemmer?

**Utfordringer med KI-verktøy:**

| Utfordring | Kontekst | Løsning | Lærdom |
|------------|----------|---------|--------|
| | | | |

**Etiske refleksjoner:**
- Hvilke etiske dilemmaer møtte du?
- Hvordan håndterte du dem?

**Selvvurdering:**
- Hva er du mest fornøyd med?
- Hva ville du gjort annerledes?
- Hvordan vil du bruke KI i fremtidige prosjekter?

---

### 6.3 Gruppemedlem 3: c

**Hovedansvar:**
-

**Konkrete bidrag:**
-
-
-

**KI-verktøy brukt og erfaring:**
- Hvilket verktøy brukte du mest?
- Hvordan formulerte du prompts?
- Beste eksempel på effektiv KI-bruk:

**Tekniske lærdommer:**
- Hva lærte du om KI-assistert utvikling?
- Hvilke nye teknologier mestret du?
- Hvordan endret synet ditt på programmering seg?

**Prosesslærdommer:**
- Hva lærte du om presis kommunikasjon?
- Hvordan samarbeidet du med KI vs. teammedlemmer?

**Utfordringer med KI-verktøy:**

| Utfordring | Kontekst | Løsning | Lærdom |
|------------|----------|---------|--------|
| | | | |

**Etiske refleksjoner:**
- Hvilke etiske dilemmaer møtte du?
- Hvordan håndterte du dem?

**Selvvurdering:**
- Hva er du mest fornøyd med?
- Hva ville du gjort annerledes?
- Hvordan vil du bruke KI i fremtidige prosjekter?

---

### 6.4 Gruppemedlem 4: d

**Hovedansvar:**
-

**Konkrete bidrag:**
-
-
-

**KI-verktøy brukt og erfaring:**
- Hvilket verktøy brukte du mest?
- Hvordan formulerte du prompts?
- Beste eksempel på effektiv KI-bruk:

**Tekniske lærdommer:**
- Hva lærte du om KI-assistert utvikling?
- Hvilke nye teknologier mestret du?
- Hvordan endret synet ditt på programmering seg?

**Prosesslærdommer:**
- Hva lærte du om presis kommunikasjon?
- Hvordan samarbeidet du med KI vs. teammedlemmer?

**Utfordringer med KI-verktøy:**

| Utfordring | Kontekst | Løsning | Lærdom |
|------------|----------|---------|--------|
| | | | |

**Etiske refleksjoner:**
- Hvilke etiske dilemmaer møtte du?
- Hvordan håndterte du dem?

**Selvvurdering:**
- Hva er du mest fornøyd med?
- Hva ville du gjort annerledes?
- Hvordan vil du bruke KI i fremtidige prosjekter?

---

## Del 7: Samarbeid og kommunikasjon

### 7.1 Tverrfaglig samarbeid

Kurset vektlegger evnen til å "samarbeide tverrfaglig med både teknologer og ikke-teknologer, og forklare KI-generert programvare for ulike målgrupper."

**Hvordan kommuniserte vi tekniske konsepter?**
-

**Samarbeid med ikke-tekniske interessenter:**
-

### 7.2 Kommunikasjonsverktøy

| Verktøy | Bruk | Effektivitet |
|---------|------|--------------|
| Discord/Slack | Daglig kommunikasjon | |
| GitHub | Kode og issues | |
| Møter | Ukentlig sync | |

### 7.3 Arbeidsfordeling

**Hvordan fordelte vi arbeidet?**
-

**Håndtering av KI-assistert kode fra ulike teammedlemmer:**
-

**Hva fungerte godt?**
-

**Hva kunne vært bedre?**
-

### 7.4 Konflikthåndtering

**Oppstod det uenigheter om KI-bruk?**
-

**Hvordan løste vi dem?**
-

---

## Del 8: Utfordringer og løsninger

### 8.1 Største utfordringer

| Utfordring | Beskrivelse | KI-relatert? | Løsning | Tid brukt |
|------------|-------------|--------------|---------|-----------|
| 1. | | | | |
| 2. | | | | |
| 3. | | | | |

### 8.2 KI-spesifikke utfordringer

**Når KI ikke forsto konteksten:**
-

**Når KI genererte feil kode:**
-

**Når KI-verktøy var utilgjengelige:**
-

### 8.3 Teknisk gjeld

**Hva ville vi forbedret med mer tid?**
-
-
-

---

## Del 9: Resultater og måloppnåelse

### 9.1 MVP-krav

| Krav | Status | KI-bidrag | Kommentar |
|------|--------|-----------|-----------|
| Brukerregistrering og innlogging | ✅ | | |
| Matvarelager med utløpsdatoer | ✅ | | |
| Oppskriftssøk | ✅ | | |
| Fleksibel matching | ✅ | | |
| Handlelistegenerering | ✅ | | |
| Utløpsvarsler | ✅ | | |

### 9.2 Ekstra funksjoner (Beyond MVP)

| Funksjon | Status | KI-bidrag | Verdi for bruker |
|----------|--------|-----------|------------------|
| Strekkodeskanning | ✅ | | |
| AI-søk | ✅ | | |
| Ernæringsanalyse | ✅ | | |
| Husholdningsdeling | ✅ | | |
| Gamification | ✅ | | |

### 9.3 Ytelse og kvalitet

| Metrikk | Mål | Oppnådd | Kommentar |
|---------|-----|---------|-----------|
| Responstid | < 2s | | |
| Lighthouse score | > 90 | | |
| Oppetid | 99% | | |
| TypeScript coverage | 100% | | |

### 9.4 Læringsmål oppnådd

**Kunnskap:**
- [ ] Forståelse for KI-assistert programmering
- [ ] Innsikt i hvordan KI genererer kode
- [ ] Kunnskap om utviklingssyklusen
- [ ] Evne til å vurdere etikk og juridiske problemstillinger

**Ferdigheter:**
- [ ] Konfigurere utviklingsmiljø for KI
- [ ] Utforme systemspesifikasjoner i naturlig språk
- [ ] Gjennomføre kodeevaluering og feilsøking
- [ ] Teste og validere KI-genererte løsninger

**Generell kompetanse:**
- [ ] Drive programvareutvikling med KI-støtte
- [ ] Kritisk forståelse av KI
- [ ] Tverrfaglig samarbeid

---

## Del 10: Hva vi ville gjort annerledes

### 10.1 KI-bruk
-

### 10.2 Prompting-strategier
-

### 10.3 Tekniske valg
-

### 10.4 Prosess
-

### 10.5 Samarbeid
-

---

## Del 11: Anbefalinger

### 11.1 For fremtidige studenter i IBE160

**Gjør dette:**
1. Start med å forstå problemdomenet før du bruker KI
2. Lær å skrive presise prompts - dette er en ferdighet
3. Alltid les og forstå KI-generert kode før du bruker den
4. Dokumenter KI-bruk for læring og etterprøvbarhet
5.

**Unngå dette:**
1. Ikke stol blindt på KI-generert kode
2. Ikke hopp over testing fordi "KI skrev det"
3. Ikke glem å vurdere etiske implikasjoner
4. Ikke undervurder viktigheten av god kontekst i prompts
5.

### 11.2 Effektiv bruk av KI i utvikling

**Når KI er mest nyttig:**
-
-
-

**Når man bør være forsiktig:**
-
-
-

### 11.3 Forbedringer til kurset

**Forslag:**
-

---

## Del 12: Konklusjon

### 12.1 Hovedlærdommer om KI-assistert utvikling

**Teknisk:**
- KI akselererer utvikling men erstatter ikke forståelse
- Prompting er en ferdighet som krever øvelse
-
-

**Prosess:**
- KI endrer fokus fra syntaks til arkitektur og design
- Kvalitetssikring er fortsatt kritisk
-
-

**Personlig utvikling:**
- Ny måte å tenke på programmering
- Viktigheten av presis kommunikasjon
-
-

### 12.2 Refleksjon over kursets læringsmål

**Hvordan prosjektet demonstrerte oppnådde læringsmål:**

*Kunnskap:*
-

*Ferdigheter:*
-

*Generell kompetanse:*
-

### 12.3 Stoltheter

**Vi er mest stolte av:**
1.
2.
3.

### 12.4 Fremtiden for KI-assistert utvikling

**Våre tanker om fremtiden:**
- Hvordan vil KI endre programmeringsyrket?
- Hvilke ferdigheter vil være viktige?
- Hvordan vil vi bruke KI i fremtidige prosjekter?

### 12.5 Avsluttende refleksjon

Skriv en sammenfattende refleksjon over hele prosjektet og kurset (200-300 ord):

-

---

## Vedlegg

### A. Lenker

- **Repository:** [GitHub URL]
- **Deployed app:** [Vercel URL]
- **Dokumentasjon:** Se fase-0 til fase-3 mapper

### B. Prompt-eksempler

Inkluder 3-5 eksempler på effektive prompts dere brukte:

**Eksempel 1:**
```
[Prompt her]
```
**Resultat:** [Kort beskrivelse]

**Eksempel 2:**
```
[Prompt her]
```
**Resultat:** [Kort beskrivelse]

### C. Skjermbilder

[Legg til relevante skjermbilder av appen]

### D. Statistikk

- **Antall commits:**
- **Linjer kode:**
- **Antall API-endepunkter:** 14
- **Antall komponenter:**
- **Estimert andel KI-generert kode:** %
- **Antall prompts brukt (estimat):**

### E. KI-verktøy konfigurasjon

Inkluder relevante konfigurasjonsfiler eller settings brukt:

```
[Konfigurasjon her]
```

---

## Ordtelling

**Totalt antall ord:** [Fyll inn]
**Mål:** ~4500 ord

---

**Signert av gruppemedlemmer:**

| Navn | Dato | Signatur |
|------|------|----------|
| a | | |
| b | | |
| c | | |
| d | | |

---

*Denne refleksjonsrapporten er utarbeidet som en del av IBE160 Programmering med KI ved [Institusjon]. Rapporten dokumenterer vår erfaring med KI-assistert programvareutvikling og reflekterer over læringsmålene definert i kursbeskrivelsen.*
