import clsx from "clsx";

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx(className, "max-w-7xl mx-auto")}>{children}</div>;
}
