import { Button } from "@/shared/ui/Button";

export default function Pagination({
  page,
  nextPage,
  prevPage,
  prevDisabled,
  nextDisabled,
}: {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        color={prevDisabled ? "disabled" : "outlineBlue"}
        onClick={prevPage}
      >
        Prev
      </Button>
      <p className="px-4">{page}</p>
      <Button
        color={nextDisabled ? "disabled" : "outlineBlue"}
        onClick={nextPage}
      >
        Next
      </Button>
    </div>
  );
}
