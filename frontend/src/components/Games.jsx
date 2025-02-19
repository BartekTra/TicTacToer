import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { HANDLE_MOVE } from '../graphql/mutations/handleMoveMutation';
import { FETCH_GAMESTATE } from "../graphql/queries/fetchGamestateQuery";

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
        console.log("tutaj: ", data2)
        setGamestate(data2.fetchGamestate);
      }
    }, [data2]);
  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/cable");
    ws.onopen = () => {
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
      console.log("Closed the connection");
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

  if (!gamestate) return <h1> loading ... </h1>;
  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :{error.message}</p>;

  return (
    <div className="games">
      <p>Your GUID: {realuuid}</p>
      {gamestate && (
        <div>
          <h2>Game Details</h2>
          <p>Player 1: {gamestate.player1}</p>
          <p>Player 2: {gamestate.player2}</p>
          <p>Current Turn: {gamestate.currentturn === gamestate.player1guid ? gamestate.player1 : gamestate.player2}</p>
          <h1>
            Winner:{" "}
            {gamestate.winner === gamestate.player1guid
              ? gamestate.player1
              : gamestate.winner === gamestate.player2guid
              ? gamestate.player2
              : null}
          </h1>
          <p>Count: {gamestate.count}</p>
        </div>
      )}
      <h1>Game: {gamestate.count}</h1>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "10px" }}>
          {gamestate.board && gamestate.board.length >= 9
            ? [...Array(9)].map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleMove(e, index)}
                  style={{ width: "100px", height: "100px", fontSize: "24px" }}
                >
                  {gamestate.board[index] != 0 && gamestate.board[index] != 9 ? gamestate.board[index] : ""}
                </button>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default Games;
