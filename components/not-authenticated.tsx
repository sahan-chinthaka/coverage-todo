"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Lock, LogIn } from "lucide-react";

interface NotAuthenticatedProps {
  title?: string;
  message?: string;
  showSignInButton?: boolean;
}

export default function NotAuthenticated({
  title = "Authentication Required",
  message = "You need to sign in first to access this feature.",
  showSignInButton = true,
}: NotAuthenticatedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6">
      <div className="flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full">
        <Lock className="w-10 h-10 text-slate-500 dark:text-slate-400" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">{message}</p>
      </div>

      {showSignInButton && (
        <SignInButton>
          <Button className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
