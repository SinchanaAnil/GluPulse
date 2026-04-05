import { Search, Bell, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { SignOutControl } from "@/components/SignOutControl";

export function AppHeader() {
  const { theme, toggle } = useTheme();

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
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="relative flex h-9 w-16 items-center rounded-full border border-border bg-muted/50 p-1 transition-colors duration-300 hover:bg-muted btn-press"
          aria-label="Toggle theme"
        >
          <motion.div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
            animate={{ x: theme === "dark" ? 0 : 26 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </motion.div>
        </button>

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
