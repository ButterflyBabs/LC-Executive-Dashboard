import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segments, businesses, segmentDimensions, tasks } from "@/db/schema";
import { eq, and, count, avg, sql } from "drizzle-orm";

// Mock data for when database is not available
const mockBusinesses = [
  { id: 1, name: "LifeCharter Core", icon: "🦋", color: "#5E3B6C", slug: "lifecharter-core" },
  { id: 2, name: "LifeCharter Command Suite", icon: "⚡", color: "#2E7C83", slug: "lifecharter-command-suite" },
  { id: 3, name: "AmiLynne Speaks", icon: "🎤", color: "#D4AF63", slug: "amilynne-speaks" },
  { id: 4, name: "Business in a Bot", icon: "🤖", color: "#1F315B", slug: "business-in-a-bot" },
  { id: 5, name: "Carroll Media", icon: "🎬", color: "#ADB8A0", slug: "carroll-media" },
];

const mockSegments = [
  // LifeCharter Core
  { id: 1, businessId: 1, name: "LifeCharter Incubator", slug: "incubator", description: "Free 90-minute workshop introducing LifeCharter principles", icon: "🥚", color: "#7B4F8C", health: "healthy", revenueTarget: "5000", dimensionScore: 85, tasks: { total: 12, completed: 8, inProgress: 3 } },
  { id: 2, businessId: 1, name: "LifeCharter Circle", slug: "circle", description: "Deep coaching and community container", icon: "⭕", color: "#5E3B6C", health: "healthy", revenueTarget: "25000", dimensionScore: 92, tasks: { total: 18, completed: 15, inProgress: 2 } },
  { id: 3, businessId: 1, name: "Self-Directed LifeCharter", slug: "self-directed", description: "Scalable self-paced LifeCharter program", icon: "📚", color: "#4A2E55", health: "attention", revenueTarget: "15000", dimensionScore: 72, tasks: { total: 8, completed: 4, inProgress: 3 } },
  { id: 4, businessId: 1, name: "Conversations of Consequence", slug: "conversations", description: "Daily content and media", icon: "🎙️", color: "#8B6B9C", health: "healthy", revenueTarget: "8000", dimensionScore: 88, tasks: { total: 25, completed: 20, inProgress: 4 } },
  // Command Suite
  { id: 5, businessId: 2, name: "Bot Builder", slug: "bot-builder", description: "AI bot builder tool", icon: "🔧", color: "#3A9CA5", health: "healthy", revenueTarget: "20000", dimensionScore: 90, tasks: { total: 15, completed: 12, inProgress: 2 } },
  { id: 6, businessId: 2, name: "Dashboard", slug: "dashboard", description: "Executive dashboard", icon: "📊", color: "#2E7C83", health: "attention", revenueTarget: "12000", dimensionScore: 68, tasks: { total: 22, completed: 14, inProgress: 6 } },
  { id: 7, businessId: 2, name: "Automation Engine", slug: "automation", description: "Workflow automation", icon: "⚙️", color: "#256A70", health: "healthy", revenueTarget: "18000", dimensionScore: 82, tasks: { total: 10, completed: 8, inProgress: 1 } },
  // AmiLynne Speaks
  { id: 8, businessId: 3, name: "Keynotes", slug: "keynotes", description: "Speaking engagements", icon: "🎭", color: "#E4C473", health: "healthy", revenueTarget: "35000", dimensionScore: 95, tasks: { total: 6, completed: 5, inProgress: 1 } },
  { id: 9, businessId: 3, name: "Workshops", slug: "workshops", description: "Training workshops", icon: "🎪", color: "#D4AF63", health: "healthy", revenueTarget: "28000", dimensionScore: 87, tasks: { total: 14, completed: 11, inProgress: 2 } },
  { id: 10, businessId: 3, name: "Retreats", slug: "retreats", description: "Transformation retreats", icon: "🏕️", color: "#C49F53", health: "at_risk", revenueTarget: "45000", dimensionScore: 55, tasks: { total: 20, completed: 8, inProgress: 5 } },
  // Business in a Bot
  { id: 11, businessId: 4, name: "AI Consulting", slug: "ai-consulting", description: "AI strategy consulting", icon: "💡", color: "#3A4F7A", health: "healthy", revenueTarget: "30000", dimensionScore: 89, tasks: { total: 9, completed: 7, inProgress: 2 } },
  { id: 12, businessId: 4, name: "Bot Development", slug: "bot-development", description: "Custom bot development", icon: "🤖", color: "#1F315B", health: "attention", revenueTarget: "22000", dimensionScore: 74, tasks: { total: 16, completed: 10, inProgress: 4 } },
  // Carroll Media
  { id: 13, businessId: 5, name: "Podcast Production", slug: "podcast", description: "Podcast production services", icon: "🎧", color: "#BDC8B0", health: "healthy", revenueTarget: "10000", dimensionScore: 84, tasks: { total: 11, completed: 9, inProgress: 1 } },
  { id: 14, businessId: 5, name: "Content Creation", slug: "content", description: "Content creation services", icon: "✍️", color: "#ADB8A0", health: "healthy", revenueTarget: "12000", dimensionScore: 79, tasks: { total: 19, completed: 15, inProgress: 3 } },
  { id: 15, businessId: 5, name: "Video Production", slug: "video", description: "Video production services", icon: "🎥", color: "#9DA890", health: "attention", revenueTarget: "15000", dimensionScore: 71, tasks: { total: 13, completed: 8, inProgress: 3 } },
];

// GET /api/segments - Get all segments with their stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    // Check if we have a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      // Return mock data
      let filteredSegments = mockSegments;
      if (businessId) {
        filteredSegments = mockSegments.filter(s => s.businessId === parseInt(businessId));
      }
      
      const enrichedSegments = filteredSegments.map(segment => ({
        ...segment,
        business: mockBusinesses.find(b => b.id === segment.businessId) || null,
      }));

      return NextResponse.json({ segments: enrichedSegments });
    }

    // Build where conditions
    const whereConditions = [eq(segments.active, true)];
    
    if (businessId) {
      whereConditions.push(eq(segments.businessId, parseInt(businessId)));
    }

    // Base query
    const query = db.select({
      segment: segments,
      business: businesses,
    })
    .from(segments)
    .leftJoin(businesses, eq(segments.businessId, businesses.id))
    .where(and(...whereConditions));

    const segmentList = await query.orderBy(segments.sortOrder);

    // Get dimension scores for each segment
    const dimensionScores = await db
      .select({
        segmentId: segmentDimensions.segmentId,
        avgScore: avg(segmentDimensions.score),
      })
      .from(segmentDimensions)
      .groupBy(segmentDimensions.segmentId);

    // Get task counts for each segment
    const taskCounts = await db
      .select({
        segmentId: tasks.segmentId,
        total: count(tasks.id),
        completed: count(sql`CASE WHEN ${tasks.status} = 'done' THEN 1 END`),
        inProgress: count(sql`CASE WHEN ${tasks.status} = 'in_progress' THEN 1 END`),
      })
      .from(tasks)
      .groupBy(tasks.segmentId);

    // Combine data
    const enrichedSegments = segmentList.map(({ segment, business }) => {
      const dimScore = dimensionScores.find((d) => d.segmentId === segment.id);
      const taskStats = taskCounts.find((t) => t.segmentId === segment.id) || {
        total: 0,
        completed: 0,
        inProgress: 0,
      };

      return {
        ...segment,
        business: business ? {
          id: business.id,
          name: business.name,
          icon: business.icon,
          color: business.color,
        } : null,
        dimensionScore: dimScore ? Math.round(Number(dimScore.avgScore)) : 0,
        tasks: {
          total: Number(taskStats.total),
          completed: Number(taskStats.completed),
          inProgress: Number(taskStats.inProgress),
        },
      };
    });

    return NextResponse.json({ segments: enrichedSegments });
  } catch (error) {
    console.error("Error fetching segments:", error);
    // Return mock data on error
    return NextResponse.json({ segments: mockSegments.map(s => ({ ...s, business: mockBusinesses.find(b => b.id === s.businessId) })) });
  }
}

// POST /api/segments - Create new segment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessId,
      name,
      slug,
      description,
      icon,
      color,
      revenueTarget,
    } = body;

    // Check if we have a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      // Return mock success
      const newSegment = {
        id: mockSegments.length + 1,
        businessId,
        name,
        slug,
        description,
        icon,
        color,
        revenueTarget,
        health: "healthy",
        active: true,
        sortOrder: mockSegments.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return NextResponse.json({ segment: newSegment }, { status: 201 });
    }

    const [newSegment] = await db.insert(segments).values({
      businessId,
      name,
      slug,
      description,
      icon,
      color,
      revenueTarget,
    }).returning();

    // Initialize 12 dimension health scores for the new segment
    const dimensionsList = [
      "marketing", "sales", "operations", "finance", "team", "systems",
      "leadership", "vision", "product", "customer_experience", "legal", "sustainability"
    ];

    for (const dimension of dimensionsList) {
      await db.insert(segmentDimensions).values({
        segmentId: newSegment.id,
        dimensionKey: dimension,
        score: 70, // Default starting score
        health: "healthy",
      });
    }

    return NextResponse.json({ segment: newSegment }, { status: 201 });
  } catch (error) {
    console.error("Error creating segment:", error);
    return NextResponse.json(
      { error: "Failed to create segment" },
      { status: 500 }
    );
  }
}
