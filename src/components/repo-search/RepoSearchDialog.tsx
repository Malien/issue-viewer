import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import cn from "@/utils/cn";
import debounce from "@/utils/debounce";
import type { RepoSearchDialogQuery } from "@/utils/relay/__generated__/RepoSearchDialogQuery.graphql";
import { useRouter } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import RepoSearchResult from "./RepoSearchResult";

type Props = {
  open?: boolean;
  showCloseButton?: boolean;
  onOpenChange?(open: boolean): void;
  onSelect?(): void;
};

export default function RepoSearchDialog({
  onSelect,
  showCloseButton,
  open,
  onOpenChange,
}: Props) {
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
    <CommandDialog shouldFilter={false} open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for the GitHub repository..."
        onValueChange={handleSearchChange}
        loading={query !== searchQuery}
        showCloseButton={showCloseButton}
      />
      {query && (
        <SearchResults
          query={query}
          filterQuery={searchQuery}
          onSelect={onSelect}
        />
      )}
    </CommandDialog>
  );
}

const RepoSearchDialogQuery = graphql`
  query RepoSearchDialogQuery($query: String!) {
    # Let's skip paginating over the search results as it is not strictly required for now.
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

type SearchResultsProps = {
  query: string;
  filterQuery?: string;
  onSelect?(): void;
};

function SearchResults({ query, filterQuery, onSelect }: SearchResultsProps) {
  const data = useLazyLoadQuery<RepoSearchDialogQuery>(RepoSearchDialogQuery, {
    query,
  });

  return (
    <CommandList className={cn("p-2", query !== filterQuery && "opacity-50")}>
      {data.search.edges
        ?.map((edge) => edge?.node?.repo)
        .filter(isNotNullish)
        .map((repo) => (
          <RepoSearchResult key={repo.id} repo={repo} onSelect={onSelect} />
        ))}
    </CommandList>
  );
}

function isNotNullish<T>(value: T | null | undefined): value is T {
  // Yes, a double equals, not tripple to check for both null and undefined, and not for truthiness.
  return value != null;
}
