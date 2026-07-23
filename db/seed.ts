import { db } from "./index";
import { businesses, tasks, dimensionHealth } from "./schema";

// Seed data for businesses
const businessesData = [
  {
    name: "LifeCharter Core",
    slug: "lifecharter-core",
    description: "Core transformation business - LifeCharter program and community",
    icon: "🦋",
    color: "#1a2b4a",
    health: "healthy" as const,
  },
  {
    name: "LifeCharter Command Suite",
    slug: "lifecharter-command-suite",
    description: "Business infrastructure and operating system",
    icon: "⚡",
    color: "#5E3B6C",
    health: "healthy" as const,
  },
  {
    name: "AmiLynne Speaks",
    slug: "amilynne-speaks",
    description: "Speaking and training engagements",
    icon: "🎤",
    color: "#2E7C83",
    health: "healthy" as const,
  },
  {
    name: "Business in a Bot",
    slug: "business-in-a-bot",
    description: "AI consulting and bot development",
    icon: "🤖",
    color: "#c9a227",
    health: "healthy" as const,
  },
  {
    name: "Carroll Media",
    slug: "carroll-media",
    description: "Media production and content creation",
    icon: "🎬",
    color: "#CDBED6",
    health: "healthy" as const,
  },
];

// 12 Business Dimensions
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

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed businesses
  console.log("Seeding businesses...");
  for (const business of businessesData) {
    await db.insert(businesses).values(business).onConflictDoNothing();
  }

  // Seed dimension health scores for each business
  console.log("Seeding dimension health scores...");
  const allBusinesses = await db.select().from(businesses);
  
  for (const business of allBusinesses) {
    for (const dimension of dimensionsList) {
      await db.insert(dimensionHealth).values({
        dimension,
        businessId: business.id,
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        health: "healthy",
      }).onConflictDoNothing();
    }
  }

  // Seed sample tasks
  console.log("Seeding sample tasks...");
  const sampleTasks = [
    {
      title: "Review LifeCharter Circle applications",
      description: "Review and approve new member applications for the Circle",
      status: "today" as const,
      priority: "high" as const,
      businessId: 1,
      dimensionTeam: true,
      dimensionCustomerExperience: true,
    },
    {
      title: "Draft newsletter for Letterman",
      description: "Create weekly newsletter content",
      status: "in_progress" as const,
      priority: "medium" as const,
      businessId: 2,
      dimensionMarketing: true,
      dimensionProduct: true,
    },
    {
      title: "Approve social media posts",
      description: "Review and approve scheduled social content",
      status: "waiting" as const,
      priority: "low" as const,
      businessId: 1,
      dimensionMarketing: true,
    },
    {
      title: "Update financial projections Q3",
      description: "Review and update Q3 financial forecasts",
      status: "backlog" as const,
      priority: "high" as const,
      businessId: 1,
      dimensionFinance: true,
      dimensionVision: true,
    },
    {
      title: "Prepare speaking deck for Denver Conference",
      description: "Create presentation for upcoming speaking engagement",
      status: "in_progress" as const,
      priority: "high" as const,
      businessId: 3,
      dimensionSales: true,
      dimensionMarketing: true,
    },
  ];

  for (const task of sampleTasks) {
    await db.insert(tasks).values(task).onConflictDoNothing();
  }

  console.log("✅ Seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
