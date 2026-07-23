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
} from "lucide-react";

// Types
interface Business {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  businessId: number | null;
  dimensions: string[];
  dueDate: string | null;
  createdAt: string;
  business: Business | null;
}

const columns = [
  { id: "backlog", name: "Backlog", color: "bg-gray-100" },
  { id: "today", name: "Today", color: "bg-blue-50" },
  { id: "in_progress", name: "In Progress", color: "bg-yellow-50" },
  { id: "waiting", name: "Waiting", color: "bg-purple-50" },
  { id: "done", name: "Done", color: "bg-green-50" },
];

const priorities = [
  { id: "low", name: "Low", color: "bg-green-400" },
  { id: "medium", name: "Medium", color: "bg-yellow-400" },
  { id: "high", name: "High", color: "bg-orange-400" },
  { id: "critical", name: "Critical", color: "bg-red-400" },
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
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "backlog",
    priority: "medium",
    businessId: "",
    dimensions: [] as string[],
    dueDate: "",
  });

  // Fetch tasks and businesses
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, businessesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/businesses"),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks);
      }

      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData.businesses);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority: string) => {
    return priorities.find((p) => p.id === priority)?.color || "bg-gray-400";
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Tasks</h1>
          <p className="text-soft-taupe">Manage your work across all businesses and dimensions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
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
                  {tasks.filter((t) => t.status === column.id).length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className={`${column.color} rounded-b-xl p-4 min-h-[400px]`}>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white rounded-xl p-4 soft-shadow cursor-move hover:shadow-lg transition-all group"
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="text-xs text-soft-taupe uppercase font-medium">
                            {task.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-soft-taupe hover:text-red-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Task Title */}
                      <h4 className="font-medium text-navy mb-2">{task.title}</h4>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-navy/60 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Business Tag */}
                      {task.business && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{task.business.icon}</span>
                          <span className="text-xs text-navy/70">{task.business.name}</span>
                        </div>
                      )}

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

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-soft-taupe">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
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
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Business</label>
                <select
                  value={formData.businessId}
                  onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
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
