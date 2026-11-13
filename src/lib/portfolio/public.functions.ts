import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { portfolioServices, type PortfolioService } from "@/data/portfolio-services";
import { publishedInOrder, visibleMedia, type PublicProject } from "./model";

export const readPublicPortfolio = createServerFn({ method: "GET" }).handler(async (): Promise<{
  projects: PublicProject[]; error: boolean; imageError: boolean;
}> => {
  // Always anonymous, even when the caller is an administrator. Never forward session headers.
  setResponseHeader("Cache-Control", "no-store");
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const browserUrl = import.meta.env["VITE_SUPABASE_URL"];
  if (!url || !key || !browserUrl) return { projects: [], error: true, imageError: false };
  const db = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers, cache: "no-store" });
    } },
  });
  try {
    // Pagination avoids silently losing projects/children at Supabase's 1,000-row default.
    const pageSize = 500;
    async function allRows<T>(page: (start: number, end: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
      const rows: T[] = [];
      for (let start = 0; ; start += pageSize) {
        const result = await page(start, start + pageSize - 1);
        if (result.error) throw new Error("PORTFOLIO_READ_FAILED");
        rows.push(...(result.data ?? []));
        if (!result.data || result.data.length < pageSize) return rows;
      }
    }
    const [rawProjects, translations, assignments, media] = await Promise.all([
      allRows((a, b) => db.from("projects").select("id,slug,name,agency,attribution_pending,industry,year_label,status,featured,display_order,original_services,responsibilities,external_url").eq("status", "published").order("display_order").order("id").range(a, b)),
      allRows((a, b) => db.from("project_translations").select("project_id,locale,description,seo_title,seo_description,og_title,og_description").order("project_id").order("locale").range(a, b)),
      allRows((a, b) => db.from("project_services").select("project_id,service_id").order("project_id").order("service_id").range(a, b)),
      allRows((a, b) => db.from("project_media").select("id,project_id,storage_path,kind,alt_tr,alt_en,published,display_order").eq("published", true).order("display_order").order("id").range(a, b)),
    ]);
    const ordered = publishedInOrder(rawProjects);
    const safeMedia = visibleMedia(media, new Set(ordered.map((p) => p.id)));
    const imageUrls = new Map<string, string>();
    let imageError = false;
    for (let start = 0; start < safeMedia.length; start += 100) {
      const paths = safeMedia.slice(start, start + 100).map((m) => m.storage_path);
      // Anonymous Storage client enforces the existing exact-file/publication policies.
      const signed = await db.storage.from("project-images").createSignedUrls(paths, 60);
      if (signed.error) imageError = true;
      for (const image of signed.data ?? []) {
        if (!image.path || !image.signedUrl || image.error) { imageError = true; continue; }
        const publicUrl = new URL(image.signedUrl);
        const publicOrigin = new URL(browserUrl);
        publicUrl.protocol = publicOrigin.protocol;
        publicUrl.host = publicOrigin.host;
        imageUrls.set(image.path, publicUrl.toString());
      }
    }
    const projects: PublicProject[] = ordered.map((p) => {
      const translation = (locale: "tr" | "en") => translations.find((t) => t.project_id === p.id && t.locale === locale);
      const seo = (locale: "tr" | "en") => {
        const t = translation(locale);
        return { title: t?.seo_title ?? null, description: t?.seo_description ?? null, ogTitle: t?.og_title ?? null, ogDescription: t?.og_description ?? null };
      };
      return {
        id: p.id, slug: p.slug, name: p.name, context: p.agency, contextPending: p.attribution_pending,
        industry: p.industry, yearLabel: p.year_label, featured: p.featured, displayOrder: p.display_order,
        services: portfolioServices.filter((s: PortfolioService) => assignments.some((a) => a.project_id === p.id && a.service_id === s)),
        activities: p.original_services, responsibilities: p.responsibilities, externalUrl: p.external_url,
        description: { tr: translation("tr")?.description ?? "", en: translation("en")?.description ?? "" },
        seo: { tr: seo("tr"), en: seo("en") },
        images: safeMedia.filter((m) => m.project_id === p.id).flatMap((m) => {
          const imageUrl = imageUrls.get(m.storage_path);
          return imageUrl ? [{ id: m.id, url: imageUrl, kind: m.kind, alt: { tr: m.alt_tr, en: m.alt_en } }] : [];
        }),
      };
    });
    return { projects, error: false, imageError };
  } catch {
    return { projects: [], error: true, imageError: false };
  }
});