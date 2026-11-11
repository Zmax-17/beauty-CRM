# User Stories — Beauty CRM

Educational demo CRM for a solo brow & lash master (Norway).

**Stack:** Next.js (App Router), TypeScript, NextAuth, Turso + Drizzle, shadcn/ui, Zod, date-fns, next-intl

---

## 1. Authentication

- As an **admin**, I can sign in with email and password to work with clients, services, and appointments.
- After sign-in I access the protected part of the app.
- I can sign out.

One role only: admin.

---

## 2. Clients

- As an **admin**, I can create a client (name, phone, notes).
- As an **admin**, I can view the list of all clients.
- As an **admin**, I can search clients by name or phone.
- As an **admin**, I can open a client detail page.
- On the client detail page I see:
  - Basic data
  - Full visit history (date, service, status, note)
- As an **admin**, I can edit client data (including notes about preferences, allergies, etc.).

---

## 3. Services

- As an **admin**, I can create a service:
  - Name
  - Duration (minutes)
  - Price (øre)
- As an **admin**, I can view all services.
- As an **admin**, I can edit a service.
- As an **admin**, I can delete a service only if it has no related appointments.

**Example services for the demo:**

- Brow correction + tint
- Brow lamination
- Lash lift
- Classic lash extensions
- Lash fill

---

## 4. Appointments

- As an **admin**, I can create an appointment:
  - Select a client
  - Select a service
  - Set start date and time
  - Duration comes from the service (end time can be adjusted)
- As an **admin**, I can view appointments:
  - As a list
  - In a calendar view
- As an **admin**, I can change appointment status:
  - Planned
  - Completed
  - Cancelled
  - No-show
- After a visit I can add a short note (what was done, details, recommendations).

---

## 5. Relations and history

- Each appointment is linked to one client, one service, and one user (master).
- The client detail page shows full visit history.
- History includes: date, service, status, and master note.

---

## 6. UI and localization

- The UI is available in **Norwegian Bokmål** and **English**.
- Locale switching works via next-intl.
- Basic accessibility: semantic markup, visible focus, keyboard use, sufficient contrast.
