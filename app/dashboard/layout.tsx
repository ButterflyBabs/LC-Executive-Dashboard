"use client";

import { useState, useEffect } from "react";
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
  Layers,
  Target,
  TrendingUp,
  FileText,
  Compass,
  Briefcase,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Navigation structure with sections
const navigationSections = [
  {
    title: "DAILY OPERATIONS",
    color: "text-gold",
    items: [
      { name: "TODAY", icon: Home, href: "/dashboard" },
      { name: "TIME", icon: Calendar, href: "/dashboard/time" },
      { name: "INBOX", icon: Mail, href: "/dashboard/inbox" },
      { name: "TASKS", icon: CheckSquare, href: "/dashboard/tasks" },
      { name: "REVENUE", icon: DollarSign, href: "/dashboard/money" },
      { name: "SOCIAL", icon: Megaphone, href: "/dashboard/social" },
    ],
  },
  {
    title: "STRATEGIC PLANNING",
    color: "text-teal",
    items: [
      { name: "PLANNING HUB", icon: Compass, href: "/dashboard/planning" },
      { name: "BUSINESS PLAN", icon: Briefcase, href: "/dashboard/planning/business" },
      { name: "MARKETING PLAN", icon: Megaphone, href: "/dashboard/planning/marketing" },
      { name: "SALES PLAN", icon: TrendingUp, href: "/dashboard/planning/sales" },
      { name: "FORECASTING", icon: Target, href: "/dashboard/planning/forecasting" },
    ],
  },
  {
    title: "BUSINESS SEGMENTS",
    color: "text-plum",
    items: [
      { name: "ALL SEGMENTS", icon: Layers, href: "/dashboard/segments" },
      { name: "DIMENSIONS", icon: BarChart3, href: "/dashboard/dimensions" },
      { name: "SACRED KALEIDOSCOPE", icon: Building2, href: "/dashboard/sacred-kaleidoscope" },
    ],
  },
  {
    title: "CONTENT & GROWTH",
    color: "text-sage",
    items: [
      { name: "VOICE", icon: Megaphone, href: "/dashboard/voice" },
      { name: "LEARN", icon: PlayCircle, href: "/dashboard/learn" },
    ],
  },
  {
    title: "SYSTEMS",
    color: "text-soft-taupe",
    items: [
      { name: "TITANIUM", icon: Puzzle, href: "/dashboard/titanium" },
      { name: "AI", icon: Sparkles, href: "/dashboard/ai" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-navy text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile
            ? isMobileOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full w-72"
            : isCollapsed
              ? "w-20"
              : "w-72"
          }
        `}
      >
        {/* Logo */}
        <div
          className={`
            border-b border-white/10 sticky top-0 bg-navy z-10
            ${isCollapsed && !isMobile ? "p-4" : "p-6"}
            transition-all duration-300
          `}
        >
          <div className="flex items-center gap-3">
            {/* Butterfly Logo */}
            <div className={`flex-shrink-0 transition-all duration-300 ${isCollapsed && !isMobile ? "w-10 h-10" : "w-10 h-10"}`}>
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M20 35C20 35 12 28 12 20C12 12 16 8 20 8C24 8 28 12 28 20C28 28 20 35 20 35Z" fill="#c9a227"/>
                <path d="M20 8C20 8 8 12 8 22C8 30 16 32 20 35C24 32 32 30 32 22C32 12 20 8 20 8Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M20 8L20 35" stroke="white" strokeWidth="1"/>
                <ellipse cx="14" cy="18" rx="5" ry="8" fill="white" opacity="0.9"/>
                <ellipse cx="26" cy="18" rx="5" ry="8" fill="white" opacity="0.9"/>
                <circle cx="20" cy="14" r="2" fill="#c9a227"/>
              </svg>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden">
                <h1 className="font-serif text-xl font-medium tracking-wide whitespace-nowrap">LifeCharter</h1>
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase whitespace-nowrap">Executive Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${isCollapsed && !isMobile ? "py-4 px-2" : "py-4 px-3"}`}>
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? (isCollapsed && !isMobile ? "mt-4" : "mt-6") : ""}>
              {/* Section Header */}
              {(!isCollapsed || isMobile) ? (
                <div className="px-4 mb-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${section.color.replace('text-', 'bg-')}`} />
                  <h3 className={`text-[10px] font-bold tracking-[0.15em] ${section.color} uppercase whitespace-nowrap`}>
                    {section.title}
                  </h3>
                </div>
              ) : (
                <div className="px-2 mb-2 flex justify-center">
                  <div className={`w-2 h-2 rounded-full ${section.color.replace('text-', 'bg-')}`} />
                </div>
              )}

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        w-full flex items-center rounded-xl transition-all duration-200
                        ${isCollapsed && !isMobile
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-4 py-2.5"
                        }
                        ${isActive
                          ? "bg-white/10 text-gold border-l-2 border-gold"
                          : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                        }
                      `}
                      title={isCollapsed && !isMobile ? item.name : undefined}
                    >
                      <item.icon className={`flex-shrink-0 ${isCollapsed && !isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="font-medium text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                          {item.name === "INBOX" && (
                            <span className="ml-auto bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                              12
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider between sections */}
              {sectionIndex < navigationSections.length - 1 && (
                <div className={`mt-4 border-t border-white/10 ${isCollapsed && !isMobile ? "mx-2" : "mx-4"}`} />
              )}
            </div>
          ))}
        </nav>

        {/* Brand Tagline */}
        {(!isCollapsed || isMobile) && (
          <div className="px-6 py-3">
            <p className="text-[10px] text-white/30 text-center italic font-serif whitespace-nowrap">
              &ldquo;Sacred Kaleidoscope&rdquo;
            </p>
          </div>
        )}

        {/* User */}
        <div
          className={`
            m-4 bg-white/5 rounded-2xl border border-white/10 sticky bottom-4
            ${isCollapsed && !isMobile ? "p-2" : "p-4"}
            transition-all duration-300
          `}
        >
          <div className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : "gap-3"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-navy font-bold text-lg flex-shrink-0">
              B
            </div>
            {(!isCollapsed || isMobile) && (
              <>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium text-sm truncate">Babs</p>
                  <p className="text-xs text-white/50 truncate">Alignment Architect</p>
                </div>
                <Settings className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Breadcrumb / Page Title */}
            <h1 className="text-lg font-serif font-medium text-navy hidden sm:block">
              {navigationSections
                .flatMap(s => s.items)
                .find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search - hidden on smallest screens */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-32 lg:w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Quick Actions Dropdown */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors">
              <span className="text-sm font-medium">+ New</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
