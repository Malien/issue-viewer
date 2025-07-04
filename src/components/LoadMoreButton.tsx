import type { ComponentProps } from "react";

export default function LoadMoreButton({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className="text-blue-600 rounded-md px-4 py-2 mb-4 text-center w-full cursor-pointer border mt-4 mb-12 mx-auto max-w-sm block hover:bg-stone-100 disabled:opacity-50 disabled:cursor-wait"
      {...props}
    >
      Load more
    </button>
  );
}
