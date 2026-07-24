"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Calendar,
  Flag,
  Building2,
  Tag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Filter,
  ChevronDown,
  Search,
  Layers,
  Briefcase,
  Target,
  Zap,
  Coffee,
} from "lucide-react";

// Types
interface Business {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface Segment {
  id: number;
  name: string;
  slug: string;
  color: string;
  businessId: number;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  businessId: number | null;
  segmentId: number | null;
  dimensions: string[];
  dueDate: string | null;
  createdAt: string;
  business: Business | null;
  segment: Segment | null;
}

const columns = [
  { id: "backlog", name: "Backlog", color: "bg-gray-100" },
  { id: "today", name: "Today", color: "bg-blue-50" },
  { id: "in_progress", name: "In Progress", color: "bg-yellow-50" },
  { id: "waiting", name: "Waiting", color: "bg-purple-50" },
  { id: "done", name: "Done", color: "bg-green-50" },
];

// 5 Priority Statuses with icons and descriptions
const priorities = [
  { 
    id: "critical", 
    name: "Critical", 
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: AlertCircle,
    description: "Must do today - blocks other work"
  },
  { 
    id: "high", 
    name: "High", 
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Zap,
    description: "Important - do this week"
  },
  { 
    id: "medium", 
    name: "Medium", 
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Target,
    description: "Should do - schedule soon"
  },
  { 
    id: "low", 
    name: "Low", 
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Coffee,
    description: "Nice to have - when time permits"
  },
  { 
    id: "optional", 
    name: "Optional", 
    color: "bg-gray-400",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: Circle,
    description: "Backlog - revisit later"
  },
];

const dimensions = [
  { id: "marketing", name: "Marketing", color: "bg-pink-100 text-pink-700" },
  { id: "sales", name: "Sales", color: "bg-green-100 text-green-700" },
  { id: "operations", name: "Operations", color: "bg-blue-100 text-blue-700" },
  { id: "finance", name: "Finance", color: "bg-emerald-100 text-emerald-700" },
  { id: "team", name: "Team", color: "bg-purple-100 text-purple-700" },
  { id: "systems", name: "Systems", color: "bg-indigo-100 text-indigo-700" },
  { id: "leadership", name: "Leadership", color: "bg-amber-100 text-amber-700" },
  { id: "vision", name: "Vision", color: "bg-cyan-100 text-cyan-700" },
  { id: "product", name: "Product", color: "bg-rose-100 text-rose-700" },
  { id: "customer_experience", name: "Customer Experience", color: "bg-teal-100 text-teal-700" },
  { id: "legal", name: "Legal", color: "bg-slate-100 text-slate-700" },
  { id: "sustainability", name: "Sustainability", color: "bg-lime-100 text-lime-700" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filters
  const [filterBusiness, setFilterBusiness] = useState<string>("");
  const [filterSegment, setFilterSegment] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "backlog",
    priority: "medium",
    businessId: "",
    segmentId: "",
    dimensions: [] as string[],
    dueDate: "",
  });

  // Fetch tasks, businesses, and segments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, businessesRes, segmentsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/businesses"),
        fetch("/api/segments"),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks);
      }

      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData.businesses);
      }

      if (segmentsRes.ok) {
        const segmentsData = await segmentsRes.json();
        setSegments(segmentsData.segments);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterBusiness && task.businessId?.toString() !== filterBusiness) return false;
    if (filterSegment && task.segmentId?.toString() !== filterSegment) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Get segments for selected business
  const getSegmentsForBusiness = (businessId: string) => {
    if (!businessId) return [];
    return segments.filter((s) => s.businessId === parseInt(businessId));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessId: formData.businessId ? parseInt(formData.businessId) : null,
          segmentId: formData.segmentId ? parseInt(formData.segmentId) : null,
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          title: "",
          description: "",
          status: "backlog",
          priority: "medium",
          businessId: "",
          segmentId: "",
          dimensions: [],
          dueDate: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== columnId) {
      await handleUpdateTask(taskId, { status: columnId });
    }
  };

  const toggleDimension = (dimensionId: string) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: prev.dimensions.includes(dimensionId)
        ? prev.dimensions.filter((d) => d !== dimensionId)
        : [...prev.dimensions, dimensionId],
    }));
  };

  const getPriorityInfo = (priorityId: string) => {
    return priorities.find((p) => p.id === priorityId) || priorities[2];
  };

  const getPriorityCount = (priorityId: string) => {
    return filteredTasks.filter((t) => t.priority === priorityId && t.status !== "done").length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Tasks</h1>
          <p className="text-soft-taupe">Manage work across all business segments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Priority Overview */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {priorities.map((priority) => {
          const count = getPriorityCount(priority.id);
          const Icon = priority.icon;
          return (
            <div
              key={priority.id}
              onClick={() => setFilterPriority(filterPriority === priority.id ? "" : priority.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                filterPriority === priority.id
                  ? `${priority.borderColor} ${priority.bgColor}`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${priority.bgColor}`}>
                  <Icon className={`w-4 h-4 ${priority.textColor}`} />
                </div>
                <span className={`text-sm font-medium ${priority.textColor}`}>{priority.name}</span>
              </div>
              <p className="text-2xl font-bold text-navy">{count}</p>
              <p className="text-xs text-soft-taupe mt-1">{priority.description}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl soft-shadow">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-soft-taupe" />
          <span className="text-sm font-medium text-navy">Filter by:</span>
        </div>
        
        {/* Business Filter */}
        <select
          value={filterBusiness}
          onChange={(e) => {
            setFilterBusiness(e.target.value);
            setFilterSegment(""); // Reset segment when business changes
          }}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy outline-none"
        >
          <option value="">All Businesses</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.icon} {b.name}
            </option>
          ))}
        </select>

        {/* Segment Filter */}
        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy outline-none"
          disabled={!filterBusiness}
        >
          <option value="">All Segments</option>
          {getSegmentsForBusiness(filterBusiness).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy outline-none"
          />
        </div>

        {/* Clear Filters */}
        {(filterBusiness || filterSegment || filterPriority || searchQuery) && (
          <button
            onClick={() => {
              setFilterBusiness("");
              setFilterSegment("");
              setFilterPriority("");
              setSearchQuery("");
            }}
            className="text-sm text-teal hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`${column.color} rounded-t-xl px-4 py-3 border-b border-white/50`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy">{column.name}</h3>
                <span className="bg-white/70 text-navy/70 text-xs px-2 py-1 rounded-full font-medium">
                  {filteredTasks.filter((t) => t.status === column.id).length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className={`${column.color} rounded-b-xl p-4 min-h-[400px]`}>
              <div className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === column.id)
                  .map((task) => {
                    const priorityInfo = getPriorityInfo(task.priority);
                    const PriorityIcon = priorityInfo.icon;
                    
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-white rounded-xl p-4 soft-shadow cursor-move hover:shadow-lg transition-all group"
                      >
                        {/* Priority Badge */}
                        <div className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-lg ${priorityInfo.bgColor} w-fit`}>
                          <PriorityIcon className={`w-3 h-3 ${priorityInfo.textColor}`} />
                          <span className={`text-xs font-medium ${priorityInfo.textColor}`}>
                            {priorityInfo.name}
                          </span>
                        </div>

                        {/* Task Title */}
                        <h4 className="font-medium text-navy mb-2">{task.title}</h4>

                        {/* Task Description */}
                        {task.description && (
                          <p className="text-sm text-navy/60 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        {/* Business & Segment */}
                        <div className="space-y-1 mb-3">
                          {task.business && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{task.business.icon}</span>
                              <span className="text-xs text-navy/70">{task.business.name}</span>
                            </div>
                          )}
                          {task.segment && (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: task.segment.color }}
                              />
                              <span className="text-xs text-soft-taupe">{task.segment.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Dimensions */}
                        {task.dimensions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {task.dimensions.slice(0, 3).map((dim) => {
                              const dimInfo = dimensions.find((d) => d.id === dim);
                              return (
                                <span
                                  key={dim}
                                  className={`text-[10px] px-2 py-1 rounded-full ${dimInfo?.color || "bg-gray-100"}`}
                                >
                                  {dimInfo?.name || dim}
                                </span>
                              );
                            })}
                            {task.dimensions.length > 3 && (
                              <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                +{task.dimensions.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          {/* Due Date */}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-soft-taupe">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-soft-taupe hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Add New Task</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-soft-taupe hover:text-navy"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none h-24 resize-none"
                  placeholder="Add details..."
                />
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  >
                    {priorities.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business & Segment */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Business</label>
                  <select
                    value={formData.businessId}
                    onChange={(e) => {
                      setFormData({ ...formData, businessId: e.target.value, segmentId: "" });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  >
                    <option value="">Select a business...</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.icon} {business.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Segment</label>
                  <select
                    value={formData.segmentId}
                    onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    disabled={!formData.businessId}
                  >
                    <option value="">Select a segment...</option>
                    {getSegmentsForBusiness(formData.businessId).map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">
                  12 Business Dimensions
                </label>
                <div className="flex flex-wrap gap-2">
                  {dimensions.map((dim) => (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => toggleDimension(dim.id)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.dimensions.includes(dim.id)
                          ? dim.color
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {dim.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
