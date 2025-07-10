# Task Management App - Next.js Project

## Project Overview
A modern task management application built with Next.js, featuring task creation, editing, deletion, filtering, and organization capabilities with comprehensive E2E testing and a focus on user experience and performance.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 + shadcn/ui components
- **Database**: PostgreSQL with Docker
- **Package Manager**: yarn
- **Linting**: ESLint
- **Testing**: Playwright for E2E testing

## Project Commands

### Development
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn typecheck` - Run TypeScript type checking

### Testing
- `yarn test:e2e` - Run E2E tests headlessly
- `yarn test:e2e:headed` - Run E2E tests with browser visible
- `yarn test:e2e:ui` - Run E2E tests with Playwright UI

### Database Commands
- `docker-compose up -d` - Start PostgreSQL database
- `docker-compose down` - Stop PostgreSQL database
- `docker-compose logs postgres` - View database logs

### Setup Commands
- `yarn create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- `npx shadcn-ui@latest init` - Initialize shadcn/ui
- `docker-compose up -d` - Start database

## Project Structure
- Using TypeScript for type safety
- Using Tailwind CSS for styling
- Using shadcn/ui for consistent UI components
- Using ESLint for code quality
- Using App Router for modern routing
- Using src/ directory structure
- Using import alias @/* for cleaner imports
- Server actions for CRUD operations
- PostgreSQL with Docker for data persistence
- Comprehensive E2E testing with Playwright
- Component-based architecture with reusable UI elements

## Implemented Features
- ✅ **Task Creation** - Create tasks with title, description, priority, and category
- ✅ **Task Viewing** - Display all tasks in organized list with filtering
- ✅ **Task Completion** - Toggle tasks between complete/incomplete states
- ✅ **Task Editing** - Edit existing tasks with validation
- ✅ **Task Deletion** - Delete tasks with confirmation dialog
- ✅ **Task Filtering** - Filter tasks by status (All/Active/Completed)
- ✅ **E2E Testing** - Comprehensive test coverage for all features

## Environment Setup
1. Install Node.js 22 using nvm: `nvm use` (reads from .nvmrc)
2. Copy `.env.example` to `.env.local` and update values if needed
3. Start PostgreSQL database: `docker-compose up -d`
4. Install dependencies: `yarn install`
5. Start development server: `yarn dev`

## Node.js Version
This project uses Node.js 22. Use nvm to manage the Node.js version:
- `nvm use` - Switch to the project's Node.js version (reads from .nvmrc)
- `nvm install 22` - Install Node.js 22 if not already installed

## Development Guidelines
- Always ask before committing changes
- Track progress using GitHub issues
- Use yarn as package manager
- Follow Next.js App Router patterns
- Implement server actions for data operations
- Ensure responsive design
- Focus on performance and fast loading

## Testing Strategy
The project uses Playwright for comprehensive E2E testing:

### E2E Test Coverage
- **Task Creation**: Adding tasks with validation and form handling
- **Task Editing**: Modifying existing tasks with proper state management
- **Task Deletion**: Removing tasks with confirmation dialogs
- **Task Filtering**: Testing All/Active/Completed filter functionality
- **Task Completion**: Toggling task status and visual feedback
- **Form Validation**: Testing required fields and error handling
- **UI Interactions**: Navigation, button clicks, and form submissions

### Test Files
- `e2e/add-task.spec.ts` - Task creation and form validation
- `e2e/edit-task.spec.ts` - Task editing functionality
- `e2e/delete-task.spec.ts` - Task deletion with confirmation
- `e2e/filter-tasks.spec.ts` - Filtering and state management

### Test Configuration
- Sequential test execution to avoid conflicts
- Automatic dev server startup for testing
- Multi-browser support (Chromium, Firefox, WebKit)
- HTML reporter for detailed test results

## GitHub Issues Tracking
The project uses GitHub issues to track features and technical tasks. Update issue status as development progresses.

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
- Use defensive security practices
- Follow existing code conventions
- Prefer editing existing files over creating new ones