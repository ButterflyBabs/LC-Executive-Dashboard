"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface Dimension {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: string[];
}

const dimensions: Dimension[] = [
  {
    id: "marketing",
    name: "Marketing",
    icon: "📢",
    description: "Lead generation, brand awareness, and content performance",
    questions: [
      "Are we generating enough leads to meet our goals?",
      "Is our brand awareness growing in our target market?",
      "Is our content resonating with our audience?",
      "Are our marketing channels performing well?",
    ],
  },
  {
    id: "sales",
    name: "Sales",
    icon: "💰",
    description: "Conversion rates, pipeline health, and closing performance",
    questions: [
      "Are we meeting our revenue targets?",
      "Is our sales pipeline healthy and growing?",
      "Are we converting leads at a good rate?",
      "Is our sales process efficient?",
    ],
  },
  {
    id: "operations",
    name: "Operations",
    icon: "⚙️",
    description: "Efficiency, processes, and delivery quality",
    questions: [
      "Are our processes efficient and documented?",
      "Are we delivering on time and on budget?",
      "Are there bottlenecks slowing us down?",
      "Is our operational quality consistent?",
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "📊",
    description: "Cash flow, profitability, and financial health",
    questions: [
      "Is our cash flow healthy and stable?",
      "Are we profitable and meeting financial goals?",
      "Is our budgeting and forecasting accurate?",
      "Do we have adequate financial reserves?",
    ],
  },
  {
    id: "team",
    name: "Team",
    icon: "👥",
    description: "Hiring, retention, culture, and team satisfaction",
    questions: [
      "Is our team engaged and satisfied?",
      "Are we retaining our best people?",
      "Do we have the right people in the right roles?",
      "Is our team culture strong and positive?",
    ],
  },
  {
    id: "systems",
    name: "Systems",
    icon: "🔧",
    description: "Automation, tools, and workflow efficiency",
    questions: [
      "Are our tools and systems working well?",
      "Is our automation reducing manual work?",
      "Are our workflows efficient?",
      "Do we have the right technology stack?",
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: "👑",
    description: "Vision, decision-making, and communication",
    questions: [
      "Is our leadership clear and effective?",
      "Are decisions being made efficiently?",
      "Is communication flowing well across the team?",
      "Are we leading by example?",
    ],
  },
  {
    id: "vision",
    name: "Vision",
    icon: "🔭",
    description: "Clarity of direction and strategic alignment",
    questions: [
      "Is our vision clear and compelling?",
      "Is the team aligned with our direction?",
      "Are our strategic goals well-defined?",
      "Is everyone working toward the same objectives?",
    ],
  },
  {
    id: "product",
    name: "Product",
    icon: "📦",
    description: "Quality, features, and innovation",
    questions: [
      "Is our product/service quality high?",
      "Are customers satisfied with what we offer?",
      "Are we innovating and improving?",
      "Does our offering meet market needs?",
    ],
  },
  {
    id: "customer_experience",
    name: "Customer Experience",
    icon: "💎",
    description: "Satisfaction, support, and retention",
    questions: [
      "Are our customers satisfied?",
      "Is our customer support responsive and helpful?",
      "Are we retaining customers well?",
      "Do customers refer others to us?",
    ],
  },
  {
    id: "legal",
    name: "Legal",
    icon: "⚖️",
    description: "Compliance, contracts, and IP protection",
    questions: [
      "Are we compliant with all regulations?",
      "Are our contracts and agreements solid?",
      "Is our intellectual property protected?",
      "Are there any legal risks or concerns?",
    ],
  },
  {
    id: "sustainability",
    name: "Sustainability",
    icon: "🌱",
    description: "Long-term viability and impact",
    questions: [
      "Is the business model sustainable long-term?",
      "Are we making a positive impact?",
      "Can we maintain this pace without burnout?",
      "Are we building for the future?",
    ],
  },
];

interface HealthCheckWizardProps {
  segmentId: number;
  segmentName: string;
  currentScores?: Record<string, number>;
  onComplete: (scores: Record<string, number>) => void;
  onCancel: () => void;
}

export function HealthCheckWizard({
  segmentId,
  segmentName,
  currentScores = {},
  onComplete,
  onCancel,
}: HealthCheckWizardProps) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(currentScores);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const currentDimension = dimensions[step];
  const isLastStep = step === dimensions.length - 1;

  const handleScoreChange = (score: number) => {
    setScores((prev) => ({
      ...prev,
      [currentDimension.id]: score,
    }));
  };

  const handleNoteChange = (note: string) => {
    setNotes((prev) => ({
      ...prev,
      [currentDimension.id]: note,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(scores);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentScore = scores[currentDimension.id] || 70;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Healthy";
    if (score >= 60) return "Needs Attention";
    return "At Risk";
  };

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif text-navy">Health Check</h2>
            <p className="text-soft-taupe">{segmentName}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-soft-taupe">Dimension</span>
            <p className="text-lg font-medium text-navy">
              {step + 1} of {dimensions.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="h-2 rounded-full bg-gold transition-all"
            style={{ width: `${((step + 1) / dimensions.length) * 100}%` }}
          />
        </div>

        {/* Dimension Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center text-3xl">
              {currentDimension.icon}
            </div>
            <div>
              <h3 className="text-xl font-serif text-navy">{currentDimension.name}</h3>
              <p className="text-soft-taupe">{currentDimension.description}</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="mb-8 space-y-3">
          <h4 className="font-medium text-navy">Consider:</h4>
          {currentDimension.questions.map((question, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-cream-dark/30 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-gold-dark">{idx + 1}</span>
              </div>
              <p className="text-navy/80">{question}</p>
            </div>
          ))}
        </div>

        {/* Score Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="font-medium text-navy">Health Score</label>
            <div className={`px-4 py-2 rounded-xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore} - {getScoreLabel(currentScore)}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentScore}
            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="flex justify-between text-xs text-soft-taupe mt-2">
            <span>0 (Critical)</span>
            <span>50 (Fair)</span>
            <span>100 (Excellent)</span>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="font-medium text-navy mb-2 block">Notes (optional)</label>
          <textarea
            value={notes[currentDimension.id] || ""}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="What actions are needed? What's working well?"
            className="w-full px-4 py-3 rounded-xl border border-soft-taupe/30 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none h-24 resize-none"
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Summary Preview */}
        {step > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="font-medium text-navy mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Progress So Far
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {dimensions.slice(0, step + 1).map((dim) => {
                const score = scores[dim.id] || 0;
                return (
                  <div key={dim.id} className="text-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-1 ${
                        score >= 80
                          ? "bg-green-100"
                          : score >= 60
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {dim.icon}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        score >= 80
                          ? "text-green-600"
                          : score >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
