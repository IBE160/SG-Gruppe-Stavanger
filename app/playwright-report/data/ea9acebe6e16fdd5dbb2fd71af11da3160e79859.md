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
          - textbox "Email" [ref=e11]:
            - /placeholder: m@example.com
            - text: valid@example.com
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "Password" [ref=e14]: weak
          - paragraph [ref=e15]: Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).
          - paragraph [ref=e16]: Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&).
        - button "Register" [active] [ref=e17]
      - paragraph [ref=e18]:
        - text: Already have an account?
        - link "Login" [ref=e19] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - alert [ref=e29]
```