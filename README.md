# PennyWise

A full-stack finance tracking application with AI-powered transaction categorization and analytics.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **PostgreSQL** database with **Drizzle ORM**
- **OpenAI API** for AI-powered features
- **JWT** for authentication
- **Zod** for validation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10.15.0 or higher)
- **PostgreSQL** database
- **OpenAI API key** (for AI features)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Pennywise
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
pnpm install
```

**Or install individually:**
```bash
# Install root dependencies
pnpm install

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd backend
pnpm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/financetracker

# Authentication
JWT_ACCESS_SECRET=your-jwt-access-secret-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_APP_SERVER_URL=http://localhost:8080
```

### 4. Database Setup

1. **Create PostgreSQL Database**:
   ```bash
   pnpm docker:db:up
   ```

2. **Run Database Migrations**:
   ```bash
   # From root directory
   pnpm db:generate
   pnpm db:push
   
   # Or from backend directory
   cd backend
   pnpm db:generate
   pnpm db:push
   ```

### 5. Start the Application

#### Development Mode

**Start both frontend and backend simultaneously:**
```bash
# From root directory - starts both servers
pnpm dev
```

**Or start individually:**
```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080