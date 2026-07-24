"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Briefcase,
  Megaphone,
  TrendingUp,
  Target,
  ArrowRight,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const planningAreas = [
  {
    id: "business",
    name: "Business Plan",
    icon: Briefcase,
    description: "Vision, mission, values, and strategic objectives",
    color: "#5E3B6C",
    status: "draft",
    lastUpdated: "2 weeks ago",
  },
  {
    id: "marketing",
    name: "Marketing Plan",
    icon: Megaphone,
    description: "Brand strategy, channels, content calendar, campaigns",
    color: "#2E7C83",
    status: "active",
    lastUpdated: "3 days ago",
  },
  {
    id: "sales",
    name: "Sales Plan",
    icon: TrendingUp,
    description: "Pipeline, targets, processes, and conversion strategies",
    color: "#D4AF63",
    status: "active",
    lastUpdated: "1 week ago",
  },
  {
    id: "forecasting",
    name: "Financial Forecasting",
    icon: Target,
    description: "Revenue projections, budgeting, scenario planning",
    color: "#1F315B",
    status: "review",
    lastUpdated: "5 days ago",
  },
];

const upcomingReviews = [
  { title: "Q3 Marketing Review", date: "Aug 15, 2026", type: "marketing" },
  { title: "Annual Business Plan Update", date: "Sep 1, 2026", type: "business" },
  { title: "Sales Pipeline Forecast", date: "Aug 30, 2026", type: "sales" },
];

export default function PlanningHubPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-teal/20 flex items-center justify-center">
            <Compass className="w-6 h-6 text-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Planning Hub</h1>
            <p className="text-soft-taupe">Strategic planning and long-term vision</p>
          </div>
        </div>
      </div>

      {/* Planning Areas Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {planningAreas.map((area) => (
          <Link
            key={area.id}
            href={`/dashboard/planning/${area.id}`}
            className="bg-white rounded-2xl p-6 soft-shadow hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: area.color + "20" }}
              >
                <area.icon className="w-7 h-7" style={{ color: area.color }} />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    area.status === "active"
                      ? "bg-green-100 text-green-700"
                      : area.status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {area.status}
                </span>
                <ArrowRight className="w-5 h-5 text-soft-taupe group-hover:text-navy transition-colors" />
              </div>
            </div>
            <h3 className="text-xl font-serif text-navy mb-2">{area.name}</h3>
            <p className="text-soft-taupe text-sm mb-4">{area.description}</p>
            <div className="flex items-center gap-2 text-xs text-soft-taupe">
              <Calendar className="w-4 h-4" />
              <span>Updated {area.lastUpdated}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Reviews */}
      <div className="bg-white rounded-2xl p-6 soft-shadow mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-gold" />
          <h2 className="text-xl font-serif text-navy">Upcoming Reviews</h2>
        </div>
        <div className="space-y-3">
          {upcomingReviews.map((review, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-cream-dark/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-soft-taupe" />
                <span className="text-navy font-medium">{review.title}</span>
              </div>
              <span className="text-sm text-soft-taupe">{review.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <button className="p-4 bg-teal/10 rounded-xl text-teal font-medium hover:bg-teal/20 transition-all">
          + New Planning Session
        </button>
        <button className="p-4 bg-gold/10 rounded-xl text-navy font-medium hover:bg-gold/20 transition-all">
          Export All Plans
        </button>
        <button className="p-4 bg-plum/10 rounded-xl text-plum font-medium hover:bg-plum/20 transition-all">
          Review History
        </button>
      </div>
    </div>
  );
}
