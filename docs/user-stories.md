# Onboarding User Stories

This document translates the enhanced onboarding requirements from the brainstorming session into actionable user stories for the development team.

---

### Epic: Enhanced User Onboarding

**Goal:** To create a more resilient, user-friendly, and flexible registration and first-time setup process.

---

### User Stories:

**1. Resend Verification Email**

-   **As a** new user who hasn't received my verification email,
-   **I want** a "Resend Link" button on the "Check your email" page,
-   **So that** I can get a new verification link without having to start the registration process over.

    **Acceptance Criteria:**
    - A "Resend Link" button is visible on the page shown after registration.
    - Clicking the button triggers a new verification email to be sent to the user's registered email address.
    - The system handles multiple requests gracefully (e.g., with a cooldown period to prevent spam).

**2. Handle Existing Email Address**

-   **As a** user trying to register with an email that already exists,
-   **I want** to be notified that the email is taken and be offered links to log in or reset my password,
-   **So that** I can easily access my existing account instead of getting stuck at a dead end.

    **Acceptance Criteria:**
    - When a user tries to register with an existing email, a clear error message is displayed.
    - The message includes a link to the "Login" page.
    - The message also includes a link to the "Forgotten Password" page.

**3. Recover from Expired Verification Link**

-   **As a** new user who clicks on an expired verification link,
-   **I want** to be taken to a page that informs me the link has expired and allows me to request a new one,
-   **So that** I can still verify my account without confusion.

    **Acceptance Criteria:**
    - An expired verification link redirects to a specific recovery page.
    - The page clearly explains that the link has expired.
    - An input field on the page is pre-filled with the user's email address.
    - A button on the page allows the user to request a new verification email.

**4. Skip Initial Profile Setup**

-   **As a** new user who is eager to explore the application,
-   **I want** a "Skip for Now" button during the initial profile setup,
-   **So that** I can immediately access the main features and complete my profile later.

    **Acceptance Criteria:**
    - A "Skip for Now" button is clearly visible alongside the "Get Started" button on the initial setup screen.
    - Clicking "Skip for Now" bypasses the profile customization steps.
    - The user is taken directly to the main dashboard or landing page.

**5. Reminder to Complete Profile**

-   **As a** user who has skipped the initial profile setup,
-   **I want** to see a non-intrusive reminder to complete my profile,
-   **So that** I can easily go back and personalize my experience when I have more time.

    **Acceptance Criteria:**
    - If the user has skipped the setup, a dismissible banner is displayed in a prominent location (e.g., at the top of the dashboard).
    - The banner contains a message encouraging the user to complete their profile.
    - The banner includes a link that takes the user back to the profile setup flow.
    - Once dismissed, the banner should not reappear for a set period to avoid being annoying.
