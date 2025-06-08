// src/components/GameChannel.js
import { useEffect } from "react";
import cable from "../cable";

const GameChannel = ({ gameId, onUpdate }) => {
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "GamesChannel", id: gameId },
      {

        received(data) {
          console.log("Odebrano update:", data);
          if (onUpdate) {
            onUpdate(data);
          }
        },
        connected() {
          console.log("Połączono z kanałem gry");
        },
        disconnected() {
          console.log("Rozłączono z kanałem gry");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [gameId, onUpdate]);

  return null; // Ten komponent nie renderuje nic
};

export default GameChannel;
