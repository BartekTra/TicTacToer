import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import "./ObjectsList.css";
function ObjectsList() {
  const [buttons, setButtons] = useState([]);
  const [games, setGames] = useState([]);
  const [player, setPlayer] = useState("");
  const navigate = useNavigate();
  const [realuuid, setRealuuid] = useState("");
  useEffect(() => {

    const fetchButtons = async () => {
      const response = await fetch("http://localhost:3000/buttons");
      const json = await response.json();
      setButtons(json);
    }

    fetchButtons();

  }, []);

  useEffect(() => {
    const FetchGames = async () => {
      const response = await fetch("http://localhost:3000/games");
      const json = await response.json();
      setGames(json);
    }

    FetchGames();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: `query JoinOrCreateGame {
                                          joinOrCreateGame(player: "${player}", realuuid: "${realuuid}")
                                          {
                                            currentturn
                                            id
                                            player1
                                            player2
                                            board
                                            winner
                                            player1guid
                                            player2guid
                                            
                                          }
                                        }`
         }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (!json.data || !json.data.joinOrCreateGame || !json.data.joinOrCreateGame.id) {
          throw new Error('Invalid response structure');
        }
        console.log("to ten zbujnik", json.data.joinOrCreateGame);
        navigate(`/games/${json.data.joinOrCreateGame.id}`);
      } else {
        throw new Error('Failed to join or create game');
      }

      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getOrSetBrowserUUID = async () => {
      let browserUUID = document.cookie.replace(/(?:(?:^|.*;\s*)browserUUID\s*\=\s*([^;]*).*$)|^.*$/
        , "$1");

      if (!browserUUID) {
        browserUUID = uuidv4();
        document.cookie = `browserUUID=${browserUUID}; path=/;`;
      }

      return browserUUID;
    }

    const setUUID = async () => {
      const uuid = await getOrSetBrowserUUID();
      setRealuuid(uuid);
    }

    setUUID();
  }, [])

  if (!buttons) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="joinInput"
          type="text"
          value={player}
          onChange={(event) => setPlayer(event.target.value)}
          placeholder="Enter player name"
        />
        <button className="joinButton" type="submit">
          Join or Create Game
        </button>
      </form>
        
    </div>

    
  )
}

export default ObjectsList