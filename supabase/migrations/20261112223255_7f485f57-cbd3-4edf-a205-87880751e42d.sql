ALTER POLICY cms_images_public ON storage.objects USING (
 bucket_id = 'project-images' AND EXISTS (
 SELECT 1 FROM public.project_media m JOIN public.projects p ON p.id = m.project_id
 WHERE m.storage_path = storage.objects.name AND m.published AND p.status = 'published'
 AND (storage.foldername(storage.objects.name))[1] = p.id
 ));
ALTER POLICY cms_images_admin_insert ON storage.objects WITH CHECK (
 bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin')
 AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = (storage.foldername(storage.objects.name))[1])
);
ALTER POLICY cms_images_admin_update ON storage.objects WITH CHECK (
 bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin')
 AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = (storage.foldername(storage.objects.name))[1])
);