"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function NavigationBar() {
  return (
    <header className="bg-slate-900/85 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white no-underline">
          <Image src="/globe.svg" alt="Coverage Todo" width={36} height={36} />
          <span className="text-lg font-semibold hidden sm:inline">Coverage Todo</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-3">
            <li>
              <Link href="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/completed" className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition">
                Completed
              </Link>
            </li>
            <li className="flex items-center">
              <SignedOut>
                <SignInButton>
                  <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md transition flex items-center">
                    Sign in
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
