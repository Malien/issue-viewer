import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/repo/$repositoryID")({
	component: RepoRoute,
});

function RepoRoute() {
	return <div>Repository ID: {Route.useParams().repositoryID}</div>;
}
