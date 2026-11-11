"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-4 py-4">
        <span className="text-sm font-semibold text-sidebar-foreground">
          {t("common.appName")}
        </span>
      </div>
      <nav
        className="flex-1 p-3"
        aria-label="Main"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                >
                  <Icon
                    className="size-5 shrink-0"
                    aria-hidden
                  />
                  <span>{t(item.titleKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>{" "}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
