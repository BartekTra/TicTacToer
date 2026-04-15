import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { HANDLE_MOVE } from "../../graphql/mutations/games/handleMove";
import { GameBoard } from "./GameComponents/GameBoard";
import { useGameWebSocket } from "../../hooks/useGameWebSocket";
import { PlayerInfo } from "./GameComponents/PlayerInfo";
import PlayerTimerWrapper from "./GameComponents/PlayerTimerWrapper";
import { GameInfo } from "./GameComponents/GameInfo";
import { Spinner } from "../../components/Spinner";

const GamePage = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { gameData, countdown, isGameFinished } = useGameWebSocket(gameId);

  const [handleMoveMutation] = useMutation(HANDLE_MOVE);

  useEffect(() => {
    if (isGameFinished) {
      navigate("/");
    }
  }, [isGameFinished, navigate]);

  const handleMove = useCallback(
    async (cellIndex: number) => {
      await handleMoveMutation({ variables: { cell: cellIndex } });
    },
    [handleMoveMutation],
  );

  const gameBoard = gameData?.board ?? null;
  const currentTurn = gameData?.currentTurn ?? null;
  const winner = gameData?.winner ?? null;

  if (!gameBoard || !gameData) {
    return <Spinner text="Ładowanie planszy..." fullScreen />;
  }

  return (
    <div className="bg-gray-900 h-full w-screen flex flex-row justify-center items-center text-white">
      <div className="flex flex-col items-center">
        <GameInfo
          countdown={countdown}
          currentTurn={currentTurn}
          opponent={gameData.player2}
          winner={winner}
        />
        <div className="flex h-full w-full items-center justify-center gap-2">
          {/* Gracz O */}
          <div className="self-start">
            <PlayerTimerWrapper
              isActive={
                currentTurn?.id === gameData.player1?.id &&
                gameData.player2 !== null &&
                winner === null
              }
              duration={15}
            >
              <PlayerInfo
                nickname={gameData.player1?.nickname ?? "Oczekiwanie..."}
                symbol="O"
                rating={
                  gameData.game_mode === "classic"
                    ? gameData.player1?.classicRating
                    : gameData.player1?.infiniteRating
                }
              />
            </PlayerTimerWrapper>
          </div>

          <GameBoard boardString={gameBoard} onMove={handleMove} />

          {/* Gracz X */}
          <div className="self-end">
            <PlayerTimerWrapper
              isActive={
                currentTurn?.id === gameData.player2?.id &&
                gameData.player1 !== null &&
                winner === null
              }
              duration={15}
            >
              <PlayerInfo
                nickname={gameData.player2?.nickname ?? "Oczekiwanie..."}
                symbol="X"
                rating={
                  gameData.game_mode === "classic"
                    ? gameData.player2?.classicRating
                    : gameData.player2?.infiniteRating
                }
              />
            </PlayerTimerWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
