import { memo } from "react";

interface PlayerInfoProps {
  nickname: string;
  symbol: string;
  rating?: number | null;
}

export const PlayerInfo = memo(function PlayerInfo({ nickname, symbol, rating }: PlayerInfoProps) {
  return (
    <div className="flex flex-col items-center text-center w-50 h-25">
      <p>
        {nickname} {rating != null ? `(${rating})` : ""}
      </p>
      <p>Gracz: {symbol}</p>
    </div>
  );
});
