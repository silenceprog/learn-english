import { create } from "zustand/react";

type State = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  id: number;
  setId: (id: number) => void;
};
export const useDeleteModal = create<State>()((set) => ({
  isOpen: false,
  id: 0,
  setId: (id) => set({ id: id }),
  setIsOpen: (state) => set({ isOpen: state }),
}));
