"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  createClientAction,
  updateClientAction,
} from "@/lib/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { clients } from "@/db/schema";

type Client = typeof clients.$inferSelect;

type Props = {
  mode?: "create" | "edit";
  client?: Client;
};

type ActionState = { error?: string } | null;

export default function ClientForm({
  mode = "create",
  client,
}: Props) {
  const t = useTranslations("clients");
  const common = useTranslations("common");
  const locale = useLocale();

  const [state, formAction, pending] = useActionState(
    async (
      prev: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      if (mode === "edit" && client) {
        return updateClientAction(
          client.id,
          prev,
          formData,
        );
      }

      return createClientAction(prev, formData);
    },
    null,
  );

  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [notes, setNotes] = useState(client?.notes ?? "");

  const hasChanges =
    name.trim() !== (client?.name ?? "").trim() ||
    phone.trim() !== (client?.phone ?? "").trim() ||
    notes.trim() !== (client?.notes ?? "").trim();

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToClients")}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "edit"
              ? common("edit")
              : common("create")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={formAction}
            className="space-y-4"
          >
            <input
              type="hidden"
              name="locale"
              value={locale}
            />

            <div className="space-y-2">
              <Label htmlFor="name">{t("formName")}</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("formPhone")}
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                {t("formNotes")}
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">
                <span>{state.error}</span>
              </p>
            )}

            <Button
              className="w-full sm:w-auto cursor-pointer"
              type="submit"
              disabled={
                pending || (mode === "edit" && !hasChanges)
              }
            >
              <span>
                {pending
                  ? t("saving")
                  : mode === "edit"
                    ? common("save")
                    : t("addClient")}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
