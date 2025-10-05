"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CheckSquare, Home, Check, Trash2, LogIn } from "lucide-react";
import Link from "next/link";

function NavigationBar() {
  return (
    <header className="bg-slate-900/85 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white no-underline">
          <CheckSquare className="w-9 h-9 text-blue-400" />
          <span className="text-lg font-semibold hidden sm:inline">Coverage Todo</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-3">
            <li>
              <Link href="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/completed" className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
              </Link>
            </li>
            <li>
              <Link href="/trash" className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Trash</span>
              </Link>
            </li>
            <li className="flex items-center">
              <SignedOut>
                <SignInButton>
                  <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign in</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center">
                  <UserButton />
                </div>
              </SignedIn>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavigationBar;
