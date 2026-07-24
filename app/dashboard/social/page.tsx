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
  Sparkles,
  Wand2,
  Palette,
  Layout,
  FileText,
  Copy,
  RefreshCw,
  Download,
  Trash2,
  Edit3,
  Grid,
  List,
  Megaphone,
  Target,
  BarChart3,
  Lightbulb,
  Quote,
} from "lucide-react";

// Types
interface ContentCampaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "completed" | "paused";
  theme: string;
  targetPlatforms: string[];
  posts: ContentPost[];
}

interface ContentPost {
  id: string;
  campaignId?: string;
  title: string;
  content: string;
  caption: string;
  hashtags: string[];
  seoKeywords: string[];
  platforms: string[];
  mediaType: "image" | "video" | "carousel" | "text";
  mediaUrls?: string[];
  status: "idea" | "draft" | "review" | "approved" | "scheduled" | "published";
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  aiGenerated?: boolean;
}

interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  promptTemplate: string;
  suggestedHashtags: string[];
  bestPlatforms: string[];
}

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", colorClass: "bg-pink-500", bestFor: ["visual", "lifestyle", "community"] },
  { id: "twitter", name: "X / Twitter", icon: Twitter, color: "#000000", colorClass: "bg-black", bestFor: ["thoughts", "news", "conversations"] },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2", colorClass: "bg-blue-600", bestFor: ["professional", "insights", "leadership"] },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000", colorClass: "bg-red-600", bestFor: ["video", "tutorials", "long-form"] },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2", colorClass: "bg-blue-500", bestFor: ["community", "events", "discussions"] },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "#000000", colorClass: "bg-black", bestFor: ["short-video", "trends", "entertainment"] },
  { id: "bluesky", name: "Bluesky", icon: MessageCircle, color: "#0560FF", colorClass: "bg-blue-500", bestFor: ["thoughts", "community", "early-adopter"] },
];

const contentTemplates: ContentTemplate[] = [
  {
    id: "1",
    name: "Daily Alignment Tip",
    category: "Educational",
    description: "Share a quick alignment tip or insight",
    promptTemplate: "Create a short, inspiring tip about {topic} that helps people find alignment in their daily lives. Keep it under 100 words.",
    suggestedHashtags: ["#LifeCharter", "#Alignment", "#DailyWisdom", "#Transformation"],
    bestPlatforms: ["instagram", "twitter", "linkedin", "bluesky"],
  },
  {
    id: "2",
    name: "Transformation Story",
    category: "Storytelling",
    description: "Share a client or personal transformation journey",
    promptTemplate: "Tell a brief story about a transformation moment related to {topic}. Focus on the before, the turning point, and the after.",
    suggestedHashtags: ["#Transformation", "#LifeCharter", "#SuccessStory", "#Inspiration"],
    bestPlatforms: ["instagram", "facebook", "linkedin"],
  },
  {
    id: "3",
    name: "Question for Community",
    category: "Engagement",
    description: "Ask an engaging question to spark conversation",
    promptTemplate: "Ask a thought-provoking question about {topic} that encourages people to reflect and share their experiences.",
    suggestedHashtags: ["#Community", "#Conversation", "#LifeCharter", "#Question"],
    bestPlatforms: ["twitter", "facebook", "linkedin", "bluesky"],
  },
  {
    id: "4",
    name: "Quote with Reflection",
    category: "Inspirational",
    description: "Share a powerful quote with personal reflection",
    promptTemplate: "Share an inspiring quote about {topic} and add 2-3 sentences of personal reflection on why it matters.",
    suggestedHashtags: ["#Quote", "#Inspiration", "#Wisdom", "#LifeCharter"],
    bestPlatforms: ["instagram", "twitter", "linkedin"],
  },
  {
    id: "5",
    name: "Behind the Scenes",
    category: "Authentic",
    description: "Show the real work behind the scenes",
    promptTemplate: "Describe what you're currently working on related to {topic}. Be authentic about the process, challenges, and wins.",
    suggestedHashtags: ["#BehindTheScenes", "#Authentic", "#LifeCharter", "#Process"],
    bestPlatforms: ["instagram", "tiktok", "facebook"],
  },
  {
    id: "6",
    name: "Teaching Moment",
    category: "Educational",
    description: "Teach a concept from LifeCharter",
    promptTemplate: "Explain one key concept about {topic} in simple terms that anyone can understand. Use an analogy or example.",
    suggestedHashtags: ["#Teach", "#Learn", "#LifeCharter", "#Wisdom"],
    bestPlatforms: ["instagram", "youtube", "linkedin", "tiktok"],
  },
];

const mockCampaigns: ContentCampaign[] = [
  {
    id: "1",
    name: "August Alignment Series",
    description: "Daily alignment tips and practices for the month of August",
    startDate: new Date("2026-08-01"),
    endDate: new Date("2026-08-31"),
    status: "active",
    theme: "Alignment & Purpose",
    targetPlatforms: ["instagram", "twitter", "linkedin"],
    posts: [],
  },
  {
    id: "2",
    name: "LifeCharter Launch",
    description: "Promotional content for LifeCharter Circle enrollment",
    startDate: new Date("2026-07-15"),
    endDate: new Date("2026-08-15"),
    status: "active",
    theme: "Enrollment & Community",
    targetPlatforms: ["instagram", "facebook", "linkedin"],
    posts: [],
  },
];

const mockPosts: ContentPost[] = [
  {
    id: "1",
    campaignId: "1",
    title: "The Yellow Light Practice",
    content: "Transformation is not about fixing what is broken; it is about remembering what is true. 🦋✨\n\nWhat truth are you remembering today?",
    caption: "The Yellow Light is that sacred pause between stimulus and response. It's where choice lives. ✨\n\nToday, practice noticing your Yellow Light moments. When something triggers you, pause. Breathe. Choose your response rather than reacting.\n\nThis is alignment in action.",
    hashtags: ["LifeCharter", "Alignment", "YellowLight", "Mindfulness", "Transformation"],
    seoKeywords: ["alignment", "mindfulness", "personal growth", "transformation"],
    platforms: ["instagram", "facebook"],
    mediaType: "image",
    status: "approved",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 2),
    createdAt: new Date(),
    updatedAt: new Date(),
    aiGenerated: true,
  },
  {
    id: "2",
    title: "Head Up, Wings Out",
    content: "Head up, wings out. Today's Alignment Anchor: What ONE thing would make today feel aligned?\n\nNot productive. Not busy. ALIGNED.\n\nShare below 👇",
    caption: "Your daily Alignment Anchor 🦋\n\nAsk yourself: What ONE thing would make today feel aligned?\n\nNot productive.\nNot busy.\nNot perfect.\n\nALIGNED. ✨\n\nShare yours below and let's hold space for each other's intentions.",
    hashtags: ["AlignmentAnchor", "LifeCharter", "DailyIntention", "Butterfly"],
    seoKeywords: ["daily intention", "alignment", "purpose"],
    platforms: ["twitter", "bluesky"],
    mediaType: "text",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
    aiGenerated: false,
  },
];

export default function SocialPage() {
  const [activeView, setActiveView] = useState<"planner" | "creator" | "calendar" | "library" | "analytics">("planner");
  const [campaigns, setCampaigns] = useState<ContentCampaign[]>(mockCampaigns);
  const [posts, setPosts] = useState<ContentPost[]>(mockPosts);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Form states for content creation
  const [contentForm, setContentForm] = useState({
    title: "",
    topic: "",
    content: "",
    caption: "",
    hashtags: [] as string[],
    seoKeywords: [] as string[],
    platforms: [] as string[],
    mediaType: "image" as const,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idea": return "bg-purple-100 text-purple-700";
      case "draft": return "bg-gray-100 text-gray-600";
      case "review": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-blue-100 text-blue-700";
      case "scheduled": return "bg-green-100 text-green-700";
      case "published": return "bg-navy/10 text-navy";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const generateContent = async () => {
    if (!selectedTemplate || !contentForm.topic) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedCaption = selectedTemplate.promptTemplate.replace("{topic}", contentForm.topic);
      
      setContentForm(prev => ({
        ...prev,
        caption: generatedCaption,
        hashtags: selectedTemplate.suggestedHashtags,
        platforms: selectedTemplate.bestPlatforms,
      }));
      
      setIsGenerating(false);
    }, 1500);
  };

  const generateHashtags = () => {
    const baseHashtags = ["LifeCharter", "Alignment", "Transformation", "SacredKaleidoscope"];
    const topicHashtags = contentForm.topic.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return [...baseHashtags, ...topicHashtags].slice(0, 8);
  };

  const generateSEOKeywords = () => {
    return ["personal growth", "alignment", "life design", contentForm.topic.toLowerCase()];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Social Content Studio</h1>
          <p className="text-soft-taupe">Plan, create, and manage content across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light transition-all shadow-glow"
          >
            <Sparkles className="w-5 h-5" />
            Create with AI
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl soft-shadow w-fit">
        {[
          { id: "planner", label: "Content Planner", icon: Layout },
          { id: "creator", label: "AI Creator", icon: Wand2 },
          { id: "calendar", label: "Calendar", icon: Calendar },
          { id: "library", label: "Content Library", icon: FileText },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeView === view.id
                ? "bg-navy text-white"
                : "text-soft-taupe hover:bg-gray-100"
            }`}
          >
            <view.icon className="w-4 h-4" />
            {view.label}
          </button>
        ))}
      </div>

      {/* CONTENT PLANNER VIEW */}
      {activeView === "planner" && (
        <div className="space-y-6">
          {/* Campaigns Overview */}
          <div className="grid grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
                className={`bg-white rounded-2xl p-6 soft-shadow cursor-pointer transition-all hover:shadow-lg ${
                  selectedCampaign === campaign.id ? "ring-2 ring-gold" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-navy">{campaign.name}</h3>
                    <p className="text-sm text-soft-taupe mt-1">{campaign.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {campaign.targetPlatforms.slice(0, 4).map((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId);
                    const PlatformIcon = platform?.icon || MessageCircle;
                    return (
                      <div
                        key={platformId}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: platform?.color }}
                      >
                        <PlatformIcon className="w-4 h-4" />
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-taupe">
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </span>
                  <span className="text-navy font-medium">
                    {posts.filter((p) => p.campaignId === campaign.id).length} posts
                  </span>
                </div>
              </div>
            ))}
            
            {/* Add Campaign Card */}
            <button className="bg-cream-dark/30 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-navy transition-colors flex flex-col items-center justify-center text-soft-taupe hover:text-navy">
              <Plus className="w-12 h-12 mb-2" />
              <span className="font-medium">Create Campaign</span>
            </button>
          </div>

          {/* Content Ideas Board */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Content Ideas Board</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-navy text-white" : "text-soft-taupe hover:bg-gray-100"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-navy text-white" : "text-soft-taupe hover:bg-gray-100"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Kanban-style columns */}
            <div className="grid grid-cols-5 gap-4">
              {["idea", "draft", "review", "approved", "scheduled"].map((status) => (
                <div key={status} className="bg-cream-dark/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-navy capitalize">{status}</h4>
                    <span className="text-xs bg-white px-2 py-1 rounded-full">
                      {posts.filter((p) => p.status === status).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {posts
                      .filter((p) => p.status === status)
                      .map((post) => (
                        <div
                          key={post.id}
                          className="bg-white p-3 rounded-lg soft-shadow cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-medium text-navy line-clamp-2">{post.title}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {post.platforms.slice(0, 3).map((platformId) => {
                              const platform = platforms.find((p) => p.id === platformId);
                              return (
                                <div
                                  key={platformId}
                                  className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                                  style={{ backgroundColor: platform?.color }}
                                >
                                  {platformId[0].toUpperCase()}
                                </div>
                              );
                            })}
                          </div>
                          {post.aiGenerated && (
                            <span className="text-xs text-purple-600 flex items-center gap-1 mt-2">
                              <Sparkles className="w-3 h-3" />
                              AI Generated
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI CREATOR VIEW */}
      {activeView === "creator" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="col-span-1 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-4">Content Templates</h3>
            <div className="space-y-3">
              {contentTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-gold bg-gold/5"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-navy">{template.name}</span>
                    <span className="text-xs text-soft-taupe bg-gray-100 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-soft-taupe">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.bestPlatforms.slice(0, 3).map((p) => (
                      <span key={p} className="text-xs text-navy/60">#{p}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Creation Form */}
          <div className="col-span-2 bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-6">Create Content</h3>
            
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Topic or Theme</label>
                  <input
                    type="text"
                    value={contentForm.topic}
                    onChange={(e) => setContentForm({ ...contentForm, topic: e.target.value })}
                    placeholder="e.g., morning routines, setting boundaries, finding purpose"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateContent}
                  disabled={isGenerating || !contentForm.topic}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy/90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </button>

                {/* Generated Content */}
                {contentForm.caption && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">Generated Caption</label>
                      <textarea
                        value={contentForm.caption}
                        onChange={(e) => setContentForm({ ...contentForm, caption: e.target.value })}
                        className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-navy outline-none resize-none"
                      />
                    </div>

                    {/* Hashtags */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">Suggested Hashtags</label>
                      <div className="flex flex-wrap gap-2">
                        {contentForm.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-navy/5 text-navy rounded-full text-sm flex items-center gap-1"
                          >
                            #{tag}
                            <button
                              onClick={() => setContentForm({
                                ...contentForm,
                                hashtags: contentForm.hashtags.filter((_, i) => i !== idx)
                              })}
                              className="text-navy/50 hover:text-navy"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() => setContentForm({
                            ...contentForm,
                            hashtags: [...contentForm.hashtags, "NewTag"]
                          })}
                          className="px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-400 rounded-full text-sm hover:border-navy hover:text-navy"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* SEO Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">SEO Keywords</label>
                      <div className="flex flex-wrap gap-2">
                        {generateSEOKeywords().map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Platform Selection */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">Target Platforms</label>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map((platform) => {
                          const PlatformIcon = platform.icon;
                          const isSelected = contentForm.platforms.includes(platform.id);
                          return (
                            <button
                              key={platform.id}
                              onClick={() => {
                                if (isSelected) {
                                  setContentForm({
                                    ...contentForm,
                                    platforms: contentForm.platforms.filter((p) => p !== platform.id)
                                  });
                                } else {
                                  setContentForm({
                                    ...contentForm,
                                    platforms: [...contentForm.platforms, platform.id]
                                  });
                                }
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? "border-navy bg-navy/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
                              <span className={`text-sm ${isSelected ? "font-medium text-navy" : "text-soft-taupe"}`}>
                                {platform.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Media Type */}
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">Content Type</label>
                      <div className="flex gap-3">
                        {[
                          { id: "image", label: "Image", icon: ImageIcon },
                          { id: "video", label: "Video", icon: Video },
                          { id: "carousel", label: "Carousel", icon: Layout },
                          { id: "text", label: "Text Only", icon: Type },
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setContentForm({ ...contentForm, mediaType: type.id as any })}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                              contentForm.mediaType === type.id
                                ? "border-gold bg-gold/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            <span className="text-sm">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-navy/20 text-navy rounded-xl hover:bg-navy/5">
                        <Save className="w-4 h-4" />
                        Save as Draft
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-gold-light shadow-glow">
                        <Send className="w-4 h-4" />
                        Add to Queue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-soft-taupe">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-navy mb-2">Select a Template</p>
                <p>Choose a content template from the left to get started with AI generation</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {activeView === "calendar" && (
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
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
              const dayPosts = posts.filter((p) => p.scheduledFor?.getDate() === date);
              return (
                <div
                  key={date}
                  className={`aspect-square p-2 rounded-xl border-2 ${
                    date === 24 ? "border-gold bg-gold/5" : "border-gray-100 hover:border-gray-200"
                  } cursor-pointer transition-colors`}
                >
                  <span className={`text-sm ${date === 24 ? "font-bold text-navy" : "text-navy/70"}`}>
                    {date}
                  </span>
                  {dayPosts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayPosts.slice(0, 3).map((post, idx) => (
                        <div
                          key={idx}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: platforms.find((p) => p.id === post.platforms[0])?.color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIBRARY VIEW */}
      {activeView === "library" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl soft-shadow">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-taupe" />
              <input
                type="text"
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-navy outline-none"
              />
            </div>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
              <option>All Status</option>
              <option>Draft</option>
              <option>Approved</option>
              <option>Published</option>
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
              <option>All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-6 soft-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-soft-taupe" />
                  </button>
                </div>
                <h4 className="font-semibold text-navy mb-2">{post.title}</h4>
                <p className="text-sm text-soft-taupe line-clamp-3 mb-4">{post.caption}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.hashtags.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="text-xs text-navy/60">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {post.platforms.slice(0, 3).map((platformId) => {
                      const platform = platforms.find((p) => p.id === platformId);
                      return (
                        <div
                          key={platformId}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
                          style={{ backgroundColor: platform?.color }}
                        >
                          {platformId[0].toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit3 className="w-4 h-4 text-soft-taupe" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Copy className="w-4 h-4 text-soft-taupe" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS VIEW */}
      {activeView === "analytics" && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Posts</p>
              <p className="text-3xl font-bold text-navy">127</p>
              <p className="text-xs text-green-600 mt-1">+12 this month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Avg. Engagement</p>
              <p className="text-3xl font-bold text-navy">4.8%</p>
              <p className="text-xs text-green-600 mt-1">+0.8% vs last month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">Total Reach</p>
              <p className="text-3xl font-bold text-navy">45.2k</p>
              <p className="text-xs text-green-600 mt-1">+15% this month</p>
            </div>
            <div className="bg-white rounded-2xl p-6 soft-shadow">
              <p className="text-sm text-soft-taupe mb-2">AI Generated</p>
              <p className="text-3xl font-bold text-navy">68%</p>
              <p className="text-xs text-soft-taupe mt-1">of all content</p>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-white rounded-2xl p-6 soft-shadow">
            <h3 className="text-lg font-semibold text-navy mb-6">Platform Performance</h3>
            <div className="space-y-4">
              {platforms.slice(0, 5).map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <div key={platform.id} className="flex items-center gap-4 p-4 bg-cream-dark/30 rounded-xl">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      <PlatformIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-navy">{platform.name}</p>
                      <p className="text-sm text-soft-taupe">{platform.bestFor.join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Posts</p>
                        <p className="font-semibold text-navy">24</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Engagement</p>
                        <p className="font-semibold text-navy">5.2%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-soft-taupe">Reach</p>
                        <p className="font-semibold text-navy">12.4k</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-navy">Quick Create</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-soft-taupe" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-soft-taupe">Choose a starting point:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setActiveView("creator");
                  }}
                  className="p-6 border-2 border-navy/20 rounded-xl hover:border-navy transition-colors text-left"
                >
                  <Wand2 className="w-8 h-8 text-navy mb-3" />
                  <p className="font-medium text-navy">AI Creator</p>
                  <p className="text-sm text-soft-taupe">Generate content with AI templates</p>
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-6 border-2 border-navy/20 rounded-xl hover:border-navy transition-colors text-left"
                >
                  <FileText className="w-8 h-8 text-navy mb-3" />
                  <p className="font-medium text-navy">From Scratch</p>
                  <p className="text-sm text-soft-taupe">Start with a blank post</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
