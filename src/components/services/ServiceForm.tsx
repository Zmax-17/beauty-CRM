"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  createServiceAction,
  updateServiceAction,
} from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { services } from "@/db/schema";

type Service = typeof services.$inferSelect;

type Props = {
  mode?: "create" | "edit";
  service?: Service;
};

type ActionState = { error?: string } | null;

export default function ServiceForm({
  mode = "create",
  service,
}: Props) {
  const t = useTranslations("services");
  const common = useTranslations("common");
  const locale = useLocale();

  const [state, formAction, pending] = useActionState(
    async (
      prev: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      if (mode === "edit" && service) {
        return updateServiceAction(
          service.id,
          prev,
          formData,
        );
      }

      return createServiceAction(prev, formData);
    },
    null,
  );

  const [name, setName] = useState(service?.name ?? "");
  const [duration, setDuration] = useState(
    String(service?.duration ?? ""),
  );

  const [price, setPrice] = useState(
    service ? (service.price / 100).toFixed(2) : "",
  );

  const initialName = service?.name ?? "";
  const initialDuration = service?.duration ?? 0;
  const initialPrice = service?.price ?? 0;

  const currentPriceInOre = Math.round(
    (Number(price) || 0) * 100,
  );

  const hasChanges =
    name.trim() !== initialName.trim() ||
    Number(duration) !== initialDuration ||
    currentPriceInOre !== initialPrice;

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToServices")}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">
                {t("formDuration")}
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                step="1"
                required
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
              />
              <div className="flex flex-wrap gap-2">
                {[15, 30, 45, 60].map((minutes) => (
                  <Button
                    className="cursor-pointer"
                    key={minutes}
                    type="button"
                    size="sm"
                    variant={
                      duration === String(minutes)
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setDuration(String(minutes))
                    }
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                {t("formPrice")}
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150.00"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">
                {state.error}
              </p>
            )}

            <Button
              className="w-full sm:w-auto cursor-pointer"
              type="submit"
              disabled={
                pending || (mode === "edit" && !hasChanges)
              }
            >
              {pending
                ? t("saving")
                : mode === "edit"
                  ? common("save")
                  : t("addService")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
