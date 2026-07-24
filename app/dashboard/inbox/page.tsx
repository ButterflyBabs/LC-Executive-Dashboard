"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  Search,
  Star,
  Archive,
  Trash2,
  Send,
  Inbox,
  AlertCircle,
  Paperclip,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Reply,
  Forward,
} from "lucide-react";

// Types
interface Email {
  id: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  folder: string;
}

interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: string;
  isConnected: boolean;
  unreadCount: number;
  color: string;
}

const mockAccounts: EmailAccount[] = [
  { id: "1", name: "Primary Gmail", email: "babs@example.com", provider: "gmail", isConnected: true, unreadCount: 12, color: "#EA4335" },
  { id: "2", name: "Work Exchange", email: "babs@company.com", provider: "exchange", isConnected: false, unreadCount: 0, color: "#0078D4" },
  { id: "3", name: "iCloud Mail", email: "babs@icloud.com", provider: "icloud", isConnected: false, unreadCount: 0, color: "#007AFF" },
];

const mockEmails: Email[] = [
  {
    id: "1",
    subject: "LifeCharter Circle - This Week's Session",
    from: { name: "Sarah Johnson", email: "sarah.j@example.com" },
    preview: "Hi Babs, I'm really looking forward to this week's Circle session...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    folder: "inbox",
  },
  {
    id: "2",
    subject: "Re: Speaking Engagement - Denver Conference",
    from: { name: "Michael Chen", email: "michael@denverconf.com" },
    preview: "Hi Babs, Thank you for your interest in speaking at our conference...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    folder: "inbox",
  },
];

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-navy" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-navy">Inbox</h1>
            <p className="text-soft-taupe">All your email accounts in one place</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Connect Email
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>
      </div>

      {/* Email Accounts */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-soft-taupe">Email Accounts:</span>
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
              account.isConnected ? "bg-white shadow-md" : "bg-cream-dark/50 opacity-50"
            }`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
            <span className="text-navy">{account.name}</span>
            {account.unreadCount > 0 && (
              <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                {account.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Email List */}
      <div className="bg-white rounded-2xl soft-shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedEmail?.id === email.id ? "bg-navy/5" : ""
              } ${!email.isRead ? "bg-white" : "bg-gray-50/50"}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="mt-1"
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    email.isStarred ? "fill-gold text-gold" : "text-gray-300"
                  }`}
                />
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${!email.isRead ? "text-navy" : "text-soft-taupe"}`}>
                  {email.from.name}
                </p>
                <p className={`text-sm truncate ${!email.isRead ? "font-medium text-navy" : "text-soft-taupe"}`}>
                  {email.subject}
                </p>
                <p className="text-sm text-soft-taupe truncate">{email.preview}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-soft-taupe">{formatTime(email.timestamp)}</span>
                {email.hasAttachments && <Paperclip className="w-4 h-4 text-soft-taupe" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif text-navy">New Message</h2>
              <button onClick={() => setShowCompose(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="To" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
              <input type="text" placeholder="Subject" className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
              <textarea placeholder="Message..." className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-soft-taupe">Cancel</button>
              <button className="px-6 py-2 bg-gold text-navy rounded-xl font-medium">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Connect Email Account</h2>
              <button onClick={() => setShowConnectModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 transition-colors">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 font-bold">G</div>
                <div className="text-left">
                  <p className="font-medium text-navy">Gmail</p>
                  <p className="text-sm text-soft-taupe">Connect your Google account</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">E</div>
                <div className="text-left">
                  <p className="font-medium text-navy">Microsoft Exchange</p>
                  <p className="text-sm text-soft-taupe">Connect your work email</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-bold">i</div>
                <div className="text-left">
                  <p className="font-medium text-navy">iCloud Mail</p>
                  <p className="text-sm text-soft-taupe">Connect your Apple ID</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
