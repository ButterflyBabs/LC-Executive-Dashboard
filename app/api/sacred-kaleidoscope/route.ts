import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { businesses, tasks, segments, segmentDimensions } from "@/db/schema";
import { eq, and, count, avg, sql } from "drizzle-orm";

// GET /api/sacred-kaleidoscope - Get business portfolio overview
export async function GET(request: NextRequest) {
  try {
    // Get all businesses with their stats
    const allBusinesses = await db.select().from(businesses).where(eq(businesses.active, true));
    
    // Get task counts per business
    const taskCounts = await db
      .select({
        businessId: tasks.businessId,
        total: count(tasks.id),
        completed: count(sql`CASE WHEN ${tasks.status} = 'done' THEN 1 END`),
        inProgress: count(sql`CASE WHEN ${tasks.status} = 'in_progress' THEN 1 END`),
      })
      .from(tasks)
      .groupBy(tasks.businessId);

    // Get average dimension scores per business (aggregated from segments)
    const dimensionScores = await db
      .select({
        businessId: segments.businessId,
        avgScore: avg(segmentDimensions.score),
      })
      .from(segmentDimensions)
      .innerJoin(segments, eq(segmentDimensions.segmentId, segments.id))
      .groupBy(segments.businessId);

    // Combine data
    const portfolioData = allBusinesses.map((business) => {
      const taskStats = taskCounts.find((t) => t.businessId === business.id) || {
        total: 0,
        completed: 0,
        inProgress: 0,
      };
      
      const dimScore = dimensionScores.find((d) => d.businessId === business.id);
      
      return {
        ...business,
        tasks: {
          total: Number(taskStats.total),
          completed: Number(taskStats.completed),
          inProgress: Number(taskStats.inProgress),
        },
        dimensionScore: dimScore ? Math.round(Number(dimScore.avgScore)) : 0,
      };
    });

    return NextResponse.json({ businesses: portfolioData });
  } catch (error) {
    console.error("Error fetching sacred kaleidoscope data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
