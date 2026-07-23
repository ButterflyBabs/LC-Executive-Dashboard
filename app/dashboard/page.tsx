"use client";

import { useState } from "react";
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
  Plus,
  Mic,
  Clock,
  TrendingUp,
  Bell,
  Search,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "TODAY", icon: Home, id: "today" },
  { name: "TIME", icon: Calendar, id: "time" },
  { name: "INBOX", icon: Mail, id: "inbox" },
  { name: "MONEY", icon: DollarSign, id: "money" },
  { name: "TASKS", icon: CheckSquare, id: "tasks" },
  { name: "VOICE", icon: Megaphone, id: "voice" },
  { name: "LEARN", icon: PlayCircle, id: "learn" },
  { name: "SACRED KALEIDOSCOPE", icon: Building2, id: "sacred-kaleidoscope" },
  { name: "TITANIUM", icon: Puzzle, id: "titanium" },
  { name: "AI", icon: Sparkles, id: "ai" },
];

const tasks = [
  { id: 1, title: "Review LifeCharter Circle applications", priority: "high", column: "today" },
  { id: 2, title: "Draft newsletter for Letterman", priority: "medium", column: "in-progress" },
  { id: 3, title: "Approve social media posts", priority: "low", column: "waiting" },
];

const emails = [
  { id: 1, subject: "RE: Speaking opportunity - Denver Conference", tag: "VIP" },
  { id: 2, subject: "LifeCharter Incubator registration", tag: "Action" },
  { id: 3, subject: "Your weekly analytics report", tag: "FYI" },
];

const schedule = [
  { time: "9:00 AM", event: "Team Standup", color: "bg-teal" },
  { time: "11:00 AM", event: "Client Call", color: "bg-plum" },
  { time: "2:00 PM", event: "Content Creation", color: "bg-gold" },
  { time: "4:00 PM", event: "LifeCharter Circle", color: "bg-navy" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("today");

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
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-white/10 text-gold"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wider">{item.name}</span>
              {item.id === "inbox" && (
                <span className="ml-auto bg-gold text-navy text-xs font-bold px-2.5 py-1 rounded-full">
                  12
                </span>
              )}
            </button>
          ))}
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
        {/* Header */}
        <header className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-serif text-navy">
                  Good morning, Babs
                </h2>
                <span className="text-2xl">🦋</span>
              </div>
              <p className="text-soft-taupe text-sm">
                Thursday, July 23
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-navy/60 hover:text-navy transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-navy/60 hover:text-navy transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full"></span>
              </button>
              <button className="px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Start My Day
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-8 pb-8 space-y-6">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Morning Brief */}
            <div className="bg-white rounded-2xl p-6 soft-shadow card-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl text-navy">Your Morning Brief</h3>
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-lg">🦋</span>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-navy/70 text-sm leading-relaxed">3 meetings today - first at 9:00 AM</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-plum/10 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-4 h-4 text-plum" />
                  </div>
                  <span className="text-navy/70 text-sm leading-relaxed">12 tasks require attention</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-gold-dark" />
                  </div>
                  <span className="text-navy/70 text-sm leading-relaxed">$4,250 revenue received</span>
                </li>
              </ul>
            </div>

            {/* Calendar Snapshot */}
            <div className="bg-white rounded-2xl p-6 soft-shadow card-hover">
              <h3 className="font-serif text-xl text-navy mb-5">Today&apos;s Schedule</h3>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-soft-taupe w-16 font-medium">{item.time}</span>
                    <span className="text-navy/80 text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Pulse */}
            <div className="bg-white rounded-2xl p-6 soft-shadow card-hover">
              <h3 className="font-serif text-xl text-navy mb-4">Financial Pulse</h3>
              <div className="mb-4">
                <span className="text-4xl font-serif text-gold-dark">$24,580</span>
                <p className="text-sm text-soft-taupe mt-1">Month to date</p>
              </div>
              <div className="flex items-center gap-2 text-teal mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12% from last month</span>
              </div>
              <div className="flex items-center gap-2 text-plum bg-plum/5 px-4 py-2.5 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-plum" />
                <span className="text-sm">3 bills due this week</span>
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-5 gap-6">
            {/* Task Board */}
            <div className="col-span-3 bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl text-navy">Priority Tasks</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy-light transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["Today", "In Progress", "Waiting"].map((column) => (
                  <div key={column} className="bg-cream-dark/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-soft-taupe uppercase tracking-wider mb-4">
                      {column}
                    </h4>
                    <div className="space-y-3">
                      {tasks
                        .filter((t) => t.column === column.toLowerCase().replace(" ", "-"))
                        .map((task) => (
                          <div
                            key={task.id}
                            className="bg-white p-4 rounded-xl soft-shadow cursor-move hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  task.priority === "high"
                                    ? "bg-red-400"
                                    : task.priority === "medium"
                                    ? "bg-gold"
                                    : "bg-teal"
                                }`}
                              />
                              <p className="text-sm text-navy/80 leading-relaxed">{task.title}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Preview */}
            <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl text-navy">Inbox</h3>
                <span className="bg-gold/20 text-gold-dark text-xs font-bold px-3 py-1.5 rounded-full">
                  12 unread
                </span>
              </div>
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 rounded-xl bg-cream-dark/30 hover:bg-lavender/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-navy/80 line-clamp-2 leading-relaxed">{email.subject}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                        email.tag === "VIP" 
                          ? "bg-gold/20 text-gold-dark" 
                          : email.tag === "Action"
                          ? "bg-teal/20 text-teal-dark"
                          : "bg-lavender text-plum"
                      }`}>
                        {email.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 text-sm text-navy border border-navy/20 rounded-xl hover:bg-navy hover:text-white transition-all font-medium">
                View All Emails
              </button>
            </div>
          </div>

          {/* AI Assistant Bar */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-plum to-teal flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-navy font-medium mb-3 text-lg">Ask me anything...</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all">
                    What&apos;s my focus today?
                  </button>
                  <button className="px-4 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all">
                    Schedule focus time
                  </button>
                  <button className="px-4 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all">
                    Draft email to team
                  </button>
                </div>
              </div>
              <button className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center hover:bg-gold-light transition-all shadow-glow">
                <Mic className="w-6 h-6 text-navy" />
              </button>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="flex items-center justify-center gap-2 pt-4 pb-2">
            <div className="w-6 h-6">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M20 35C20 35 12 28 12 20C12 12 16 8 20 8C24 8 28 12 28 20C28 28 20 35 20 35Z" fill="#c9a227"/>
                <path d="M20 8C20 8 8 12 8 22C8 30 16 32 20 35C24 32 32 30 32 22C32 12 20 8 20 8Z" stroke="#1a2b4a" strokeWidth="1.5" fill="none"/>
                <ellipse cx="14" cy="18" rx="5" ry="8" fill="#1a2b4a" opacity="0.8"/>
                <ellipse cx="26" cy="18" rx="5" ry="8" fill="#1a2b4a" opacity="0.8"/>
                <circle cx="20" cy="14" r="2" fill="#c9a227"/>
              </svg>
            </div>
            <span className="text-soft-taupe text-sm font-serif">LifeCharter</span>
            <span className="text-soft-taupe/50 text-xs">|</span>
            <span className="text-soft-taupe/50 text-xs">Executive Dashboard</span>
          </div>
        </div>
      </main>
    </div>
  );
}