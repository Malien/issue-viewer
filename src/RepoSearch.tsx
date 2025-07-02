import { useDeferredValue, useMemo, useState } from "react";
import {
	CommandDialog,
	CommandInput,
	CommandItem,
	CommandList,
} from "./components/ui/command";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import type { RepoSearchQuery } from "./utils/relay/__generated__/RepoSearchQuery.graphql";
import debounce from "./lib/debounce";
import { cn } from "./lib/utils";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { RepoSearchResultFragment$key } from "./utils/relay/__generated__/RepoSearchResultFragment.graphql";

export default function RepoSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSetSearchQuery = useMemo(
		() => debounce(setSearchQuery, 300),
		[],
	);
	const query = useDeferredValue(searchQuery);
	const router = useRouter();

	function handleSearchChange(newQuery: string) {
		// Preload JS right when user intents to search
		router.loadRouteChunk(router.routesByPath["/repo/$repositoryID"]);

		if (newQuery === "") {
			// Skip the delay, and clear the search query immediately
			debouncedSetSearchQuery.clear();
			setSearchQuery("");
		} else debouncedSetSearchQuery(newQuery);
	}

	return (
		<CommandDialog open showCloseButton={false} shouldFilter={false}>
			<CommandInput
				placeholder="Search for the GitHub repository..."
				onValueChange={handleSearchChange}
				loading={query !== searchQuery}
			/>
			{query && <SearchResults query={query} filterQuery={searchQuery} />}
		</CommandDialog>
	);
}

const RepoSearchQuery = graphql`
    query RepoSearchQuery($query: String!) {
        search(query: $query, type: REPOSITORY, first: 10) {
            edges {
                node {
                    ... on Repository @alias(as: "repo") {
                        id
                        ...RepoSearchResultFragment
                    }
                }
            }
        }
    }
`;

function SearchResults({
	query,
	filterQuery,
}: { query: string; filterQuery?: string }) {
	const data = useLazyLoadQuery<RepoSearchQuery>(RepoSearchQuery, { query });

	return (
		<CommandList className={cn("p-2", query !== filterQuery && "opacity-50")}>
			{data.search.edges
				?.map((edge) => edge?.node?.repo)
				.filter(isNotNullish)
				.map((repo) => (
					<RepoSearchResult key={repo.id} repo={repo} />
				))}
		</CommandList>
	);
}

const RepoSearchResultFragment = graphql`
    fragment RepoSearchResultFragment on Repository {
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

function RepoSearchResult(props: { repo: RepoSearchResultFragment$key }) {
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
				})
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
				<div
					dangerouslySetInnerHTML={{ __html: repo.shortDescriptionHTML }}
					className="row-2 col-span-3"
				/>
			</Link>
		</CommandItem>
	);
}

function isNotNullish<T>(value: T | null | undefined): value is T {
	// Yes, a double equals, not tripple
	return value != null;
}
