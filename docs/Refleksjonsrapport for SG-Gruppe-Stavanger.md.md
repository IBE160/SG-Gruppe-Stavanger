# Refleksjonsrapport - Programmering med KI

## 1. Gruppeinformasjon

**Gruppenavn:** SG-Gruppe-Stavanger

**Gruppemedlemmer:**
- Thomas Ekrem Jensen [thomas.e.jensen@himolde.no]
- Sigurd Hov [Sigurd.hov@himolde.no]
- Kristine Davik [kristine.davik@himolde.no]
- Tina Rosland [tina.c.rosland@himolde.no]


**Dato:** 02.12.2025

---

## 2. Utviklingsprosessen

### 2.1 Oversikt over prosjektet
[Kort beskrivelse av hva dere har utviklet. Hva var hovedmålet med applikasjonen?]

Smart Food & Recipe Platform er en intelligent matplanleggingsapplikasjon utviklet som en del av IBE160 Programmering med KI. Applikasjonen adresserer et reelt samfunnsproblem: husholdninger kaster over 1 milliard måltider daglig globalt, og den gjennomsnittlige norske familie kaster mat for tusenvis av kroner årlig.

Vår løsning kombinerer tradisjonell webutvikling med KI-assistert programmering for å skape en plattform som hjelper brukere med å:
- Holde oversikt over matvarer og utløpsdatoer
- Finne oppskrifter basert på tilgjengelige ingredienser
- Redusere matsvinn gjennom smarte varsler
- Generere intelligente handlelister

Plattformens kjernevisjon er å vise brukere "hva de kan lage med det de allerede har" – med fleksibel oppskriftsmatching som fungerer selv når man mangler 1-2 ingredienser. Dette forhindrer den frustrerende "ingen resultater"-opplevelsen som er vanlig i andre oppskriftsapper.
Prosjektet demonstrerer hvordan KI-assistert utvikling kan akselerere utviklingsprosessen samtidig som det opprettholdes høy kodekvalitet og god arkitektur.

### 2.2 Arbeidsmetodikk
[Beskriv hvordan dere organiserte arbeidet]
- Hvordan fordelte dere oppgaver?
- Hvilke verktøy brukte dere for samarbeid og hvordan det fungerte? (f.eks. Git, og Teams)
- Hvordan brukte dere KI-verktøy i prosessen?

Vi har hatt ukentlige møter med prosjektgruppa der vi har planlagt utviklingen av appen. Vi har diskutert mulige løsninger, funksjonalitet, hensikt med appen, BMAD-metoden, KI-verktøy, laget mock-ups og lignende. Vi har også gitt hverandre "hjemmelekser" til møtene som f.eks opprette planleggings-dokumenter eller review av dokumenter.

Etterhvert bestemte vi at vi skulle lage hver vår branch fra main i GitHub-prosjektet og følge forelesningene hver for oss utenom møtene, for å få testet hvordan det fungerte å opprette mapper
og håndtere Git-arbeidsflyten med commits og push/ pull etc.
 
Underveis i møtene har vi snakket om hvor langt vi hadde kommet, om noe var uklart og hvordan vi tolket beskjedene fra forelesningene.
 
Vi har hatt en del problemer med å finne en god struktur for samarbeid med løsningen på tvers i Git.

Vi har diskutert forskjellige forslag, f.eks om vi skulle:
- jobbe sammen om alt/ parprogrammering
- følge tempo i forelesningene slavisk eller bare kjøre på
- jobbe i hver vår branch, men så merge disse ved gitte tispunkt/ milepæler
- jobbe i hver vår branch og så levere det beste prosjektet/ appen til slutt

Vi ble aldri helt enig om fremgangsmåten i gruppa, så vi endte mer eller mindre opp med det siste alternativet. Oppgaven har blitt diskutert på et teoretisk nivå innad i gruppa
gjennom Teams-møtene, men selve utførelsen skjedde hver for oss. Gruppen har hatt ganske forskjellig tempo underveis, litt fordi forelesningene til tider var utydelige og vi følte
at forelesningene hang bakpå mtp det vi skulle oppnå til fristen for innleveringen. Og så kom "åpenbaringen", dvs project-plan.md ganske sent. Så det ble en del armer og bein på slutten for å få utviklet selve appen. Da følte vi at tiden for samarbeid var løpt fra oss.

En annen utfordring ifm med utvikling av appen var at vi skulle bygge den opp fra bunn, så hvis vi skulle gjort hver vår del måtte vi potensielt ventet på hverandre. Vi hadde ikke noe god praksis for å skille de ulike delene fra hverandre. Kanskje hvis vi hadde kommet igang mye før og fått et "skjelett" på plass så kunne vi jobbet med hver våre funksjoner/ stories på toppen av det.

Et forslag fra oss til neste gang faget kjøres er at istedenfor å lage en app fra bunn så tar man utgangspunkt i noe som allerede eksisterer og gjør forbedringer/ legger til nye funksjoner,
etc. Så er det lettere for gruppa å utvikle og teste forskjellige ting underveis og se progresjon sammen. Feks en person kunne fikset farge på logo, en annen font-type, etc, etc. 

Vi har brukt Teams for møter og det har fungert fint. Alle prosjektdokumentene og koden har vi hatt i Git. Samarbeidet på tvers i Git har vært fraværende

Vi har brukt diverse KI verktøy gjennom prosessen, f.eks ChatGPT og Claude AI til hjelp med Git-kommandoer, Powershell-kode/kommandoer og review av prosjektfiler både kodefiler
og tekstfiler. I tillegg har vi brukt Gemini CLI/ Claude Code for å generere filer/ prosjektunderlag. Vi har også brukt Stitch AI til hjelp til layout på nettsiden, Google Studio AI
for mock-ups av nettsidene. Vi har også brukt Playwrite MCP server for Gemini Cli og Claude Code for feilsøking og retting av appen i browser.


### 2.3 Teknologi og verktøy
[Liste over de viktigste teknologiene og verktøyene dere brukte]
- Frontend: [Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui.]
- Backend: [TypeScript, Prisma, NextAuth, Next.js API Routes (Route Handlers)]
- Database: [Supabase (PostgreSQL), Spoonacular API (oppskriftsdatabase)]
- Andre: [React Query, Vercel]
- KI-verktøy: [Claude Code, Gemini CLI, ChatGPT, Stitch AI]
- Andre verktøy: [VS Code, BMAD etc, Git]


### 2.4 Utviklingsfaser
[Beskriv de ulike fasene i utviklingen]

**Fase 1: Planlegging**
- [Hva gjorde dere i denne fasen?] 
- [Hvordan brukte dere KI her? Husk å lagre promptene deres! Inkluder ALLE stegene dere gjorde.]

Vi hadde flere møter med idémyldring, diskusjoner om målgrupper, genererte bilder av appen ved hjelp av Stitch AI, genererte planleggingsdokumenter og generell brainstorming.

Vi brukte Gemini Cli og BMAD metoden til å generere planleggingsdokumentene. Vi tok utgangspunkt i proposal.md-filen og basert på denne brukte vi Gemini Cli til å gjennomføre brainstorming- og reseach-øker. Basert på tilbakemeldinger fra oss genererte Gemini Cli forskjellig prosjektunderlag som Product-Brief, Product Requirements Document (PRD) og UX Design. Eksempler på prompter fra denne frasen var: "you should give me a list of 8 options", "no, thats not right", "there should be a list to show the different options on what i can do, f ex workflow status was the second option".


**Fase 2: Utvikling**
- [Hva gjorde dere i denne fasen?] 
- [Hvordan brukte dere KI her? Husk å lagre promptene deres! Inkluder ALLE stegene dere gjorde.]

I denne fasen var fokuset mer på den tekniske løsningen. Også i denne fasen hadde vi Teamsmøter for å diskutere løsningen og videre hvordan den skulle fungere for brukeren og hvordan den skulle se ut visuelt.

Vi brukte Gemini Cli, BMAD metoden og agenter til å generere arkitetktur-dokumentet for prosjektet/ løsningen. Dette dokumentet definerte teknologistacken, implementasjonsmønstre og API-kontrakter. Deretter ble kravene dekomponert i Epics (1-4) og detaljerte i User Stories. En Implementation Readiness Report bekreftet at prosjektet var "Ready with Conditions" for implementering. KI-bruk: KI genererte arkitekturen og sørget for at teknologivalgene var sporbar og i tråd med PRD. KI dekomponerte også Epics til Stories og genererte Story Context XML for hver implementeringsenhet, som sikret at alle dev agenter/ utviklere hadde tilgang til samme konsoliderte bakgrunnsinformasjon. Eksempler på prompter var: "/run-agent-task architect", "/run-agent-task pm *create-epics-and-stories" og "/run-agent-task architect *solutioning-gate-check".


---

## 3. Utfordringer og løsninger

### 3.1 Tekniske utfordringer
[Beskriv 2-3 konkrete tekniske problemer dere møtte]

**Utfordring 1: [Ekstern API-avhengighet og ytelse]** 

Problem: Prosjektet er sterkt avhengig av Spoonacular API for oppskriftsdata. Dette skaper risiko for latenstid og rate-limiting. I tillegg var det et strengt ytelseskrav om at oppskriftssøk måtte leveres på under 1 sekund.

Løsning: Arkitekturen la opp til en omfattende strategi for å cache Spoonacular-svar og bruke Vercel Edge Caching/Next.js caching for å redusere antall eksterne kall og forbedre ytelsen. Et fallback-datasett ble også vurdert for å sikre robusthet.

KI sin rolle: KI (Gemini) hjalp med å definere den tekniske spesifikasjonen for caching og ytelse i Epic 3, samt å identifisere Spoonacular API som en kritisk risiko i PRD.

**Utfordring 2: [Sikkerhet for brukerdata]**

Problem: Sikkerheten til brukerens inventar (f.eks. hva de eier og når det utløper) er kritisk. Utfordringen var å sikre at en bruker kun kunne se, endre eller slette sine egne inventarelementer, uten å måtte skrive kompleks serversidekode for hver API-rute.

Løsning: Prosjektet valgte å implementere Row Level Security (RLS) direkte i Supabase PostgreSQL-databasen. Dette betyr at databasen selv håndhever autorisasjon basert på brukerens JWT-token, som ble levert av NextAuth.js. Alle Epic 2-historier hadde eksplisitte akseptkriterier for å verifisere at RLS var aktivt.

KI sin rolle: KI genererte den tekniske spesifikasjonen for Epic 2, inkludert nøyaktig SQL for å opprette RLS-policyer på inventory-tabellen, noe som sparte tid for utviklerne.


### 3.2 Samarbeidsutfordringer
[Utfordringer knyttet til teamarbeid og kommunikasjon]
  
Kommunikasjon og samarbeid i gruppen har fungert fint via Teams-møter og i gruppens egen Teamskanal, men på GitHub har samarbeidet vært fraværende. Vi har prøvd å diskutere oss frem til gode løsninger, men på grunn av prosjektets oppbygning og at vi alle var ferske Git-brukere var det vanskelig å se en god løsning, ref mer info om dette i kap. 2.2.

### 3.3 KI-spesifikke utfordringer
[Problemer spesifikt knyttet til bruk av KI]
- [f.eks. Feil kode fra KI, misforståelser, inkonsistent kvalitet] 
- [Hvordan håndterte dere disse?] 

Vi opplevde feil kode, misforståelser og inkonsistent kvalitet fra KI-verktøyene. Gemini CLI/Claude Code gikk ofte i loop, endret dokumenter eller filstrukturer frem og tilbake, manglet eller opprettet filer feil, eller gjorde dem kortere enn ønsket.

For å håndtere dette prøvde vi gjentatte ganger, startet dialoger på nytt, testet funksjoner med Playwrite MCP server, leste nøye gjennom endringer i Source Control før commit, og slettet feilaktige endringer.

---

## 4. Kritisk vurdering av KI sin påvirkning

### 4.1 Fordeler med KI-assistanse
[Reflekter over de positive aspektene]

**Effektivitet og produktivitet:**

KI økte arbeidshastigheten dramatisk i planleggingsfasene. KI genererte et fullstendig sett med MVP-dokumenter (PRD, Arkitektur, UX, 4 Epics) på en brøkdel av tiden det ville tatt et menneskelig team.

Eksempler på oppgaver som gikk raskere: Generering av detaljerte API-kontrakter, spesifisering av tekniske konfigurasjoner (f.eks. NextAuth.js/Supabase Auth integrasjon), og dekomponering av funksjonelle krav til Stories med oppgavene for backend, frontend og testing.

**Læring og forståelse:**
- [Hva lærte dere ved å bruke KI?] 
- [Bidro KI til bedre forståelse av konsepter?]

Vi lærte at tydelig informasjon er avgjørende for at KI skal gi gode resultater. BMAD-metoden ga oss et steg-for-steg-rammeverk, og grundig arbeid med hvert steg hjelper KI å forstå bedre.

KI bidro til bedre forståelse av konsepter ved å vise sin resonnering, som å observere en erfaren utvikler. Den tok også over noe feilsøking, så vi reflekterte ikke alltid like dypt, men prosjektplanlegging og utviklingsforståelse er fortsatt viktig for å styre KI effektivt.


**Kvalitet på koden:**
- [Hvordan påvirket KI kodekvaliteten?]
- [Eksempler på forbedringer KI foreslo]

KI sikret en svært høy grad av konsistens og samsvar med industristandarder gjennom de 13 implementeringsmønstrene definert i Arkitekturen.

Eksempler på forbedringer KI foreslo: KI foreslo bruk av PG Cron for bakgrunnsjobber og Supabase Realtime for sanntidsvarsler, som er en optimal og moderne løsning for en Next.js/Supabase-stack.

### 4.2 Begrensninger og ulemper
[Reflekter over de negative aspektene]

Det ble til tider en del surr spesielt i utvikling/ kode-delen. Kode-kompleksiteten ble fort høy. KI gjør mange endringer fort så det er vanskelig/ umulig å få med seg hva som skjer, som gjør at småting gjerne kan ta lang tid å fikse.


**Kvalitet og pålitelighet:**
- [Eksempler på feil eller dårlige løsninger fra KI] 
- [Hvordan oppdaget og håndterte dere disse?] 

KI implementerte bilioteker/ rammeverk uten at de var lastet ned, feil referanser i filer, og mye surr med repository strukturen. Den innledende KI-genererte arbeidsflyten var ineffektiv ved at den ikke ga tilstrekkelig med kodescaffolding. Dette er ikke en feil i selve koden, men en feil i den KI-genererte prosessen.

Feilen ble oppdaget under den retrospektive gjennomgangen etter Epic 2. Den ble håndtert ved å endre KI-arbeidsflyten til å generere filstubber og testplaner som en obligatorisk del av Story Context for fremtidige epics.


**Avhengighet og forståelse:**
- [Ble dere for avhengige av KI?] 
- [Var det tilfeller hvor KI hindret læring?]

Vi ble avhengig av KI. Prosjektet vokste seg raskt stort og komplekst så det ville tatt lang tid for et vanlig software-prosjekt å generelt all denne dokumentasjonen og koden manuelt.

Etterhvert gidder man ikke å lese feilkoder selv. Man tenker at man sparer til på å la KI tas seg av jobben uten å tenke så mye selv. Både fordi det er krevende, men også fordi KI jobber så hastig at løsningen fort blir kompleks å ha kontroll på. Da mister man mulighet til å lære seg hvordan applikasjonen faktisk fungerer på innsiden og hvilke begrensninger og muligheter som ligger der.


**Kreativitet og problemløsning:**
- [Påvirket KI deres egen kreativitet?]
- [Eksempler på situasjoner hvor KI begrenset kreativ tenkning] 

KI definerte de innovative mønstrene som "Expiration-to-Inspiration Loop" og "Instant Idea Button". Imidlertid kom selve ideen om å "Quick-Add" for å løse friksjonen ved manuell dataregistrering fra en tidlig brainstormingsesjon. KI fungerte primært som et verktøy for å spesifisere og teknisk muliggjøre de menneskelig genererte, kreative ideene. Generelt kan vi si at hvis du først har en ide er KI flink til å hjelpe deg videre.

Begrensningen oppsto når man stolte blindt på KI; ikke alle forslag var gode, så vi måtte fortsatt vurdere, forkaste og stille kritiske spørsmål for å bruke KI effektivt.


### 4.3 Sammenligning: Med og uten KI
[Reflekter over hvordan prosjektet ville vært uten KI]
- Hva ville vært annerledes? 
- Hvilke deler av prosjektet ville vært vanskeligere/lettere? 
- Ville sluttresultatet vært bedre eller dårligere? 

Uten KI ville prosjektet trolig ikke kommet forbi PRD- og arkitekturfase innen tidsrammen, og det ville vært umulig å generere 20+ detaljerte stories med subtasks for fire epics.

Uten KI og BMAD-metoden ville vi startet utviklingen tidligere og brukt mer tid på dokumentasjon, googling og eksempler – spesielt krevende for uerfarne utviklere.

Vanskeligere: Arkitekturdesign, teknisk forskning på AI-integrasjon (spesielt sammenligningen av kostnader for semantic search), og konsistens i dokumentene.

Lettere: Kritisk evaluering av planen ville vært mer naturlig hvis den var laget av mennesker.

Sluttresultat: Høyere og mer konsistent kvalitet enn realistisk for et studentteam. KI gjorde avanserte funksjoner som Realtime Notifications og Generative AI mulig i MVP.


### 4.4 Samlet vurdering
[Konklusjon: Hvordan påvirket KI sluttresultatet totalt sett?]
- Var KI en netto positiv eller negativ faktor? 
- Hva var den viktigste lærdommen om å bruke KI i utviklingsprosessen? 

KI var en netto positiv faktor som flyttet fokuset fra planleggingens mekanikk til planleggingens validitet og strategi.

Den viktigste lærdommen er at KI skaper et “ready-to-code”-scenario, men utviklerens rolle skifter til å være en arkitekturens vokter som validerer og justerer KI-generert kode. Det er viktig å være kritisk, kontrollere kodebasen selv, og være oppmerksom på KI-svakheter som halusinasjoner, utdatert kunnskap og kontekstsavvik. KI generert kode krever fortsatt grundig testing.

---

## 5. Etiske implikasjoner

### 5.1 Ansvar og eierskap
- Hvem er ansvarlig for koden når KI har bidratt?
- Hvordan sikrer man kvalitet når KI genererer kode?
- Diskuter spørsmål om opphavsrett og intellektuell eiendom 

Vi er ansvarlige for koden som KI genererer.
Kvalitet sikres ved grundig testing, inkludert edge- og fuzz-testing, fordi KI lett kan overse forhold som er åpenbare for erfarne utviklere.

Opphavsrett og intellektuell eiendom er fortsatt menneskets ansvar: KI kan ikke ha opphavsrett, så brukeren eller oppdragsgiver eier resultatet. Det gjør det viktig å vurdere hva KI-verktøyene er trent på, og om generert innhold kan ligne på beskyttet materiale.

EU’s AI Act innfører strengere krav til åpenhet om treningsdata i general-purpose-modeller. Dette kan gjøre det enklere å vurdere risiko og ta informerte valg.

Valg av LLM påvirker derfor både ansvar og rettigheter. Modeller varierer i åpenhet, lisensvilkår og bruksrettigheter, og man bør velge verktøy som gir klar dokumentasjon og forutsigbarhet for å unngå juridiske utfordringer.


### 5.2 Transparens
- Bør det være transparent at KI er brukt? 
- Hvordan dokumenterer man KI sin bidrag?
- Hva er konsekvensene av å ikke være åpen om KI-bruk?

Transparens avhenger av konteksten. For utviklere er det nyttig å vite hvilke deler av koden som er KI-generert, mens sluttbrukere bare trenger å informeres når KI faktisk påvirker innhold eller svar de får. Hvis appen gir KI-genererte anbefalinger eller informasjon, må dette merkes tydelig – særlig når feil kan få konsekvenser. Kritiske funksjoner som autentisering må uansett forstås, testes og kvalitetssikres av utvikleren som har ansvaret.

KI-bidrag kan dokumenteres i kodekommentarer, i teknisk dokumentasjon, og i personvernerklæringen dersom data sendes til KI-tjenester. Man kan også beskrive hvilke prompt-instrukser og modellversjoner som er brukt.

Manglende åpenhet kan føre til tap av tillit, feilbruk av systemet, og klager fra brukere. I tillegg kan det gi juridiske konsekvenser i EU/Norge, blant annet brudd på GDPR og AI Act, som krever tydelig merking av KI-generert innhold. Det øker også teknisk risiko fordi feil blir vanskeligere å spore, og gir etiske problemer hvis brukere ikke får vite at de samhandler med KI.


### 5.3 Påvirkning på læring og kompetanse
- Hvordan påvirker KI-avhengighet fremtidig kompetanse?
- Hvilke ferdigheter risikerer man å ikke utvikle?
- Balanse mellom effektivitet og læring

Risikoen er at utviklere blir flinke til å lage prompts for funksjoner de ikke forstår, og kun får overfladisk kunnskap. Dybdekunnskap, tålmodighet, konsentrasjon og evnen til refleksjon kan svekkes.

Balanse mellom effektivitet og læring: Bruk KI som supplement, ikke erstatning. Reflekter over løsninger, prøv oppgaver manuelt, reduser gradvis KI-støtte, fortsett tradisjonell læring, og fokuser på metakompetanse som kritisk vurdering og problemløsning.


### 5.4 Arbeidsmarkedet
- Hvordan kan utbredt KI-bruk påvirke fremtidige jobber i IT?
- Hvilke roller vil bli viktigere/mindre viktige?
- Deres refleksjoner om fremtidig karriere i en KI-drevet verden

Utbredt KI-bruk vil automatisere mange rutineoppgaver som standardkoding, testing og dokumentasjon. Dette kan redusere behovet for enkelte roller, samtidig som etterspørselen øker etter dem som kan utvikle, overvåke og forbedre KI-systemer. KI gjør også at IT-ansatte kan bruke mer tid på kreativ problemløsing og strategisk utvikling.

Viktigere roller inkluderer KI-utviklere, dataanalytikere, datavitere, etikk- og sikkerhetsspesialister samt systemarkitekter og rådgivere som kan integrere KI i større løsninger. Mindre viktige blir roller som hovedsakelig gjør repetitive oppgaver, som enkel programmering og grunnleggende testing.

For fremtidig karriere vil det være viktig å lære kontinuerlig, utvikle tverrfaglige ferdigheter, styrke kreativitet og problemløsning, og være fleksibel nok til å ta nye roller i et raskt skiftende KI-drevet landskap.


### 5.5 Datasikkerhet og personvern
- Hvilke data delte dere med KI-verktøy? 
- Potensielle risikoer ved å dele kode og data med KI 
- Hvordan skal man tenke på sikkerhet når man bruker KI? 


Teamet delte sensitiv prosjektinformasjon (bilder, krav, tekniske beslutninger, API-kontrakter) med KI-agenten for å generere artefakter. 

En risiko er at proprietære API-nøkler eller forretningslogikk kan eksponeres gjennom prompts eller treningsdata. Man har ikke kontroll over hvilke data eller metadata den sender tilbake til Gemini Cli sin server. KI kan være hacket, og KI kan laste ned programvare/ bibliotek med virus. KI kan i værste fall slette alt på PCen med vilje eller ved en feil. Vår kode kan brukes til å trene KI-modellen eller lekkes til andre brukere.

Man kan bruke KI kun i et virtuelt miljø/ VM eller container. Være påpasselig med passord-bytte/ API nøkler, hvilke prompts man skriver, hvilke bilder man laster opp. Ha god forståelse av hva som er business-hemmelig og hva som kan deles. Konfigurere KI til å ha visse begrensninger/ kun ha visse tilganger. Begrense AI sin tilgang til sikkerhetskritiske funksjoner/ kode i appen.

---

## 6. Teknologiske implikasjoner

### 6.1 Kodekvalitet og vedlikehold
- Hvordan påvirker KI-generert kode langsiktig vedlikehold?
- Er KI-kode like forståelig som menneskeskrevet kode?
- Utfordringer med å debugge KI-generert kode

Ved å tvinge frem en felles arkitektonisk standard (13 konsistensregler) før implementering, sikrer KI at den genererte koden er ensartet i stil, navnekonvensjoner og filstruktur, noe som i teorien forbedrer langsiktig vedlikehold.

Ja, men kun hvis KI-koden følger de menneskelig definerte mønstrene. Uten dette ville KI-kode kunne introdusere uforståelige mønstre. Prosjektet sikret forståelse ved å kreve validering og kodeanmeldelse av KI-genererte kodeblokker.

Debugging av KI-generert kode krever ofte mer systematisk testing, logging, og isolering av problemer enn kode skrevet manuelt, fordi koden kan se riktig ut, men skjule logiske feil. Den kan være mer kompleks eller bruke ikke-standardiserte løsninger. Modellen kan mangle kontekst om prosjektet eller eksisterende kodebase.


### 6.2 Standarder og beste praksis
- Følger KI alltid beste praksis og industristandarder?
- Eksempler på hvor KI foreslo utdaterte eller dårlige løsninger
- Viktigheten av å validere KI sine forslag


Nei, KI følger ikke automatisk beste praksis eller gjeldende industristandarder. KI genererer forslag basert på mønstre i data den har trent på, som kan inkludere utdaterte eller suboptimale løsninger. I dette prosjektet måtte KI mates med eksplisitte krav om WCAG 2.1 AA for tilgjengelighet og Next.js App Router for å sikre moderne standarder.

KI foreslo riktignok den gratis Open-Source Embedding-løsningen, men teamet måtte manuelt validere at denne faktisk holdt seg innenfor gratistier-begrensningene.

Alltid gjennomgå forslag kritisk før implementering. Valider mot offisielle dokumentasjoner, gjeldende standarder og interne retningslinjer. Test løsninger i trygge omgivelser for å sikre at de fungerer korrekt og sikkert. Dokumenter eventuelle avvik eller tilpasninger for fremtidig referanse.



### 6.3 Fremtidig utvikling
- Hvordan tror dere KI vil påvirke programvareutvikling fremover?
- Hvilke ferdigheter blir viktigere for utviklere?
- Deres anbefalinger for hvordan man bør bruke KI i utviklingsprosesser

KI vil akselerere planlegging, arkitektur og implementering, særlig gjennom KI-agenter som genererer kode. Utviklere får større fokus på evaluering, systemdesign og kvalitetssikring av KI-kode.

Systemdesign, arkitektur, problemløsning, kravdekomponering, domenekunnskap, prompt engineering, kommunikasjon og etisk bevissthet. Evnen til å skrive all kode selv blir mindre sentral; å vurdere, forbedre og teste KI-generert kode blir viktigere.

Start med små, lavrisiko-oppgaver, ha klare retningslinjer, bruk KI som læringsverktøy, alltid ha utvikler "i loopen", test og review kode grundig, dokumenter designbeslutninger, del erfaringer og unngå full KI-avhengighet. Målet er å frigjøre tid til problemløsning og strategiske beslutninger, ikke å erstatte utviklere.

---

## 7. Konklusjon og læring

### 7.1 Viktigste lærdommer
[Liste de 3-5 viktigste tingene dere lærte gjennom prosjektet]

1. Riktige prompts er viktige for at AI skal forstå og bidra effektivt til prosjektet. Med gode prompts kan AI gjøre mye for oss.

2. Feilsøking og problemløsning tok mye tid, men ga nyttig erfaring og krevde tålmodighet.

3. Teamarbeid og faste møter har vært viktige for støtte, hjelp og rask problemløsning i gruppen.

4. God planlegging er avgjørende for et smidig og effektivt prosjekt, og sparer tid og problemer senere.

5. Tidlig modulbasert utvikling og testing med Playwrite MCP-server ville vært nyttig.


### 7.2 Hva ville dere gjort annerledes?
[Reflekter over hva dere ville endret hvis dere skulle startet på nytt]
- [Tekniske valg] 
- [Bruk av KI] 
- [Samarbeid og organisering] 

Vi ville i hovedsak valgt samme teknologi, men vurdert et annet API enn Spoonacular på grunn av begrenset gratisnivå.

Vi ville tatt i bruk Claude Code tidligere, siden det fungerte bedre enn Gemini CLI for flere av oss. I tillegg burde vi startet med Playwright MCP-server tidligere for å få bedre automatisert testing og flyt.

Med en project-plan.md fra start kunne planleggingstiden vært kortere. Vi burde utviklet appen modulbasert, for eksempel med innlogging som første modul med klare test- og akseptansekriterier. Felles demoer underveis kunne sikret at hver del var ferdig før vi gikk videre, og gjort utviklingen mer strukturert og gradvis.


### 7.3 Anbefalinger
[Deres anbefalinger til andre studenter som skal bruke KI i utvikling]
- [Råd om effektiv bruk av KI] 
- [Fallgruver å unngå] 
- [Beste praksis dere oppdaget] 

Spør KI om effektiv bruk av KI, gjerne lage huskelister/ sjekklister/ guider. Ha notatark med ofte brukt prompts som kan modifiseres og gjenbrukes.

Start tidligere med utviklingen og test grundig. 

Bruk Playwright MCP-server for testing: Dette verktøyet var uvurderlig for automatisert testing av brukergrensesnittet. KI kan generere testscripts som kjører i nettleseren og verifiserer at alt fungerer som forventet. Kombiner flere KI-verktøy: Bruk GitHub Copilot for inline kodegenerering, Claude for arkitektur og problemløsning, og spesialiserte verktøy for testing. Forskjellige verktøy har ulike styrker. Det var verdt å bruke litt penger på Claude Code.
Dokumenter underveis: Be KI om å generere dokumentasjon samtidig som koden skrives. Dette sikrer at dokumentasjonen faktisk matcher implementasjonen. Lær av feilene: Når KI gir deg feil løsning, analyser hvorfor og juster prompten. Dette gjør deg gradvis bedre til å kommunisere med KI-verktøy.

### 7.4 Personlig refleksjon (individuelt)

**[Thomas Ekrem Jensen]:**
[Personlig refleksjon over egen læring og utvikling]

Da jeg startet dette prosjektet hadde jeg begrenset erfaring med programmering, og tanken på å bygge en fullverdig webapplikasjon på seks uker virket ambisiøs. Det som gjorde det mulig var KI-assistert utvikling – en tilnærming som fundamentalt endret hvordan jeg tenker på programmering.
Den viktigste lærdommen fra dette emnet er at programmering i fremtiden handler mindre om å memorere syntaks og mer om å kommunisere presist. Evnen til å formulere klare, strukturerte krav i naturlig språk ble viktigere enn å kunne skrive kode manuelt. Dette skiftet fra «kodeskriver» til «løsningsarkitekt» var overraskende, men også befriende. Det lot meg fokusere på hva jeg ville bygge i stedet for hvordan hver enkelt linje skulle skrives.
Samtidig lærte jeg at KI ikke er magi. Den krever kritisk evaluering, grundig testing, og en utvikler som tar ansvar for kvaliteten. Flere ganger genererte KI kode som så korrekt ut, men som feilet på spesialtilfeller eller brukte utdatert praksis. Dette lærte meg verdien av å aldri stole blindt på verktøy  uansett hvor avanserte de er.
Jeg tar med meg tre ting videre: For det første at presis kommunikasjon er en kjerneferdighet i moderne utvikling. For det andre at strukturerte metodikker som BMAD gir KI bedre kontekst og dermed bedre resultater. For det tredje at jeg som utvikler fortsatt er ansvarlig for alt som leveres  KI er et verktøy, ikke en erstatning for kritisk tenkning.
Dette emnet har gitt meg et nytt perspektiv på hva det betyr å være utvikler i en tid der KI blir stadig mer kapabel. 

**[Sigurd Hov]:**
[Personlig refleksjon over egen læring og utvikling]

Det er mye jeg har lært og mye jeg har vært igjennom. Jeg har lært at man ikke skal ikke stole blindt på AI fordi den er ikke perfekt, men med riktig bruk kan den bli et verdifull verktøy som kan hjelpe deg. Jeg har også opplevd hvor sta AI kan være noen ganger og det føles ut som om man går i sirkler med AI, og det er bare rett og slett en del av opplevelsen når man bruker AI.
Det har vært litt av en utfordring å komme meg gjennom dette men jeg har fått en del tilbake for det.
Etter hvert som jeg gikk igjennom fasene og måtte gjøre noen om igjen gikk det mye fortere fordi jeg viste hva jeg skulle si og hva jeg skulle gjøre. Dette var veldig deilig når man finner ut at man må forandre eller fikse på noe som ikke ble helt riktig.
Det er viktig med presis kommunikasjon når du bruker AI for den skal lettere forstå hva du vil, men det er viktig å lese koden til AI og filene den lager for å forsikre seg om kvaliteten på det den har laget. Det er også viktig å validere for å finne ut det er noe som mangler som jeg har oversett.
Jeg har lært om hvordan man skal bruke AI riktig og at man har en strukturert plan som Bmad er viktig, og hvor fort det utvikler seg som vi har opplevd under disse 6 ukene vi har hold på del med bruk av AI til utvikling av appen vår.
Jeg har lært at hvor viktig planlegging er for det vi lager skal bli bra, en solid grunnmur er viktig for at det skal bli et bra prosjekt. Det jeg også har lært er at vi går hånd i hånd med AI som utvikler assistent gjennom opplegget. AI trenger for presise prompt for vite hva den skal gjøre og vi sjekker og leser AI koden og kvalitets sjekker det som blir lagt og retter det opp hvis der trenges.

**[Kristine Davik]:**
Utfordrende prosess, mye å sette seg inn i og mye prøving og feiling.
Slettet egen branch flere ganger da det gang på gang ble feil.
Mye egen research for å få til alle programvarer, koder og for å få en dypere forståelse. Skulle gjerne hatt mer tid til å sette meg inn i alt.
Stor mestringsfølelse hver gang ting ga mening, falt på plass og gikk som planlagt.

**[Tina Rosland]:**
Jeg har syntes det har vært både spennende og lærerikt å programmere med Gemini CLI og å følge BMAD-metoden. Siden det tok lang tid før vi kom i gang med selve utviklingen av løsningen, tenker jeg at det hadde vært nyttig å bygge appen mer modulbasert, i stedet for å fullføre alle plandokumentene før utviklingen av MVP. På den måten ville vi hatt noe funksjonalitet klart tidlig, som vi kunne testet og diskutert sammen i gruppen.

Jeg tror også at det hadde vært lettere å samarbeide i Git dersom vi hadde hatt et tidlig skjelett på plass. I tillegg burde vi hatt tydelige test- og akseptansekriterier for hver modul. Til slutt måtte vi sy alt sammen, noe som hadde gått smidigere med en modulbasert tilnærming.

---

## 8. Vedlegg (valgfritt)

- Skjermbilder av applikasjonen
- Lenke til GitHub repository: https://github.com/IBE160/SG-Gruppe-Stavanger
- Annen relevant dokumentasjon

---

**Ordantall:** ca. 5140.

**Forventet lengde:** 3000-5000 ord (avhengig av gruppestørrelse og prosjektets kompleksitet)