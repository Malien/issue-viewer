import type { ContributorsFragment$key } from "@/utils/relay/__generated__/ContributorsFragment.graphql";
import type { ContributorsUserFragment$key } from "@/utils/relay/__generated__/ContributorsUserFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const ContributorsFragment = graphql`
  # Okay, this is weird. GitHub says that "You do not have permission to view repository collaborators"
  # on repositories that you don't own. Huh. This should be a publicly accessible information, it is
  # on the GitHub website itself. I don't think there is an another field that gives us the desired
  # information. So for the most repositories, this block will be empty.
  fragment ContributorsFragment on Repository {
    # In theory, this could only be null on an internal server error or a failed permission check.
    # Yet, GitHub's schema doesn't implement the somewhat new @semanticNonNull,
    # which would've allowed us to use @throwOnFieldError to make the fields non-nullable.
    collaborators(first: 19) {
      totalCount
      nodes {
        id
        ...ContributorsUserFragment
      }
    }
  }
`;

export default function Contributors(props: {
  repo: ContributorsFragment$key;
}) {
  const { collaborators } = useFragment(ContributorsFragment, props.repo);

  if (!collaborators) return null;
  const effectiveContributors = collaborators.nodes?.filter((node) => !!node);
  if (!effectiveContributors || effectiveContributors.length === 0) {
    // Silently skip rendering contributors if there are none.
    return null;
  }

  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Contributors</h2>
      <div className="grid grid-cols-10 gap-2 mt-2 px-4">
        {effectiveContributors.map((contributor) => (
          <ContributorCircle key={contributor.id} user={contributor} />
        ))}
        {collaborators.totalCount > effectiveContributors.length && (
          <div className="bg-indigo-600 text-white font-bold rounded-full aspect-square flex text-sm items-center justify-center">
            +{collaborators.totalCount - effectiveContributors.length}
          </div>
        )}
      </div>
    </>
  );
}

const repoContributorCircleFragment = graphql`
  fragment ContributorsUserFragment on User {
   login
    name
    avatarUrl
  }
`;

function ContributorCircle({ user }: { user: ContributorsUserFragment$key }) {
  const { login, name, avatarUrl } = useFragment(
    repoContributorCircleFragment,
    user,
  );

  const displayName = name ? `${name} (${login})` : login;

  return (
    <a
      className="flex items-center gap-2 rounded-full"
      // A more pleasing hover tooltip would be nice. This will suffice for now.
      title={displayName}
      href={`https://github.com/${login}`}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={avatarUrl}
        alt={`${login}'s avatar`}
        className="w-full rounded-full aspect-square object-cover bg-stone-200"
      />
    </a>
  );
}

export function ContributorsSkeleton() {
  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Contributors</h2>
      <div className="grid grid-cols-10 gap-2 mt-2 px-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: There is nothing unique about these elements, apart from their poisition in the grid.
            key={index}
            className="bg-stone-200 rounded-full w-full aspect-square animate-pulse"
          />
        ))}
      </div>
    </>
  );
}

