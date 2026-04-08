import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { HANDLE_MOVE } from "../../graphql/mutations/games/handleMove";
import { GameBoard } from "./GameComponents/GameBoard";
import { useGameWebSocket } from "../../hooks/useGameWebSocket";
import { PlayerInfo } from "./GameComponents/PlayerInfo";
import PlayerTimerWrapper from "./GameComponents/PlayerTimerWrapper";
import { GameInfo } from "./GameComponents/GameInfo";

const GamePage: React.FC = () => {
  const { id: gameId } = useParams<{ id: string }>();

  const { gameData, gameBoard, currentTurn, winner, countdown } =
    useGameWebSocket(gameId);

  const [handleMoveMutation] = useMutation(HANDLE_MOVE, {
    fetchPolicy: "network-only",
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    console.log(gameData, gameBoard, currentTurn, winner, countdown);
    console.log(gameData?.player1?.classicRating)
  }, [gameData, gameBoard, currentTurn, winner, countdown]);

  const handleMove = async (cellIndex: number) => {
    try {
      await handleMoveMutation({ variables: { cell: cellIndex } });
    } catch (err) {
      console.error("Błąd przy wysyłaniu ruchu:", err);
    }
  };

  if (!gameBoard || !gameData)
    return (
      <div className="h-screen w-screen flex justify-center items-center text-white bg-mybg">
        <h1>Ładowanie planszy ...</h1>
      </div>
    );

  return (
    <div className="bg-gray-900 h-full w-screen flex flex-row justify-center items-center text-white">
      <div className="flex flex-col items-center">
        <GameInfo
          countdown={countdown}
          currentTurn={currentTurn}
          opponentId={gameData?.player2}
          winner={winner}
        />
        <div className="flex h-full w-full items-center justify-center gap-2">
          {/* gracz O */}
          <div className="self-start">
            <PlayerTimerWrapper
              isActive={
                currentTurn?.id === gameData.player1?.id &&
                gameData.player2 !== null &&
                gameData.winner === null
              }
              duration={15}
            >
              <PlayerInfo 
                nickname={gameData.player1?.nickname ? gameData.player1.nickname : "Nie ma gracza"} 
                symbol="O" 
                rating={gameData.game_mode === "classic" ? gameData.player1?.classicRating : gameData.player1?.infiniteRating}
              />
            </PlayerTimerWrapper>
          </div>

          <GameBoard boardString={gameBoard} onMove={handleMove} />
          {/* gracz X */}
          <div className="self-end">
            <PlayerTimerWrapper
              isActive={
                currentTurn?.id === gameData.player2?.id &&
                gameData.player1 !== null &&
                gameData.winner === null
              }
              duration={15}
            >
              <PlayerInfo 
                nickname={gameData.player2?.nickname ? gameData.player2.nickname : "Gracz nie ma nazwy?"} 
                symbol="X" 
                rating={gameData.game_mode === "classic" ? gameData.player2?.classicRating : gameData.player2?.infiniteRating}
              />
            </PlayerTimerWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
