import { createFileRoute } from "@tanstack/react-router";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import type { routesQuery } from "../utils/relay/__generated__/routesQuery.graphql";
import RepoSearch from "@/RepoSearch";

const routesQuery = graphql`
  query routesQuery {
    viewer {
      name
    }
  }
`;

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Loading...</div>,
	async loader({ context }) {
		return loadQuery<routesQuery>(context.relayEnvironment, routesQuery, {});
	},
});

function App() {
	const preloadedQuery = Route.useLoaderData();
	const data = usePreloadedQuery<routesQuery>(routesQuery, preloadedQuery);

	return (
		<div>
			<h1>Hello, {data.viewer.name}</h1>
			<RepoSearch />
		</div>
	);
}
