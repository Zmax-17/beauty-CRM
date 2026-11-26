import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";

import type { services as servicesTable } from "@/db/schema";
import { ServicesCards } from "./ServicesCards";

type Service = typeof servicesTable.$inferSelect;

type Props = {
  services: Service[];
};

export default function ServicesList({ services }: Props) {
  const t = useTranslations("services");

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/30 px-6 py-12 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary">
          <Eye className="size-6 text-olive" />
        </div>

        <h3 className="font-medium text-foreground">
          {t("empty")}
        </h3>
      </div>
    );
  }

  return <ServicesCards services={services} />;
}
