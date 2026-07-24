"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Send,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";

// Types
interface Email {
  id: string;
  subject: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  attachments?: Attachment[];
  labels: string[];
  folder: "inbox" | "sent" | "drafts" | "archive" | "trash" | "spam";
  accountId: string;
  threadId?: string;
}

interface Attachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  url?: string;
}

interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: "gmail" | "exchange" | "icloud" | "yahoo" | "other";
  avatar?: string;
  isConnected: boolean;
  unreadCount: number;
  lastSynced?: Date;
  color: string;
}

interface EmailFolder {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  isDefault?: boolean;
}

// Mock email accounts
const mockAccounts: EmailAccount[] = [
  {
    id: "1",
    name: "Primary Gmail",
    email: "babs@example.com",
    provider: "gmail",
    isConnected: true,
    unreadCount: 12,
    lastSynced: new Date(),
    color: "#EA4335",
  },
  {
    id: "2",
    name: "Work Exchange",
    email: "babs@company.com",
    provider: "exchange",
    isConnected: false,
    unreadCount: 0,
    color: "#0078D4",
  },
  {
    id: "3",
    name: "iCloud Mail",
    email: "babs@icloud.com",
    provider: "icloud",
    isConnected: false,
    unreadCount: 0,
    color: "#007AFF",
  },
];

// Mock emails
const mockEmails: Email[] = [
  {
    id: "1",
    subject: "LifeCharter Circle - This Week's Session",
    from: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
    },
    to: ["babs@example.com"],
    preview: "Hi Babs, I'm really looking forward to this week's Circle session. I've been working on my LifeCharter and have some questions about...",
    body: "Hi Babs,\n\nI'm really looking forward to this week's Circle session. I've been working on my LifeCharter and have some questions about the Career dimension.\n\nWould it be possible to get some feedback on my draft?\n\nThanks!\nSarah",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: false,
    labels: ["LifeCharter", "Circle"],
    folder: "inbox",
    accountId: "1",
  },
  {
    id: "2",
    subject: "Re: Speaking Engagement - Denver Conference",
    from: {
      name: "Michael Chen",
      email: "michael@denverconf.com",
    },
    to: ["babs@example.com"],
    preview: "Hi Babs, Thank you for your interest in speaking at our conference. We'd love to have you present on LifeCharter and alignment...",
    body: "Hi Babs,\n\nThank you for your interest in speaking at our conference. We'd love to have you present on LifeCharter and alignment.\n\nThe event is scheduled for October 15-17, 2026. Would you be available for a keynote on the 16th?\n\nBest regards,\nMichael",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    isStarred: false,
    isImportant: true,
    hasAttachments: true,
    attachments: [
      { id: "a1", filename: "Conference_Schedule.pdf", size: 2500000, mimeType: "application/pdf" },
    ],
    labels: ["Speaking", "Opportunity"],
    folder: "inbox",
    accountId: "1",
  },
  {
    id: "3",
    subject: "Newsletter Draft - Ready for Review",
    from: {
      name: "Aira (VA)",
      email: "aira@team.com",
    },
    to: ["babs@example.com"],
    preview: "Hi Babs, I've prepared the newsletter draft for this week. Please review and let me know if you'd like any changes...",
    body: "Hi Babs,\n\nI've prepared the newsletter draft for this week. Please review and let me know if you'd like any changes.\n\nThe draft is attached as a Google Doc link.\n\nBest,\nAira",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    labels: ["Newsletter", "Team"],
    folder: "inbox",
    accountId: "1",
  },
  {
    id: "4",
    subject: "Invoice #2026-089 - Payment Received",
    from: {
      name: "Stripe",
      email: "receipts@stripe.com",
    },
    to: ["babs@example.com"],
    preview: "Thank you for your payment. This email confirms that your payment has been processed successfully...",
    body: "Thank you for your payment.\n\nThis email confirms that your payment has been processed successfully.\n\nInvoice: #2026-089\nAmount: $297.00\nDate: July 24, 2026",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: true,
    attachments: [
      { id: "a2", filename: "Receipt.pdf", size: 150000, mimeType: "application/pdf" },
    ],
    labels: ["Finance", "Receipt"],
    folder: "inbox",
    accountId: "1",
  },
  {
    id: "5",
    subject: "Podcast Interview Request - The Alignment Show",
    from: {
      name: "David Park",
      email: "david@alignmentshow.com",
    },
    to: ["babs@example.com"],
    preview: "Hi Babs, I hope this email finds you well. I'm the host of The Alignment Show podcast and I'd love to have you as a guest...",
    body: "Hi Babs,\n\nI hope this email finds you well. I'm the host of The Alignment Show podcast and I'd love to have you as a guest to discuss LifeCharter and your work.\n\nWould you be interested in a 45-minute interview next month?\n\nBest,\nDavid",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    isStarred: true,
    isImportant: true,
    hasAttachments: false,
    labels: ["Media", "Podcast"],
    folder: "inbox",
    accountId: "1",
  },
];

// Folders
const folders: EmailFolder[] = [
  { id: "inbox", name: "Inbox", icon: <Inbox className="w-5 h-5" />, count: 12, isDefault: true },
  { id: "starred", name: "Starred", icon: <Star className="w-5 h-5" />, count: 2 },
  { id: "important", name: "Important", icon: <AlertCircle className="w-5 h-5" />, count: 2 },
  { id: "sent", name: "Sent", icon: <Send className="w-5 h-5" />, count: 0 },
  { id: "drafts", name: "Drafts", icon: <Mail className="w-5 h-5" />, count: 3 },
  { id: "archive", name: "Archive", icon: <Archive className="w-5 h-5" />, count: 156 },
  { id: "trash", name: "Trash", icon: <Trash2 className="w-5 h-5" />, count: 23 },
];

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(["1"]);

  // Filter emails
  const filteredEmails = emails.filter((email) => {
    // Filter by folder
    if (selectedFolder === "starred") return email.isStarred;
    if (selectedFolder === "important") return email.isImportant;
    if (selectedFolder !== "inbox" && selectedFolder !== "all") {
      return email.folder === selectedFolder;
    }
    
    // Filter by account
    if (!selectedAccounts.includes(email.accountId)) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }
    
    return email.folder === "inbox" || selectedFolder === "all";
  });

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Mark as read
  const markAsRead = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, isRead: true } : e)));
  };

  // Toggle star
  const toggleStar = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, isStarred: !e.isStarred } : e)));
  };

  // Archive email
  const archiveEmail = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, folder: "archive" } : e)));
    if (selectedEmail?.id === emailId) setSelectedEmail(null);
  };

  // Delete email
  const deleteEmail = (emailId: string) => {
    setEmails(emails.map((e) => (e.id === emailId ? { ...e, folder: "trash" } : e)));
    if (selectedEmail?.id === emailId) setSelectedEmail(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="font-serif text-lg text-navy">Inbox</h1>
              <p className="text-xs text-soft-taupe">All accounts</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gold text-navy rounded-xl font-medium hover:bg-gold-light transition-all"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 py-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                selectedFolder === folder.id
                  ? "bg-navy/5 text-navy border-r-2 border-navy"
                  : "text-soft-taupe hover:bg-gray-50"
              }`}
            >
              {folder.icon}
              <span className="flex-1">{folder.name}</span>
              {folder.count > 0 && (
                <span className="text-xs font-medium text-navy bg-navy/10 px-2 py-0.5 rounded-full">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Accounts */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-soft-taupe uppercase tracking-wider">Accounts</span>
            <button
              onClick={() => setShowConnectModal(true)}
              className="text-xs text-teal hover:underline"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  if (selectedAccounts.includes(account.id)) {
                    setSelectedAccounts(selectedAccounts.filter((id) => id !== account.id));
                  } else {
                    setSelectedAccounts([...selectedAccounts, account.id]);
                  }
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedAccounts.includes(account.id) ? "bg-gray-50" : "opacity-50"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: account.color }}
                >
                  {account.provider[0].toUpperCase()}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium text-navy truncate">{account.name}</p>
                  <p className="text-xs text-soft-taupe truncate">{account.email}</p>
                </div>
                {!account.isConnected && (
                  <span className="text-xs text-red-500">!</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-soft-taupe" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-soft-taupe" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-soft-taupe">
              {filteredEmails.filter((e) => !e.isRead).length} unread
            </span>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-soft-taupe">
              <Mail className="w-16 h-16 mb-4 opacity-30" />
              <p>No emails found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    markAsRead(email.id);
                  }}
                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedEmail?.id === email.id ? "bg-navy/5 border-l-2 border-navy" : ""
                  } ${!email.isRead ? "bg-white" : "bg-gray-50/50"}`}
                >
                  {/* Star */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                    className="mt-1"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        email.isStarred ? "fill-gold text-gold" : "text-gray-300"
                      }`}
                    />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium truncate ${!email.isRead ? "text-navy" : "text-soft-taupe"}`}>
                        {email.from.name}
                      </span>
                      {email.isImportant && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className={`text-sm truncate ${!email.isRead ? "font-medium text-navy" : "text-soft-taupe"}`}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-soft-taupe truncate">{email.preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {email.labels.map((label) => (
                        <span
                          key={label}
                          className="text-xs px-2 py-0.5 bg-cream-dark rounded-full text-navy/70"
                        >
                          {label}
                        </span>
                      ))}
                      {email.hasAttachments && (
                        <Paperclip className="w-4 h-4 text-soft-taupe" />
                      )}
                    </div>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-soft-taupe whitespace-nowrap">
                      {formatTime(email.timestamp)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveEmail(email.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Archive className="w-4 h-4 text-soft-taupe" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEmail(email.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-soft-taupe" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Detail */}
      {selectedEmail ? (
        <div className="w-[600px] bg-white flex flex-col">
          {/* Email Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Archive className="w-5 h-5 text-soft-taupe" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Reply className="w-5 h-5 text-soft-taupe" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Forward className="w-5 h-5 text-soft-taupe" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-serif text-navy mb-4">{selectedEmail.subject}</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg">
                {selectedEmail.from.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy">{selectedEmail.from.name}</p>
                    <p className="text-sm text-soft-taupe">{selectedEmail.from.email}</p>
                  </div>
                  <span className="text-sm text-soft-taupe">
                    {selectedEmail.timestamp.toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-soft-taupe">
                    To: {selectedEmail.to.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-navy/80 whitespace-pre-wrap">
              {selectedEmail.body}
            </div>

            {/* Attachments */}
            {selectedEmail.hasAttachments && selectedEmail.attachments && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-navy mb-3">
                  {selectedEmail.attachments.length} attachment{selectedEmail.attachments.length > 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-3">
                  {selectedEmail.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 bg-cream-dark/30 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <Paperclip className="w-5 h-5 text-soft-taupe" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{attachment.filename}</p>
                        <p className="text-xs text-soft-taupe">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reply Box */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Reply to this email..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[600px] bg-gray-50 flex items-center justify-center">
          <div className="text-center text-soft-taupe">
            <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Select an email to read</p>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-serif text-navy">New Message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>

            {/* Compose Form */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">From</label>
                <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none">
                  {accounts.filter((a) => a.isConnected).map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">To</label>
                <input
                  type="text"
                  placeholder="Enter recipient email..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy mb-1">Message</label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-soft-taupe" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-soft-taupe hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-gold text-navy rounded-xl font-medium hover:bg-gold-light transition-all">
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Connect Email Account</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Gmail */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 transition-colors">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#EA4335">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Gmail</p>
                  <p className="text-sm text-soft-taupe">Connect your Google account</p>
                </div>
              </button>

              {/* Microsoft Exchange */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0078D4">
                    <path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.2 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Microsoft Exchange</p>
                  <p className="text-sm text-soft-taupe">Connect your work email</p>
                </div>
              </button>

              {/* iCloud */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#007AFF">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">iCloud Mail</p>
                  <p className="text-sm text-soft-taupe">Connect your Apple ID</p>
                </div>
              </button>

              {/* Yahoo */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#6001D2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Yahoo Mail</p>
                  <p className="text-sm text-soft-taupe">Connect your Yahoo account</p>
                </div>
              </button>

              {/* Other IMAP */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy">Other (IMAP)</p>
                  <p className="text-sm text-soft-taupe">Connect any email provider</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
                  <p className="text-sm text-soft-taupe">Connect your Google account</p>
                </div>
              </button>

              {/* Microsoft Exchange */}
              <button className="w-full