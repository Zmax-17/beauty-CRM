"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { deleteClientAction } from "@/lib/actions/clients";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  clientId: string;
  clientName: string;
};

export function DeleteClientButton({
  clientId,
  clientName,
}: Props) {
  const common = useTranslations("common");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    const ok = window.confirm(
      `Delete client "${clientName}"? This cannot be undone.`,
    );

    if (!ok) return;

    setError(null);

    startTransition(async () => {
      const result = await deleteClientAction(
        clientId,
        locale,
      );

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        className="cursor-pointer"
        type="button"
        variant="destructive"
        disabled={pending}
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
        <span>{pending ? "..." : common("delete")}</span>
      </Button>

      {error ? (
        <p className="text-sm text-destructive">
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
