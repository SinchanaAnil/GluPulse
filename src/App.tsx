import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import VoiceBiomarker from "@/pages/VoiceBiomarker";
import VisionEngine from "@/pages/VisionEngine";
import ReflexTest from "@/pages/ReflexTest";
import Timeline from "@/pages/Timeline";
import PhysicianPortal from "@/pages/PhysicianPortal";
import Chatbot from "@/pages/Chatbot";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AuthGuard />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/voice" element={<VoiceBiomarker />} />
                  <Route path="/vision" element={<VisionEngine />} />
                  <Route path="/reflex" element={<ReflexTest />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/physician" element={<PhysicianPortal />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
