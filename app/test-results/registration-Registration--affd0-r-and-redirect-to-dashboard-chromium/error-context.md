# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: Register
      - generic [ref=e6]: Enter your email below to create your account
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "Email" [ref=e11]:
            - /placeholder: m@example.com
            - text: e2e_test_1764496470558@example.com
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "Password" [ref=e14]: E2ePass1!
          - paragraph [ref=e15]: Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).
        - button "Creating account..." [disabled]
      - paragraph [ref=e16]:
        - text: Already have an account?
        - link "Login" [ref=e17] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - alert [ref=e27]
```