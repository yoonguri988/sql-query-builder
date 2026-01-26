import { create } from "zustand";

interface UIState {
  activeRightPanelTab: "sql" | "results";
  setActiveRightPanelTab: (tab: "sql" | "results") => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeRightPanelTab: "sql",
  setActiveRightPanelTab: (tab) => set({ activeRightPanelTab: tab }),
}));
