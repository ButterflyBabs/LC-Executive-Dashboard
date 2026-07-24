"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Mic,
  Clock,
  TrendingUp,
  Bell,
  Search,
  CheckSquare,
  DollarSign,
  Mail,
  Sparkles,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ColorKey } from "@/components/ui/color-key";

// Types
interface Business {
  id: number;
  name: string;
  icon: string;
  color: string;
  slug: string;
}

interface Segment {
  id: number;
  name: string;
  icon: string;
  color: string;
  businessId: number;
}

interface DashboardCard {
  id: string;
  type: "morning-brief" | "calendar" | "financial" | "tasks" | "inbox" | "ai-assistant";
  title: string;
  expanded: boolean;
  color: string;
}

const defaultCards: DashboardCard[] = [
  { id: "morning-brief", type: "morning-brief", title: "Your Morning Brief", expanded: true, color: "#c9a227" },
  { id: "calendar", type: "calendar", title: "Today's Schedule", expanded: true, color: "#2E7C83" },
  { id: "financial", type: "financial", title: "Financial Pulse", expanded: true, color: "#D4AF63" },
  { id: "tasks", type: "tasks", title: "Priority Tasks", expanded: true, color: "#5E3B6C" },
  { id: "inbox", type: "inbox", title: "Inbox", expanded: true, color: "#1F315B" },
  { id: "ai-assistant", type: "ai-assistant", title: "AI Assistant", expanded: true, color: "#7B6B8D" },
];

// Sample segment data with colors
const sampleSegments: Segment[] = [
  // LifeCharter Core
  { id: 1, name: "Incubator", icon: "🥚", color: "#7B4F8C", businessId: 1 },
  { id: 2, name: "Circle", icon: "⭕", color: "#5E3B6C", businessId: 1 },
  { id: 3, name: "Self-Directed", icon: "📚", color: "#4A2E55", businessId: 1 },
  { id: 4, name: "Conversations", icon: "🎙️", color: "#8B6B9C", businessId: 1 },
  // Command Suite
  { id: 5, name: "Bot Builder", icon: "🤖", color: "#3A9CA5", businessId: 2 },
  { id: 6, name: "Dashboard", icon: "📊", color: "#2E7C83", businessId: 2 },
  // AmiLynne Speaks
  { id: 7, name: "Keynotes", icon: "🎤", color: "#E4C473", businessId: 3 },
  { id: 8, name: "Workshops", icon: "👥", color: "#D4AF63", businessId: 3 },
];

const sampleBusinesses: Business[] = [
  { id: 1, name: "LifeCharter Core", icon: "🦋", color: "#5E3B6C", slug: "lifecharter-core" },
  { id: 2, name: "Command Suite", icon: "⚡", color: "#2E7C83", slug: "command-suite" },
  { id: 3, name: "AmiLynne Speaks", icon: "🎤", color: "#D4AF63", slug: "amilynne-speaks" },
];

// Draggable Card Component
function DraggableDashboardCard({
  card,
  children,
  onToggle,
  onRemove,
}: {
  card: DashboardCard;
  children: React.ReactNode;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl soft-shadow overflow-hidden ${
        isDragging ? "shadow-2xl ring-2 ring-gold z-50" : ""
      }`}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggle(card.id)}
      >
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-soft-taupe" />
          </button>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: card.color }}
          />
          <h3 className="font-serif text-xl text-navy">{card.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            {card.expanded ? (
              <ChevronUp className="w-5 h-5 text-soft-taupe" />
            ) : (
              <ChevronDown className="w-5 h-5 text-soft-taupe" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(card.id);
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-soft-taupe hover:text-red-500" />
          </button>
        </div>
      </div>
      {card.expanded && <div className="p-6">{children}</div>}
    </div>
  );
}

// Segment Item Component
function SegmentItem({ 
  segment, 
  children 
}: { 
  segment: Segment; 
  children: React.ReactNode 
}) {
  return (
    <div className="border-l-4 pl-4 py-2 mb-3" style={{ borderColor: segment.color }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{segment.icon}</span>
        <span className="font-medium text-navy text-sm">{segment.name}</span>
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [cards, setCards] = useState<DashboardCard[]>(defaultCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [segments, setSegments] = useState<Segment[]>(sampleSegments);
  const [businesses, setBusinesses] = useState<Business[]>(sampleBusinesses);

  useEffect(() => {
    // Fetch real data here
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await fetch("/api/segments");
      if (res.ok) {
        const data = await res.json();
        if (data.segments?.length > 0) {
          setSegments(data.segments.map((s: any) => ({
            id: s.id,
            name: s.name,
            icon: s.icon,
            color: s.color,
            businessId: s.businessId,
          })));
        }
      }
    } catch (e) {
      console.log("Using sample segment data");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCard = (id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, expanded: !card.expanded } : card
      )
    );
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const addCard = (type: DashboardCard["type"]) => {
    const newCard: DashboardCard = {
      id: `${type}-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " "),
      expanded: true,
      color: "#c9a227",
    };
    setCards([...cards, newCard]);
    setShowAddCard(false);
  };

  const getSegmentItems = (type: string) => {
    // This would fetch real data per segment
    const itemsBySegment: Record<number, any[]> = {
      1: [ // Incubator
        { icon: Clock, text: "2 new applications", time: "9:00 AM", color: "text-teal" },
        { icon: CheckSquare, text: "Review pending", count: 5, color: "text-plum" },
        { icon: DollarSign, text: "$1,200 revenue", color: "text-gold" },
      ],
      2: [ // Circle
        { icon: Calendar, text: "Weekly call", time: "11:00 AM", color: "text-teal" },
        { icon: CheckSquare, text: "Prepare materials", color: "text-plum" },
        { icon: Mail, text: "3 member messages", color: "text-navy" },
      ],
      3: [ // Self-Directed
        { icon: TrendingUp, text: "15 new signups", color: "text-green" },
        { icon: CheckSquare, text: "Update course content", color: "text-plum" },
      ],
      4: [ // Conversations
        { icon: Mic, text: "Record episode 147", time: "2:00 PM", color: "text-red" },
        { icon: CheckSquare, text: "Edit yesterday's recording", color: "text-plum" },
        { icon: Mail, text: "5 listener emails", color: "text-navy" },
      ],
      5: [ // Bot Builder
        { icon: CheckSquare, text: "Debug API integration", color: "text-plum" },
        { icon: AlertCircle, text: "1 urgent ticket", color: "text-red" },
      ],
      6: [ // Dashboard
        { icon: CheckSquare, text: "Build card components", color: "text-plum" },
        { icon: TrendingUp, text: "Performance review", color: "text-green" },
      ],
      7: [ // Keynotes
        { icon: Calendar, text: "Denver Conference", time: "Next week", color: "text-teal" },
        { icon: CheckSquare, text: "Draft presentation", color: "text-plum" },
      ],
      8: [ // Workshops
        { icon: Calendar, text: "Alignment Workshop", time: "Friday", color: "text-teal" },
        { icon: CheckSquare, text: "Prepare materials", color: "text-plum" },
        { icon: DollarSign, text: "$3,500 booked", color: "text-gold" },
      ],
    };
    return itemsBySegment;
  };

  const renderCardContent = (card: DashboardCard) => {
    const segmentItems = getSegmentItems(card.type);

    switch (card.type) {
      case "morning-brief":
        return (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {segments.map((segment) => {
              const items = segmentItems[segment.id] || [];
              if (items.length === 0) return null;
              return (
                <SegmentItem key={segment.id} segment={segment}>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-navy/70">{item.text}</span>
                        {item.time && <span className="text-soft-taupe text-xs">({item.time})</span>}
                        {item.count && <span className="text-gold font-medium">{item.count}</span>}
                      </div>
                    ))}
                  </div>
                </SegmentItem>
              );
            })}
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {segments.map((segment) => {
              const items = segmentItems[segment.id] || [];
              const calendarItems = items.filter((i: any) => i.icon === Calendar || i.time);
              if (calendarItems.length === 0) return null;
              return (
                <SegmentItem key={segment.id} segment={segment}>
                  <div className="space-y-1">
                    {calendarItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-teal" />
                        <span className="text-navy/70">{item.text}</span>
                        <span className="text-soft-taupe text-xs ml-auto">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </SegmentItem>
              );
            })}
          </div>
        );

      case "financial":
        return (
          <div className="space-y-4">
            {/* Main Financial Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 mb-1">Today's Income</p>
                <p className="text-2xl font-bold text-green-700">$1,497</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+23% vs yesterday</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600 mb-1">Today's Expenses</p>
                <p className="text-2xl font-bold text-red-700">$482</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                  <span className="text-xs text-red-600">+5% vs yesterday</span>
                </div>
              </div>
            </div>

            {/* Net & Period Summary */}
            <div className="bg-gold/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy/70">Net for Today</p>
                  <p className="text-3xl font-serif text-navy">$1,015</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-soft-taupe">MTD Revenue</p>
                  <p className="text-lg font-semibold text-navy">$18,450</p>
                </div>
              </div>
            </div>

            {/* Segment Revenue Breakdown */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs font-medium text-soft-taupe uppercase tracking-wider mb-2">Revenue by Segment</p>
              {[
                { name: "LifeCharter Circle", amount: 597, color: "#5E3B6C", icon: "⭕" },
                { name: "LifeCharter Incubator", amount: 450, color: "#7B4F8C", icon: "🥚" },
                { name: "Command Suite", amount: 300, color: "#2E7C83", icon: "⚡" },
                { name: "AmiLynne Speaks", amount: 150, color: "#D4AF63", icon: "🎤" },
              ].map((segment) => (
                <div key={segment.name} className="flex items-center justify-between p-2 bg-cream-dark/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{segment.icon}</span>
                    <span className="text-sm text-navy">{segment.name}</span>
                  </div>
                  <span className="font-semibold text-navy">${segment.amount}</span>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <a 
                href="/dashboard/money" 
                className="flex-1 py-2 text-center text-sm text-navy bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors"
              >
                View Full Money Tab
              </a>
              <a 
                href="/dashboard/money?tab=pnl" 
                className="flex-1 py-2 text-center text-sm text-navy bg-navy/5 rounded-lg hover:bg-navy/10 transition-colors"
              >
                Generate P&L
              </a>
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {segments.map((segment) => {
              const items = segmentItems[segment.id] || [];
              const taskItems = items.filter((i: any) => i.icon === CheckSquare || i.icon === AlertCircle);
              if (taskItems.length === 0) return null;
              return (
                <SegmentItem key={segment.id} segment={segment}>
                  <div className="space-y-1">
                    {taskItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {item.icon === AlertCircle ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckSquare className="w-4 h-4 text-plum" />
                        )}
                        <span className="text-navy/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </SegmentItem>
              );
            })}
          </div>
        );

      case "inbox":
        return (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {segments.map((segment) => {
              const items = segmentItems[segment.id] || [];
              const mailItems = items.filter((i: any) => i.icon === Mail);
              if (mailItems.length === 0) return null;
              return (
                <SegmentItem key={segment.id} segment={segment}>
                  <div className="space-y-1">
                    {mailItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-navy" />
                        <span className="text-navy/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </SegmentItem>
              );
            })}
            <button className="w-full mt-4 py-3 text-sm text-navy border border-navy/20 rounded-xl hover:bg-navy hover:text-white transition-all font-medium">
              View All Emails
            </button>
          </div>
        );

      case "ai-assistant":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-plum to-teal flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-navy font-medium text-lg truncate">Ask me anything...</p>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center hover:bg-gold-light transition-all shadow-glow flex-shrink-0">
                <Mic className="w-5 h-5 text-navy" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all whitespace-nowrap">
                What&apos;s my focus today?
              </button>
              <button className="px-3 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all whitespace-nowrap">
                Schedule focus time
              </button>
              <button className="px-3 py-2 bg-cream-dark/50 text-navy/60 rounded-full text-sm hover:bg-lavender/50 hover:text-navy transition-all whitespace-nowrap">
                Draft email to team
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-soft-taupe mb-2">Quick actions by segment:</p>
              <div className="flex flex-wrap gap-2">
                {segments.slice(0, 4).map((segment) => (
                  <button
                    key={segment.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: segment.color }}
                  >
                    {segment.icon} {segment.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-serif text-navy">Good morning, Babs</h2>
              <span className="text-2xl">🦋</span>
            </div>
            <p className="text-soft-taupe text-sm">Thursday, July 23</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-navy/60 hover:text-navy transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-navy/60 hover:text-navy transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full"></span>
            </button>
            <button 
              onClick={() => setShowAddCard(true)}
              className="px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="px-8 pb-8">
        {/* Main Cards Grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-6">
              {cards.map((card) => (
                <DraggableDashboardCard
                  key={card.id}
                  card={card}
                  onToggle={toggleCard}
                  onRemove={removeCard}
                >
                  {renderCardContent(card)}
                </DraggableDashboardCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Color Key - Horizontal at Bottom */}
        <div className="mt-8">
          <ColorKey />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
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

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-serif text-navy mb-4">Add Card to Dashboard</h3>
            <div className="space-y-2">
              {[
                { type: "morning-brief", label: "Morning Brief", color: "#c9a227" },
                { type: "calendar", label: "Calendar", color: "#2E7C83" },
                { type: "financial", label: "Financial Pulse", color: "#D4AF63" },
                { type: "tasks", label: "Priority Tasks", color: "#5E3B6C" },
                { type: "inbox", label: "Inbox", color: "#1F315B" },
                { type: "ai-assistant", label: "AI Assistant", color: "#7B6B8D" },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => addCard(option.type as DashboardCard["type"])}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />
                  <span className="text-navy">{option.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddCard(false)}
              className="w-full mt-4 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
