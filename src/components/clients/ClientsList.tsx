import { clients as clientsTable } from "@/db/schema";
import { ClientsCards } from "./ClientsCards";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

type Client = typeof clientsTable.$inferSelect;

type Props = {
  clients: Client[];
  query: string;
};

export default function ClientsList({
  clients,
  query,
}: Props) {
  const t = useTranslations("clients");

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/30 px-6 py-12 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary">
          <UserRound className="size-6 text-olive" />
        </div>

        <h3 className="font-medium text-foreground">
          {query ? t("emptySearch") : t("empty")}
        </h3>
      </div>
    );
  }

  return <ClientsCards clients={clients} />;
}
