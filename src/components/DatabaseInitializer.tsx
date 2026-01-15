"use client";

import { useEffect } from "react";
import { useQueryStore } from "@/store/query-store";

/**
 * 데이터베이스 자동 초기화 컴포넌트
 */
export default function DatabaseInitializer() {
  const initDB = useQueryStore((state) => state.initDB);
  const isDbInitialized = useQueryStore((state) => state.isDbInitialized);

  useEffect(() => {
    if (!isDbInitialized) {
      console.log("앱 시작: DB 자동 초기화");
      initDB();
    }
  }, [initDB, isDbInitialized]);

  return null;
}
