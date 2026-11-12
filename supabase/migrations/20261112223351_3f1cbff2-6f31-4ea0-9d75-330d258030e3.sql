INSERT INTO public.user_roles(user_id,role) VALUES ('25f1b42a-23f2-4af6-ba07-c09a6185fba2','admin');
INSERT INTO public.projects(id,slug,name,status) VALUES
('storage-check-58d58737-public','storage-check-58d58737-public','storage-check-58d58737-public/name-collision.png','published'),
('storage-check-58d58737-draft','storage-check-58d58737-draft','Storage security test draft','draft');
INSERT INTO public.project_media(project_id,storage_path,published) VALUES
('storage-check-58d58737-public','storage-check-58d58737-public/published.png',true),
('storage-check-58d58737-public','storage-check-58d58737-public/unpublished.png',false),
('storage-check-58d58737-draft','storage-check-58d58737-draft/draft.png',true),
('storage-check-58d58737-public','storage-check-58d58737-public/name-collision.png',true);