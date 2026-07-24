"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Video,
  Type,
  Hash,
  AtSign,
  Link as LinkIcon,
  Send,
  Save,
  Eye,
  MoreHorizontal,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  MessageCircle,
  TrendingUp,
  Users,
  Heart,
  Share2,
  Filter,
  Search,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

// Types
interface SocialAccount {
  id: string;
  platform: "instagram" | "twitter" | "linkedin" | "youtube" | "facebook" | "tiktok" | "bluesky";
  name: string;
  handle: string;
  avatar?: string;
  isConnected: boolean;
  followerCount: number;
  color: string;
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  media?: { type: "image" | "video"; url: string }[];
  status: "draft" | "pending_approval" | "scheduled" | "published" | "failed";
  scheduledFor?: Date;
  publishedAt?: Date;
  createdBy: string;
  approvedBy?: string;
  segmentId?: string;
  hashtags: string[];
  mentions: string[];
  link?: string;
  analytics?: {
    impressions: number;
    engagement: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ContentCalendar {
  date: Date;
  posts: SocialPost[];
}

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", colorClass: "bg-pink-500" },
  { id: "twitter", name: "X / Twitter", icon: Twitter, color: "#000000", colorClass: "bg-black" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2", colorClass: "bg-blue-600" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000", colorClass: "bg-red-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2", colorClass: "bg-blue-500" },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000", colorClass: "bg-black" },
  { id: "bluesky", name: "Bluesky", icon: MessageCircle, color: "#0560FF", colorClass: "bg-blue-500" },
];

const mockAccounts: SocialAccount[] = [
  { id: "1", platform: "instagram", name: "Sacred Kaleidoscope", handle: "@sacredkaleidoscope", isConnected: true, followerCount: 12500, color: "#E4405F" },
  { id: "2", platform: "twitter", name: "Babs Carroll", handle: "@babs_carroll", isConnected: true, followerCount: 8900, color: "#000000" },
  { id: "3", platform: "linkedin", name: "AmiLynne Carroll", handle: "amilynne-carroll", isConnected: true, followerCount: 4500, color: "#0A66C2" },
  { id: "4", platform: "youtube", name: "Sacred Kaleidoscope", handle: "@sacredkaleidoscope", isConnected: false, followerCount: 0, color: "#FF0000" },
  { id: "5", platform: "facebook", name: "Sacred Kaleidoscope Community", handle: "sacredkaleidoscope", isConnected: false, followerCount: 0, color: "#1877F2" },
  { id: "6", platform: "tiktok", name: "Babs Carroll", handle: "@babs_carroll", isConnected: true, followerCount: 3200, color: "#000000" },
];

const mockPosts: SocialPost[] = [
  {
    id: "1",
    content: "Transformation is not about fixing what is broken; it is about remembering what is true. 🦋✨\n\nWhat truth are you remembering today?\n\n#LifeCharter #Alignment #Transformation",
    platforms: ["instagram", "facebook"],
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 2),
    createdBy: "Babs",
    hashtags: ["LifeCharter", "Alignment", "Transformation"],
    mentions: [],
  },
  {
    id: "2",
    content: "Head up, wings out. Today's Alignment Anchor: What ONE thing would make today feel aligned?\n\nNot productive. Not busy. ALIGNED.\n\nShare below 👇",
    platforms: ["twitter", "bluesky"],
    status: "draft",
    createdBy: "Aira",
    hashtags: ["AlignmentAnchor", "LifeCharter"],
    mentions: [],
  },
  {
    id: "3",
    content: "New episode of Conversations of Consequence DAILY is live! Today we're exploring the Yellow Light and what it means to pause before reacting.\n\nLink in bio to listen 🎧",
    platforms: ["instagram", "linkedin", "facebook"],
    status: "pending_approval",
    createdBy: "Aira",
    hashtags: ["ConversationsOfConsequence", "YellowLight", "Mindfulness"],
    mentions: [],
  },
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "create" | "analytics">("dashboard");
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockAccounts);
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPlatform, setFilterPlatform] = useState<string>("");

  // Form state for creating posts
  const [postContent, setPostContent] = useState("");
  const [postHashtags, setPostHashtags] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-600";
      case "pending_approval": return "bg-yellow-100 text-yellow-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "published": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft": return "Draft";
      case "pending_approval": return "Pending Approval";
      case "scheduled": return "Scheduled";
      case "published": return "Published";
      case "failed": return "Failed";
      default: return status;
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filterStatus && post.status !== filterStatus) return false;
    if (filterPlatform && !post.platforms.includes(filterPlatform)) return false;
    return true;
  });

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Social</h1>
          <p className="text-soft-taupe">Create, approve, and schedule content across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Connect Account
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl soft-shadow w-fit">
        {[
          { id: "dashboard", label: "Dashboard", icon: TrendingUp },
          { id: "calendar", label: "Calendar", icon: Calendar },
          { id: "create", label: "Create", icon: Plus },
          { id: "analytics", label: "Analytics", icon: Users },
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

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="grid grid-cols-4 gap-6">
            {accounts.filter((a) => a.isConnected).map((account) => {
              const PlatformIcon = platforms.find((p) => p.id === account.platform)?.icon || MessageCircle;
              return (
                <div key={account.id} className="bg-white rounded-2xl p-6 soft-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: account.color }}
                    >
                      <PlatformIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-navy">{account.name}</p>
                      <p className="text-sm text-soft-taupe">{account.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-navy">{formatNumber(account.followerCount)}</p>
                      <p className="text-xs text-soft-taupe">followers</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Connected</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Posts Overview */}
          <div className="bg-white rounded-2xl soft-shadow">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-navy">Content Pipeline</h3>
              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="draft">Drafts</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="">All Platforms</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex -space-x-2">
                      {post.platforms.slice(0, 3).map((platformId) => {
                        const platform = platforms.find((p) => p.id === platformId);
                        const PlatformIcon = platform?.icon || MessageCircle;
                        return (
                          <div
                            key={platformId}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white"
                            style={{ backgroundColor: platform?.color }}
                          >
                            <PlatformIcon className="w-4 h-4" />
                          </div>
                        );
                      })}
                      {post.platforms.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-navy border-2 border-white">
                          +{post.platforms.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-navy line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(post.status)}`}>
                          {getStatusLabel(post.status)}
                        </span>
                        {post.scheduledFor && (
                          <span className="text-xs text-soft-taupe flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.scheduledFor)}
                          </span>
                        )}
                        <span className="text-xs text-soft-taupe">by {post.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === "pending_approval" && (
                        <>
                          <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-soft-taupe" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div className="bg-white rounded-2xl p-6 soft-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-navy">Content Calendar</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
              <span className="font-medium text-navy">July 2026</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-soft-taupe py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
              <div
                key={date}
                className={`aspect-square p-2 rounded-xl border-2 ${
                  date === 24 ? "border-gold bg-gold/5" : "border-gray-100 hover:border-gray-200"
                } cursor-pointer transition-colors`}
              >
                <span className={`text-sm ${date === 24 ? "font-bold text-navy" : "text-navy/70"}`}>
                  {date}
                </span>
                {date === 24 && (
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mb-1" />
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TAB */}
      {activeTab === "create" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Create Post Form */}
          <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-6">Create New Post</h3>
            
            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-navy mb-2">Select Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const PlatformIcon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `border-[${platform.color}] bg-opacity-10`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={isSelected ? { borderColor: platform.color, backgroundColor: `${platform.color}15` } : {}}
                    >
                      <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
                      <span className={`text-sm ${isSelected ? "font-medium" : "text-soft-taupe"}`}>
                        {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-navy mb-2">Content</label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What would you like to share?"
                className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Image">
                    <ImageIcon className="w-5 h-5 text-soft-taupe" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Video">
                    <Video className="w-5 h-5 text-soft-taupe" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Hashtag">
                    <Hash className="w-5 h-5 text-soft-taupe" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Mention">
                    <AtSign className="w-5 h-5 text-soft-taupe" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Link">
                    <LinkIcon className="w-5 h-5 text-soft-taupe" />
                  </button>
                </div>
                <span className="text-sm text-soft-taupe">{postContent.length}/280</span>
              </div>
            </div>

            {/* Hashtags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-navy mb-2">Hashtags</label>
              <input
                type="text"
                value={postHashtags}
                onChange={(e) => setPostHashtags(e.target.value)}
                placeholder="#LifeCharter #Alignment #Transformation"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none"
              />
            </div>

            {/* Scheduling */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-navy mb-2">Schedule</label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5 transition-all">
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow">
                <Send className="w-4 h-4" />
                Schedule Post
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-cream-dark/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Preview</h3>
            {selectedPlatforms.length > 0 ? (
              <div className="space-y-4">
                {selectedPlatforms.slice(0, 2).map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId);
                  const PlatformIcon = platform?.icon || MessageCircle;
                  return (
                    <div key={platformId} className="bg-white rounded-xl p-4 soft-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <PlatformIcon className="w-5 h-5" style={{ color: platform?.color }} />
                        <span className="font-medium text-navy">{platform?.name}</span>
                      </div>
                      <p className="text-sm text-navy/80 whitespace-pre-wrap">
                        {postContent || "Your post content will appear here..."}
                      </p>
                      {postHashtags && (
                        <p className="text-sm text-blue-600 mt-2">{postHashtags}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-soft-taupe">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select platforms to see preview</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Followers</p>
              <p className="text-3xl font-bold text-navy">{formatNumber(31100)}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+5.2% this month</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Engagement</p>
              <p className="text-3xl font-bold text-navy">4.8%</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+0.8% this month</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Posts Published</p>
              <p className="text-3xl font-bold text-navy">127</p>
              <p className="text-sm text-soft-taupe mt-2">This month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Avg. Reach</p>
              <p className="text-3xl font-bold text-navy">2,450</p>
              <p className="text-sm text-soft-taupe mt-2">Per post</p>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-6">Platform Performance</h3>
            <div className="space-y-4">
              {accounts.filter((a) => a.isConnected).map((account) => {
                const platform = platforms.find((p) => p.id === account.platform);
                const PlatformIcon = platform?.icon || MessageCircle;
                return (
                  <div key={account.id} className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: account.color }}
                    >
                      <PlatformIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-navy">{account.name}</p>
                      <p className="text-sm text-soft-taupe">{account.handle}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Followers</p>
                        <p className="font-semibold text-navy">{formatNumber(account.followerCount)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Engagement</p>
                        <p className="font-semibold text-navy">4.2%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Posts</p>
                        <p className="font-semibold text-navy">42</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Connect Social Account</h2>
              <button onClick={() => setShowConnectModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-3">
              {platforms.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-navy transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      <PlatformIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-navy">{platform.name}</p>
                      <p className="text-sm text-soft-taupe">Connect your account</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
