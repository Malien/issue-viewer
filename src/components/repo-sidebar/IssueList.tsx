import type { IssueListFragment$key } from "@/utils/relay/__generated__/IssueListFragment.graphql";
import { usePaginationFragment } from "react-relay";
import { Fragment } from "react/jsx-runtime";
import { graphql } from "relay-runtime";
import Issue from "./Issue";

const IssueListFragment = graphql`
  fragment IssueListFragment on Repository 
    @argumentDefinitions(
      count: { type: "Int", defaultValue: 10 }
      cursor: { type: "String" }
    )
    @refetchable(queryName: "IssueListPaginationQuery") 
    @throwOnFieldError
  {
    issues(last: $count, before: $cursor) 
      @connection(key: "IssueListPaginationQuery_issues")
    {
      edges {
        node {
          id
          ...IssueFragment
        }
      }
    }
  }
`;

export default function IssueList(props: { repo: IssueListFragment$key }) {
  const page = usePaginationFragment(IssueListFragment, props.repo);

  // It makes sense to virtualize the issues list, as it can be large.
  // Also, one could utilize lazy iteration in order to avoid this many
  // large intermediate arrays.
  const issues = page.data.issues?.edges
    ?.filter((edge) => !!edge)
    .map((edge) => edge.node)
    .filter((issue) => !!issue)
    .toReversed();

  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Issues</h2>
      {issues?.map((issue) => (
        <Fragment key={issue.id}>
          <Issue key={issue.id} issue={issue} />
          <div className="w-[calc(100%---spacing(4))] h-px bg-slate-200 ms-4 last-of-type:hidden" />
        </Fragment>
      ))}
      {page.hasPrevious && (
        <button
          className="text-blue-600 rounded-md px-4 py-2 mb-4 text-center w-full cursor-pointer border mt-4 mb-12 mx-auto max-w-sm block hover:bg-slate-100 disabled:opacity-50 disabled:cursor-wait"
          disabled={page.isLoadingPrevious}
          onClick={() => page.loadPrevious(10)}
        >
          Load more
        </button>
      )}
    </>
  );
}
