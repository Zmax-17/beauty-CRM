# Beauty CRM

Educational demo CRM for a solo brow & lash master (Norway market).

Built as a portfolio project: clean scope, realistic domain, production-like stack.

## Stack

- **Next.js** (App Router) + TypeScript
- **NextAuth / Auth.js** — credentials provider, single admin role
- **Turso** + **Drizzle ORM**
- **shadcn/ui**
- **next-intl** — Norwegian Bokmål (`nb`) + English (`en`)
- **Zod**, **date-fns**
- **Tailwind CSS**

## Features (MVP)

- Admin authentication (login / logout)
- Clients: list, create, edit, detail with visit history
- Services: list, create, edit (duration + price in øre)
- Appointments: create, list/calendar, status changes
- Client ↔ service ↔ appointment relations
- UI in Bokmål and English
- Basic accessibility: semantics, keyboard, focus, contrast

## Out of scope

- Public online booking
- SMS / email notifications
- Payments (Vipps, etc.)
- Multi-staff / multi-salon
- Loyalty, inventory, complex analytics

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=
DATABASE_AUTH_TOKEN=
AUTH_SECRET=
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database

Apply migrations and seed the admin user:

```bash
npx drizzle-kit migrate
npm run db:seed
```

Demo admin (after seed):

- **Email:** `admin@beauty.local`
- **Password:** `admin123`

Change the password before any real use.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)  
Default locale is Norwegian (`nb`). English: `/en`.

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/          # login
│   │   └── (dashboard)/     # protected app shell
│   └── api/auth/            # NextAuth route handlers
├── components/
│   ├── ui/                  # shadcn
│   ├── layout/              # sidebar, bottom nav, shell
│   └── auth/
├── db/
│   ├── schema.ts
│   ├── index.ts
│   ├── seed.ts
│   └── migrations/
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   ├── navigation.ts
│   └── messages/            # en.json, nb.json
├── lib/
└── auth.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed admin user |
| `npx drizzle-kit generate` | Generate migrations from schema |
| `npx drizzle-kit migrate` | Apply migrations |

## Current status

**Done**

- Project setup and tooling
- i18n (nb / en)
- Database schema and Turso connection
- Auth (credentials, route protection, logout)
- App shell (desktop sidebar + mobile bottom nav)
- Theme (soft beauty palette) and typography

**In progress / next**

- Clients module
- Services module
- Appointments module

## License

Private / portfolio use.
