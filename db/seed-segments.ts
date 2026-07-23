import { db } from "./index";
import { sacredKaleidoscope, businesses, segments, segmentDimensions, tasks } from "./schema";

// Seed data for Sacred Kaleidoscope LLC
async function seedSegments() {
  console.log("🌱 Seeding Sacred Kaleidoscope with segments...");

  // 1. Create Sacred Kaleidoscope LLC
  const [llc] = await db
    .insert(sacredKaleidoscope)
    .values({
      name: "Sacred Kaleidoscope Community LLC",
      description: "Parent company for all Babs' business ventures",
    })
    .onConflictDoNothing()
    .returning();

  console.log("✅ Sacred Kaleidoscope LLC created");

  // 2. Businesses with their color families
  const businessesData = [
    {
      name: "LifeCharter Core",
      slug: "lifecharter-core",
      description: "Core transformation business - LifeCharter program and community",
      icon: "🦋",
      color: "#5E3B6C", // Royal Plum
      sortOrder: 1,
    },
    {
      name: "LifeCharter Command Suite",
      slug: "lifecharter-command-suite",
      description: "Business infrastructure and operating system",
      icon: "⚡",
      color: "#2E7C83", // Sacred Teal
      sortOrder: 2,
    },
    {
      name: "AmiLynne Speaks",
      slug: "amilynne-speaks",
      description: "Speaking and training engagements",
      icon: "🎤",
      color: "#D4AF63", // Warm Gold
      sortOrder: 3,
    },
    {
      name: "Business in a Bot",
      slug: "business-in-a-bot",
      description: "AI consulting and bot development",
      icon: "🤖",
      color: "#1F315B", // Deep Indigo
      sortOrder: 4,
    },
    {
      name: "Carroll Media",
      slug: "carroll-media",
      description: "Media production and content creation",
      icon: "🎬",
      color: "#ADB8A0", // Sage
      sortOrder: 5,
    },
  ];

  for (const business of businessesData) {
    await db.insert(businesses).values(business).onConflictDoNothing();
  }

  console.log("✅ Businesses created");

  // Get business IDs
  const allBusinesses = await db.select().from(businesses);
  const businessMap = new Map(allBusinesses.map((b) => [b.slug, b.id]));

  // 3. Segments for each business (with color variations)
  const segmentsData = [
    // LifeCharter Core segments (Purple family)
    {
      businessId: businessMap.get("lifecharter-core"),
      name: "LifeCharter Incubator",
      slug: "incubator",
      description: "Free 90-minute workshop introducing LifeCharter principles",
      icon: "🥚",
      color: "#7B4F8C", // Lighter plum
      sortOrder: 1,
    },
    {
      businessId: businessMap.get("lifecharter-core"),
      name: "LifeCharter Circle",
      slug: "circle",
      description: "Deep coaching and community container",
      icon: "⭕",
      color: "#5E3B6C", // Royal Plum
      sortOrder: 2,
    },
    {
      businessId: businessMap.get("lifecharter-core"),
      name: "Self-Directed LifeCharter",
      slug: "self-directed",
      description: "Scalable self-paced LifeCharter program",
      icon: "📚",
      color: "#4A2E55", // Darker plum
      sortOrder: 3,
    },
    {
      businessId: businessMap.get("lifecharter-core"),
      name: "Conversations of Consequence",
      slug: "conversations",
      description: "Daily audio/video teaching series",
      icon: "🎙️",
      color: "#8B6B9C", // Muted plum
      sortOrder: 4,
    },

    // Command Suite segments (Teal family)
    {
      businessId: businessMap.get("lifecharter-command-suite"),
      name: "Bot Builder",
      slug: "bot-builder",
      description: "AI bot development and deployment",
      icon: "🤖",
      color: "#3A9CA5", // Lighter teal
      sortOrder: 1,
    },
    {
      businessId: businessMap.get("lifecharter-command-suite"),
      name: "Dashboard Tools",
      slug: "dashboard-tools",
      description: "Executive dashboard and command center tools",
      icon: "📊",
      color: "#2E7C83", // Sacred Teal
      sortOrder: 2,
    },
    {
      businessId: businessMap.get("lifecharter-command-suite"),
      name: "Automation Engine",
      slug: "automation",
      description: "Workflow automation and integrations",
      icon: "⚙️",
      color: "#256A70", // Darker teal
      sortOrder: 3,
    },

    // AmiLynne Speaks segments (Gold family)
    {
      businessId: businessMap.get("amilynne-speaks"),
      name: "Keynotes",
      slug: "keynotes",
      description: "Keynote speaking engagements",
      icon: "🎤",
      color: "#E4C473", // Lighter gold
      sortOrder: 1,
    },
    {
      businessId: businessMap.get("amilynne-speaks"),
      name: "Workshops",
      slug: "workshops",
      description: "Interactive workshop facilitation",
      icon: "👥",
      color: "#D4AF63", // Warm Gold
      sortOrder: 2,
    },
    {
      businessId: businessMap.get("amilynne-speaks"),
      name: "Retreats",
      slug: "retreats",
      description: "Immersive retreat experiences",
      icon: "🏔️",
      color: "#C49F53", // Darker gold
      sortOrder: 3,
    },

    // Business in a Bot segments (Indigo family)
    {
      businessId: businessMap.get("business-in-a-bot"),
      name: "AI Consulting",
      slug: "ai-consulting",
      description: "Strategic AI implementation consulting",
      icon: "🧠",
      color: "#3A4F7A", // Lighter indigo
      sortOrder: 1,
    },
    {
      businessId: businessMap.get("business-in-a-bot"),
      name: "Bot Development",
      slug: "bot-development",
      description: "Custom bot development services",
      icon: "💻",
      color: "#1F315B", // Deep Indigo
      sortOrder: 2,
    },

    // Carroll Media segments (Sage family)
    {
      businessId: businessMap.get("carroll-media"),
      name: "Podcast Production",
      slug: "podcast",
      description: "Audio content and podcast production",
      icon: "🎧",
      color: "#BDC8B0", // Lighter sage
      sortOrder: 1,
    },
    {
      businessId: businessMap.get("carroll-media"),
      name: "Content Creation",
      slug: "content",
      description: "Written and visual content production",
      icon: "✍️",
      color: "#ADB8A0", // Sage
      sortOrder: 2,
    },
    {
      businessId: businessMap.get("carroll-media"),
      name: "Video Production",
      slug: "video",
      description: "Video content and editing services",
      icon: "🎥",
      color: "#9DA890", // Darker sage
      sortOrder: 3,
    },
  ];

  for (const segment of segmentsData) {
    if (segment.businessId) {
      await db.insert(segments).values({
        businessId: segment.businessId,
        name: segment.name,
        slug: segment.slug,
        description: segment.description,
        icon: segment.icon,
        color: segment.color,
        sortOrder: segment.sortOrder,
      }).onConflictDoNothing();
    }
  }

  console.log("✅ Segments created");

  // Get segment IDs
  const allSegments = await db.select().from(segments);
  const segmentMap = new Map(allSegments.map((s) => [s.slug, s.id]));

  // 4. Seed dimension health for each segment
  const dimensionsList = [
    "marketing",
    "sales",
    "operations",
    "finance",
    "team",
    "systems",
    "leadership",
    "vision",
    "product",
    "customer_experience",
    "legal",
    "sustainability",
  ];

  for (const segment of allSegments) {
    for (const dimension of dimensionsList) {
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      let health: "healthy" | "attention" | "at_risk" = "healthy";
      if (score < 60) health = "at_risk";
      else if (score < 80) health = "attention";

      await db
        .insert(segmentDimensions)
        .values({
          segmentId: segment.id,
          dimensionKey: dimension,
          score,
          health,
          notes: `Initial assessment for ${dimension}`,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✅ Segment dimension health scores created");

  // 5. Seed sample tasks with segment assignments
  const sampleTasks = [
    {
      title: "Review LifeCharter Incubator applications",
      businessId: businessMap.get("lifecharter-core"),
      segmentId: segmentMap.get("incubator"),
      dimensionTeam: true,
      dimensionCustomerExperience: true,
    },
    {
      title: "Prepare Circle coaching materials",
      businessId: businessMap.get("lifecharter-core"),
      segmentId: segmentMap.get("circle"),
      dimensionProduct: true,
      dimensionLeadership: true,
    },
    {
      title: "Record Conversations of Consequence episode",
      businessId: businessMap.get("lifecharter-core"),
      segmentId: segmentMap.get("conversations"),
      dimensionMarketing: true,
      dimensionProduct: true,
    },
    {
      title: "Build dashboard card components",
      businessId: businessMap.get("lifecharter-command-suite"),
      segmentId: segmentMap.get("dashboard-tools"),
      dimensionSystems: true,
      dimensionProduct: true,
    },
    {
      title: "Draft keynote for Denver Conference",
      businessId: businessMap.get("amilynne-speaks"),
      segmentId: segmentMap.get("keynotes"),
      dimensionSales: true,
      dimensionMarketing: true,
    },
  ];

  for (const task of sampleTasks) {
    if (task.businessId && task.segmentId) {
      await db.insert(tasks).values(task).onConflictDoNothing();
    }
  }

  console.log("✅ Sample tasks with segment assignments created");
  console.log("\n🎉 Phase 1 seeding complete!");
  console.log(`   - 1 LLC (Sacred Kaleidoscope)`);
  console.log(`   - ${allBusinesses.length} Businesses`);
  console.log(`   - ${allSegments.length} Segments`);
  console.log(`   - ${allSegments.length * 12} Dimension health scores`);
}

seedSegments().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
