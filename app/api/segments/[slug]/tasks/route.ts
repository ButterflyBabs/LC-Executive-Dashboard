import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, segments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/segments/[slug]/tasks - Get tasks for a segment
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

    // Get tasks
    const taskList = await db
      .select()
      .from(tasks)
      .where(eq(tasks.segmentId, segmentId))
      .orderBy(tasks.createdAt);

    return NextResponse.json({ tasks: taskList });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/segments/[slug]/tasks - Create task for segment
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

    const [newTask] = await db
      .insert(tasks)
      .values({
        ...body,
        segmentId,
      })
      .returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
