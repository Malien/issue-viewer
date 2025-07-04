import SearchTrigger from "@/components/repo-search/SearchTrigger";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/repo/$repositoryID/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SearchTrigger className="absolute top-4 right-4 hover:bg-stone-200" />
  );
}
