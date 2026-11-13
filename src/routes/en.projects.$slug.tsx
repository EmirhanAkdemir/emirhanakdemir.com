import { createFileRoute, notFound } from "@tanstack/react-router";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import { ProjectDetailPage, projectDetailHead } from "@/components/site/work/ProjectDetailPage";
import { PortfolioRouteState } from "@/components/site/work/PortfolioRouteState";

export const Route = createFileRoute("/en/projects/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(publicPortfolioQuery());
    if (result.error) throw new Error("PORTFOLIO_READ_FAILED");
    const project = result.projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => projectDetailHead(loaderData?.project, "en"),
  pendingComponent: () => <PortfolioRouteState locale="en" state="loading" />,
  errorComponent: () => <PortfolioRouteState locale="en" state="error" />,
  notFoundComponent: () => <PortfolioRouteState locale="en" state="notFound" />,
  component: () => <ProjectDetailPage locale="en" slug={Route.useParams().slug} />,
});