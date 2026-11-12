import { createFileRoute } from '@tanstack/react-router';
import { Media } from '@/components/site/admin/Media';
import { adminHead } from '@/components/site/admin/shared';
import { cmsQuery } from '@/lib/cms/queries';
export const Route=createFileRoute('/_authenticated/admin/media')({loader:({context})=>context.queryClient.ensureQueryData(cmsQuery()),head:()=>adminHead('Media'),component:Media});
