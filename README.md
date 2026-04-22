# TicTacToer (React + Rails + GraphQL)

TicTacToer to nowoczesna, responsywna i pełnostackowa implementacja klasycznej gry w Kółko i Krzyżyk (Tic-Tac-Toe), urozmaicona o tryb Infinite, system rankingowy Elo oraz rozgrywkę w czasie rzeczywistym.

Projekt składa się z backendu napisanego w **Ruby on Rails** (GraphQL + ActionCable) oraz frontend'u zbudowanego w **React** (TypeScript + Vite + Apollo Client).

## Główne funkcje

- **Rozgrywka Multiplayer w Czasie Rzeczywistym**: Wykorzystanie WebSockets (ActionCable) do natychmiastowej synchronizacji ruchów i stanu gry między graczami.
- **Dwa tryby gry**:
  - *Classic*: Klasyczna gra na standardowych zasadach.
  - *Infinite*: Tryb nieskończony (przy perfekcyjnej grze obu graczy :D) - każdy gracz ma maksymalnie 3 własne symbole na planszy, które zaczynają znikać, gdy postawiony zostaje 4. symbol.
- **System Rankingowy (Elo)**: Przeliczanie punktów ELO graczy po zakończeniu meczu, osobno dla obu trybów gry.
- **Autoryzacja i Uwierzytelnianie**: System kont oparty na `devise_token_auth` (logowanie, rejestracja).
- **Matchmaking (Lobby)**: Automatyczny matchmaking graczy w systemie lub tworzenie nowej gry z pustym drugim slotem.
- **Zarządzanie czasem tury**: Background jobs (`TurnTimeoutJob`, `GameCleanupJob`) zapobiegające blokowaniu gry w przypadku nieaktywności drugiego gracza.
- **GraphQL API**: API udostępniające zasoby za pomocą zapytań `query` oraz `mutation`.

## Technologie

### Frontend
- **React 19**
- **TypeScript**
- **Vite 7**
- **Apollo Client**
- **Tailwind CSS 4**
- **React Router 7**
- **Vitest & React Testing Library**

### Backend
- **Ruby 3.3** & **Ruby on Rails 7.2**
- **GraphQL** (`graphql-ruby`)
- **Devise** / `devise_token_auth`
- **ActionCable / Redis**
- **PostgreSQL**
- **RSpec, FactoryBot, Shoulda-Matchers**

## Uruchomienie lokalnie

### Wymagania wstępne
- **Ruby** (np. 3.3.x)
- **Node.js** (np. 20+) i **npm**
- **Docker** & **Docker Compose** (dla bazy PostgreSQL oraz Redis)

### Krok 1: Kontenery Dockera
Uruchom wymagane usługi zewnętrzne za pomocą `docker-compose.yml`:
```bash
docker-compose up -d
```

### Krok 2: Konfiguracja Backendu
Przejdź do katalogu `backend/`, wykonaj te komendy:
```bash
cd backend
bundle install
rails db:create db:migrate
rails s
```
Główny proces serwera zostanie uruchomiony pod adresem `http://localhost:3000`.

### Krok 3: Konfiguracja Frontendu
Otwórz nową zakładkę w terminalu, przejdź do katalogu `frontend/`,  uruchom następujące komendy:
```bash
cd frontend
npm install
npm run dev
```
Aplikacja wystartuje domyślnie pod adresem `http://localhost:5173`.

---

## Testowanie

### Testy Backendowe
Przejdź do `/backend` i uruchom:
```bash
bundle exec rspec
```

### Testy Frontendowe
Przejdź do `/frontend` i uruchom:
```bash
npm run test
```

## Architektura i podejście do kodu
- **Service Objects i Czysta Architektura**: Główna logika gry (mechanika wygranych, autoryzacja ruchów) została odłączona od klasycznych kontrolerów czy callbacków z bazami danych do dedykowanych serwisów (np. `Games::MakeMove`, `Games::JoinGame`, `Games::Modes::Classic/Infinite`, `Ratings::CalculateElo`). Aplikacja przestrzega zasad SOLID ze skupieniem wokół Single Responsibility Principle.
- **Event-Driven Development**: Skryptowanie bazujące na asynchroniczności (np. subskrypcje Eventów z pomocą `GameSubscriber`, który nasłuchuje na pomyślne mutacje w backendzie bez sprzęgania poszczególnych domen wiedzy pod jednym dachem).
