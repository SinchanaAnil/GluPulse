import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { PageTransition } from "./PageTransition";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500">
      <AppSidebar />
      <div className="flex flex-1 flex-col pl-[72px]">
        <AppHeader />
        <main className="flex-1 p-6 overflow-hidden">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
