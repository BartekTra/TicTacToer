import React from "react";
import { GameCell } from "./GameCell";

interface GameBoardProps {
  boardString: string;
  onMove: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ boardString, onMove }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {boardString.split("").map((char, index) => (
        <GameCell 
          key={index} 
          index={index} 
          char={char} 
          onClick={onMove} 
        />
      ))}
    </div>
  );
};