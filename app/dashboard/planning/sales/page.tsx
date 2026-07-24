"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Save, Target, Users, DollarSign, GitBranch } from "lucide-react";

export default function SalesPlanPage() {
  const [activeTab, setActiveTab] = useState("pipeline");

  const tabs = [
    { id: "pipeline", name: "Pipeline", icon: GitBranch },
    { id: "targets", name: "Targets", icon: Target },
    { id: "process", name: "Sales Process", icon: Users },
    { id: "forecast", name: "Forecast", icon: TrendingUp },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/planning" className="flex items-center gap-2 text-soft-taupe hover:text-navy">
          <ArrowLeft className="w-4 h-4" />
          Back to Planning Hub
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-gold-dark" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Sales Plan</h1>
            <p className="text-soft-taupe">Pipeline, targets, and conversion strategy</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <p className="text-sm text-soft-taupe mb-1">Pipeline Value</p>
          <p className="text-3xl font-bold text-navy">$127,500</p>
          <p className="text-xs text-green-600 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <p className="text-sm text-soft-taupe mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-navy">24%</p>
          <p className="text-xs text-green-600 mt-1">+3% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <p className="text-sm text-soft-taupe mb-1">Avg Deal Size</p>
          <p className="text-3xl font-bold text-navy">$4,200</p>
          <p className="text-xs text-yellow-600 mt-1">-2% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <p className="text-sm text-soft-taupe mb-1">Sales Cycle</p>
          <p className="text-3xl font-bold text-navy">18 days</p>
          <p className="text-xs text-green-600 mt-1">-5 days from last month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
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
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-3 gap-6">
          {[
            { stage: "Lead", count: 45, value: "$189,000", color: "#D4AF63" },
            { stage: "Qualified", count: 18, value: "$76,000", color: "#2E7C83" },
            { stage: "Proposal", count: 8, value: "$34,000", color: "#5E3B6C" },
            { stage: "Negotiation", count: 4, value: "$17,000", color: "#1F315B" },
            { stage: "Closed Won", count: 12, value: "$51,000", color: "#4A7C59" },
            { stage: "Closed Lost", count: 6, value: "$0", color: "#8B6B6B" },
          ].map((stage, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                <h3 className="text-lg font-serif text-navy">{stage.stage}</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-navy">{stage.count}</span>
                <span className="text-soft-taupe">deals</span>
              </div>
              <p className="text-xl font-medium" style={{ color: stage.color }}>
                {stage.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "targets" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Monthly Sales Targets</h3>
          <div className="space-y-6">
            {[
              { segment: "LifeCharter Circle", target: 25000, current: 18750, month: "July 2026" },
              { segment: "LifeCharter Incubator", target: 5000, current: 3200, month: "July 2026" },
              { segment: "Speaking & Workshops", target: 15000, current: 12000, month: "July 2026" },
              { segment: "AI Consulting", target: 10000, current: 8500, month: "July 2026" },
            ].map((item, idx) => {
              const progress = (item.current / item.target) * 100;
              return (
                <div key={idx} className="p-4 bg-cream-dark/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-navy">{item.segment}</h4>
                      <p className="text-sm text-soft-taupe">{item.month}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-navy">
                        ${item.current.toLocaleString()}
                        <span className="text-sm text-soft-taupe font-normal"> / ${item.target.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gold transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-soft-taupe mt-2">{progress.toFixed(0)}% of target</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "process" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Sales Process</h3>
          <div className="space-y-4">
            {[
              { step: 1, name: "Initial Contact", description: "First touchpoint - email, DM, or referral", duration: "Within 24 hours" },
              { step: 2, name: "Discovery Call", description: "Understand needs, challenges, and goals", duration: "30-45 minutes" },
              { step: 3, name: "Qualification", description: "Assess fit, budget, authority, timeline", duration: "Same day" },
              { step: 4, name: "Proposal", description: "Customized solution and investment", duration: "Within 48 hours" },
              { step: 5, name: "Follow-up", description: "Address objections, provide value", duration: "2-3 touchpoints" },
              { step: 6, name: "Close", description: "Agreement signed, payment received", duration: "Varies" },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-cream-dark/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-navy">{step.name}</h4>
                    <span className="text-xs text-soft-taupe">{step.duration}</span>
                  </div>
                  <p className="text-sm text-soft-taupe">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "forecast" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Revenue Forecast</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { quarter: "Q3 2026", conservative: 75000, target: 100000, optimistic: 125000 },
              { quarter: "Q4 2026", conservative: 90000, target: 120000, optimistic: 150000 },
              { quarter: "Q1 2027", conservative: 85000, target: 110000, optimistic: 140000 },
            ].map((q, idx) => (
              <div key={idx} className="p-4 bg-cream-dark/30 rounded-xl">
                <h4 className="font-medium text-navy mb-4">{q.quarter}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-soft-taupe">Conservative</span>
                    <span className="font-medium text-navy">${q.conservative.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-soft-taupe">Target</span>
                    <span className="font-bold text-gold">${q.target.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-soft-taupe">Optimistic</span>
                    <span className="font-medium text-green-600">${q.optimistic.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
