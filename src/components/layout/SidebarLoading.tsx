import { Loader2 } from "lucide-react";
import SidebarSkeleton from "./SidebarSkeleton";

interface SidebarLoadingProps {
  variant?: "spinner" | "skeleton";
}

export default function SidebarLoading({
  variant = "spinner",
}: SidebarLoadingProps) {
  if (variant === "skeleton") return <SidebarSkeleton />;
  return (
    <aside className="w-full md:w-64 lg:w-[200px] xl:w-[300px] border-r border-border bg-background">
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            데이터베이스 초기화 중...
          </p>
          <p className="text-xs text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    </aside>
  );
}
