import { CommandItem } from "@/components/ui/command";
import type { RepoSearchResultFragment$key } from "@/utils/relay/__generated__/RepoSearchResultFragment.graphql";
import { Link, useNavigate } from "@tanstack/react-router";
import { GitFork, Star } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import RepoDescription from "../RepoDescription";

const RepoSearchResultFragment = graphql`
  fragment RepoSearchResultFragment on Repository {
    id
    nameWithOwner
    stargazerCount
    forkCount
    viewerHasStarred
    owner {
      id
      login
      avatarUrl
    }
    ...RepoDescriptionFragment
  }
`;

export default function RepoSearchResult(props: {
  repo: RepoSearchResultFragment$key;
  onSelect?(): void;
}) {
  const repo = useFragment(RepoSearchResultFragment, props.repo);
  const navigate = useNavigate();

  return (
    <CommandItem
      value={repo.nameWithOwner}
      className="grid grid-cols-[--spacing(6)_1fr_auto] gap-2 px-2 py-1"
      asChild
      onSelect={() => {
        props.onSelect?.();
        navigate({
          to: "/repo/$repositoryID",
          params: { repositoryID: repo.id },
        });
      }}
    >
      <Link to="/repo/$repositoryID" params={{ repositoryID: repo.id }}>
        <img
          src={repo.owner.avatarUrl}
          alt={`${repo.owner.login}'s avatar`}
          className="row-1 col-1 rounded-sm"
        />
        <div className="row-1 col-2">{repo.nameWithOwner}</div>
        <div className="row-span-2 col-3 grid grid-cols-[1fr_--spacing(4)] gap-2 ms-2 justify-items-end self-start">
          {new Intl.NumberFormat().format(repo.stargazerCount)}
          <Star
            fill={repo.viewerHasStarred ? "orange" : "transparent"}
            stroke="orange"
          />
          {new Intl.NumberFormat().format(repo.forkCount)}
          <GitFork />
        </div>
        <RepoDescription repo={repo} className="row-2 col-span-2" />
      </Link>
    </CommandItem>
  );
}
