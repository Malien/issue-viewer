import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Comment from "./Comment";
import type { CommentListFragment$key } from "@/utils/relay/__generated__/CommentListFragment.graphql";

const CommentListFragment = graphql`
  fragment CommentListFragment on Issue
    @argumentDefinitions(
      count: { type: "Int", defaultValue: 5 }
      cursor: { type: "String" }
    )
    @refetchable(queryName: "CommentListPaginationQuery")
  {
    comments(first: $count, after: $cursor) 
      @connection(key: "CommentListFragment_comments") 
    {
      edges {
        node {
          id
          ...CommentFragment
        }
      }
    }
  }
`;

export default function CommentList(props: { issue: CommentListFragment$key }) {
  const page = usePaginationFragment(CommentListFragment, props.issue);

  const items =
    page.data.comments?.edges
      ?.filter((edge) => !!edge)
      .map((edge) => edge.node)
      .filter((node) => !!node)
      .map((comment) => <Comment key={comment.id} comment={comment} />) || null;

  return (
    <>
      {items}
      {page.hasNext && (
        <button
          className="text-blue-600 rounded-md px-4 py-2 mb-4 text-center w-full bg-white cursor-pointer border mt-4 mb-12 mx-auto max-w-sm block hover:bg-stone-100 disabled:opacity-50 disabled:cursor-wait"
          disabled={page.isLoadingNext}
          onClick={() => page.loadNext(5)}
        >
          Load more comments
        </button>
      )}
    </>
  );
}
