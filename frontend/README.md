# TicTacToer — Frontend (React + TypeScript)

Real-time multiplayer Tic-Tac-Toe frontend built with React, TypeScript, Apollo Client, and ActionCable.

## Tech Stack

- **React** 19 + **TypeScript** 5.9
- **Vite** 7 — build tool
- **Apollo Client** 4 — GraphQL client
- **ActionCable** — WebSocket for real-time game updates
- **Tailwind CSS** 4 — styling
- **Vitest** + **Testing Library** — testing

## Prerequisites

- Node.js 20+
- npm 10+
- Backend server running at `http://localhost:3000`

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `http://localhost:3000/graphql` | GraphQL endpoint |
| `VITE_BACKEND_WEBSOCKET_URL` | `ws://localhost:3000/cable` | WebSocket endpoint |

## Running

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# Linting
npm run lint
```

## Architecture

```
src/
├── components/        # Shared UI components (Button, InputField, Spinner)
├── context/           # React Context (AuthContext)
├── graphql/
│   ├── mutations/     # GraphQL mutation definitions
│   └── queries/       # GraphQL query definitions
├── hooks/             # Custom hooks (useGameWebSocket, useJoinGame)
├── pages/
│   ├── Auth/          # Login & Register pages
│   ├── GamePage/      # Game board and components
│   ├── LandingPage/   # Home / join game
│   ├── MainLayout/    # App shell with navbar
│   └── NavBar/        # Navigation
├── test/              # Test setup and specs
├── types/             # TypeScript interfaces
├── apolloClient.ts    # Apollo Client configuration
├── cableConsumer.ts   # ActionCable singleton
└── router.tsx         # React Router configuration
```

## Key Features

- **Two game modes**: Classic (standard 3x3) and Infinite (oldest moves disappear after 6 turns)
- **Real-time updates**: WebSocket-driven game state synchronization
- **ELO Rating**: Skill-based matchmaking ratings per game mode
- **Cookie-based auth**: Secure HttpOnly cookie authentication
