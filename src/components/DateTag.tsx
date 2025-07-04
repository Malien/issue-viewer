import cn from "@/utils/cn";

type Props = {
  date: Date;
  className?: string;
  prefix?: string;
};

export default function DateTag({
  className,
  date,
  prefix = "Opened on",
}: Props) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <span className={cn("text-stone-500 text-sm", className)}>
      {prefix} {formatter.format(date)}
    </span>
  );
}
