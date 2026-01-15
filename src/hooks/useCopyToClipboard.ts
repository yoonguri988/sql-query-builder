import { useState } from "react";

/**
 * 클립보드 복사 Hook
 *
 * @returns {Object}
 *  - isCopied: 복사 상태 (2초 후 자동 false)
 *  - copyToClipboard: 복사 함수
 *
 * @example
 * const { isCopied, copyToClipboard } = useCopyToClipboard();
 * await copyToClipboard('SELECT * FROM users');
 */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Clipboard API 사용 (최신 브라우저)
      await navigator.clipboard.writeText(text);

      // 복사 성공 상태 설정
      setIsCopied(true);

      // 2초 후 상태 초기화
      setTimeout(() => setIsCopied(false), 2000);

      return true;
    } catch (error) {
      console.error("클립보드 복사 실패:", error);

      // 폴백: execCommand 사용 (구형 브라우저 지원)
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (success) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          return true;
        }
      } catch (fallbackError) {
        console.error("폴백 복사도 실패:", fallbackError);
      }

      return false;
    }
  };

  return { isCopied, copyToClipboard };
}
