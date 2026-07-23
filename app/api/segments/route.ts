import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segments, businesses, segmentDimensions, tasks } from "@/db/schema";
import { eq, and, count, avg, sql } from "drizzle-orm";

// GET /api/segments - Get all segments with their stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    // Base query
    let query = db.select({
      segment: segments,
      business: businesses,
    })
    .from(segments)
    .leftJoin(businesses, eq(segments.businessId, businesses.id))
    .where(eq(segments.active, true));

    // Filter by business if provided
    if (businessId) {
      query = query.where(eq(segments.businessId, parseInt(businessId))) as typeof query;
    }

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
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
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
