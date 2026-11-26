import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold tracking-tight text-olive">
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold">
        {t("notFoundTitle")}
      </h1>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {t("notFoundDescription")}
      </p>

      <Button
        nativeButton={false}
        render={<Link href="/" />}
        className="mt-6"
      >
        <ArrowLeft className="size-4" />
        {t("backToHome")}
      </Button>
    </div>
  );
}
