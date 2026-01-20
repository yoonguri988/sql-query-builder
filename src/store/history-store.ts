import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QueryHistoryItem } from "@/types/query";

interface HistoryState {
  history: QueryHistoryItem[];
  addHistory: (item: Omit<QueryHistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
  getHistoryById: (id: string) => QueryHistoryItem | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addHistory: (item) => {
        const newItem: QueryHistoryItem = {
          ...item,
          id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set((state) => ({
          history: [newItem, ...state.history].slice(0, 50), // 최대 50개 유지
        }));
      },

      clearHistory: () => set({ history: [] }),

      removeHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      getHistoryById: (id) => {
        return get().history.find((item) => item.id === id);
      },
    }),
    {
      name: "query-history-storage",
    }
  )
);
