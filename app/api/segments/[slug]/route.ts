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
        id: segments.id,
        name: segments.name,
        slug: segments.slug,
        description: segments.description,
        icon: segments.icon,
        color: segments.color,
        health: segments.health,
        revenueTarget: segments.revenueTarget,
        businessId: segments.businessId,
        businessName: businesses.name,
        businessIcon: businesses.icon,
        businessColor: businesses.color,
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

    // Format the response to match what the frontend expects
    const segment = {
      ...result[0],
      business: {
        id: result[0].businessId,
        name: result[0].businessName,
        icon: result[0].businessIcon,
        color: result[0].businessColor,
      }
    };

    return NextResponse.json({ segment });
  } catch (error) {
    console.error("Error fetching segment:", error);
    return NextResponse.json(
      { error: "Failed to fetch segment" },
      { status: 500 }
    );
  }
}
