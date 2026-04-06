import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { PageTransition } from "./PageTransition";
import { EmergencyOrchestrator } from "./EmergencyOrchestrator";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500">
      <AppSidebar />
      <EmergencyOrchestrator />
      <div className="flex flex-1 flex-col pl-16">
        <AppHeader />
        <main className="flex-1 p-6 pt-[88px] overflow-x-hidden">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
