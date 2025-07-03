import RepoSearchDialog from "@/components/repo-search/RepoSearchDialog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <RepoSearchDialog open />;
}
