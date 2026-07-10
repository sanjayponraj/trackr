# Notes — "how does it work & why" journal

Append 3–5 sentences after each work session. This becomes your interview cheat
sheet. Answer: what did I build, how does it work, why did I choose it?

## Concepts locked in

### Dependency Injection (NestJS)
A class declares what it needs in its constructor; Nest's IoC container supplies it,
instead of the class doing `new Dependency()`. Wiring: `@Injectable()` marks a class
injectable, the constructor param's type says what's wanted, and `providers` in the
module registers what's available. Benefits: testability (inject mocks), singletons,
loose coupling.

---

## Session log

<!-- Day 1: ... -->
