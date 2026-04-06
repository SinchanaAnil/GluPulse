import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  Eye,
  Zap,
  Clock,
  Stethoscope,
  MessageCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: Mic, label: "Voice", path: "/voice" },
  { icon: Eye, label: "Vision", path: "/vision" },
  { icon: Zap, label: "Reflex", path: "/reflex" },
  { icon: Clock, label: "History", path: "/timeline" },
  { icon: MessageCircle, label: "AI Chat", path: "/chatbot" },
];

export function AppSidebar() {
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-6 top-8 z-50 flex h-[calc(100vh-64px)] w-[84px] flex-col items-center group pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
      {/* Re-engineered Organic Background with better vertical proportions */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <svg
          viewBox="0 0 84 800"
          className="w-full h-full fill-white dark:fill-zinc-950"
          preserveAspectRatio="none"
        >
          <path
            d="
              M 42,0
              C 10,0 0,15 0,45
              C 0,75 10,90 20,105
              L 20,130
              C 20,140 14,155 14,175
              L 14,625
              C 14,645 20,660 20,670
              L 20,695
              C 10,710 0,725 0,755
              C 0,785 10,800 42,800
              C 74,800 84,785 84,755
              C 84,725 74,710 64,695
              L 64,670
              C 64,660 70,645 70,625
              L 70,175
              C 70,155 64,140 64,130
              L 64,105
              C 74,90 84,75 84,45
              C 84,15 74,0 42,0
              Z
            "
          />
        </svg>
      </div>

      {/* Top Section - Large Circular Logo */}
      <div className="relative z-10 w-full flex flex-col items-center pt-6 pb-2 pointer-events-auto">
        <Link to="/" className="flex items-center justify-center no-underline">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="h-16 w-16 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-0.5"
          >
             <img 
               src="/logo.jpg" 
               alt="GluPulse Logo" 
               className="w-full h-full object-cover rounded-full"
             />
          </motion.div>
        </Link>
      </div>

      {/* Content Section - Strict Uniform Distribution */}
      <nav className="relative z-10 flex flex-1 flex-col items-center py-12 gap-8 w-full pointer-events-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-[16px] transition-all duration-300 transform",
                active ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100/50 dark:border-white/5" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
              )}
              title={item.label}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative z-10 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors",
                  active && "text-blue-500 dark:text-blue-400"
                )}
              >
                <item.icon className={cn("h-5 w-5 stroke-[2]", active && "stroke-[2.5]")} />
              </motion.div>
              
              {active && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section - Rebalanced for the Bottom Bulb */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6 pb-12 pointer-events-auto">
        {/* Logout */}
        <button 
            onClick={() => signOut()}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-rose-500 transition-all duration-300"
        >
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <LogOut className="h-5 w-5" />
            </motion.div>
        </button>

        {/* Theme Toggle Pillar */}
        <button
          onClick={toggle}
          className="relative flex h-12 w-6 items-center justify-center rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          <motion.div
            className="absolute h-4.5 w-4.5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-100/50 dark:border-zinc-700"
            animate={{ y: theme === "dark" ? 10 : -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {theme === "dark" ? <Moon className="h-2.5 w-2.5 text-blue-500" /> : <Sun className="h-2.5 w-2.5 text-blue-500" />}
          </motion.div>
        </button>
      </div>
    </aside>
  );
}
