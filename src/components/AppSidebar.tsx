import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  Eye,
  Zap,
  Clock,
  User,
  ShieldCheck,
  MessageCircle,
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Mic, label: "Voice", path: "/voice" },
  { icon: Eye, label: "Vision Center", path: "/vision" },
  { icon: Zap, label: "Reflex Test", path: "/reflex" },
  { icon: Clock, label: "Health Timeline", path: "/timeline" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: ShieldCheck, label: "Physician Vault", path: "/physician" },
  { icon: MessageCircle, label: "AI Health Chat", path: "/chatbot" },
];

export function AppSidebar() {
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center py-6 gap-2 transition-colors duration-500 sidebar-glass">
      <div className="mb-4">
        <Link to="/" className="flex items-center justify-center">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-6 mt-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                active
                  ? "bg-white/45 dark:bg-white/10 text-primary shadow-sm ring-1 ring-white/20"
                  : "text-muted-foreground hover:bg-white/20 hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="relative z-10 h-5 w-5" />
              {active && (
                <motion.div
                  layoutId="activeSide"
                  className="absolute -left-[3px] top-1/4 h-1/2 w-[3px] rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-6 pt-4 mb-2">
        <button
          onClick={toggle}
          className="relative flex h-14 w-8 flex-col items-center justify-between rounded-full border border-white/30 bg-white/20 py-1 transition-colors duration-300 hover:bg-white/30 select-none backdrop-blur-md"
          title="Toggle Theme"
        >
          <motion.div
            className="absolute left-[3px] top-[3px] h-[24px] w-[24px] rounded-full bg-white shadow-md border border-white/50 dark:bg-black"
            animate={{ y: theme === "dark" ? 22 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <div className="z-10 flex h-6 w-6 items-center justify-center">
            <Sun className={cn("h-3.5 w-3.5", theme === "light" ? "text-foreground" : "text-white/40")} />
          </div>
          <div className="z-10 flex h-6 w-6 items-center justify-center">
            <Moon className={cn("h-3.5 w-3.5", theme === "dark" ? "text-white" : "text-muted-foreground")} />
          </div>
        </button>

        <button 
          onClick={() => signOut()}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/20 hover:text-foreground transition-all"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
