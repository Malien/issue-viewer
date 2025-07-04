import type { RepoHeaderFragment$key } from "@/utils/relay/__generated__/RepoHeaderFragment.graphql";
import { GitFork, Star } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import RepoDescription from "../RepoDescription";

const RepoHeaderFragment = graphql`
  fragment RepoHeaderFragment on Repository {
    id
    nameWithOwner
    stargazerCount
    forkCount
    owner {
      id
      login
      avatarUrl
    }
    ...RepoDescriptionFragment
  }
`;

export default function RepoHeader(props: { repo: RepoHeaderFragment$key }) {
  const repo = useFragment(RepoHeaderFragment, props.repo);

  return (
    <>
      <div className="grid grid-cols-[--spacing(20)_1fr] gap-x-4 px-4">
        <img
          src={repo.owner.avatarUrl}
          alt={`${repo.owner.login}'s avatar`}
          className="row-1 col-1 rounded-xl border-2 border-stone-300 w-full aspect-square object-cover"
        />
        <div className="self-center">
          <h1 className="text-3xl text-indigo-800 hover:underline h-fit">
            <a
              href={`https://github.com/${repo.nameWithOwner}`}
              target="_blank"
              rel="noreferrer"
            >
              {repo.nameWithOwner}
            </a>
          </h1>
          <div className="flex gap-8">
            <div className="flex gap-1 items-center align-self-top mt-1">
              <Star fill="orange" stroke="orange" />
              {new Intl.NumberFormat().format(repo.stargazerCount)}
            </div>
            <div className="flex gap-1 items-center align-self-top mt-1">
              <GitFork />
              {new Intl.NumberFormat().format(repo.forkCount)}
            </div>
          </div>
        </div>
      </div>
      <RepoDescription
        repo={repo}
        className="col-span-2 text-stone-500 mt-2 px-4"
      />
    </>
  );
}
