import type { RepoSidebarFragment$key } from "@/utils/relay/__generated__/RepoSidebarFragment.graphql";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import RepoDescription from "../RepoDescription";
import Contributors, { ContributorsSkeleton } from "./Contributors";
import IssueList, {
  IssueListErrorFallback,
  IssueListSkeleton,
} from "./IssueList";
import RepoHeader from "./RepoHeader";
import RepoStats, { RepoStatsSkeleton } from "./RepoStats";

const RepoSidebarFragment = graphql`
  fragment RepoSidebarFragment on Repository {
    ...RepoHeaderFragment
    ...ContributorsFragment
    ...IssueListFragment
    ...RepoStatsFragment
    ...RepoDescriptionFragment
  }
`;

export default function RepoSidebar(props: { repo: RepoSidebarFragment$key }) {
  const repo = useFragment(RepoSidebarFragment, props.repo);

  return (
    <>
      <RepoHeader repo={repo} />
      <RepoDescription className="text-stone-500 mt-2 px-4" repo={repo} />
      <Suspense fallback={<RepoStatsSkeleton />}>
        <RepoStats repo={repo} />
      </Suspense>
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
