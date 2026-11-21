import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteClientButton } from "./DeleteClientButton";
import type { clients } from "@/db/schema";
import { ArrowLeft, Pencil } from "lucide-react";

type Client = typeof clients.$inferSelect;

export async function ClientDetail({
  client,
}: {
  client: Client;
}) {
  const t = await getTranslations("clients");
  const common = await getTranslations("common");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>{t("backToClients")}</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span>{client.name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            <span>{client.phone}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/clients/${client.id}/edit`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <Pencil className="size-4" />
            <span>{common("edit")}</span>
          </Link>

          <DeleteClientButton
            clientId={client.id}
            clientName={client.name}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <span>{t("notes")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            <span>{client.notes?.trim() || "—"}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <span>{t("visitHistory")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            <span>{t("noVisits")}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
