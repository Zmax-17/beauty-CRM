"use client";

import { useState } from "react";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "min-h-dvh pb-20 md:pb-0",
          "transition-[padding] duration-200 ease-in-out",
          collapsed ? "md:pl-18" : "md:pl-64",
        )}
      >
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
