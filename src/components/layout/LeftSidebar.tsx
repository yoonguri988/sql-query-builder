"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { LeftSidebarProps } from "@/types/layout";
import DBSchemaTree from "./DBSchemaTree";
import QueryHistory from "./QueryHistory";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDBStore } from "@/store/db-store";
import { Database, History } from "lucide-react";
import SidebarLoading from "./SidebarLoading";
import SidebarError from "./SidebarError";

export default function LeftSidebar({
  isOpen = true,
  onClose,
}: LeftSidebarProps) {
  const { initialize, isInitialized, isLoading, error } = useDBStore();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [initialize, isInitialized, isLoading]);

  if (isLoading) return <SidebarLoading />;
  if (error) return <SidebarError error={error} onRetry={initialize} />;

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-full md:w-64 lg:w-[200px] xl:w-[300px]
        bg-background border-r
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        flex flex-col
        h-full
      `}
    >
      <div className="lg:hidden flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="leftExit"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="schema" className="flex-1 flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Schema</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="flex-1 m-0 p-4 overflow-y-auto">
          <DBSchemaTree />
        </TabsContent>

        <TabsContent value="history" className="flex-1 m-0 h-full">
          <QueryHistory />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
