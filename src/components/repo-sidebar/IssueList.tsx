import type { IssueListFragment$key } from "@/utils/relay/__generated__/IssueListFragment.graphql";
import { useErrorBoundary } from "react-error-boundary";
import { usePaginationFragment } from "react-relay";
import { Fragment } from "react/jsx-runtime";
import { graphql } from "relay-runtime";
import LoadMoreButton from "../LoadMoreButton";
import Issue, { IssueSkeleton } from "./Issue";

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
      @connection(key: "IssueListFragment_issues")
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
          <Issue issue={issue} />
          <div className="w-[calc(100%---spacing(4))] h-px bg-stone-200 ms-4 last-of-type:hidden" />
        </Fragment>
      ))}
      {page.hasPrevious && (
        <LoadMoreButton
          disabled={page.isLoadingPrevious}
          onClick={() => page.loadPrevious(10)}
        />
      )}
    </>
  );
}

export function IssueListErrorFallback() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Issues</h2>
      <div className="px-4 text-red-500">
        We couldn't load the issues for this repository.
      </div>
      <button
        type="button"
        className="text-blue-600 hover:underline px-4"
        onClick={resetBoundary}
      >
        Try again
      </button>
    </>
  );
}

export function IssueListSkeleton() {
  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Issues</h2>
      <IssueSkeleton />
      <div className="w-[calc(100%---spacing(4))] h-px bg-stone-200 ms-4" />
      <IssueSkeleton />
      <div className="w-[calc(100%---spacing(4))] h-px bg-stone-200 ms-4" />
      <IssueSkeleton />
      <div className="w-[calc(100%---spacing(4))] h-px bg-stone-200 ms-4" />
      <IssueSkeleton />
      <div className="w-[calc(100%---spacing(4))] h-px bg-stone-200 ms-4" />
      <IssueSkeleton />
    </>
  );
}
