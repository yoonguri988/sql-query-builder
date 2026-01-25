import { useEffect, useState } from "react";

/**
 * 다크모드 상태를 감지하는 커스텀 훅
 * document.documentElement의 'dark' 클래스 변화를 감지
 *
 * @returns {boolean} 현재 다크모드 여부
 */
export function useDarkMode(): boolean {
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

  return isDark;
}
