import type { IssueFragment$key } from "@/utils/relay/__generated__/IssueFragment.graphql";
import { useRouter } from "@tanstack/react-router";
import { CircleDot } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import LabelList from "./LabelList";

const IssueFragment = graphql`
  fragment IssueFragment on Issue {
    id
    number
    titleHTML
    createdAt
    closed
    ...LabelListFragment
  }
`;

export default function Issue(props: { issue: IssueFragment$key }) {
  const issue = useFragment(IssueFragment, props.issue);
  const router = useRouter();
  const { Link } = router.routesByPath["/repo/$repositoryID"];

  return (
    <Link
      to="./$issueID"
      params={{ issueID: issue.id }}
      className="grid grid-cols-[--spacing(6)_auto_1fr] gap-x-1 gap-y-2 p-4 hover:bg-stone-100 cursor-pointer"
    >
      <CircleDot className={issue.closed ? "text-red-500" : "text-green-500"} />
      <div>#{issue.number}</div>
      <h3
        // biome-ignore lint/security/noDangerouslySetInnerHtml: I trust GitHub to sanitize formatted titles
        dangerouslySetInnerHTML={{ __html: issue.titleHTML }}
      />
      <LabelList issue={issue} className="col-span-3" />
    </Link>
  );
}
