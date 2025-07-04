import type { CommentFragment$key } from "@/utils/relay/__generated__/CommentFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DateTag from "../DateTag";
import Author, { AuthorSkeleton } from "./Author";

// Includes a couple of fixes to the GitHub formatted body HTML
import "./body-format.css";
import "./syntax-highlight-one-dark.css";

const CommentFragment = graphql`
  fragment CommentFragment on Comment {
    id
    author {
      ...AuthorFragment
    }
    bodyHTML
    createdAt
    lastEditedAt
  }
`;

export default function Comment(props: { comment: CommentFragment$key }) {
  const comment = useFragment(CommentFragment, props.comment);

  return (
    <div className="p-4 bg-white rounded-lg mt-4">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        {comment.author && <Author actor={comment.author} />}
        {comment.lastEditedAt && (
          <div className="text-sm text-stone-500">(edited)</div>
        )}
      </div>
      <div
        className="mt-4 prose github-comment-body"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: I trust GitHub to sanitize issue bodies
        dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
      />
      <DateTag prefix="" date={new Date(comment.createdAt)} className="mt-4" />
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="p-4 bg-white rounded-lg mt-4">
      <div className="animate-pulse">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <AuthorSkeleton />
        </div>
        <div className="prose">
          <div className="mt-4 h-6 w-48 bg-stone-200 rounded-md" />
          <p className="mt-4">
            <div className="h-6 w-[100%] bg-stone-200 rounded-md mb-2" />
            <div className="h-6 w-[85%] bg-stone-200 rounded-md mb-2" />
            <div className="h-6 w-[90%] bg-stone-200 rounded-md mb-2" />
          </p>
          <p className="mt-4">
            <div className="h-6 w-[95%] bg-stone-200 rounded-md mb-2" />
            <div className="h-6 w-[100%] bg-stone-200 rounded-md mb-2" />
            <div className="h-6 w-[50%] bg-stone-200 rounded-md mb-2" />
          </p>
          <div className="h-5 w-64 bg-stone-200 rounded-md mt-4" />
        </div>
      </div>
    </div>
  );
}
