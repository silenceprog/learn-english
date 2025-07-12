import { create } from "zustand";

type State = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const useAddWordModal = create<State>()((set) => ({
  isOpen: false,
  setIsOpen: (state) => set({ isOpen: state }),
}));
