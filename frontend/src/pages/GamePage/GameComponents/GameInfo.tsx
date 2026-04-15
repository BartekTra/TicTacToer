import { type User } from "../../../types/User";
import { memo } from "react";

interface GameInfoProps {
  countdown: number | null;
  currentTurn: User | null;
  opponent?: User | null;
  winner: User | null;
}

export const GameInfo = memo(function GameInfo({
  countdown,
  currentTurn,
  opponent,
  winner,
}: GameInfoProps) {
  return (
    <div className="flex flex-col items-center space-y-2 mb-4 text-center" role="status" aria-live="polite">
      {countdown !== null && (
        <p className="text-red-500 font-bold text-xl">
          Przekierowanie za: {countdown}
        </p>
      )}
      <p className="text-lg">
        Aktualna tura: <span className="font-bold">{currentTurn?.nickname}</span>
      </p>
      {opponent ? (
        <p className="text-gray-300">Przeciwnik: {opponent.nickname}</p>
      ) : (
        <p>Poczekaj na przeciwnika</p>
      )}
      {winner && (
        <p className="text-green-400 font-bold text-2xl mt-2">
          Wygrał: {winner.nickname}
        </p>
      )}
    </div>
  );
});
