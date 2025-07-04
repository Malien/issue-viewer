import cn from "@/utils/cn";
import type { IssueFragment$key } from "@/utils/relay/__generated__/IssueFragment.graphql";
import { Link } from "@tanstack/react-router";
import { CircleDot } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import DateTag from "../DateTag";
import LabelList from "./LabelList";
import IssueTitle from "../IssueTitle";

const IssueFragment = graphql`
  fragment IssueFragment on Issue {
    id
    number
    createdAt
    closed
    ...LabelListFragment
    ...IssueTitleFragment
  }
`;

export default function Issue(props: { issue: IssueFragment$key }) {
  const issue = useFragment(IssueFragment, props.issue);

  return (
    <Link
      from="/repo/$repositoryID"
      to="$issueID"
      params={{ issueID: issue.id }}
      activeProps={{ className: "bg-stone-100" }}
      className="grid grid-cols-[--spacing(6)_auto_1fr] gap-x-1 gap-y-2 p-4 hover:bg-stone-100 cursor-pointer"
    >
      <CircleDot
        className={cn(
          "w-full",
          issue.closed ? "text-red-500" : "text-green-500",
        )}
      />
      <div>#{issue.number}</div>
      <h3>
        <IssueTitle issue={issue} />
      </h3>
      <LabelList issue={issue} className="col-span-3" />
      <DateTag date={new Date(issue.createdAt)} className="col-span-3" />
    </Link>
  );
}
