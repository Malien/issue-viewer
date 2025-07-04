import type { CommentListFragment$key } from "@/utils/relay/__generated__/CommentListFragment.graphql";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Comment from "./Comment";
import LoadMoreButton from "../LoadMoreButton";

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

  const items = page.data.comments?.edges
    ?.filter((edge) => !!edge)
    .map((edge) => edge.node)
    .filter((node) => !!node)
    .map((comment) => <Comment key={comment.id} comment={comment} />);

  return (
    <>
      {items}
      {page.hasNext && (
        <LoadMoreButton
          disabled={page.isLoadingNext}
          onClick={() => page.loadNext(5)}
        />
      )}
    </>
  );
}
