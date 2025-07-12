import { Button } from "@/shared/ui/Button";
import { useAddWordModal } from "@/states/modals/useAddWordModal";

export default function CreateWordButton() {
  const { setIsOpen } = useAddWordModal();
  return (
    <Button
      color="outline"
      className="ml-5 border-green-500 font-bold"
      onClick={() => setIsOpen(true)}
    >
      +
    </Button>
  );
}
