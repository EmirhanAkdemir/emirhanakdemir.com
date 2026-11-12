import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/site/admin/Projects";
import { adminHead } from "@/components/site/admin/shared";
import { cmsQuery } from "@/lib/cms/queries";
export const Route = createFileRoute("/_authenticated/admin/projects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(cmsQuery()),
  head: () => adminHead("Projects"),
  component: Projects,
});
