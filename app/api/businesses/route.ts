import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

// Mock data for when database is not available
const mockBusinesses = [
  { id: 1, name: "LifeCharter Core", slug: "lifecharter-core", description: "Core transformation business", icon: "🦋", color: "#5E3B6C", health: "healthy", sortOrder: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "LifeCharter Command Suite", slug: "lifecharter-command-suite", description: "Business infrastructure", icon: "⚡", color: "#2E7C83", health: "healthy", sortOrder: 2, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "AmiLynne Speaks", slug: "amilynne-speaks", description: "Speaking and training", icon: "🎤", color: "#D4AF63", health: "healthy", sortOrder: 3, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Business in a Bot", slug: "business-in-a-bot", description: "AI consulting", icon: "🤖", color: "#1F315B", health: "healthy", sortOrder: 4, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Carroll Media", slug: "carroll-media", description: "Media production", icon: "🎬", color: "#ADB8A0", health: "healthy", sortOrder: 5, active: true, createdAt: new Date(), updatedAt: new Date() },
];

// GET /api/businesses - Get all businesses
export async function GET(request: NextRequest) {
  try {
    // Check if we have a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      return NextResponse.json({ businesses: mockBusinesses });
    }

    const allBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.active, true))
      .orderBy(businesses.name);

    return NextResponse.json({ businesses: allBusinesses });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    // Return mock data on error
    return NextResponse.json({ businesses: mockBusinesses });
  }
}

// POST /api/businesses - Create new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon, color, description } = body;

    // Check if we have a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      // Return mock success
      const newBusiness = {
        id: mockBusinesses.length + 1,
        name,
        slug,
        icon,
        color,
        description,
        health: "healthy",
        active: true,
        sortOrder: mockBusinesses.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockBusinesses.push(newBusiness);
      return NextResponse.json({ business: newBusiness }, { status: 201 });
    }

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
