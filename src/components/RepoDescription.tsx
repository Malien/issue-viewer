import type { RepoDescriptionFragment$key } from "@/utils/relay/__generated__/RepoDescriptionFragment.graphql";
import type { ComponentProps } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const RepoDescriptionFragment = graphql`
  fragment RepoDescriptionFragment on Repository {
    shortDescriptionHTML
  }
`;

type Props = Omit<ComponentProps<"div">, "children"> & {
  repo: RepoDescriptionFragment$key;
};

export default function RepoDescription({ repo, ...props }: Props) {
  const { shortDescriptionHTML } = useFragment(RepoDescriptionFragment, repo);

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust GitHub to sanitize the HTML
      dangerouslySetInnerHTML={{ __html: shortDescriptionHTML }}
      {...props}
    />
  );
}
