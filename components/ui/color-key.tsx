"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export function ColorKey() {
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
    <div className="bg-white rounded-2xl p-6 soft-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-navy">Color Key: Business Segments</h3>
        <span className="text-sm text-soft-taupe">
          {businesses.length} businesses • {segments.length} segments
        </span>
      </div>

      {/* Horizontal Business List */}
      <div className="flex flex-wrap gap-4">
        {businesses.map((business) => {
          const businessSegments = segments.filter((s) => s.businessId === business.id);
          const isExpanded = expandedBusinesses.has(business.id);

          return (
            <div key={business.id} className="flex-shrink-0">
              {/* Business Button */}
              <button
                onClick={() => toggleBusiness(business.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: business.color, backgroundColor: business.color + "10" }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: business.color }}
                />
                <span className="font-medium text-navy text-sm">{business.name}</span>
                <span className="text-lg">{business.icon}</span>
                <span className="text-xs text-soft-taupe bg-white/50 px-2 py-0.5 rounded-full">
                  {businessSegments.length}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-soft-taupe" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-soft-taupe" />
                )}
              </button>

              {/* Expanded Segments */}
              {isExpanded && (
                <div className="mt-2 flex flex-wrap gap-2 pl-2">
                  {businessSegments.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: segment.color + "20" }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="text-lg">{segment.icon}</span>
                      <span className="text-navy/80">{segment.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 flex-wrap">
        <span className="text-xs text-soft-taupe">Health Indicators:</span>
        <div className="flex items-center gap-4">
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
