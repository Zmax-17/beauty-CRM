"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { deleteServiceAction } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  serviceId: string;
  serviceName: string;
};

export default function DeleteServiceSection({
  serviceId,
  serviceName,
}: Props) {
  const common = useTranslations("common");
  const t = useTranslations("services");
  const locale = useLocale();

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `${t("deleteConfirmation")}\n\n${serviceName}`,
    );

    if (!confirmed) return;

    setError(null);

    startTransition(async () => {
      const result = await deleteServiceAction(
        serviceId,
        locale,
      );

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="border-t border-border pt-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">
            {t("deleteService")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("deleteConfirmation")}
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          className="cursor-pointer"
          disabled={pending}
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
          {pending ? "..." : common("delete")}
        </Button>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
