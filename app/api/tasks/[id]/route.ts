import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const {
      title,
      description,
      status,
      priority,
      businessId,
      dimensions,
      dueDate,
    } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (businessId !== undefined) updateData.businessId = businessId;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    // Handle dimension updates
    if (dimensions) {
      updateData.dimensionMarketing = dimensions.includes("marketing");
      updateData.dimensionSales = dimensions.includes("sales");
      updateData.dimensionOperations = dimensions.includes("operations");
      updateData.dimensionFinance = dimensions.includes("finance");
      updateData.dimensionTeam = dimensions.includes("team");
      updateData.dimensionSystems = dimensions.includes("systems");
      updateData.dimensionLeadership = dimensions.includes("leadership");
      updateData.dimensionVision = dimensions.includes("vision");
      updateData.dimensionProduct = dimensions.includes("product");
      updateData.dimensionCustomerExperience = dimensions.includes("customer_experience");
      updateData.dimensionLegal = dimensions.includes("legal");
      updateData.dimensionSustainability = dimensions.includes("sustainability");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (!deletedTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
