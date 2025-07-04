import type { AuthorFragment$key } from "@/utils/relay/__generated__/AuthorFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const AuthorFragment = graphql`
  fragment AuthorFragment on Actor {
    ... on User @alias(as: "user") {
      name
    }
    login
    avatarUrl
  }
`;

export default function Author(props: { actor: AuthorFragment$key }) {
  const actor = useFragment(AuthorFragment, props.actor);
  const displayName = actor.user ? actor.user.name : actor.login;
  const roundness = actor.user ? "rounded-full" : "rounded-md";

  return (
    <div className="flex items-center gap-2">
      <img
        src={actor.avatarUrl}
        alt={`${displayName}'s avatar`}
        className={`w-8 h-8 ${roundness}`}
      />
      <span className="text-xl font-bold text-stone-800">{displayName}</span>
    </div>
  );
}

export function AuthorSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-stone-200" />
      <div className="bg-stone-200 h-6 w-32 rounded-md" />
    </div>
  );
}
