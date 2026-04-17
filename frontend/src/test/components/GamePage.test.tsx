import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../test-utils";
import GamePage from "../../pages/GamePage/GamePage";
import { server } from "../server";
import { graphql, HttpResponse } from "msw";
import * as gameWebSocketHook from "../../hooks/useGameWebSocket";
import { mockHandlers } from "../handlers";
import * as AuthContextModule from "../../context/AuthContext";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "100" }),
    useNavigate: () => mocks.navigate,
  };
});

describe("GamePage", () => {
  const mockHandleMove = vi.fn();
  
  beforeEach(() => {
    mockHandleMove.mockClear();

    server.use(
      graphql.mutation("GameMove", ({ variables }) => {
        mockHandleMove(Number(variables.cell));
        return HttpResponse.json({
          data: {
            gameMove: { success: true, message: "OK" },
          },
        });
      })
    );

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: mockHandlers.mockUser as any,
      isAuthenticated: true,
      setUser: vi.fn(),
      handleLogout: vi.fn(),
    });
  });

  it("shows loading spinner initially or on missing data", () => {
    vi.spyOn(gameWebSocketHook, "useGameWebSocket").mockReturnValue({
      gameData: null,
      countdown: null,
      isGameFinished: false,
      connectionError: null,
    });

    render(<GamePage />);
    expect(screen.getByText(/ładowanie (planszy|sesji)/i)).toBeInTheDocument();
  });

  it("shows error screen on WebSocket connection error", async () => {
    vi.spyOn(gameWebSocketHook, "useGameWebSocket").mockReturnValue({
      gameData: null,
      countdown: null,
      isGameFinished: false,
      connectionError: "Utracono połączenie z serwerem",
    });

    render(<GamePage />);
    expect(await screen.findByText("Utracono połączenie z serwerem")).toBeInTheDocument();
  });

  it("renders correctly with active game data and allows valid move", async () => {
    vi.spyOn(gameWebSocketHook, "useGameWebSocket").mockReturnValue({
      gameData: {
        id: 100,
        board: "---------",
        gameMode: "classic",
        moveCounter: 0,
        player1: mockHandlers.mockUser, 
        player2: mockHandlers.mockOpponent,
        currentTurn: mockHandlers.mockUser,
        winner: null,
      },
      countdown: null,
      isGameFinished: false,
      connectionError: null,
    });

    const user = userEvent.setup();
    render(<GamePage />);

    // Czekanie na koniec ladowania 
    await waitFor(() => {
      expect(screen.queryByText(/ładowanie sesji/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByRole("status")).toBeInTheDocument();
    
    // Gracz O ma ruch
    expect(screen.getAllByText(/Teścik/i).length).toBeGreaterThan(0);

    const cells = screen.getAllByRole("gridcell");
    fireEvent.click(cells[1]);

    await waitFor(() => {
      expect(mockHandleMove).toHaveBeenCalledWith(1);
    });
  });

  it("prevents move if it's not the user's turn", async () => {
    vi.spyOn(gameWebSocketHook, "useGameWebSocket").mockReturnValue({
      gameData: {
        id: 100,
        board: "O--------",
        gameMode: "classic",
        moveCounter: 1,
        player1: mockHandlers.mockUser,
        player2: mockHandlers.mockOpponent,
        currentTurn: mockHandlers.mockOpponent,
        winner: null,
      },
      countdown: null,
      isGameFinished: false,
      connectionError: null,
    });

    const user = userEvent.setup();
    render(<GamePage />);

    expect(await screen.findByRole("status")).toBeInTheDocument();

    const cells = screen.getAllByRole("gridcell");
    fireEvent.click(cells[1]);

    // komponent powinien zablokowac mozliwosc ruchu, walidacja
    expect(mockHandleMove).not.toHaveBeenCalled();
  });
});
