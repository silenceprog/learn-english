import { create } from "zustand";

type States = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};
export const useStates = create<States>()((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (state) => set({ isLoggedIn: state }),
}));
