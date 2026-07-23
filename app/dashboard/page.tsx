"use client";

import { useState } from "react";
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
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

// Types for dashboard cards
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
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5 text-soft-taupe" />
          </button>
          
          {/* Color Indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: card.color }}
          />
          
          {/* Title */}
          <h3 className="font-serif text-xl text-navy">{card.title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Expand/Collapse */}
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            {card.expanded ? (
              <ChevronUp className="w-5 h-5 text-soft-taupe" />
            ) : (
              <ChevronDown className="w-5 h-5 text-soft-taupe" />
            )}
          </button>
          
          {/* Remove */}
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
      
      {/* Card Content */}
      {card.expanded && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}

// Sample data
const schedule = [
  { time: "9:00 AM", event: "Team Standup", color: "bg-teal" },
  { time: "11:00 AM", event: "Client Call", color: "bg-plum" },
  { time: "2:00 PM", event: "Content Creation", color: "bg-gold" },
  { time: "4:00 PM", event: "LifeCharter Circle", color: "bg-navy" },
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

export default function Dashboard() {
  const [cards, setCards] = useState<DashboardCard[]>(defaultCards);
  const [showAddCard, setShowAddCard] = useState(false);

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

  const renderCardContent = (card: DashboardCard) => {
    switch (card.type) {
      case "morning-brief":
        return (
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
        );

      case "calendar":
        return (
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-soft-taupe w-16 font-medium">{item.time}</span>
                <span className="text-navy/80 text-sm">{item.event}</span>
              </div>
            ))}
          </div>
        );

      case "financial":
        return (
          <div>
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
        );

      case "tasks":
        return (
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
        );

      case "inbox":
        return (
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
            <button className="w-full py-3 text-sm text-navy border border-navy/20 rounded-xl hover:bg-navy hover:text-white transition-all font-medium">
              View All Emails
            </button>
          </div>
        );

      case "ai-assistant":
        return (
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

      {/* Dashboard Content with Drag and Drop */}
      <div className="px-8 pb-8">
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

        {/* Footer Branding */}
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
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
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
