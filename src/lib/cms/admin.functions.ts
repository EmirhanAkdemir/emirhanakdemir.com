import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { setResponseHeader } from "@tanstack/react-start/server";
import type { Json } from "@/integrations/supabase/types";
import { projectSchema, canAdmin, serviceIds } from "./rules";
const admin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ context, next }) => {
    setResponseHeader("Cache-Control", "private, no-store");
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !canAdmin(data)) throw new Error("CMS_ACCESS_DENIED");
    return next({ context });
  });
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([admin])
  .handler(async () => ({ allowed: true }));
export const readCms = createServerFn({ method: "POST" })
  .middleware([admin])
  .handler(async ({ context }) => {
    const db = context.supabase;
    const [projects, translations, assignments, services, metrics, media] = await Promise.all([
      db.from("projects").select("*").order("display_order").limit(1000),
      db.from("project_translations").select("*").limit(1000),
      db.from("project_services").select("*").limit(1000),
      db.from("services").select("*").order("display_order"),
      db.from("site_metrics").select("*").order("display_order"),
      db.from("project_media").select("*").order("display_order").limit(1000),
    ]);
    if ([projects, translations, assignments, services, metrics, media].some((r) => r.error))
      throw new Error("CMS_READ_FAILED");
    return {
      projects: projects.data ?? [],
      translations: translations.data ?? [],
      assignments: assignments.data ?? [],
      services: services.data ?? [],
      metrics: metrics.data ?? [],
      media: media.data ?? [],
    };
  });
export const saveProject = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(projectSchema)
  .handler(async ({ data, context }) => {
    const { services, translations, expected_updated_at, ...project } = data;
    const db = context.supabase;
    // Atomic invoker RPC retains RLS, checks revision, and writes both locales and associations together.
    const result = await db.rpc(
      "cms_save_project",
      { payload: { ...project, services, translations, expected_updated_at } as Json },
    );
    if (result.error)
      throw new Error(
        result.error.message.includes("CMS_CONFLICT") ? "CMS_CONFLICT" : "CMS_SAVE_FAILED",
      );
    return { ok: true };
  });
export const deleteProject = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const { data: media, error: readError } = await context.supabase
      .from("project_media")
      .select("storage_path")
      .eq("project_id", data.id);
    if (readError) throw new Error("CMS_DELETE_FAILED");
    if (media?.length) {
      const r = await context.supabase.storage
        .from("project-images")
        .remove(media.map((m) => m.storage_path));
      if (r.error) throw new Error("CMS_DELETE_FAILED");
    }
    const r = await context.supabase.from("projects").delete().eq("id", data.id).select("id");
    if (r.error || !r.data?.length) throw new Error("CMS_DELETE_FAILED");
    return { ok: true };
  });
export const saveService = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(
    z.object({
      id: z.enum(serviceIds),
      name_tr: z.string().trim().min(1),
      name_en: z.string().trim().min(1),
      published: z.boolean(),
      display_order: z.number().int(),
    }),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("services").update(data).eq("id", data.id).select("id");
    if (r.error || !r.data?.length) throw new Error("CMS_SAVE_FAILED");
    return { ok: true };
  });
export const saveMetric = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(
    z.object({
      id: z.enum(["budget", "countries", "projects"]),
      label_tr: z.string().min(1),
      label_en: z.string().min(1),
      value: z.string().trim().min(1),
      verified: z.boolean(),
      published: z.boolean(),
      display_order: z.number().int(),
    }),
  )
  .handler(async ({ data, context }) => {
    if (data.published && !data.verified) throw new Error("CMS_METRIC_UNVERIFIED");
    const r = await context.supabase.from("site_metrics").upsert(data);
    if (r.error) throw new Error("CMS_SAVE_FAILED");
    return { ok: true };
  });
export const saveMedia = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      project_id: z.string(),
      storage_path: z.string(),
      kind: z.enum(["cover", "gallery"]),
      alt_tr: z.string(),
      alt_en: z.string(),
      published: z.boolean(),
      display_order: z.number().int(),
      expected_updated_at: z.string().nullable(),
    }),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc("cms_save_media", { payload: data });
    if (r.error) throw new Error("CMS_SAVE_FAILED");
    return { ok: true };
  });
export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const db = context.supabase;
    const { data: row, error } = await db
      .from("project_media")
      .select("storage_path")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("CMS_DELETE_FAILED");
    const removed = await db.storage.from("project-images").remove([row.storage_path]);
    if (removed.error) throw new Error("CMS_DELETE_FAILED");
    const r = await db.from("project_media").delete().eq("id", data.id);
    if (r.error) throw new Error("CMS_DELETE_FAILED");
    return { ok: true };
  });
export const mediaUrls = createServerFn({ method: "POST" })
  .middleware([admin])
  .inputValidator(z.array(z.string()).max(1000))
  .handler(async ({ data, context }) => {
    if (!data.length) return [];
    const r = await context.supabase.storage.from("project-images").createSignedUrls(data, 60);
    if (r.error) throw new Error("CMS_READ_FAILED");
    return (r.data ?? []).map((v) => ({ path: v.path ?? "", url: v.signedUrl ?? "" }));
  });
export type CmsData = Awaited<ReturnType<typeof readCms>>;
