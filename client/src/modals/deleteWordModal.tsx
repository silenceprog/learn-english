"use client";
import { useDeleteModal } from "@/states/modals/useDeleteModal";
import { Button } from "@/shared/ui/Button";
import { useAlertStore } from "@/states/alertStore";
import { useDictionaryStore } from "@/states/requests/useGetDictionaryWords";

export default function DeleteWordModal() {
  const { isOpen, setIsOpen, id } = useDeleteModal();
  const { addAlert } = useAlertStore();
  const { fetchWords } = useDictionaryStore();

  async function deleteWord(id: number) {
    try {
      const response = await fetch(
        `https://learn-english-6ufl.onrender.com/api/words/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Помилка $response.status`;
        throw new Error(errorMessage);
      }

      addAlert("Слово видалено успішно", "success");
      fetchWords();
    } catch (err) {
      if (err instanceof Error) {
        addAlert(err.message, "error");
      } else {
        addAlert("Something went wrong", "error");
      }
    }
  }
  return (
    <div>
      {isOpen && (
        <div className="absolute z-50 bg-black/60 inset-0 items-center flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <div className="flex justify-between">
              <div className="font-semibold text-lg">
                Ви впевнені що хочете видалити дане слово?
              </div>
            </div>
            <div className="flex justify-between py-5">
              <Button
                color="outline"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-800 cursor-pointer"
                onClick={() => {
                  deleteWord(id);
                  setIsOpen(false);
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
