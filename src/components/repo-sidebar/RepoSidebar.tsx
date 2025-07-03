import type { RepoSidebarFragment$key } from "@/utils/relay/__generated__/RepoSidebarFragment.graphql";
import { Suspense } from "react";
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
        <IssueList repo={repo} />
      </Suspense>
    </>
  );
}
