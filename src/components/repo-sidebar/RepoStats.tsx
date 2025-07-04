import type { RepoStatsFragment$key } from "@/utils/relay/__generated__/RepoStatsFragment.graphql";
import { GitBranch, GitCommitVertical } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const RepoStatsFragment = graphql`
  fragment RepoStatsFragment on Repository {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 0) {
            totalCount
          }
        }
      }
    }

    branches: refs(refPrefix: "refs/heads/", first: 0) {
      totalCount
    }
  }
`;

export default function RepoStats(props: { repo: RepoStatsFragment$key }) {
  const repo = useFragment(RepoStatsFragment, props.repo);

  const branchCount = repo.branches?.totalCount;
  const commitCount = repo.defaultBranchRef?.target?.history?.totalCount;

  return (
    <div className="px-4 grid grid-cols-2 mt-4 gap-8">
      {branchCount !== undefined && (
        <div className="text-gray-800 flex text-lg gap-2">
          <GitBranch className="w-5" strokeWidth={3} />
          <b>{branchCount}</b> Branches
        </div>
      )}
      {commitCount !== undefined && (
        <div className="text-gray-800 flex gap-2">
          <GitCommitVertical className="w-5" strokeWidth={3} />
          <b>{commitCount}</b> Commits
        </div>
      )}
    </div>
  );
}

export function RepoStatsSkeleton() {
  return (
    <div className="px-4 grid grid-cols-2 mt-4 gap-8">
      <div className="text-gray-800 flex text-lg gap-2">
        <GitBranch className="w-5" strokeWidth={3} />
        <div className="bg-stone-200 rounded-md w-8 h-5 animate-pulse" />
        Branches
      </div>
      <div className="text-gray-800 flex gap-2">
        <GitCommitVertical className="w-5" strokeWidth={3} />
        <div className="bg-stone-200 rounded-md w-12 h-5 animate-pulse" />
        Commits
      </div>
    </div>
  );
}
