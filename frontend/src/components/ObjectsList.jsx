import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import "./ObjectsList.css";
import { isRequiredArgument } from "graphql";
import XsymbolImage from "../assets/X_symbol_tictactoer.png";


function ObjectsList() {
  const [buttons, setButtons] = useState([]);
  const [games, setGames] = useState([]);
  const [player, setPlayer] = useState("");
  const navigate = useNavigate();
  const [realuuid, setRealuuid] = useState("");
  useEffect(() => {

    const fetchButtons = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_BUTTONS_URL);
      const json = await response.json();
      setButtons(json);
    }

    fetchButtons();

  }, []);

  useEffect(() => {
    const FetchGames = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_GAMES_URL);
      const json = await response.json();
      setGames(json);
    }

    FetchGames();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_GRAPHQL_URL, {
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
    <div class="bg-[#0d0d0d] h-full">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="flex flex-row items-center justify-center h-screen w-1/3 border-x-1 border-white">
            <form onSubmit={handleSubmit} class="flex flex-col w-full">
              <input
                class="border-y-1 text-white p-[5px] h-15
                hover:bg-[#202020]
                focus:bg-[#2D2D2D] focus:outline-none
                "
                type="text"
                value={player}
                onChange={(event) => setPlayer(event.target.value)}
                placeholder="Enter player name"
              />
              <button type="submit" class="outline-1 outline-white 
              text-white font-bold bg-[#141414] h-15 
              hover:bg-[#202020] 
              active:bg-[#2D2D2D] ">
                Join or Create Game
              </button>
              <img
                src={XsymbolImage}
              />
            </form>
          </div>
        </div>
    </div>


    
  )
}

export default ObjectsList