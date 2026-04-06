import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Mic, 
  Eye, 
  Zap, 
  Activity, 
  Globe, 
  Heart, 
  Plus, 
  Dna, 
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Voice Biomarker",
    description: "Detect early clinical signs through subtle vocal alterations",
    icon: <Mic className="h-16 w-16 text-[#6B8E23]" />,
    animation: "wave",
    detail: "Pulse Wave Analysis"
  },
  {
    title: "Meal Intelligence",
    description: "Predict exactly how food impacts your unique glucose levels",
    icon: <Activity className="h-16 w-16 text-[#6B8E23]" />,
    animation: "scan",
    detail: "Postprandial Prediction"
  },
  {
    title: "Reflex Check",
    description: "Monitor reaction speed to identify cognitive risk instantly",
    icon: <Zap className="h-16 w-16 text-[#6B8E23]" />,
    animation: "pulse",
    detail: "Cognitive Response Timer"
  },
  {
    title: "AI Co-Pilot",
    description: "Get simplified, real-time guidance on complicated health data",
    icon: <MessageCircle className="h-16 w-16 text-[#6B8E23]" />,
    animation: "typing",
    detail: "Intelligent Triage"
  }
];

const BackgroundIcons = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.20] dark:opacity-[0.15]">
    <motion.div 
      animate={{ y: [0, -40, 0], rotate: [0, 20, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[8%] left-[10%]"
    >
      <Heart className="w-48 h-48 text-[#6B8E23]/25" />
    </motion.div>
    <motion.div 
      animate={{ y: [0, 50, 0], x: [0, 40, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[10%] right-[10%]"
    >
      <Plus className="w-60 h-60 text-[#A3B18A]/25" />
    </motion.div>
    <motion.div 
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      className="absolute top-[45%] left-[40%]"
    >
      <Dna className="w-80 h-80 text-[#6B8E23]/15" />
    </motion.div>
  </div>
);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Motion Value for horizontal translation
  const xTranslate = useMotionValue(0);
  const smoothX = useSpring(xTranslate, { stiffness: 60, damping: 30, mass: 1 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const handleWheel = (e: WheelEvent) => {
      // Prevent default vertical scroll
      e.preventDefault();
      
      const scrollSpeed = 1.5;
      const delta = e.deltaY * scrollSpeed;
      
      const currentX = xTranslate.get();
      // Total content width calculation: Hero(100vw) + CardsStrip + Closing(100vw)
      // Since it's flex row, we can just measure or estimate.
      // 100vw + (420*4 + gaps) + 100vw
      const maxScroll = -(containerRef.current?.scrollWidth || 5000) + windowWidth;
      
      const newX = Math.min(0, Math.max(maxScroll, currentX - delta));
      xTranslate.set(newX);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    
    // Lock body scroll
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [windowWidth, xTranslate]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F6F8F6] dark:bg-[#0F1412] text-[#1F2A24] dark:text-[#E6F0EA] font-sans selection:bg-[#6B8E23]/20">
      
      <BackgroundIcons />

      {/* STICKY TOP BRANDING */}
      <div className="fixed top-12 right-16 z-50 text-right pointer-events-none">
        <div className="flex items-center justify-end gap-5 pointer-events-auto">
          <Link to="/" className="group flex items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-[#6B8E23]/15 flex items-center justify-center border-2 border-[#6B8E23]/20 shadow-2xl backdrop-blur-xl">
               <img src="/favicon.ico" className="h-10 w-10 object-contain" alt="Logo" />
             </div>
             <span className="text-[52px] font-black tracking-tighter text-[#1F2A24] dark:text-white glow-text-primary">GluPulse</span>
          </Link>
        </div>
        <p className="text-[24px] font-semibold text-[#6B8E23] mt-2 tracking-wide opacity-90">Predict. Prevent. Protect.</p>
      </div>

      {/* HORIZONTAL WRAPPER */}
      <motion.div 
        ref={containerRef}
        style={{ x: smoothX }}
        className="flex h-screen w-max items-center px-[8vw] select-none"
      >
        
        {/* HERO SECTION */}
        <section className="w-[100vw] h-screen flex shrink-0 flex-col items-start justify-center pr-[10vw]">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="max-w-[900px]"
          >
            <span className="inline-block px-6 py-2.5 rounded-full bg-[#6B8E23]/15 text-[#6B8E23] text-[14px] font-black uppercase tracking-[4px] mb-10 border-2 border-[#6B8E23]/25 shadow-sm">
              Advanced Clinical AI
            </span>
            <h1 className="text-[92px] lg:text-[112px] font-[950] leading-[0.8] tracking-[-7px] mb-12 text-[#1F2A24] dark:text-white">
              Your Health<br />
              <span className="text-[#6B8E23]">Synchronized.</span>
            </h1>
            <p className="text-[28px] text-[#5F6F66] dark:text-[#AAB7AF] max-w-[650px] font-medium leading-normal mb-14 opacity-95">
              The world's most sophisticated physiological monitoring environment, designed to detect critical shifts before they become symptoms.
            </p>
            <div className="flex items-center gap-8 py-4 px-8 rounded-full border-2 border-[#6B8E23]/20 w-fit bg-[#6B8E23]/5 backdrop-blur-md">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#6B8E23] text-white shadow-xl animate-bounce-slow">
                <ArrowRight className="h-8 w-8" />
              </div>
              <span className="text-[20px] font-black text-[#6B8E23] tracking-widest uppercase">Scroll horizontally to explore</span>
            </div>
          </motion.div>
        </section>

        {/* CARDS SECTION - SINGLE ROW NO WRAP */}
        <section className="flex gap-20 shrink-0 items-center px-[5vw]">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -20 }}
              className="w-[420px] h-[520px] glass-card p-14 flex flex-col justify-between group cursor-default shadow-[0_30px_60px_rgba(0,0,0,0.2)] bg-white/40 dark:bg-[#161C18]/50 backdrop-blur-[28px] border-2 border-white/40 dark:border-white/10"
            >
              <div className="space-y-10">
                <div className="h-24 w-24 rounded-[28px] bg-[#DDE5D8] dark:bg-[#2A332E] flex items-center justify-center border-2 border-[#6B8E23]/30 group-hover:bg-[#6B8E23] transition-all duration-700 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {card.animation === "scan" && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="h-[2px] w-full bg-white/70 animate-scan" />
                    </div>
                  )}

                  {card.animation === "wave" && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-wave pointer-events-none" />
                  )}

                  <div className="relative z-10 transition-all duration-300 group-hover:text-white group-hover:scale-125">
                    {card.icon}
                  </div>

                  {card.animation === "typing" && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100">
                      <div className="typing-dot bg-white" />
                      <div className="typing-dot bg-white" />
                      <div className="typing-dot bg-white" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-[32px] font-[900] tracking-tight group-hover:text-[#6B8E23] transition-colors">{card.title}</h3>
                  <p className="text-[19px] text-[#5F6F66] dark:text-[#AAB7AF] font-medium leading-[1.6] italic opacity-90">
                    "{card.description}"
                  </p>
                </div>
              </div>

              <div className="pt-12 border-t-2 border-[#6B8E23]/15 flex items-center justify-between">
                <span className="text-[14px] font-black uppercase tracking-[4px] text-[#6B8E23] bg-[#6B8E23]/10 px-5 py-2 rounded-full">
                  {card.detail}
                </span>
                <div className="h-3 w-3 rounded-full bg-[#6B8E23] animate-ping" />
              </div>
            </motion.div>
          ))}
        </section>

        {/* CLOSING SECTION */}
        <section className="w-[100vw] h-screen flex shrink-0 items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#6B8E23]/8 blur-[250px] rounded-full pointer-events-none" />
           
           <motion.div
             initial={{ opacity: 0, scale: 0.85 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: false, amount: 0.5 }}
             transition={{ duration: 1.5, type: "spring" }}
             className="max-w-[1100px] text-center space-y-20 relative z-10"
           >
             <div className="space-y-8">
               <h2 className="text-[96px] lg:text-[124px] font-[950] tracking-[-8px] leading-[0.8] text-[#1F2A24] dark:text-white">
                 Your health <br />
                 doesn’t wait.
               </h2>
               <h3 className="text-[44px] lg:text-[62px] font-[600] text-[#6B8E23] tracking-tighter glow-text-secondary">
                 Why should you?
               </h3>
             </div>
             
             <div className="pt-16">
               <Link to="/dashboard">
                 <Button className="bg-[#6B8E23] hover:bg-[#5A781E] text-white h-[96px] px-24 rounded-full text-[28px] font-black shadow-[0_30px_60px_-15px_rgba(107,142,35,0.6)] group transition-all hover:scale-105 active:scale-95 flex items-center gap-6 mx-auto">
                   Launch System Now
                   <ArrowRight className="h-10 w-10 transition-transform group-hover:translate-x-4" />
                 </Button>
               </Link>
               <div className="mt-20 flex justify-center gap-16 text-[#1F2A24]/50 dark:text-white/50">
                  <div className="flex items-center gap-4 text-[14px] font-black uppercase tracking-[5px]"><Globe className="h-8 w-8" /> Clinical Shield</div>
                  <div className="flex items-center gap-4 text-[14px] font-black uppercase tracking-[5px]"><Heart className="h-8 w-8" /> Predictive Core</div>
               </div>
             </div>
           </motion.div>
        </section>

      </motion.div>

      {/* FOOTER MINI */}
      <footer className="fixed bottom-12 left-16 z-50 flex gap-10 text-[13px] font-black uppercase tracking-[5px] opacity-40 hover:opacity-100 transition-opacity">
         <span className="text-[#1F2A24] dark:text-white">© 2026 GluPulse Global</span>
         <span className="text-[#6B8E23] font-black text-xl">|</span>
         <a href="#" className="hover:text-[#6B8E23] underline decoration-[#6B8E23]/40 underline-offset-[12px] decoration-2">Clinical Protocol</a>
         <a href="#" className="hover:text-[#6B8E23] underline decoration-[#6B8E23]/40 underline-offset-[12px] decoration-2">Global Access</a>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
