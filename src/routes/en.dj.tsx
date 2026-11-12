import { createFileRoute } from "@tanstack/react-router";
import { DjPage } from "@/components/site/DjPage";
import { pageHead } from "@/i18n";
import { en } from "@/i18n/en";

export const Route = createFileRoute("/en/dj")({
  head: () => pageHead(en.meta.djTitle, en.meta.djDescription, "en"),
  component: () => <DjPage locale="en" />,
});
