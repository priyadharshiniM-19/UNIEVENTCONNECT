# UniConnect Event Management Platform

## Overview

UniConnect is a full-stack web application that bridges the gap between universities and students by providing a centralized platform for event discovery and management. The platform allows colleges to create and manage events while enabling students to discover and register for events across multiple institutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API design
- **Development**: Hot module replacement via Vite integration

## Key Components

### Database Schema (shared/schema.ts)
- **Students Table**: User authentication and profile information
- **Colleges Table**: Institution authentication and details
- **Events Table**: Event information with college relationships
- **Validation**: Zod schemas for runtime type checking

### Authentication System
- Simple credential-based authentication (username/password)
- Separate login flows for students and colleges
- Client-side session management via localStorage
- No JWT or session middleware (simplified approach)

### Storage Layer (server/storage.ts)
- **Interface**: IStorage defining data operations
- **Implementation**: MemStorage (in-memory storage for development)
- **Operations**: CRUD operations for students, colleges, and events
- **Design Pattern**: Repository pattern for data abstraction

### API Routes (server/routes.ts)
- **Student Routes**: Registration, login, profile management
- **College Routes**: Registration, login, event management
- **Event Routes**: CRUD operations, search functionality
- **Error Handling**: Centralized error handling middleware

## Data Flow

1. **User Registration/Login**: 
   - Form submission → API validation → Database storage → Client state update
   
2. **Event Discovery (Students)**:
   - Dashboard load → API request → Database query → Event list display
   - Search/filter → Query parameters → Filtered results
   
3. **Event Management (Colleges)**:
   - Event creation → Form validation → API submission → Database storage
   - Event editing → Pre-populated forms → Update API → Database update

4. **Client-Server Communication**:
   - React Query manages API calls and caching
   - RESTful endpoints with JSON payloads
   - Error handling via toast notifications

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: CSS class management

### Data and State Management
- **Drizzle ORM**: Type-safe database operations
- **TanStack React Query**: Server state management
- **Zod**: Runtime schema validation
- **React Hook Form**: Form state management

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **Database**: Neon serverless PostgreSQL
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite build → Static assets in `dist/public`
- **Backend**: ESBuild bundle → `dist/index.js`
- **Serving**: Express serves both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Build Commands**: 
  - `npm run dev`: Development server
  - `npm run build`: Production build
  - `npm run start`: Production server

### Recent Changes (January 22, 2025)

1. **Professional Design Upgrade**: Updated color scheme to purple/green gradient, improved welcome page design
2. **Enhanced Event Categories**: Added professional event types (workshop, conference, symposium, cultural, seminar, competition, hackathon, sports, social, career)
3. **Demo Data Integration**: Added sample colleges (MIT, Stanford, Harvard) and realistic events with proper scheduling
4. **College Event Browsing**: Added new route for colleges to browse all events like students do
5. **Query Optimization**: Fixed URL encoding issues in student dashboard event queries
6. **Advanced Filtering**: Improved search and filter functionality with better user experience

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client, server, and shared code
2. **TypeScript Throughout**: Full-stack type safety
3. **Simplified Authentication**: localStorage-based sessions for rapid development
4. **In-Memory Storage**: Development-friendly storage with interface for easy migration, includes demo data
5. **Component-Based UI**: Reusable Shadcn/ui components for consistency with professional styling
6. **API-First Design**: RESTful API that can support future mobile clients
7. **Dual Portal Design**: Separate but consistent experiences for students and colleges