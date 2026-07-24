"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Save, TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react";

export default function ForecastingPage() {
  const [scenario, setScenario] = useState("target");

  const scenarios = {
    conservative: {
      name: "Conservative",
      color: "#8B6B6B",
      growthRate: 10,
      assumptions: [
        "Current conversion rates maintained",
        "No new marketing channels",
        "Modest price increases only",
        "Economic uncertainty continues",
      ],
    },
    target: {
      name: "Target",
      color: "#D4AF63",
      growthRate: 25,
      assumptions: [
        "Improved conversion rates",
        "One new marketing channel launched",
        "Strategic price optimization",
        "Stable economic conditions",
      ],
    },
    optimistic: {
      name: "Optimistic",
      color: "#4A7C59",
      growthRate: 40,
      assumptions: [
        "Significant conversion improvements",
        "Multiple new channels performing",
        "Premium pricing accepted",
        "Strong economic tailwinds",
      ],
    },
  };

  const monthlyData = [
    { month: "Jul 2026", conservative: 25000, target: 30000, optimistic: 35000 },
    { month: "Aug 2026", conservative: 26000, target: 32000, optimistic: 38000 },
    { month: "Sep 2026", conservative: 27000, target: 34000, optimistic: 41000 },
    { month: "Oct 2026", conservative: 28000, target: 36000, optimistic: 45000 },
    { month: "Nov 2026", conservative: 29000, target: 38000, optimistic: 49000 },
    { month: "Dec 2026", conservative: 30000, target: 40000, optimistic: 54000 },
  ];

  const currentScenario = scenarios[scenario as keyof typeof scenarios];

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
          <div className="w-14 h-14 rounded-2xl bg-indigo/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-indigo" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Financial Forecasting</h1>
            <p className="text-soft-taupe">Revenue projections and scenario planning</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all">
          <Save className="w-4 h-4" />
          Save Forecast
        </button>
      </div>

      {/* Scenario Selector */}
      <div className="bg-white rounded-2xl p-6 soft-shadow mb-8">
        <h3 className="text-lg font-serif text-navy mb-4">Select Scenario</h3>
        <div className="flex gap-4">
          {Object.entries(scenarios).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                scenario === key
                  ? "border-indigo bg-indigo/5"
                  : "border-gray-200 hover:border-indigo/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="font-medium text-navy">{data.name}</span>
              </div>
              <p className="text-2xl font-bold text-navy">{data.growthRate}%</p>
              <p className="text-xs text-soft-taupe">Projected Growth</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Assumptions */}
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-serif text-navy mb-4">Key Assumptions</h3>
          <div className="space-y-3">
            {currentScenario.assumptions.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo mt-2 flex-shrink-0" />
                <p className="text-sm text-navy/80">{assumption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Annual Projection */}
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-serif text-navy mb-4">Annual Projection</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-soft-taupe">Projected Revenue</p>
              <p className="text-3xl font-bold text-navy">$420,000</p>
            </div>
            <div>
              <p className="text-sm text-soft-taupe">Projected Expenses</p>
              <p className="text-2xl font-medium text-navy">$294,000</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-soft-taupe">Net Profit</p>
              <p className="text-3xl font-bold text-green-600">$126,000</p>
              <p className="text-sm text-green-600">30% margin</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-serif text-navy mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Risk Factors
          </h3>
          <div className="space-y-3">
            {[
              { risk: "Economic downturn", impact: "High", probability: "Medium" },
              { risk: "Key person dependency", impact: "High", probability: "Low" },
              { risk: "Competition increase", impact: "Medium", probability: "High" },
              { risk: "Technology changes", impact: "Medium", probability: "Medium" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-cream-dark/30 rounded-lg">
                <p className="font-medium text-navy text-sm">{item.risk}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    Impact: {item.impact}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    Prob: {item.probability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Forecast Table */}
      <div className="bg-white rounded-2xl p-6 soft-shadow">
        <h3 className="text-xl font-serif text-navy mb-6">6-Month Revenue Forecast</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-soft-taupe">Month</th>
                <th className="text-right py-3 px-4 font-medium text-soft-taupe">Conservative</th>
                <th className="text-right py-3 px-4 font-medium text-soft-taupe">Target</th>
                <th className="text-right py-3 px-4 font-medium text-soft-taupe">Optimistic</th>
                <th className="text-right py-3 px-4 font-medium text-soft-taupe">Variance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-cream-dark/20">
                  <td className="py-3 px-4 font-medium text-navy">{row.month}</td>
                  <td className="text-right py-3 px-4 text-navy/70">
                    ${row.conservative.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-gold">
                    ${row.target.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-green-600">
                    ${row.optimistic.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="text-sm text-soft-taupe">
                      +{((row.optimistic - row.conservative) / row.conservative * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-cream-dark/30 font-medium">
              <tr>
                <td className="py-3 px-4 text-navy">Total (6 months)</td>
                <td className="text-right py-3 px-4 text-navy">
                  ${monthlyData.reduce((acc, r) => acc + r.conservative, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4 text-gold">
                  ${monthlyData.reduce((acc, r) => acc + r.target, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4 text-green-600">
                  ${monthlyData.reduce((acc, r) => acc + r.optimistic, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">
                  <span className="text-sm text-soft-taupe">Range</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
