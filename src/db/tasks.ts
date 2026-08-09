import { db } from './index.ts';
import { taskItems, userStudyData, users } from './schema.ts';
import { eq, and } from 'drizzle-orm';

export interface TaskRecord {
  id?: number;
  userId: number;
  googleTaskId?: string | null;
  tasklistId?: string | null;
  title: string;
  notes?: string | null;
  status?: string | null;
  dueDate?: string | null;
}

export async function getUserTaskItems(userId: number) {
  try {
    return await db.select().from(taskItems).where(eq(taskItems.userId, userId));
  } catch (error) {
    console.error("Failed to query task items from DB:", error);
    throw new Error("Failed to load task items from Cloud SQL", { cause: error });
  }
}

export async function upsertTaskItem(record: TaskRecord) {
  try {
    if (record.googleTaskId) {
      const existing = await db
        .select()
        .from(taskItems)
        .where(
          and(
            eq(taskItems.userId, record.userId),
            eq(taskItems.googleTaskId, record.googleTaskId)
          )
        );

      if (existing.length > 0) {
        const updated = await db
          .update(taskItems)
          .set({
            title: record.title,
            notes: record.notes,
            status: record.status,
            dueDate: record.dueDate,
            updatedAt: new Date(),
          })
          .where(eq(taskItems.id, existing[0].id))
          .returning();
        return updated[0];
      }
    }

    const inserted = await db
      .insert(taskItems)
      .values({
        userId: record.userId,
        googleTaskId: record.googleTaskId || null,
        tasklistId: record.tasklistId || '@default',
        title: record.title,
        notes: record.notes || null,
        status: record.status || 'needsAction',
        dueDate: record.dueDate || null,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error("Failed to upsert task item in DB:", error);
    throw new Error("Failed to save task item in Cloud SQL", { cause: error });
  }
}

export async function deleteTaskItemByGoogleId(userId: number, googleTaskId: string) {
  try {
    return await db
      .delete(taskItems)
      .where(and(eq(taskItems.userId, userId), eq(taskItems.googleTaskId, googleTaskId)))
      .returning();
  } catch (error) {
    console.error("Failed to delete task item in DB:", error);
    throw new Error("Failed to delete task item from Cloud SQL", { cause: error });
  }
}

export async function getUserStudyData(userId: number) {
  try {
    const records = await db
      .select()
      .from(userStudyData)
      .where(eq(userStudyData.userId, userId));
    return records[0] || null;
  } catch (error) {
    console.error("Failed to query user study data from DB:", error);
    throw new Error("Failed to load user study data from Cloud SQL", { cause: error });
  }
}

export async function saveUserStudyData(
  userId: number,
  data: {
    configJson?: string;
    testAnalyticsJson?: string;
    mistakeVaultJson?: string;
    focusSessionsJson?: string;
  }
) {
  try {
    const existing = await getUserStudyData(userId);
    if (existing) {
      const updated = await db
        .update(userStudyData)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userStudyData.userId, userId))
        .returning();
      return updated[0];
    } else {
      const inserted = await db
        .insert(userStudyData)
        .values({
          userId,
          configJson: data.configJson || null,
          testAnalyticsJson: data.testAnalyticsJson || null,
          mistakeVaultJson: data.mistakeVaultJson || null,
          focusSessionsJson: data.focusSessionsJson || null,
        })
        .returning();
      return inserted[0];
    }
  } catch (error) {
    console.error("Failed to save user study data in DB:", error);
    throw new Error("Failed to save user study data in Cloud SQL", { cause: error });
  }
}
