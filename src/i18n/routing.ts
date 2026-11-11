import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "nb"],
  defaultLocale: "nb", // Norwegian as the main language, because market - Norway
  localePrefix: "as-needed", // / for nb, /en for English so that the main language is without a prefix in the URL (cleaner)
  localeDetection: false,
});
