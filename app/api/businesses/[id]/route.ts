import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

// PATCH /api/businesses/[id] - Update business
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const [updatedBusiness] = await db
      .update(businesses)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, parseInt(id)))
      .returning();

    if (!updatedBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ business: updatedBusiness });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}
