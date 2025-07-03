import type { IssueListFragment$key } from "@/utils/relay/__generated__/IssueListFragment.graphql";
import { useFragment } from "react-relay";
import { Fragment } from "react/jsx-runtime";
import { graphql } from "relay-runtime";
import Issue from "./Issue";

const IssueListFragment = graphql`
  fragment IssueListFragment on Repository {
    issues(last: 10) @required(action: THROW) {
      edges @required(action: THROW) {
        node @required(action: THROW) {
          id
          ...IssueFragment
        }
      }
    }
  }
`;

export default function IssueList(props: { repo: IssueListFragment$key }) {
  const repo = useFragment(IssueListFragment, props.repo);

  const issues = repo.issues.edges
    .filter((edge) => !!edge)
    .map((edge) => edge.node);

  return (
    <>
      <h2 className="mt-4 text-2xl px-4">Issues</h2>
      {issues.map((issue) => (
        <Fragment key={issue.id}>
          <Issue key={issue.id} issue={issue} />
          <div className="w-[calc(100%---spacing(4))] h-px bg-slate-200 ms-4 last-of-type:hidden" />
        </Fragment>
      ))}
    </>
  );
}
