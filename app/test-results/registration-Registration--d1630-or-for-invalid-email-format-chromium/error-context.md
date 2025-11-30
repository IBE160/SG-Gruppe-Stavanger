# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: Register
      - generic [ref=e6]: Enter your email below to create your account
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "Email" [active] [ref=e11]:
            - /placeholder: m@example.com
            - text: invalid-email
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "Password" [ref=e14]: ValidPass1!
          - paragraph [ref=e15]: Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).
        - button "Register" [ref=e16]
      - paragraph [ref=e17]:
        - text: Already have an account?
        - link "Login" [ref=e18] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```