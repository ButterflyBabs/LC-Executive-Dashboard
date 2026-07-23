"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  Edit3,
  Plus,
  MoreHorizontal,
} from "lucide-react";

// Types
interface Segment {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  health: "healthy" | "attention" | "at_risk";
  revenueTarget: number | null;
  business: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
}

interface DimensionScore {
  dimension: string;
  score: number;
  health: "healthy" | "attention" | "at_risk";
  notes: string | null;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

interface RevenueData {
  period: string;
  actual: number;
  target: number;
}

const dimensionsList = [
  { id: "marketing", name: "Marketing", icon: "📢" },
  { id: "sales", name: "Sales", icon: "💰" },
  { id: "operations", name: "Operations", icon: "⚙️" },
  { id: "finance", name: "Finance", icon: "📊" },
  { id: "team", name: "Team", icon: "👥" },
  { id: "systems", name: "Systems", icon: "🔧" },
  { id: "leadership", name: "Leadership", icon: "👑" },
  { id: "vision", name: "Vision", icon: "🔭" },
  { id: "product", name: "Product", icon: "📦" },
  { id: "customer_experience", name: "Customer Experience", icon: "💎" },
  { id: "legal", name: "Legal", icon: "⚖️" },
  { id: "sustainability", name: "Sustainability", icon: "🌱" },
];

export default function SegmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [segment, setSegment] = useState<Segment | null>(null);
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchSegmentData();
  }, [slug]);

  const fetchSegmentData = async () => {
    try {
      // Fetch segment details
      const segmentRes = await fetch(`/api/segments/${slug}`);
      if (segmentRes.ok) {
        const data = await segmentRes.json();
        setSegment(data.segment);
      }

      // Fetch dimension scores
      const dimensionsRes = await fetch(`/api/segments/${slug}/dimensions`);
      if (dimensionsRes.ok) {
        const data = await dimensionsRes.json();
        setDimensionScores(data.dimensions);
      }

      // Fetch tasks
      const tasksRes = await fetch(`/api/segments/${slug}/tasks`);
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks);
      }

      // Fetch revenue
      const revenueRes = await fetch(`/api/segments/${slug}/revenue`);
      if (revenueRes.ok) {
        const data = await revenueRes.json();
        setRevenue(data.revenue);
      }
    } catch (error) {
      console.error("Error fetching segment data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average dimension score
  const avgDimensionScore = dimensionScores.length > 0
    ? Math.round(dimensionScores.reduce((acc, d) => acc + d.score, 0) / dimensionScores.length)
    : 0;

  // Get health color
  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthTextColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Loading segment...</div>
      </div>
    );
  }

  if (!segment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Segment not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/segments"
          className="flex items-center gap-2 text-soft-taupe hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Segments</span>
        </Link>
        <span className="text-soft-taupe">/</span>
        <span className="text-soft-taupe">{segment.business.name}</span>
        <span className="text-soft-taupe">/</span>
        <span className="text-navy font-medium">{segment.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
            style={{ backgroundColor: segment.color }}
          >
            {segment.icon}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-serif text-navy">{segment.name}</h1>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthBgColor(avgDimensionScore)} ${getHealthTextColor(avgDimensionScore)}`}
              >
                {avgDimensionScore >= 80 ? "Healthy" : avgDimensionScore >= 60 ? "Attention" : "At Risk"}
              </div>
            </div>
            <p className="text-soft-taupe max-w-2xl">{segment.description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all">
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "dimensions", label: "12 Dimensions", icon: Target },
          { id: "tasks", label: "Tasks", icon: CheckCircle2 },
          { id: "revenue", label: "Revenue", icon: DollarSign },
          { id: "calendar", label: "Calendar", icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? "text-navy border-gold"
                : "text-soft-taupe border-transparent hover:text-navy"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-4 gap-6">
          {/* Health Score */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-16 h-16 rounded-full ${getHealthBgColor(avgDimensionScore)} flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${getHealthTextColor(avgDimensionScore)}`}>
                  {avgDimensionScore}
                </span>
              </div>
              <div>
                <p className="text-sm text-soft-taupe">Overall Health</p>
                <p className="text-lg font-medium text-navy">
                  {avgDimensionScore >= 80 ? "Excellent" : avgDimensionScore >= 60 ? "Good" : "Needs Work"}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getHealthColor(avgDimensionScore)}`}
                style={{ width: `${avgDimensionScore}%` }}
              />
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-8 h-8 text-plum" />
              <span className="text-3xl font-bold text-navy">{tasks.length}</span>
            </div>
            <p className="text-sm text-soft-taupe">Total Tasks</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="text-green-600">{tasks.filter(t => t.status === "done").length} done</span>
              <span className="text-soft-taupe">•</span>
              <span className="text-blue-600">{tasks.filter(t => t.status === "in_progress").length} in progress</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-gold" />
              <span className="text-3xl font-bold text-navy">
                ${revenue.reduce((acc, r) => acc + r.actual, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-soft-taupe">Revenue (MTD)</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600">+12%</span>
              <span className="text-soft-taupe">vs last month</span>
            </div>
          </div>

          {/* Target */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-teal" />
              <span className="text-3xl font-bold text-navy">
                {segment.revenueTarget ? `$${Number(segment.revenueTarget).toLocaleString()}` : "—"}
              </span>
            </div>
            <p className="text-sm text-soft-taupe">Revenue Target</p>
            <div className="mt-2 text-sm text-soft-taupe">
              {segment.revenueTarget
                ? `${Math.round((revenue.reduce((acc, r) => acc + r.actual, 0) / Number(segment.revenueTarget)) * 100)}% achieved`
                : "No target set"}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="font-serif text-lg text-navy mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-cream-dark/30 rounded-xl">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-gold" : "bg-teal"
                  }`} />
                  <span className="text-sm text-navy/80 flex-1">{task.title}</span>
                  <span className="text-xs text-soft-taupe capitalize">{task.status.replace("_", " ")}</span>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-soft-taupe italic">No recent activity</p>
              )}
            </div>
          </div>

          {/* Top Dimensions */}
          <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="font-serif text-lg text-navy mb-4">Top Performing Dimensions</h3>
            <div className="space-y-3">
              {dimensionScores
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((dim) => {
                  const dimInfo = dimensionsList.find(d => d.id === dim.dimension);
                  return (
                    <div key={dim.dimension} className="flex items-center gap-3">
                      <span className="text-lg">{dimInfo?.icon}</span>
                      <span className="text-sm text-navy/80 flex-1">{dimInfo?.name}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-navy w-8">{dim.score}</span>
                    </div>
                  );
                })}
              {dimensionScores.length === 0 && (
                <p className="text-soft-taupe italic">No dimension scores yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "dimensions" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="font-serif text-xl text-navy mb-6">12 Business Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            {dimensionsList.map((dim) => {
              const score = dimensionScores.find(s => s.dimension === dim.id);
              const dimScore = score?.score || 0;
              
              return (
                <div
                  key={dim.id}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    dimScore >= 80
                      ? "border-green-200 bg-green-50"
                      : dimScore >= 60
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{dim.icon}</span>
                    <span className="font-medium text-navy">{dim.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getHealthBgColor(dimScore)}`}>
                      <span className={`font-bold ${getHealthTextColor(dimScore)}`}>{dimScore}</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthColor(dimScore)}`}
                          style={{ width: `${dimScore}%` }}
                        />
                      </div>
                      {score?.notes && (
                        <p className="text-xs text-soft-taupe mt-2 line-clamp-2">{score.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-navy">Tasks</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-xl font-medium hover:bg-gold-light transition-all">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl hover:bg-lavender/30 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-gold" : "bg-teal"
                }`} />
                <span className="text-navy/80 flex-1">{task.title}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white capitalize">
                  {task.status.replace("_", " ")}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-soft-taupe">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-soft-taupe italic text-center py-8">No tasks yet. Add your first task!</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="font-serif text-xl text-navy mb-6">Revenue Tracking</h3>
          <div className="space-y-4">
            {revenue.map((period, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl">
                <span className="text-soft-taupe w-24">{period.period}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-navy">${period.actual.toLocaleString()}</span>
                    <span className="text-soft-taupe">/ ${period.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gold"
                      style={{ width: `${Math.min((period.actual / period.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`font-medium ${period.actual >= period.target ? "text-green-600" : "text-navy"}`}>
                  {Math.round((period.actual / period.target) * 100)}%
                </span>
              </div>
            ))}
            {revenue.length === 0 && (
              <p className="text-soft-taupe italic text-center py-8">No revenue data yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="font-serif text-xl text-navy mb-6">Calendar</h3>
          <div className="text-center py-12 text-soft-taupe">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Calendar integration coming soon.</p>
            <p className="text-sm">Connect your Google Calendar to see events here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
