"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  Building2,
  Target,
  BarChart3,
  ChevronRight,
  Plus,
  Edit3,
} from "lucide-react";

// Types
interface Business {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface DimensionHealth {
  id: number;
  dimension: string;
  businessId: number;
  score: number;
  health: "healthy" | "attention" | "at_risk";
  notes: string | null;
  updatedAt: string;
  business: Business | null;
}

const allDimensions = [
  { id: "marketing", name: "Marketing", icon: "📢", description: "Brand awareness, lead generation, content strategy" },
  { id: "sales", name: "Sales", icon: "💰", description: "Revenue generation, pipeline, conversions" },
  { id: "operations", name: "Operations", icon: "⚙️", description: "Processes, workflows, efficiency" },
  { id: "finance", name: "Finance", icon: "📊", description: "Cash flow, budgeting, financial health" },
  { id: "team", name: "Team", icon: "👥", description: "People, culture, hiring, development" },
  { id: "systems", name: "Systems", icon: "🔧", description: "Technology, tools, automation" },
  { id: "leadership", name: "Leadership", icon: "👑", description: "Vision, decision-making, direction" },
  { id: "vision", name: "Vision", icon: "🔭", description: "Long-term goals, mission, purpose" },
  { id: "product", name: "Product", icon: "📦", description: "Offerings, services, deliverables" },
  { id: "customer_experience", name: "Customer Experience", icon: "💎", description: "Client satisfaction, support, retention" },
  { id: "legal", name: "Legal", icon: "⚖️", description: "Compliance, contracts, protection" },
  { id: "sustainability", name: "Sustainability", icon: "🌱", description: "Longevity, scalability, impact" },
];

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

const getHealthIcon = (health: string) => {
  switch (health) {
    case "healthy":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "attention":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "at_risk":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Minus className="w-5 h-5 text-gray-400" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  return "bg-red-100";
};

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<DimensionHealth[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDimension, setEditingDimension] = useState<DimensionHealth | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    dimension: string;
    businessId: string;
    score: number;
    health: "healthy" | "attention" | "at_risk";
    notes: string;
  }>({
    dimension: "",
    businessId: "",
    score: 70,
    health: "healthy",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedBusiness]);

  const fetchData = async () => {
    try {
      const url = selectedBusiness
        ? `/api/dimensions?businessId=${selectedBusiness}`
        : "/api/dimensions";
      const [dimensionsRes, businessesRes] = await Promise.all([
        fetch(url),
        fetch("/api/businesses"),
      ]);

      if (dimensionsRes.ok) {
        const data = await dimensionsRes.json();
        setDimensions(data.dimensions);
      }

      if (businessesRes.ok) {
        const data = await businessesRes.json();
        setBusinesses(data.businesses);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDimension = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/dimensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessId: parseInt(formData.businessId),
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingDimension(null);
        setFormData({
          dimension: "",
          businessId: "",
          score: 70,
          health: "healthy",
          notes: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error saving dimension:", error);
    }
  };

  // Calculate aggregated scores
  const getAggregatedScores = () => {
    const scores: { [key: string]: { total: number; count: number; health: string } } = {};

    allDimensions.forEach((dim) => {
      scores[dim.id] = { total: 0, count: 0, health: "healthy" };
    });

    dimensions.forEach((d) => {
      if (scores[d.dimension]) {
        scores[d.dimension].total += d.score;
        scores[d.dimension].count += 1;
      }
    });

    return allDimensions.map((dim) => {
      const data = scores[dim.id];
      const avgScore = data.count > 0 ? Math.round(data.total / data.count) : 0;
      let health = "healthy";
      if (avgScore < 60) health = "at_risk";
      else if (avgScore < 80) health = "attention";

      return {
        ...dim,
        avgScore,
        health,
        count: data.count,
      };
    });
  };

  const aggregatedScores = getAggregatedScores();
  const overallScore = Math.round(
    aggregatedScores.reduce((acc, dim) => acc + dim.avgScore, 0) / aggregatedScores.length
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Loading dimensions...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">12 Business Dimensions</h1>
          <p className="text-soft-taupe">Health and performance across all areas of your business</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Overall Score */}
          <div className="bg-white rounded-xl px-6 py-4 soft-shadow flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${getScoreBg(overallScore)} flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
            </div>
            <div>
              <p className="text-sm text-soft-taupe">Overall Health Score</p>
              <p className="text-lg font-medium text-navy">
                {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs Attention"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            <Plus className="w-5 h-5" />
            Update Score
          </button>
        </div>
      </div>

      {/* Business Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setSelectedBusiness(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedBusiness === null
                ? "bg-navy text-white"
                : "bg-white text-navy border border-navy/20 hover:bg-navy/5"
            }`}
          >
            All Businesses
          </button>
          {businesses.map((business) => (
            <button
              key={business.id}
              onClick={() => setSelectedBusiness(business.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedBusiness === business.id
                  ? "bg-navy text-white"
                  : "bg-white text-navy border border-navy/20 hover:bg-navy/5"
              }`}
            >
              <span>{business.icon}</span>
              {business.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-3 gap-6">
        {aggregatedScores.map((dim) => {
          const businessScores = dimensions.filter((d) => d.dimension === dim.id);

          return (
            <div
              key={dim.id}
              className="bg-white rounded-2xl p-6 soft-shadow card-hover cursor-pointer"
              onClick={() => {
                if (businessScores.length > 0) {
                  setEditingDimension(businessScores[0]);
                  setFormData({
                    dimension: businessScores[0].dimension,
                    businessId: businessScores[0].businessId.toString(),
                    score: businessScores[0].score,
                    health: businessScores[0].health,
                    notes: businessScores[0].notes || "",
                  });
                  setShowAddModal(true);
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{dim.icon}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{dim.name}</h3>
                    <p className="text-xs text-soft-taupe">{dim.description}</p>
                  </div>
                </div>
                {getHealthIcon(dim.health)}
              </div>

              {/* Score */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-20 h-20 rounded-full ${getScoreBg(dim.avgScore)} flex items-center justify-center`}>
                  <span className={`text-3xl font-bold ${getScoreColor(dim.avgScore)}`}>
                    {dim.avgScore}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-soft-taupe">Average Score</p>
                  <p className="text-lg font-medium text-navy capitalize">{dim.health.replace("_", " ")}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${getHealthColor(dim.health)}`}
                  style={{ width: `${dim.avgScore}%` }}
                />
              </div>

              {/* Business Breakdown */}
              {businessScores.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-soft-taupe uppercase tracking-wider">Business Breakdown</p>
                  {businessScores.slice(0, 3).map((score) => (
                    <div key={score.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{score.business?.icon}</span>
                        <span className="text-navy/70">{score.business?.name}</span>
                      </div>
                      <span className={`font-medium ${getScoreColor(score.score)}`}>{score.score}</span>
                    </div>
                  ))}
                  {businessScores.length > 3 && (
                    <p className="text-xs text-soft-taupe">+{businessScores.length - 3} more</p>
                  )}
                </div>
              )}

              {businessScores.length === 0 && (
                <p className="text-sm text-soft-taupe italic">No scores recorded yet</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-navy">
              {aggregatedScores.filter((d) => d.health === "healthy").length}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Healthy Dimensions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-navy">
              {aggregatedScores.filter((d) => d.health === "attention").length}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Need Attention</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="text-2xl font-bold text-navy">
              {aggregatedScores.filter((d) => d.health === "at_risk").length}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">At Risk</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-gold" />
            <span className="text-2xl font-bold text-navy">{dimensions.length}</span>
          </div>
          <p className="text-sm text-soft-taupe">Total Scores Recorded</p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">
                {editingDimension ? "Edit Dimension Score" : "Update Dimension Score"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDimension(null);
                }}
                className="text-soft-taupe hover:text-navy"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDimension}>
              {/* Dimension */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Dimension</label>
                <select
                  value={formData.dimension}
                  onChange={(e) => setFormData({ ...formData, dimension: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                >
                  <option value="">Select dimension...</option>
                  {allDimensions.map((dim) => (
                    <option key={dim.id} value={dim.id}>
                      {dim.icon} {dim.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Business</label>
                <select
                  value={formData.businessId}
                  onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                >
                  <option value="">Select business...</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.icon} {business.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">
                  Score: {formData.score}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-soft-taupe mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Health Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Health Status</label>
                <div className="flex gap-2">
                  {["healthy", "attention", "at_risk"].map((health) => (
                    <button
                      key={health}
                      type="button"
                      onClick={() => setFormData({ ...formData, health: health as any })}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.health === health
                          ? health === "healthy"
                            ? "bg-green-500 text-white"
                            : health === "attention"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {health === "healthy" && "✓ Healthy"}
                      {health === "attention" && "⚠ Attention"}
                      {health === "at_risk" && "✕ At Risk"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none h-24 resize-none"
                  placeholder="Add notes about this dimension..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDimension(null);
                  }}
                  className="flex-1 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
