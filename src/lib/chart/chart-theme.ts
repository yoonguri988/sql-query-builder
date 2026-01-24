export const CHART_COLORS = {
  light: {
    primary: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    secondary: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"],
    grid: "#e5e7eb",
    text: "#374151",
    tooltip: "#ffffff",
  },
  dark: {
    primary: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"],
    secondary: ["#93c5fd", "#6ee7b7", "#fcd34d", "#fca5a5", "#c4b5fd"],
    grid: "#374151",
    text: "#e5e7eb",
    tooltip: "#1f2937",
  },
};

export function getChartColors(isDark: boolean) {
  return isDark ? CHART_COLORS.dark : CHART_COLORS.light;
}
