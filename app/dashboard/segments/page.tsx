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
  GripVertical,
} from "lucide-react";
import { getHealthColor, getHealthBgColor, getAccessibleTextColor } from "@/lib/colors";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types
interface Business {
  id: number;
  name: string;
  icon: string;
  color: string;
  slug: string;
  sortOrder?: number;
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

// Sortable Business Component
function SortableBusiness({
  business,
  expandedSegments,
  toggleExpand,
}: {
  business: Business & { segments: Segment[] };
  expandedSegments: Set<number>;
  toggleExpand: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: business.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl p-6 soft-shadow"
    >
      {/* Business Header with Drag Handle */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <button
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-soft-taupe" />
        </button>
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
            {business.segments.length > 0
              ? Math.round(
                  business.segments.reduce((acc, s) => acc + s.dimensionScore, 0) /
                    business.segments.length
                )
              : 0}
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
    businessName: "",
    businessSlug: "",
    businessIcon: "",
    businessColor: "",
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
  });
  const [createNewBusiness, setCreateNewBusiness] = useState(false);

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
  const [groupedSegments, setGroupedSegments] = useState<Array<Business & { segments: Segment[] }>>([]);

  useEffect(() => {
    const grouped = businesses.map((business) => ({
      ...business,
      segments: segments.filter((s) => s.business?.id === business.id),
    }));
    setGroupedSegments(grouped);
  }, [businesses, segments]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGroupedSegments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Update sortOrder for each business
        newOrder.forEach((business, index) => {
          business.sortOrder = index + 1;
        });
        
        // Save to database
        saveBusinessOrder(newOrder);
        
        return newOrder;
      });
    }
  };

  const saveBusinessOrder = async (orderedBusinesses: Array<Business & { segments: Segment[] }>) => {
    try {
      for (const business of orderedBusinesses) {
        await fetch(`/api/businesses/${business.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: business.sortOrder }),
        });
      }
    } catch (error) {
      console.error("Error saving business order:", error);
    }
  };

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

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groupedSegments.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* Segments by Business */}
          <div className="space-y-8">
            {groupedSegments.map((business) => {
              if (selectedBusiness && business.id !== selectedBusiness) return null;

              return (
                <SortableBusiness
                  key={business.id}
                  business={business}
                  expandedSegments={expandedSegments}
                  toggleExpand={toggleExpand}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

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
                  let businessId = formData.businessId;

                  // If creating new business, create it first
                  if (createNewBusiness) {
                    const businessRes = await fetch("/api/businesses", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: formData.businessName,
                        slug: formData.businessSlug,
                        icon: formData.businessIcon,
                        color: formData.businessColor,
                        description: "",
                      }),
                    });
                    if (businessRes.ok) {
                      const businessData = await businessRes.json();
                      businessId = businessData.business.id;
                    }
                  }

                  const response = await fetch("/api/segments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      businessId: parseInt(businessId),
                      name: formData.name,
                      slug: formData.slug,
                      description: formData.description,
                      icon: formData.icon,
                      color: formData.color,
                    }),
                  });
                  if (response.ok) {
                    setShowAddModal(false);
                    setCreateNewBusiness(false);
                    setFormData({
                      businessId: "",
                      businessName: "",
                      businessSlug: "",
                      businessIcon: "",
                      businessColor: "",
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
              {/* Create New Business Toggle */}
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="createBusiness"
                  checked={createNewBusiness}
                  onChange={(e) => setCreateNewBusiness(e.target.checked)}
                  className="w-5 h-5 rounded border-soft-taupe/30 text-gold focus:ring-gold"
                />
                <label htmlFor="createBusiness" className="text-sm font-medium text-navy">
                  Create new business (e.g., Babs and Beau's Journey)
                </label>
              </div>

              {/* Existing Business Select */}
              {!createNewBusiness && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-navy mb-2">Select Existing Business</label>
                  <select
                    value={formData.businessId}
                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required={!createNewBusiness}
                  >
                    <option value="">Select a business...</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.icon} {business.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* New Business Fields */}
              {createNewBusiness && (
                <div className="mb-4 p-4 bg-cream-dark/30 rounded-xl space-y-4">
                  <h4 className="font-medium text-navy">New Business Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Business Name</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                      placeholder="e.g., Babs and Beau's Journey"
                      required={createNewBusiness}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Business Slug</label>
                    <input
                      type="text"
                      value={formData.businessSlug}
                      onChange={(e) => setFormData({ ...formData, businessSlug: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                      placeholder="e.g., babs-beau-journey"
                      required={createNewBusiness}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Business Icon (emoji)</label>
                    <input
                      type="text"
                      value={formData.businessIcon}
                      onChange={(e) => setFormData({ ...formData, businessIcon: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                      placeholder="e.g., 🐾"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">Business Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        "#7B4F8C", "#5E3B6C", "#4A2E55", "#8B6B9C",
                        "#3A9CA5", "#2E7C83", "#256A70",
                        "#E4C473", "#D4AF63", "#C49F53",
                        "#3A4F7A", "#1F315B",
                        "#BDC8B0", "#ADB8A0", "#9DA890",
                        "#CBA488", "#D4A574", "#E8B89A",
                        "#8B7B6B", "#6B5B4F",
                      ].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, businessColor: color })}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            formData.businessColor === color ? "ring-2 ring-navy ring-offset-2" : ""
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                  onClick={() => {
                    setShowAddModal(false);
                    setCreateNewBusiness(false);
                    setFormData({
                      businessId: "",
                      businessName: "",
                      businessSlug: "",
                      businessIcon: "",
                      businessColor: "",
                      name: "",
                      slug: "",
                      description: "",
                      icon: "",
                      color: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
                >
                  {createNewBusiness ? "Create Business & Segment" : "Create Segment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
