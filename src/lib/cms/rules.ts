import { z } from "zod";
export const serviceIds = [
  "website",
  "googleAds",
  "metaAds",
  "seo",
  "automation",
  "customSoftware",
] as const;
const url = z.string().refine((v) => !v || /^https?:\/\//.test(v), "Invalid URL");
export const projectSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1),
  agency: z.string(),
  attribution_pending: z.boolean(),
  year_label: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  display_order: z.number().int(),
  responsibilities: z.array(z.string()),
  external_url: url.nullable(),
  links: z.array(z.unknown()),
  verified_results: z.array(z.unknown()),
  services: z.array(z.enum(serviceIds)),
  translations: z
    .array(
      z.object({
        locale: z.enum(["tr", "en"]),
        description: z.string(),
        seo_title: z.string().nullable(),
        seo_description: z.string().nullable(),
        og_title: z.string().nullable(),
        og_description: z.string().nullable(),
      }),
    )
    .length(2)
    .refine((v) => new Set(v.map((t) => t.locale)).size === 2),
  expected_updated_at: z.string().nullable(),
});
export type ProjectInput = z.infer<typeof projectSchema>;
export function metricVisible(metric: { verified: boolean; published: boolean }) {
  return metric.verified && metric.published;
}
export function validateImage(file: { size: number; type: string }) {
  return (
    file.size > 0 &&
    file.size <= 10 * 1024 * 1024 &&
    ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  );
}
export function canAdmin(value: unknown) {
  return value === true;
}
