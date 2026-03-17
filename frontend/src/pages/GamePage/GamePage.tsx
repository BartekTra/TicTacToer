import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client/react";
import { HANDLE_MOVE } from "../../graphql/mutations/games/handleMove";
import { useAppSelector } from "../../app/hooks";
import { GameBoard } from "./GameComponents/GameBoard";
import { GameInfo } from "./GameComponents/GameInfo";
import { useGameWebSocket } from "../../hooks/useGameWebSocket";

const GamePage: React.FC = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.counter.value);

  const { gameData, gameBoard, currentTurn, winner, countdown } =
    useGameWebSocket(gameId);

  const [handleMoveMutation] = useMutation(HANDLE_MOVE, {
    fetchPolicy: "network-only",
    onError: ((err) => console.log(err))
  });

  useEffect(() => {
    console.log(gameData, gameBoard, currentTurn, winner, countdown);
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
        <h1>Ładowanie planszy...</h1>
      </div>
    );

  return (
    <div className="bg-gray-900 h-screen w-screen flex flex-row justify-center items-center text-white">
      <div className="flex flex-col items-center">
        <GameInfo
          countdown={countdown}
          currentTurn={currentTurn}
          opponentId={gameData.player2 ? gameData.player2 : null}
          winner={winner}
        />
        <GameBoard boardString={gameBoard} onMove={handleMove} />
      </div>
    </div>
  );
};

export default GamePage;
