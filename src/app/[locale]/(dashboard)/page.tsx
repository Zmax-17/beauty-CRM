import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("common");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{t("appName")}</h1>
      <p className="mt-2">{t("save")}</p>
    </main>
  );
}
