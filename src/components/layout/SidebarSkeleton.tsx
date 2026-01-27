import { Skeleton } from "../ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <aside className="w-full md:w-64 lg:w-[200px] xl:w-[300px] border-r border-border bg-background">
      <div className="p-4 space-y-4">
        {/* 탭 스켈레톤 */}
        <div className="flex gap-2 border-b pb-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/2" />
        </div>

        {/* 검색바 스켈레톤 */}
        <Skeleton className="h-10 w-full" />

        {/* 트리 아이템 스켈레톤 */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-5 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
