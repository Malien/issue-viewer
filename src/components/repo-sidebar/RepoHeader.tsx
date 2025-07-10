import type { RepoHeaderFragment$key } from "@/utils/relay/__generated__/RepoHeaderFragment.graphql";
import type { RepoHeaderStarMutation } from "@/utils/relay/__generated__/RepoHeaderStarMutation.graphql";
import type { RepoHeaderUnstarMutation } from "@/utils/relay/__generated__/RepoHeaderUnstarMutation.graphql";
import { GitFork, Star } from "lucide-react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const RepoHeaderFragment = graphql`
  fragment RepoHeaderFragment on Repository {
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
  }
`;

const RepoHeaderStarMutation = graphql`
  mutation RepoHeaderStarMutation($repoID: ID!) {
    addStar(input: { starrableId: $repoID }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const RepoHeaderUnstarMutation = graphql`
  mutation RepoHeaderUnstarMutation($repoID: ID!) {
    removeStar(input: { starrableId: $repoID }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

export default function RepoHeader(props: { repo: RepoHeaderFragment$key }) {
  const repo = useFragment(RepoHeaderFragment, props.repo);

  const [starRepo, starMutationInFlight] = useMutation<RepoHeaderStarMutation>(
    RepoHeaderStarMutation,
  );
  const [unstarRepo, unstarMutationInFlight] =
    useMutation<RepoHeaderUnstarMutation>(RepoHeaderUnstarMutation);

  function handleStarClick() {
    const optimisticMutationReponse = {
      starrable: {
        __typename: "Repository",
        id: repo.id,
        viewerHasStarred: !repo.viewerHasStarred,
      },
    };

    if (repo.viewerHasStarred) {
      unstarRepo({
        variables: { repoID: repo.id },
        optimisticResponse: { removeStar: optimisticMutationReponse },
      });
    } else {
      starRepo({
        variables: { repoID: repo.id },
        optimisticResponse: { addStar: optimisticMutationReponse },
      });
    }
  }

  return (
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
          <button
            type="button"
            disabled={starMutationInFlight || unstarMutationInFlight}
            className="flex gap-1 items-center align-self-top mt-1 cursor-pointer"
            onClick={handleStarClick}
          >
            <Star
              fill={repo.viewerHasStarred ? "orange" : "transparent"}
              stroke="orange"
            />
            {new Intl.NumberFormat().format(repo.stargazerCount)}
          </button>
          <div className="flex gap-1 items-center align-self-top mt-1">
            <GitFork />
            {new Intl.NumberFormat().format(repo.forkCount)}
          </div>
        </div>
      </div>
    </div>
  );
}
