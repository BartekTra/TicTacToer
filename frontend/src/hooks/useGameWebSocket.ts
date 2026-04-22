import { useEffect, useRef, useState, useCallback } from "react";
import { type Subscription } from "@rails/actioncable";
import { type GameData } from "../types/GameData";
import { consumer } from "../cableConsumer";

interface UseGameWebSocketReturn {
  gameData: GameData | null;
  countdown: number | null;
  isGameFinished: boolean;
  connectionError: string | null;
}

export const useGameWebSocket = (
  gameId: string | undefined,
): UseGameWebSocketReturn => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const subscriptionRef = useRef<Subscription | null>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!gameId) return;

    setConnectionError(null);

    const subscription = consumer.subscriptions.create(
      { channel: "GamesChannel", id: gameId },
      {
        connected() {
          setConnectionError(null);
        },

        disconnected() {
          setConnectionError("Utracono połączenie z serwerem");
        },

        rejected() {
          setConnectionError("Brak dostępu do tej gry");
        },

        received(data: GameData) {
          if (data.action === "Game Finished") {
            clearTimers();
            setGameData(data);
            setCountdown(3);

            timerRef.current = window.setTimeout(() => {
              if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
              }
              setIsGameFinished(true);
            }, 3000);

            intervalRef.current = window.setInterval(() => {
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
        subscriptionRef.current = null;
      }
      clearTimers();
    };
  }, [gameId, clearTimers]);

  return { gameData, countdown, isGameFinished, connectionError };
};
