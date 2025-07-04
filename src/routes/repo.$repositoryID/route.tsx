import RepoSidebar from "@/components/repo-sidebar/RepoSidebar";
import type { routeRepoQuery } from "@/utils/relay/__generated__/routeRepoQuery.graphql";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";

// Yeah, I'm not a fan of this query naming either.
// The file name has to follow the tanstack router convention.
// The query name has to follow the relay convention.
const routeRepoQuery = graphql`
  query routeRepoQuery($repositoryID: ID!) {
    node(id: $repositoryID) {
      ...RepoSidebarFragment @alias(as: "repo")
    }
  }
`;

// There is two ways to structure this route
// - /repo/:owner/:name (aka. repo/facebook/react)
// - /repo/:nodeID (aka. repo/MDQ6VXNlcjEwMjM0NTY3ODo=)
//
// The first has the benefit of looking nicer and being more "shareable".
// This is how gihub does it.
//
// The second has the benefit of a lot simpler reuse of the previously cached
// partial data (missing field handlers).
//
// The first is queried as Query.repository(owner: "facebook", name: "react")
// The second is queried as Query.node(id: "MDQ6VXNlcjEwMjM0NTY3ODo=")
//
// Technically, it would be possible to write a missing field handler that would
// traverse every node in the store, and check if the owner/name is already
// present. I opted for the second approach as it is a cleaner solution for the
// instant navigations from the search interface, right to the partially-rendered
// repository page.
export const Route = createFileRoute("/repo/$repositoryID")({
  component: RepoRoute,
  loader({ params, context }) {
    return loadQuery<routeRepoQuery>(context.relayEnvironment, routeRepoQuery, {
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
        {/* Ideally there shouldn't be a suspense boundary here.             */}
        {/* We should defer the navigation until we can paint the next page. */}
        {/* tanstack router uses startTransition to do this. Yet the         */}
        {/* navigation is instant, and the whole page suspends.              */}
        {/*                                                                  */}
        {/* ...                                                              */}
        {/*                                                                  */}
        {/* I was right! It should've worked like that, except it doesn't.   */}
        {/* Tanstack router uses useSyncExternalStore (which is as the name  */}
        {/* suggests, synchronous). This makes react opt out of the async    */}
        {/* rendering, and shows the fallback immediately. React team is     */}
        {/* working on `use(Store)` API that would fix that. We won't see it */}
        {/* in stable for a long long time. I guess, flashing just the right */}
        {/* side of the page is better than flashing the whole page white.   */}
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

function Contents() {
  const queryRef = Route.useLoaderData();
  const data = usePreloadedQuery<routeRepoQuery>(routeRepoQuery, queryRef);
  if (!data.node?.repo) {
    return "Repository not found";
  }

  return <RepoSidebar repo={data.node.repo} />;
}
