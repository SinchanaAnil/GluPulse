import { Search, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { SignOutControl } from "@/components/SignOutControl";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 transition-colors duration-500">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors btn-press">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary animate-pulse" />
        </button>
        <SignOutControl variant="header" />
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary/30 btn-press">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
