import type { RepoSidebarFragment$key } from "@/utils/relay/__generated__/RepoSidebarFragment.graphql";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Contributors, { ContributorsSkeleton } from "./Contributors";
import IssueList, {
  IssueListErrorFallback,
  IssueListSkeleton,
} from "./IssueList";
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
      <Suspense fallback={<IssueListSkeleton />}>
        <ErrorBoundary fallback={<IssueListErrorFallback />}>
          <IssueList repo={repo} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
