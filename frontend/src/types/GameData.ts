import type { User } from "./User";

export interface GameData {
  action?: string;
  id: number;
  board: string;
  player1: User | null;
  player2: User | null;
  winner: User | null;
  gameMode: string;
  currentTurn: User | null;
  moveCounter: number;
}