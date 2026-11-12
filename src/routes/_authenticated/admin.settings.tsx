import { createFileRoute } from '@tanstack/react-router';
import { Settings } from '@/components/site/admin/Settings';
import { adminHead } from '@/components/site/admin/shared';
export const Route=createFileRoute('/_authenticated/admin/settings')({head:()=>adminHead('Settings'),component:Settings});
