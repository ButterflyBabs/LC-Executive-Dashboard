import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segmentRevenue, segments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/segments/[slug]/revenue - Get revenue data for a segment
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Get revenue data
    const revenueData = await db
      .select({
        id: segmentRevenue.id,
        period: segmentRevenue.periodStart,
        actual: segmentRevenue.revenueActual,
        target: segmentRevenue.revenueTarget,
        expenses: segmentRevenue.expenses,
      })
      .from(segmentRevenue)
      .where(eq(segmentRevenue.segmentId, segmentId))
      .orderBy(desc(segmentRevenue.periodStart));
    
    // Format period as string
    const revenue = revenueData.map(r => ({
      ...r,
      period: r.period ? new Date(r.period).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
      actual: Number(r.actual) || 0,
      target: Number(r.target) || 0,
    }));

    return NextResponse.json({ revenue });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue" },
      { status: 500 }
    );
  }
}

// POST /api/segments/[slug]/revenue - Add revenue data
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

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

    const [newRevenue] = await db
      .insert(segmentRevenue)
      .values({
        ...body,
        segmentId,
      })
      .returning();

    return NextResponse.json({ revenue: newRevenue }, { status: 201 });
  } catch (error) {
    console.error("Error creating revenue entry:", error);
    return NextResponse.json(
      { error: "Failed to create revenue entry" },
      { status: 500 }
    );
  }
}
