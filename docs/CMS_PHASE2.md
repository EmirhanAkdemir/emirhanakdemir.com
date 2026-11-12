# CMS Phase 2 — implementation and verification

## Delivered
- `/admin/login`: email/password sign-in using the existing external Supabase project. No registration, no new profile table, no new backend.
- Protected `/admin`, `/admin/projects`, `/admin/media`, `/admin/services`, `/admin/metrics`, and `/admin/settings`.
- Every CMS server action independently verifies the authenticated caller and existing `has_role` authorization, retains RLS, and marks responses private/no-store. No service-role client is used by the CMS.
- Persistent Supabase sessions, one root identity-change listener, and logout that cancels queries, clears cached content, and replaces navigation history with the login page.
- Overview with actual database counts and projects; searchable project management with create, edit, draft/published/archived status, confirmed deletion, featured flag and display order, agency attribution, pending attribution, year, responsibilities, URLs, service assignments, and separate TR/EN description, SEO and sharing fields.
- Results and additional links are edited as JSON arrays to preserve existing flexible JSON structures rather than invent a new schema or overwrite their shape.
- Project saves are atomic across the project, translations, and service assignments. Loaded update timestamps reject stale project edits. Existing industry, original activities, thumbnail metadata, and unedited descriptions remain intact.
- Six existing confirmed service editors, with bilingual labels, visibility, and ordering. No industry filter was added.
- Three metric editors with no fabricated values: advertising budget, countries reached, and projects completed. Unverified values cannot be published through the admin action; existing public RLS requires both verified and published.
- Private `project-images` uploads with real transfer progress, image decoding and MIME/size validation (JPEG, PNG, WebP, AVIF; 10 MB), multiple gallery files, a single cover selection, bilingual alt text, numeric ordering, replacement, and confirmed removal.
- Images stay in existing project-ID folders. New images default to unpublished. Admin previews use 60-second signed URLs refreshed every 45 seconds. Replacement uses a new unique path; failed registration attempts clean up the newly uploaded file.
- Settings includes signed-in password changes with current password. Admin interface supports TR/EN switching.
- New tool-generated migration adds invoker-security atomic save functions only; it does not reseed, duplicate, or delete existing content.

## Verified in this session
- Live external auth settings: public signup disabled, email authentication enabled, email confirmation required.
- Read-only database check: **18 projects, one existing Auth user, one existing admin appointment**. This is not an authenticated admin sign-in test.
- **15 automated tests passed**: existing routing and taxonomy tests plus explicit admin boolean authorization, verified/published metric rules, accepted upload formats and size, exact six-service taxonomy, and independent TR/EN validation.
- `bun scripts/verify-cms.ts` passed: all preserved fields in 18 projects, 36 translations, 18 service associations, six services, and anonymous role-read denial. Existing descriptions were not overwritten.
- Browser: every protected admin URL redirected a signed-out visitor to `/admin/login`; invalid sign-in displayed a safe error; direct signed-out calls to both `checkAdmin` and `readCms` were denied, independently of route redirects.
- Browser: `/`, `/en`, `/dj`, and `/en/dj` rendered their existing titles and content without page errors. Login checked at desktop and 656 × 756 mobile, without horizontal overflow.
- Preview build/type checking reports OK.
- Database linter introduced no new findings. Three pre-existing warnings remain: two execution warnings on the existing SECURITY DEFINER event-trigger function and disabled leaked-password protection.

## Not verified / required owner checks
This is an externally managed Supabase project. The available browser session cannot be minted or restored by Lovable for this connection. No real credentials were requested, manufactured, or used. **Successful real-admin sign-in, dashboard rendering while signed in, CRUD read-back, TR/EN save read-back, non-admin authenticated rejection, uploads/downloads, replacement/removal, and logout persistence are not claimed as passed.**

Open `/admin/login` in the preview or published app and use your existing admin account:
1. Sign in; verify the dashboard and project list show all 18 existing projects.
2. Create a distinctly named draft, enter different TR and EN descriptions, save, reopen, and check both languages persist. Edit and save again.
3. Confirm the draft is absent from an anonymous Supabase read. The public website deliberately continues to use static project data, so admin edits will not appear there in this phase.
4. Upload a small real image to the test draft; verify progress, preview, alt text, cover selection, order, replacement, and removal. Anonymous access to draft files must fail.
5. Test metric visibility combinations and confirm publication requires verification. No metric values are populated automatically.
6. Sign out; revisit protected URLs and use Back. Access must return to login. Sign in again and refresh to verify session persistence.
7. If you have an ordinary account, verify it cannot access admin pages or perform CMS actions. No ordinary account was created here because signup is disabled and only the owner should provision accounts.
8. Delete only the temporary test project after checking its content. Existing projects were not modified during verification.

Enable leaked-password protection in Supabase Authentication settings if available for the project's plan. The two event-trigger execution warnings can be reviewed separately; Phase 2 does not change that pre-existing function.

## Portability and limitations
- All content remains in the existing external PostgreSQL/Storage connection. New migrations remain source controlled through the tool; no vendor-specific CMS service was added.
- GitHub sync and remote repository contents remain unverified; confirm the Phase 2 migration and admin source files appear in your private repository.
- Existing hosting configuration remains unchanged. Netlify adapter/configuration and deployment have not been implemented or tested in this phase.
- Public project and metric sources remain unchanged until a separately approved, tested cutover.
- Signed image URLs remain usable until their brief expiry, including after unpublishing. The storage bucket is never made public.
- Storage and PostgreSQL cannot share one transaction: upload cleanup is best-effort, and project deletion removes associated files before deleting the project record. A failure is surfaced instead of claiming successful deletion.
- The current CMS reads at most 1,000 rows per content table; add pagination before exceeding that size.