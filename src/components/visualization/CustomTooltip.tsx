"use client";

import { useEffect, useState } from "react";
import { getChartColors } from "@/lib/chart/chart-theme";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
  }>;
  label?: string;
}

export default function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const themeColors = getChartColors(isDark);

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: themeColors.tooltip,
        border: `1px solid ${themeColors.grid}`,
        borderRadius: "6px",
        padding: "8px 12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {label && (
        <p
          style={{
            margin: "0 0 4px 0",
            fontWeight: 600,
            fontSize: "14px",
            color: themeColors.text,
          }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <p
          key={`item-${index}`}
          style={{
            margin: "2px 0",
            fontSize: "13px",
            color: themeColors.text,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: entry.color,
              marginRight: "6px",
              borderRadius: "2px",
            }}
          />
          <span style={{ fontWeight: 500 }}>{entry.name}:</span>{" "}
          <span>{entry.value}</span>
        </p>
      ))}
    </div>
  );
}
