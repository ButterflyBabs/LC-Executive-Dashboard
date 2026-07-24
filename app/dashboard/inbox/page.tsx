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
  Reply,
  Forward,
  MoreHorizontal,
  ChevronLeft,
  Save,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Types
interface Email {
  id: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: string[];
  cc?: string[];
  body: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  attachments?: { filename: string; size: number }[];
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

interface Draft {
  id: string;
  to: string;
  subject: string;
  body: string;
  savedAt: Date;
  accountId: string;
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
    to: ["babs@example.com"],
    body: "Hi Babs,\n\nI'm really looking forward to this week's Circle session. I've been working on my LifeCharter and have some questions about the Career dimension.\n\nWould it be possible to get some feedback on my draft?\n\nThanks!\nSarah",
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
    to: ["babs@example.com"],
    body: "Hi Babs,\n\nThank you for your interest in speaking at our conference. We'd love to have you present on LifeCharter and alignment.\n\nThe event is scheduled for October 15-17, 2026. Would you be available for a keynote on the 16th?\n\nBest regards,\nMichael",
    preview: "Hi Babs, Thank you for your interest in speaking at our conference...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    attachments: [{ filename: "Conference_Info.pdf", size: 2500000 }],
    folder: "inbox",
  },
];

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [composeMode, setComposeMode] = useState<"new" | "reply" | "forward">("new");
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
    accountId: "1",
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showDrafts, setShowDrafts] = useState(false);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!showCompose || !composeData.to) return;
    
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [showCompose, composeData]);

  const saveDraft = () => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      savedAt: new Date(),
      accountId: composeData.accountId,
    };
    
    setDrafts((prev) => {
      const filtered = prev.filter((d) => d.to !== composeData.to || d.subject !== composeData.subject);
      return [newDraft, ...filtered];
    });
    setLastSaved(new Date());
  };

  const openCompose = (mode: "new" | "reply" | "forward" = "new", email?: Email) => {
    setComposeMode(mode);
    
    if (mode === "reply" && email) {
      setComposeData({
        to: email.from.email,
        subject: `Re: ${email.subject}`,
        body: `\n\n---\nOn ${email.timestamp.toLocaleDateString()}, ${email.from.name} wrote:\n${email.body}`,
        accountId: "1",
      });
    } else if (mode === "forward" && email) {
      setComposeData({
        to: "",
        subject: `Fwd: ${email.subject}`,
        body: `\n\n--- Forwarded message ---\nFrom: ${email.from.name} <${email.from.email}>\nSubject: ${email.subject}\n\n${email.body}`,
        accountId: "1",
      });
    } else {
      setComposeData({ to: "", subject: "", body: "", accountId: "1" });
    }
    
    setShowCompose(true);
  };

  const loadDraft = (draft: Draft) => {
    setComposeData({
      to: draft.to,
      subject: draft.subject,
      body: draft.body,
      accountId: draft.accountId,
    });
    setShowCompose(true);
    setShowDrafts(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="font-serif text-lg text-navy">Inbox</h1>
            </div>
          </div>
          <button
            onClick={() => openCompose("new")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gold text-navy rounded-xl font-medium hover:bg-gold-light transition-all"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>

        <nav className="flex-1 py-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-navy bg-navy/5 border-r-2 border-navy">
            <Inbox className="w-5 h-5" />
            <span className="flex-1">Inbox</span>
            <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full">12</span>
          </button>
          <button 
            onClick={() => setShowDrafts(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-soft-taupe hover:bg-gray-50"
          >
            <Save className="w-5 h-5" />
            <span className="flex-1">Drafts</span>
            {drafts.length > 0 && (
              <span className="bg-gray-200 text-navy text-xs font-bold px-2 py-0.5 rounded-full">
                {drafts.length}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-soft-taupe hover:bg-gray-50">
            <Send className="w-5 h-5" />
            <span className="flex-1">Sent</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs font-medium text-soft-taupe uppercase mb-3">Accounts</p>
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: account.color }} />
              <span className="text-sm text-navy truncate">{account.name}</span>
            </div>
          ))}
          <button
            onClick={() => setShowConnectModal(true)}
            className="text-sm text-teal hover:underline mt-2"
          >
            + Add Account
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="w-[400px] bg-cream border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                selectedEmail?.id === email.id ? "bg-white border-l-4 border-l-navy" : "bg-white hover:bg-gray-50"
              } ${!email.isRead ? "font-medium" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-navy">{email.from.name}</span>
                <span className="text-xs text-soft-taupe">{formatTime(email.timestamp)}</span>
              </div>
              <p className="text-sm text-navy truncate mb-1">{email.subject}</p>
              <p className="text-xs text-soft-taupe truncate">{email.preview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 bg-white flex flex-col">
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Archive className="w-5 h-5 text-soft-taupe" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-soft-taupe" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openCompose("reply", selectedEmail)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy/5 text-navy rounded-lg hover:bg-navy/10 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button 
                  onClick={() => openCompose("forward", selectedEmail)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy/5 text-navy rounded-lg hover:bg-navy/10 transition-colors"
                >
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-serif text-navy mb-4">{selectedEmail.subject}</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xl">
                  {selectedEmail.from.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy">{selectedEmail.from.name}</p>
                      <p className="text-sm text-soft-taupe">{selectedEmail.from.email}</p>
                    </div>
                    <span className="text-sm text-soft-taupe">{formatDate(selectedEmail.timestamp)}</span>
                  </div>
                  <p className="text-sm text-soft-taupe mt-1">To: {selectedEmail.to.join(", ")}</p>
                </div>
              </div>

              <div className="prose max-w-none text-navy/80 whitespace-pre-wrap">
                {selectedEmail.body}
              </div>

              {selectedEmail.hasAttachments && selectedEmail.attachments && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-medium text-navy mb-3">
                    {selectedEmail.attachments.length} attachment{selectedEmail.attachments.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedEmail.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-cream-dark/30 rounded-xl">
                        <Paperclip className="w-5 h-5 text-soft-taupe" />
                        <div>
                          <p className="text-sm font-medium text-navy">{att.filename}</p>
                          <p className="text-xs text-soft-taupe">{(att.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Reply */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Click to reply..."
                  onClick={() => openCompose("reply", selectedEmail)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-soft-taupe">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-serif text-navy">
                {composeMode === "reply" ? "Reply" : composeMode === "forward" ? "Forward" : "New Message"}
              </h2>
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <span className="text-sm text-soft-taupe flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <button 
                  onClick={saveDraft}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Save Draft"
                >
                  <Save className="w-5 h-5 text-soft-taupe" />
                </button>
                <button 
                  onClick={() => setShowCompose(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-soft-taupe" />
                </button>
              </div>
            </div>

            {/* Compose Form */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">From</label>
                <select 
                  value={composeData.accountId}
                  onChange={(e) => setComposeData({ ...composeData, accountId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                >
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
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy mb-1">Message</label>
                <textarea
                  placeholder="Write your message..."
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5 text-soft-taupe" />
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    saveDraft();
                    setShowCompose(false);
                  }}
                  className="px-4 py-2 text-soft-taupe hover:bg-gray-100 rounded-lg"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => {
                    // Send email logic here
                    setShowCompose(false);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-gold text-navy rounded-xl font-medium hover:bg-gold-light"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drafts Modal */}
      {showDrafts && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-serif text-navy">Drafts</h2>
              <button 
                onClick={() => setShowDrafts(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {drafts.length === 0 ? (
                <div className="text-center py-8 text-soft-taupe">
                  <Save className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No drafts saved</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => loadDraft(draft)}
                      className="p-4 bg-cream-dark/30 rounded-xl cursor-pointer hover:bg-cream-dark/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-navy">{draft.to || "No recipient"}</span>
                        <span className="text-xs text-soft-taupe">
                          {draft.savedAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-navy truncate">{draft.subject || "No subject"}</p>
                      <p className="text-xs text-soft-taupe truncate">{draft.body.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              )}
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
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 font-bold text-xl">G</div>
                <div className="text-left">
                  <p className="font-medium text-navy">Gmail</p>
                  <p className="text-sm text-soft-taupe">Connect your Google account</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">E</div>
                <div className="text-left">
                  <p className="font-medium text-navy">Microsoft Exchange</p>
                  <p className="text-sm text-soft-taupe">Connect your work email</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 font-bold text-xl">i</div>
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
