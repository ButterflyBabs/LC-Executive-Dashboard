"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Target,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react";
import { getColorBySlug, getHealthColor, getHealthBgColor, getAccessibleTextColor } from "@/lib/colors";

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
  slug: string;
  description: string;
  icon: string;
  color: string;
  health: "healthy" | "attention" | "at_risk";
  revenueTarget: string | null;
  dimensionScore: number;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
  };
  business: Business | null;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    businessId: "",
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedBusiness]);

  const fetchData = async () => {
    try {
      const [segmentsRes, businessesRes] = await Promise.all([
        fetch(selectedBusiness ? `/api/segments?businessId=${selectedBusiness}` : "/api/segments"),
        fetch("/api/businesses"),
      ]);

      if (segmentsRes.ok) {
        const data = await segmentsRes.json();
        setSegments(data.segments);
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

  const toggleExpand = (segmentId: number) => {
    setExpandedSegments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(segmentId)) {
        newSet.delete(segmentId);
      } else {
        newSet.add(segmentId);
      }
      return newSet;
    });
  };

  // Group segments by business
  const groupedSegments = businesses.map((business) => ({
    ...business,
    segments: segments.filter((s) => s.business?.id === business.id),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-navy/60">Loading segments...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Business Segments</h1>
          <p className="text-soft-taupe">All segments across your Sacred Kaleidoscope ecosystem</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Add Segment
        </button>
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
                  ? "text-white"
                  : "bg-white text-navy border border-navy/20 hover:bg-navy/5"
              }`}
              style={{
                backgroundColor: selectedBusiness === business.id ? business.color : undefined,
              }}
            >
              <span>{business.icon}</span>
              {business.name}
            </button>
          ))}
        </div>
      </div>

      {/* Segments by Business */}
      <div className="space-y-8">
        {groupedSegments.map((business) => {
          if (selectedBusiness && business.id !== selectedBusiness) return null;
          if (business.segments.length === 0) return null;

          return (
            <div key={business.id} className="bg-white rounded-2xl p-6 soft-shadow">
              {/* Business Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: business.color + "20" }}
                >
                  {business.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-serif text-navy">{business.name}</h2>
                  <p className="text-sm text-soft-taupe">
                    {business.segments.length} segment{business.segments.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-soft-taupe">Avg Health:</span>
                  <span className="text-lg font-bold" style={{ color: business.color }}>
                    {Math.round(
                      business.segments.reduce((acc, s) => acc + s.dimensionScore, 0) /
                        business.segments.length
                    )}
                  </span>
                </div>
              </div>

              {/* Segments Grid */}
              <div className="grid grid-cols-2 gap-4">
                {business.segments.map((segment) => {
                  const isExpanded = expandedSegments.has(segment.id);
                  const healthColor = getHealthColor(segment.dimensionScore);
                  const healthBg = getHealthBgColor(segment.dimensionScore);

                  return (
                    <div
                      key={segment.id}
                      className="rounded-xl border-2 transition-all cursor-pointer overflow-hidden"
                      style={{
                        borderColor: segment.color,
                        backgroundColor: isExpanded ? segment.color + "10" : "white",
                      }}
                      onClick={() => toggleExpand(segment.id)}
                    >
                      {/* Card Header */}
                      <div className="p-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                            style={{
                              backgroundColor: segment.color,
                              color: getAccessibleTextColor(segment.color),
                            }}
                          >
                            {segment.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy">{segment.name}</h3>
                            <p className="text-xs text-soft-taupe line-clamp-1">
                              {segment.description}
                            </p>
                          </div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: healthBg, color: healthColor }}
                        >
                          {segment.dimensionScore}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-3 my-4">
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <p className="text-lg font-bold text-navy">
                                {segment.tasks.total}
                              </p>
                              <p className="text-xs text-soft-taupe">Total Tasks</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-lg font-bold text-green-600">
                                {segment.tasks.completed}
                              </p>
                              <p className="text-xs text-green-600/70">Completed</p>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-lg font-bold text-blue-600">
                                {segment.tasks.inProgress}
                              </p>
                              <p className="text-xs text-blue-600/70">In Progress</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-soft-taupe">Task Progress</span>
                              <span className="text-navy">
                                {segment.tasks.total > 0
                                  ? Math.round(
                                      (segment.tasks.completed / segment.tasks.total) * 100
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${
                                    segment.tasks.total > 0
                                      ? (segment.tasks.completed / segment.tasks.total) * 100
                                      : 0
                                  }%`,
                                  backgroundColor: segment.color,
                                }}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                backgroundColor: segment.color,
                                color: getAccessibleTextColor(segment.color),
                              }}
                            >
                              View Details
                            </button>
                            <button className="flex-1 py-2 bg-gray-100 text-navy rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                              Edit
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Collapse Indicator */}
                      <div className="px-4 py-2 bg-gray-50 flex items-center justify-center">
                        <ChevronRight
                          className={`w-5 h-5 text-soft-taupe transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-gold" />
            <span className="text-2xl font-bold text-navy">{segments.length}</span>
          </div>
          <p className="text-sm text-soft-taupe">Total Segments</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-navy">
              {segments.filter((s) => s.dimensionScore >= 80).length}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Healthy Segments</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-navy">
              {segments.filter((s) => s.dimensionScore >= 60 && s.dimensionScore < 80).length}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Need Attention</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-plum" />
            <span className="text-2xl font-bold text-navy">
              {Math.round(
                segments.reduce((acc, s) => acc + s.dimensionScore, 0) / (segments.length || 1)
              )}
            </span>
          </div>
          <p className="text-sm text-soft-taupe">Avg Health Score</p>
        </div>
      </div>

      {/* Add Segment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif text-navy mb-6">Add New Segment</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/segments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...formData,
                      businessId: parseInt(formData.businessId),
                    }),
                  });
                  if (response.ok) {
                    setShowAddModal(false);
                    setFormData({
                      businessId: "",
                      name: "",
                      slug: "",
                      description: "",
                      icon: "",
                      color: "",
                    });
                    fetchData();
                  }
                } catch (error) {
                  console.error("Error creating segment:", error);
                }
              }}
            >
              {/* Business */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Business</label>
                <select
                  value={formData.businessId}
                  onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                >
                  <option value="">Select a business...</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.icon} {business.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Segment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g., LifeCharter Incubator"
                  required
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g., incubator"
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
                  placeholder="Brief description of this segment..."
                />
              </div>

              {/* Icon */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  placeholder="e.g., 🥚"
                  maxLength={2}
                />
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "#7B4F8C", "#5E3B6C", "#4A2E55", "#8B6B9C", // Purples
                    "#3A9CA5", "#2E7C83", "#256A70", // Teals
                    "#E4C473", "#D4AF63", "#C49F53", // Golds
                    "#3A4F7A", "#1F315B", // Indigos
                    "#BDC8B0", "#ADB8A0", "#9DA890", // Sages
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color ? "ring-2 ring-navy ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
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
                  Create Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
