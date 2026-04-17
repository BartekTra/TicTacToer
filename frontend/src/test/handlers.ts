import { graphql, HttpResponse } from "msw";

const mockUser = {
  __typename: "User",
  id: 1,
  email: "test@example.com",
  name: "Test User",
  nickname: "Teścik",
  classicRating: 1500,
  infiniteRating: 1400,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockOpponent = {
  __typename: "User",
  id: 2,
  email: "opponent@example.com",
  nickname: "Przeciwnik",
  classicRating: 1600,
  infiniteRating: 1500,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const handlers = [
  graphql.query("CurrentUser", () => {
    console.log("CurrentUser mocked executed!");
    return HttpResponse.json({
      data: {
        currentUser: mockUser,
      },
    });
  }),

  graphql.mutation("LogoutUser", () => {
    return HttpResponse.json({
      data: {
        logoutUser: true,
      },
    });
  }),

  graphql.mutation("LoginUser", ({ variables }) => {
    if (variables.email === "test@example.com" && variables.password === "password") {
      return HttpResponse.json({
        data: {
          loginUser: {
            success: true,
            user: mockUser,
            errors: [],
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        loginUser: {
          success: false,
          user: null,
          errors: ["Nieprawidłowe dane logowania"],
        },
      },
    });
  }),

  graphql.mutation("JoinGame", ({ variables }) => {
    if (variables.gameMode === "classic" || variables.gameMode === "infinite") {
      return HttpResponse.json({
        data: {
          joinGame: {
            message: "Dołączono",
            game: {
              id: "100",
              board: "123456789",
              gameMode: variables.gameMode,
              moveCounter: 0,
              player1: mockUser,
              player2: mockOpponent,
              winner: null,
            },
          },
        },
      });
    }

    return HttpResponse.json({
      errors: [{ message: "Nieprawidłowy tryb" }]
    });
  }),
];

export const mockHandlers = {
  mockUser,
  mockOpponent,
};
