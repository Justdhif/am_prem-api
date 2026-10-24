import { pgTable, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  parentId: varchar('parent_id', { length: 50 }),
  name: varchar('name', { length: 100 }).notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const appStats = pgTable('app_stats', {
  id: varchar('id', { length: 50 }).primaryKey(),
  totalPremium: integer('total_premium').default(0).notNull(),
  todayPremium: integer('today_premium').default(0).notNull(),
  lastDate: varchar('last_date', { length: 20 }).notNull(),
});

export const dailyActivationStats = pgTable('daily_activation_stats', {
  date: varchar('date', { length: 20 }).primaryKey(), // YYYY-MM-DD
  count: integer('count').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CommentRecord = typeof comments.$inferSelect;
export type NewCommentRecord = typeof comments.$inferInsert;

export type AppStatsRecord = typeof appStats.$inferSelect;
export type NewAppStatsRecord = typeof appStats.$inferInsert;

export type DailyActivationStatRecord = typeof dailyActivationStats.$inferSelect;
export type NewDailyActivationStatRecord = typeof dailyActivationStats.$inferInsert;
