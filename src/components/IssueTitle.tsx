import type { IssueTitleFragment$key } from "@/utils/relay/__generated__/IssueTitleFragment.graphql";
import type { ComponentProps } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const IssueTitleFragment = graphql`
  fragment IssueTitleFragment on Issue {
    titleHTML
  }
`;

type Props = Omit<
  ComponentProps<"span">,
  "children" | "dangerouslySetInnerHTML"
> & {
  issue: IssueTitleFragment$key;
};

export default function IssueTitle({ issue, ...props }: Props) {
  const { titleHTML } = useFragment(IssueTitleFragment, issue);

  return (
    <span
      {...props}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: I trust GitHub to sanitize formatted titles
      dangerouslySetInnerHTML={{ __html: titleHTML }}
    />
  );
}
