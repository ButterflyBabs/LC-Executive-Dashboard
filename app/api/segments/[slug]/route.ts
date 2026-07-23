import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { segments, businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/segments/[slug] - Get segment details
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const result = await db
      .select({
        segment: segments,
        business: businesses,
      })
      .from(segments)
      .leftJoin(businesses, eq(segments.businessId, businesses.id))
      .where(eq(segments.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Segment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ segment: result[0] });
  } catch (error) {
    console.error("Error fetching segment:", error);
    return NextResponse.json(
      { error: "Failed to fetch segment" },
      { status: 500 }
    );
  }
}
