"use client";

import { useEffect, useState } from "react";
import { useDBStore } from "@/store/db-store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * 데이터베이스 자동 초기화 컴포넌트
 * 앱 시작 시 SQL.js를 로드하고 샘플 데이터로 데이터베이스를 초기화합니다
 */
export default function DatabaseInitializer() {
  const { isInitialized, error, initialize } = useDBStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isInitialized && mounted) {
        console.log("앱 시작: 데이터베이스 초기화 중...");
        try {
          await initialize();
          if (mounted) {
            console.log("데이터베이스 초기화 완료");
          }
        } catch (err) {
          console.error("데이터베이스 초기화 실패:", err);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [isInitialized, initialize]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            데이터베이스 초기화 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-md w-full mx-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">데이터베이스 초기화 실패</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">페이지를 새로고침해주세요.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // 성공 - 아무것도 렌더링하지 않음
  return null;
}
