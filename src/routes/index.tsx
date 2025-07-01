import { createFileRoute } from "@tanstack/react-router";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import type { routesQuery } from "../utils/relay/__generated__/routesQuery.graphql";
import RepoSearch from "@/RepoSearch";

const INDEX_QUERY = graphql`
  query routesQuery {
    viewer {
      name
    }
  }
`;

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Loading...</div>,
	loader: async ({ context: { relayEnvironment } }) => {
		return loadQuery<routesQuery>(
			relayEnvironment,
			INDEX_QUERY,
			{},
			{ fetchPolicy: "store-and-network" },
		);
	},
});

function App() {
	const preloadedQuery = Route.useLoaderData();
	const data = usePreloadedQuery<routesQuery>(INDEX_QUERY, preloadedQuery);

	return (
		<div>
			<h1>Hello, {data.viewer.name}</h1>
			<RepoSearch />
		</div>
	);
}
