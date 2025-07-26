import { Button } from "@/shared/ui/Button";
import Link from "next/link";
import clsx from "clsx";

export default function CreateExercise({
  name,
  icon,
  text,
  href,
  difficulty,
}: {
  name: string;
  icon: React.ReactNode;
  text: string;
  href: string;
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-2xs border-2 border-blue-100 hover:border-blue-200 transition-colors">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg bg-blue-200 bg-opacity-10">{icon}</div>
          <div
            className={clsx(
              `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent`,
              difficulty === "Easy" && "bg-green-500",
              difficulty === "Medium" && "bg-yellow-500",
              difficulty === "Hard" && "bg-red-500",
            )}
          >
            {difficulty}
          </div>
        </div>
        <h3 className="tracking-tight text-xl font-bold text-blue-700">
          {name}
        </h3>
      </div>
      <div className="p-6 pt-0">
        <p className="text-muted-foreground mb-4">{text}</p>
        <Link href={href}>
          <Button className="w-full text-white">Start</Button>
        </Link>
      </div>
    </div>
  );
}
