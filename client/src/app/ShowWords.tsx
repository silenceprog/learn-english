import { ShowWord } from "@/app/ShowWord";
import { useDictionaryStore } from "@/states/requests/useGetDictionaryWords";

export function ShowWords() {
  const { words } = useDictionaryStore();
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {words?.map((word, i) => <ShowWord key={i} word={word} />)}
    </div>
  );
}
