# 0004 Student sign-in (decided, reversible)
Most students have no phone of their own. A linked guardian signs in with their phone and taps "Study as <child>"; the server verifies the guardian-child link on every request (cookie `as`). Students with their own phone can sign in directly later. Leaving child mode needs a parent PIN in Kids Mode (Phase 2).
Why: keeps one OTP identity per adult, avoids passwords for children, works on a shared family phone.
