<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- All UI copy lives in src/i18n (tr.ts is the source type, en.ts mirrors it); routes just pass a locale to shared page components in src/components/site — keeps both languages in sync.
- DJ mode is a `.dj` class that overrides color tokens in src/styles.css — same components, different palette.
- Phase 1 CMS is normalized PostgreSQL with tool-generated SQL migrations; public project reads remain static until a separate approved cutover, preventing an unverified data-source change.
- Normalize confirmed service keys in a shared data module, preserving original activities and responsibilities separately; this prevents inference and keeps filters and imports consistent.
- CMS authorization uses caller-scoped `has_role` with invoker security and read-own role RLS; only trusted SQL provisioning writes roles, avoiding recursive policies and self-promotion.
- Project files live in private Storage under project-ID folders; both media and project must be published for visitor reads, so drafts cannot leak through a public bucket.
- Storage policy subqueries must qualify the outer file path as `storage.objects.name`; otherwise PostgreSQL can bind `name` to a project's name and bypass exact-file checks or block uploads.
- Admin CMS server functions require caller-scoped admin middleware and RLS; atomic invoker RPCs save project translations/assignments and cover selection without privileged clients or partial writes.
- Admin screens live under the client-only authenticated gate; public admin login redirects only after real user and role validation, and one root auth listener owns session invalidation.
- Admin forms retain loaded revisions and preserve unedited source metadata; storage uploads use unique paths and short-lived admin-only previews to avoid replacing cached published images.
