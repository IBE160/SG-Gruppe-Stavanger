# Test Strategy

**Dato:** 2025-11-20
**Prosjekt:** Smart Food & Recipe Platform
**Kommando:** `/tea *test-design`

## Teststrategi

### Testnivåer
1. **Unit Tests** - Jest
2. **Integration Tests** - Jest + Testing Library
3. **E2E Tests** - Playwright

### Dekningsmal
- Unit: 80%
- Integration: 70%
- E2E: Kritiske brukerflyter

### Testområder
| Område | Type | Prioritet |
|--------|------|-----------|
| Recipe Search | E2E | Høy |
| Auth Flow | Integration | Høy |
| API Routes | Unit | Medium |
| Components | Unit | Medium |

### Verktøy
- Jest
- React Testing Library
- Playwright
- MSW (Mock Service Worker)
