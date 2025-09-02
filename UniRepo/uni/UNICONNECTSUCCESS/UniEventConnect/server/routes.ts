import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertCollegeSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student routes
  app.post("/api/students/register", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      
      // Check if student already exists
      const existingByRegNumber = await storage.getStudentByRegNumber(studentData.regNumber);
      const existingByEmail = await storage.getStudentByEmail(studentData.email);
      
      if (existingByRegNumber) {
        return res.status(400).json({ message: "Registration number already exists" });
      }
      
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const student = await storage.createStudent(studentData);
      const { password, ...studentWithoutPassword } = student;
      res.json(studentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  app.post("/api/students/login", async (req, res) => {
    try {
      const { regNumber, password } = req.body;
      
      const student = await storage.getStudentByRegNumber(regNumber);
      if (!student || student.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...studentWithoutPassword } = student;
      res.json(studentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const { password, ...studentWithoutPassword } = student;
      res.json(studentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid student ID" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const student = await storage.updateStudent(id, updates);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const { password, ...studentWithoutPassword } = student;
      res.json(studentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  // College routes
  app.post("/api/colleges/register", async (req, res) => {
    try {
      const collegeData = insertCollegeSchema.parse(req.body);
      
      // Check if college already exists
      const existingByCode = await storage.getCollegeByCode(collegeData.code);
      const existingByEmail = await storage.getCollegeByEmail(collegeData.email);
      
      if (existingByCode) {
        return res.status(400).json({ message: "University code already exists" });
      }
      
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const college = await storage.createCollege(collegeData);
      const { password, ...collegeWithoutPassword } = college;
      res.json(collegeWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid college data" });
    }
  });

  app.post("/api/colleges/login", async (req, res) => {
    try {
      const { code, password } = req.body;
      
      const college = await storage.getCollegeByCode(code);
      if (!college || college.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...collegeWithoutPassword } = college;
      res.json(collegeWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const college = await storage.getCollege(id);
      
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      
      const { password, ...collegeWithoutPassword } = college;
      res.json(collegeWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid college ID" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { search, type, mode, location } = req.query;
      
      let events;
      if (search) {
        events = await storage.searchEvents(search as string);
      } else {
        events = await storage.getEvents();
      }
      
      // Apply filters
      if (type) {
        events = events.filter(event => event.type === type);
      }
      
      if (mode) {
        events = events.filter(event => event.mode === mode);
      }
      
      if (location) {
        events = events.filter(event => 
          event.venue.toLowerCase().includes((location as string).toLowerCase()) ||
          (event.address && event.address.toLowerCase().includes((location as string).toLowerCase()))
        );
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event ID" });
    }
  });

  app.get("/api/colleges/:id/events", async (req, res) => {
    try {
      const collegeId = parseInt(req.params.id);
      const events = await storage.getEventsByCollege(collegeId);
      res.json(events);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch college events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const event = await storage.updateEvent(id, updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Delete failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
