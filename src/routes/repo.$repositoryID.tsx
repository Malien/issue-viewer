import type { repoContributorCircleFragment$key } from "@/utils/relay/__generated__/repoContributorCircleFragment.graphql";
import type { repoContributorsFragment$key } from "@/utils/relay/__generated__/repoContributorsFragment.graphql";
import type { repoHeaderFragment$key } from "@/utils/relay/__generated__/repoHeaderFragment.graphql";
import type { repoQuery } from "@/utils/relay/__generated__/repoQuery.graphql";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Suspense } from "react";
import {
	graphql,
	loadQuery,
	useFragment,
	usePreloadedQuery,
} from "react-relay";

const repoQuery = graphql`
    query repoQuery($repositoryID: ID!) {
        node(id: $repositoryID) {
            ... on Repository @alias(as: "repo") {
                ...repoHeaderFragment
                ...repoContributorsFragment
            }
        }
    }
`;

// There is two ways to structure this route
// - /repo/:owner/:name (aka. repo/facebook/react)
// - /repo/:nodeID (aka. repo/MDQ6VXNlcjEwMjM0NTY3ODo=)
//
// The first has the benefit of looking nicer and being more "shareable". This is how gihub does it.
// The second has the benefit of a lot simpler reuse of the previously cached partial data (missing field handlers).
//
// The first is queried as Query.repository(owner: "facebook", name: "react")
// The second is queried as Query.node(id: "MDQ6VXNlcjEwMjM0NTY3ODo=")
//
// Technically, it would be possible to write a missing field handler that would traverse every node
// in the store, and check if the owner/name is already present. I opted for the second approach as
// it is a cleaner solution for the instant navigations from the search interface, right to the partially-rendered
// repository page.
export const Route = createFileRoute("/repo/$repositoryID")({
	component: RepoRoute,
	async loader({ params, context }) {
		return loadQuery<repoQuery>(context.relayEnvironment, repoQuery, {
			repositoryID: params.repositoryID,
		});
	},
});

function RepoRoute() {
	const queryRef = Route.useLoaderData();
	const data = usePreloadedQuery<repoQuery>(repoQuery, queryRef);

	if (!data.node || !data.node.repo) {
		return "Repository not found";
	}

	return (
		<div className="grid grid-cols-[minmax(200px,500px)_minmax(300px,1fr)] bg-stone-100 h-screen">
			<aside className="border-r overflow-y-auto p-4 bg-white">
				<Suspense fallback="Loading">
					<RepoHeader repo={data.node.repo} />
				</Suspense>
				<Suspense>
					<Contributors repo={data.node.repo} />
				</Suspense>
				<h2 className="mt-4 text-2xl">Issues</h2>
			</aside>
		</div>
	);
}

const repoHeaderFragment = graphql`
    fragment repoHeaderFragment on Repository {
        id
        nameWithOwner
        shortDescriptionHTML
        stargazerCount
        owner {
            id
            login
            avatarUrl
        }
    }
`;

function RepoHeader(props: { repo: repoHeaderFragment$key }) {
	const repo = useFragment(repoHeaderFragment, props.repo);

	return (
		<>
			<div className="grid grid-cols-[--spacing(20)_1fr] gap-x-4">
				<img
					src={repo.owner.avatarUrl}
					alt={`${repo.owner.login}'s avatar`}
					className="row-1 col-1 rounded-xl border-2 border-stone-300 w-full h-full object-cover"
				/>
				<div className="self-center">
					<h1 className="text-3xl text-indigo-800 hover:underline h-fit">
						<a
							href={`https://github.com/${repo.nameWithOwner}`}
							target="_blank"
						>
							{repo.nameWithOwner}
						</a>
					</h1>
					<div className="flex gap-1 items-center align-self-top mt-1">
						<Star fill="orange" stroke="orange" />
						{new Intl.NumberFormat().format(repo.stargazerCount)}
					</div>
				</div>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: repo.shortDescriptionHTML }}
				className="col-span-2 text-stone-500 mt-2"
			/>
		</>
	);
}

const repoContributorsFragment = graphql`
    # Okay, this is weird. GitHub says that "You do not have permission to view repository collaborators"
    # on repositories that you don't own. Huh. This should be a publicly accessible information, it is
    # on the GitHub website itself. I don't think there is an another field that gives us the desired
    # information. So for the most repositories, this block will be empty.
    fragment repoContributorsFragment on Repository {
        # In theory, this could only be null on an internal server error or a failed permission check.
        # Yet, GitHub's schema doesn't implement the somewhat new @semanticNonNull,
        # which would've allowed us to @throwOnFieldError to make the field non-nullable.
        collaborators(first: 19) {
            totalCount
            nodes {
                id
                ...repoContributorCircleFragment
            }
        }
    }
`;

function Contributors(props: { repo: repoContributorsFragment$key }) {
	const { collaborators } = useFragment(repoContributorsFragment, props.repo);

	if (!collaborators) return null;
	const effectiveContributors = collaborators.nodes?.filter((node) => !!node);
	if (!effectiveContributors || effectiveContributors.length === 0) {
		// Silently skip rendering contributors if there are none.
		return null;
	}

	return (
		<>
			<h2 className="mt-4 text-2xl">Contributors</h2>
			<div className="grid grid-cols-10 gap-4 mt-2">
				{effectiveContributors.map((contributor) => (
					<ContributorCircle key={contributor.id} user={contributor} />
				))}
				{collaborators.totalCount > effectiveContributors.length && (
					<div className="bg-indigo-600 text-white font-bold rounded-full flex text-sm items-center justify-center">
						+{collaborators.totalCount - effectiveContributors.length}
					</div>
				)}
			</div>
		</>
	);
}

const repoContributorCircleFragment = graphql`
    fragment repoContributorCircleFragment on User {
        login
        name
        avatarUrl
    }
`;

function ContributorCircle({
	user,
}: { user: repoContributorCircleFragment$key }) {
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
		>
			<img
				src={avatarUrl}
				alt={`${login}'s avatar`}
				className="w-full rounded-full"
			/>
		</a>
	);
}
