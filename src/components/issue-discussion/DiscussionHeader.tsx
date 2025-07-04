import type { DiscussionHeaderFragment$key } from "@/utils/relay/__generated__/DiscussionHeaderFragment.graphql";
import type { DiscussionHeaderLinkFragment$key } from "@/utils/relay/__generated__/DiscussionHeaderLinkFragment.graphql";
import { CircleDot } from "lucide-react";
import { Suspense } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import IssueTitle from "../IssueTitle";
import SearchTrigger from "../repo-search/SearchTrigger";
// Includes a couple of fixes to the GitHub formatted body HTML
import "./body-format.css";
import "./syntax-highlight-one-dark.css";

// We should be able to render the header with just the data from the IssueFragment.
const DiscussionHeaderFragment = graphql`
  fragment DiscussionHeaderFragment on Issue {
    number
    closed
    ...DiscussionHeaderLinkFragment
    ...IssueTitleFragment
  }
`;

export default function DiscussionHeader(props: {
  issue: DiscussionHeaderFragment$key;
}) {
  const issue = useFragment(DiscussionHeaderFragment, props.issue);

  return (
    <header className="bg-white border-b p-4 sticky top-0 flex justify-between gap-2 z-10">
      <div className="flex gap-2">
        <StateTag closed={issue.closed} />
        <h1 className="text-2xl font-bold overflow-hidden text-ellipsis">
          <IssueTitle issue={issue} />{" "}
          {/* We aren't likely to have the Issue.url available from the      */}
          {/* previous navigation (list of issues). We can show a non-link   */}
          {/* placeholder, and silently swap it with the working link, when  */}
          {/* we get the entire discussion payload.                          */}
          {/* It would be a non-visual change.                               */}
          <Suspense
            fallback={<span className="text-stone-500">#{issue.number}</span>}
          >
            <IssueLink issue={issue} />
          </Suspense>
        </h1>
      </div>
      <SearchTrigger className="h-fit" closable />
    </header>
  );
}

const DiscussionHeaderLinkFragment = graphql`
  fragment DiscussionHeaderLinkFragment on Issue {
    url
    number
  }
`;

function IssueLink({ issue }: { issue: DiscussionHeaderLinkFragment$key }) {
  const { url, number } = useFragment(DiscussionHeaderLinkFragment, issue);

  return (
    <a
      href={url}
      className="text-stone-500 hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      #{number}
    </a>
  );
}

function StateTag({ closed }: { closed: boolean }) {
  console.debug("StateTag", { closed });
  const color = closed
    ? "bg-red-200 text-red-800"
    : "bg-green-200 text-green-800";
  const statusText = closed ? "Closed" : "Open";

  return (
    <div
      className={`${color} p-1.5 rounded-full flex h-fit gap-1 items-center font-bold pe-3`}
    >
      <CircleDot className="w-6" />
      {statusText}
    </div>
  );
}
