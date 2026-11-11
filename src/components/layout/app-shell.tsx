import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Bottom nav */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
