"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Building2,
  Calendar,
  Upload,
  FileText,
  PieChart,
  BarChart3,
  Download,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal,
  Link as LinkIcon,
  Banknote,
  Receipt,
  Calculator,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Types
interface FinancialAccount {
  id: string;
  name: string;
  type: "bank" | "paypal" | "stripe" | "credit_card" | "investment";
  balance: number;
  currency: string;
  lastSync?: Date;
  isConnected: boolean;
  institution?: string;
  accountNumber?: string;
  color: string;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  accountId: string;
  segmentId?: string;
  businessId?: string;
  isReconciled: boolean;
  source: "manual" | "upload" | "api";
  attachments?: string[];
}

interface TechSubscription {
  id: string;
  name: string;
  provider: string;
  planName: string;
  cost: number;
  billingCycle: "monthly" | "annual" | "quarterly";
  nextDueDate: Date;
  lastPaidDate?: Date;
  category: string;
  isActive: boolean;
  autoRenew: boolean;
  segmentId?: string;
}

interface PnLPeriod {
  period: string;
  startDate: Date;
  endDate: Date;
  revenue: number;
  expenses: number;
  netIncome: number;
  segments: {
    segmentId: string;
    segmentName: string;
    revenue: number;
    expenses: number;
    netIncome: number;
  }[];
}

// Mock Data
const mockAccounts: FinancialAccount[] = [
  { id: "1", name: "Business Checking", type: "bank", balance: 45230.50, currency: "USD", isConnected: true, institution: "Chase", color: "#1F315B" },
  { id: "2", name: "Savings", type: "bank", balance: 125000.00, currency: "USD", isConnected: true, institution: "Chase", color: "#2E7C83" },
  { id: "3", name: "PayPal Business", type: "paypal", balance: 8750.25, currency: "USD", isConnected: true, color: "#003087" },
  { id: "4", name: "Stripe", type: "stripe", balance: 15230.00, currency: "USD", isConnected: true, color: "#635BFF" },
  { id: "5", name: "Business Credit", type: "credit_card", balance: -4500.00, currency: "USD", isConnected: false, color: "#5E3B6C" },
];

const mockSubscriptions: TechSubscription[] = [
  { id: "1", name: "GoHighLevel", provider: "GoHighLevel", planName: "Agency Unlimited", cost: 297, billingCycle: "monthly", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), category: "CRM", isActive: true, autoRenew: true },
  { id: "2", name: "Vercel", provider: "Vercel", planName: "Pro", cost: 20, billingCycle: "monthly", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12), category: "Hosting", isActive: true, autoRenew: true },
  { id: "3", name: "Supabase", provider: "Supabase", planName: "Pro", cost: 25, billingCycle: "monthly", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8), category: "Database", isActive: true, autoRenew: true },
  { id: "4", name: "OpenAI", provider: "OpenAI", planName: "Pay-as-you-go", cost: 150, billingCycle: "monthly", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), category: "AI", isActive: true, autoRenew: true },
  { id: "5", name: "Notion", provider: "Notion", planName: "Team", cost: 96, billingCycle: "annual", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180), category: "Productivity", isActive: true, autoRenew: true },
  { id: "6", name: "Figma", provider: "Figma", planName: "Professional", cost: 144, billingCycle: "annual", nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), category: "Design", isActive: true, autoRenew: false },
];

const mockTransactions: Transaction[] = [
  { id: "1", date: new Date(Date.now() - 1000 * 60 * 60 * 24), description: "LifeCharter Circle Payment", amount: 297, type: "income", category: "Program Sales", accountId: "4", isReconciled: true, source: "api" },
  { id: "2", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), description: "GoHighLevel Subscription", amount: -297, type: "expense", category: "Software", accountId: "1", isReconciled: true, source: "api" },
  { id: "3", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), description: "Consulting Payment", amount: 1500, type: "income", category: "Consulting", accountId: "3", isReconciled: false, source: "manual" },
  { id: "4", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), description: "Vercel Hosting", amount: -20, type: "expense", category: "Hosting", accountId: "1", isReconciled: true, source: "api" },
];

const categories = [
  { id: "income", name: "Income", items: ["Program Sales", "Consulting", "Speaking", "Affiliate", "Other Income"] },
  { id: "expense", name: "Expenses", items: ["Software", "Hosting", "Marketing", "Contractors", "Office", "Travel", "Professional Services", "Taxes"] },
];

export default function MoneyPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "subscriptions" | "pnl" | "upload">("overview");
  const [accounts, setAccounts] = useState<FinancialAccount[]>(mockAccounts);
  const [subscriptions, setSubscriptions] = useState<TechSubscription[]>(mockSubscriptions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "quarterly" | "semi-annual" | "annual">("monthly");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyTechSpend = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + (s.billingCycle === "annual" ? s.cost / 12 : s.cost), 0);
  const upcomingRenewals = subscriptions.filter(
    (s) => s.nextDueDate.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getDaysUntil = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Money</h1>
          <p className="text-soft-taupe">Financial overview and tracking across all segments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            <Plus className="w-5 h-5" />
            Connect Account
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl soft-shadow w-fit">
        {[
          { id: "overview", label: "Overview", icon: PieChart },
          { id: "transactions", label: "Transactions", icon: Receipt },
          { id: "subscriptions", label: "Tech Stack", icon: CreditCard },
          { id: "pnl", label: "P&L Reports", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-navy text-white"
                : "text-soft-taupe hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-soft-taupe">Total Balance</p>
                  <p className="text-2xl font-bold text-navy">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-soft-taupe">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-soft-taupe">Monthly Income</p>
                  <p className="text-2xl font-bold text-navy">{formatCurrency(18450)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-green-600">+8.2%</span>
                <span className="text-soft-taupe">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-soft-taupe">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-navy">{formatCurrency(5230)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
                <span className="text-red-600">+3.1%</span>
                <span className="text-soft-taupe">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-soft-taupe">Tech Stack Cost</p>
                  <p className="text-2xl font-bold text-navy">{formatCurrency(monthlyTechSpend)}/mo</p>
                </div>
              </div>
              <p className="text-sm text-soft-taupe">{subscriptions.filter((s) => s.isActive).length} active subscriptions</p>
            </div>
          </div>

          {/* Daily Revenue Watcher */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-navy">Revenue Watcher</h3>
                <p className="text-sm text-soft-taupe">Daily breakdown of income and expenses</p>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: "day", label: "Day" },
                  { id: "week", label: "Week" },
                  { id: "month", label: "Month" },
                  { id: "quarter", label: "Quarter" },
                  { id: "semi", label: "6 Months" },
                  { id: "year", label: "Year" },
                ].map((period) => (
                  <button
                    key={period.id}
                    className="px-3 py-1.5 text-sm rounded-lg bg-navy/5 text-navy hover:bg-navy/10 transition-colors"
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Breakdown Grid */}
            <div className="grid grid-cols-7 gap-3">
              {[
                { day: "Mon", date: "21", income: 450, expense: 120 },
                { day: "Tue", date: "22", income: 0, expense: 297 },
                { day: "Wed", date: "23", income: 1200, expense: 45 },
                { day: "Thu", date: "24", income: 297, expense: 20 },
                { day: "Fri", date: "25", income: 0, expense: 0 },
                { day: "Sat", date: "26", income: 0, expense: 0 },
                { day: "Sun", date: "27", income: 0, expense: 0 },
              ].map((day, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 ${
                    day.date === "24" ? "border-gold bg-gold/5" : "border-gray-100"
                  }`}
                >
                  <p className="text-xs text-soft-taupe text-center">{day.day}</p>
                  <p className="text-lg font-bold text-navy text-center mb-3">{day.date}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">In</span>
                      <span className="text-sm font-medium text-green-600">
                        {day.income > 0 ? formatCurrency(day.income) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-600">Out</span>
                      <span className="text-sm font-medium text-red-600">
                        {day.expense > 0 ? formatCurrency(day.expense) : "-"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-navy">Net</span>
                        <span className={`text-sm font-bold ${day.income - day.expense >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(day.income - day.expense)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Period Totals */}
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Period Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(1947)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Period Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(482)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Net for Period</p>
                <p className="text-2xl font-bold text-navy">{formatCurrency(1465)}</p>
              </div>
            </div>

            {/* Daily Average */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Daily Avg Income</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(278.14)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Daily Avg Expense</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(68.86)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-soft-taupe mb-1">Daily Avg Net</p>
                <p className="text-xl font-bold text-navy">{formatCurrency(209.29)}</p>
              </div>
            </div>
          </div>

          {/* Accounts & Upcoming Renewals */}
          <div className="grid grid-cols-3 gap-6">
            {/* Accounts List */}
            <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy">Connected Accounts</h3>
                <button
                  onClick={() => setShowAddAccount(true)}
                  className="text-sm text-teal hover:underline"
                >
                  + Add Account
                </button>
              </div>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 bg-cream-dark/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.type === "bank" && <Building2 className="w-6 h-6" />}
                        {account.type === "paypal" && <DollarSign className="w-6 h-6" />}
                        {account.type === "stripe" && <CreditCard className="w-6 h-6" />}
                        {account.type === "credit_card" && <CreditCard className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-medium text-navy">{account.name}</p>
                        <p className="text-sm text-soft-taupe">
                          {account.institution || account.type} • {account.isConnected ? "Connected" : "Manual"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${account.balance < 0 ? "text-red-600" : "text-navy"}`}>
                        {formatCurrency(account.balance)}
                      </p>
                      {account.lastSync && (
                        <p className="text-xs text-soft-taupe">
                          Synced {account.lastSync.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Renewals */}
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy">Upcoming Renewals</h3>
                <span className="bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">
                  {upcomingRenewals.length}
                </span>
              </div>
              <div className="space-y-4">
                {upcomingRenewals.slice(0, 5).map((sub) => {
                  const daysUntil = getDaysUntil(sub.nextDueDate);
                  return (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-cream-dark/30 rounded-xl">
                      <div>
                        <p className="font-medium text-navy text-sm">{sub.name}</p>
                        <p className="text-xs text-soft-taupe">{sub.planName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-navy">{formatCurrency(sub.cost)}</p>
                        <p className={`text-xs ${daysUntil <= 3 ? "text-red-500" : "text-soft-taupe"}`}>
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveTab("subscriptions")}
                className="w-full mt-4 text-sm text-teal hover:underline"
              >
                View all subscriptions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-2xl soft-shadow">
          {/* Filters */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none"
              />
            </div>
            <select className="px-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none">
              <option>All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none">
              <option>All Categories</option>
              {categories.map((c) => (
                <optgroup key={c.id} label={c.name}>
                  {c.items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-navy">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-soft-taupe">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.source === "api" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {transaction.source}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : ""}{formatCurrency(transaction.amount)}
                  </p>
                  {transaction.isReconciled ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === "subscriptions" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Monthly Tech Spend</p>
              <p className="text-2xl font-bold text-navy">{formatCurrency(monthlyTechSpend)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Annual Tech Spend</p>
              <p className="text-2xl font-bold text-navy">{formatCurrency(monthlyTechSpend * 12)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Active Subscriptions</p>
              <p className="text-2xl font-bold text-navy">{subscriptions.filter((s) => s.isActive).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Due This Week</p>
              <p className="text-2xl font-bold text-navy">{upcomingRenewals.length}</p>
            </div>
          </div>

          {/* Subscriptions List */}
          <div className="bg-white rounded-2xl soft-shadow">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-navy">All Subscriptions</h3>
              <button
                onClick={() => setShowAddSubscription(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Add Subscription
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {subscriptions.map((sub) => {
                const daysUntil = getDaysUntil(sub.nextDueDate);
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <p className="font-medium text-navy">{sub.name}</p>
                        <p className="text-sm text-soft-taupe">{sub.planName} • {sub.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Cost</p>
                        <p className="font-semibold text-navy">{formatCurrency(sub.cost)}/{sub.billingCycle === "annual" ? "yr" : "mo"}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Next Due</p>
                        <p className={`font-semibold ${daysUntil <= 7 ? "text-red-600" : "text-navy"}`}>
                          {formatDate(sub.nextDueDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.autoRenew ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Auto-renew</span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Manual</span>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4 text-soft-taupe" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* P&L TAB */}
      {activeTab === "pnl" && (
        <div className="space-y-6">
          {/* Period Selector */}
          <div className="bg-white p-4 rounded-xl soft-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-navy">Report Period:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { id: "weekly", label: "Weekly" },
                    { id: "monthly", label: "Monthly" },
                    { id: "quarterly", label: "Quarterly" },
                    { id: "semi-annual", label: "Semi-Annual" },
                    { id: "annual", label: "Annual" },
                  ].map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedPeriod === period.id
                          ? "bg-navy text-white"
                          : "text-soft-taupe hover:bg-gray-100"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-32"
                />
                <span className="text-soft-taupe text-sm">to</span>
                <input
                  type="date"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-32"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg whitespace-nowrap">
                  <Calculator className="w-4 h-4" />
                  Generate P&L
                </button>
              </div>
            </div>
          </div>

          {/* P&L Summary */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(18450)}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Program Sales</span>
                  <span className="font-medium text-navy">{formatCurrency(12000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Consulting</span>
                  <span className="font-medium text-navy">{formatCurrency(4500)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Other</span>
                  <span className="font-medium text-navy">{formatCurrency(1950)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(5230)}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Software</span>
                  <span className="font-medium text-navy">{formatCurrency(1800)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Contractors</span>
                  <span className="font-medium text-navy">{formatCurrency(2000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-soft-taupe">Other</span>
                  <span className="font-medium text-navy">{formatCurrency(1430)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Net Income</p>
              <p className="text-3xl font-bold text-navy">{formatCurrency(13220)}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-soft-taupe">Profit Margin</span>
                  <span className="text-2xl font-bold text-green-600">71.7%</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-navy/5 text-navy rounded-lg text-sm">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-navy/5 text-navy rounded-lg text-sm">
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          </div>

          {/* Segment Breakdown */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-6">Segment Breakdown</h3>
            <div className="space-y-4">
              {[
                { name: "LifeCharter", revenue: 12000, expenses: 2500, color: "#5E3B6C" },
                { name: "Command Suite", revenue: 4500, expenses: 1500, color: "#2E7C83" },
                { name: "AmiLynne Speaks", revenue: 1500, expenses: 800, color: "#D4AF63" },
                { name: "Business in a Bot", revenue: 450, expenses: 430, color: "#1F315B" },
              ].map((segment) => (
                <div key={segment.name} className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-navy">{segment.name}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-soft-taupe">Revenue</p>
                      <p className="font-semibold text-green-600">{formatCurrency(segment.revenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-soft-taupe">Expenses</p>
                      <p className="font-semibold text-red-600">{formatCurrency(segment.expenses)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-soft-taupe">Net</p>
                      <p className="font-semibold text-navy">{formatCurrency(segment.revenue - segment.expenses)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Import Statements</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-navy transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-soft-taupe" />
                <p className="text-navy font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-soft-taupe">Supports CSV, OFX, QFX, PDF</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Supported Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {["Chase", "Bank of America", "Wells Fargo", "PayPal", "Stripe", "Square", "Mercury"].map((bank) => (
                    <span key={bank} className="text-xs px-3 py-1 bg-cream-dark rounded-full text-navy">
                      {bank}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-navy/20 text-navy rounded-xl"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gold text-navy rounded-xl font-medium">
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Connect Account</h2>
              <button onClick={() => setShowAddAccount(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-soft-taupe mb-4">Connect your financial accounts for automatic import</p>
              {[
                { name: "Chase", type: "bank", color: "#0047AB" },
                { name: "Bank of America", type: "bank", color: "#012169" },
                { name: "PayPal", type: "paypal", color: "#003087" },
                { name: "Stripe", type: "stripe", color: "#635BFF" },
                { name: "Mercury", type: "bank", color: "#4F46E5" },
                { name: "Wise", type: "bank", color: "#00B9FF" },
              ].map((provider) => (
                <button
                  key={provider.name}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-navy transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-navy">{provider.name}</p>
                    <p className="text-sm text-soft-taupe capitalize">{provider.type} Account</p>
                  </div>
                  <LinkIcon className="w-5 h-5 text-soft-taupe ml-auto" />
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-navy transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-navy">Manual Import</p>
                    <p className="text-sm text-soft-taupe">Upload CSV or OFX file</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {showAddSubscription && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Add Subscription</h2>
              <button onClick={() => setShowAddSubscription(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Service Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="e.g., GoHighLevel" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Plan Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="e.g., Pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Cost</label>
                  <input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Billing Cycle</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Category</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                    <option>CRM</option>
                    <option>Hosting</option>
                    <option>AI</option>
                    <option>Design</option>
                    <option>Productivity</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Next Due Date</label>
                <input type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="autoRenew" className="rounded" />
                <label htmlFor="autoRenew" className="text-sm text-navy">Auto-renew enabled</label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSubscription(false)}
                  className="flex-1 px-4 py-2 border border-navy/20 text-navy rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-gold text-navy rounded-xl font-medium">
                  Add Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}