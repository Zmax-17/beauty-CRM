import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import ClientsSearch from "./ClientsSearch";
import ClientsList from "./ClientsList";
import type { clients } from "@/db/schema";

type Client = typeof clients.$inferSelect;

type Props = {
  clients: Client[];
  query: string;
};

export async function ClientsPage({
  clients,
  query,
}: Props) {
  const t = await getTranslations("clients");

  return (
    <div className="grid h-[calc(100dvh-2rem-5rem)] grid-rows-[auto_auto_minmax(0,1fr)] gap-6 md:h-[calc(100dvh-3rem)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>

        <Link
          href="/clients/new"
          className={buttonVariants()}
        >
          {t("addClient")}
        </Link>
      </div>

      <ClientsSearch initialQuery={query} />

      <div className="min-h-0 overflow-y-auto overscroll-contain scroll-smooth rounded-2xl p-2 scrollbar-gutter-stable">
        <ClientsList
          clients={clients}
          query={query ?? ""}
        />
      </div>
    </div>
  );
}
