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
  Search,
  Mic,
  MoreHorizontal,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "TODAY", icon: Home, id: "today", color: "bg-deep-indigo" },
  { name: "TIME", icon: Calendar, id: "time", color: "bg-sacred-teal" },
  { name: "INBOX", icon: Mail, id: "inbox", color: "bg-royal-plum" },
  { name: "MONEY", icon: DollarSign, id: "money", color: "bg-warm-gold" },
  { name: "TASKS", icon: CheckSquare, id: "tasks", color: "bg-soft-lavender" },
  { name: "VOICE", icon: Megaphone, id: "voice", color: "bg-sacred-teal" },
  { name: "LEARN", icon: PlayCircle, id: "learn", color: "bg-royal-plum" },
  { name: "EMPIRE", icon: Building2, id: "empire", color: "bg-deep-indigo" },
  { name: "TITANIUM", icon: Puzzle, id: "titanium", color: "bg-warm-gold" },
  { name: "AI", icon: Sparkles, id: "ai", color: "bg-sacred-teal" },
];

const tasks = [
  { id: 1, title: "Review LifeCharter Circle applications", priority: "high", column: "today" },
  { id: 2, title: "Draft newsletter for Letterman", priority: "medium", column: "in-progress" },
  { id: 3, title: "Approve social media posts", priority: "low", column: "waiting" },
];

const emails = [
  { id: 1, subject: "RE: Speaking opportunity - Denver Conference", tag: "VIP", tagColor: "bg-warm-gold" },
  { id: 2, subject: "LifeCharter Incubator registration", tag: "Action", tagColor: "bg-sacred-teal" },
  { id: 3, subject: "Your weekly analytics report", tag: "FYI", tagColor: "bg-soft-lavender" },
];

const schedule = [
  { time: "9:00 AM", event: "Team Standup", color: "bg-sacred-teal" },
  { time: "11:00 AM", event: "Client Call", color: "bg-royal-plum" },
  { time: "2:00 PM", event: "Content Creation", color: "bg-warm-gold" },
  { time: "4:00 PM", event: "LifeCharter Circle", color: "bg-deep-indigo" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="flex h-screen bg-ivory-light">
      {/* Sidebar */}
      <aside className="w-64 bg-deep-indigo text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦋</span>
            <div>
              <h1 className="font-serif text-lg font-medium">LifeCharter</h1>
              <p className="text-xs text-white/60">Executive Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-white/10 text-warm-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">{item.name}</span>
              {item.id === "inbox" && (
                <span className="ml-auto bg-warm-gold text-deep-indigo text-xs font-bold px-2 py-0.5 rounded-full">
                  12
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warm-gold flex items-center justify-center text-deep-indigo font-bold">
              B
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Babs</p>
              <p className="text-xs text-white/60">Alignment Architect</p>
            </div>
            <Settings className="w-5 h-5 text-white/60 hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-soft-taupe/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-deep-indigo">
                Good morning, Babs 🦋
              </h2>
              <p className="text-soft-taupe mt-1">
                Here&apos;s your executive briefing for today
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-warm-gold text-deep-indigo rounded-lg font-medium hover:bg-warm-gold/90 transition-colors">
                Start My Day
              </button>
              <button className="px-4 py-2 border border-deep-indigo text-deep-indigo rounded-lg font-medium hover:bg-deep-indigo hover:text-white transition-colors">
                Create Content
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Morning Brief */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-deep-indigo">Your Morning Brief</h3>
                <span className="text-2xl">🦋</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sacred-teal mt-0.5" />
                  <span className="text-deep-indigo/80">3 meetings today - first at 9:00 AM</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-royal-plum mt-0.5" />
                  <span className="text-deep-indigo/80">12 tasks require attention</span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-warm-gold mt-0.5" />
                  <span className="text-deep-indigo/80">$4,250 revenue received</span>
                </li>
              </ul>
            </div>

            {/* Calendar Snapshot */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
              <h3 className="font-serif text-lg text-deep-indigo mb-4">Today&apos;s Schedule</h3>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-soft-taupe w-16">{item.time}</span>
                    <span className="text-deep-indigo/80 text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Pulse */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
              <h3 className="font-serif text-lg text-deep-indigo mb-4">Financial Pulse</h3>
              <div className="mb-4">
                <span className="text-4xl font-serif text-warm-gold">$24,580</span>
                <p className="text-sm text-soft-taupe mt-1">Month to date</p>
              </div>
              <div className="flex items-center gap-2 text-sacred-teal mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12% from last month</span>
              </div>
              <div className="flex items-center gap-2 text-royal-plum bg-royal-plum/10 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">3 bills due this week</span>
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-5 gap-6">
            {/* Task Board */}
            <div className="col-span-3 bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-deep-indigo">Priority Tasks</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-deep-indigo text-white rounded-lg text-sm hover:bg-royal-plum transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["Today", "In Progress", "Waiting"].map((column) => (
                  <div key={column} className="bg-ivory-light rounded-lg p-3">
                    <h4 className="text-xs font-medium text-soft-taupe uppercase tracking-wider mb-3">
                      {column}
                    </h4>
                    <div className="space-y-2">
                      {tasks
                        .filter((t) => t.column === column.toLowerCase().replace(" ", "-"))
                        .map((task) => (
                          <div
                            key={task.id}
                            className="bg-white p-3 rounded-lg shadow-sm border border-soft-taupe/10 cursor-move hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 ${
                                  task.priority === "high"
                                    ? "bg-red-400"
                                    : task.priority === "medium"
                                    ? "bg-warm-gold"
                                    : "bg-sacred-teal"
                                }`}
                              />
                              <p className="text-sm text-deep-indigo/80">{task.title}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Preview */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-deep-indigo">Inbox</h3>
                <span className="bg-warm-gold text-deep-indigo text-xs font-bold px-2 py-1 rounded-full">
                  12 unread
                </span>
              </div>
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="p-3 rounded-lg border border-soft-taupe/10 hover:bg-ivory-light transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-deep-indigo/80 line-clamp-2">{email.subject}</p>
                      <span className={`${email.tagColor} text-deep-indigo text-xs px-2 py-0.5 rounded-full whitespace-nowrap`}>
                        {email.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 text-sm text-deep-indigo border border-deep-indigo rounded-lg hover:bg-deep-indigo hover:text-white transition-colors">
                  Quick Reply
                </button>
                <button className="flex-1 py-2 text-sm text-soft-taupe border border-soft-taupe rounded-lg hover:bg-soft-taupe hover:text-white transition-colors">
                  Mark Read
                </button>
              </div>
            </div>
          </div>

          {/* AI Assistant Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-soft-taupe/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-plum to-sacred-teal flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-deep-indigo font-medium mb-2">Ask me anything...</p>
                <div className="flex gap-3 text-sm">
                  <button className="px-3 py-1.5 bg-ivory-light text-deep-indigo/70 rounded-full hover:bg-soft-lavender/30 transition-colors">
                    What&apos;s my focus today?
                  </button>
                  <button className="px-3 py-1.5 bg-ivory-light text-deep-indigo/70 rounded-full hover:bg-soft-lavender/30 transition-colors">
                    Schedule focus time
                  </button>
                  <button className="px-3 py-1.5 bg-ivory-light text-deep-indigo/70 rounded-full hover:bg-soft-lavender/30 transition-colors">
                    Draft email to team
                  </button>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full bg-warm-gold flex items-center justify-center hover:bg-warm-gold/90 transition-colors">
                <Mic className="w-5 h-5 text-deep-indigo" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}