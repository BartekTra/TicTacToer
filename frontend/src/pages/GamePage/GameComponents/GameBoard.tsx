import { memo, useMemo } from "react";
import { GameCell } from "./GameCell";

interface GameBoardProps {
  boardString: string;
  onMove: (index: number) => void;
}

export const GameBoard = memo(function GameBoard({ boardString, onMove }: GameBoardProps) {
  const cells = useMemo(() => boardString.split(""), [boardString]);

  return (
    <div
      className="grid grid-cols-3 gap-2 border border-gray-600 p-2 rounded-sm w-[320px] h-[320px]"
      role="grid"
      aria-label="Plansza gry"
    >
      {cells.map((char, index) => (
        <GameCell
          key={index}
          index={index}
          cellValue={char}
          onClick={onMove}
        />
      ))}
    </div>
  );
});