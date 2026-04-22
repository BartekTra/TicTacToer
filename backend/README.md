# TicTacToer — Backend (Ruby on Rails API)

Real-time multiplayer Tic-Tac-Toe game with two game modes, ELO rating system, and WebSocket communication.

## Tech Stack

- **Ruby** 3.3.10
- **Rails** 7.2 (API mode)
- **PostgreSQL** — primary database
- **Redis** — ActionCable adapter (WebSockets)
- **GraphQL** — API layer (`graphql-ruby`)
- **ActionCable** — real-time game updates
- **Devise Token Auth** — cookie-based authentication

## Prerequisites

- Ruby 3.3.10 (recommend using `rbenv` or `asdf`)
- PostgreSQL 14+
- Redis 7+
- Bundler (`gem install bundler`)

## Setup

```bash
# Install dependencies
bundle install

# Setup database
bin/rails db:create db:migrate

# (Optional) Seed data
bin/rails db:seed
```

## Configuration

Credentials are managed via `rails credentials:edit`. Required keys:

```yaml
cors:
  origins_allowed: "http://localhost:5173"
```

## Running

```bash
# Start the server (default: http://localhost:3000)
bin/rails server

# Redis must be running for ActionCable
redis-server
```

## Testing

```bash
# Run full test suite
bundle exec rspec

# Run specific spec
bundle exec rspec spec/services/games/modes/classic_spec.rb
```

## API

### GraphQL Endpoint
`POST /graphql`

### WebSocket
`ws://localhost:3000/cable`

### Key Mutations
| Mutation | Description |
|----------|-------------|
| `loginUser` | Authenticate and receive auth cookie |
| `registerUser` | Create new account |
| `logoutUser` | Clear session |
| `joinGame` | Join or create a game (classic/infinite) |
| `gameMove` | Make a move in active game |

### Key Queries
| Query | Description |
|-------|-------------|
| `currentUser` | Get authenticated user |
| `fetchGamestate` | Get active game state |

## Architecture

```
app/
├── channels/          # ActionCable channels (GamesChannel)
├── controllers/       # GraphQL controller
├── graphql/
│   ├── mutations/     # GraphQL mutations (auth, game)
│   ├── queries/       # GraphQL queries
│   └── types/         # GraphQL types
├── models/            # ActiveRecord models (Game, User)
├── services/
│   ├── games/         # Game logic (MakeMove, JoinGame, Modes)
│   └── ratings/       # ELO calculation
├── subscribers/       # Event subscribers (ActiveSupport::Notifications)
└── jobs/              # Background jobs (cleanup, timeout)
```
