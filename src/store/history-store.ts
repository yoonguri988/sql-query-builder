import { create } from "zustand";
import { QueryHistoryItem } from "@/types/query";

interface HistoryStore {
  history: QueryHistoryItem[];
  maxHistorySize: number;

  // 액션
  addToHistory: (item: Omit<QueryHistoryItem, "id">) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  maxHistorySize: 50,

  addToHistory: (item) => {
    set((state) => {
      const newItem: QueryHistoryItem = {
        ...item,
        id: crypto.randomUUID(),
      };

      const updatedHistory = [newItem, ...state.history];

      // 최대 크기 제한
      if (updatedHistory.length > state.maxHistorySize) {
        updatedHistory.pop();
      }

      return { history: updatedHistory };
    });
  },

  clearHistory: () => {
    set({ history: [] });
  },

  removeHistoryItem: (id) => {
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    }));
  },
}));
