import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { JOIN_GAME } from "../graphql/mutations/games/joinGame";

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
  const [joinGameMutation, { loading, error }] = useMutation<JoinGameResponseType>(JOIN_GAME);

  const handleJoin = async (gameMode: GameMode) => {
    try {
      const response = await joinGameMutation({
        variables: { gameMode },
      });

      if (response.data?.joinGame?.game?.id) {
        navigate(`/game/${response.data.joinGame.game.id}`);
      } else if (response.data?.joinGame?.message) {
        // Fallback for custom API message handling if no game object was returned
        alert(response.data.joinGame.message);
      }
    } catch (err: any) {
      console.error("Błąd podczas dołączania do gry:", err);
      // Basic fallback since we don't know if a toast library is present
      alert(err.message || "Wystąpił błąd podczas dołączania do gry.");
    }
  };

  return { handleJoin, loading, error };
}
