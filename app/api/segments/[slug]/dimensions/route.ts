import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segmentDimensions, segments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/segments/[slug]/dimensions - Get dimension scores for a segment
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First get the segment ID
    const segmentResult = await db
      .select({ id: segments.id })
      .from(segments)
      .where(eq(segments.slug, slug))
      .limit(1);

    if (segmentResult.length === 0) {
      return NextResponse.json(
        { error: "Segment not found" },
        { status: 404 }
      );
    }

    const segmentId = segmentResult[0].id;

    // Get dimension scores
    const dimensions = await db
      .select({
        id: segmentDimensions.id,
        dimension: segmentDimensions.dimensionKey,
        score: segmentDimensions.score,
        health: segmentDimensions.health,
        notes: segmentDimensions.notes,
      })
      .from(segmentDimensions)
      .where(eq(segmentDimensions.segmentId, segmentId));

    return NextResponse.json({ dimensions });
  } catch (error) {
    console.error("Error fetching dimensions:", error);
    return NextResponse.json(
      { error: "Failed to fetch dimensions" },
      { status: 500 }
    );
  }
}

// POST /api/segments/[slug]/dimensions - Update dimension score
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { dimension, score, health, notes } = body;

    // Get segment ID
    const segmentResult = await db
      .select({ id: segments.id })
      .from(segments)
      .where(eq(segments.slug, slug))
      .limit(1);

    if (segmentResult.length === 0) {
      return NextResponse.json(
        { error: "Segment not found" },
        { status: 404 }
      );
    }

    const segmentId = segmentResult[0].id;

    // Check if dimension exists
    const existing = await db
      .select()
      .from(segmentDimensions)
      .where(
        and(
          eq(segmentDimensions.segmentId, segmentId),
          eq(segmentDimensions.dimensionKey, dimension)
        )
      )
      .limit(1);

    let result;
    if (existing.length > 0) {
      // Update
      [result] = await db
        .update(segmentDimensions)
        .set({ score, health, notes, updatedAt: new Date() })
        .where(eq(segmentDimensions.id, existing[0].id))
        .returning();
    } else {
      // Create
      [result] = await db
        .insert(segmentDimensions)
        .values({
          segmentId,
          dimensionKey: dimension,
          score,
          health,
          notes,
        })
        .returning();
    }

    return NextResponse.json({ dimension: result });
  } catch (error) {
    console.error("Error updating dimension:", error);
    return NextResponse.json(
      { error: "Failed to update dimension" },
      { status: 500 }
    );
  }
}
