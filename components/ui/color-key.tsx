"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

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

interface ColorKeyProps {
  onAddSegment?: () => void;
}

export function ColorKey({ onAddSegment }: ColorKeyProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [expandedBusinesses, setExpandedBusinesses] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [businessesRes, segmentsRes] = await Promise.all([
        fetch("/api/businesses"),
        fetch("/api/segments"),
      ]);

      if (businessesRes.ok) {
        const data = await businessesRes.json();
        setBusinesses(data.businesses);
      }

      if (segmentsRes.ok) {
        const data = await segmentsRes.json();
        setSegments(data.segments);
      }
    } catch (error) {
      console.error("Error fetching color key data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBusiness = (businessId: number) => {
    setExpandedBusinesses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(businessId)) {
        newSet.delete(businessId);
      } else {
        newSet.add(businessId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 soft-shadow">
        <p className="text-sm text-soft-taupe">Loading color key...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 soft-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-navy">Color Key</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-soft-taupe">
            {businesses.length} businesses • {segments.length} segments
          </span>
          {onAddSegment && (
            <button
              onClick={onAddSegment}
              className="p-1.5 bg-gold/20 text-gold-dark rounded-lg hover:bg-gold/30 transition-colors"
              title="Add Segment"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {businesses.map((business) => {
          const businessSegments = segments.filter((s) => s.businessId === business.id);
          const isExpanded = expandedBusinesses.has(business.id);

          return (
            <div key={business.id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Business Header */}
              <button
                onClick={() => toggleBusiness(business.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: business.color }}
                  />
                  <span className="font-medium text-navy text-sm">{business.name}</span>
                  <span className="text-lg">{business.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-soft-taupe">
                    {businessSegments.length} segments
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-soft-taupe" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-soft-taupe" />
                  )}
                </div>
              </button>

              {/* Segments List */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-1">
                  {businessSegments.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="text-lg">{segment.icon}</span>
                      <span className="text-sm text-navy/80">{segment.name}</span>
                    </div>
                  ))}
                  {businessSegments.length === 0 && (
                    <p className="text-sm text-soft-taupe italic p-2">
                      No segments yet
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-soft-taupe mb-2">Color Legend:</p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-navy/70">Healthy (80+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-navy/70">Attention (60-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-navy/70">At Risk (&lt;60)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
