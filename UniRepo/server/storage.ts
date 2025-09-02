import { db } from "./db";
import { students, colleges, events, type Student, type College, type Event, type InsertStudent, type InsertCollege, type InsertEvent } from "@shared/schema";
import { eq, like, or, and } from "drizzle-orm";

export interface IStorage {
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRegNumber(regNumber: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined>;

  // College operations
  getCollege(id: number): Promise<College | undefined>;
  getCollegeByCode(code: string): Promise<College | undefined>;
  getCollegeByEmail(email: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;
  updateCollege(id: number, updates: Partial<InsertCollege>): Promise<College | undefined>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getEventsByCollege(collegeId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  searchEvents(query: string): Promise<Event[]>;
}

export class PostgreSQLStorage implements IStorage {
  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id));
    return result[0];
  }

  async getStudentByRegNumber(regNumber: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.regNumber, regNumber));
    return result[0];
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.email, email));
    return result[0];
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(insertStudent).returning();
    return result[0];
  }

  async updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined> {
    const result = await db.update(students).set(updates).where(eq(students.id, id)).returning();
    return result[0];
  }

  // College operations
  async getCollege(id: number): Promise<College | undefined> {
    const result = await db.select().from(colleges).where(eq(colleges.id, id));
    return result[0];
  }

  async getCollegeByCode(code: string): Promise<College | undefined> {
    const result = await db.select().from(colleges).where(eq(colleges.code, code));
    return result[0];
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    const result = await db.select().from(colleges).where(eq(colleges.email, email));
    return result[0];
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const result = await db.insert(colleges).values(insertCollege).returning();
    return result[0];
  }

  async updateCollege(id: number, updates: Partial<InsertCollege>): Promise<College | undefined> {
    const result = await db.update(colleges).set(updates).where(eq(colleges.id, id)).returning();
    return result[0];
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    const result = await db.select().from(events).orderBy(events.startDate);
    return result;
  }

  async getEventsByCollege(collegeId: number): Promise<Event[]> {
    const result = await db.select().from(events).where(eq(events.collegeId, collegeId)).orderBy(events.startDate);
    return result;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  async updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount > 0;
  }

  async searchEvents(query: string): Promise<Event[]> {
    const result = await db.select().from(events).where(
      or(
        like(events.title, `%${query}%`),
        like(events.description, `%${query}%`),
        like(events.type, `%${query}%`),
        like(events.venue, `%${query}%`)
      )
    ).orderBy(events.startDate);
    return result;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  async searchEvents(query: string): Promise<Event[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    const result = await db.select().from(events).where(
      or(
        like(events.title, lowercaseQuery),
        like(events.description, lowercaseQuery),
        like(events.type, lowercaseQuery),
        like(events.venue, lowercaseQuery)
      )
    ).orderBy(events.startDate);
    return result;
  }

  async initializeDemoData(): Promise<void> {
    // Check if demo data already exists
    const existingColleges = await db.select().from(colleges);
    if (existingColleges.length > 0) {
      return; // Demo data already exists
    }

    // Add demo colleges
    const demoColleges = [
      { code: "MIT2024", name: "Massachusetts Institute of Technology", email: "admin@mit.edu", location: "Cambridge, MA", password: "password123" },
      { code: "STAN2024", name: "Stanford University", email: "admin@stanford.edu", location: "Stanford, CA", password: "password123" },
      { code: "HARV2024", name: "Harvard University", email: "admin@harvard.edu", location: "Cambridge, MA", password: "password123" }
    ];

    const insertedColleges = await db.insert(colleges).values(demoColleges).returning();

    // Add demo events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const demoEvents = [
      {
        title: "AI & Machine Learning Workshop",
        description: "Learn the fundamentals of AI and machine learning with hands-on projects. Perfect for beginners and intermediate students.",
        type: "workshop",
        mode: "hybrid",
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: null,
        startTime: "10:00",
        endTime: "15:00",
        venue: "MIT Tech Lab",
        address: "Building 32, MIT Campus, Cambridge, MA",
        registrationLink: "https://mit.edu/register/ai-workshop",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
        videoUrl: null,
        collegeId: insertedColleges[0].id
      },
      {
        title: "Annual Tech Conference 2024",
        description: "Join industry leaders and innovators for cutting-edge presentations on the future of technology.",
        type: "conference",
        mode: "offline",
        startDate: nextWeek.toISOString().split('T')[0],
        endDate: new Date(nextWeek.getTime() + 86400000).toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "17:00",
        venue: "Stanford Memorial Auditorium",
        address: "450 Serra Mall, Stanford, CA 94305",
        registrationLink: "https://stanford.edu/register/tech-conf",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
        videoUrl: null,
        collegeId: insertedColleges[1].id
      },
      {
        title: "Cultural Diversity Symposium",
        description: "Explore global cultures through art, music, and food. A celebration of our diverse campus community.",
        type: "cultural",
        mode: "offline",
        startDate: new Date(today.getTime() + 3 * 86400000).toISOString().split('T')[0],
        endDate: null,
        startTime: "14:00",
        endTime: "20:00",
        venue: "Harvard Yard",
        address: "Harvard University, Cambridge, MA 02138",
        registrationLink: "https://harvard.edu/register/cultural-symposium",
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500",
        videoUrl: null,
        collegeId: insertedColleges[2].id
      },
      {
        title: "Startup Hackathon 2024",
        description: "48-hour coding marathon to build innovative solutions. Win prizes and connect with industry mentors.",
        type: "hackathon",
        mode: "hybrid",
        startDate: new Date(today.getTime() + 5 * 86400000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0],
        startTime: "18:00",
        endTime: "18:00",
        venue: "MIT Innovation Center",
        address: "Building E14, MIT Campus, Cambridge, MA",
        registrationLink: "https://mit.edu/register/hackathon",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
        videoUrl: null,
        collegeId: insertedColleges[0].id
      },
      {
        title: "Career Fair & Networking Event",
        description: "Meet top employers and explore career opportunities across various industries.",
        type: "career",
        mode: "offline",
        startDate: new Date(today.getTime() + 10 * 86400000).toISOString().split('T')[0],
        endDate: null,
        startTime: "10:00",
        endTime: "16:00",
        venue: "Stanford Career Center",
        address: "563 Salvatierra Walk, Stanford, CA 94305",
        registrationLink: "https://stanford.edu/register/career-fair",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500",
        videoUrl: null,
        collegeId: insertedColleges[1].id
      }
    ];

    await db.insert(events).values(demoEvents);
    console.log('Demo data initialized');
  }
}

export const storage = new PostgreSQLStorage();