import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { HANDLE_MOVE } from '../graphql/mutations/handleMoveMutation';
import { FETCH_GAMESTATE } from "../graphql/queries/fetchGamestateQuery";
import XsymbolImage from "../assets/X_symbol_tictactoer.png";
import OsymbolImage from "../assets/O_symbol_tictactoer.png";
function Games() {
  const { id } = useParams();
  const [guid, setGuid] = useState("");
  const [realuuid, setRealuuid] = useState("");
  const [gamestate, setGamestate] = useState([]);
  const { data: data2, loading, error } = useQuery(FETCH_GAMESTATE, {
    variables: { id: id },
  });
  const [handleMoveQuery] = useMutation(HANDLE_MOVE); // Hook useMutation musi być zawsze wywołany w tej samej kolejności
  
    useEffect(() => {
      
      if (data2) {
        console.log("tutaj test: ", data2)
        setGamestate(data2.fetchGamestate);
      }
    }, [data2]);
  

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_BACKEND_WS_URL);
    ws.onopen = () => {
      console.log("Connected to GamesChannel_" + id)
      setGuid(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
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

    ws.onclose = () => {
      console.log("Closed the connection by react");
      ws.close();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== "welcome" && data.type !== "ping" && data.type !== "confirm_subscription") {
        setGamestate(data.message);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            command: "unsubscribe",
            identifier: JSON.stringify({
              id: `${id}`,
              channel: "GamesChannel",
            }),
          })
        );
      }
    };
  }, [id, gamestate]);

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
              : "No winner yet"}
          </h1>
          <p className="text-gray-300">Count: {gamestate.count}</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mt-5">Game: {gamestate.count}</h1>
      <div className="mt-5">
        
        <div className="grid grid-cols-3 w-80 h-80 mx-auto">
          {gamestate.board.split("").map((cell, index) => (
            <div key={index} className="w-full h-full flex justify-center items-center border">
              <div
                key={index}
                className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition"
                onClick={(e) => cell !== "X" && cell !== "O" && handleMove(e, index)}
              />
              {cell === "X" && <img src={XsymbolImage} alt="X" className="w-16 h-16" />}
              {cell === "O" && <img src={OsymbolImage} alt="O" className="w-16 h-16" />}
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Games;
