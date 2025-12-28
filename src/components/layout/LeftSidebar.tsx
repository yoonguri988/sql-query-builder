"use client";
import { X, Database, Clock } from "lucide-react";
import { LeftSidebarProps } from "@/types/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

export default function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 lg:w-64
        bg-background border-r
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        overflow-y-auto
        flex flex-col
      `}
    >
      {/* 모바일 헤더 */}
      <div className="lg:hidden flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 데이터베이스 스키마 섹션 */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4" />
          <h3 className="font-semibold">Database Schema</h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="users">
            <AccordionTrigger>📂 users (5 columns)</AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-1 text-sm">
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ id (INTEGER)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ name (TEXT)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ email (TEXT)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ created_at (DATE)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  └─ country (TEXT)
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="products">
            <AccordionTrigger>📂 products (6 columns)</AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-1 text-sm">
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ id (INTEGER)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ name (TEXT)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ category_id (INTEGER)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ price (REAL)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  ├─ stock (INTEGER)
                </div>
                <div className="cursor-pointer hover:bg-accent p-1 rounded">
                  └─ created_at (DATE)
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="categories">
            <AccordionTrigger>📂 categories (3 columns)</AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-1 text-sm">
                <div>├─ id (INTEGER)</div>
                <div>├─ name (TEXT)</div>
                <div>└─ parent_id (INTEGER)</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 쿼리 히스토리 섹션 */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            <h3 className="font-semibold">Query History</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="p-2 bg-accent/50 rounded cursor-pointer hover:bg-accent">
              <div className="font-mono text-xs truncate">
                SELECT * FROM users...
              </div>
              <div className="text-xs text-muted-foreground mt-1">2분 전</div>
            </div>

            <div className="p-2 bg-accent/50 rounded cursor-pointer hover:bg-accent">
              <div className="font-mono text-xs truncate">
                SELECT name, email...
              </div>
              <div className="text-xs text-muted-foreground mt-1">5분 전</div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-2">
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
