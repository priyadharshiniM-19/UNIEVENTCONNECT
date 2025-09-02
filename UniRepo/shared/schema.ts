import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  regNumber: text("reg_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  collegeName: text("college_name").notNull(),
  location: text("location").notNull(),
  password: text("password").notNull(),
});

export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  location: text("location").notNull(),
  password: text("password").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  mode: text("mode").notNull(), // online/offline/hybrid
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  venue: text("venue").notNull(),
  address: text("address"),
  registrationLink: text("registration_link").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  collegeId: integer("college_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof colleges.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
