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
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Wystąpił błąd podczas dołączania do gry.";
      alert(message);
    }
  };

  return { handleJoin, loading, error };
}
