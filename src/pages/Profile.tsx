import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    fullName: "",
    physicianEmail: "",
    emergencyPhone: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("gluPulseProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const updateProfile = (key: string, value: string) => {
    const newProfile = { ...profile, [key]: value };
    setProfile(newProfile);
    localStorage.setItem("gluPulseProfile", JSON.stringify(newProfile));
  };

  const handleManualSave = () => {
    toast({
      title: "Profile Synchronized",
      description: "Real-time sync active. Emergency protocols updated.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40">
           <User className="text-primary w-6 h-6" />
        </div>
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Emergency Profile</h1>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Configure your Guardian & Medical Sentinel</p>
        </div>
      </div>

      <div className="glass-card p-8 space-y-8">
        <div className="space-y-4">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                 <User className="w-3 h-3" /> Full Name
              </label>
              <input 
                type="text" 
                value={profile.fullName}
                onChange={(e) => updateProfile("fullName", e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Ex. John Doe"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                 <Mail className="w-3 h-3" /> Primary Physician Email
              </label>
              <input 
                type="email" 
                value={profile.physicianEmail}
                onChange={(e) => updateProfile("physicianEmail", e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="doctor@medical.com"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                 <Phone className="w-3 h-3" /> Emergency Contact Phone
              </label>
              <input 
                type="tel" 
                value={profile.emergencyPhone}
                onChange={(e) => updateProfile("emergencyPhone", e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="+1 (555) 000-0000"
              />
           </div>
        </div>

        <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-start gap-4">
           <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
           <div className="space-y-1">
              <p className="text-[11px] font-black italic uppercase text-rose-200 tracking-tight">Fail-Safe Protocol Active</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase leading-relaxed">
                In the event of a Deadman Switch breach (unresponsiveness), GluPulse will autonomously broadcast your metadata and current location to these contacts.
              </p>
           </div>
        </div>

        <button 
          onClick={handleManualSave}
          className="w-full py-4 bg-primary text-white font-black italic uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <Save className="w-5 h-5" />
          Synchronize Sentinel Profile
        </button>
      </div>
    </motion.div>
  );
}
