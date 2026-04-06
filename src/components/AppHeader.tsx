import { Search, Bell, User, Calendar, Dna } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutControl } from "@/components/SignOutControl";

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between px-6 transition-colors duration-500 navbar-glass pl-[84px]">
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="GluPulse Logo" className="h-6 w-6 object-contain" />
        <span className="brand-name lowercase">glupulse</span>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-[380px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-white/50 bg-white/40 backdrop-blur-md pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 dark:bg-black/20 dark:border-white/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 w-48 justify-end">
        <SignOutControl variant="header" />
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Calendar className="h-5 w-5" />
        </button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary" />
        </button>
        <div className="flex items-center gap-3 pr-2 ml-2 border-l border-border pl-4 font-sans">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden lg:block whitespace-nowrap text-left">
            <p className="text-sm font-semibold text-foreground leading-none">Charles Robbie</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight font-bold">25 years old · NY, USA</p>
          </div>
        </div>
      </div>
    </header>
  );
}
