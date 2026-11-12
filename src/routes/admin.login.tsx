import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/components/site/admin/Login";
import { adminHead } from "@/components/site/admin/shared";
export const Route = createFileRoute("/admin/login")({
  head: () => adminHead("Administrator Sign In"),
  component: Login,
});
