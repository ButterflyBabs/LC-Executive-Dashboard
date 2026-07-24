"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Megaphone, Save, Calendar, Target, TrendingUp, Users } from "lucide-react";

export default function MarketingPlanPage() {
  const [activeTab, setActiveTab] = useState("strategy");

  const tabs = [
    { id: "strategy", name: "Strategy", icon: Target },
    { id: "calendar", name: "Content Calendar", icon: Calendar },
    { id: "campaigns", name: "Campaigns", icon: Megaphone },
    { id: "analytics", name: "Analytics", icon: TrendingUp },
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
          <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center">
            <Megaphone className="w-7 h-7 text-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Marketing Plan</h1>
            <p className="text-soft-taupe">Brand strategy, channels, and growth</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? "text-navy border-teal"
                : "text-soft-taupe border-transparent hover:text-navy"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "strategy" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-xl font-serif text-navy mb-4">Brand Positioning</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Target Audience</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none h-24 resize-none"
                  placeholder="Who is your ideal customer?"
                  defaultValue="Spiritually-minded entrepreneurs and professionals seeking alignment between their work and values. Ages 35-55, established in career but seeking deeper meaning."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Unique Value Proposition</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none h-24 resize-none"
                  placeholder="What makes you different?"
                  defaultValue="We combine spiritual wisdom with practical business systems, creating transformation that lasts. Not just coaching—sacred infrastructure for aligned living."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-xl font-serif text-navy mb-4">Marketing Channels</h3>
            <div className="space-y-3">
              {[
                { channel: "LinkedIn", priority: "High", status: "active" },
                { channel: "Instagram", priority: "High", status: "active" },
                { channel: "Email Newsletter", priority: "High", status: "active" },
                { channel: "Podcast", priority: "Medium", status: "growing" },
                { channel: "YouTube", priority: "Medium", status: "planning" },
                { channel: "Speaking Events", priority: "High", status: "active" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-cream-dark/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal" />
                    <span className="text-navy font-medium">{item.channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-xs text-soft-taupe capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-xl font-serif text-navy mb-4">Quarterly Marketing Goals</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { metric: "Email Subscribers", current: "2,450", target: "5,000", quarter: "Q3 2026" },
                { metric: "Social Followers", current: "8,200", target: "15,000", quarter: "Q3 2026" },
                { metric: "Content Pieces", current: "45", target: "100", quarter: "Q3 2026" },
              ].map((goal, idx) => (
                <div key={idx} className="p-4 bg-cream-dark/30 rounded-xl">
                  <p className="text-sm text-soft-taupe mb-1">{goal.metric}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-navy">{goal.current}</span>
                    <span className="text-sm text-soft-taupe">/ {goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-teal"
                      style={{ width: `${(parseInt(goal.current.replace(/,/g, '')) / parseInt(goal.target.replace(/,/g, ''))) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-soft-taupe mt-2">{goal.quarter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Content Calendar</h3>
          <div className="text-center py-12 text-soft-taupe">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Content calendar integration coming soon.</p>
            <p className="text-sm">Connect to Letterman and PostStream for automated scheduling.</p>
          </div>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Active & Planned Campaigns</h3>
          <div className="space-y-4">
            {[
              { name: "LifeCharter Incubator Launch", status: "active", dates: "Jul 1 - Aug 15", budget: "$2,500" },
              { name: "Back to Alignment Fall Campaign", status: "planning", dates: "Sep 1 - Oct 15", budget: "$5,000" },
              { name: "Year-End Reflection Series", status: "draft", dates: "Nov 1 - Dec 31", budget: "$3,000" },
            ].map((campaign, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-cream-dark/30 rounded-xl">
                <div>
                  <h4 className="font-medium text-navy">{campaign.name}</h4>
                  <p className="text-sm text-soft-taupe">{campaign.dates}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-navy">{campaign.budget}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    campaign.status === "active" ? "bg-green-100 text-green-700" :
                    campaign.status === "planning" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-xl font-serif text-navy mb-6">Marketing Analytics</h3>
          <div className="text-center py-12 text-soft-taupe">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Analytics dashboard coming soon.</p>
            <p className="text-sm">Integration with Google Analytics and social media APIs.</p>
          </div>
        </div>
      )}
    </div>
  );
}
