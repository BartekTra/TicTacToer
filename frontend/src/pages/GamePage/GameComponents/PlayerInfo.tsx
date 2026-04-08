import React from "react";

interface PlayerInfo{
  nickname: String;
  symbol: String;
  rating?: number | null;
}

export const PlayerInfo: React.FC<PlayerInfo> = ({nickname, symbol, rating}) =>{
  return (
    <div className="flex flex-col items-center text-center w-50 h-25 ">
      <p> {nickname} {rating != null ? `(${rating})` : ""} </p>
      <p> Jest graczem: {symbol} </p>
    </div>
  );
};
