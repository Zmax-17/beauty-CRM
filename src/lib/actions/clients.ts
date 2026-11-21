"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { appointments, clients } from "@/db/schema";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  clientFormSchema,
  type ClientFormValues,
} from "@/lib/validations/client";
import { count, desc, eq, like, or } from "drizzle-orm";

import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function getClients(query?: string) {
  await requireUserId();

  const q = query?.trim();

  if (!q) {
    return db.query.clients.findMany({
      orderBy: [desc(clients.createdAt)],
    });
  }

  const pattern = `%${q}%`;

  return db.query.clients.findMany({
    where: or(
      like(clients.name, pattern),
      like(clients.phone, pattern),
    ),
    orderBy: [desc(clients.createdAt)],
  });
}

export async function getClientById(id: string) {
  await requireUserId();

  const client = await db.query.clients.findFirst({
    where: eq(clients.id, id),
  });

  return client ?? null;
}

export async function createClient(raw: ClientFormValues) {
  await requireUserId();

  const data = clientFormSchema.parse(raw);

  const [created] = await db
    .insert(clients)
    .values({
      name: data.name,
      phone: data.phone,
      notes: data.notes ?? null,
    })
    .returning();

  revalidatePath("/clients");
  revalidatePath("/en/clients");

  return created;
}

export async function updateClient(
  id: string,
  raw: ClientFormValues,
) {
  await requireUserId();

  const data = clientFormSchema.parse(raw);

  const [updated] = await db
    .update(clients)
    .set({
      name: data.name,
      phone: data.phone,
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(clients.id, id))
    .returning();

  revalidatePath("/clients");
  revalidatePath("/en/clients");
  revalidatePath(`/clients/${id}`);
  revalidatePath(`/en/clients/${id}`);

  return updated;
}

export async function deleteClient(id: string) {
  await requireUserId();

  const [result] = await db
    .select({ value: count() })
    .from(appointments)
    .where(eq(appointments.clientId, id));

  if (result.value > 0) {
    return {
      ok: false as const,
      error:
        "Cannot delete a client with existing appointments",
    };
  }

  await db.delete(clients).where(eq(clients.id, id));

  revalidatePath("/clients");
  revalidatePath("/en/clients");

  return { ok: true as const };
}

// *****************************ACTIONS*******************************

type ActionState = { error?: string } | null;

export async function createClientAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = clientFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const created = await createClient(parsed.data);
  // redirect(`/clients/${created.id}`); // or /clients
  // redirect(`/clients/${created.id}`); was not working as expected, use hidden input to pass locale
  const localeRaw = String(formData.get("locale") ?? "");
  const locale = routing.locales.includes(
    localeRaw as "en" | "nb",
  )
    ? localeRaw
    : routing.defaultLocale;

  return redirect({
    href: `/clients/${created.id}`,
    locale,
  });
}

export async function updateClientAction(
  id: string,
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = clientFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  await updateClient(id, parsed.data);

  // redirect(`/clients/${created.id}`); was not working as expected, use hidden input to pass locale
  const localeRaw = String(formData.get("locale") ?? "");
  const locale = routing.locales.includes(
    localeRaw as "en" | "nb",
  )
    ? localeRaw
    : routing.defaultLocale;

  return redirect({ href: `/clients/${id}`, locale });
}

export async function deleteClientAction(
  id: string,
  locale: string,
): Promise<{ error?: string }> {
  await requireUserId();

  const result = await deleteClient(id);

  if (!result.ok) {
    return { error: result.error };
  }

  const safeLocale = routing.locales.includes(
    locale as "en" | "nb",
  )
    ? locale
    : routing.defaultLocale;

  return redirect({ href: "/clients", locale: safeLocale });
}
