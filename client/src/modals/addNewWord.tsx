"use client";
import { useAddWordModal } from "@/states/modals/useAddWordModal";
import { Button } from "@/shared/ui/Button";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useGetSuggestions } from "@/states/requests/useGetSuggestions";
import { Loader2 } from "lucide-react";
import { useAlertStore } from "@/states/alertStore";
import { useDictionaryStore } from "@/states/requests/useGetDictionaryWords";

export default function AddNewWord() {
  const { isOpen, setIsOpen } = useAddWordModal();
  const { addAlert } = useAlertStore();
  const { fetchWords } = useDictionaryStore();
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [form, setForm] = useState({
    word: "",
    translate: "",
    meaning: "",
    example: "",
  });
  function clearData() {
    form.word = "";
    form.translate = "";
    form.meaning = "";
    form.example = "";
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const suggestionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuppressSuggestions(false);
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const addWord = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    interface Payload {
      text: string;
      translate: string[];
      definitions?: string[];
      examples?: string[];
    }
    const payload: Payload = {
      text: form.word,
      translate: [form.translate],
    };

    if (form.meaning.trim() !== "") {
      payload.definitions = [form.meaning];
    }

    if (form.example.trim() !== "") {
      payload.examples = [form.example];
    }
    fetch("https://learn-english-6ufl.onrender.com/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        addAlert("Word added successfully", "success");
        fetchWords();
        console.log("Response:", data);
        clearData();
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        addAlert("Something went wrong. Please try again later.", "error");
        setIsLoading(false);
      });
  };

  const { setInputtedChars, suggestions, clearSuggestions } =
    useGetSuggestions();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (suppressSuggestions) {
      setSuppressSuggestions(false); // скидаємо прапорець
      return;
    }
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (form.word.length > 2) {
      debounceTimeout.current = setTimeout(() => {
        setInputtedChars(form.word);
      }, 300);
    } else {
      clearSuggestions(); // якщо менше 3 літер — очистити підказки
    }

    // Очищення при анмаунті
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [form.word]);
  return (
    <div>
      {isOpen && (
        <div className="absolute z-50 bg-black/60 inset-0 items-center flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 h-1/3">
            <div className="flex justify-between">
              <div className="font-semibold text-xl">Добавить новое слово</div>
              <div>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    clearData();
                  }}
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
            <div className="flex justify-between items-center py-2">
              <label className="block text-sm font-medium w-1/5 text-right px-3">
                Слово
              </label>
              <div className="relative w-full" ref={suggestionsRef}>
                <input
                  type="text"
                  name="word"
                  value={form.word}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50 max-h-40 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setForm((prevForm) => ({
                            ...prevForm,
                            word: s,
                          }));
                          setSuppressSuggestions(true);
                          clearSuggestions();
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                placeholder={"опціонально"}
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
                placeholder={"опціонально"}
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
                <Button
                  type="button"
                  onClick={() => addWord()}
                  color={
                    form.word === ""
                      ? "disabled"
                      : form.translate === ""
                        ? "disabled"
                        : "outlineBlue"
                  }
                  disabled={form.word === "" ? true : form.translate === ""}
                  className="flex flex-row justify-center items-center"
                >
                  Добавить
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 ml-2" />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
