import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import ServicesList from "./ServicesList";
import type { services } from "@/db/schema";

type Service = typeof services.$inferSelect;

type Props = {
  services: Service[];
};

export async function ServicesPage({ services }: Props) {
  const t = await getTranslations("services");

  return (
    <div className="grid h-[calc(100dvh-2rem-5rem)] grid-rows-[auto_minmax(0,1fr)] gap-6 md:h-[calc(100dvh-3rem)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>

        <Link
          href="/services/new"
          className={buttonVariants()}
        >
          {t("addService")}
        </Link>
      </div>

      <div className="min-h-0 overflow-y-auto overscroll-contain scroll-smooth rounded-2xl p-2 scrollbar-gutter-stable">
        <ServicesList services={services} />
      </div>
    </div>
  );
}
