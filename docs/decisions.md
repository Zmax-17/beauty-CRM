# Design decisions — Beauty CRM

Important product and technical choices for this educational demo.

**Project:** CRM for a solo brow & lash master (Norway)  
**Status:** MVP

---

## 1. Product scope

- **Single master, one admin role** — matches a freelancer; no RBAC or multi-tenant setup.
- **Admin-only app** — clients have no login or public booking.
- **No payments, SMS/email, or Vipps** — focus on clients, services, and appointments.
- **Norwegian first** — default locale `nb` (Bokmål); `en` secondary.

---

## 2. Data model

- **UUID primary keys** — generated in app code; suitable for Turso.
- **Prices in øre (integers)** — no floating-point money; UI shows NOK.
- **Price snapshot on appointments** — history keeps the price at booking (or last service change on that row).
- **`userId` on appointments** — set to current admin now; ready for more masters later.
- **`ON DELETE RESTRICT`** for client and service — cannot remove rows still used in history.
- **No soft delete** — fewer states in a small MVP.
- **CHECK constraints** — duration > 0, prices ≥ 0, endTime > startTime.
- **UTC in DB, Europe/Oslo in UI** — one storage convention, local display for Norway.

---

## 3. Authentication

- **Auth.js (NextAuth v5) + Credentials** — email/password for a single admin.
- **Own `users` table** in Drizzle — explicit and easy to follow; no adapter tables in MVP.
- **bcrypt password hashes** — plaintext never stored.
- **JWT sessions** — no session table required for this size.
- **Protection** — middleware + `auth()`; anonymous users go to login.
- **No public registration** — admin is created with a seed script.

---

## 4. UI / UX

- **Desktop:** sidebar (collapse can be added when needed).
- **Mobile / tablet:** bottom navigation until the `lg` breakpoint.
- **Soft beauty palette** (olive / beige / powder) — domain-fit, not a generic gray admin theme.
- **shadcn/ui + Base UI (Nova)** — accessible primitives, owned markup.
- **Calendar via a library** — no custom calendar engine in the MVP.
- **Basic a11y** — semantics, keyboard, visible focus, reasonable contrast (not a full WCAG AA audit).

---

## 5. Internationalization

- **next-intl** with `[locale]` segment.
- **Locales:** `nb`, `en`; default `nb`.
- **`localeDetection: false`** — browser language must not override the product default.
- Dates and currency formatted for the active locale.

---

## 6. Stack

- **Next.js App Router + TypeScript**
- **Turso + Drizzle ORM** — typed schema, SQLite-compatible, same code path local and remote
- **Zod** — shared validation for forms and server actions
- **date-fns** — date helpers without a heavy library

---

## 7. Business rules (short)

- Default appointment duration comes from the service; end time is editable.
- Changing a catalog service price does not rewrite old appointments.
- Changing the service on an appointment refreshes that row's price snapshot.
- Prefer status changes (`cancelled`, `no_show`) over deleting real visits; delete remains available for mistakes/test data.
- Overlapping appointments are **not** blocked automatically in the MVP.

---

## 8. Intentionally out of scope

Multiple masters and permissions, multi-tenancy, public booking, customer accounts, payments, notifications, recurring appointments, buffer time, soft delete, automatic conflict detection, advanced analytics.

May be revisited after the core CRM flows are solid.
