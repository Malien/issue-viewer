import cn from "@/utils/cn";
import type { LabelListFragment$key } from "@/utils/relay/__generated__/LabelListFragment.graphql";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const LabelListFragment = graphql`
  fragment LabelListFragment on Issue {
    # We won't be paginating over the list of labels. If someone has more than 20, they are doing something weird.
    # Also, the UI cannot comfortably accommodate large sets of labels.
    labels(first: 20) @required(action: LOG) {
      totalCount
      nodes @required(action: LOG) {
        id
        name
        color
      }
    }
  }
`;

export default function LabelList(props: {
  issue: LabelListFragment$key;
  className?: string;
}) {
  const issue = useFragment(LabelListFragment, props.issue);
  if (!issue) return null;

  const effectiveLabels = issue.labels.nodes.filter((label) => !!label);
  if (effectiveLabels.length === 0) return null;

  return (
    <div className={cn("flex gap-2 flex-wrap empty:hidden", props.className)}>
      {effectiveLabels.map((label) => (
        <Label key={label.id} name={label.name} color={label.color} />
      ))}
      {issue.labels.totalCount > effectiveLabels.length && "...and more"}
    </div>
  );
}

function Label({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{ "--label-color": `#${color}` }}
      className="text-(--label-color) bg-(--label-color)/20 border border-(--label-color) rounded-full px-4 py-1 text-sm saturate-300 brightness-70 whitespace-nowrap"
    >
      {name}
    </div>
  );
}
