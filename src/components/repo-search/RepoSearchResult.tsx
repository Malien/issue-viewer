import { CommandItem } from "@/components/ui/command";
import type { RepoSearchResultFragment$key } from "@/utils/relay/__generated__/RepoSearchResultFragment.graphql";
import { Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import RepoDescription from "../RepoDescription";

const RepoSearchResultFragment = graphql`
  fragment RepoSearchResultFragment on Repository {
    id
    nameWithOwner
    stargazerCount
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
}) {
  const repo = useFragment(RepoSearchResultFragment, props.repo);
  const navigate = useNavigate();

  return (
    <CommandItem
      value={repo.nameWithOwner}
      className="grid grid-cols-[--spacing(6)_1fr_auto] gap-2 px-2 py-1"
      asChild
      onSelect={() => {
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
        <div className="row-1 col-3 flex gap-1 items-center">
          {new Intl.NumberFormat().format(repo.stargazerCount)}
          <Star fill="orange" stroke="orange" />
        </div>
        <RepoDescription repo={repo} className="row-2 col-span-3" />
      </Link>
    </CommandItem>
  );
}
