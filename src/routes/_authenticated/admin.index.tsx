import { createFileRoute } from '@tanstack/react-router';
import { Overview } from '@/components/site/admin/Overview';
import { adminHead } from '@/components/site/admin/shared';
import { cmsQuery } from '@/lib/cms/queries';
export const Route=createFileRoute('/_authenticated/admin/')({loader:({context})=>context.queryClient.ensureQueryData(cmsQuery()),head:()=>adminHead('Overview'),component:Overview});
