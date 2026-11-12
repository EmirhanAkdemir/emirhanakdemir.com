# Phase 1 CMS
- [x] Verify external connection and existing schema (external ref confirmed; owner display-name confirmation pending below).
- [x] Create secure schema, private media storage, and idempotent 18-project seed.
- [x] Replace industry filters with confirmed service filters while retaining static public reads.
- [x] Test import parity, public access, draft hiding, write denial, and non-admin authorization.
- [x] Document migrations, portability, and manual admin/auth steps in docs/CMS_PHASE1.md.
- [ ] Owner: disable public signup in external Supabase (currently enabled; settings mutation unavailable).
- [ ] Owner: confirm project display name and private GitHub migration sync (not exposed by available tools).
- [ ] Owner: provision first admin; then verify real-admin authorization and media uploads (no Auth users or files exist).