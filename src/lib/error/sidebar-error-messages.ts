export interface ErrorSuggestion {
  title: string;
  suggestion: string;
  icon: string;
}

export function getErrorSuggestion(error: string): ErrorSuggestion {
  const errorLower = error.toLowerCase();

  if (errorLower.includes("network") || errorLower.includes("fetch")) {
    return {
      title: "네트워크 오류",
      suggestion: "인터넷 연결을 확인하고 다시 시도해주세요.",
      icon: "globe",
    };
  }

  if (errorLower.includes("permission") || errorLower.includes("denied")) {
    return {
      title: "권한 오류",
      suggestion: "브라우저 권한을 확인하고 페이지를 새로고침해주세요.",
      icon: "lockKeyhole",
    };
  }

  if (errorLower.includes("timeout")) {
    return {
      title: "시간 초과",
      suggestion: "서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
      icon: "alarmClock",
    };
  }

  if (errorLower.includes("memory") || errorLower.includes("out of")) {
    return {
      title: "메모리 부족",
      suggestion: "브라우저 탭을 일부 닫고 다시 시도해주세요.",
      icon: "save",
    };
  }

  if (errorLower.includes("sql") || errorLower.includes("database")) {
    return {
      title: "데이터베이스 오류",
      suggestion: "SQL Query Builder를 다시 시작해주세요.",
      icon: "database",
    };
  }

  return {
    title: "알 수 없는 오류",
    suggestion: "문제가 지속되면 브라우저를 새로고침해주세요.",
    icon: "triangleAlert",
  };
}
