import { type FormEvent, useState } from "react";
import { Navigate, useLocation, type Location } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
   <svg fill="#1877F2" viewBox="0 0 24 24" className="h-4 w-4 mr-2" aria-hidden="true">
     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
   </svg>
);

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password": return "Incorrect email or password.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/user-disabled": return "This account has been disabled.";
    case "auth/user-not-found": return "No account found with this email.";
    case "auth/too-many-requests": return "Too many attempts. Try again later.";
    case "auth/network-request-failed": return "Network error. Check your connection.";
    default: return "Something went wrong. Please try again.";
  }
}

export default function Login() {
  const { user, loading, signIn, signUp } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b15]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : "";
      toast.error(getFirebaseErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#030815] font-sans text-white overflow-hidden">
      
      {/* PERFECTLY MATCHED FULL PAGE ECG BACKGROUND */}
      <img
        src="/ecg_background.png"
        alt="Background"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-80"
      />
      
      {/* Subtle Gradient to ensure the left text is highly readable */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

      <nav className="relative z-20 flex items-center justify-between px-8 py-5 lg:px-12 w-full">
        <div className="flex items-center gap-3 text-[22px] font-medium tracking-tight">
          <img src="/favicon.ico" alt="Logo" className="h-7 w-7 object-contain" />
          GluPulse
        </div>
        
        <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">What's Included</a>
          <a href="#" className="hover:text-white transition-colors">Health Conditions</a>
          <a href="#" className="hover:text-white transition-colors">For You</a>
          <a href="#" className="hover:text-white transition-colors">For Professionals</a>
          <a href="#" className="hover:text-white transition-colors">FAQ</a>
          
          <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black border-2 border-transparent hover:bg-slate-200 transition-all">
            Get Early Access
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-white text-[10px]">
              ↗
            </span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT GRID (LEFT TEXT + RIGHT SIGN IN) */}
      <div className="relative z-10 flex-grow mx-auto w-full max-w-[1400px] px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT MARKETING CONTENT EXACT MATCH */}
        <div className="flex flex-col justify-center translate-y-[-2rem] space-y-24">
          
          <h1 className="text-5xl lg:text-[68px] font-semibold leading-[1.05] tracking-tight text-white drop-shadow-lg">
            Turn Your Health<br />Data into Secure<br />Login
          </h1>

          <div className="space-y-7 max-w-[400px]">
            <div>
              <h3 className="text-[15px] font-medium text-white tracking-wide">ECG-Verified Access</h3>
              <p className="text-[13px] text-slate-300 mt-1.5 leading-snug">Actionable trends without long wait times.</p>
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-white tracking-wide">Real-Time Health Monitoring</h3>
              <p className="text-[13px] text-slate-300 mt-1.5 leading-snug">Recommendations tailored to your goals and context.</p>
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-white tracking-wide">Personalized Security Guidance</h3>
              <p className="text-[13px] text-slate-300 mt-1.5 leading-snug">Bringing activity, recovery, nutrition, and stress<br/>into one picture.</p>
            </div>
          </div>

        </div>

        {/* RIGHT ISOLATED SIGN IN CARD EXACTLY LIKE THE REFERENCE IMAGE */}
        <div className="flex justify-center flex-col lg:justify-center lg:items-end w-full lg:w-auto h-full translate-y-[-2rem]">
          <div className="w-full max-w-[390px] rounded-[1.5rem] bg-[#0c121e]/90 p-8 shadow-2xl backdrop-blur-md border border-[#1f2937]/50 lg:mr-4">
            
             {/* Header section matching exact font hierarchy */}
            <div className="mb-8">
              <h1 className="text-[26px] font-bold tracking-tight text-white mb-2">
                {mode === "signin" ? "Sign in" : "Create account"}
              </h1>
              <p className="text-[12px] text-slate-400">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="font-medium text-[#4b8df8] hover:underline"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  disabled={submitting}
                >
                  {mode === "signin" ? "Create now" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-200 ml-0.5" htmlFor="email">
                  Email
                </label>
                <div className="rounded-xl bg-[#090d16] px-4 py-3 border border-[#161c29] focus-within:border-[#4b8df8] focus-within:ring-1 focus-within:ring-[#4b8df8]">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sinchana.anil1@gmail.com"
                    autoComplete="email"
                    disabled={submitting}
                    className="w-full bg-transparent text-[13px] text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-200 ml-0.5" htmlFor="password">
                  Password
                </label>
                <div className="relative flex rounded-xl bg-[#090d16] pl-4 pr-10 py-3 border border-[#161c29] focus-within:border-[#4b8df8] focus-within:ring-1 focus-within:ring-[#4b8df8]">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    disabled={submitting}
                    className="w-full bg-transparent text-[13px] text-white placeholder-slate-500 outline-none tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3a7af2] py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "signin" ? "Signing in..." : "Creating..."}
                  </>
                ) : (
                  <>{mode === "signin" ? "Sign In" : "Sign Up"}</>
                )}
              </button>
            </form>

            {/* Separator exact styling */}
            <div className="my-5 flex items-center justify-center mx-2">
              <div className="h-px w-full bg-[#1c2333]" />
              <span className="px-3 text-[10px] text-slate-500 font-medium">OR</span>
              <div className="h-px w-full bg-[#1c2333]" />
            </div>

            {/* Social Buttons strictly bordered and transparent */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toast.info("Google login natively enabled in Firebase console.")}
                className="flex w-full items-center justify-center rounded-xl border border-[#161c29] bg-[#090d16] py-3 text-[12px] font-medium text-slate-300 transition-colors hover:bg-white/5 active:scale-[0.98]"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => toast.info("Facebook login natively enabled in Firebase console.")}
                className="flex w-full items-center justify-center rounded-xl border border-[#161c29] bg-[#090d16] py-3 text-[12px] font-medium text-slate-300 transition-colors hover:bg-white/5 active:scale-[0.98]"
              >
                <FacebookIcon />
                Continue with Facebook
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
