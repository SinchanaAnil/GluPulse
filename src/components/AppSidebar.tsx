import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  Eye,
  Zap,
  Clock,
  Stethoscope,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SignOutControl } from "@/components/SignOutControl";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Mic, label: "Voice Biomarker", path: "/voice" },
  { icon: Eye, label: "Vision Engine", path: "/vision" },
  { icon: Zap, label: "Reflex Test", path: "/reflex" },
  { icon: Clock, label: "Timeline", path: "/timeline" },
  { icon: Stethoscope, label: "Physician Portal", path: "/physician" },
  { icon: MessageCircle, label: "AI Chatbot", path: "/chatbot" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center border-r border-border bg-sidebar py-6 gap-2">
      <Link to="/" className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
        <span className="text-sm font-bold text-primary-foreground">GP</span>
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200",
                active
                  ? "bg-primary/15 text-primary glow-border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={item.label}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/15"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center border-t border-border pt-2">
        <SignOutControl variant="sidebar" />
      </div>
    </aside>
  );
}
