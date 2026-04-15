import { memo } from "react";

interface GameCellProps {
  cellValue: string;
  index: number;
  onClick: (index: number) => void;
}

export const GameCell = memo(function GameCell({ cellValue, index, onClick }: GameCellProps) {
  const displayChar = cellValue === "O" || cellValue === "X" ? cellValue : "";
  const isEmpty = displayChar === "";

  return (
    <button
      onClick={() => onClick(index)}
      className="w-24 h-24 bg-gray-800 rounded text-4xl hover:bg-gray-700 transition-colors"
      aria-label={isEmpty ? `Pole ${index + 1} - puste` : `Pole ${index + 1} - ${displayChar}`}
      disabled={!isEmpty}
      role="gridcell"
    >
      {displayChar}
    </button>
  );
});