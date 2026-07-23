"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Calendar,
  Mail,
  DollarSign,
  CheckSquare,
  Megaphone,
  PlayCircle,
  Building2,
  Puzzle,
  Sparkles,
  Settings,
  BarChart3,
} from "lucide-react";

const navigation = [
  { name: "TODAY", icon: Home, href: "/dashboard" },
  { name: "TIME", icon: Calendar, href: "/dashboard/time" },
  { name: "INBOX", icon: Mail, href: "/dashboard/inbox" },
  { name: "MONEY", icon: DollarSign, href: "/dashboard/money" },
  { name: "TASKS", icon: CheckSquare, href: "/dashboard/tasks" },
  { name: "VOICE", icon: Megaphone, href: "/dashboard/voice" },
  { name: "LEARN", icon: PlayCircle, href: "/dashboard/learn" },
  { name: "DIMENSIONS", icon: BarChart3, href: "/dashboard/dimensions" },
  { name: "SACRED KALEIDOSCOPE", icon: Building2, href: "/dashboard/sacred-kaleidoscope" },
  { name: "TITANIUM", icon: Puzzle, href: "/dashboard/titanium" },
  { name: "AI", icon: Sparkles, href: "/dashboard/ai" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Butterfly Logo */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M20 35C20 35 12 28 12 20C12 12 16 8 20 8C24 8 28 12 28 20C28 28 20 35 20 35Z" fill="#c9a227"/>
                <path d="M20 8C20 8 8 12 8 22C8 30 16 32 20 35C24 32 32 30 32 22C32 12 20 8 20 8Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M20 8L20 35" stroke="white" strokeWidth="1"/>
                <ellipse cx="14" cy="18" rx="5" ry="8" fill="white" opacity="0.9"/>
                <ellipse cx="26" cy="18" rx="5" ry="8" fill="white" opacity="0.9"/>
                <circle cx="20" cy="14" r="2" fill="#c9a227"/>
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl font-medium tracking-wide">LifeCharter</h1>
              <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Executive Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-gold"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm tracking-wider">{item.name}</span>
                {item.name === "INBOX" && (
                  <span className="ml-auto bg-gold text-navy text-xs font-bold px-2.5 py-1 rounded-full">
                    12
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Brand Tagline */}
        <div className="px-6 py-4">
          <p className="text-[10px] text-white/30 text-center italic font-serif">
            &ldquo;Sacred Kaleidoscope&rdquo;
          </p>
        </div>

        {/* User */}
        <div className="p-4 m-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-navy font-bold text-lg">
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Babs</p>
              <p className="text-xs text-white/50 truncate">Alignment Architect</p>
            </div>
            <Settings className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}