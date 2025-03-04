import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { HANDLE_MOVE } from '../graphql/mutations/handleMoveMutation';
import { FETCH_GAMESTATE } from "../graphql/queries/fetchGamestateQuery";
import XsymbolImage from "../assets/X_symbol_tictactoer.png";
import OsymbolImage from "../assets/O_symbol_tictactoer.png";
import { useRef } from "react";
function Games() {
  const { id } = useParams();
  const [guid, setGuid] = useState("");
  const [realuuid, setRealuuid] = useState("");
  const [gamestate, setGamestate] = useState([]);
  const [handleMoveQuery] = useMutation(HANDLE_MOVE); // Hook useMutation musi być zawsze wywołany w tej samej kolejności
  const wsRef = useRef(null);
  const { data: data2, loading, error } = useQuery(FETCH_GAMESTATE, {
    variables: { id: id },
  });


  useEffect(() => {
    
    if (data2) {
      console.log("tutaj test: ", data2)
      setGamestate(data2.fetchGamestate);
    }
  }, [data2]);
  

  useEffect(() => {
    // Jeśli WebSocket już istnieje, zamknij go przed otwarciem nowego
    if (wsRef.current) {
      console.warn("Closing old WebSocket before creating a new one...");
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(import.meta.env.VITE_BACKEND_WS_URL);
    const ws = wsRef.current;
    
    console.log("Creating new WebSocket...");

    ws.onopen = () => {
      console.log("Connected to GamesChannel_" + id);
      ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: `${id}`,
            channel: "GamesChannel",
          }),
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ping") {
        console.log("Ping received");
      } else if (data.type !== "welcome" && data.type !== "confirm_subscription") {
        console.log("Game update:", data.message);
        setGamestate(data.message);
      }
      console.log(data);
    };

    // Cleanup: Zamknij WebSocket po opuszczeniu strony
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket before unmounting...");
        wsRef.current.close();
      }
    };
  }, [id]); // Uruchamia się tylko, gdy zmienia się `id`

  // Funkcja do obsługi ruchu gracza
  const handleMove = async (event, cell) => {
    event.preventDefault();
    if (gamestate.winner === gamestate.player1guid) {
      alert("Player 1 already won!");
    } else if (gamestate.winner === gamestate.player2guid) {
      alert("Player 2 already won!");
    } else if (gamestate.currentturn === realuuid) {
      // Wywołanie mutacji z wykorzystaniem handleMoveQuery
      await handleMoveQuery({ variables: { cell: cell, id: id } });
    } else {
      alert("It's not your turn");
    }
  };

  // Funkcja pobierająca UUID z ciasteczek przeglądarki
  const getBrowserUUID = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)browserUUID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  };

  useEffect(() => {
    const uuid = getBrowserUUID();
    setRealuuid(uuid);
  }, []);

  if (!gamestate) return <h1> Loading ... </h1>;
  if(!gamestate.board) return <h1> test... </h1>;
  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :{error.message}</p>;

  return (
    <div className="games bg-[#0d0d0d] text-white min-h-screen flex flex-col items-center p-5">
      <p className="text-lg font-semibold">Your GUID: {realuuid}</p>
      {gamestate && (
        <div className="bg-[#202020] p-5 rounded-lg shadow-lg w-full max-w-md mt-5">
          <h2 className="text-xl font-bold mb-3">Game Details</h2>
          <p className="text-gray-300">Player 1: {gamestate.player1}</p>
          <p className="text-gray-300">Player 2: {gamestate.player2}</p>
          <p className="text-gray-300">
            Current Turn: {gamestate.currentturn === gamestate.player1guid ? gamestate.player1 : gamestate.player2}
          </p>
          <h1 className="text-xl font-bold text-white mt-3">
            Winner: {gamestate.winner === gamestate.player1guid
              ? gamestate.player1
              : gamestate.winner === gamestate.player2guid
              ? gamestate.player2
              : gamestate.winner === "draw"
              ? "The game ended with a draw!" 
              : "No winner yet"}
          </h1>
          <p className="text-gray-300">Count: {gamestate.count}</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mt-5">Game: {gamestate.count}</h1>
      <div className="mt-5">
        
        <div className="grid grid-cols-3 w-90 h-90 mx-auto">
          {gamestate.board.split("").map((cell, index) => (
            <div key={index} className="w-30 h-30 flex justify-center items-center border">
              {cell === "X" && <img src={XsymbolImage} className="w-full h-full pointer-events-none" />}
              {cell === "O" && <img src={OsymbolImage} className="w-full h-full pointer-events-none" />}
              <div
                key={index}
                className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition"
                onClick={(e) => cell !== "X" && cell !== "O" && handleMove(e, index)}
              />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Games;
