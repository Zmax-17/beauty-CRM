import {
  sqliteTable,
  text,
  integer,
  check,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// ---------- Users (admin / master) ----------
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------- Clients ----------
export const clients = sqliteTable("clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------- Services ----------
export const services = sqliteTable(
  "services",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    duration: integer("duration").notNull(), // minutes
    price: integer("price").notNull(), // øre
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    check(
      "services_duration_positive",
      sql`${table.duration} > 0`,
    ),
    check(
      "services_price_non_negative",
      sql`${table.price} >= 0`,
    ),
  ],
);

// ---------- Appointments ----------
export const appointments = sqliteTable(
  "appointments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "restrict",
      }),

    serviceId: text("service_id")
      .notNull()
      .references(() => services.id, {
        onDelete: "restrict",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    startTime: integer("start_time", {
      mode: "timestamp",
    }).notNull(),
    endTime: integer("end_time", {
      mode: "timestamp",
    }).notNull(),

    status: text("status", {
      enum: [
        "planned",
        "completed",
        "cancelled",
        "no_show",
      ],
    })
      .notNull()
      .default("planned"),

    price: integer("price").notNull(), // snapshot in øre
    notes: text("notes"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    check(
      "appointments_price_non_negative",
      sql`${table.price} >= 0`,
    ),
    check(
      "appointments_valid_time",
      sql`${table.endTime} > ${table.startTime}`,
    ),
  ],
);

// ---------- Relations (optional, but useful for queries) ----------
export const usersRelations = relations(
  users,
  ({ many }) => ({
    appointments: many(appointments),
  }),
);

export const clientsRelations = relations(
  clients,
  ({ many }) => ({
    appointments: many(appointments),
  }),
);

export const servicesRelations = relations(
  services,
  ({ many }) => ({
    appointments: many(appointments),
  }),
);

export const appointmentsRelations = relations(
  appointments,
  ({ one }) => ({
    client: one(clients, {
      fields: [appointments.clientId],
      references: [clients.id],
    }),
    service: one(services, {
      fields: [appointments.serviceId],
      references: [services.id],
    }),
    user: one(users, {
      fields: [appointments.userId],
      references: [users.id],
    }),
  }),
);
