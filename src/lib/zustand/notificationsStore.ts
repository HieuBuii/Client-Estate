import { create } from "zustand";
import { getNumberNewChat } from "../../apis/user.api";

interface INotiState {
  numbers: number;
}

interface INotiActions {
  fetchNumberOfNewChat: () => Promise<void>;
  decrease: () => void;
  reset: () => void;
}

export const useNotificationsStore = create<INotiState & INotiActions>(
  (set) => ({
    numbers: 0,
    fetchNumberOfNewChat: async () => {
      const res = await getNumberNewChat();
      set((state) => ({ ...state, numbers: res.data?.newChat }));
    },
    decrease: () =>
      set((state) => ({
        ...state,
        numbers: state.numbers - 1 > 0 ? state.numbers - 1 : 0,
      })),
    reset: () => set((state) => ({ ...state, numbers: 0 })),
  })
);
