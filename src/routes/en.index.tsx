import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/site/PortfolioPage";
import { pageHead } from "@/i18n";
import { en } from "@/i18n/en";

export const Route = createFileRoute("/en/")({
  head: () => pageHead(en.meta.title, en.meta.description, "en"),
  component: () => <PortfolioPage locale="en" />,
});
