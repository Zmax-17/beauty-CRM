"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function ClientsSearch({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const t = useTranslations("clients");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const q = String(fd.get("q") ?? "").trim();
        router.replace(
          q
            ? `${pathname}?q=${encodeURIComponent(q)}`
            : pathname,
        );
      }}
      className="max-w-sm"
    >
      <Input
        name="q"
        defaultValue={initialQuery}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
      />
    </form>
  );
}
