"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { services, appointments } from "@/db/schema";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  serviceFormSchema,
  type ServiceFormValues,
} from "@/lib/validations/service";
import { count, desc, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function getServices(query?: string) {
  await requireUserId();

  const q = query?.trim();

  if (!q) {
    return db.query.services.findMany({
      orderBy: [desc(services.createdAt)],
    });
  }

  return db.query.services.findMany({
    where: like(services.name, `%${q}%`),
    orderBy: [desc(services.createdAt)],
  });
}

export async function getServiceById(id: string) {
  await requireUserId();

  const service = await db.query.services.findFirst({
    where: eq(services.id, id),
  });

  return service ?? null;
}

export async function createService(
  data: ServiceFormValues,
) {
  await requireUserId();

  const [created] = await db
    .insert(services)
    .values({
      name: data.name,
      duration: data.duration,
      price: data.price,
    })
    .returning();

  revalidatePath("/services");
  revalidatePath("/en/services");

  return created;
}

export async function updateService(
  id: string,
  data: ServiceFormValues,
) {
  await requireUserId();

  const [updated] = await db
    .update(services)
    .set({
      name: data.name,
      duration: data.duration,
      price: data.price,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning();

  revalidatePath("/services");
  revalidatePath("/en/services");
  revalidatePath(`/services/${id}/edit`);
  revalidatePath(`/en/services/${id}/edit`);

  return updated;
}

export async function deleteService(id: string) {
  await requireUserId();

  // If services are used in appointments,
  // deletion is prohibited.
  const [result] = await db
    .select({ value: count() })
    .from(appointments)
    .where(eq(appointments.serviceId, id));

  if (result.value > 0) {
    return {
      ok: false as const,
      error:
        "Cannot delete a service with existing appointments",
    };
  }

  await db.delete(services).where(eq(services.id, id));

  revalidatePath("/services");
  revalidatePath("/en/services");

  return { ok: true as const };
}

// ***************************** ACTIONS *******************************

type ActionState = { error?: string } | null;

function getSafeLocale(formData: FormData) {
  const localeRaw = String(formData.get("locale") ?? "");

  return routing.locales.includes(
    localeRaw as (typeof routing.locales)[number],
  )
    ? localeRaw
    : routing.defaultLocale;
}

export async function createServiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();

  const raw = {
    name: String(formData.get("name") ?? ""),
    duration: formData.get("duration"),
    price: formData.get("price"),
  };

  const parsed = serviceFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  await createService(parsed.data);

  const locale = getSafeLocale(formData);

  return redirect({
    href: "/services",
    locale,
  });
}

export async function updateServiceAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserId();

  const raw = {
    name: String(formData.get("name") ?? ""),
    duration: formData.get("duration"),
    price: formData.get("price"),
  };

  const parsed = serviceFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  await updateService(id, parsed.data);

  const locale = getSafeLocale(formData);

  return redirect({
    href: "/services",
    locale,
  });
}

export async function deleteServiceAction(
  id: string,
  locale: string,
): Promise<{ error?: string }> {
  await requireUserId();

  const result = await deleteService(id);

  if (!result.ok) {
    return { error: result.error };
  }

  const safeLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number],
  )
    ? locale
    : routing.defaultLocale;

  return redirect({
    href: "/services",
    locale: safeLocale,
  });
}
