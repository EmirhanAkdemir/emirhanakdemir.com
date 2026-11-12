import { tr } from "./tr";
import { en } from "./en";
export type Locale = "tr" | "en";
export const dicts = { tr, en };
export const getDict = (l: Locale) => dicts[l];
export const paths = {
  tr: { home: "/", dj: "/dj" },
  en: { home: "/en", dj: "/en/dj" },
} as const;
export function pageHead(title: string, description: string, locale: Locale) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale === "tr" ? "tr_TR" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
