import { useEffect, useRef, useState, useCallback } from "react";
import {
  createConsumer,
  type Consumer,
  type Subscription,
} from "@rails/actioncable";
import { type GameData } from "../types/GameData";

interface UseGameWebSocketReturn {
  gameData: GameData | null;
  countdown: number | null;
  isGameFinished: boolean;
}

export const useGameWebSocket = (
  gameId: string | undefined,
): UseGameWebSocketReturn => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const cableRef = useRef<Consumer | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!gameId) return;

    const cableUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL as string;
    const cable = createConsumer(cableUrl);
    cableRef.current = cable;

    const subscription = cable.subscriptions.create(
      { channel: "GamesChannel", id: gameId },
      {
        received(data: GameData) {
          if (data.action === "Game Finished") {
            clearTimers();

            setGameData(data);
            setCountdown(3);

            timerRef.current = setTimeout(() => {
              if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
              }
              setIsGameFinished(true);
            }, 3000);

            intervalRef.current = setInterval(() => {
              setCountdown((current) => {
                if (current === null || current <= 1) {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  return 0;
                }
                return current - 1;
              });
            }, 1000);
          } else if (data.board) {
            setGameData(data);
          }
        },
      },
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      clearTimers();
    };
  }, [gameId, clearTimers]);

  return { gameData, countdown, isGameFinished };
};
