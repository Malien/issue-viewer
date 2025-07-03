import type { RepoSidebarFragment$key } from "@/utils/relay/__generated__/RepoSidebarFragment.graphql";
import { Suspense } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Contributors, { ContributorsSkeleton } from "./Contributors";
import IssueList from "./IssueList";
import RepoHeader from "./RepoHeader";

const RepoSidebarFragment = graphql`
  fragment RepoSidebarFragment on Repository {
    ...RepoHeaderFragment
    ...ContributorsFragment
    ...IssueListFragment
  }
`;

export default function RepoSidebar(props: { repo: RepoSidebarFragment$key }) {
  const repo = useFragment(RepoSidebarFragment, props.repo);

  return (
    <>
      <RepoHeader repo={repo} />
      <Suspense fallback={<ContributorsSkeleton />}>
        <Contributors repo={repo} />
      </Suspense>
      <Suspense>
        <ErrorBoundary fallback={<IssueListErrorFallback />}>
          <IssueList repo={repo} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

function IssueListErrorFallback() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className="px-4 text-red-600">
      We couldn't load the issues for this repository.
      <button
        type="button"
        className="text-blue-600 hover:underline"
        onClick={resetBoundary}
      >
        Try again
      </button>
    </div>
  );
}
