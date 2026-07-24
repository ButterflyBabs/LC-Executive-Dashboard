import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, businesses, segments } from "@/db/schema";
import { eq, and, or, desc } from "drizzle-orm";

// GET /api/tasks - Get all tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const businessId = searchParams.get("businessId");
    const segmentId = searchParams.get("segmentId");
    const dimension = searchParams.get("dimension");

    let query = db.select({
      task: tasks,
      business: businesses,
      segment: segments,
    })
    .from(tasks)
    .leftJoin(businesses, eq(tasks.businessId, businesses.id))
    .leftJoin(segments, eq(tasks.segmentId, segments.id));

    // Apply filters
    const conditions = [];
    
    if (status) {
      // @ts-ignore - status enum validation
      conditions.push(eq(tasks.status, status));
    }
    
    if (businessId) {
      conditions.push(eq(tasks.businessId, parseInt(businessId)));
    }

    if (segmentId) {
      conditions.push(eq(tasks.segmentId, parseInt(segmentId)));
    }

    if (dimension) {
      // Map dimension name to column
      const dimensionColumn = `dimension_${dimension}` as keyof typeof tasks;
      // @ts-ignore - dynamic column access
      conditions.push(eq(tasks[dimensionColumn], true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query.orderBy(desc(tasks.createdAt));

    // Format response
    const formattedTasks = results.map(({ task, business, segment }) => ({
      ...task,
      business: business ? {
        id: business.id,
        name: business.name,
        icon: business.icon,
        color: business.color,
      } : null,
      segment: segment ? {
        id: segment.id,
        name: segment.name,
        slug: segment.slug,
        color: segment.color,
        businessId: segment.businessId,
      } : null,
      // Extract dimensions as array
      dimensions: [
        task.dimensionMarketing && "marketing",
        task.dimensionSales && "sales",
        task.dimensionOperations && "operations",
        task.dimensionFinance && "finance",
        task.dimensionTeam && "team",
        task.dimensionSystems && "systems",
        task.dimensionLeadership && "leadership",
        task.dimensionVision && "vision",
        task.dimensionProduct && "product",
        task.dimensionCustomerExperience && "customer_experience",
        task.dimensionLegal && "legal",
        task.dimensionSustainability && "sustainability",
      ].filter(Boolean),
    }));

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      status = "backlog",
      priority = "medium",
      businessId,
      segmentId,
      dimensions = [],
      dueDate,
    } = body;

    // Build dimension flags
    const dimensionFlags = {
      dimensionMarketing: dimensions.includes("marketing"),
      dimensionSales: dimensions.includes("sales"),
      dimensionOperations: dimensions.includes("operations"),
      dimensionFinance: dimensions.includes("finance"),
      dimensionTeam: dimensions.includes("team"),
      dimensionSystems: dimensions.includes("systems"),
      dimensionLeadership: dimensions.includes("leadership"),
      dimensionVision: dimensions.includes("vision"),
      dimensionProduct: dimensions.includes("product"),
      dimensionCustomerExperience: dimensions.includes("customer_experience"),
      dimensionLegal: dimensions.includes("legal"),
      dimensionSustainability: dimensions.includes("sustainability"),
    };

    const [newTask] = await db.insert(tasks).values({
      title,
      description,
      status,
      priority,
      businessId,
      segmentId,
      ...dimensionFlags,
      dueDate: dueDate ? new Date(dueDate) : null,
    }).returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
