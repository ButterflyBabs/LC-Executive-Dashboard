"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Save, FileText, Target, Users, Lightbulb } from "lucide-react";

export default function BusinessPlanPage() {
  const [activeSection, setActiveSection] = useState("vision");

  const sections = [
    { id: "vision", name: "Vision & Mission", icon: Lightbulb },
    { id: "values", name: "Core Values", icon: Target },
    { id: "objectives", name: "Strategic Objectives", icon: Target },
    { id: "structure", name: "Business Structure", icon: Users },
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
          <div className="w-14 h-14 rounded-2xl bg-plum/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-plum" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Business Plan</h1>
            <p className="text-soft-taupe">Long-term vision and strategic direction</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === section.id
                    ? "bg-plum text-white"
                    : "bg-white text-navy hover:bg-cream-dark"
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl p-8 soft-shadow">
          {activeSection === "vision" && (
            <div>
              <h2 className="text-2xl font-serif text-navy mb-6">Vision & Mission</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Vision Statement</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none h-32 resize-none"
                    placeholder="Where are we going? What does success look like in 5-10 years?"
                    defaultValue="To create a world where every person lives in alignment with their true purpose, supported by sacred systems and compassionate community."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Mission Statement</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none h-32 resize-none"
                    placeholder="Why do we exist? What do we do every day?"
                    defaultValue="We provide transformational tools, sacred community, and practical guidance to help people move from fear and survival into purpose and aligned action."
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "values" && (
            <div>
              <h2 className="text-2xl font-serif text-navy mb-6">Core Values</h2>
              <div className="space-y-4">
                {["Alignment", "Compassion", "Truth", "Sacred Responsibility", "Inner Freedom"].map((value, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-plum text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-lg border border-soft-taupe/30 focus:border-plum outline-none"
                      defaultValue={value}
                    />
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-soft-taupe/30 rounded-xl text-soft-taupe hover:border-plum hover:text-plum transition-all">
                  + Add Core Value
                </button>
              </div>
            </div>
          )}

          {activeSection === "objectives" && (
            <div>
              <h2 className="text-2xl font-serif text-navy mb-6">Strategic Objectives (12 Months)</h2>
              <div className="space-y-4">
                {[
                  { objective: "Launch LifeCharter Circle cohort", target: "Q2 2026", status: "in-progress" },
                  { objective: "Reach $50K MRR across all segments", target: "Q4 2026", status: "on-track" },
                  { objective: "Publish Conversations of Consequence book", target: "Q3 2026", status: "planning" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-cream-dark/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 rounded-lg border border-soft-taupe/30 focus:border-plum outline-none font-medium"
                        defaultValue={item.objective}
                      />
                      <span className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-navy">
                        {item.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-soft-taupe">
                      <span>Status:</span>
                      <select className="bg-white px-2 py-1 rounded border border-soft-taupe/30">
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="on-track">On Track</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-soft-taupe/30 rounded-xl text-soft-taupe hover:border-plum hover:text-plum transition-all">
                  + Add Strategic Objective
                </button>
              </div>
            </div>
          )}

          {activeSection === "structure" && (
            <div>
              <h2 className="text-2xl font-serif text-navy mb-6">Business Structure</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-cream-dark/30 rounded-xl">
                    <h3 className="font-medium text-navy mb-2">Legal Structure</h3>
                    <select className="w-full px-4 py-2 rounded-lg border border-soft-taupe/30 bg-white">
                      <option>LLC (Limited Liability Company)</option>
                      <option>S-Corporation</option>
                      <option>C-Corporation</option>
                      <option>Sole Proprietorship</option>
                    </select>
                  </div>
                  <div className="p-4 bg-cream-dark/30 rounded-xl">
                    <h3 className="font-medium text-navy mb-2">Tax Year End</h3>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg border border-soft-taupe/30"
                      defaultValue="2026-12-31"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-navy mb-3">Business Segments</h3>
                  <div className="space-y-2">
                    {["LifeCharter Core", "LifeCharter Command Suite", "AmiLynne Speaks", "Business in a Bot", "Carroll Media"].map((segment, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-soft-taupe/20">
                        <div className="w-3 h-3 rounded-full bg-plum" />
                        <span className="text-navy">{segment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
