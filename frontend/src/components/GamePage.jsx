import { useUser } from "../context/UserContext";
import { useEffect, useState, useRef } from "react";
import { FETCH_GAMESTATE } from "../graphql/queries/fetchGamestateQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { HANDLE_MOVE } from "../graphql/mutations/handleMoveMutation";
import { createConsumer } from "@rails/actioncable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../src/store/authSlice";

function GamePage() {
  const [gameData, setGameData] = useState();
  const [gameBoard, setGameBoard] = useState();
  const { id: gameId } = useParams();
  const [winner, setWinner] = useState(null);
  const [currentTurnEmail, setCurrentTurnEmail] = useState("");
  const [fetchGamestate] = useLazyQuery(FETCH_GAMESTATE, {
    fetchPolicy: "network-only",
  });
  const [handleMoveMutation] = useMutation(HANDLE_MOVE, {
    fetchPolicy: "network-only",
  });
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const cableRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;

    const cable = createConsumer("ws://localhost:3000/cable");
    cableRef.current = cable;

    const subscription = cable.subscriptions.create(
      { channel: "GamesChannel", id: gameId },
      {
        connected() {
          console.log("Połączono z GamesChannel");
        },
        disconnected() {
          console.log("Rozłączono z GamesChannel");
        },
        received(data) {
          console.log("Odebrano dane z kanału:", data);
          console.log("NWM", gameBoard);
          if (data.action === "please :)") {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);

            setCountdown(3);

            timerRef.current = setTimeout(() => {
              if (subscriptionRef.current) {
                cableRef.current.subscriptions.remove(subscriptionRef.current);
              }
              navigate("/");
            }, 3000);

            intervalRef.current = setInterval(() => {
              setCountdown((current) => {
                if (current <= 1) {
                  clearInterval(interval);
                  return 0;
                }
                return current - 1;
              });
            }, 1000);
          } else {
            if (data.board) {
              setGameData(data);
              setGameBoard(data.board);
              setCurrentTurnEmail(data.currentturn.email);
            }
            if (data.winner) {
              setWinner(data.winner);
            }
          }
        },
      },
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        cable.subscriptions.remove(subscriptionRef.current);
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameId, fetchGamestate]);

  const handleMove = async (cellIndex) => {
    try {
      await handleMoveMutation({ variables: { cell: cellIndex, id: gameId } });
    } catch (err) {
      console.error("Błąd przy wysyłaniu ruchu:", err);
    }
  };

  if (!gameBoard) return <h1>Ładowanie...</h1>;
  if (!user) return <p>Ładowanie</p>;
  return (
    <div className="bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white">
      <div className="flex flex-col items-center space-y-2">
        {countdown !== null && <p>{countdown}</p>}

        <p>Aktualna tura: {currentTurnEmail}</p>
        <p>Przeciwnik: {gameData.player2_id}</p>

        {winner !== null && <p>WYGRANY: {winner.id}</p>}

        <div className="grid grid-cols-3 gap-2">
          {gameBoard.split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleMove(index)}
              className="w-24 h-24 bg-gray-800 rounded text-4xl"
            >
              {char === "O" || char === "X" ? char : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
