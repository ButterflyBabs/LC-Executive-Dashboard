import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sacredKaleidoscope, businesses, segments, segmentDimensions } from "@/db/schema";

// GET /api/seed - Check if data exists and seed if needed
export async function GET(request: NextRequest) {
  try {
    // Check if businesses exist
    const existingBusinesses = await db.select().from(businesses);
    
    if (existingBusinesses.length > 0) {
      return NextResponse.json({ 
        message: "Data already exists", 
        businesses: existingBusinesses.length,
        seeded: false 
      });
    }

    // Seed Sacred Kaleidoscope LLC
    await db.insert(sacredKaleidoscope).values({
      name: "Sacred Kaleidoscope Community LLC",
      description: "Parent company for all Babs' business ventures",
    });

    // Seed businesses
    const businessesData = [
      { name: "LifeCharter Core", slug: "lifecharter-core", description: "Core transformation business", icon: "🦋", color: "#5E3B6C", sortOrder: 1 },
      { name: "LifeCharter Command Suite", slug: "lifecharter-command-suite", description: "Business infrastructure", icon: "⚡", color: "#2E7C83", sortOrder: 2 },
      { name: "AmiLynne Speaks", slug: "amilynne-speaks", description: "Speaking and training", icon: "🎤", color: "#D4AF63", sortOrder: 3 },
      { name: "Business in a Bot", slug: "business-in-a-bot", description: "AI consulting", icon: "🤖", color: "#1F315B", sortOrder: 4 },
      { name: "Carroll Media", slug: "carroll-media", description: "Media production", icon: "🎬", color: "#ADB8A0", sortOrder: 5 },
    ];

    const insertedBusinesses = await db.insert(businesses).values(businessesData).returning();
    const businessMap = new Map(insertedBusinesses.map(b => [b.slug, b.id]));

    // Seed segments
    const segmentsData = [
      // LifeCharter Core
      { businessId: businessMap.get("lifecharter-core"), name: "LifeCharter Incubator", slug: "incubator", description: "Free workshop", icon: "🥚", color: "#7B4F8C", sortOrder: 1 },
      { businessId: businessMap.get("lifecharter-core"), name: "LifeCharter Circle", slug: "circle", description: "Coaching community", icon: "⭕", color: "#5E3B6C", sortOrder: 2 },
      { businessId: businessMap.get("lifecharter-core"), name: "Self-Directed LifeCharter", slug: "self-directed", description: "Self-paced program", icon: "📚", color: "#4A2E55", sortOrder: 3 },
      { businessId: businessMap.get("lifecharter-core"), name: "Conversations of Consequence", slug: "conversations", description: "Daily content", icon: "🎙️", color: "#8B6B9C", sortOrder: 4 },
      // Command Suite
      { businessId: businessMap.get("lifecharter-command-suite"), name: "Bot Builder", slug: "bot-builder", description: "AI bot builder", icon: "🔧", color: "#3A9CA5", sortOrder: 1 },
      { businessId: businessMap.get("lifecharter-command-suite"), name: "Dashboard", slug: "dashboard", description: "Executive dashboard", icon: "📊", color: "#2E7C83", sortOrder: 2 },
      { businessId: businessMap.get("lifecharter-command-suite"), name: "Automation Engine", slug: "automation", description: "Workflow automation", icon: "⚙️", color: "#256A70", sortOrder: 3 },
      // AmiLynne Speaks
      { businessId: businessMap.get("amilynne-speaks"), name: "Keynotes", slug: "keynotes", description: "Speaking engagements", icon: "🎭", color: "#E4C473", sortOrder: 1 },
      { businessId: businessMap.get("amilynne-speaks"), name: "Workshops", slug: "workshops", description: "Training workshops", icon: "🎪", color: "#D4AF63", sortOrder: 2 },
      { businessId: businessMap.get("amilynne-speaks"), name: "Retreats", slug: "retreats", description: "Transformation retreats", icon: "🏕️", color: "#C49F53", sortOrder: 3 },
      // Business in a Bot
      { businessId: businessMap.get("business-in-a-bot"), name: "AI Consulting", slug: "ai-consulting", description: "AI strategy consulting", icon: "💡", color: "#3A4F7A", sortOrder: 1 },
      { businessId: businessMap.get("business-in-a-bot"), name: "Bot Development", slug: "bot-development", description: "Custom bot development", icon: "🤖", color: "#1F315B", sortOrder: 2 },
      // Carroll Media
      { businessId: businessMap.get("carroll-media"), name: "Podcast Production", slug: "podcast", description: "Podcast production", icon: "🎧", color: "#BDC8B0", sortOrder: 1 },
      { businessId: businessMap.get("carroll-media"), name: "Content Creation", slug: "content", description: "Content creation", icon: "✍️", color: "#ADB8A0", sortOrder: 2 },
      { businessId: businessMap.get("carroll-media"), name: "Video Production", slug: "video", description: "Video production", icon: "🎥", color: "#9DA890", sortOrder: 3 },
    ];

    const insertedSegments = await db.insert(segments).values(segmentsData.filter(s => s.businessId)).returning();

    // Seed dimension scores for each segment
    const dimensionsList = ["marketing", "sales", "operations", "finance", "team", "systems", "leadership", "vision", "product", "customer_experience", "legal", "sustainability"];
    
    for (const segment of insertedSegments) {
      for (const dimension of dimensionsList) {
        await db.insert(segmentDimensions).values({
          segmentId: segment.id,
          dimensionKey: dimension,
          score: 70,
          health: "healthy",
        });
      }
    }

    return NextResponse.json({ 
      message: "Database seeded successfully", 
      businesses: insertedBusinesses.length,
      segments: insertedSegments.length,
      seeded: true 
    });

  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
