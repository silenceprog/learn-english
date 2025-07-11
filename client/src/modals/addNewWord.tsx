"use client";
import { useAddWordModal } from "@/states/modals/useAddWordModal";
import { Button } from "@/shared/ui/Button";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";

export default function AddNewWord() {
  const { isOpen, setIsOpen } = useAddWordModal();
  const [form, setForm] = useState({
    word: "",
    translate: "",
    meaning: "",
    example: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const addWord = async () => {
    const accessToken = localStorage.getItem("accessToken");
    fetch("https://learn-english-6ufl.onrender.com/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: form.word,
        translate: [form.translate],
        meaning: [form.meaning],
        example: form.example,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .catch((error) => console.error("Error:", error));
  };
  return (
    <div>
      {isOpen && (
        <div className="absolute z-50 bg-black/60 inset-0 items-center flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 h-1/3">
            <div className="flex justify-between">
              <div className="font-semibold text-xl">Добавить новое слово</div>
              <div>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  color="white"
                >
                  <IoIosCloseCircleOutline className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 pb-2">
              Заполните информацию о слове, которое хотите добавить в словарь.
            </p>
            <form>
              <div className="flex justify-between items-center py-2">
                <label className="block text-sm font-medium w-1/5 text-right px-3">
                  Слово
                </label>
                <input
                  type="text"
                  name="word"
                  value={form.word}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <label className="block text-sm font-medium w-1/5 text-right px-3">
                  Перевод
                </label>
                <input
                  type="text"
                  name="translate"
                  value={form.translate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <label className="block text-sm font-medium w-1/5 text-right px-3">
                  Значение
                </label>
                <input
                  type="text"
                  name="meaning"
                  value={form.meaning}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <label className="block text-sm font-medium w-1/5 text-right px-3">
                  Пример
                </label>
                <input
                  type="text"
                  name="example"
                  value={form.example}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <div>
                  <Button color="outline" onClick={() => setIsOpen(false)}>
                    Отмена
                  </Button>
                </div>
                <div>
                  <Button type="button" onClick={() => addWord()}>
                    Добавить
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
