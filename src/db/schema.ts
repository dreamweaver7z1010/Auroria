import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table (maps Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Google Tasks cache / local task sync table
export const taskItems = pgTable('task_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  googleTaskId: text('google_task_id'),
  tasklistId: text('tasklist_id').default('@default'),
  title: text('title').notNull(),
  notes: text('notes'),
  status: text('status').default('needsAction'), // 'needsAction' | 'completed'
  dueDate: text('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User study metadata and persistent state sync
export const userStudyData = pgTable('user_study_data', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  configJson: text('config_json'),
  testAnalyticsJson: text('test_analytics_json'),
  mistakeVaultJson: text('mistake_vault_json'),
  focusSessionsJson: text('focus_sessions_json'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  tasks: many(taskItems),
  studyData: one(userStudyData, {
    fields: [users.id],
    references: [userStudyData.userId],
  }),
}));

export const taskItemsRelations = relations(taskItems, ({ one }) => ({
  user: one(users, {
    fields: [taskItems.userId],
    references: [users.id],
  }),
}));

export const userStudyDataRelations = relations(userStudyData, ({ one }) => ({
  user: one(users, {
    fields: [userStudyData.userId],
    references: [users.id],
  }),
}));
