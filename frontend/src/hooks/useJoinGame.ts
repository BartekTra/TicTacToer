import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { JOIN_GAME } from "../graphql/mutations/games/joinGame";
import { useState, useCallback } from "react";

export type GameMode = "classic" | "infinite";

type JoinGameResponseType = {
  joinGame: {
    message: string;
    game: {
      id: string | number;
    };
  };
};

export function useJoinGame() {
  const navigate = useNavigate();
  const [joinGameMutation, { loading }] =
    useMutation<JoinGameResponseType>(JOIN_GAME);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = useCallback(
    async (gameMode: GameMode) => {
      setError(null);
      try {
        const response = await joinGameMutation({
          variables: { gameMode },
        });

        if (response.data?.joinGame?.game?.id) {
          navigate(`/game/${response.data.joinGame.game.id}`);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas dołączania do gry.";
        setError(message);
      }
    },
    [joinGameMutation, navigate],
  );

  const clearError = useCallback(() => setError(null), []);

  return { handleJoin, loading, error, clearError };
}
