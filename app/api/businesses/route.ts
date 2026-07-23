import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/businesses - Get all businesses
export async function GET(request: NextRequest) {
  try {
    const allBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.active, true))
      .orderBy(businesses.name);

    return NextResponse.json({ businesses: allBusinesses });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

// POST /api/businesses - Create new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon, color, description } = body;

    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name,
        slug,
        icon,
        color,
        description,
      })
      .returning();

    return NextResponse.json({ business: newBusiness }, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
