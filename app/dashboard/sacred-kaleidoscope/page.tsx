"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  Target,
  BarChart3,
  ChevronRight,
  Edit3,
  Building2,
  Briefcase,
  Users,
  DollarSign,
  Activity,
  Sparkles,
} from "lucide-react";

// Types
interface Business {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  health: "healthy" | "attention" | "at_risk";
  revenue: number | null;
  expenses: number | null;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
  };
  dimensionScore: number;
}

const getHealthColor = (health: string) => {
  switch (health) {
    case "healthy":
      return "bg-green-500";
    case "attention":
      return "bg-yellow-500";
    case "at_risk":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const getHealthBg = (health: string) => {
  switch (health) {
    case "healthy":
      return "bg-green-50 border-green-200";
    case "attention":
      return "bg-yellow-50 border-yellow-200";
    case "at_risk":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getHealthIcon = (health: string) => {
  switch (health) {
    case "healthy":
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    case "attention":
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    case "at_risk":
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    default:
      return <Minus className="w-6 h-6 text-gray-400" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function SacredKaleidoscopePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/sacred-kaleidoscope");
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate portfolio totals
  const totalRevenue = businesses.reduce((acc, b) => acc + (b.revenue || 0), 0);
  const totalExpenses = businesses.reduce((acc, b) => acc + (b.expenses || 0), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalTasks = businesses.reduce((acc, b) => acc + b.tasks.total, 0);
  const completedTasks = businesses.reduce((acc, b) => acc + b.tasks.completed, 0);
  const avgDimensionScore = Math.round(
    businesses.reduce((acc, b) => acc + b.dimensionScore, 0) / (businesses.length || 1)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Loading Sacred Kaleidoscope...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Sacred Kaleidoscope</h1>
          <p className="text-soft-taupe">Your business portfolio - all ventures in one view</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-xl px-6 py-4 soft-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-sm text-soft-taupe">Portfolio Health</p>
              <p className={`text-xl font-bold ${getScoreColor(avgDimensionScore)}`}>
                {avgDimensionScore}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-gold" />
            <span className="text-2xl font-bold text-navy">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-teal" />
            <span className="text-2xl font-bold text-navy">
              ${totalProfit.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Total Profit</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-navy">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Tasks Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-plum" />
            <span className="text-2xl font-bold text-navy">{businesses.length}</span>
          </div>
          <p className="text-sm text-soft-taupe">Active Businesses</p>
        </div>
      </div>

      {/* Business Portfolio Grid */}
      <div className="grid grid-cols-2 gap-6">
        {businesses.map((business) => (
          <div
            key={business.id}
            className={`rounded-2xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${getHealthBg(
              business.health
            )}`}
            onClick={() => setSelectedBusiness(business)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: business.color + "20" }}
                >
                  {business.icon}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-navy">{business.name}</h3>
                  <p className="text-sm text-navy/60">{business.description}</p>
                </div>
              </div>
              {getHealthIcon(business.health)}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-navy">
                  ${business.revenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-soft-taupe">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-navy">
                  ${(business.revenue || 0) - (business.expenses || 0)}
                </p>
                <p className="text-xs text-soft-taupe">Profit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-navy">{business.tasks.total}</p>
                <p className="text-xs text-soft-taupe">Tasks</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getScoreColor(business.dimensionScore)}`}>
                  {business.dimensionScore}
                </p>
                <p className="text-xs text-soft-taupe">Health Score</p>
              </div>
            </div>

            {/* Task Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-soft-taupe">Task Progress</span>
                <span className="text-navy">
                  {business.tasks.completed}/{business.tasks.total} completed
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getHealthColor(business.health)}`}
                  style={{
                    width: `${
                      business.tasks.total > 0
                        ? (business.tasks.completed / business.tasks.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white rounded-lg text-sm font-medium text-navy hover:bg-navy hover:text-white transition-all">
                View Details
              </button>
              <button className="flex-1 py-2 bg-white rounded-lg text-sm font-medium text-navy hover:bg-navy hover:text-white transition-all">
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ backgroundColor: selectedBusiness.color + "20" }}
                >
                  {selectedBusiness.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-navy">{selectedBusiness.name}</h2>
                  <p className="text-navy/60">{selectedBusiness.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getHealthIcon(selectedBusiness.health)}
                    <span className="text-sm capitalize">{selectedBusiness.health.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="text-soft-taupe hover:text-navy text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-cream-dark/30 rounded-xl p-4">
                <p className="text-sm text-soft-taupe mb-1">Revenue</p>
                <p className="text-2xl font-bold text-navy">
                  ${selectedBusiness.revenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-cream-dark/30 rounded-xl p-4">
                <p className="text-sm text-soft-taupe mb-1">Expenses</p>
                <p className="text-2xl font-bold text-navy">
                  ${selectedBusiness.expenses?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-cream-dark/30 rounded-xl p-4">
                <p className="text-sm text-soft-taupe mb-1">Profit</p>
                <p className="text-2xl font-bold text-navy">
                  ${((selectedBusiness.revenue || 0) - (selectedBusiness.expenses || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
              <h3 className="font-serif text-xl text-navy mb-4">Tasks Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{selectedBusiness.tasks.total}</p>
                  <p className="text-sm text-blue-600/70">Total Tasks</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{selectedBusiness.tasks.completed}</p>
                  <p className="text-sm text-green-600/70">Completed</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{selectedBusiness.tasks.inProgress}</p>
                  <p className="text-sm text-yellow-600/70">In Progress</p>
                </div>
              </div>
            </div>

            {/* Dimension Score */}
            <div className="mb-6">
              <h3 className="font-serif text-xl text-navy mb-4">12 Dimensions Health</h3>
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getHealthBg(selectedBusiness.health)}`}>
                  <span className={`text-3xl font-bold ${getScoreColor(selectedBusiness.dimensionScore)}`}>
                    {selectedBusiness.dimensionScore}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium text-navy">Average Health Score</p>
                  <p className="text-soft-taupe">
                    Based on all 12 business dimensions
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow">
                View Full Details
              </button>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
