import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segmentDimensions, segments, businesses } from "@/db/schema";
import { eq, and, desc, avg } from "drizzle-orm";

// GET /api/dimensions - Get all dimension health scores (aggregated by business)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const dimension = searchParams.get("dimension");

    // Aggregate segment dimensions to business level
    let query = db.select({
      dimensionKey: segmentDimensions.dimensionKey,
      businessId: segments.businessId,
      avgScore: avg(segmentDimensions.score),
      business: businesses,
    })
    .from(segmentDimensions)
    .innerJoin(segments, eq(segmentDimensions.segmentId, segments.id))
    .leftJoin(businesses, eq(segments.businessId, businesses.id));

    // Apply filters
    const conditions = [];
    
    if (businessId) {
      conditions.push(eq(segments.businessId, parseInt(businessId)));
    }
    
    if (dimension) {
      conditions.push(eq(segmentDimensions.dimensionKey, dimension));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query
      .groupBy(segmentDimensions.dimensionKey, segments.businessId, businesses.id)
      .orderBy(desc(segmentDimensions.updatedAt));

    // Format response
    const formattedData = results.map((row) => {
      const score = Math.round(Number(row.avgScore) || 0);
      let health: "healthy" | "attention" | "at_risk" = "healthy";
      if (score < 60) health = "at_risk";
      else if (score < 80) health = "attention";

      return {
        dimension: row.dimensionKey,
        businessId: row.businessId,
        score,
        health,
        business: row.business ? {
          id: row.business.id,
          name: row.business.name,
          icon: row.business.icon,
          color: row.business.color,
        } : null,
      };
    });

    return NextResponse.json({ dimensions: formattedData });
  } catch (error) {
    console.error("Error fetching dimension health:", error);
    return NextResponse.json(
      { error: "Failed to fetch dimension health" },
      { status: 500 }
    );
  }
}

// POST /api/dimensions - Create or update dimension health score at segment level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dimension,
      segmentId,
      score,
      health,
      notes,
    } = body;

    // Check if entry already exists
    const existing = await db
      .select()
      .from(segmentDimensions)
      .where(
        and(
          eq(segmentDimensions.dimensionKey, dimension),
          eq(segmentDimensions.segmentId, segmentId)
        )
      )
      .limit(1);

    let result;
    if (existing.length > 0) {
      // Update existing
      [result] = await db
        .update(segmentDimensions)
        .set({
          score,
          health,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(segmentDimensions.id, existing[0].id))
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(segmentDimensions)
        .values({
          dimensionKey: dimension,
          segmentId,
          score,
          health,
          notes,
        })
        .returning();
    }

    return NextResponse.json({ dimension: result }, { status: 201 });
  } catch (error) {
    console.error("Error saving dimension health:", error);
    return NextResponse.json(
      { error: "Failed to save dimension health" },
      { status: 500 }
    );
  }
}
