# Database Schema — Beauty CRM

**Project:** Educational / demo CRM for a solo brow & lash master (Norway)  
**Stack:** Turso (SQLite) + Drizzle ORM  
**Status:** Version 1 (MVP)

---

## 1. Overview

The application manages four entities:

- **Users** — admin / master accounts
- **Clients** — customers
- **Services** — services offered by the master
- **Appointments** — bookings and visit history

Design goals: simple relations, data integrity, preserved history, integer money in øre.

---

## 2. Entities

### 2.1 User

Admin account used by NextAuth (Credentials). Own table in Drizzle — no Auth adapter tables in the MVP.

| Field        | Type          | Required | Description                        |
|--------------|---------------|----------|------------------------------------|
| id           | String (UUID) | yes      | Primary key                        |
| name         | String        | yes      | Display name                       |
| email        | String        | yes      | Unique login email                 |
| passwordHash | String        | yes      | bcrypt hash (never plaintext)      |
| createdAt    | DateTime      | yes      |                                    |
| updatedAt    | DateTime      | yes      |                                    |

Notes:

- One role only: admin
- No public registration; initial user is created via seed
- JWT sessions; no session table in the database

### 2.2 Client

| Field     | Type          | Required | Description                       |
|-----------|---------------|----------|-----------------------------------|
| id        | String (UUID) | yes      | Primary key                       |
| name      | String        | yes      | Client name                       |
| phone     | String        | yes      | Phone (string to keep formatting) |
| notes     | String?       | no       | Preferences, allergies, free text |
| createdAt | DateTime      | yes      |                                   |
| updatedAt | DateTime      | yes      |                                   |

### 2.3 Service

| Field     | Type          | Required | Description               |
|-----------|---------------|----------|---------------------------|
| id        | String (UUID) | yes      | Primary key               |
| name      | String        | yes      | Service name              |
| duration  | Integer       | yes      | Duration in minutes (> 0) |
| price     | Integer       | yes      | Price in øre (≥ 0)        |
| createdAt | DateTime      | yes      |                           |
| updatedAt | DateTime      | yes      |                           |

Not in MVP: description, buffer time, active/inactive flag.  
Unused services are deleted only when no appointments reference them.

### 2.4 Appointment

| Field     | Type          | Required | Description |
|-----------|---------------|----------|-------------|
| id        | String (UUID) | yes      | Primary key |
| clientId  | String (UUID) | yes      | FK → Client.id |
| serviceId | String (UUID) | yes      | FK → Service.id |
| userId    | String (UUID) | yes      | FK → User.id (master) |
| startTime | DateTime      | yes      | Start |
| endTime   | DateTime      | yes      | End (must be after start) |
| status    | Enum          | yes      | `planned` \| `completed` \| `cancelled` \| `no_show` (default: `planned`) |
| price     | Integer       | yes      | Price snapshot in øre (≥ 0) |
| notes     | String?       | no       | Master note after the visit |
| createdAt | DateTime      | yes      | |
| updatedAt | DateTime      | yes      | |

---

## 3. Relationships

```
User     1 ──────────── * Appointment
Client   1 ──────────── * Appointment
Service  1 ──────────── * Appointment
```

Each appointment belongs to exactly one user, one client, and one service.

---

## 4. Deletion rules

| Entity      | Rule |
|-------------|------|
| Client      | Cannot delete if any appointments exist (`ON DELETE RESTRICT`) |
| Service     | Cannot delete if any appointments exist (`ON DELETE RESTRICT`) |
| User        | Not deleted in MVP; restrict while appointments exist |
| Appointment | May be deleted by admin (e.g. test data); real workflow prefers status changes |

No soft delete (`deletedAt`) in Version 1.

---

## 5. Business rules

### 5.1 Price snapshot

- On create: copy current service price into `appointment.price`
- On change of service: update snapshot to the new service price
- On other edits: keep existing snapshot
- Changing `services.price` never rewrites past appointments
- Optional later: manual price override on an appointment

### 5.2 Start and end time

- On create: `endTime = startTime + service.duration`
- Master may adjust `endTime` (e.g. procedure ran longer)
- Always `endTime > startTime`
- No buffer time between appointments in MVP

### 5.3 Status

| Status    | Meaning                 |
|-----------|-------------------------|
| planned   | Scheduled               |
| completed | Done                    |
| cancelled | Cancelled               |
| no_show   | Client did not attend   |

Completed / cancelled / no-show rows stay in history.

### 5.4 Currency

All money is stored as **integers in øre** (1 NOK = 100 øre).

| NOK   | Stored  |
|-------|---------|
| 100   | 10 000  |
| 250   | 25 000  |
| 1 500 | 150 000 |

UI formats as NOK for the active locale.

### 5.5 userId

Always set to the authenticated admin in the MVP. Column is ready for multiple masters later.

### 5.6 Timezone

- Store timestamps in **UTC**
- Display in **Europe/Oslo**
- Convert local input → UTC on write; UTC → Oslo on read

---

## 6. Integrity constraints

- FKs: appointment → client, service, user
- Unique: `users.email`
- CHECK: `services.duration > 0`
- CHECK: `services.price >= 0`, `appointments.price >= 0`
- CHECK: `appointments.end_time > appointments.start_time`
- Status limited to the four allowed values

Application-level validation (Zod) mirrors these rules.

---

## 7. Recommended indexes

| Index                     | Purpose                  |
|---------------------------|--------------------------|
| `clients.name`            | Search                   |
| `clients.phone`           | Search                   |
| `appointments.client_id`  | Client history           |
| `appointments.service_id` | Service references       |
| `appointments.user_id`    | Master's appointments    |
| `appointments.start_time` | Calendar / day queries   |

Add composite indexes later if query patterns need them.

---

## 8. Out of scope (schema)

- Multi-master permissions / multi-tenant
- Soft delete, buffer time, recurring appointments
- Payments, customer accounts
- Automatic conflict detection
- Aggregates stored on client (`totalSpent`, etc.) — derive from appointments if needed

---

## 9. Summary

Four tables, strict FKs, integer money, historical price and visit data. Version 1 of the schema.
