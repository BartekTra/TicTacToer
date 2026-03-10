export interface GameData {
  board?: string;
  currentturn?: Player;
  player2_id?: string | number;
  winner?: Player | null;
  action?: string;
}