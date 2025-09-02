
-- UniEventConnect Database Setup
-- Run this SQL file in your PostgreSQL database

-- Create the database (optional - you might already have one)
-- CREATE DATABASE unieventconnect;

-- Connect to your database and run the following:

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  reg_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  college_name TEXT NOT NULL,
  location TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  mode TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  start_time TEXT NOT NULL,
  end_time TEXT,
  venue TEXT NOT NULL,
  address TEXT,
  registration_link TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  college_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo colleges
INSERT INTO colleges (code, name, email, location, password) VALUES
('MIT', 'Massachusetts Institute of Technology', 'admin@mit.edu', 'Cambridge, MA', '$2b$10$hashedpassword1'),
('STAN', 'Stanford University', 'admin@stanford.edu', 'Stanford, CA', '$2b$10$hashedpassword2'),
('HARV', 'Harvard University', 'admin@harvard.edu', 'Cambridge, MA', '$2b$10$hashedpassword3')
ON CONFLICT (code) DO NOTHING;

-- Insert demo events (you can modify these as needed)
INSERT INTO events (title, description, type, mode, start_date, end_date, start_time, end_time, venue, address, registration_link, image_url, college_id) VALUES
('Tech Innovation Summit', 'Annual technology conference showcasing cutting-edge innovations', 'Conference', 'offline', '2024-03-15', '2024-03-17', '09:00', '17:00', 'MIT Main Auditorium', '77 Massachusetts Avenue, Cambridge, MA', 'https://mit.edu/register/tech-summit', 'https://via.placeholder.com/400x200', 1),
('AI Research Symposium', 'Latest developments in artificial intelligence research', 'Symposium', 'hybrid', '2024-04-20', '2024-04-21', '10:00', '16:00', 'Stanford Memorial Auditorium', '450 Serra Mall, Stanford, CA', 'https://stanford.edu/register/ai-symposium', 'https://via.placeholder.com/400x200', 2),
('Medical Breakthroughs Conference', 'Exploring revolutionary advances in medical science', 'Conference', 'offline', '2024-05-10', '2024-05-12', '08:30', '18:00', 'Harvard Medical School', '25 Shattuck Street, Boston, MA', 'https://harvard.edu/register/medical-conference', 'https://via.placeholder.com/400x200', 3)
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- Verify the setup
SELECT 'Colleges count: ' || COUNT(*) FROM colleges;
SELECT 'Events count: ' || COUNT(*) FROM events;
SELECT 'Students count: ' || COUNT(*) FROM students;
