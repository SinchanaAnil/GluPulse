import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VoiceBiomarker from "@/pages/VoiceBiomarker";
import VisionEngine from "@/pages/VisionEngine";
import ReflexTest from "@/pages/ReflexTest";
import Timeline from "@/pages/Timeline";
import PhysicianPortal from "@/pages/PhysicianPortal";
import Chatbot from "@/pages/Chatbot";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/voice" element={<VoiceBiomarker />} />
            <Route path="/vision" element={<VisionEngine />} />
            <Route path="/reflex" element={<ReflexTest />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/physician" element={<PhysicianPortal />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
