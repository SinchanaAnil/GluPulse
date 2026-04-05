import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type SignOutControlProps = {
  variant: "header" | "sidebar";
  className?: string;
};

export function SignOutControl({ variant, className }: SignOutControlProps) {
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOut();
      toast.success("Signed out");
    } catch {
      toast.error("Could not sign out. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        title="Sign out"
        aria-label="Sign out"
        onClick={handleSignOut}
        disabled={pending}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50",
          className,
        )}
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
      onClick={handleSignOut}
      disabled={pending}
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
