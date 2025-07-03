import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/repo/$repositoryID/$issueID")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/repo/$repositoryID/$issueID"!</div>;
}
