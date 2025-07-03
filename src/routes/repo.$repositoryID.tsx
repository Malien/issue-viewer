import SearchTrigger from "@/components/repo-search/SearchTrigger";
import RepoSidebar from "@/components/repo-sidebar/RepoSidebar";
import type { repoQuery } from "@/utils/relay/__generated__/repoQuery.graphql";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";

const repoQuery = graphql`
  query repoQuery($repositoryID: ID!) {
    node(id: $repositoryID) {
      ...RepoSidebarFragment @alias(as: "repo")
    }
  }
`;

// There is two ways to structure this route
// - /repo/:owner/:name (aka. repo/facebook/react)
// - /repo/:nodeID (aka. repo/MDQ6VXNlcjEwMjM0NTY3ODo=)
//
// The first has the benefit of looking nicer and being more "shareable". This is how gihub does it.
// The second has the benefit of a lot simpler reuse of the previously cached partial data (missing field handlers).
//
// The first is queried as Query.repository(owner: "facebook", name: "react")
// The second is queried as Query.node(id: "MDQ6VXNlcjEwMjM0NTY3ODo=")
//
// Technically, it would be possible to write a missing field handler that would traverse every node
// in the store, and check if the owner/name is already present. I opted for the second approach as
// it is a cleaner solution for the instant navigations from the search interface, right to the partially-rendered
// repository page.
export const Route = createFileRoute("/repo/$repositoryID")({
  component: RepoRoute,
  loader({ params, context }) {
    return loadQuery<repoQuery>(context.relayEnvironment, repoQuery, {
      repositoryID: params.repositoryID,
    });
  },
});

function RepoRoute() {
  return (
    <div className="grid grid-cols-[minmax(200px,500px)_minmax(300px,1fr)] bg-stone-100 h-screen">
      <aside className="border-r overflow-y-auto bg-white py-4">
        <Suspense>
          <Contents />
        </Suspense>
      </aside>
      <div className="relative">
        <SearchTrigger className="absolute top-4 right-4" />
        <Outlet />
      </div>
    </div>
  );
}

function Contents() {
  const queryRef = Route.useLoaderData();
  const data = usePreloadedQuery<repoQuery>(repoQuery, queryRef);
  if (!data.node?.repo) {
    return "Repository not found";
  }

  return <RepoSidebar repo={data.node.repo} />;
}
