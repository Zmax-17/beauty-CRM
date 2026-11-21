"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions/auth";
import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type SidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export function Sidebar({
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col",
        "border-r border-sidebar-border bg-sidebar",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-18" : "w-64",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          collapsed
            ? "justify-center px-2"
            : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-sidebar-foreground">
            {t("common.appName")}
          </span>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onCollapsedChange(!collapsed)
                  }
                  aria-label={
                    collapsed
                      ? t("common.expandSidebar")
                      : t("common.collapseSidebar")
                  }
                >
                  {collapsed ? (
                    <PanelLeftOpen className="size-5" />
                  ) : (
                    <PanelLeftClose className="size-5" />
                  )}
                </Button>
              }
            />
            <TooltipContent side="right">
              {collapsed
                ? t("common.expandSidebar")
                : t("common.collapseSidebar")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto p-3"
        aria-label="Main"
      >
        <TooltipProvider>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              const navButtonsLabel = t(item.titleKey);
              // Nav buttons links
              const link = (
                <Link
                  href={item.href}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  aria-label={
                    collapsed ? navButtonsLabel : undefined
                  }
                  className={cn(
                    "flex h-10 items-center rounded-xl",
                    "text-sm transition-colors",
                    collapsed
                      ? "justify-center px-0"
                      : "gap-3 px-3",
                    isActive
                      ? "bg-sidebar-accent font-medium text-primary"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className="size-5 shrink-0"
                    aria-hidden="true"
                  />

                  {!collapsed && (
                    <span className="truncate">
                      {navButtonsLabel}
                    </span>
                  )}
                </Link>
              );

              return (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger render={link} />
                      <TooltipContent side="right">
                        {navButtonsLabel}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full cursor-pointer",
                    collapsed
                      ? "justify-center px-0"
                      : "justify-start gap-3",
                  )}
                  onClick={() => logout()}
                  aria-label={t("common.logout")}
                >
                  <LogOut className="size-5 shrink-0" />

                  {!collapsed && (
                    <span>{t("common.logout")}</span>
                  )}
                </Button>
              }
            />
            {collapsed && (
              <TooltipContent side="right">
                {t("common.logout")}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
