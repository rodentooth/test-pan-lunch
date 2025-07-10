# Task Management App - Next.js Project

## Project Overview
A modern task management application built with Next.js, featuring task creation, editing, deletion, filtering, and organization capabilities with comprehensive E2E testing.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 + shadcn/ui components
- **Database**: PostgreSQL with Docker
- **Package Manager**: yarn
- **Testing**: Playwright for E2E testing

## Essential Commands

### Development
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn typecheck` - Run TypeScript type checking

### Testing
- `yarn test:e2e` - Run E2E tests headlessly
- `yarn test:e2e:headed` - Run E2E tests with browser visible

### Database
- `docker-compose up -d` - Start PostgreSQL database
- `docker-compose down` - Stop PostgreSQL database

## Project Architecture
- TypeScript for type safety
- App Router for modern routing patterns
- Using Tailwind CSS for styling
- Using shadcn/ui for consistent UI components
- Using ESLint for code quality
- Server actions for CRUD operations
- Component-based architecture with reusable UI elements
- PostgreSQL with Docker for data persistence

## Features
- ✅ **Task CRUD Operations** - Create, read, update, delete tasks
- ✅ **Task Properties** - Title, description, priority, category, completion status
- ✅ **Task Filtering** - Filter by status (All/Active/Completed)
- ✅ **Form Validation** - Client-side validation with error handling
- ✅ **E2E Testing** - Comprehensive test coverage

## Development Guidelines
- Always ask before committing changes
- Track progress using GitHub issues
- Use yarn as package manager
- Follow Next.js App Router patterns
- Implement server actions for data operations
- Ensure responsive design
- Focus on performance and fast loading

## Testing
Playwright E2E testing with comprehensive coverage:
- Task CRUD operations with validation
- UI interactions and form handling  
- Filter functionality and state management
- Sequential test execution to avoid conflicts

### Issue Management Guidelines
When marking issues as complete, follow this consistent format:

1. **Add completion comment** with clear status:
   ```
   ## ✅ COMPLETED
   
   **[Issue Title] - [Status]**
   
   [Description of what was completed with checkboxes:]
   - ✅ Feature/requirement 1
   - ✅ Feature/requirement 2
   - ✅ Feature/requirement 3
   
   **Status: [COMPLETE/FOUNDATION COMPLETE/PARTIALLY COMPLETE]** - [Next steps if any]
   ```

2. **Close the issue** using `gh issue close [number]`

3. **Update related issues** if completion affects other tasks

4. **Consistent status markers:**
   - ✅ COMPLETED - Fully implemented and tested
   - 🚧 IN PROGRESS - Currently being worked on  
   - ⏸️ BLOCKED - Waiting for dependencies
   - 📋 PLANNED - Scheduled for future implementation

## Important Reminders
- Always ask before committing changes
- Follow Next.js App Router patterns
- Use server actions for data operations
- Prefer editing existing files over creating new ones
- Focus on performance and responsive design
