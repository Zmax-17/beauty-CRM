import { Link } from "@/i18n/navigation";
import {
  ChevronRight,
  Clock,
  Banknote,
} from "lucide-react";

import type { services } from "@/db/schema";
import { getTranslations } from "next-intl/server";

type Service = typeof services.$inferSelect;

export async function ServiceCard({
  service,
}: {
  service: Service;
}) {
  const t = await getTranslations("services");

  const formattedPrice = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(service.price / 100);

  const formattedDuration =
    service.duration >= 60
      ? `${Math.floor(service.duration / 60)} ${t("hours")}${
          service.duration % 60 > 0
            ? ` ${service.duration % 60} ${t("minutes")}`
            : ""
        }`
      : `${service.duration} ${t("minutes")}`;

  return (
    <Link
      href={`/services/${service.id}/edit`}
      className="group flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-olive/40 active:bg-secondary/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate font-medium text-card-foreground">
              {service.name}
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-3.5 shrink-0" />
              <span>{formattedDuration}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-olive" />
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-sm font-medium text-foreground">
        <Banknote className="size-4 text-olive" />
        {formattedPrice}
      </div>
    </Link>
  );
}
