# Task Management App - Next.js Project

## Project Overview
A modern task management application built with Next.js, featuring task creation, editing, filtering, and organization capabilities with a focus on user experience and performance.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 + shadcn/ui components
- **Database**: PostgreSQL with Docker
- **Package Manager**: yarn
- **Linting**: ESLint

## Project Commands

### Development
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn typecheck` - Run TypeScript type checking

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

## GitHub Issues Tracking
The project uses GitHub issues to track features and technical tasks. Update issue status as development progresses.

## Important Reminders
- Always ask before committing changes
- Use defensive security practices
- Follow existing code conventions
- Prefer editing existing files over creating new ones