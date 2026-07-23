import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dimensionHealth, businesses } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/dimensions - Get all dimension health scores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const dimension = searchParams.get("dimension");

    let query = db.select({
      health: dimensionHealth,
      business: businesses,
    })
    .from(dimensionHealth)
    .leftJoin(businesses, eq(dimensionHealth.businessId, businesses.id));

    // Apply filters
    const conditions = [];
    
    if (businessId) {
      conditions.push(eq(dimensionHealth.businessId, parseInt(businessId)));
    }
    
    if (dimension) {
      conditions.push(eq(dimensionHealth.dimension, dimension));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query.orderBy(desc(dimensionHealth.updatedAt));

    // Format response
    const formattedData = results.map(({ health, business }) => ({
      ...health,
      business: business ? {
        id: business.id,
        name: business.name,
        icon: business.icon,
        color: business.color,
      } : null,
    }));

    return NextResponse.json({ dimensions: formattedData });
  } catch (error) {
    console.error("Error fetching dimension health:", error);
    return NextResponse.json(
      { error: "Failed to fetch dimension health" },
      { status: 500 }
    );
  }
}

// POST /api/dimensions - Create or update dimension health score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dimension,
      businessId,
      score,
      health,
      notes,
    } = body;

    // Check if entry already exists
    const existing = await db
      .select()
      .from(dimensionHealth)
      .where(
        and(
          eq(dimensionHealth.dimension, dimension),
          eq(dimensionHealth.businessId, businessId)
        )
      )
      .limit(1);

    let result;
    if (existing.length > 0) {
      // Update existing
      [result] = await db
        .update(dimensionHealth)
        .set({
          score,
          health,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(dimensionHealth.id, existing[0].id))
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(dimensionHealth)
        .values({
          dimension,
          businessId,
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
