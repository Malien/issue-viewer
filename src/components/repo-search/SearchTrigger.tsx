import cn from "@/utils/cn";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import RepoSearchDialog from "./RepoSearchDialog";

export default function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <RepoSearchDialog
        open={open}
        onOpenChange={setOpen}
        showCloseButton
        onSelect={() => setOpen(false)}
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "border border-stone-400 rounded-sm grid grid-cols-[--spacing(6)_1fr_auto] gap-2 px-2 py-1 max-w-60 w-full items-center cursor-pointer hover:bg-stone-100",
          className,
        )}
      >
        <SearchIcon className="text-stone-400 w-full" />
        <div className="text-start text-stone-600">Find a repository...</div>
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none my-1">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    </>
  );
}
