import DateTag from "@/components/DateTag";
import Comment, { CommentSkeleton } from "@/components/issue-discussion/Comment";
import CommentList from "@/components/issue-discussion/CommentList";
import DiscussionHeader from "@/components/issue-discussion/DiscussionHeader";
import LabelList from "@/components/repo-sidebar/LabelList";
import type { DiscussionQuery } from "@/utils/relay/__generated__/DiscussionQuery.graphql";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  loadQuery,
  usePreloadedQuery,
} from "react-relay";
import { graphql } from "relay-runtime";

// The pathless segment of _discussion is there to adapt to relay's naming convention
// while having a more sensible query name of DiscussionQuery, instead of IssueIDQuery.
//
// _What does it mean to have a "IssueIDQuery"?. Do we query FOR the issue ID?_
export const Route = createFileRoute("/repo/$repositoryID/_discussion/$issueID")({
  component: RouteComponent,
  loader({ context, params }) {
    return loadQuery<DiscussionQuery>(context.relayEnvironment, DiscussionQuery, {
      issueID: params.issueID,
    });
  },
});

const DiscussionQuery = graphql`
  query DiscussionQuery($issueID: ID!) {
    node(id: $issueID) {
      ... on Issue @alias(as: "issue") {
        id
        createdAt
        ...DiscussionHeaderFragment
        ...CommentFragment
        ...LabelListFragment
        ...CommentListFragment
      }
    }
  }
`;

function RouteComponent() {
  const queryRef = Route.useLoaderData();
  const data = usePreloadedQuery<DiscussionQuery>(DiscussionQuery, queryRef);

  if (!data.node?.issue) return "Issue not found";

  return (
    <main className="overflow-y-auto max-h-screen">
      <DiscussionHeader issue={data.node.issue} />
      <div className="p-8 max-w-4xl mx-auto">
        <DateTag date={new Date(data.node.issue.createdAt)} />
        <LabelList issue={data.node.issue} className="mt-2" />
        <Suspense fallback={<CommentSkeleton />}>
          <Comment comment={data.node.issue} />
          <CommentList issue={data.node.issue} />
        </Suspense>
      </div>
    </main>
  );
}

