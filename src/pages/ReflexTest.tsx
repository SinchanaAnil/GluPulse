import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Timer, Target, Trophy, Clock, Shield, User, Bell, ChevronRight, Wallet, Activity, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-Components ---

const NavLink = ({ label, active }: { label: string; active?: boolean }) => (
  <a href="#" className={cn("text-[10px] font-bold tracking-[0.2em] transition-colors", active ? "text-white" : "text-white/40 hover:text-white/70")}>{label}</a>
);

const CodxCard = ({ title, status, icon: Icon, delay = 0 }: { title: string; status: string; icon: any; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="relative group w-48 h-64 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 overflow-hidden"
  >
    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:border-accent/40 transition-colors">
      <Icon className="w-12 h-12 text-white/50 group-hover:text-accent transition-colors" />
    </div>
    <div className="text-center">
      <h3 className="text-sm font-black italic tracking-widest text-white">{title}</h3>
      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">{status}</p>
    </div>
    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
      <div className="w-16 h-[2px] bg-white/20 group-hover:bg-accent/40 transition-colors" />
    </div>
  </motion.div>
);

const LevelBox = ({ level, title, description, delay = 0 }: { level: string; title: string; description: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center gap-4 border border-black/5"
  >
    <div className="w-12 h-12 border border-black/10 rounded-lg flex items-center justify-center">
      <Shield className="w-6 h-6 text-black/20" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Level {level}</p>
      <h3 className="text-xs font-bold text-black mt-1 leading-tight">{title}</h3>
      <p className="text-[9px] text-black/40 mt-2 leading-relaxed max-w-[120px]">{description}</p>
    </div>
    <button className="mt-2 px-6 py-1.5 bg-accent text-[10px] font-black text-white italic rounded-full uppercase tracking-widest hover:scale-105 transition-transform">
      Learn More
    </button>
  </motion.div>
);

const AnnouncementCard = ({ title, date, delay = 0 }: { title: string; date: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col"
  >
    <div className="h-24 bg-black/5 flex items-center justify-center">
       <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 opacity-40" />
    </div>
    <div className="p-3">
       <span className="text-[8px] text-black/30 font-bold uppercase">{date}</span>
       <h4 className="text-[10px] font-bold text-black leading-tight mt-1">{title}</h4>
       <p className="text-[9px] text-black/50 mt-2 leading-tight">Precision monitoring for metabolic stability and reflex maintenance...</p>
    </div>
  </motion.div>
);

// --- Main Page ---

export default function ReflexTest() {
  return (
    <div className="min-h-screen bg-[#110816] text-white overflow-hidden relative font-sans">
      
      {/* Sidebar Accents (Small dots/shapes from screenshot) */}
      <div className="absolute left-4 top-1/4 flex flex-col gap-1 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-1">
             {[...Array(3)].map((_, j) => <div key={j} className="w-1.5 h-1.5 bg-accent rounded-full" />)}
          </div>
        ))}
      </div>

      <header className="flex justify-between items-center py-8 px-12 relative z-10">
        <div className="flex items-center gap-2">
          <div className="skew-x-[-12deg] w-8 h-8 bg-white flex items-center justify-center font-black text-[#110816] text-xl">
             //
          </div>
        </div>
        <nav className="flex items-center gap-8">
          <NavLink label="DASHBOARD" active />
          <NavLink label="SETTINGS" />
          <NavLink label="PROFILE" />
        </nav>
      </header>

      <main className="grid grid-cols-12 min-h-screen relative">
        
        {/* Left Side: Dark Zone */}
        <div className="col-span-12 xl:col-span-7 pl-12 pr-6 pb-20 relative">
          
          <div className="mt-10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">My Dashboard</p>
            <h1 className="text-7xl font-black italic tracking-tighter leading-[0.9] mb-4">
              PULSE<br/>COLLECTION
            </h1>
            <p className="text-sm text-white/50 max-w-sm font-medium leading-relaxed">
              We provide a new platform for patient monitoring and reflex assessment to engage stability on a whole new level.
            </p>
          </div>

          <div className="mt-20 flex gap-8 items-center">
            <CodxCard title="PULSE X1" status="Learn More" icon={Activity} />
            <div className="relative">
              <CodxCard title="PULSE X2" status="Unlock Level 02" icon={Shield} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Shield className="w-8 h-8 text-white/20" />
              </div>
            </div>
          </div>

          <div className="mt-32 flex items-center gap-12">
            <div className="flex flex-col">
               <span className="text-2xl font-black text-accent italic">XP 7,520</span>
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black text-white/20 italic uppercase tracking-widest">LEVEL: 01</span>
            </div>
            <div className="flex-1 flex flex-col items-center ml-10">
               <div className="flex gap-1 w-full max-w-[200px]">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className={cn("h-6 w-1 rounded-full", i < 15 ? "bg-white/5" : i < 20 ? "bg-accent" : i < 22 ? "bg-yellow-400" : "bg-white/10")} />
                  ))}
               </div>
               <span className="text-[8px] text-white/30 mt-2 uppercase tracking-widest font-black">Collection Progress</span>
            </div>
          </div>

          {/* Zigzag Bottom Left (MY PERKS) */}
          <div className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none">
             <div 
               className="absolute bottom-0 left-0 w-full h-[250px] bg-white translate-y-[1px]"
               style={{ clipPath: 'polygon(0 80px, 80px 0, 100% 0, 100% 100%, 0 100%)' }}
             />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-12 z-20 pointer-events-none">
             <div className="flex gap-4 mb-6">
                <button className="px-6 py-2 bg-black text-white text-[10px] font-black rounded-full pointer-events-auto italic uppercase tracking-widest ring-2 ring-white/10">Phase 1</button>
                <button className="px-6 py-2 bg-transparent text-black/20 text-[10px] font-black rounded-full pointer-events-auto italic uppercase tracking-widest">Phase 2</button>
                <button className="px-6 py-2 bg-transparent text-black/20 text-[10px] font-black rounded-full pointer-events-auto italic uppercase tracking-widest">Phase 3</button>
             </div>
             <h2 className="text-4xl font-black italic text-black leading-none uppercase tracking-tighter max-w-sm">
                PERKS YOU GET AFTER OBTAINING YOUR FIRST PULSE
             </h2>
             <div className="mt-8 grid grid-cols-3 gap-6 pointer-events-auto">
                <LevelBox level="1" title="STABILITY CHANNELS" description="Exclusive protocols for maintaining optimal metabolic reflex balance." />
                <LevelBox level="2" title="METRIC HUD" description="Advanced real-time display of neural performance and glucose flux." />
                <LevelBox level="3" title="VETERAN STREAK" description="Unlock restricted testing environments for elite monitoring." />
             </div>
          </div>

        </div>

        {/* Right Side: White & Dark Hybrid Zone */}
        <div className="col-span-12 xl:col-span-5 relative">
          
          {/* Top Diagonal Cut (White Section) */}
          <div 
            className="absolute top-0 right-0 w-full h-[60%] bg-[#F5F5F5] z-0"
            style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}
          />
          
          {/* Level Cards on Right */}
          <div className="relative z-10 pt-10 px-12 flex flex-col gap-6">
             <div className="flex justify-center gap-6">
                 <LevelBox level="1" title="NEURAL SYNC" description="Basic reaction testing protocol for stability check." delay={0.1} />
                 <LevelBox level="2" title="COGNITIVE SHIELD" description="Sustained pattern recognition under flux." delay={0.2} />
                 <LevelBox level="3" title="VANGUARD FOCUS" description="High-intensity reflex mapping protocols." delay={0.3} />
             </div>

             <div className="mt-20">
                <h3 className="text-sm font-black text-black/40 uppercase tracking-[0.2em] mb-8">The Newest Announcements</h3>
                <div className="grid grid-cols-2 gap-6">
                   <AnnouncementCard title="STABILITY UPDATE v4.0" date="AUG 22 - 04 JAN 2026" delay={0.4} />
                   <AnnouncementCard title="REFLEX PERFORMANCE" date="AUG 22 - 04 JAN 2026" delay={0.5} />
                   <AnnouncementCard title="NEURAL PATHWAYS" date="AUG 22 - 04 JAN 2026" delay={0.6} />
                   <AnnouncementCard title="PROTOCOL X4" date="AUG 22 - 04 JAN 2026" delay={0.7} />
                </div>
             </div>
          </div>

          {/* Bottom Dark Section (Wallet) */}
          <div 
            className="absolute bottom-0 right-0 w-[110%] h-[40%] bg-[#0E0611] z-20"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}
          >
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <div className="text-[120px] font-black italic select-none">ARENA</div>
             </div>

             <div className="relative p-12 flex flex-col h-full justify-center gap-6">
                <div className="text-white/20 text-[10px] font-black tracking-widest uppercase mb-[-10px] ml-auto">My Wallet</div>
                <div className="max-w-md">
                   <h2 className="text-2xl font-black italic tracking-tighter text-white leading-tight uppercase">
                      \"NEURAL WALLET: YOUR GATEWAY TO STABILITY ANALYTICS\"
                   </h2>
                   <div className="mt-8 flex flex-col gap-4">
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-3">
                         <Wallet className="w-5 h-5 text-accent" />
                         <input type="password" value="********" readOnly className="bg-transparent text-sm focus:outline-none w-full" />
                      </div>
                      <div className="flex gap-4">
                         <button className="flex-1 py-1 bg-white text-black text-[10px] font-black italic uppercase rounded border border-white/20">Access Analytics</button>
                         <button className="flex-1 py-1 bg-transparent text-white/50 text-[10px] font-black italic uppercase rounded border border-white/20">Details</button>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Want to change your test type?</p>
                   <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-6 py-2 bg-[#1A0B2E] border border-accent/30 rounded italic group transition-all hover:bg-accent/10">
                         <Zap className="w-3 h-3 text-accent" />
                         <span className="text-[10px] font-black uppercase text-white/70">Reflex Lab</span>
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2 bg-[#1A0B2E] border border-white/10 rounded italic group transition-all hover:bg-white/10">
                         <Clock className="w-3 h-3 text-white/40" />
                         <span className="text-[10px] font-black uppercase text-white/40">History</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Extreme Right Neon Line Decoration */}
      <div className="absolute right-0 top-0 w-2 h-full bg-accent/20 z-50">
         <div className="h-1/3 w-full bg-accent shadow-[0_0_20px_rgba(187,57,237,0.8)]" />
      </div>

    </div>
  );
}
