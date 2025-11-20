# User Story Ticket

**Story ID:** 001
**Epic:** Recipe Discovery
**Kommando:** `/sm *create-story`

## Story
Som en bruker vil jeg søke etter oppskrifter slik at jeg kan finne måltider basert på mine preferanser.

## Acceptance Criteria
- [ ] API endpoint GET /api/recipes/search
- [ ] Query parameter for søketekst
- [ ] Filter på kategori, tid, ingredienser
- [ ] Paginering med limit/offset
- [ ] Returnerer oppskrift-liste med metadata

## Tekniske notater
- Bruk Prisma full-text search
- Implementer caching
- Valider input

## Story Points
5

## Status
TODO
