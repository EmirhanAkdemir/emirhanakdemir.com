import { createFileRoute, notFound } from "@tanstack/react-router";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import { ProjectDetailPage, projectDetailHead } from "@/components/site/work/ProjectDetailPage";
import { PortfolioRouteState } from "@/components/site/work/PortfolioRouteState";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(publicPortfolioQuery());
    if (result.error) throw new Error("PORTFOLIO_READ_FAILED");
    const project = result.projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => projectDetailHead(loaderData?.project, "tr"),
  pendingComponent: () => <PortfolioRouteState locale="tr" state="loading" />,
  errorComponent: () => <PortfolioRouteState locale="tr" state="error" />,
  notFoundComponent: () => <PortfolioRouteState locale="tr" state="notFound" />,
  component: () => <ProjectDetailPage locale="tr" slug={Route.useParams().slug} />,
});