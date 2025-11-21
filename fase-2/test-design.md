# Test Design Document

**Project:** Smart Food & Recipe Platform
**Version:** 1.0
**Date:** November 2025
**Author:** Test Architect Agent

---

## 1. Overview

This document defines the comprehensive testing strategy for Smart Food & Recipe Platform, ensuring quality, reliability, and performance across all features.

---

## 2. Test Strategy

### 2.1 Testing Pyramid

```
        ┌─────────────┐
        │    E2E      │  (10%)
        │   Tests     │
        ├─────────────┤
        │ Integration │  (20%)
        │   Tests     │
        ├─────────────┤
        │   Unit      │  (70%)
        │   Tests     │
        └─────────────┘
```

### 2.2 Testing Objectives

1. **Functionality**: All features work as specified in PRD
2. **Reliability**: System handles edge cases gracefully
3. **Performance**: Response times meet NFR targets (<2s)
4. **Security**: No vulnerabilities in authentication or data handling
5. **Accessibility**: WCAG 2.1 AA compliance

---

## 3. Test Types

### 3.1 Unit Tests

**Framework:** Jest + React Testing Library

**Coverage Target:** 80%

**Focus Areas:**
- Utility functions (`src/lib/`)
- Custom hooks (`src/hooks/`)
- API route handlers (`src/app/api/`)
- Business logic in components

**Naming Convention:** `*.test.ts` or `*.test.tsx`

### 3.2 Integration Tests

**Framework:** Jest + Testing Library

**Coverage Target:** 70% of critical paths

**Focus Areas:**
- API route → Database interactions
- Component → Hook → API flows
- Authentication flows
- Form submissions

### 3.3 End-to-End Tests

**Framework:** Playwright

**Focus Areas:**
- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness

---

## 4. Test Scenarios by Feature

### 4.1 User Authentication (Epic 2)

#### Unit Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| AUTH-U-001 | Hash password correctly | "password123" | Bcrypt hash |
| AUTH-U-002 | Validate email format | "invalid" | ValidationError |
| AUTH-U-003 | Validate password strength | "weak" | ValidationError |

#### Integration Tests

| Test ID | Description | Steps | Expected |
|---------|-------------|-------|----------|
| AUTH-I-001 | Register new user | POST /api/auth/register | 201, user created |
| AUTH-I-002 | Reject duplicate email | POST with existing | 409 Conflict |
| AUTH-I-003 | Login with valid creds | POST /api/auth/signin | 200, session token |
| AUTH-I-004 | Reject invalid creds | POST with wrong pass | 401 Unauthorized |

#### E2E Tests

| Test ID | Description | Steps |
|---------|-------------|-------|
| AUTH-E-001 | Complete registration flow | Visit → Fill form → Submit → Redirected to pantry |
| AUTH-E-002 | Login and logout | Login → Navigate → Logout → Redirected to home |

### 4.2 Pantry Management (Epic 3)

#### Unit Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| PANT-U-001 | Calculate days until expiry | Date | Number |
| PANT-U-002 | Categorize item | "milk" | "Dairy" |
| PANT-U-003 | Parse barcode data | Barcode | Item object |

#### Integration Tests

| Test ID | Description | Steps | Expected |
|---------|-------------|-------|----------|
| PANT-I-001 | Create pantry item | POST /api/pantry | 201, item created |
| PANT-I-002 | List user items only | GET /api/pantry | Only user's items |
| PANT-I-003 | Update item quantity | PATCH /api/pantry/:id | 200, updated |
| PANT-I-004 | Delete item | DELETE /api/pantry/:id | 204 No Content |
| PANT-I-005 | Filter by category | GET ?category=Dairy | Filtered results |

#### E2E Tests

| Test ID | Description | Steps |
|---------|-------------|-------|
| PANT-E-001 | Add item manually | Click + → Fill form → Save → Item appears |
| PANT-E-002 | Add item via barcode | Click scan → Scan code → Auto-fill → Save |
| PANT-E-003 | Edit existing item | Click item → Edit → Change qty → Save |
| PANT-E-004 | Delete with undo | Swipe delete → Undo within 5s → Item restored |

### 4.3 Recipe Discovery (Epic 5)

#### Unit Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| RECP-U-001 | Calculate match percentage | Pantry, Recipe | 0-100% |
| RECP-U-002 | Filter by dietary restriction | "vegetarian" | Filtered recipes |
| RECP-U-003 | Parse Spoonacular response | API response | Recipe object |

#### Integration Tests

| Test ID | Description | Steps | Expected |
|---------|-------------|-------|----------|
| RECP-I-001 | Search recipes by query | GET /api/recipes?q=pasta | Recipe list |
| RECP-I-002 | Get recipes by ingredients | GET /api/recipes/by-ingredients | Matched recipes |
| RECP-I-003 | Cache API responses | Repeat request | Cached result |
| RECP-I-004 | Handle API rate limit | Exceed quota | Graceful fallback |

#### E2E Tests

| Test ID | Description | Steps |
|---------|-------------|-------|
| RECP-E-001 | Search and view recipe | Search → Click result → View details |
| RECP-E-002 | Find by pantry items | Go to "By Ingredients" → View matches |
| RECP-E-003 | Favorite a recipe | View recipe → Click heart → Appears in favorites |

### 4.4 Grocery List (Epic 7)

#### Unit Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| GROC-U-001 | Diff recipe vs pantry | Recipe, Pantry | Missing items |
| GROC-U-002 | Group by store section | Items | Grouped items |
| GROC-U-003 | Merge duplicate items | [milk, milk] | [milk x2] |

#### Integration Tests

| Test ID | Description | Steps | Expected |
|---------|-------------|-------|----------|
| GROC-I-001 | Generate from recipe | POST /api/grocery/generate | Grocery list |
| GROC-I-002 | Mark item purchased | PATCH /api/grocery/:id | Updated status |
| GROC-I-003 | Clear completed | DELETE /api/grocery/completed | Removed items |

#### E2E Tests

| Test ID | Description | Steps |
|---------|-------------|-------|
| GROC-E-001 | Generate and use list | View recipe → Generate list → Check items |
| GROC-E-002 | Add custom item | Click add → Enter item → Appears in list |

### 4.5 Expiration Alerts (Epic 8)

#### Unit Tests

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| ALRT-U-001 | Calculate alert dates | Expiry date | Alert schedule |
| ALRT-U-002 | Format notification | Item | Message string |

#### Integration Tests

| Test ID | Description | Steps | Expected |
|---------|-------------|-------|----------|
| ALRT-I-001 | Create notification | Trigger cron | Notification created |
| ALRT-I-002 | Mark as read | PATCH /api/notifications/:id | Updated |
| ALRT-I-003 | Dismiss notification | DELETE /api/notifications/:id | Removed |
| ALRT-I-004 | Send email alert | Trigger cron | Email sent |

---

## 5. Test Data Management

### 5.1 Test Database

- **Local Development:** SQLite in-memory
- **CI Environment:** PostgreSQL container
- **Seeding:** `prisma/seed.ts` with test fixtures

### 5.2 Test Fixtures

```typescript
// fixtures/users.ts
export const testUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: 'hashed-password'
};

// fixtures/pantryItems.ts
export const testItems = [
  {
    id: 'item-1',
    name: 'Milk',
    category: 'Dairy',
    bestBeforeDate: addDays(new Date(), 3),
    quantity: 1,
    unit: 'liter'
  },
  // ...
];
```

### 5.3 API Mocking

- **Spoonacular API:** MSW (Mock Service Worker)
- **Email Service:** Mock SMTP
- **Barcode API:** Mock responses

---

## 6. Performance Testing

### 6.1 Targets (from NFRs)

| Metric | Target | Critical |
|--------|--------|----------|
| Page Load | <2s | <3s |
| API Response | <500ms | <1s |
| Time to Interactive | <3s | <5s |
| Lighthouse Score | >90 | >80 |

### 6.2 Tools

- **Lighthouse CI:** Automated performance audits
- **Web Vitals:** LCP, FID, CLS monitoring
- **K6:** Load testing for API endpoints

### 6.3 Load Test Scenarios

| Scenario | Users | Duration | Target RPS |
|----------|-------|----------|------------|
| Normal load | 100 | 5 min | 50 |
| Peak load | 500 | 2 min | 200 |
| Stress test | 1000 | 1 min | 500 |

---

## 7. Security Testing

### 7.1 OWASP Top 10 Coverage

| Vulnerability | Test Approach |
|---------------|---------------|
| Injection | Input validation tests, parameterized queries |
| Broken Auth | Session management tests, brute force protection |
| Sensitive Data | HTTPS enforcement, secure cookies |
| XXE | XML parsing disabled |
| Broken Access Control | Authorization tests per endpoint |
| Security Misconfig | Helmet.js, CSP headers |
| XSS | Output encoding tests, CSP |
| Insecure Deserialization | JSON schema validation |
| Vulnerable Components | npm audit in CI |
| Logging | No sensitive data in logs |

### 7.2 Security Test Cases

| Test ID | Description | Method |
|---------|-------------|--------|
| SEC-001 | SQL injection in search | Inject SQL in query params |
| SEC-002 | XSS in item names | Inject script tags |
| SEC-003 | CSRF protection | Missing token rejection |
| SEC-004 | Auth token expiry | Use expired token |
| SEC-005 | Horizontal privilege | Access other user's items |

---

## 8. Accessibility Testing

### 8.1 Automated Testing

- **Axe-core:** Integrated in Jest tests
- **Pa11y:** CI pipeline checks
- **Lighthouse:** Accessibility audit

### 8.2 Manual Testing

- Screen reader testing (VoiceOver, NVDA)
- Keyboard-only navigation
- High contrast mode
- Zoom to 200%

### 8.3 Test Cases

| Test ID | Description | Criteria |
|---------|-------------|----------|
| A11Y-001 | Color contrast | 4.5:1 ratio |
| A11Y-002 | Touch targets | 44x44px minimum |
| A11Y-003 | Form labels | All inputs labeled |
| A11Y-004 | Focus management | Logical tab order |
| A11Y-005 | Alt text | All images described |

---

## 9. CI/CD Integration

### 9.1 Pipeline Stages

```yaml
test:
  - lint
  - unit-tests
  - integration-tests
  - build
  - e2e-tests (on merge to main)
  - performance-audit
  - security-scan
```

### 9.2 Quality Gates

| Gate | Criteria |
|------|----------|
| Lint | 0 errors |
| Unit Tests | 80% coverage, all pass |
| Integration | All critical paths pass |
| E2E | All smoke tests pass |
| Performance | Lighthouse >90 |
| Security | No high/critical vulnerabilities |

---

## 10. Test Execution Schedule

| Test Type | Frequency | Trigger |
|-----------|-----------|---------|
| Unit | Every commit | Pre-push hook |
| Integration | Every PR | GitHub Actions |
| E2E | Daily, on release | Scheduled, manual |
| Performance | Weekly, on release | Scheduled |
| Security | Weekly | Scheduled |
| Accessibility | Per sprint | Manual |

---

## 11. Defect Management

### 11.1 Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | System down, data loss | Immediate |
| High | Major feature broken | 24 hours |
| Medium | Feature degraded | 3 days |
| Low | Minor issue, workaround exists | Next sprint |

### 11.2 Bug Report Template

```markdown
## Bug Report

**Summary:** [One-line description]
**Severity:** [Critical/High/Medium/Low]
**Environment:** [Browser, OS, device]

**Steps to Reproduce:**
1. ...
2. ...

**Expected:** [What should happen]
**Actual:** [What happened]

**Screenshots:** [If applicable]
**Logs:** [Console errors, etc.]
```

---

## 12. Test Deliverables

1. **Test Plan:** This document
2. **Test Cases:** In `__tests__/` directories
3. **Test Reports:** Jest coverage, Playwright reports
4. **Bug Reports:** GitHub Issues
5. **Performance Reports:** Lighthouse CI dashboard

---

*This test design ensures comprehensive quality assurance for Smart Food & Recipe Platform across all development phases.*
