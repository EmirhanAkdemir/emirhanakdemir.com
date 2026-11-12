# Project image access verification

## Finding and correction

The bucket is private. The original public policy used `m.storage_path = name` inside a subquery joining `projects p`. PostgreSQL resolved the bare `name` to `p.name`, not the outer Storage object's name. If a published media path matched a published project's name, the predicate could allow unrelated files in this bucket. Ordinarily it also prevented legitimate published downloads. Admin insert/update folder checks similarly resolved `name` to the project name, blocking ordinary uploads.

The migration qualifies all three outer references as `storage.objects.name`. Public reads require an exact registered path, published media, a published parent project, and the parent project's folder. Admin read/delete rules and caller-scoped admin authorization remain unchanged; insert/update require an existing project folder.

## Live verification

- Initial inventory: 18 projects, no media rows or Storage objects, private bucket; no existing images were exposed at inspection time.
- `scripts/verify-storage-access.py` passed 87 live HTTP checks with real disposable administrator and non-admin password sessions plus anonymous requests.
- Covered registered published images, unpublished media, published media on draft projects, unregistered files, outside-folder files, and a published project-name/path collision reproducing the original policy's dangerous condition.
- Anonymous/non-admin direct reads, signing, signed downloads, and listings allowed only explicitly published files. Hidden file reads/signing were denied; uploads/replacements/deletion were denied. Public-bucket URLs were denied for every case.
- Administrator uploads, replacements, downloads, signing, listing, and deletion passed; nonexistent-project uploads were denied.
- Real CMS login and media upload succeeded through `/admin/media`; saved image rendered using its signed preview. The first tiny HTTP-test PNG was not browser-decodable; a valid PNG passed the actual CMS flow.
- A deletion check initially hit cached bytes; fresh cache-busted reads and the live Storage inventory verified removal. Previously downloaded content and previously issued signed URLs must not be treated as revocable copies.
- All disposable Auth accounts, objects, projects, and media were removed. The original admin was not changed.
- Existing CMS/service/routing tests: 15 passed.

## Scope

Final inventory matches the initial state: 18 projects, zero media/objects, private bucket, original sole administrator. The quick rescan at 2026-11-12 22:37 UTC still reports the critical owner-unbound Storage rule because published images intentionally have no uploader-only restriction; it also reports disabled leaked-password protection. The finding was left active, not ignored or marked fixed. Verified access behavior is corrected, but the Security panel is not cleared.

Public website remains on its existing static source. No personal content, public signup settings, CMS forms, or generated clients were changed.
The storage scanner may still flag intentional owner-unbound public reads; restricting published portfolio images to their uploader would break the requested public access. Do not suppress this critical finding automatically.
Existing unrelated warnings concern execution grants on the event-trigger function and disabled leaked-password protection.